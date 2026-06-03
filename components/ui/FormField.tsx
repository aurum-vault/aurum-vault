"use client";

import React from "react";
import { clsx } from "clsx";

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, required, error, hint, children, className }: FormFieldProps) {
  return (
    <div className={clsx("mb-4", className)}>
      {label && (
        <label className="block text-[12px] font-semibold text-[var(--sec)] mb-1.5 tracking-[0.5px]">
          {label}
          {required && <span className="text-[var(--red)] ml-1">*</span>}
        </label>
      )}
      {children}
      {error && <span className="text-[var(--red)] text-[12px] mt-1 block">{error}</span>}
      {hint && !error && <span className="text-[var(--muted)] text-[11px] mt-1 block">{hint}</span>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={clsx(
        "w-full px-3.5 py-3 border-[1.5px] rounded-lg bg-white text-[var(--body-color)] text-[14px] transition-all",
        "focus:outline-none focus:border-[var(--border-active)] focus:shadow-[0_0_0_3px_var(--gold-light)]",
        error
          ? "border-[var(--red)]"
          : "border-[var(--border-color)] hover:border-[rgba(138,94,10,0.3)]",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={clsx(
        "w-full px-3.5 py-3 border-[1.5px] rounded-lg bg-white text-[var(--body-color)] text-[14px] transition-all",
        "focus:outline-none focus:border-[var(--border-active)] focus:shadow-[0_0_0_3px_var(--gold-light)]",
        error
          ? "border-[var(--red)]"
          : "border-[var(--border-color)] hover:border-[rgba(138,94,10,0.3)]",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={clsx(
        "w-full px-3.5 py-3 border-[1.5px] rounded-lg bg-white text-[var(--body-color)] text-[14px] transition-all resize-y min-h-[90px] leading-relaxed",
        "focus:outline-none focus:border-[var(--border-active)] focus:shadow-[0_0_0_3px_var(--gold-light)]",
        error
          ? "border-[var(--red)]"
          : "border-[var(--border-color)] hover:border-[rgba(138,94,10,0.3)]",
        className
      )}
      {...props}
    />
  );
}

interface PhoneRowProps {
  ccValue?: string;
  onCcChange?: (v: string) => void;
  inputProps?: InputProps;
  error?: string;
}

export function PhoneRow({ ccValue = "+91", onCcChange, inputProps, error }: PhoneRowProps) {
  return (
    <div className="flex gap-2">
      <Select
        className="w-[90px] flex-shrink-0"
        value={ccValue}
        onChange={(e) => onCcChange?.(e.target.value)}
      >
        <option>+91</option>
        <option>+1</option>
        <option>+44</option>
        <option>+971</option>
      </Select>
      <Input className="flex-1" inputMode="numeric" {...inputProps} error={!!error} />
    </div>
  );
}
