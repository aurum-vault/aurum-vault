"use client";

import { useApp } from "@/context/AppContext";
import { useCustomer } from "@/hooks/useData";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function CustomerProfilePage() {
  const { toast } = useApp();
  const { customer } = useCustomer();

  return (
    <div>
      <h3 className="font-serif text-[22px] mb-4">Profile &amp; Settings</h3>

      <Card className="p-6 max-w-[680px] mb-4">
        <h4 className="font-serif text-[18px] mb-4">Personal Details</h4>
        {[
          ["Full Name", customer.full_name],
          ["Mobile", `+91 ${customer.mobile}`],
          ["Email", customer.email],
          ["Dispatch Address", customer.address],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between py-3 border-b border-[var(--border-color)] last:border-b-0 text-[13px]">
            <span className="text-[var(--sec)]">{k}</span>
            <span className="font-semibold text-[var(--charcoal)] text-right max-w-[60%]">{v}</span>
          </div>
        ))}
      </Card>

      <Card className="p-6 max-w-[680px] mb-4">
        <h4 className="font-serif text-[18px] mb-4">Security</h4>
        <div className="flex flex-col gap-2.5">
          {[
            { label: "Change Password", arrow: true },
            { label: `2FA Settings (${customer.tfa.toUpperCase()})`, arrow: true },
            { label: "Active Sessions", arrow: true },
          ].map((btn) => (
            <button key={btn.label} onClick={() => toast(btn.label, "default")}
              className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border-color)] rounded-lg text-[13px] font-medium text-[var(--sec)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all bg-transparent cursor-pointer">
              {btn.label} <span>→</span>
            </button>
          ))}
        </div>
      </Card>

      <Card className="p-6 max-w-[680px]">
        <h4 className="font-serif text-[18px] mb-4">Privacy</h4>
        <div className="flex flex-col gap-2.5">
          <button onClick={() => toast("Preparing data export…", "warn")}
            className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border-color)] rounded-lg text-[13px] font-medium text-[var(--sec)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all bg-transparent cursor-pointer">
            Download My Data <span>⬇</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
