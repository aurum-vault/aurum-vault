"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import * as api from "@/lib/api";
import { RATES } from "@/lib/data";
import type {
  Asset,
  ServiceTicket,
  UserRole,
  ToastMessage,
  Rates,
} from "@/lib/types";

interface AppContextValue {
  rates: Rates;
  role: UserRole | null;
  toasts: ToastMessage[];
  toast: (msg: string, type?: ToastMessage["type"]) => void;
  currentAsset: Asset | null;
  setCurrentAsset: (a: Asset | null) => void;
  currentTicket: ServiceTicket | null;
  setCurrentTicket: (t: ServiceTicket | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { token, roles, initialized } = useAuth();

  const [rates, setRates] = useState<Rates>(RATES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [currentTicket, setCurrentTicket] = useState<ServiceTicket | null>(null);
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const role = useMemo<UserRole | null>(() => {
    if (roles.includes("admin")) return "admin";
    if (roles.includes("ticket_manager")) return "ticket_manager";
    if (roles.includes("customer")) return "customer";
    return null;
  }, [roles]);

  const toast = useCallback(
    (msg: string, type: ToastMessage["type"] = "default") => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, msg, type }]);
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        toastTimers.current.delete(id);
      }, 3200);
      toastTimers.current.set(id, timer);
    },
    [],
  );

  useEffect(() => {
    if (!initialized || !token) return;
    api.fetchRates(token)
      .then((r) => {
        if (r) setRates({ gold: r.gold, silver: r.silver, platinum: r.platinum, diamondUSD: r.diamond_usd });
      })
      .catch(console.error);
  }, [initialized, token]);

  return (
    <AppContext.Provider value={{
      rates, role, toasts, toast,
      currentAsset, setCurrentAsset, currentTicket, setCurrentTicket,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}