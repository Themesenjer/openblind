"use client";

import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const base =
    "w-full rounded-xl px-4 py-3 text-base font-semibold transition-colors focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary: "bg-[#2563eb] text-white hover:bg-[#1d4ed8]",
    secondary: "bg-white text-[#102a43] border-2 border-[#102a43] hover:bg-slate-50",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? "Cargando…" : children}
    </button>
  );
}
