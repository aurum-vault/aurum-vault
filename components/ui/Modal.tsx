"use client";

import React, { useEffect } from "react";
import { clsx } from "clsx";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ open, onClose, title, children, footer, maxWidth = "max-w-[560px]" }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-[rgba(26,18,0,0.55)] backdrop-blur-sm z-[1000] flex items-center justify-center p-5 animate-fadeUp"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={clsx(
          "bg-white rounded-2xl shadow-[var(--sh-l)] w-full max-h-[90vh] overflow-y-auto",
          maxWidth
        )}
      >
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-color)]">
            <h3 className="font-serif text-[22px] font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className="text-[var(--muted)] text-[24px] leading-none bg-transparent hover:text-[var(--body-color)]"
            >
              ×
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
        {footer && (
          <div className="flex gap-3 justify-end px-6 py-4 border-t border-[var(--border-color)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
