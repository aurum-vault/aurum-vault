export type AssetStatus = "verified" | "in_review" | "pending" | "rejected";
export type ServiceType =
  | "appraisal_purity"
  | "repair"
  | "refurbishment"
  | "gold_loan";
export type TicketStatus =
  | "submitted"
  | "assigned"
  | "in_progress"
  | "awaiting_info"
  | "quote_ready"
  | "awaiting_payment"
  | "report_ready"
  | "closed"
  | "cancelled";
export type Priority = "high" | "medium" | "low";
export type UserRole = "customer" | "admin" | "ticket_manager";
export type Perspective = "customer" | "appraiser" | "heritage";
export type DocumentType = "invoice" | "hallmark" | "appraisal" | "other";
export type DocumentStatus = "verified" | "pending" | "rejected";
export type ReportStatus = "certified" | "provisional" | "under_review";
export type LocationType =
  | "With Me"
  | "Bank Locker"
  | "Pledged / Hypothecated"
  | "With Family Member"
  | "Professional Storage"
  | "Travelling With Me"
  | "Other";

export interface Asset {
  asset_id: string;
  name: string;
  category: string;
  perspective: Perspective;
  metal: string;
  purity: string;
  huid?: string;
  gross: number;
  deduction: number;
  net: number;
  purchase_price: number;
  purchase_date: string;
  purchased_from: string;
  invoice_ref: string;
  provenance: string;
  occasion: string;
  gifted_by: string;
  location_type: LocationType;
  location_detail: Record<string, string>;
  last_verified: string;
  status: AssetStatus;
  images: string[];
  created_at: string;
  appraised_value: number | null;
}

export interface ServiceTicket {
  ticket_id: string;
  customer_id: string;
  asset_id: string;
  service_type: ServiceType;
  status: TicketStatus;
  priority: Priority;
  assigned_to: string | null;
  customer_notes: string;
  preferred_date: string;
  time_slot: string;
  visit_type: string;
  dispatch_address: string;
  extra: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Report {
  report_id: string;
  ticket_id: string;
  asset_id: string;
  appraised_value: number;
  notes: string;
  images: string[];
  certificate_ref: string;
  status: ReportStatus;
  appraised_by: string;
  appraised_at: string;
}

export interface Document {
  document_id: string;
  asset_id: string;
  type: DocumentType;
  filename: string;
  status: DocumentStatus;
  date: string;
}

export interface Transaction {
  txn_id: string;
  customer: string;
  service: string;
  asset: string;
  amount: number;
  date: string;
  status: string;
}

export interface AuditEntry {
  ts: string;
  actor: string;
  action: string;
  entity: string;
  detail: string;
}

export interface Customer {
  customer_id: string;
  full_name: string;
  mobile: string;
  email: string;
  address: string;
  tfa: string;
  status: string;
}

export interface Staff {
  staff_id: string;
  full_name: string;
  email: string;
  role: "admin" | "ticket_manager";
  status: "active" | "invited" | "inactive";
  last_login: string;
}

export interface AppDB {
  customer: Customer;
  staff: Staff[];
  assets: Asset[];
  tickets: ServiceTicket[];
  reports: Report[];
  documents: Document[];
  transactions: Transaction[];
  audit: AuditEntry[];
}

export interface Rates {
  gold: number;
  silver: number;
  platinum: number;
  diamondUSD: number;
}

export interface ToastMessage {
  id: string;
  msg: string;
  type: "success" | "error" | "warn" | "default";
}
