import React from "react";
import { clsx } from "clsx";

interface Step {
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  current: number; // 1-indexed
  className?: string;
}

export function StepIndicator({ steps, current, className }: StepIndicatorProps) {
  return (
    <div className={clsx("flex items-start", className)}>
      {steps.map((step, i) => {
        const idx = i + 1;
        const isActive = idx === current;
        const isDone = idx < current;

        return (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            {i < steps.length - 1 && (
              <div
                className={clsx(
                  "absolute top-[18px] left-1/2 w-full h-[2px] z-[1]",
                  isDone ? "bg-[var(--green)]" : "bg-[var(--border-color)]"
                )}
              />
            )}
            <div
              className={clsx(
                "w-9 h-9 rounded-full flex items-center justify-center font-bold text-[14px] flex-shrink-0 border-2 transition-all z-[2]",
                isActive && "bg-gradient-to-br from-[#7a4e08] to-[#b8860b] text-white border-transparent shadow-[0_0_0_4px_var(--gold-light)]",
                isDone && "bg-[var(--green)] text-white border-transparent",
                !isActive && !isDone && "bg-[var(--gold-light)] text-[var(--muted)] border-[var(--border-color)]"
              )}
            >
              {isDone ? "✓" : idx}
            </div>
            <div
              className={clsx(
                "text-[11px] font-semibold mt-2 text-center leading-tight px-1",
                isActive && "text-[var(--gold)]",
                isDone && "text-[var(--green)]",
                !isActive && !isDone && "text-[var(--muted)]"
              )}
            >
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}
