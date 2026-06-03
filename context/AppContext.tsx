"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { INITIAL_DB } from "@/lib/data";
import type {
  AppDB,
  Asset,
  ServiceTicket,
  Report,
  Staff,
  UserRole,
  ToastMessage,
} from "@/lib/types";

interface AppContextValue {
  db: AppDB;
  setDb: React.Dispatch<React.SetStateAction<AppDB>>;
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
  toasts: ToastMessage[];
  toast: (msg: string, type?: ToastMessage["type"]) => void;
  // Helpers
  assetById: (id: string) => Asset | undefined;
  reportByTicket: (tid: string) => Report | undefined;
  reportByAsset: (aid: string) => Report | undefined;
  staffName: (id: string | null) => string;
  currentAsset: Asset | null;
  setCurrentAsset: (a: Asset | null) => void;
  currentTicket: ServiceTicket | null;
  setCurrentTicket: (t: ServiceTicket | null) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<AppDB>(() =>
    JSON.parse(JSON.stringify(INITIAL_DB))
  );
  const [role, setRole] = useState<UserRole | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentAsset, setCurrentAsset] = useState<Asset | null>(null);
  const [currentTicket, setCurrentTicket] = useState<ServiceTicket | null>(null);
  const toastTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

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
    []
  );

  const assetById = useCallback(
    (id: string) => db.assets.find((a) => a.asset_id === id),
    [db.assets]
  );

  const reportByTicket = useCallback(
    (tid: string) => db.reports.find((r) => r.ticket_id === tid),
    [db.reports]
  );

  const reportByAsset = useCallback(
    (aid: string) => db.reports.find((r) => r.asset_id === aid),
    [db.reports]
  );

  const staffName = useCallback(
    (id: string | null) => {
      const s = db.staff.find((x: Staff) => x.staff_id === id);
      return s ? s.full_name : "Unassigned";
    },
    [db.staff]
  );

  return (
    <AppContext.Provider
      value={{
        db,
        setDb,
        role,
        setRole,
        toasts,
        toast,
        assetById,
        reportByTicket,
        reportByAsset,
        staffName,
        currentAsset,
        setCurrentAsset,
        currentTicket,
        setCurrentTicket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
