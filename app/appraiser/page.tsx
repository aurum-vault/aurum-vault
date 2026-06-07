"use client";

import { useRouter } from "next/navigation";
import { useTickets, useAssets, useStaff } from "@/hooks/useData";
import { useAuth } from "@/context/AuthContext";
import { TicketStatusBadge, PriorityBadge } from "@/components/ui/Badge";
import { SVC_TYPES } from "@/lib/data";

export default function AppraiserQueuePage() {
  const { tickets } = useTickets();
  const { assets } = useAssets();
  const { staff } = useStaff();
  const { email } = useAuth();
  const router = useRouter();
  const myStaffId = staff.find((s) => s.email === email)?.staff_id ?? null;
  const myTickets = tickets.filter((t) => myStaffId && t.assigned_to === myStaffId && t.status !== "closed");

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-1.5">My Queue</h3>
      <p className="text-[var(--sec)] mb-4">Tickets assigned to you. You can action only these.</p>

      {myTickets.length ? (
        <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-[var(--gold-light)]">
                {["Ticket", "Service", "Asset", "Priority", "Status", "Created"].map((h) => (
                  <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myTickets.map((t) => {
                const a = assets.find((a) => a.asset_id === t.asset_id);
                return (
                  <tr key={t.ticket_id} className="cursor-pointer hover:bg-[var(--gold-light)] transition-colors"
                    onClick={() => router.push(`/appraiser/${t.ticket_id}`)}>
                    <td className="px-4 py-3.5 font-bold text-[13px] border-b border-[var(--border-color)]">{t.ticket_id}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{SVC_TYPES[t.service_type].name}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{a?.name || "—"}</td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]"><PriorityBadge priority={t.priority} /></td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]"><TicketStatusBadge status={t.status} /></td>
                    <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.created_at}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">📋</div>
          <p>No active tickets assigned to you.</p>
        </div>
      )}
    </div>
  );
}