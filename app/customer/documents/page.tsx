"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { useDocuments, useAssets } from "@/hooks/useData";
import { Badge } from "@/components/ui/Badge";
import { Select } from "@/components/ui/FormField";

const DOC_ICONS: Record<string, string> = { invoice: "🧾", hallmark: "🏅", appraisal: "🏆", other: "📎" };
const DOC_COLORS: Record<string, "green" | "amber" | "red"> = { verified: "green", pending: "amber", rejected: "red" };

export default function DocumentsPage() {
  const { toast } = useApp();
  const { documents } = useDocuments();
  const { assets } = useAssets();
  const [filterAsset, setFilterAsset] = useState("All");
  const [filterType, setFilterType] = useState("All");

  let docs = documents.slice();
  if (filterAsset !== "All") docs = docs.filter((d) => d.asset_id === filterAsset);
  if (filterType !== "All") docs = docs.filter((d) => d.type === filterType);

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Document Vault</h3>
      <div className="flex gap-3 flex-wrap mb-5">
        <Select className="w-auto" value={filterAsset} onChange={(e) => setFilterAsset(e.target.value)}>
          <option value="All">All Assets</option>
          {assets.map((a) => <option key={a.asset_id} value={a.asset_id}>{a.name}</option>)}
        </Select>
        <Select className="w-auto" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="All">All Types</option>
          <option value="invoice">Invoice</option>
          <option value="hallmark">Hallmark</option>
          <option value="appraisal">Appraisal</option>
          <option value="other">Other</option>
        </Select>
      </div>

      {docs.length ? (
        <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-[var(--sh-s)]">
          {docs.map((d) => {
            const asset = assets.find((a) => a.asset_id === d.asset_id);
            return (
              <div key={d.document_id} className="flex items-center gap-3 px-5 py-3 border-b border-[var(--border-color)] last:border-b-0">
                <span className="text-[24px]">{DOC_ICONS[d.type] || "📄"}</span>
                <div className="flex-1">
                  <div className="font-semibold text-[var(--charcoal)] text-[13px]">{d.filename}</div>
                  <div className="text-[12px] text-[var(--muted)]">{asset?.name || ""} · {d.date}</div>
                </div>
                <Badge variant={DOC_COLORS[d.status] || "grey"}>{d.status}</Badge>
                <button className="btn btn-outline border-[var(--gold)] text-[var(--gold)] btn-xs" onClick={() => toast(`Downloading ${d.filename}`, "warn")}>⬇</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">📄</div>
          <p>No documents match your filters.</p>
        </div>
      )}
    </div>
  );
}