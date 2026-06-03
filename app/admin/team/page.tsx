"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { FormField, Input, Select } from "@/components/ui/FormField";

export default function AdminTeamPage() {
  const { db, setDb, toast } = useApp();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ticket_manager" | "admin">("ticket_manager");

  const confirmInvite = () => {
    if (!email) { toast("Email required", "error"); return; }
    setDb((prev) => ({
      ...prev,
      staff: [...prev.staff, {
        staff_id: `STF-${String(prev.staff.length + 1).padStart(2, "0")}`,
        full_name: email.split("@")[0], email, role, status: "invited", last_login: "—",
      }],
    }));
    setInviteOpen(false);
    setEmail("");
    toast(`Invite sent to ${email}`, "success");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-serif text-[22px]">Team Management</h3>
        <Button size="sm" onClick={() => setInviteOpen(true)}>+ Invite Staff</Button>
      </div>

      <div className="overflow-x-auto border border-[var(--border-color)] rounded-xl">
        <table className="w-full border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[var(--gold-light)]">
              {["Name", "Email", "Role", "Status", "Last Login", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3.5 text-[11px] uppercase tracking-[1px] text-[var(--muted)] font-bold border-b border-[var(--border-color)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {db.staff.map((s) => (
              <tr key={s.staff_id}>
                <td className="px-4 py-3.5 font-bold text-[13px] border-b border-[var(--border-color)]">{s.full_name}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{s.email}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                  <Badge variant={s.role === "admin" ? "gold" : "blue"}>{s.role === "admin" ? "Admin" : "Ticket Manager"}</Badge>
                </td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                  <Badge variant={s.status === "active" ? "green" : s.status === "invited" ? "amber" : "grey"}>{s.status}</Badge>
                </td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">{s.last_login}</td>
                <td className="px-4 py-3.5 text-[13px] border-b border-[var(--border-color)]">
                  <Button variant="ghost" size="sm" onClick={() => toast(`Role change for ${s.full_name}`, "default")}>Edit</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite Staff"
        footer={<><Button variant="ghost" size="sm" onClick={() => setInviteOpen(false)}>Cancel</Button><Button size="sm" onClick={confirmInvite}>Send Invite</Button></>}>
        <FormField label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@aurumvault.in" /></FormField>
        <FormField label="Role">
          <Select value={role} onChange={(e) => setRole(e.target.value as "ticket_manager" | "admin")}>
            <option value="ticket_manager">Ticket Manager</option>
            <option value="admin">Admin</option>
          </Select>
        </FormField>
        <p className="text-[12px] text-[var(--muted)]">Invite valid for 48 hours.</p>
      </Modal>
    </div>
  );
}
