"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { UploadZone, ImageThumbs } from "@/components/ui/UploadZone";
import { fmtINR } from "@/lib/utils";
import { REFURB_RATECARD } from "@/lib/data";
import * as api from "@/lib/api";
import type { ServiceTicket, Report } from "@/lib/types";

interface Props {
  ticket: ServiceTicket;
  report?: Report;
  onUpdate: () => void;
}

export function TicketWorkPanel({ ticket, report, onUpdate }: Props) {
  const { toast, refresh } = useApp();
  const { token } = useAuth();
  const [appraisalNotes, setAppraisalNotes] = useState(report?.notes || "");
  const [appraisalValue, setAppraisalValue] = useState(report?.appraised_value || 0);
  const [appraisalStatus, setAppraisalStatus] = useState(report?.status || "under_review");
  const [certRef, setCertRef] = useState(report?.certificate_ref || "");
  const [appraisalImages, setAppraisalImages] = useState<string[]>([]);
  const [repairQuoteImages, setRepairQuoteImages] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const ex = ticket.extra as Record<string, unknown>;

  const call = async (fn: () => Promise<unknown>, successMsg: string) => {
    if (!token) { toast("Not authenticated", "error"); return; }
    setSaving(true);
    try {
      await fn();
      await refresh();
      onUpdate();
      toast(successMsg, "success");
    } catch {
      toast("Action failed — please try again", "error");
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = (status: string, extra?: Record<string, unknown>) =>
    call(() => api.updateTicketStatus(token!, ticket.ticket_id, status, extra), `Status → ${status}`);

  const saveReport = async (updates: Partial<Report>) => {
    if (!token) { toast("Not authenticated", "error"); return; }
    if (report) {
      await api.updateReport(token, report.report_id, {
        appraised_value: updates.appraised_value,
        notes: updates.notes,
        images: updates.images,
        status: updates.status,
      });
    } else {
      await api.createReport(token, {
        ticket_id:       ticket.ticket_id,
        asset_id:        ticket.asset_id,
        appraised_value: updates.appraised_value ?? 0,
        notes:           updates.notes,
        images:          updates.images,
        status:          updates.status,
      });
    }
  };

  if (ticket.service_type === "repair") {
    return (
      <div>
        <h4 className="font-serif text-[18px] mb-2">Repair Workflow</h4>
        <p className="text-[12px] text-[var(--muted)] mb-3">Stage 1: send repairability + quote. Stage 2: customer pays, then mark completion.</p>
        <FormField label="Repairability">
          <Select defaultValue={(ex.repairability as string) || "Repairable"} id="rq-repairability">
            <option>Repairable</option>
            <option>Repairable with limitations</option>
            <option>Not repairable</option>
          </Select>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Quote Amount (₹)">
            <Input type="number" defaultValue={(ex.quote_amount as number) || ""} placeholder="0" id="rq-amount" />
          </FormField>
          <FormField label="Timeframe">
            <Input defaultValue={(ex.quote_timeframe as string) || ""} placeholder="e.g. 4–5 days" id="rq-timeframe" />
          </FormField>
        </div>
        <FormField label="Quote / Assessment Notes">
          <Textarea defaultValue={(ex.quote_notes as string) || ""} placeholder="Findings after inspection…" id="rq-notes" />
        </FormField>
        <UploadZone onFiles={(imgs) => setRepairQuoteImages((p) => [...p, ...imgs])} className="mb-2" />
        <ImageThumbs images={repairQuoteImages} onRemove={(i) => setRepairQuoteImages((p) => p.filter((_, idx) => idx !== i))} />
        <Button block disabled={saving} className="mt-3" onClick={() => {
          const repairability = (document.getElementById("rq-repairability") as HTMLSelectElement)?.value;
          const quote_amount = parseFloat((document.getElementById("rq-amount") as HTMLInputElement)?.value) || 0;
          const quote_timeframe = (document.getElementById("rq-timeframe") as HTMLInputElement)?.value;
          const quote_notes = (document.getElementById("rq-notes") as HTMLTextAreaElement)?.value;
          if (!quote_amount) { toast("Enter a quote amount", "error"); return; }
          void updateStatus("quote_ready", { repairability, quote_amount, quote_timeframe, quote_notes, repair_path: ex.repair_path || "store" });
        }}>Send Quote → Customer</Button>
        <div className="text-[12px] text-[var(--muted)] mt-2.5 mb-1">
          Payment: <strong>{ex.paid ? "Paid ✓" : ticket.status === "awaiting_payment" ? "Awaiting customer payment" : "—"}</strong>
        </div>
        <div className="flex gap-2 mt-1.5">
          <Button variant="ghost" size="sm" disabled={saving || !ex.paid} onClick={() => void updateStatus("in_progress")}>Mark In Progress</Button>
          <Button size="sm" disabled={saving || !(ex.paid && ticket.status === "in_progress")} onClick={() => void updateStatus("report_ready")}>Mark Completed</Button>
        </div>
      </div>
    );
  }

  if (ticket.service_type === "refurbishment") {
    const refurbTotal = ((ex.refurb as string[]) || []).reduce((s, n) => s + (REFURB_RATECARD.find((x) => x.name === n)?.price ?? 0), 0);
    return (
      <div>
        <h4 className="font-serif text-[18px] mb-3">Refurbishment</h4>
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
          <div className="flex justify-between border-t border-dashed border-[var(--border-color)] pt-2 mt-1">
            <strong>Rate-card total</strong>
            <strong className="text-[var(--gold-accent)]">{fmtINR(refurbTotal)}</strong>
          </div>
        </div>
        <FormField label="Confirmed Amount (₹)">
          <Input type="number" defaultValue={(ex.quote_amount as number) || refurbTotal} id="rq-amount" />
        </FormField>
        <FormField label="Work Notes">
          <Textarea defaultValue={report?.notes || ""} placeholder="Condition, work performed…" id="rq-notes" />
        </FormField>
        <Button block disabled={saving} onClick={async () => {
          const quote_amount = parseFloat((document.getElementById("rq-amount") as HTMLInputElement)?.value) || refurbTotal;
          const notes = (document.getElementById("rq-notes") as HTMLTextAreaElement)?.value || "";
          await call(async () => {
            await saveReport({ notes });
            await api.updateTicketStatus(token!, ticket.ticket_id, "awaiting_payment", { quote_amount });
          }, "Amount sent — awaiting payment");
        }}>Send Amount → Request Payment</Button>
        <div className="text-[12px] text-[var(--muted)] mt-2.5">
          Payment: <strong>{ex.paid ? "Paid ✓" : ticket.status === "awaiting_payment" ? "Awaiting payment" : "—"}</strong>
        </div>
        <Button className="mt-2" size="sm" disabled={saving || !ex.paid} onClick={async () => {
          const notes = (document.getElementById("rq-notes") as HTMLTextAreaElement)?.value || "";
          await call(async () => {
            await saveReport({ notes });
            await api.updateTicketStatus(token!, ticket.ticket_id, "report_ready");
          }, "Refurbishment completed");
        }}>Mark Completed</Button>
      </div>
    );
  }

  if (ticket.service_type === "gold_loan") {
    return (
      <div>
        <h4 className="font-serif text-[18px] mb-3">Gold Loan</h4>
        {[
          ["Requested", fmtINR(parseFloat(ex.loanAmt as string) || 0)],
          ["Tenure", (ex.tenure as string) || "—"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-[var(--border-color)] text-[13px]">
            <span className="text-[var(--sec)]">{k}</span>
            <span className="font-semibold text-[var(--gold-accent)]">{v}</span>
          </div>
        ))}
        <FormField label="Decision Notes" className="mt-3">
          <Textarea defaultValue={report?.notes || ""} placeholder="Approval / sanction details…" id="rq-notes" />
        </FormField>
        <Button block disabled={saving} onClick={async () => {
          const notes = (document.getElementById("rq-notes") as HTMLTextAreaElement)?.value || "";
          await call(async () => {
            await saveReport({ notes });
            await api.updateTicketStatus(token!, ticket.ticket_id, "report_ready");
          }, "Decision recorded — customer notified");
        }}>Record Decision → Notify Customer</Button>
      </div>
    );
  }

  // Appraisal
  return (
    <div>
      <h4 className="font-serif text-[18px] mb-3">Appraisal Entry</h4>
      <FormField label="Appraisal Notes">
        <Textarea value={appraisalNotes} onChange={(e) => setAppraisalNotes(e.target.value)} placeholder="Detailed appraisal findings, HUID verification…" />
      </FormField>
      <UploadZone onFiles={(imgs) => setAppraisalImages((p) => [...p, ...imgs])} className="mb-2" />
      <ImageThumbs images={appraisalImages} onRemove={(i) => setAppraisalImages((p) => p.filter((_, idx) => idx !== i))} />
      <FormField label="Appraised Value (₹)">
        <Input type="number" value={appraisalValue || ""} onChange={(e) => setAppraisalValue(parseFloat(e.target.value) || 0)} placeholder="0" />
      </FormField>
      <FormField label="Appraisal Status">
        <Select value={appraisalStatus} onChange={(e) => setAppraisalStatus(e.target.value as "under_review" | "provisional" | "certified")}>
          <option value="under_review">Under Review</option>
          <option value="provisional">Provisional</option>
          <option value="certified">Certified</option>
        </Select>
      </FormField>
      <FormField label="Certificate Reference">
        <Input value={certRef} onChange={(e) => setCertRef(e.target.value)} placeholder="BIS-AV-…" />
      </FormField>
      <Button block disabled={saving} onClick={async () => {
        if (!appraisalNotes.trim()) { toast("Appraisal notes are required", "error"); return; }
        const finalRef = certRef || `BIS-AV-${ticket.ticket_id.slice(-6)}`;
        await call(async () => {
          await saveReport({
            notes:           appraisalNotes,
            appraised_value: appraisalValue,
            status:          appraisalStatus as "under_review" | "provisional" | "certified",
            certificate_ref: finalRef,
            images:          appraisalImages,
          });
          await api.updateTicketStatus(token!, ticket.ticket_id, "report_ready");
        }, "Appraisal published — certificate issued to customer");
      }}>Publish Appraisal → Issue Certificate</Button>
    </div>
  );
}