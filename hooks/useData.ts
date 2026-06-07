"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import * as api from "@/lib/api";
import type {
  Asset, ServiceTicket, Report, Document, Staff,
  Customer, Transaction, AuditEntry,
} from "@/lib/types";

const EMPTY_CUSTOMER: Customer = {
  customer_id: "", full_name: "", mobile: "", email: "", address: "", tfa: "sms", status: "active",
};

// Generic hook — uses a ref so fetcher changes never cause stale closure issues.
function useFetch<T>(fetcher: (token: string) => Promise<T>, initial: T) {
  const { token } = useAuth();
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const refetch = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    try {
      setData(await fetcherRef.current(token));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void refetch(); }, [refetch]);

  return { data, loading, refetch };
}

// Module-level adapters so useFetch always gets a stable function reference.
async function fetchAdaptedTransactions(token: string): Promise<Transaction[]> {
  const raw = await api.fetchTransactions(token);
  return raw.map((x) => ({
    txn_id: x.id, customer: "", service: x.service_type ?? "",
    asset: x.asset_id ?? "", amount: x.amount,
    date: x.created_at.slice(0, 10), status: x.status,
  }));
}

async function fetchAdaptedAudit(token: string): Promise<AuditEntry[]> {
  const raw = await api.fetchAudit(token);
  return raw.map((x) => ({
    ts: new Date(x.created_at).toLocaleString("en-IN"),
    actor: x.actor, action: x.action,
    entity: x.entity_id ?? "", detail: x.detail ?? "",
  }));
}

async function fetchAdaptedCustomer(token: string): Promise<Customer> {
  const raw = await api.fetchMe(token).catch(() => null);
  if (raw && "id" in raw) return api.adaptCustomer(raw as Parameters<typeof api.adaptCustomer>[0]);
  return EMPTY_CUSTOMER;
}

export function useAssets() {
  const { data: assets, loading, refetch } = useFetch(api.fetchAssets, [] as Asset[]);
  return { assets, loading, refetch };
}

export function useTickets() {
  const { data: tickets, loading, refetch } = useFetch(api.fetchTickets, [] as ServiceTicket[]);
  return { tickets, loading, refetch };
}

export function useReports() {
  const { data: reports, loading, refetch } = useFetch(api.fetchReports, [] as Report[]);
  return { reports, loading, refetch };
}

export function useDocuments() {
  const { data: documents, loading, refetch } = useFetch(api.fetchDocuments, [] as Document[]);
  return { documents, loading, refetch };
}

export function useStaff() {
  const { data: staff, loading, refetch } = useFetch(api.fetchStaff, [] as Staff[]);
  return { staff, loading, refetch };
}

export function useTransactions() {
  const { data: transactions, loading, refetch } = useFetch(fetchAdaptedTransactions, [] as Transaction[]);
  return { transactions, loading, refetch };
}

export function useAudit() {
  const { data: audit, loading, refetch } = useFetch(fetchAdaptedAudit, [] as AuditEntry[]);
  return { audit, loading, refetch };
}

export function useCustomer() {
  const { data: customer, loading, refetch } = useFetch(fetchAdaptedCustomer, EMPTY_CUSTOMER);
  return { customer, loading, refetch };
}

async function fetchAdaptedCustomers(token: string): Promise<Customer[]> {
  const raw = await api.fetchCustomers(token);
  return raw.map((c) => api.adaptCustomer(c));
}

export function useCustomers() {
  const { data: customers, loading, refetch } = useFetch(fetchAdaptedCustomers, [] as Customer[]);
  return { customers, loading, refetch };
}
