"use client";

import React from "react";
import { clsx } from "clsx";

interface NavItem {
  icon: string;
  label: string;
  view: string;
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  brand: string; // e.g. "Vault" | "Admin" | "Appraiser"
  navItems: NavItem[];
  activeView: string;
  onNav: (view: string) => void;
  userName: string;
  userRole: string;
  avatarInitials: string;
}

export function Sidebar({
  open,
  onClose,
  brand,
  navItems,
  activeView,
  onNav,
  userName,
  userRole,
  avatarInitials,
}: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-45 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          "w-[240px] bg-white border-r border-[var(--border-color)] fixed top-0 left-0 bottom-0 flex flex-col py-6 z-50 transition-transform duration-300",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand */}
        <div className="px-6 pb-6 flex items-center gap-2.5 border-b border-[var(--border-color)]">
          <div className="w-[38px] h-[38px] rounded-[9px] bg-gradient-to-br from-[#7a4e08] to-[#b8860b] flex items-center justify-center font-serif text-white text-[22px] font-bold">
            A
          </div>
          <div>
            <div className="font-serif text-[22px] font-bold text-[var(--charcoal)]">Aurum</div>
            <div className="text-[9px] tracking-[2px] text-[var(--muted)] uppercase">{brand}</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => { onNav(item.view); onClose(); }}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium cursor-pointer transition-all mb-0.5 text-[14px]",
                activeView === item.view
                  ? "bg-gradient-to-r from-[rgba(122,78,8,0.12)] to-[rgba(184,134,11,0.12)] text-[var(--gold)] font-semibold"
                  : "text-[var(--sec)] hover:bg-[var(--gold-light)] hover:text-[var(--gold)]"
              )}
            >
              <span className="text-[18px] w-[22px] text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="px-5 py-4 border-t border-[var(--border-color)] flex items-center gap-2.5">
          <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-[#8a5e0a] to-[#b8860b] text-white flex items-center justify-center font-semibold flex-shrink-0">
            {avatarInitials}
          </div>
          <div>
            <div className="font-semibold text-[13px] text-[var(--charcoal)]">{userName}</div>
            <div className="text-[11px] text-[var(--muted)]">{userRole}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
