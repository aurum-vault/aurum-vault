"use client";

import { useRouter } from "next/navigation";
import { useAssets, useReports, useTickets, useCustomers } from "@/hooks/useData";
import { Badge } from "@/components/ui/Badge";
import { fmtINR, calcMarketValue } from "@/lib/utils";

export default function AdminCustomersPage() {
  const { customers } = useCustomers();
  const { assets } = useAssets();
  const { reports } = useReports();
  const { tickets } = useTickets();
  const router = useRouter();

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Customers</h3>
      <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
        <table className="w-full border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-[var(--gold-light)]">
              {["Customer ID", "Name", "Mobile", "Email", "Assets", "Vault Value", "Appraised", "Open Tickets", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const cTickets = tickets.filter((t) => t.customer_id === c.customer_id);
              const cAssetIds = new Set(cTickets.map((t) => t.asset_id));
              const cAssets = assets.filter((a) => cAssetIds.has(a.asset_id));
              const av = cAssets.reduce((s, a) => s + calcMarketValue(a), 0);
              const ap = reports
                .filter((r) => cAssetIds.has(r.asset_id))
                .reduce((s, r) => s + r.appraised_value, 0);
              const ot = cTickets.filter((t) => !["closed", "cancelled"].includes(t.status)).length;
              return (
                <tr key={c.customer_id} className="cursor-pointer hover:bg-[var(--gold-light)]"
                  onClick={() => router.push(`/admin/customers/${c.customer_id}`)}>
                  <td className="px-4 py-3.5 font-bold text-[13px] border-b border-[var(--border-color)]">{c.customer_id}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{c.full_name}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">+91 {c.mobile}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{c.email}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{cAssets.length}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{fmtINR(av)}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{fmtINR(ap)}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{ot}</td>
                  <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                    <Badge variant={c.status === "active" ? "green" : "grey"}>{c.status}</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
