"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { TicketStatusBadge } from "@/components/ui/Badge";
import { Timeline } from "@/components/ui/Timeline";
import { TicketWorkPanel } from "@/components/tickets/TicketWorkPanel";
import { flowFor } from "@/lib/utils";
import { SVC_TYPES, STATUS_LABELS } from "@/lib/data";

export default function AppraiserTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { db, assetById, reportByTicket } = useApp();
  const [refresh, setRefresh] = useState(0);

  const ticket = db.tickets.find((t) => t.ticket_id === id);
  if (!ticket) return <div className="text-center py-12 text-[var(--muted)]">Ticket not found.</div>;

  const asset = assetById(ticket.asset_id);
  const rep = reportByTicket(id);
  const flow = flowFor(ticket);
  const curIdx = flow.indexOf(ticket.status);
  const ex = ticket.extra as Record<string, unknown>;
  const isVisit = SVC_TYPES[ticket.service_type].mode === "visit" || ticket.service_type === "repair";

  return (
    <div key={refresh}>
      <Link href="/appraiser" className="inline-flex items-center gap-2 text-[var(--gold)] font-semibold text-[14px] mb-4 cursor-pointer">← Back to My Queue</Link>
      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="text-[var(--gold)] text-[12px] font-semibold tracking-[1px]">{ticket.ticket_id}</div>
          <h3 className="font-serif text-[22px]">{SVC_TYPES[ticket.service_type].name}</h3>
        </div>
        <TicketStatusBadge status={ticket.status} />
      </div>

      <div className="grid grid-cols-[1fr_1.5fr] gap-6 max-md:grid-cols-1">
        <div>
          <Card className="p-5 mb-4">
            <div className="label-caps mb-1">Customer</div>
            <div className="font-semibold text-[var(--charcoal)] mb-0.5">
              Customer #{ticket.customer_id} <span className="text-[11px] text-[var(--muted)]">(identity protected)</span>
            </div>
            {isVisit && (
              <>
                <div className="label-caps mt-3 mb-1">{ticket.visit_type === "In-Store Visit" ? "🏬 Visit Type" : "🚪 Visit / Collection"}</div>
                <p className="text-[13px] mb-3">
                  <strong>{ticket.visit_type || "—"}</strong>
                  {ticket.preferred_date && ` · ${ticket.preferred_date}`}
                  {ticket.time_slot && ` · ${ticket.time_slot}`}
                  {ticket.visit_type === "Home Visit" && ticket.dispatch_address && <><br />📍 {ticket.dispatch_address}</>}
                </p>
              </>
            )}
            <div className="label-caps mb-1">Customer Instructions</div>
            <p className="text-[13px] mb-3">{ticket.customer_notes || "—"}</p>
            {ticket.service_type === "repair" && typeof ex.issue === "string" && ex.issue && (
              <>
                <div className="label-caps mt-2 mb-1">Reported Damage</div>
                <p className="text-[13px]">{ex.issue}</p>
              </>
            )}
          </Card>

          <Card className="p-5">
            <div className="label-caps mb-2">Asset Details</div>
            <div className="font-semibold text-[var(--charcoal)]">{asset?.name}</div>
            <div className="text-[13px] text-[var(--sec)]">{asset?.category} · {asset?.metal} · {asset?.purity}</div>
            <div className="text-[13px] text-[var(--sec)]">Net weight: {asset?.net}g{asset?.huid ? ` · HUID: ${asset.huid}` : ""}</div>
            {asset?.provenance && (
              <>
                <div className="label-caps mt-3 mb-1">Legacy Story</div>
                <p className="italic text-[13px]">{asset.provenance}</p>
              </>
            )}
            {asset?.images.length ? (
              <>
                <div className="label-caps mt-3 mb-2">Customer Images</div>
                <div className="grid grid-cols-3 gap-2">
                  {asset.images.map((img, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={img} alt="" className="w-full aspect-square object-cover rounded-lg border border-[var(--border-color)]" />
                  ))}
                </div>
              </>
            ) : null}
          </Card>
        </div>

        <Card className="p-5">
          <div className="label-caps mb-2">Status Timeline</div>
          <Timeline className="mb-4" steps={flow.slice(0, flow.length - 1).map((s, i) => ({
            label: STATUS_LABELS[s] || s,
            state: i < curIdx ? "done" : i === curIdx ? "active" : "pending",
          } as { label: string; state: "done" | "active" | "pending" }))} />
          <hr className="border-none border-t border-[var(--border-color)] my-4" />
          <TicketWorkPanel ticket={ticket} report={rep} by="tm" onUpdate={() => setRefresh((r) => r + 1)} />
        </Card>
      </div>
    </div>
  );
}
