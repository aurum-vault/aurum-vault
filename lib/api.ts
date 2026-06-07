import type {
  Asset, ServiceTicket, Report, Document, Customer, Staff,
  AssetStatus, Perspective, LocationType, ServiceType, TicketStatus,
  Priority, DocumentType, DocumentStatus, ReportStatus,
} from "./types";

const API = process.env.NEXT_PUBLIC_API_URL!;

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

async function request<T>(
  method: string,
  path: string,
  token: string,
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    const e = new Error((err as { error?: string }).error ?? res.statusText) as Error & { status: number };
    e.status = res.status;
    throw e;
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const get  = <T>(path: string, token: string) => request<T>("GET",    path, token);
const post = <T>(path: string, token: string, body: unknown) => request<T>("POST",   path, token, body);
const put  = <T>(path: string, token: string, body: unknown) => request<T>("PUT",    path, token, body);
const del  = <T>(path: string, token: string) => request<T>("DELETE",  path, token);
const patch = <T>(path: string, token: string, body: unknown) => request<T>("PATCH", path, token, body);

// ─── Raw API shapes (what the backend actually returns) ───────────────────────

interface RawAsset {
  id: string; asset_ref: string; customer_id: string;
  name: string; category: string; perspective: string;
  metal: string; purity: string; huid: string | null;
  gross: number; deduction: number; net: number;
  purchase_price: number; purchase_date: string | null;
  purchased_from: string | null; invoice_ref: string | null;
  provenance: string | null; occasion: string | null; gifted_by: string | null;
  location_type: string | null; location_detail: Record<string, string>;
  last_verified: string | null; status: string;
  images: string[]; appraised_value: number | null;
  created_at: string; updated_at: string;
}

interface RawTicket {
  id: string; ticket_ref: string; customer_id: string; asset_id: string;
  service_type: string; status: string; priority: string;
  assigned_to: string | null; customer_notes: string | null;
  preferred_date: string | null; time_slot: string | null;
  visit_type: string | null; dispatch_address: string | null;
  extra: Record<string, unknown>; created_at: string; updated_at: string;
}

interface RawReport {
  id: string; report_ref: string; ticket_id: string; asset_id: string;
  appraised_value: number; notes: string | null; images: string[];
  status: string; appraised_by: string | null; appraiser_name?: string | null;
  appraised_at: string; created_at: string; updated_at: string;
}

interface RawDocument {
  id: string; asset_id: string; customer_id: string;
  type: string | null; filename: string; storage_path: string;
  status: string; created_at: string; updated_at: string;
}

interface RawCustomer {
  id: string; keycloak_id: string; full_name: string;
  mobile: string; email: string; address: string | null;
  tfa: string; status: string; created_at: string; updated_at: string;
}

interface RawStaff {
  id: string; keycloak_id: string | null; full_name: string;
  email: string; mobile: string | null;
  role: "admin" | "ticket_manager"; status: string;
  last_login: string | null; created_at: string; updated_at: string;
}

interface RawRates {
  gold: number; silver: number; platinum: number; diamond_usd: number;
}

interface RawTransaction {
  id: string; customer_id: string | null; ticket_id: string | null;
  asset_id: string | null; service_type: string | null;
  amount: number; status: string; created_at: string;
}

interface RawAuditEntry {
  id: string; actor: string; action: string;
  entity_type: string | null; entity_id: string | null;
  detail: string | null; metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Adapters ─────────────────────────────────────────────────────────────────

export function adaptAsset(a: RawAsset): Asset {
  return {
    asset_id:       a.id,
    name:           a.name,
    category:       a.category,
    perspective:    a.perspective as Perspective,
    metal:          a.metal,
    purity:         a.purity,
    huid:           a.huid ?? undefined,
    gross:          a.gross,
    deduction:      a.deduction,
    net:            a.net,
    purchase_price: a.purchase_price,
    purchase_date:  a.purchase_date ?? "",
    purchased_from: a.purchased_from ?? "",
    invoice_ref:    a.invoice_ref ?? "",
    provenance:     a.provenance ?? "",
    occasion:       a.occasion ?? "",
    gifted_by:      a.gifted_by ?? "",
    location_type:  (a.location_type as LocationType) ?? "With Me",
    location_detail: a.location_detail ?? {},
    last_verified:  a.last_verified ? a.last_verified.slice(0, 10) : "",
    status:         a.status as AssetStatus,
    images:         a.images,
    created_at:     a.created_at.slice(0, 10),
    appraised_value: a.appraised_value,
  };
}

export function adaptTicket(t: RawTicket): ServiceTicket {
  return {
    ticket_id:        t.id,
    customer_id:      t.customer_id,
    asset_id:         t.asset_id,
    service_type:     t.service_type as ServiceType,
    status:           t.status as TicketStatus,
    priority:         t.priority as Priority,
    assigned_to:      t.assigned_to,
    customer_notes:   t.customer_notes ?? "",
    preferred_date:   t.preferred_date ?? "",
    time_slot:        t.time_slot ?? "",
    visit_type:       t.visit_type ?? "",
    dispatch_address: t.dispatch_address ?? "",
    extra:            t.extra,
    created_at:       t.created_at.slice(0, 10),
    updated_at:       t.updated_at.slice(0, 10),
  };
}

export function adaptReport(r: RawReport): Report {
  return {
    report_id:       r.id,
    ticket_id:       r.ticket_id,
    asset_id:        r.asset_id,
    appraised_value: r.appraised_value,
    notes:           r.notes ?? "",
    images:          r.images,
    certificate_ref: r.report_ref,
    status:          r.status as ReportStatus,
    appraised_by:    r.appraiser_name ?? r.appraised_by ?? "",
    appraised_at:    r.appraised_at.slice(0, 10),
  };
}

export function adaptDocument(d: RawDocument): Document {
  return {
    document_id: d.id,
    asset_id:    d.asset_id,
    type:        (d.type as DocumentType) ?? "other",
    filename:    d.filename,
    status:      d.status as DocumentStatus,
    date:        d.created_at.slice(0, 10),
  };
}

export function adaptCustomer(c: RawCustomer): Customer {
  return {
    customer_id: c.id,
    full_name:   c.full_name,
    mobile:      c.mobile,
    email:       c.email,
    address:     c.address ?? "",
    tfa:         c.tfa,
    status:      c.status,
  };
}

export function adaptStaff(s: RawStaff): Staff {
  return {
    staff_id:   s.id,
    full_name:  s.full_name,
    email:      s.email,
    role:       s.role,
    status:     s.status as Staff["status"],
    last_login: s.last_login ? new Date(s.last_login).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" }) : "—",
  };
}

// ─── Public API functions ─────────────────────────────────────────────────────

export async function fetchMe(token: string) {
  return get<RawCustomer | { type: "staff"; roles: string[]; email: string; username: string }>("/me", token);
}

export async function syncCustomerProfile(
  token: string,
  data: { full_name: string; mobile: string; email?: string; address?: string; tfa?: string },
) {
  return post<RawCustomer>("/me", token, data);
}

export async function fetchRates(token: string) {
  return get<RawRates>("/rates", token);
}

export async function fetchAssets(token: string): Promise<Asset[]> {
  const raw = await get<RawAsset[]>("/assets", token);
  return raw.map(adaptAsset);
}

export async function createAsset(
  token: string,
  data: Partial<RawAsset>,
): Promise<Asset> {
  const raw = await post<RawAsset>("/assets", token, data);
  return adaptAsset(raw);
}

export async function updateAsset(
  token: string,
  id: string,
  data: Partial<RawAsset>,
): Promise<Asset> {
  const raw = await put<RawAsset>(`/assets/${id}`, token, data);
  return adaptAsset(raw);
}

export async function deleteAsset(token: string, id: string): Promise<void> {
  return del<void>(`/assets/${id}`, token);
}

export async function assignTicket(token: string, id: string, staffId: string, priority?: string): Promise<ServiceTicket> {
  const raw = await patch<RawTicket>(`/tickets/${id}/assign`, token, { staff_id: staffId, priority });
  return adaptTicket(raw);
}

export async function updateTicketStatus(token: string, id: string, status: string, extra?: Record<string, unknown>): Promise<ServiceTicket> {
  const raw = await patch<RawTicket>(`/tickets/${id}/status`, token, { status, extra });
  return adaptTicket(raw);
}

export async function fetchTickets(token: string): Promise<ServiceTicket[]> {
  const raw = await get<RawTicket[]>("/tickets", token);
  return raw.map(adaptTicket);
}

export async function createTicket(
  token: string,
  data: {
    asset_id: string;
    service_type: string;
    customer_notes?: string;
    preferred_date?: string;
    time_slot?: string;
    visit_type?: string;
    dispatch_address?: string;
    extra?: Record<string, unknown>;
  },
): Promise<ServiceTicket> {
  const raw = await post<RawTicket>("/tickets", token, data);
  return adaptTicket(raw);
}

export async function createReport(
  token: string,
  data: { ticket_id: string; asset_id: string; appraised_value: number; notes?: string; images?: string[]; status?: string },
): Promise<Report> {
  const raw = await post<RawReport>("/reports", token, data);
  return adaptReport(raw);
}

export async function updateReport(
  token: string,
  id: string,
  data: { appraised_value?: number; notes?: string; images?: string[]; status?: string },
): Promise<Report> {
  const raw = await put<RawReport>(`/reports/${id}`, token, data);
  return adaptReport(raw);
}

export async function inviteStaff(
  token: string,
  data: { full_name: string; email: string; role: string; mobile?: string },
): Promise<Staff> {
  const raw = await post<RawStaff>("/admin/staff", token, data);
  return adaptStaff(raw);
}

export async function fetchReports(token: string): Promise<Report[]> {
  const raw = await get<RawReport[]>("/reports", token);
  return raw.map(adaptReport);
}

export async function fetchDocuments(token: string): Promise<Document[]> {
  const raw = await get<RawDocument[]>("/documents", token);
  return raw.map(adaptDocument);
}

export async function createDocument(
  token: string,
  data: { asset_id: string; type: string; filename: string; storage_path: string },
): Promise<Document> {
  const raw = await post<RawDocument>("/documents", token, data);
  return adaptDocument(raw);
}

export async function fetchStaff(token: string): Promise<Staff[]> {
  const raw = await get<RawStaff[]>("/admin/staff", token);
  return raw.map(adaptStaff);
}

export async function fetchCustomers(token: string) {
  return get<RawCustomer[]>("/admin/customers", token);
}

export async function fetchTransactions(token: string) {
  return get<RawTransaction[]>("/admin/transactions", token);
}

export async function fetchAudit(token: string, limit = 100) {
  return get<RawAuditEntry[]>(`/admin/audit?limit=${limit}`, token);
}

export async function fetchDashboard(token: string) {
  return get<Record<string, unknown>>("/admin/dashboard", token);
}

export type { RawRates, RawTransaction, RawAuditEntry };