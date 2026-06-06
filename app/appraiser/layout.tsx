"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

const NAV_ITEMS = [
  { icon: "📋", label: "My Queue", view: "/appraiser" },
  { icon: "✅", label: "My Completed", view: "/appraiser/completed" },
  { icon: "⚙️", label: "Profile", view: "/appraiser/profile" },
];

const TITLES: Record<string, string> = {
  "/appraiser": "My Queue",
  "/appraiser/completed": "My Completed",
  "/appraiser/profile": "Profile",
};

export default function AppraiserLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, username } = useAuth();
  const initials = username.slice(0, 2).toUpperCase() || "AU";

  return (
    <div className="flex min-h-screen" style={{ background: "#fbf7f0" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        brand="Appraiser"
        navItems={NAV_ITEMS}
        activeView={NAV_ITEMS.find((n) => pathname === n.view)?.view || "/appraiser"}
        onNav={(v) => router.push(v)}
        userName={username}
        userRole="Ticket Manager"
        avatarInitials={initials}
      />
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <TopBar
          title={TITLES[pathname] || "Appraiser"}
          onMenuClick={() => setSidebarOpen(true)}
          onSignOut={() => logout()}
        />
        <main className="flex-1 p-7 pb-20 sm:pb-7">{children}</main>
      </div>
      <MobileNav
        items={NAV_ITEMS.map((n) => ({ ...n, label: n.label.replace("My ", "") }))}
        activeView={NAV_ITEMS.find((n) => pathname === n.view)?.view || "/appraiser"}
        onNav={(v) => router.push(v)}
      />
    </div>
  );
}