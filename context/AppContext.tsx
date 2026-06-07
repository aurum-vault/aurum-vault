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
  AppDB,
  Asset,
  ServiceTicket,
  Report,
  Staff,
  Customer,
  UserRole,
  ToastMessage,
  Rates,
} from "@/lib/types";

const EMPTY_DB: AppDB = {
  customer: { customer_id: "", full_name: "", mobile: "", email: "", address: "", tfa: "sms", status: "active" },
  staff: [],
  assets: [],
  tickets: [],
  reports: [],
  documents: [],
  transactions: [],
  audit: [],
};

interface AppContextValue {
  db: AppDB;
  rates: Rates;
  loading: boolean;
  role: UserRole | null;
  toasts: ToastMessage[];
  toast: (msg: string, type?: ToastMessage["type"]) => void;
  refresh: () => Promise<void>;
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
  const { token, roles, initialized } = useAuth();

  const [db, setDb] = useState<AppDB>(EMPTY_DB);
  const [rates, setRates] = useState<Rates>(RATES);
  const [loading, setLoading] = useState(true);
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

  const loadData = useCallback(async (t: string, r: string[]) => {
    setLoading(true);
    try {
      const isStaff = r.includes("admin") || r.includes("ticket_manager");

      const [rawRates, assets, tickets, reports, documents, rawStaff, rawTxns, rawAudit, meRaw] =
        await Promise.all([
          api.fetchRates(t).catch(() => null),
          api.fetchAssets(t),
          api.fetchTickets(t),
          api.fetchReports(t),
          api.fetchDocuments(t),
          isStaff  ? api.fetchStaff(t)        : Promise.resolve([] as Staff[]),
          isStaff  ? api.fetchTransactions(t) : Promise.resolve([] as import("@/lib/api").RawTransaction[]),
          isStaff  ? api.fetchAudit(t)        : Promise.resolve([] as import("@/lib/api").RawAuditEntry[]),
          !isStaff ? api.fetchMe(t).catch(() => null) : Promise.resolve(null),
        ]);

      if (rawRates) {
        setRates({ gold: rawRates.gold, silver: rawRates.silver, platinum: rawRates.platinum, diamondUSD: rawRates.diamond_usd });
      }

      let customer: Customer = EMPTY_DB.customer;
      let staff: Staff[] = rawStaff;
      let transactions: AppDB["transactions"] = rawTxns.map((x) => ({
        txn_id: x.id, customer: "", service: x.service_type ?? "",
        asset: x.asset_id ?? "", amount: x.amount,
        date: x.created_at.slice(0, 10), status: x.status,
      }));
      let audit: AppDB["audit"] = rawAudit.map((x) => ({
        ts: new Date(x.created_at).toLocaleString("en-IN"),
        actor: x.actor, action: x.action,
        entity: x.entity_id ?? "", detail: x.detail ?? "",
      }));

      if (!isStaff && meRaw && "id" in meRaw) {
        customer = api.adaptCustomer(meRaw as Parameters<typeof api.adaptCustomer>[0]);
      }

      setDb({ customer, staff, assets, tickets, reports, documents, transactions, audit });
    } catch (err) {
      console.error("Failed to load app data", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    if (token) await loadData(token, roles);
  }, [token, roles, loadData]);

  useEffect(() => {
    if (!initialized) return;
    if (!token) { setDb(EMPTY_DB); setLoading(false); return; }
    loadData(token, roles);
  }, [initialized, token, roles, loadData]);

  const assetById    = useCallback((id: string)  => db.assets.find((a) => a.asset_id === id),   [db.assets]);
  const reportByTicket = useCallback((tid: string) => db.reports.find((r) => r.ticket_id === tid), [db.reports]);
  const reportByAsset  = useCallback((aid: string) => db.reports.find((r) => r.asset_id === aid),  [db.reports]);
  const staffName    = useCallback(
    (id: string | null) => db.staff.find((x: Staff) => x.staff_id === id)?.full_name ?? "Unassigned",
    [db.staff],
  );

  return (
    <AppContext.Provider value={{
      db, rates, loading, role, toasts, toast, refresh,
      assetById, reportByTicket, reportByAsset, staffName,
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
