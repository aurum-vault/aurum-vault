"use client";

import React from "react";
import { clsx } from "clsx";

interface Tab {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx(
        "flex gap-1 border-b border-[var(--border-color)] mb-5 overflow-x-auto",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "px-4 py-3 font-semibold text-[13px] cursor-pointer border-b-2 whitespace-nowrap transition-all",
            active === tab.value
              ? "text-[var(--gold)] border-[var(--gold)]"
              : "text-[var(--sec)] border-transparent hover:text-[var(--gold)]"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
