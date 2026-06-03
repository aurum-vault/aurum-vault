"use client";

import React from "react";
import { clsx } from "clsx";

interface ChipOption {
  label: string;
  value: string;
}

interface ChipsProps {
  options: ChipOption[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function Chips({ options, active, onChange, className }: ChipsProps) {
  return (
    <div className={clsx("flex gap-2 flex-wrap", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={clsx(
            "px-4 py-2 rounded-full border-[1.5px] text-[13px] font-medium cursor-pointer transition-all",
            active === o.value
              ? "bg-gradient-to-br from-[#7a4e08] to-[#b8860b] text-white border-transparent"
              : "bg-white border-[var(--border-color)] text-[var(--sec)] hover:border-[var(--border-active)]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface MultiChipsProps {
  options: ChipOption[];
  active: string[];
  onChange: (values: string[]) => void;
  className?: string;
}

export function MultiChips({ options, active, onChange, className }: MultiChipsProps) {
  const toggle = (value: string) => {
    const next = active.includes(value)
      ? active.filter((v) => v !== value)
      : [...active, value];
    onChange(next);
  };

  return (
    <div className={clsx("flex gap-2 flex-wrap", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => toggle(o.value)}
          className={clsx(
            "px-4 py-2 rounded-full border-[1.5px] text-[13px] font-medium cursor-pointer transition-all",
            active.includes(o.value)
              ? "bg-gradient-to-br from-[#7a4e08] to-[#b8860b] text-white border-transparent"
              : "bg-white border-[var(--border-color)] text-[var(--sec)] hover:border-[var(--border-active)]"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
