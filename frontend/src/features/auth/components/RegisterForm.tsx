"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon, AccessibilityBadgeIcon } from "@/components/ui/icons";
import { validateRegister } from "@/lib/validation";
import type { AuthFieldErrors, RegisterPayload } from "@/types/auth";

const INITIAL_VALUES: RegisterPayload = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const [values, setValues] = useState<RegisterPayload>(INITIAL_VALUES);
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(field: keyof RegisterPayload, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccess(false);

    const fieldErrors = validateRegister(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      // TODO: reemplazar por la llamada real al backend (POST /auth/register)
      await new Promise((resolve) => setTimeout(resolve, 600));
      console.log("Register payload", values);
      setSuccess(true);
      setValues(INITIAL_VALUES);
    } catch {
      setFormError("No se pudo completar el registro. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="register-heading"
      className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg"
    >
      <span
        role="status"
        className="flex items-center gap-2 self-start rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        <AccessibilityBadgeIcon width={14} height={14} />
        Accesibilidad activa · TAB para navegar
      </span>

      <div>
        <h1 id="register-heading" className="text-2xl font-bold text-[#0f172a]">
          Crear cuenta
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Regístrate para empezar a usar la navegación asistida de OpenBlind.
        </p>
      </div>

      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      {success && (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          Cuenta creada correctamente. Ya puedes iniciar sesión.
        </p>
      )}

      <Field
        label="Nombre completo"
        type="text"
        name="fullName"
        autoComplete="name"
        placeholder="Tu nombre completo"
        value={values.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
        error={errors.fullName}
        required
      />

      <Field
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.com"
        value={values.email}
        onChange={(e) => handleChange("email", e.target.value)}
        error={errors.email}
        required
      />

      <Field
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="password"
        autoComplete="new-password"
        placeholder="••••••••"
        hint="Mínimo 8 caracteres."
        value={values.password}
        onChange={(e) => handleChange("password", e.target.value)}
        error={errors.password}
        required
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="flex h-6 w-6 items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
          >
            {showPassword ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
          </button>
        }
      />

      <Field
        label="Confirmar contraseña"
        type={showPassword ? "text" : "password"}
        name="confirmPassword"
        autoComplete="new-password"
        placeholder="••••••••"
        value={values.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" loading={submitting}>
        Registrarme
      </Button>

      <p className="text-center text-sm text-slate-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-[#2563eb] underline underline-offset-2">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
