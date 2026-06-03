"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/Badge";

export default function AdminAuditPage() {
  const { db } = useApp();

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="font-serif text-[22px]">Audit Log</h3>
        <Badge variant="grey">Read-only · Immutable</Badge>
      </div>
      <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[var(--gold-light)]">
              {["Timestamp", "Actor", "Action", "Entity", "Detail"].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {db.audit.map((a, i) => (
              <tr key={i}>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)] text-[var(--muted)]">{a.ts}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{a.actor}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)] font-bold">{a.action}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)] font-semibold text-[var(--gold)]">{a.entity}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)] text-[var(--sec)]">{a.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
