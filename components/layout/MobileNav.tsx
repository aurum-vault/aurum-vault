"use client";

import React from "react";
import { clsx } from "clsx";

interface MobileNavItem {
  icon: string;
  label: string;
  view: string;
}

interface MobileNavProps {
  items: MobileNavItem[];
  activeView: string;
  onNav: (view: string) => void;
}

export function MobileNav({ items, activeView, onNav }: MobileNavProps) {
  return (
    <nav className="flex sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-[var(--border-color)] z-60 shadow-[0_-4px_20px_rgba(138,94,10,0.08)]">
      {items.map((item) => (
        <button
          key={item.view}
          onClick={() => onNav(item.view)}
          className={clsx(
            "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold cursor-pointer bg-transparent",
            activeView === item.view ? "text-[var(--gold)]" : "text-[var(--muted)]"
          )}
        >
          <span className="text-[20px]">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
