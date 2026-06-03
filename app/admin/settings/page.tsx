"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { RATES } from "@/lib/data";
import { fmtINR } from "@/lib/utils";

export default function AdminSettingsPage() {
  const { toast } = useApp();

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Settings</h3>

      <Card className="p-6 max-w-[680px] mb-4">
        <h4 className="font-serif text-[18px] mb-4">Market Rates</h4>
        {[
          ["Gold (per g)", `₹${RATES.gold.toLocaleString("en-IN")}`],
          ["Silver (per g)", `₹${RATES.silver}`],
          ["Platinum (per g)", `₹${RATES.platinum.toLocaleString("en-IN")}`],
          ["Diamond (per ct)", `$${RATES.diamondUSD.toLocaleString()}`],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 border-b border-[var(--border-color)] last:border-b-0 text-[13px]">
            <span className="text-[var(--sec)]">{k}</span>
            <span className="font-semibold text-[var(--charcoal)]">{v}</span>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => toast("Rate sync triggered", "warn")}>🔄 Sync Live Rates</Button>
      </Card>

      <Card className="p-6 max-w-[680px]">
        <h4 className="font-serif text-[18px] mb-4">Platform Preferences</h4>
        {[
          { label: "Customer notifications", defaultChecked: true },
          { label: "Auto-assign new tickets", defaultChecked: false },
          { label: "Require certificate ref on certify", defaultChecked: true },
        ].map((pref) => (
          <label key={pref.label} className="flex justify-between items-center text-[13px] text-[var(--sec)] py-2 cursor-pointer">
            {pref.label}
            <input type="checkbox" defaultChecked={pref.defaultChecked} className="checkbox checkbox-sm" />
          </label>
        ))}
      </Card>
    </div>
  );
}
