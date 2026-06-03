"use client";

import React, { useRef } from "react";

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
}

export function OTPInput({ length = 6, value, onChange }: OTPInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleInput = (i: number, v: string) => {
    const cleaned = v.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[i] = cleaned;
    onChange(next);
    if (cleaned && i < length - 1) {
      inputs.current[i + 1]?.focus();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="w-13 h-15 text-center text-[24px] font-bold border-[1.5px] rounded-xl text-[var(--charcoal)] border-[var(--border-color)] focus:outline-none focus:border-[var(--gold)] focus:shadow-[0_0_0_3px_var(--gold-light)]"
          style={{ width: 52, height: 60 }}
        />
      ))}
    </div>
  );
}
