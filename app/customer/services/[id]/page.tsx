"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge, TicketStatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Timeline } from "@/components/ui/Timeline";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input } from "@/components/ui/FormField";
import { fmtINR, flowFor } from "@/lib/utils";
import { SVC_TYPES, STATUS_LABELS, REFURB_RATECARD } from "@/lib/data";
import { updateTicketStatus } from "@/lib/api";

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { db, assetById, reportByTicket, toast, refresh } = useApp();
  const { token } = useAuth();
  const [payOpen, setPayOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const ticket = db.tickets.find((t) => t.ticket_id === id);
  if (!ticket) return <div className="text-center py-12 text-[var(--muted)]">Ticket not found.</div>;

  const asset = assetById(ticket.asset_id);
  const rep = reportByTicket(ticket.ticket_id);
  const flow = flowFor(ticket);
  const curIdx = flow.indexOf(ticket.status);
  const ex = ticket.extra as Record<string, string | number | boolean | string[]>;
  const svc = SVC_TYPES[ticket.service_type];
  const isVisit = svc.mode === "visit" || ticket.service_type === "repair";

  const mutate = async (status: string, extra?: Record<string, unknown>) => {
    if (!token) { toast("Not authenticated", "error"); return; }
    setSaving(true);
    try {
      await updateTicketStatus(token, ticket.ticket_id, status, extra);
      await refresh();
    } catch {
      toast("Action failed — please try again", "error");
    } finally {
      setSaving(false);
    }
  };

  const acceptQuote = () => {
    void mutate("awaiting_payment");
    toast("Quote accepted — please proceed to payment", "success");
  };

  const confirmPay = async () => {
    await mutate("in_progress", { paid: true });
    setPayOpen(false);
    toast("Payment successful — work will begin", "success");
  };

  const cancelTicket = async () => {
    await mutate("cancelled");
    setCancelOpen(false);
    toast("Request cancelled", "default");
  };

  const refurbTotal = ((ex.refurb as string[]) || []).reduce(
    (s, n) => s + (REFURB_RATECARD.find((x) => x.name === n)?.price ?? 0), 0,
  );

  return (
    <div>
      <Link href="/customer/services" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-4 cursor-pointer">← Back to Services</Link>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="text-[var(--gold)] text-[12px] font-semibold tracking-[1px]">{ticket.ticket_id}</div>
          <h3 className="font-serif text-[22px]">{svc.name}</h3>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="grid grid-cols-[1fr_1.5fr] gap-6 max-md:grid-cols-1">
        <Card className="p-5">
          <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-1">Asset</div>
          <div className="font-semibold text-[var(--charcoal)] mb-4">{asset?.name || "—"}</div>
          {isVisit && (
            <>
              <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-1">Appointment</div>
              <div className="text-[14px] mb-4">
                <strong>{ticket.visit_type}</strong>
                {ticket.preferred_date && ` · ${ticket.preferred_date}`}
                {ticket.time_slot && ` · ${ticket.time_slot}`}
                {ticket.visit_type === "Home Visit" && ticket.dispatch_address && (
                  <div className="text-[var(--sec)] text-[13px] mt-1">📍 {ticket.dispatch_address}</div>
                )}
              </div>
            </>
          )}
          <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-2">Status Timeline</div>
          <Timeline steps={flow.slice(0, flow.length - 1).map((s, i) => ({
            label: STATUS_LABELS[s] || s,
            state: i < curIdx ? "done" : i === curIdx ? "active" : "pending",
          } as { label: string; state: "done" | "active" | "pending" }))} />
          {ticket.status === "submitted" && (
            <Button variant="danger" size="sm" className="mt-4" disabled={saving} onClick={() => setCancelOpen(true)}>Cancel Request</Button>
          )}
        </Card>

        <Card className="p-5">
          <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-1">Your Notes</div>
          <p className="mb-4">{ticket.customer_notes || "—"}</p>

          {ticket.service_type === "repair" && (
            <>
              <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-1">Reported Damage</div>
              <p className="mb-4">{(ex.issue as string) || "—"}</p>
              {ex.repairability && (
                <div className="p-3.5 rounded-xl mb-4" style={{ background: "var(--gold-light)" }}>
                  <div className="label-caps mb-1.5">Stage 1 · Assessment</div>
                  <div className="text-[14px]"><strong>Repairability:</strong> {ex.repairability as string}</div>
                  {ex.quote_timeframe && <div className="text-[14px]"><strong>Timeframe:</strong> {ex.quote_timeframe as string}</div>}
                  {ex.quote_notes && <p className="text-[13px] text-[var(--sec)] mt-1.5">{ex.quote_notes as string}</p>}
                </div>
              )}
              {ex.quote_amount && (
                <Card className="p-4 border-[1.5px] border-[var(--gold)] mb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="label-caps">Repair Quote</div>
                      <div className="font-serif text-[26px] font-bold text-[var(--gold-accent)]">{fmtINR(ex.quote_amount as number)}</div>
                    </div>
                    {ex.paid ? <Badge variant="green">Paid</Badge> :
                      ticket.status === "quote_ready" ? <Button size="sm" disabled={saving} onClick={acceptQuote}>Accept Quote</Button> :
                        ticket.status === "awaiting_payment" ? <Button size="sm" onClick={() => setPayOpen(true)}>💳 Pay Now</Button> : null}
                  </div>
                </Card>
              )}
            </>
          )}

          {ticket.service_type === "refurbishment" && (
            <>
              <div className="label-caps mb-1">Selected Services</div>
              <div className="mb-3">
                {((ex.refurb as string[]) || []).map((n) => {
                  const it = REFURB_RATECARD.find((x) => x.name === n);
                  return (
                    <div key={n} className="flex justify-between text-[13px] py-1">
                      <span>{n}</span>
                      <span className="font-semibold">{it ? `₹${it.price.toLocaleString("en-IN")}` : ""}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between border-t border-dashed border-[var(--border-color)] pt-2 mt-2">
                  <span className="font-semibold">Estimated Total</span>
                  <span className="font-serif text-[18px] font-bold text-[var(--gold-accent)]">{fmtINR(refurbTotal)}</span>
                </div>
              </div>
              {ticket.status === "awaiting_payment" && ex.quote_amount && (
                <Button block size="sm" onClick={() => setPayOpen(true)}>💳 Pay {fmtINR(ex.quote_amount as number)}</Button>
              )}
            </>
          )}

          {ticket.service_type === "appraisal_purity" && (
            rep ? (
              <>
                <div className="label-caps mb-1.5">Specialist Notes</div>
                <p className="mb-4">{rep.notes}</p>
                <div className="label-caps mb-1">Appraised Value</div>
                <div className="font-serif text-[24px] text-[var(--green)] font-bold mb-4">{fmtINR(rep.appraised_value)}</div>
                <Button size="sm" onClick={() => toast("Certificate download coming soon", "default")}>📜 View Digital Certificate</Button>
              </>
            ) : (
              <p className="text-[var(--muted)] italic text-[13px]">Specialist notes will appear here once the report is ready.</p>
            )
          )}
        </Card>
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Secure Payment"
        footer={<><Button variant="ghost" size="sm" onClick={() => setPayOpen(false)}>Cancel</Button><Button size="sm" disabled={saving} onClick={() => void confirmPay()}>Pay {fmtINR((ex.quote_amount as number) || refurbTotal)}</Button></>}>
        <div className="text-center mb-4">
          <div className="label-caps">Amount Payable</div>
          <div className="font-serif text-[34px] font-bold text-[var(--gold-accent)] my-1.5">{fmtINR((ex.quote_amount as number) || refurbTotal)}</div>
        </div>
        <FormField label="Card Number"><Input defaultValue="4242 4242 4242 4242" /></FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Expiry"><Input defaultValue="12/27" /></FormField>
          <FormField label="CVV"><Input defaultValue="123" /></FormField>
        </div>
        <p className="text-[11px] text-[var(--muted)]">🔒 Demo payment — no real charge is made.</p>
      </Modal>

      <Modal open={cancelOpen} onClose={() => setCancelOpen(false)} title="Cancel Request"
        footer={<><Button variant="ghost" size="sm" onClick={() => setCancelOpen(false)}>Keep Request</Button><Button variant="danger" size="sm" disabled={saving} onClick={() => void cancelTicket()}>Yes, Cancel</Button></>}>
        <p>Are you sure you want to cancel this service request? This cannot be undone.</p>
      </Modal>
    </div>
  );
}
