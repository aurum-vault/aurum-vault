import { RATES, CAT_ICON, STATUS_LABELS, REPAIR_FLOW, STATUS_FLOW, SVC_TYPES } from "./data";
import type { Asset, AssetStatus, TicketStatus, ServiceTicket, ServiceType } from "./types";

export function fmtINR(n: number | null | undefined): string {
  if (n == null) return "—";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function calcMarketValue(a: Asset): number {
  const m = (a.metal || "").toLowerCase();
  let r = RATES.gold;
  if (m.includes("silver")) r = RATES.silver;
  else if (m.includes("platinum")) r = RATES.platinum;
  return Math.round((a.net || 0) * r);
}

export function metalIcon(m: string): string {
  if (/diamond/i.test(m)) return "💎";
  if (/silver/i.test(m)) return "🥈";
  if (/platinum/i.test(m)) return "⚪";
  return "🟡";
}

export function catIcon(category: string): string {
  return CAT_ICON[category] || "💎";
}

export function locIcon(t: string): string {
  const m: Record<string, string> = {
    "With Me": "🏠",
    "Bank Locker": "🏦",
    "Pledged / Hypothecated": "🤝",
    "With Family Member": "👨‍👩‍👧",
    "Professional Storage": "🏛️",
    "Travelling With Me": "✈️",
    "Other": "📦",
  };
  return m[t] || "📍";
}

export function statusColor(s: AssetStatus): string {
  const map: Record<AssetStatus, string> = {
    verified: "success",
    in_review: "warning",
    pending: "ghost",
    rejected: "error",
  };
  return map[s] || "ghost";
}

export function statusLabel(s: AssetStatus): string {
  const map: Record<AssetStatus, string> = {
    verified: "Verified",
    in_review: "In Review",
    pending: "Pending",
    rejected: "Rejected",
  };
  return map[s] || s;
}

export function ticketStatusColor(s: TicketStatus): string {
  const map: Record<TicketStatus, string> = {
    submitted: "ghost",
    assigned: "info",
    in_progress: "warning",
    awaiting_info: "warning",
    quote_ready: "info",
    awaiting_payment: "warning",
    report_ready: "success",
    closed: "ghost",
    cancelled: "error",
  };
  return map[s] || "ghost";
}

export function ticketStatusLabel(s: TicketStatus): string {
  return STATUS_LABELS[s] || s;
}

export function priorityColor(p: string): string {
  const map: Record<string, string> = { high: "error", medium: "warning", low: "ghost" };
  return map[p] || "ghost";
}

export function flowFor(t: ServiceTicket): string[] {
  return t.service_type === "repair" ? REPAIR_FLOW : STATUS_FLOW;
}

export function svcName(type: ServiceType): string {
  return SVC_TYPES[type]?.name || type;
}

export function nowTs(): string {
  return new Date().toISOString().slice(0, 16).replace("T", " ");
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function refurbTotal(list: string[]): number {
  const { REFURB_RATECARD } = require("./data");
  return (list || []).reduce((s: number, n: string) => {
    const it = REFURB_RATECARD.find((x: { name: string; price: number }) => x.name === n);
    return s + (it ? it.price : 0);
  }, 0);
}

export function generateTicketId(count: number): string {
  return "AV-2025-" + String(904 + count).padStart(5, "0");
}

export function generateAssetId(count: number): string {
  return "ORN-" + String(52 + count).padStart(4, "0");
}
