"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { fmtINR } from "@/lib/utils";
import { SVC_TYPES } from "@/lib/data";

const TM_ID = "STF-02";

export default function AppraiserCompletedPage() {
  const { db, reportByTicket } = useApp();
  const router = useRouter();
  const completed = db.tickets.filter((t) => t.assigned_to === TM_ID && ["report_ready", "closed"].includes(t.status));

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">My Completed</h3>
      {completed.length ? (
        <div className="grid grid-cols-4 gap-5 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {completed.map((t) => {
            const a = db.assets.find((a) => a.asset_id === t.asset_id);
            const rep = reportByTicket(t.ticket_id);
            return (
              <div key={t.ticket_id}
                className="bg-white border border-[var(--border-color)] rounded-xl p-4 cursor-pointer shadow-[var(--sh-s)] hover:shadow-[var(--sh-m)] transition-all"
                onClick={() => router.push(`/appraiser/${t.ticket_id}`)}>
                <div className="text-[var(--gold)] text-[12px] font-semibold">{t.ticket_id}</div>
                <div className="font-bold text-[var(--charcoal)] mt-1 mb-0.5">{a?.name || "—"}</div>
                <div className="text-[13px] text-[var(--sec)]">{SVC_TYPES[t.service_type].name}</div>
                <div className="font-serif text-[20px] text-[var(--green)] font-bold mt-2">{rep ? fmtINR(rep.appraised_value) : "—"}</div>
                <div className="text-[11px] text-[var(--muted)] mt-1">Completed {t.updated_at}</div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-[var(--muted)]">
          <div className="text-[54px] mb-3.5 opacity-50">✅</div>
          <p>No completed tickets yet.</p>
        </div>
      )}
    </div>
  );
}
