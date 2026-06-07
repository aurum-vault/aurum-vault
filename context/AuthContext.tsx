"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

const API = process.env.NEXT_PUBLIC_API_URL!;
const STORAGE_KEY = "av_tokens";

interface TokenPayload {
  realm_access?: { roles: string[] };
  preferred_username?: string;
  email?: string;
  exp?: number;
}

interface StoredTokens {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  refresh_expires_in?: number;
}

export interface RegisterData {
  full_name: string;
  mobile: string;
  email: string;
  password: string;
  address?: string;
  tfa?: string;
}

function parseJwt(token: string): TokenPayload {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(base64)) as TokenPayload;
  } catch {
    return {};
  }
}

interface AuthState {
  token: string | null;
  roles: string[];
  username: string;
  email: string;
  initialized: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [initialized, setInitialized] = useState(false);
  const refreshTokenRef = useRef<string | null>(null);

  function applyTokens(stored: StoredTokens) {
    const payload = parseJwt(stored.access_token);
    setToken(stored.access_token);
    setRoles(payload.realm_access?.roles ?? []);
    setUsername(payload.preferred_username ?? "");
    setEmail(payload.email ?? "");
    refreshTokenRef.current = stored.refresh_token;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }

  function clearSession() {
    setToken(null);
    setRoles([]);
    setUsername("");
    setEmail("");
    refreshTokenRef.current = null;
    localStorage.removeItem(STORAGE_KEY);
  }

  async function attemptRefresh(): Promise<boolean> {
    const rt = refreshTokenRef.current;
    if (!rt) return false;
    try {
      const res = await fetch(`${API}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: rt }),
      });
      if (!res.ok) { clearSession(); return false; }
      applyTokens(await res.json() as StoredTokens);
      return true;
    } catch {
      clearSession();
      return false;
    }
  }

  // Hydrate from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { setInitialized(true); return; }
    try {
      const stored = JSON.parse(raw) as StoredTokens;
      const payload = parseJwt(stored.access_token);
      if (payload.exp && payload.exp * 1000 > Date.now() + 30_000) {
        applyTokens(stored);
        setInitialized(true);
      } else {
        refreshTokenRef.current = stored.refresh_token;
        attemptRefresh().finally(() => setInitialized(true));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      setInitialized(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Silent token refresh every 4 minutes
  useEffect(() => {
    const id = setInterval(() => { attemptRefresh(); }, 4 * 60 * 1000);
    return () => clearInterval(id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (user: string, password: string) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? "Invalid credentials");
    }
    applyTokens(await res.json() as StoredTokens);
  };

  const register = async (data: RegisterData) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string };
      throw new Error(err.error ?? "Registration failed");
    }
    applyTokens(await res.json() as StoredTokens);
  };

  const logout = () => {
    const rt = refreshTokenRef.current;
    if (rt) {
      fetch(`${API}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: rt }),
      }).catch(() => {});
    }
    clearSession();
    window.location.replace("/auth");
  };

  return (
    <AuthContext.Provider value={{ token, roles, username, email, initialized, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
