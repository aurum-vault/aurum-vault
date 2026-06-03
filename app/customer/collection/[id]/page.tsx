"use client";

import React, { useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Tabs } from "@/components/ui/Tabs";
import { Badge, AssetStatusBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/ui/Timeline";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { UploadZone, ImageThumbs } from "@/components/ui/UploadZone";
import { fmtINR, calcMarketValue, catIcon, locIcon, metalIcon } from "@/lib/utils";
import { SVC_TYPES } from "@/lib/data";

const ASSET_TABS = [
  { value: "details", label: "Details" },
  { value: "documents", label: "Documents" },
  { value: "appraisal", label: "Appraisal Report" },
  { value: "activity", label: "Activity" },
  { value: "service", label: "Service History" },
];

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { db, setDb, assetById, reportByAsset, toast } = useApp();
  const router = useRouter();
  const [tab, setTab] = useState("details");

  const asset = assetById(id);
  if (!asset) return <div className="text-center py-12 text-[var(--muted)]">Asset not found.</div>;

  const rep = reportByAsset(id);
  const assetDocs = db.documents.filter((d) => d.asset_id === id);
  const assetTickets = db.tickets.filter((t) => t.asset_id === id);

  const addImages = (imgs: string[]) => {
    setDb((prev) => ({
      ...prev,
      assets: prev.assets.map((a) =>
        a.asset_id === id ? { ...a, images: [...a.images, ...imgs] } : a
      ),
    }));
    toast("Photo added", "success");
  };

  const persBadge = { customer: "Customer", heritage: "Heritage", appraiser: "Appraiser" }[asset.perspective] || "";

  return (
    <div>
      <Link href="/customer/collection" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-4 cursor-pointer">
        ← Back to Collection
      </Link>

      <div className="grid grid-cols-[300px_1fr] gap-7 items-start max-md:grid-cols-1">
        {/* Media */}
        <div className="lg:sticky lg:top-[84px]">
          <div className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center shadow-[var(--sh-s)]"
            style={{ background: "linear-gradient(135deg,#f5e6c8,#e8d098)" }}>
            {asset.images.length ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={asset.images[0]} alt={asset.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[80px] opacity-60">{catIcon(asset.category)}</span>
            )}
          </div>
          {asset.images.length > 1 && (
            <div className="flex gap-2 flex-wrap mt-2.5">
              {asset.images.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={img} alt="" className="w-[54px] h-[54px] rounded-lg object-cover border border-[var(--border-color)] cursor-pointer" />
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-2.5">
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => {}}>📷 Capture</Button>
            <Button variant="ghost" size="sm" className="flex-1" onClick={() => {}}>📁 Upload</Button>
          </div>
          <UploadZone onFiles={addImages} className="mt-2.5 hidden" />
          <div className="mt-3 p-2.5 rounded-xl text-[13px]" style={{ background: "var(--gold-light)" }}>
            <div className="text-[10px] tracking-[1px] uppercase text-[var(--muted)] font-bold">Current Location</div>
            <div className="font-semibold text-[var(--charcoal)] mt-0.5">{locIcon(asset.location_type)} {asset.location_type}</div>
          </div>
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="text-[var(--gold)] text-[12px] font-semibold tracking-[1px]">{asset.asset_id}</div>
              <h2 className="font-serif text-[32px] my-0.5">{asset.name}</h2>
              <div className="text-[var(--sec)] text-[14px]">{metalIcon(asset.metal)} {asset.metal} · {asset.purity}</div>
            </div>
            <Link href={`/customer/services?asset=${asset.asset_id}`}>
              <Button size="sm">🛎️ Request Service</Button>
            </Link>
          </div>

          <div className="flex gap-2 flex-wrap my-2">
            <Badge variant="gold">{asset.category}</Badge>
            <Badge variant="blue">{persBadge}</Badge>
            <AssetStatusBadge status={asset.status} />
          </div>

          <div className="grid grid-cols-3 gap-3 my-3.5">
            {[
              { label: "Market Value", val: fmtINR(calcMarketValue(asset)), color: "var(--gold-accent)" },
              { label: "Purchase Value", val: fmtINR(asset.purchase_price), color: "" },
              { label: "Appraised Value", val: rep ? fmtINR(rep.appraised_value) : "Not Yet Appraised", color: rep ? "var(--green)" : "var(--amber)" },
            ].map((v) => (
              <div key={v.label} className="border border-[var(--border-color)] rounded-xl p-3.5 bg-white">
                <div className="text-[10px] tracking-[1px] uppercase text-[var(--muted)] font-bold">{v.label}</div>
                <div className="font-serif text-[22px] font-bold mt-1" style={{ color: v.color || "var(--charcoal)", fontSize: rep ? 22 : 15 }}>{v.val}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-7 mb-4">
            {[
              ["Gross Weight", `${asset.gross}g`],
              ["Deduction", `${asset.deduction}g`],
              ["Net Weight", `${asset.net}g`],
              ["Last Verified", asset.last_verified || "—"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-[var(--border-color)] text-[13px]">
                <span className="text-[var(--sec)]">{k}</span>
                <span className="font-semibold text-[var(--charcoal)]">{v}</span>
              </div>
            ))}
          </div>

          <Tabs tabs={ASSET_TABS} active={tab} onChange={setTab} />

          {/* Tab content */}
          {tab === "details" && (
            <Card className="p-5 px-6">
              <div className="grid grid-cols-2 gap-x-7">
                {[
                  ["Category", asset.category], ["Perspective", asset.perspective],
                  ["Metal", asset.metal], ["Purity", asset.purity],
                  ["HUID", asset.huid || "—"], ["Purchased From", asset.purchased_from || "—"],
                  ["Purchase Date", asset.purchase_date || "—"], ["Invoice Ref", asset.invoice_ref || "—"],
                  ["Occasion", asset.occasion || "—"], ["Gifted By", asset.gifted_by || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-[var(--border-color)] text-[13px]">
                    <span className="text-[var(--sec)]">{k}</span>
                    <span className="font-semibold text-[var(--charcoal)] text-right max-w-[50%]">{v}</span>
                  </div>
                ))}
              </div>
              {asset.provenance && (
                <div className="mt-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-2">Provenance / Family Story</div>
                  <p className="italic text-[var(--body-color)] leading-relaxed">{asset.provenance}</p>
                </div>
              )}
            </Card>
          )}

          {tab === "documents" && (
            assetDocs.length ? (
              <Card>
                {assetDocs.map((d) => {
                  const icons: Record<string, string> = { invoice: "🧾", hallmark: "🏅", appraisal: "🏆", other: "📎" };
                  const colors: Record<string, string> = { verified: "green", pending: "amber", rejected: "red" };
                  return (
                    <div key={d.document_id} className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border-color)] last:border-b-0">
                      <span className="text-[24px]">{icons[d.type] || "📄"}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--charcoal)] text-[13px]">{d.filename}</div>
                        <div className="text-[12px] text-[var(--muted)]">{d.date}</div>
                      </div>
                      <Badge variant={colors[d.status] as "green" | "amber" | "red"}>{d.status}</Badge>
                      <button className="btn btn-outline border-[var(--gold)] text-[var(--gold)] btn-xs" onClick={() => toast(`Downloading ${d.filename}`, "warn")}>⬇</button>
                    </div>
                  );
                })}
              </Card>
            ) : (
              <div className="text-center py-12 text-[var(--muted)]">
                <div className="text-[54px] mb-3.5 opacity-50">📄</div>
                <p>No documents uploaded for this asset.</p>
              </div>
            )
          )}

          {tab === "appraisal" && (
            rep ? (
              <Card className="p-6">
                <div className="flex justify-between items-start flex-wrap gap-3 mb-4">
                  <div>
                    <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold">Appraised Value</div>
                    <div className="font-serif text-[36px] font-bold text-[var(--green)]">{fmtINR(rep.appraised_value)}</div>
                  </div>
                  <Badge variant="green">{rep.status.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</Badge>
                </div>
                <div className="flex gap-6 flex-wrap text-[13px] text-[var(--sec)] mb-4">
                  <span>📅 {rep.appraised_at}</span>
                  <span>👤 Vault Specialist</span>
                  <span>🔖 {rep.certificate_ref}</span>
                </div>
                <div className="text-[11px] tracking-[2px] uppercase text-[var(--muted)] font-semibold mb-2">Appraisal Notes</div>
                <p className="leading-relaxed mb-4">{rep.notes}</p>
                <Button size="sm" onClick={() => toast("Certificate download coming soon", "default")}>📜 View / Download Certificate</Button>
              </Card>
            ) : (
              <div className="text-center py-12 text-[var(--muted)]">
                <div className="text-[54px] mb-3.5 opacity-50">🏆</div>
                <p>No appraisal has been conducted for this asset yet.</p>
                <Link href="/customer/services" className="inline-block mt-3.5">
                  <Button size="sm">Request Appraisal Service</Button>
                </Link>
              </div>
            )
          )}

          {tab === "activity" && (
            <Card className="p-5">
              <Timeline steps={[
                { label: "Asset added to vault", sub: asset.created_at, state: "done" },
                ...(asset.status === "verified" ? [{ label: "Asset verified by team", sub: "After document review", state: "done" as const }] : []),
                ...(rep ? [{ label: "Appraisal completed", sub: `${rep.appraised_at} · ${fmtINR(rep.appraised_value)}`, state: "done" as const }] : []),
                { label: "Last verified", sub: asset.last_verified || "—", state: "active" },
              ]} />
            </Card>
          )}

          {tab === "service" && (
            assetTickets.length ? (
              <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--gold-light)]">
                      {["Ticket", "Service", "Date", "Status"].map((h) => (
                        <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {assetTickets.map((t) => (
                      <tr key={t.ticket_id} className="cursor-pointer hover:bg-[var(--gold-light)]"
                        onClick={() => router.push(`/customer/services/${t.ticket_id}`)}>
                        <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.ticket_id}</td>
                        <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{SVC_TYPES[t.service_type].name}</td>
                        <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.created_at}</td>
                        <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                          <Badge variant={({ submitted: "grey", assigned: "blue", in_progress: "amber", awaiting_info: "amber", quote_ready: "blue", awaiting_payment: "amber", report_ready: "green", closed: "grey", cancelled: "red" } as Record<string, "grey" | "blue" | "amber" | "green" | "red">)[t.status] || "grey"}>
                            {t.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-[var(--muted)]">
                <div className="text-[54px] mb-3.5 opacity-50">🛎️</div>
                <p>No service requests for this asset.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
