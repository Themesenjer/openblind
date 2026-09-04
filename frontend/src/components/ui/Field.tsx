"use client";

import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Elemento opcional al lado derecho del input, p.ej. botón mostrar/ocultar contraseña */
  rightElement?: ReactNode;
}

/**
 * Campo de formulario accesible: label siempre visible, mensajes de error
 * asociados vía aria-describedby y anunciados con role="alert", y foco
 * de alto contraste (heredado de globals.css) para usuarios con baja visión.
 */
const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, error, hint, id, className = "", rightElement, ...rest }, ref) => {
    const inputId = id ?? rest.name ?? label.toLowerCase().replace(/\s+/g, "-");
    const hintId = hint ? `${inputId}-hint` : undefined;
    const errorId = error ? `${inputId}-error` : undefined;
    const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {label}
            {rest.required && <span className="ml-1 text-rose-500" aria-hidden="true">*</span>}
          </label>
          {hint && (
            <span id={hintId} className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {hint}
            </span>
          )}
        </div>
        <div className="relative group">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full rounded-2xl border-2 bg-slate-50/70 px-4 py-3 text-base font-medium text-slate-900 placeholder:text-slate-400 transition-all duration-200 shadow-2xs hover:bg-white hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:bg-slate-900 dark:focus:bg-slate-900 ${
              rightElement ? "pr-12" : ""
            } ${
              error
                ? "border-red-500 ring-2 ring-red-500/20 focus:border-red-600 focus:ring-red-500/30"
                : "border-slate-200/90 focus:border-[#2563eb] focus:ring-blue-500/20 dark:border-slate-700 dark:focus:border-blue-500"
            } ${className}`}
            {...rest}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">{rightElement}</div>
          )}
        </div>
        {error && (
          <span id={errorId} role="alert" className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {error}
          </span>
        )}
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;
