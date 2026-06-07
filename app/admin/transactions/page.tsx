"use client";

import { useTransactions } from "@/hooks/useData";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { fmtINR } from "@/lib/utils";

export default function AdminTransactionsPage() {
  const { transactions } = useTransactions();
  const { toast } = useApp();

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-serif text-[22px]">Transactions</h3>
        <Button variant="ghost" size="sm" onClick={() => toast("Exported to CSV", "success")}>⬇ Export CSV</Button>
      </div>
      <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[var(--gold-light)]">
              {["Transaction ID", "Customer", "Service", "Asset", "Amount", "Date", "Status"].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.txn_id}>
                <td className="px-4 py-3.5 font-bold text-[13px] border-b border-[var(--border-color)]">{t.txn_id}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.customer}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.service}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.asset}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)] font-semibold">{fmtINR(t.amount)}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{t.date}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                  <Badge variant={t.status === "Paid" ? "green" : "amber"}>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}