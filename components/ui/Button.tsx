import React from "react";
import { clsx } from "clsx";

type Variant = "primary" | "ghost" | "danger" | "secondary";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary: "btn-gold",
  ghost: "btn btn-outline border-[var(--gold)] text-[var(--gold)] hover:bg-[var(--gold-light)] hover:border-[var(--gold)] hover:text-[var(--gold)]",
  danger: "btn bg-[var(--red)] text-white hover:brightness-110 border-none",
  secondary: "btn btn-secondary",
};

const sizeClasses: Record<Size, string> = {
  sm: "btn-sm text-[12px] min-h-[36px] px-4 py-2",
  md: "min-h-[44px] px-8 py-3 text-[14px]",
  lg: "min-h-[52px] px-10 py-4 text-[15px]",
};

export function Button({
  variant = "primary",
  size = "md",
  block = false,
  loading = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const base = variant === "primary" ? "btn btn-gold" : variantClasses[variant];

  return (
    <button
      className={clsx(
        base,
        sizeClasses[size],
        "uppercase tracking-[1.5px] font-semibold rounded-lg transition-all",
        block && "w-full",
        (disabled || loading) && "opacity-45 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="loading loading-spinner loading-xs mr-1" />}
      {children}
    </button>
  );
}
