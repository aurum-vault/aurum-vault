"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TM_ID = "STF-02";

export default function AppraiserProfilePage() {
  const { db, setRole, toast } = useApp();
  const router = useRouter();
  const s = db.staff.find((x) => x.staff_id === TM_ID)!;
  const activeTickets = db.tickets.filter((t) => t.assigned_to === TM_ID && t.status !== "closed").length;

  const signOut = () => {
    setRole(null);
    toast("Signed out", "default");
    router.push("/");
  };

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Profile</h3>
      <Card className="p-6 max-w-[560px] mb-4">
        <div className="flex gap-4 items-center mb-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center text-[22px] font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#8a5e0a,#b8860b)" }}>DP</div>
          <div>
            <div className="font-bold text-[18px] text-[var(--charcoal)]">{s.full_name}</div>
            <div className="text-[var(--sec)]">Ticket Manager · Appraiser</div>
          </div>
        </div>
        {[
          ["Staff ID", s.staff_id],
          ["Email", s.email],
          ["Active Tickets", String(activeTickets)],
          ["Last Login", s.last_login],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 border-b border-[var(--border-color)] last:border-b-0 text-[13px]">
            <span className="text-[var(--sec)]">{k}</span>
            <span className="font-semibold text-[var(--charcoal)]">{v}</span>
          </div>
        ))}
      </Card>

      <Card className="p-6 max-w-[560px] mb-4">
        <h4 className="font-serif text-[18px] mb-3">Security</h4>
        <button onClick={() => toast("Password change flow", "default")}
          className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border-color)] rounded-lg text-[13px] font-medium text-[var(--sec)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all bg-transparent cursor-pointer">
          Change Password <span>→</span>
        </button>
      </Card>

      <Button variant="danger" onClick={signOut}>Sign Out</Button>
    </div>
  );
}
