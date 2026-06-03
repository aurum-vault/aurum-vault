"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { MetricCard } from "@/components/ui/Card";
import { RatesStrip } from "@/components/assets/RatesStrip";
import { AppFooter } from "@/components/layout/AppFooter";
import { Button } from "@/components/ui/Button";
import { calcMarketValue, fmtINR } from "@/lib/utils";

export default function CustomerHome() {
  const { db, reportByAsset } = useApp();
  const assets = db.assets;

  const totalVault = assets.reduce((s, a) => s + calcMarketValue(a), 0);
  const appraised = assets.filter((a) => reportByAsset(a.asset_id));
  const appraisedTotal = appraised.reduce((s, a) => {
    const r = reportByAsset(a.asset_id);
    return s + (r?.appraised_value ?? 0);
  }, 0);
  const nonAppraised = assets.filter((a) => !reportByAsset(a.asset_id));
  const nonAppraisedTotal = nonAppraised.reduce((s, a) => s + calcMarketValue(a), 0);

  const recentActivity = [
    { ico: "🏆", title: "Appraisal report ready", sub: "Grandmother's Choker certified at ₹3,40,000", time: "2 days ago" },
    { ico: "✨", title: "Refurbishment in progress", sub: "Diamond Earrings Set — clasp assessment", time: "5 days ago" },
    { ico: "➕", title: "Asset added to vault", sub: "Kundan Bangles ×6", time: "2 weeks ago" },
  ];

  const quickActions = [
    { ico: "➕", label: "Add Asset", href: "/customer/add-asset" },
    { ico: "💍", label: "My Collection", href: "/customer/collection" },
    { ico: "🛎️", label: "Request Service", href: "/customer/services" },
    { ico: "📍", label: "Track Status", href: "/customer/services" },
    { ico: "📄", label: "Documents", href: "/customer/documents" },
    { ico: "⚙️", label: "Profile", href: "/customer/profile" },
  ];

  return (
    <div>
      <div className="mb-2">
        <h2 className="font-serif text-[32px]">Good day, {db.customer.full_name.split(" ")[0]} 👋</h2>
        <p className="text-[var(--sec)]">Here&apos;s an overview of your precious asset vault.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mt-5 mb-6 max-md:grid-cols-1">
        <MetricCard
          label="Total Vault Value"
          value={fmtINR(totalVault)}
          sub={<span className="text-[var(--green)]">▲ 2.4% from last month</span>}
        />
        <MetricCard
          label={<>Total Appraised Value <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[rgba(26,107,58,0.12)] text-[var(--green)] ml-1.5">Certified</span></>}
          value={fmtINR(appraisedTotal)}
          sub={`${appraised.length} of ${assets.length} assets appraised`}
        />
        <MetricCard
          label="Non-Appraised Value"
          value={fmtINR(nonAppraisedTotal)}
          sub={`${nonAppraised.length} assets pending`}
          action={<Link href="/customer/services"><Button size="sm">Request Service</Button></Link>}
        />
      </div>

      <RatesStrip />

      <h4 className="font-serif text-[18px] mb-3.5">Quick Actions</h4>
      <div className="grid grid-cols-6 gap-3.5 mb-6 max-md:grid-cols-3 max-sm:grid-cols-2">
        {quickActions.map((a) => (
          <Link key={a.label} href={a.href}>
            <div className="bg-white border border-[var(--border-color)] rounded-xl p-4 text-center cursor-pointer transition-all shadow-[var(--sh-s)] hover:border-[var(--border-active)] hover:-translate-y-0.5 hover:shadow-[var(--sh-m)]">
              <div className="text-[26px] mb-2">{a.ico}</div>
              <div className="text-[12px] font-semibold text-[var(--body-color)]">{a.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <h4 className="font-serif text-[18px] mb-3.5">Recent Activity</h4>
      <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-[var(--sh-s)]">
        {recentActivity.map((r, i) => (
          <div key={i} className="flex gap-3 items-center px-5 py-3 border-b border-[var(--border-color)] last:border-b-0">
            <div className="text-[22px]">{r.ico}</div>
            <div className="flex-1">
              <div className="font-semibold text-[var(--charcoal)] text-[13px]">{r.title}</div>
              <div className="text-[12px] text-[var(--muted)]">{r.sub}</div>
            </div>
            <div className="text-[11px] text-[var(--muted)]">{r.time}</div>
          </div>
        ))}
      </div>

      <AppFooter links={{
        vault: [
          { label: "My Collection", onClick: () => {} },
          { label: "Add Asset", onClick: () => {} },
          { label: "Documents", onClick: () => {} },
        ],
        services: [
          { label: "Appraisal & Purity", onClick: () => {} },
          { label: "Repair Assessment", onClick: () => {} },
          { label: "Refurbishment", onClick: () => {} },
          { label: "Gold Loan", onClick: () => {} },
        ],
        account: [
          { label: "Profile & Security", onClick: () => {} },
          { label: "Help Centre", onClick: () => {} },
        ],
      }} />
    </div>
  );
}
