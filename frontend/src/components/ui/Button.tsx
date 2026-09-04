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
    "w-full inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:active:scale-100 shadow-md hover:shadow-xl hover:-translate-y-0.5";

  const variants = {
    primary:
      "bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#1d4ed8] text-white hover:from-[#1d4ed8] hover:to-[#1e40af] shadow-blue-500/25 hover:shadow-blue-500/40 border border-blue-400/30",
    secondary:
      "bg-white text-slate-800 border-2 border-slate-200/90 hover:bg-slate-50 hover:border-slate-300 shadow-slate-200/50 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-700/90",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? (
        <>
          <svg
            className="h-5 w-5 animate-spin text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Cargando…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
