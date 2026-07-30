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
        <label htmlFor={inputId} className="text-sm font-semibold text-[#102a43]">
          {label}
        </label>
        {hint && (
          <span id={hintId} className="text-xs text-slate-500">
            {hint}
          </span>
        )}
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-base text-[#102a43] placeholder:text-slate-400 transition-colors focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2 ${
              rightElement ? "pr-11" : ""
            } ${error ? "border-red-500" : "border-slate-300 focus:border-[#102a43]"} ${className}`}
            {...rest}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">{rightElement}</div>
          )}
        </div>
        {error && (
          <span id={errorId} role="alert" className="text-sm font-medium text-red-600">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;
