"use client";

import React from "react";

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  onSignOut: () => void;
}

export function TopBar({ title, onMenuClick, onSignOut }: TopBarProps) {
  return (
    <header className="h-16 bg-white border-b border-[var(--border-color)] flex items-center justify-between px-7 sticky top-0 z-40">
      <button
        onClick={onMenuClick}
        className="lg:hidden text-[24px] text-[var(--gold)] bg-transparent mr-4"
      >
        ☰
      </button>
      <div className="font-serif text-[24px] font-semibold text-[var(--charcoal)]">{title}</div>
      <button
        onClick={onSignOut}
        className="btn btn-outline border-[var(--gold)] text-[var(--gold)] btn-sm uppercase tracking-[1px] hover:bg-[var(--gold-light)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
      >
        Sign Out
      </button>
    </header>
  );
}
