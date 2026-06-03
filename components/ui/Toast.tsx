"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import type { ToastMessage } from "@/lib/types";

const toastIcons: Record<ToastMessage["type"], string> = {
  success: "✅",
  error: "⚠️",
  warn: "⏳",
  default: "💎",
};

const borderColors: Record<ToastMessage["type"], string> = {
  success: "border-[var(--green)]",
  error: "border-[var(--red)]",
  warn: "border-[var(--amber)]",
  default: "border-[var(--gold-accent)]",
};

export function ToastContainer() {
  const { toasts } = useApp();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`bg-[var(--charcoal)] text-white px-5 py-3.5 rounded-xl shadow-[var(--sh-l)] text-[13px] min-w-[240px] animate-fadeUp flex items-center gap-2.5 border-l-4 ${borderColors[t.type]}`}
        >
          <span>{toastIcons[t.type]}</span>
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
