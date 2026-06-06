"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { Button } from "@/components/ui/Button";
import { FormField, Input, Select, Textarea } from "@/components/ui/FormField";
import { Chips } from "@/components/ui/Chips";
import { RadioCardGroup } from "@/components/ui/RadioCard";
import { UploadZone, ImageThumbs } from "@/components/ui/UploadZone";
import { Card } from "@/components/ui/Card";
import { PURITY_MAP, LOCATION_TYPES, ASSET_CATEGORIES } from "@/lib/data";
import { fmtINR, calcMarketValue, catIcon } from "@/lib/utils";
import type { Asset, Perspective, LocationType } from "@/lib/types";

const STEPS = [
  { label: "Identity & Story" },
  { label: "Metal & Purity" },
  { label: "Images" },
  { label: "Location" },
  { label: "Documents" },
];

const PERSPECTIVES = [
  { value: "customer", label: "Customer" },
  { value: "appraiser", label: "Appraiser" },
  { value: "heritage", label: "Heritage" },
];

interface FormData {
  name: string; category: string; perspective: Perspective;
  provenance: string; occasion: string; description: string;
  metal: string; purity: string; purityCustom: string; huid: string;
  gross: number; deduction: number; net: number; estVal: number;
  location_type: LocationType; l1: string; l2: string; l3: string;
  last_verified: string; locnotes: string;
  purchased_from: string; purchase_date: string; purchase_price: number; invoice_ref: string;
}

export default function AddAssetPage() {
  const { rates, toast, apiAddAsset } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Asset | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<FormData>({
    name: "", category: "", perspective: "customer",
    provenance: "", occasion: "", description: "",
    metal: "", purity: "", purityCustom: "", huid: "",
    gross: 0, deduction: 0, net: 0, estVal: 0,
    location_type: "With Me", l1: "", l2: "", l3: "",
    last_verified: "", locnotes: "",
    purchased_from: "", purchase_date: "", purchase_price: 0, invoice_ref: "",
  });

  const set = (k: keyof FormData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const calcWeight = () => {
    const net = Math.max(0, (form.gross || 0) - (form.deduction || 0));
    const m = form.metal.toLowerCase();
    let r = rates.gold;
    if (m.includes("silver")) r = rates.silver;
    else if (m.includes("platinum")) r = rates.platinum;
    setForm((f) => ({ ...f, net, estVal: Math.round(net * r) }));
  };

  const validate1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Asset name is required";
    if (!form.category) e.category = "Please select a category";
    if (form.perspective === "heritage" && !form.provenance.trim()) e.provenance = "Heritage assets need a provenance story";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const validate2 = () => {
    const e: Record<string, string> = {};
    if (!form.metal) e.metal = "Select metal type";
    if (!form.purity) e.purity = "Select purity";
    if (!form.gross) e.gross = "Gross weight is required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const next = () => {
    if (step === 1 && !validate1()) return;
    if (step === 2 && !validate2()) return;
    setErrors({});
    setStep((s) => s + 1);
  };

  const submit = async () => {
    setSaving(true);
    try {
      const locationDetail: Record<string, string> = {};
      if (form.location_type === "Bank Locker") {
        if (form.l1) locationDetail.bank = form.l1;
        if (form.l2) locationDetail.branch = form.l2;
        if (form.l3) locationDetail.locker = form.l3;
      } else if (form.location_type === "With Family Member") {
        if (form.l1) locationDetail.name = form.l1;
        if (form.l2) locationDetail.relationship = form.l2;
      }

      const asset = await apiAddAsset({
        name:           form.name,
        category:       form.category,
        perspective:    form.perspective,
        metal:          form.metal,
        purity:         form.purity || form.purityCustom || "—",
        huid:           form.huid || undefined,
        gross:          form.gross,
        deduction:      form.deduction,
        net:            form.net,
        purchase_price: form.purchase_price,
        purchase_date:  form.purchase_date || undefined,
        purchased_from: form.purchased_from || undefined,
        invoice_ref:    form.invoice_ref || undefined,
        provenance:     form.provenance || undefined,
        occasion:       form.occasion || undefined,
        location_type:  form.location_type,
        location_detail: locationDetail,
        images,
      });
      setSubmitted(asset);
      toast("Asset added to vault", "success");
    } catch {
      toast("Failed to add asset — please try again", "error");
    } finally {
      setSaving(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-[520px] mx-auto text-center pt-5">
        <div className="text-[60px]">✅</div>
        <h3 className="font-serif text-[24px] mt-3 mb-2">Added to Your Vault!</h3>
        <p className="text-[var(--sec)] mb-5">{submitted.name} has been securely added.</p>
        <Card className="p-5 text-left mb-5">
          <div className="flex gap-3.5">
            <div className="text-[40px]">{catIcon(submitted.category)}</div>
            <div>
              <div className="font-bold text-[16px] text-[var(--charcoal)]">{submitted.name}</div>
              <div className="text-[var(--sec)] text-[13px]">{submitted.metal} · {submitted.purity}</div>
              <div className="font-serif text-[20px] text-[var(--gold-accent)] font-bold mt-1">{fmtINR(calcMarketValue(submitted))}</div>
            </div>
          </div>
        </Card>
        <div className="flex gap-2.5 flex-wrap justify-center">
          <Link href={`/customer/collection/${submitted.asset_id}`}><Button variant="ghost" size="sm">View Asset</Button></Link>
          <Button variant="ghost" size="sm" onClick={() => { setSubmitted(null); setStep(1); setImages([]); }}>Add Another</Button>
          <Link href="/customer/services"><Button size="sm">Request Appraisal</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link href="/customer/collection" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-4 cursor-pointer">← Back to Collection</Link>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-serif text-[22px]">Add New Asset</h3>
        <span className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold">Step {step} of 5</span>
      </div>

      <StepIndicator steps={STEPS} current={step} className="mb-6" />

      <Card className="p-6 max-w-[680px]">
        {step === 1 && (
          <>
            <h4 className="font-serif text-[18px] mb-4">Asset Identity</h4>
            <FormField label="Asset Name" required error={errors.name}>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Grandmother's Choker" error={!!errors.name} />
            </FormField>
            <FormField label="Category" required error={errors.category}>
              <Select value={form.category} onChange={(e) => set("category", e.target.value)} error={!!errors.category}>
                <option value="">Select category…</option>
                {ASSET_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Product Perspective">
              <Chips options={PERSPECTIVES} active={form.perspective} onChange={(v) => set("perspective", v as Perspective)} />
              <span className="text-[11px] text-[var(--muted)] block mt-1.5">
                {form.perspective === "heritage" ? "Legacy & provenance focus" : form.perspective === "appraiser" ? "Professional assessment focus" : "Personal wealth focus"}
              </span>
            </FormField>
            <FormField label={`Provenance / Family Story${form.perspective === "heritage" ? " *" : ""}`} error={errors.provenance}>
              <Textarea value={form.provenance} onChange={(e) => set("provenance", e.target.value)} placeholder="Who owned this? When was it acquired? Is it a gift or inheritance?" error={!!errors.provenance} />
            </FormField>
            <FormField label="Occasion / Gifted By">
              <Input value={form.occasion} onChange={(e) => set("occasion", e.target.value)} placeholder="e.g. Wedding, gifted by mother" />
            </FormField>
            <div className="flex justify-end"><Button onClick={next}>Continue →</Button></div>
          </>
        )}

        {step === 2 && (
          <>
            <h4 className="font-serif text-[18px] mb-4">Metal, Quality &amp; Purity</h4>
            <FormField label="Metal Type" required error={errors.metal}>
              <Select value={form.metal} onChange={(e) => { set("metal", e.target.value); set("purity", ""); }} error={!!errors.metal}>
                <option value="">Select metal…</option>
                {Object.keys(PURITY_MAP).map((m) => <option key={m}>{m}</option>)}
              </Select>
            </FormField>
            <FormField label="Purity / Quality" required error={errors.purity}>
              <Select value={form.purity} onChange={(e) => set("purity", e.target.value)} disabled={!form.metal} error={!!errors.purity}>
                <option value="">{form.metal ? "Select purity…" : "Select metal first"}</option>
                {(PURITY_MAP[form.metal] || []).map((p) => <option key={p}>{p}</option>)}
              </Select>
            </FormField>
            {form.metal === "Other" && (
              <FormField label="Custom Purity">
                <Input value={form.purityCustom} onChange={(e) => set("purityCustom", e.target.value)} placeholder="Describe purity/grade" />
              </FormField>
            )}
            <FormField label="HUID" hint="6-character Hallmark Unique ID, if hallmarked">
              <Input value={form.huid} onChange={(e) => set("huid", e.target.value)} placeholder="e.g. HUID-AZ4K9P" maxLength={20} />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField label="Gross Weight (g)" required error={errors.gross}>
                <Input type="number" step={0.001} value={form.gross || ""} onChange={(e) => { set("gross", parseFloat(e.target.value) || 0); calcWeight(); }} placeholder="0.000" error={!!errors.gross} />
              </FormField>
              <FormField label="Stone/Setting Deduction (g)">
                <Input type="number" step={0.001} value={form.deduction || ""} onChange={(e) => { set("deduction", parseFloat(e.target.value) || 0); calcWeight(); }} placeholder="0.000" />
              </FormField>
            </div>
            <FormField label="Net Metal Weight (g)">
              <Input type="number" value={form.net || ""} readOnly placeholder="auto-calculated" className="bg-[var(--gold-light)]" />
            </FormField>
            <div className="p-4 rounded-xl mb-4" style={{ background: "var(--gold-light)" }}>
              <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold">Estimated Value</div>
              <div className="font-serif text-[24px] font-bold text-[var(--gold-accent)]">{fmtINR(form.estVal || 0)}</div>
              <div className="text-[11px] text-[var(--muted)]">Based on today&apos;s rate</div>
            </div>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button onClick={next}>Continue →</Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h4 className="font-serif text-[18px] mb-2">Visual Documentation</h4>
            <p className="text-[var(--sec)] text-[13px] mb-4">Upload or capture photos of your asset. Clear images enable accurate appraisals.</p>
            <UploadZone onFiles={(imgs) => setImages((prev) => [...prev, ...imgs].slice(0, 8))} />
            <ImageThumbs images={images} onRemove={(i) => setImages((prev) => prev.filter((_, idx) => idx !== i))} />
            <div className="flex justify-between mt-4">
              <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
              <Button onClick={() => setStep(4)}>Continue →</Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h4 className="font-serif text-[18px] mb-2">Asset Location</h4>
            <RadioCardGroup
              options={LOCATION_TYPES.map((l) => ({ value: l.value, icon: l.icon, title: l.value, desc: l.desc }))}
              value={form.location_type} onChange={(v) => set("location_type", v as LocationType)}
              className="mb-4" />
            {form.location_type === "Bank Locker" && (
              <>
                <FormField label="Bank Name"><Input value={form.l1} onChange={(e) => set("l1", e.target.value)} /></FormField>
                <FormField label="Branch/Location"><Input value={form.l2} onChange={(e) => set("l2", e.target.value)} /></FormField>
                <FormField label="Locker Number (optional)"><Input value={form.l3} onChange={(e) => set("l3", e.target.value)} /></FormField>
              </>
            )}
            {form.location_type === "With Family Member" && (
              <>
                <FormField label="Family Member Name"><Input value={form.l1} onChange={(e) => set("l1", e.target.value)} /></FormField>
                <FormField label="Relationship"><Input value={form.l2} onChange={(e) => set("l2", e.target.value)} /></FormField>
              </>
            )}
            <FormField label="Date of Last Physical Verification">
              <Input type="date" value={form.last_verified} onChange={(e) => set("last_verified", e.target.value)} />
            </FormField>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(3)}>← Back</Button>
              <Button onClick={() => setStep(5)}>Continue →</Button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <h4 className="font-serif text-[18px] mb-4">Purchase &amp; Documents</h4>
            <FormField label="Purchased From"><Input value={form.purchased_from} onChange={(e) => set("purchased_from", e.target.value)} placeholder="Jeweller / source" /></FormField>
            <FormField label="Purchase Date"><Input type="date" value={form.purchase_date} onChange={(e) => set("purchase_date", e.target.value)} /></FormField>
            <FormField label="Purchase Price (₹)"><Input type="number" value={form.purchase_price || ""} onChange={(e) => set("purchase_price", parseFloat(e.target.value) || 0)} placeholder="0" /></FormField>
            <FormField label="Invoice Reference"><Input value={form.invoice_ref} onChange={(e) => set("invoice_ref", e.target.value)} placeholder="Invoice no." /></FormField>
            <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-2.5 mt-4">Supporting Documents (optional)</div>
            {["Purchase Invoice", "BIS Hallmark Certificate", "Previous Appraisal Report", "Insurance Document", "Other Document"].map((doc) => (
              <div key={doc} className="flex items-center justify-between px-3.5 py-2.5 border border-[var(--border-color)] rounded-lg mb-2">
                <span className="text-[13px]">📎 {doc}</span>
                <Button variant="ghost" size="sm" onClick={() => toast(`${doc} uploaded`, "success")}>Upload</Button>
              </div>
            ))}
            <div className="flex justify-between mt-4">
              <Button variant="ghost" onClick={() => setStep(4)}>← Back</Button>
              <Button onClick={submit} disabled={saving}>{saving ? "Saving…" : "Add to Vault →"}</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
