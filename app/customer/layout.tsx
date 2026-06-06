"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";
import { initials } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: "🏛️", label: "Home", view: "/customer" },
  { icon: "💍", label: "Collection", view: "/customer/collection" },
  { icon: "🛎️", label: "Services", view: "/customer/services" },
  { icon: "📄", label: "Documents", view: "/customer/documents" },
  { icon: "⚙️", label: "Profile", view: "/customer/profile" },
];

const MOBILE_NAV = [
  { icon: "🏛️", label: "Home", view: "/customer" },
  { icon: "💍", label: "Collection", view: "/customer/collection" },
  { icon: "🛎️", label: "Services", view: "/customer/services" },
  { icon: "📄", label: "Docs", view: "/customer/documents" },
  { icon: "⚙️", label: "Profile", view: "/customer/profile" },
];

const TITLES: Record<string, string> = {
  "/customer": "Home",
  "/customer/collection": "Collection",
  "/customer/services": "Services",
  "/customer/documents": "Documents",
  "/customer/profile": "Profile",
  "/customer/add-asset": "Add Asset",
};

export default function CustomerLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { db } = useApp();
  const { logout } = useAuth();

  const activeView = MOBILE_NAV.find((n) => pathname === n.view || pathname.startsWith(n.view + "/"))?.view || "/customer";
  const title = TITLES[pathname] || "Aurum Vault";

  const signOut = () => logout();

  return (
    <div className="flex min-h-screen" style={{ background: "#fbf7f0" }}>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        brand="Vault"
        navItems={NAV_ITEMS.map((n) => ({ ...n, view: n.view }))}
        activeView={activeView}
        onNav={(view) => router.push(view)}
        userName={db.customer.full_name}
        userRole="Customer"
        avatarInitials={initials(db.customer.full_name)}
      />
      <div className="flex-1 flex flex-col lg:ml-[240px]">
        <TopBar title={title} onMenuClick={() => setSidebarOpen(true)} onSignOut={signOut} />
        <main className="flex-1 p-7 max-w-[1400px] w-full pb-20 sm:pb-7">
          {children}
        </main>
      </div>
      <MobileNav items={MOBILE_NAV} activeView={activeView} onNav={(v) => router.push(v)} />
    </div>
  );
}
