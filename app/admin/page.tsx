"use client";

import React from "react";
import Link from "next/link";
import { useAssets, useTickets, useTransactions, useAudit } from "@/hooks/useData";
import { MetricCard } from "@/components/ui/Card";
import { TicketStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { fmtINR, calcMarketValue } from "@/lib/utils";
import { SVC_TYPES } from "@/lib/data";

export default function AdminDashboard() {
  const { assets } = useAssets();
  const { tickets } = useTickets();
  const { transactions } = useTransactions();
  const { audit } = useAudit();

  const totalAUM = assets.reduce((s, a) => s + calcMarketValue(a), 0);
  const openTickets = tickets.filter((t) => !["closed", "cancelled"].includes(t.status)).length;
  const reportReady = tickets.filter((t) => t.status === "report_ready").length;
  const totalTransactions = transactions.reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div className="mb-5">
        <h2 className="font-serif text-[32px]">Dashboard</h2>
        <p className="text-[var(--sec)]">Platform overview — real-time vault and service summary.</p>
      </div>

      <div className="grid grid-cols-4 gap-5 mb-7 max-lg:grid-cols-2 max-sm:grid-cols-1">
        <MetricCard label="Platform AUM" value={fmtINR(totalAUM)} sub={`${assets.length} assets catalogued`} />
        <MetricCard label="Open Tickets" value={String(openTickets)} sub={`${reportReady} reports ready`} />
        <MetricCard label="Total Customers" value="1" sub="1 active vault" />
        <MetricCard label="Total Revenue" value={fmtINR(totalTransactions)} sub="All transactions" />
      </div>

      <div className="grid grid-cols-[1.5fr_1fr] gap-6 max-md:grid-cols-1">
        <div>
          <h4 className="font-serif text-[18px] mb-3">Recent Service Queue</h4>
          <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
            <table className="w-full border-collapse min-w-[520px]">
              <thead>
                <tr className="bg-[var(--gold-light)]">
                  {["Ticket", "Service", "Priority", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.slice(0, 5).map((t) => (
                  <tr key={t.ticket_id} className="cursor-pointer hover:bg-[var(--gold-light)]"
                    onClick={() => {}}>
                    <td className="px-4 py-3 font-bold text-[13px] border-b border-[var(--border-color)]">
                      <Link href={`/admin/queue/${t.ticket_id}`} className="hover:text-[var(--gold)]">{t.ticket_id}</Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] border-b border-[var(--border-color)]">{SVC_TYPES[t.service_type].name}</td>
                    <td className="px-4 py-3 text-[13px] border-b border-[var(--border-color)]"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3 text-[13px] border-b border-[var(--border-color)]"><TicketStatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-[18px] mb-3">Recent Audit</h4>
          <div className="bg-white border border-[var(--border-color)] rounded-xl shadow-[var(--sh-s)]">
            {audit.slice(0, 5).map((a, i) => (
              <div key={i} className="px-4 py-3 border-b border-[var(--border-color)] last:border-b-0">
                <div className="flex justify-between text-[12px] text-[var(--muted)] mb-0.5">
                  <span>{a.actor}</span>
                  <span>{a.ts}</span>
                </div>
                <div className="font-semibold text-[13px] text-[var(--charcoal)]">{a.action}</div>
                <div className="text-[12px] text-[var(--sec)]">{a.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
