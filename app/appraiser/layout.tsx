"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

const NAV_ITEMS = [
  { icon: "📋", label: "My Queue", view: "/appraiser" },
  { icon: "✅", label: "My Completed", view: "/appraiser/completed" },
  { icon: "⚙️", label: "Profile", view: "/appraiser/profile" },
];

export default function AppraiserLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setRole, toast } = useApp();

  const activeView = NAV_ITEMS.find((n) => pathname === n.view)?.view || "/appraiser";
  const titles: Record<string, string> = { "/appraiser": "My Queue", "/appraiser/completed": "My Completed", "/appraiser/profile": "Profile" };

  const signOut = () => {
    setRole(null);
    toast("Signed out", "default");
    router.push("/");
  };

  return (
    <div className="flex min-h-screen" style={{ background: "#fbf7f0" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        brand="Appraiser"
        navItems={NAV_ITEMS}
        activeView={activeView}
        onNav={(v) => router.push(v)}
        userName="Dhanushraj P"
        userRole="Ticket Manager"
        avatarInitials="DP"
      />
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <TopBar title={titles[pathname] || "Appraiser"} onMenuClick={() => setSidebarOpen(true)} onSignOut={signOut} />
        <main className="flex-1 p-7 pb-20 sm:pb-7">{children}</main>
      </div>
      <MobileNav items={NAV_ITEMS.map((n) => ({ ...n, label: n.label.replace("My ", "") }))} activeView={activeView} onNav={(v) => router.push(v)} />
    </div>
  );
}
