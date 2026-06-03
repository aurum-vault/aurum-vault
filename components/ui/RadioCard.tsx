"use client";

import React from "react";
import { clsx } from "clsx";

interface RadioCardOption {
  value: string;
  icon: string;
  title: string;
  desc?: string;
}

interface RadioCardGroupProps {
  options: RadioCardOption[];
  value: string;
  onChange: (value: string) => void;
  cols?: 1 | 2;
  className?: string;
}

export function RadioCardGroup({ options, value, onChange, cols = 2, className }: RadioCardGroupProps) {
  return (
    <div
      className={clsx(
        "grid gap-3",
        cols === 1 ? "grid-cols-1" : "grid-cols-2",
        className
      )}
    >
      {options.map((opt) => (
        <div
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            "border-[1.5px] rounded-xl p-4 cursor-pointer transition-all flex gap-3 items-start",
            value === opt.value
              ? "border-[var(--gold)] bg-[var(--gold-light)] shadow-[0_0_0_2px_var(--gold-light)]"
              : "border-[var(--border-color)] hover:border-[var(--border-active)] hover:bg-[var(--gold-light)]"
          )}
        >
          <div className="text-[24px]">{opt.icon}</div>
          <div>
            <div className="font-semibold text-[var(--charcoal)] text-[14px]">{opt.title}</div>
            {opt.desc && <div className="text-[12px] text-[var(--sec)] mt-0.5">{opt.desc}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
