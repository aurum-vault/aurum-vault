"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { createTicket } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Chips } from "@/components/ui/Chips";
import { TicketStatusBadge } from "@/components/ui/Badge";
import { UploadZone, ImageThumbs } from "@/components/ui/UploadZone";
import { fmtINR, calcMarketValue } from "@/lib/utils";
import { SVC_TYPES, REFURB_RATECARD, LOAN_TENURES, LOAN_LTV, VISIT_TYPES, TIME_SLOTS } from "@/lib/data";
import type { ServiceType } from "@/lib/types";

function ServicesContent() {
  const { db, toast, refresh } = useApp();
  const { token } = useAuth();
  const router = useRouter();
  const params = useSearchParams();

  const [mode, setMode] = useState<"list" | "request" | "done">("list");
  const [step, setStep] = useState(1);
  const [service, setService] = useState<ServiceType | null>((params.get("service") as ServiceType) || null);
  const [assetId, setAssetId] = useState(params.get("asset") || "");
  const [visitType, setVisitType] = useState(VISIT_TYPES[0]);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [notes, setNotes] = useState("");
  const [address, setAddress] = useState(db.customer.address);
  const [refurbItems, setRefurbItems] = useState<string[]>([]);
  const [loanAmt, setLoanAmt] = useState("");
  const [loanTenure, setLoanTenure] = useState(LOAN_TENURES[1]);
  const [repairIssue, setRepairIssue] = useState("");
  const [repairImages, setRepairImages] = useState<string[]>([]);
  const [createdId, setCreatedId] = useState("");
  const [saving, setSaving] = useState(false);

  const startRequest = (svc?: ServiceType) => {
    setService(svc || null);
    setStep(svc ? 2 : 1);
    setMode("request");
  };

  const submit = async () => {
    if (!service || !assetId) return;
    setSaving(true);
    try {
      const extra: Record<string, unknown> = {};
      if (service === "repair") { extra.issue = repairIssue; extra.images = repairImages; }
      if (service === "refurbishment") {
        extra.refurb = refurbItems;
        extra.rateTotal = refurbItems.reduce((s, n) => s + (REFURB_RATECARD.find((x) => x.name === n)?.price ?? 0), 0);
      }
      if (service === "gold_loan") { extra.loanAmt = loanAmt; extra.tenure = loanTenure; }

      if (!token) throw new Error("Not authenticated");
      const ticket = await createTicket(token, {
        asset_id:         assetId,
        service_type:     service,
        customer_notes:   notes || undefined,
        preferred_date:   date || undefined,
        time_slot:        timeSlot || undefined,
        visit_type:       visitType || undefined,
        dispatch_address: address || undefined,
        extra,
      });

      await refresh();
      setCreatedId(ticket.ticket_id);
      setMode("done");
      toast(`Service request created: ${ticket.ticket_id}`, "success");
    } catch {
      toast("Failed to submit request — please try again", "error");
    } finally {
      setSaving(false);
    }
  };

  const svcObj = service ? SVC_TYPES[service] : null;
  const assetObj = db.assets.find((a) => a.asset_id === assetId);
  const mv = assetObj ? calcMarketValue(assetObj) : 0;
  const maxLoan = Math.round(mv * LOAN_LTV);
  const refurbTotal = refurbItems.reduce((s, n) => s + (REFURB_RATECARD.find((x) => x.name === n)?.price ?? 0), 0);

  if (mode === "done") {
    return (
      <div className="max-w-[520px] mx-auto text-center pt-5">
        <div className="text-[60px]">🎫</div>
        <h3 className="font-serif text-[24px] mt-3 mb-2">Request Submitted!</h3>
        <p className="text-[var(--sec)] mb-5">
          {service === "repair" ? "Our team will review the photos and send you a repairability assessment." : "Your ticket has been created and queued for assignment."}
        </p>
        <Card className="p-5 mb-5">
          <div className="font-serif text-[28px] font-bold text-[var(--gold-accent)]">{createdId}</div>
          <div className="text-[var(--sec)] mt-1.5">{svcObj?.ico} {svcObj?.name}</div>
          <div className="text-[13px] text-[var(--muted)] mt-2">Estimated TAT: {svcObj?.tat}</div>
        </Card>
        <div className="flex gap-2.5 justify-center">
          <Button onClick={() => router.push(`/customer/services/${createdId}`)}>Track Status →</Button>
          <Button variant="ghost" onClick={() => { setMode("list"); setStep(1); setService(null); }}>Back to Services</Button>
        </div>
      </div>
    );
  }

  if (mode === "request") {
    return (
      <div>
        <button onClick={() => setMode("list")} className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-4 cursor-pointer bg-transparent">
          ← Back to Services
        </button>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h3 className="font-serif text-[22px]">Request Service{svcObj ? ` · ${svcObj.name}` : ""}</h3>
          <span className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold">Step {step} of 4</span>
        </div>
        <StepIndicator steps={[{ label: "Service" }, { label: "Asset" }, { label: "Details" }, { label: "Confirm" }]} current={step} className="mb-6" />

        <Card className="p-6 max-w-[620px]">
          {step === 1 && (
            <>
              <h4 className="font-serif text-[18px] mb-4">Select Service Type</h4>
              <RadioCardGroup value={service || ""} onChange={(v) => setService(v as ServiceType)}
                options={Object.entries(SVC_TYPES).map(([k, v]) => ({ value: k, icon: v.ico, title: v.name, desc: v.desc }))} />
              <div className="flex justify-end mt-4">
                <Button disabled={!service} onClick={() => setStep(2)}>Continue →</Button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h4 className="font-serif text-[18px] mb-4">Select Asset</h4>
              <FormField label="Choose from your collection">
                <Select value={assetId} onChange={(e) => setAssetId(e.target.value)}>
                  <option value="">Select asset…</option>
                  {db.assets.map((a) => (
                    <option key={a.asset_id} value={a.asset_id}>{a.name} — {a.metal} {a.net}g</option>
                  ))}
                </Select>
              </FormField>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <Button disabled={!assetId} onClick={() => setStep(3)}>Continue →</Button>
              </div>
            </>
          )}

          {step === 3 && svcObj && (
            <>
              <h4 className="font-serif text-[18px] mb-4">{svcObj.name} — Details</h4>

              {service === "appraisal_purity" && (
                <div className="p-4 rounded-xl mb-4" style={{ background: "var(--diamond)" }}>
                  <div className="font-semibold text-[#2563a0] mb-1.5">🏆 Certified Valuation & HUID Verification</div>
                  <p className="text-[13px] text-[var(--sec)]">A certified valuer will assess the piece, verify the BIS hallmark / HUID, photograph it, and issue a digital certificate.</p>
                </div>
              )}

              {service === "repair" && (
                <>
                  <div className="p-3.5 rounded-xl mb-4 text-[13px] text-[var(--sec)]" style={{ background: "var(--gold-light)" }}>
                    <strong className="text-[var(--charcoal)]">Stage 1 · Repairability Assessment.</strong> Share photos and describe the damage.
                  </div>
                  <FormField label="Describe the Damage" required>
                    <Textarea value={repairIssue} onChange={(e) => setRepairIssue(e.target.value)} placeholder="e.g. Loose stone, bent prong, broken clasp, dent…" />
                  </FormField>
                  <FormField label="Photos of the Damaged Asset">
                    <UploadZone onFiles={(imgs) => setRepairImages((p) => [...p, ...imgs])} />
                    <ImageThumbs images={repairImages} onRemove={(i) => setRepairImages((p) => p.filter((_, idx) => idx !== i))} />
                  </FormField>
                </>
              )}

              {service === "refurbishment" && (
                <FormField label="Select Services" required hint="Rate card · per piece">
                  <div className="flex flex-col gap-2 mt-1.5">
                    {REFURB_RATECARD.map((o) => {
                      const on = refurbItems.includes(o.name);
                      return (
                        <div key={o.name} onClick={() => setRefurbItems((p) => on ? p.filter((n) => n !== o.name) : [...p, o.name])}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all border-[1.5px]"
                          style={{ border: `1.5px solid ${on ? "var(--gold)" : "var(--border-color)"}`, background: on ? "var(--gold-light)" : "white" }}>
                          <span className="text-[14px] font-medium text-[var(--charcoal)]">{on ? "✓ " : ""}{o.name}</span>
                          <span className="font-bold text-[var(--gold-accent)]">₹{o.price.toLocaleString("en-IN")}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between mt-3 pt-3 border-t border-dashed border-[var(--border-color)]">
                    <span className="font-semibold">Estimated Total</span>
                    <span className="font-serif text-[20px] font-bold text-[var(--gold-accent)]">{fmtINR(refurbTotal)}</span>
                  </div>
                </FormField>
              )}

              {service === "gold_loan" && (
                <>
                  <div className="p-4 rounded-xl mb-4" style={{ background: "var(--gold-light)" }}>
                    <div className="label-caps mb-2">Collateral Basis</div>
                    <div className="flex justify-between text-[13px]">
                      <span className="text-[var(--sec)]">Gold value (net wt × rate)</span>
                      <span className="font-semibold">{fmtINR(mv)}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-[13px]">
                      <span className="text-[var(--sec)]">Approx. eligibility (60%)</span>
                      <span className="font-bold text-[var(--gold-accent)]">{fmtINR(maxLoan)}</span>
                    </div>
                  </div>
                  <FormField label="Desired Loan Amount (₹)" required hint={`Cannot exceed ${fmtINR(maxLoan)}`}>
                    <Input type="number" value={loanAmt} onChange={(e) => setLoanAmt(e.target.value)} placeholder={`Up to ${fmtINR(maxLoan)}`} />
                  </FormField>
                  <FormField label="Tenure">
                    <Select value={loanTenure} onChange={(e) => setLoanTenure(e.target.value)}>
                      {LOAN_TENURES.map((t) => <option key={t}>{t}</option>)}
                    </Select>
                  </FormField>
                </>
              )}

              {(service === "appraisal_purity" || service === "refurbishment") && (
                <>
                  <FormField label="Visit Type">
                    <Chips options={VISIT_TYPES.map((v) => ({ label: v, value: v }))} active={visitType} onChange={setVisitType} />
                  </FormField>
                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Preferred Date">
                      <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </FormField>
                    <FormField label="Time Slot">
                      <Select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                        {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                      </Select>
                    </FormField>
                  </div>
                  {visitType === "Home Visit" && (
                    <FormField label="Visit Address">
                      <Textarea value={address} onChange={(e) => setAddress(e.target.value)} />
                    </FormField>
                  )}
                </>
              )}

              <FormField label={`${svcObj.notesLabel} (max 500 chars)`}>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} placeholder={svcObj.notesPh} />
              </FormField>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                <Button onClick={() => {
                  if (service === "repair" && !repairIssue.trim()) { toast("Please describe the damage", "error"); return; }
                  if (service === "refurbishment" && !refurbItems.length) { toast("Select at least one service", "error"); return; }
                  if (service === "gold_loan") {
                    const v = parseFloat(loanAmt) || 0;
                    if (v <= 0) { toast("Enter a loan amount", "error"); return; }
                    if (v > maxLoan) { toast("Amount exceeds 60% eligibility", "error"); return; }
                  }
                  setStep(4);
                }}>Review →</Button>
              </div>
            </>
          )}

          {step === 4 && svcObj && assetObj && (
            <>
              <h4 className="font-serif text-[18px] mb-4">Confirm Request</h4>
              <Card className="p-4 mb-4">
                {[
                  ["Service", `${svcObj.ico} ${svcObj.name}`],
                  ["Asset", assetObj.name],
                  ...(service === "repair" ? [["Damage", repairIssue], ["Stage", "1 · Repairability Assessment"]] : []),
                  ...(service === "refurbishment" ? [["Services", refurbItems.join(", ") || "—"], ["Est. Total", fmtINR(refurbTotal)]] : []),
                  ...(service === "gold_loan" ? [["Loan Amount", fmtINR(parseFloat(loanAmt) || 0)], ["Tenure", loanTenure]] : []),
                  ...(visitType && svcObj.mode !== "loan" ? [["Visit Type", visitType], ["Appointment", `${date || "Flexible"}${timeSlot ? " · " + timeSlot : ""}`]] : []),
                  ["Est. TAT", svcObj.tat],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3 border-b border-[var(--border-color)] last:border-b-0 text-[13px]">
                    <span className="text-[var(--sec)]">{k}</span>
                    <span className="font-semibold text-[var(--charcoal)] text-right max-w-[60%]">{v}</span>
                  </div>
                ))}
                {notes && (
                  <div className="pt-3">
                    <div className="label-caps mb-1">Notes</div>
                    <p className="text-[13px]">{notes}</p>
                  </div>
                )}
              </Card>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
                <Button onClick={submit} disabled={saving}>{saving ? "Submitting…" : "Submit Request →"}</Button>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Service Marketplace</h3>
      <div className="grid grid-cols-4 gap-4 mb-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {Object.entries(SVC_TYPES).map(([k, v]) => (
          <Card key={k} className="p-5 flex flex-col">
            <div className="text-[32px] mb-2.5">{v.ico}</div>
            <h4 className="font-serif text-[18px] mb-1.5">{v.name}</h4>
            <p className="text-[13px] text-[var(--sec)] flex-1 mb-3.5 leading-relaxed">{v.desc}</p>
            <div className="text-[11px] text-[var(--muted)] mb-3">⏱ TAT: {v.tat}</div>
            <Button block size="sm" onClick={() => startRequest(k as ServiceType)}>Request</Button>
          </Card>
        ))}
      </div>

      <h3 className="font-serif text-[22px] mb-4">My Requests</h3>
      {db.tickets.length ? (
        <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[var(--gold-light)]">
                {["Ticket ID", "Service", "Asset", "Date", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {db.tickets.map((t) => {
                const a = db.assets.find((a) => a.asset_id === t.asset_id);
                return (
                  <tr key={t.ticket_id} className="cursor-pointer hover:bg-[var(--gold-light)] transition-colors"
                    onClick={() => router.push(`/customer/services/${t.ticket_id}`)}>
                    <td className="px-4 py-3.5 font-bold text-[13px] border-b border-[var(--border-color)]">{t.ticket_id}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{SVC_TYPES[t.service_type].name}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{a?.name || "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.created_at}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                      <TicketStatusBadge status={t.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">🛎️</div>
          <p>No service requests yet.</p>
        </div>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return <Suspense><ServicesContent /></Suspense>;
}