"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type Keycloak from "keycloak-js";
import { getKeycloak } from "@/lib/keycloak";

interface AuthState {
  token: string | null;
  roles: string[];
  username: string;
  email: string;
  keycloakId: string;
  initialized: boolean;
  login: () => void;
  logout: () => void;
  register: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const kcRef = useRef<Keycloak | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [keycloakId, setKeycloakId] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let refreshInterval: ReturnType<typeof setInterval>;

    getKeycloak().then((kc) => {
      kcRef.current = kc;

      kc.init({
        onLoad: "check-sso",
        silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        pkceMethod: "S256",
      }).then((authenticated) => {
        if (authenticated) {
          setToken(kc.token ?? null);
          setRoles(kc.realmAccess?.roles ?? []);
          setUsername((kc.tokenParsed as Record<string, string>)?.preferred_username ?? "");
          setEmail((kc.tokenParsed as Record<string, string>)?.email ?? "");
          setKeycloakId(kc.subject ?? "");
        }
        setInitialized(true);

        // Refresh token before it expires (every 60s, refresh if < 70s left)
        refreshInterval = setInterval(() => {
          kc.updateToken(70).then((refreshed) => {
            if (refreshed) setToken(kc.token ?? null);
          }).catch(() => kc.logout());
        }, 60_000);
      });
    });

    return () => clearInterval(refreshInterval);
  }, []);

  const login    = () => kcRef.current?.login();
  const logout   = () => kcRef.current?.logout({ redirectUri: window.location.origin });
  const register = () => kcRef.current?.register();

  return (
    <AuthContext.Provider value={{ token, roles, username, email, keycloakId, initialized, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}