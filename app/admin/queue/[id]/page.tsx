"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { TicketStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/ui/Timeline";
import { Select } from "@/components/ui/FormField";
import { TicketWorkPanel } from "@/components/tickets/TicketWorkPanel";
import { flowFor, catIcon } from "@/lib/utils";
import { SVC_TYPES, STATUS_LABELS } from "@/lib/data";
import * as api from "@/lib/api";

export default function AdminTicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { db, assetById, reportByTicket, toast, refresh } = useApp();
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);

  const ticket = db.tickets.find((t) => t.ticket_id === id);
  if (!ticket) return <div className="text-center py-12 text-[var(--muted)]">Ticket not found.</div>;

  const asset = assetById(ticket.asset_id);
  const rep = reportByTicket(id);
  const flow = flowFor(ticket);
  const curIdx = flow.indexOf(ticket.status);
  const ex = ticket.extra as Record<string, unknown>;
  const isVisit = SVC_TYPES[ticket.service_type].mode === "visit" || ticket.service_type === "repair";
  const activeTMs = db.staff.filter((s) => s.role === "ticket_manager" && s.status === "active");

  const mutate = async (fn: () => Promise<unknown>, msg: string) => {
    if (!token) { toast("Not authenticated", "error"); return; }
    setSaving(true);
    try { await fn(); await refresh(); toast(msg, "success"); }
    catch { toast("Action failed", "error"); }
    finally { setSaving(false); }
  };

  const assignTicket = (staffId: string) =>
    mutate(() => api.assignTicket(token!, id, staffId), "Ticket assigned");

  const setPriority = (p: string) => {
    if (!ticket.assigned_to) { toast("Assign a staff member first", "warn"); return; }
    void mutate(() => api.assignTicket(token!, id, ticket.assigned_to!, p), `Priority → ${p}`);
  };

  return (
    <div>
      <Link href="/admin/queue" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-4 cursor-pointer">← Back to Queue</Link>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="text-[var(--gold)] text-[12px] font-semibold tracking-[1px]">{ticket.ticket_id}</div>
          <h3 className="font-serif text-[22px]">{SVC_TYPES[ticket.service_type].name}</h3>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="grid grid-cols-[1fr_1.5fr] gap-6 max-md:grid-cols-1">
        <div>
          <Card className="p-5 mb-4">
            <div className="label-caps mb-1">Customer (full PII)</div>
            <div className="font-semibold text-[var(--charcoal)] mb-0.5">{db.customer.full_name}</div>
            <div className="text-[13px] text-[var(--sec)] mb-3">+91 {db.customer.mobile} · {db.customer.email}</div>
            {isVisit && (
              <>
                <div className="label-caps mb-1">{ticket.visit_type === "In-Store Visit" ? "🏬 Visit Type" : "🚪 Visit / Collection"}</div>
                <p className="text-[13px] mb-3">
                  <strong>{ticket.visit_type || "—"}</strong>
                  {ticket.preferred_date && ` · ${ticket.preferred_date}`}
                  {ticket.time_slot && ` · ${ticket.time_slot}`}
                  {ticket.visit_type === "Home Visit" && ticket.dispatch_address && (
                    <><br />📍 {ticket.dispatch_address}</>
                  )}
                </p>
              </>
            )}
            <div className="label-caps mb-1">Asset</div>
            <div className="font-semibold mb-0.5">{catIcon(asset?.category || "")} {asset?.name} · {asset?.metal} {asset?.net}g</div>
            {asset?.huid && <div className="text-[12px] text-[var(--sec)] mb-3">HUID: {asset.huid}</div>}
            <div className="label-caps mb-1">Customer Instructions</div>
            <p className="text-[13px] mb-2">{ticket.customer_notes || "—"}</p>
            {ticket.service_type === "repair" && typeof ex.issue === "string" && ex.issue && (
              <>
                <div className="label-caps mt-3 mb-1">Reported Damage</div>
                <p className="text-[13px]">{ex.issue}</p>
              </>
            )}
          </Card>

          <Card className="p-5">
            <div className="label-caps mb-2">Assignment</div>
            <div className="flex gap-2 mb-4">
              <Select className="flex-1" defaultValue={ticket.assigned_to || ""} id="assign-sel">
                {activeTMs.map((s) => <option key={s.staff_id} value={s.staff_id}>{s.full_name}</option>)}
              </Select>
              <Button size="sm" disabled={saving} onClick={() => {
                const sel = (document.getElementById("assign-sel") as HTMLSelectElement)?.value;
                if (sel) void assignTicket(sel);
              }}>Assign</Button>
            </div>
            <div className="label-caps mb-2">Priority</div>
            <div className="flex gap-2">
              {["high", "medium", "low"].map((p) => (
                <button key={p} disabled={saving} onClick={() => setPriority(p)}
                  className={`px-4 py-2 rounded-full border-[1.5px] text-[13px] font-medium cursor-pointer transition-all disabled:opacity-50 ${ticket.priority === p ? "bg-gradient-to-br from-[#7a4e08] to-[#b8860b] text-white border-transparent" : "bg-white border-[var(--border-color)] text-[var(--sec)] hover:border-[var(--border-active)]"}`}>
                  {p}
                </button>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-5">
          <div className="label-caps mb-2">Status Timeline</div>
          <Timeline className="mb-4" steps={flow.slice(0, flow.length - 1).map((s, i) => ({
            label: STATUS_LABELS[s] || s,
            state: i < curIdx ? "done" : i === curIdx ? "active" : "pending",
          } as { label: string; state: "done" | "active" | "pending" }))} />
          <hr className="border-none border-t border-[var(--border-color)] my-4" />
          <TicketWorkPanel ticket={ticket} report={rep} onUpdate={() => void refresh()} />
        </Card>
      </div>
    </div>
  );
}