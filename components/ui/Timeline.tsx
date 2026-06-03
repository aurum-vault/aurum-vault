import React from "react";
import { clsx } from "clsx";

interface TimelineStep {
  label: string;
  sub?: string;
  state: "done" | "active" | "pending";
}

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={clsx("flex flex-col", className)}>
      {steps.map((step, i) => (
        <div
          key={i}
          className={clsx(
            "flex gap-3.5 pb-6 relative",
            i === steps.length - 1 && "pb-0"
          )}
        >
          {i < steps.length - 1 && (
            <div
              className={clsx(
                "absolute left-[13px] top-7 bottom-0 w-[2px]",
                step.state === "done" ? "bg-[var(--green)]" : "bg-[var(--border-color)]"
              )}
            />
          )}
          <div
            className={clsx(
              "w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[13px] z-[1] border-2",
              step.state === "done" && "bg-[var(--green)] border-transparent text-white",
              step.state === "active" && "bg-gradient-to-br from-[#7a4e08] to-[#b8860b] border-transparent text-white",
              step.state === "pending" && "bg-[var(--gold-light)] border-[var(--border-color)] text-[var(--muted)]"
            )}
          >
            {step.state === "done" ? "✓" : step.state === "active" ? "●" : ""}
          </div>
          <div>
            <div className="font-semibold text-[var(--charcoal)] text-[14px] leading-tight">{step.label}</div>
            {step.sub && <div className="text-[12px] text-[var(--muted)] mt-0.5">{step.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
