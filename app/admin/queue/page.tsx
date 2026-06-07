"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTickets, useAssets, useStaff } from "@/hooks/useData";
import { TicketStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { Tabs } from "@/components/ui/Tabs";
import { Chips } from "@/components/ui/Chips";
import { SVC_TYPES, STATUS_LABELS } from "@/lib/data";
import type { TicketStatus, ServiceType } from "@/lib/types";

const STATUS_TABS = [
  { value: "All", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "report_ready", label: "Report Ready" },
  { value: "closed", label: "Closed" },
];

export default function AdminQueuePage() {
  const { tickets } = useTickets();
  const { assets } = useAssets();
  const { staff } = useStaff();
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("All");
  const [svcFilter, setSvcFilter] = useState("All");

  let list = tickets.slice();
  if (statusFilter !== "All") list = list.filter((t) => t.status === statusFilter);
  if (svcFilter !== "All") list = list.filter((t) => t.service_type === svcFilter);

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Service Queue</h3>
      <Tabs tabs={STATUS_TABS} active={statusFilter} onChange={setStatusFilter} />
      <Chips className="mb-4"
        options={[{ label: "All Services", value: "All" }, ...Object.entries(SVC_TYPES).map(([k, v]) => ({ label: v.name, value: k }))]}
        active={svcFilter} onChange={setSvcFilter} />

      <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[var(--gold-light)]">
              {["Ticket", "Service", "Asset", "Customer", "Created", "Priority", "Assigned", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((t) => {
              const a = assets.find((a) => a.asset_id === t.asset_id);
              const sn = staff.find((s) => s.staff_id === t.assigned_to);
              return (
                <tr key={t.ticket_id} className="cursor-pointer hover:bg-[var(--gold-light)] transition-colors"
                  onClick={() => router.push(`/admin/queue/${t.ticket_id}`)}>
                  <td className="px-4 py-3.5 font-bold text-[13px] border-b border-[var(--border-color)]">{t.ticket_id}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{SVC_TYPES[t.service_type].name}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{a?.name || "—"}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.customer_id}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.created_at}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]"><PriorityBadge priority={t.priority} /></td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{sn?.full_name || "Unassigned"}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]"><TicketStatusBadge status={t.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!list.length && (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">🛎️</div>
          <p>No tickets in this view.</p>
        </div>
      )}
    </div>
  );
}
