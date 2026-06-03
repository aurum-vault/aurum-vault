import React from "react";
import { clsx } from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className, onClick, hover }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-white border border-[var(--border-color)] rounded-xl shadow-[var(--sh-s)]",
        hover && "cursor-pointer transition-all hover:shadow-[var(--sh-m)] hover:-translate-y-1 hover:border-[var(--border-active)]",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface MetricCardProps {
  label: React.ReactNode;
  value: string;
  sub?: React.ReactNode;
  action?: React.ReactNode;
}

export function MetricCard({ label, value, sub, action }: MetricCardProps) {
  return (
    <div className="relative bg-white border border-[var(--border-color)] rounded-xl p-6 shadow-[var(--sh-s)] overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#7a4e08] to-[#b8860b]" />
      <div className="text-[12px] text-[var(--sec)] uppercase tracking-[1px] font-semibold mb-2">{label}</div>
      <div className="font-serif text-[34px] font-bold text-[var(--charcoal)] leading-tight">{value}</div>
      {sub && <div className="text-[12px] text-[var(--muted)] mt-2">{sub}</div>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}
