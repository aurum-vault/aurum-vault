"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard", view: "/admin" },
  { icon: "💎", label: "Asset Registry", view: "/admin/registry" },
  { icon: "👥", label: "Customers", view: "/admin/customers" },
  { icon: "🛎️", label: "Service Queue", view: "/admin/queue" },
  { icon: "🧑‍💼", label: "Team", view: "/admin/team" },
  { icon: "💰", label: "Transactions", view: "/admin/transactions" },
  { icon: "📜", label: "Audit Log", view: "/admin/audit" },
  { icon: "⚙️", label: "Settings", view: "/admin/settings" },
];

const MOBILE_NAV = [
  { icon: "📊", label: "Home", view: "/admin" },
  { icon: "💎", label: "Assets", view: "/admin/registry" },
  { icon: "🛎️", label: "Queue", view: "/admin/queue" },
  { icon: "👥", label: "Clients", view: "/admin/customers" },
  { icon: "🧑‍💼", label: "Team", view: "/admin/team" },
];

const TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/registry": "Asset Registry",
  "/admin/customers": "Customers",
  "/admin/queue": "Service Queue",
  "/admin/team": "Team Management",
  "/admin/transactions": "Transactions",
  "/admin/audit": "Audit Log",
  "/admin/settings": "Settings",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, username, roles } = useAuth();
  const displayRole = roles.includes("admin") ? "Administrator" : "Appraiser";
  const initials = username.slice(0, 2).toUpperCase() || "AU";

  const activeView = NAV_ITEMS.find((n) => pathname === n.view || (n.view !== "/admin" && pathname.startsWith(n.view)))?.view || "/admin";
  const title = TITLES[pathname] || "Admin";

  const signOut = () => logout();

  return (
    <div className="flex min-h-screen" style={{ background: "#fbf7f0" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        brand="Admin"
        navItems={NAV_ITEMS}
        activeView={activeView}
        onNav={(view) => router.push(view)}
        userName={username}
        userRole={displayRole}
        avatarInitials={initials}
      />
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} onSignOut={signOut} />
        <main className="flex-1 p-7 max-w-[1400px] w-full pb-20 sm:pb-7">{children}</main>
      </div>
      <MobileNav items={MOBILE_NAV} activeView={activeView} onNav={(v) => router.push(v)} />
    </div>
  );
}
