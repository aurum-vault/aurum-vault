import React from "react";
import { clsx } from "clsx";
import type { AssetStatus, TicketStatus, Priority } from "@/lib/types";
import { statusLabel, ticketStatusLabel, statusColor, ticketStatusColor, priorityColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "green" | "amber" | "grey" | "red" | "blue" | "gold";
  className?: string;
}

const variantClasses: Record<string, string> = {
  green: "bg-[rgba(26,107,58,0.12)] text-[var(--green)]",
  amber: "bg-[rgba(138,85,0,0.12)] text-[var(--amber)]",
  grey: "bg-[rgba(154,122,80,0.14)] text-[var(--muted)]",
  red: "bg-[rgba(155,32,32,0.12)] text-[var(--red)]",
  blue: "bg-[#e8f4fd] text-[#2563a0]",
  gold: "bg-[var(--gold-light)] text-[var(--gold)]",
};

export function Badge({ children, variant = "grey", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.5px]",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  const variantMap: Record<AssetStatus, BadgeProps["variant"]> = {
    verified: "green",
    in_review: "amber",
    pending: "grey",
    rejected: "red",
  };
  return <Badge variant={variantMap[status]}>{statusLabel(status)}</Badge>;
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const variantMap: Record<TicketStatus, BadgeProps["variant"]> = {
    submitted: "grey",
    assigned: "blue",
    in_progress: "amber",
    awaiting_info: "amber",
    quote_ready: "blue",
    awaiting_payment: "amber",
    report_ready: "green",
    closed: "grey",
    cancelled: "red",
  };
  return <Badge variant={variantMap[status]}>{ticketStatusLabel(status)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const variantMap: Record<Priority, BadgeProps["variant"]> = {
    high: "red",
    medium: "amber",
    low: "grey",
  };
  return (
    <Badge variant={variantMap[priority]}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
