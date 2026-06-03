"use client";

import React from "react";
import type { Asset } from "@/lib/types";
import { fmtINR, calcMarketValue, catIcon, locIcon } from "@/lib/utils";
import { AssetStatusBadge } from "@/components/ui/Badge";

interface AssetCardProps {
  asset: Asset;
  appraisedValue?: number | null;
  onClick?: () => void;
  onRequestService?: () => void;
  onCapture?: () => void;
  showCta?: boolean;
}

export function AssetCard({
  asset: a,
  appraisedValue,
  onClick,
  onRequestService,
  onCapture,
  showCta = true,
}: AssetCardProps) {
  const value = appraisedValue ?? calcMarketValue(a);
  const isCertified = appraisedValue != null;

  return (
    <div
      className="bg-white border border-[var(--border-color)] rounded-[18px] overflow-hidden shadow-[var(--sh-s)] cursor-pointer transition-all flex flex-col hover:shadow-[var(--sh-m)] hover:-translate-y-1 hover:border-[var(--border-active)]"
      onClick={onClick}
    >
      {/* Image area */}
      <div className="relative asset-img-shimmer flex flex-col items-center justify-center overflow-hidden gap-2.5"
        style={{ aspectRatio: "1.45/1" }}>
        {a.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={a.images[0]} alt={a.name} className="w-full h-full object-cover absolute inset-0" />
        ) : (
          <>
            <span className="text-[54px] drop-shadow-[0_4px_10px_rgba(138,94,10,0.25)]">
              {catIcon(a.category)}
            </span>
            <span className="text-[10px] tracking-[2px] uppercase font-bold text-[var(--gold)] bg-white/70 px-3 py-1 rounded-full backdrop-blur-sm">
              {a.category.split("/")[0]}
            </span>
          </>
        )}
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[rgba(26,18,0,0.72)] text-white px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.5px] backdrop-blur-[6px] z-[2]">
          {locIcon(a.location_type)} {a.location_type}
        </span>
        {onCapture && (
          <button
            className="absolute bottom-3 right-3 w-[38px] h-[38px] rounded-full bg-white/92 text-[var(--gold)] flex items-center justify-center text-[16px] shadow-[var(--sh-s)] transition-all z-[2] hover:bg-white hover:text-[var(--gold-accent)] hover:scale-110"
            onClick={(e) => { e.stopPropagation(); onCapture(); }}
            title="Add photo"
          >
            📷
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-1 flex-1">
        <div className="text-[11px] tracking-[1px] text-[var(--muted)] font-semibold">{a.asset_id}</div>
        <div className="font-serif font-bold text-[22px] text-[var(--charcoal)] leading-tight my-1">{a.name}</div>
        <div className="text-[13px] text-[var(--body-color)] flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[var(--gold-accent)] flex-shrink-0" />
          {a.metal} · {a.purity.split("(")[0].trim()}
        </div>
        <div className="text-[13px] text-[var(--sec)]">
          Weight: <strong className="text-[var(--charcoal)]">{a.net}g</strong> net
        </div>

        <hr className="border-dashed border-[var(--border-color)] my-3" />

        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-[10px] tracking-[1.5px] uppercase text-[var(--muted)] font-bold">
              {isCertified ? "Appraised" : "Market Est."}
            </div>
            <div className="font-serif text-[26px] font-bold text-[var(--gold-accent)] leading-none">{fmtINR(value)}</div>
            {isCertified ? (
              <div className="text-[12px] text-[var(--green)] font-semibold mt-1">✓ Certified value</div>
            ) : (
              <div className="text-[12px] text-[var(--muted)] mt-1">Est. {fmtINR(calcMarketValue(a))}</div>
            )}
          </div>
          <AssetStatusBadge status={a.status} />
        </div>

        {showCta && onRequestService && (
          <button
            className="mt-3.5 w-full p-2.5 rounded-[10px] border-[1.5px] border-[var(--gold)] text-[var(--gold)] bg-transparent text-[12px] font-semibold tracking-[1px] uppercase transition-all flex items-center justify-center gap-1.5 hover:bg-gradient-to-r hover:from-[#7a4e08] hover:to-[#b8860b] hover:text-white hover:border-transparent"
            onClick={(e) => { e.stopPropagation(); onRequestService(); }}
          >
            🛎️ Request Service
          </button>
        )}
      </div>
    </div>
  );
}
