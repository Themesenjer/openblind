"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import { EyeIcon, EyeOffIcon, AccessibilityBadgeIcon, MicIcon } from "@/components/ui/icons";
import type { AuthFieldErrors } from "@/types/auth";

interface LoginValues {
  username: string;
  password: string;
  remember: boolean;
}

function validate(values: LoginValues): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  if (!values.username.trim()) errors.username = "El usuario es obligatorio.";
  if (!values.password) errors.password = "La contraseña es obligatoria.";
  return errors;
}

export default function LoginForm() {
  const [values, setValues] = useState<LoginValues>({ username: "", password: "", remember: false });
  const [errors, setErrors] = useState<AuthFieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  function handleChange<K extends keyof LoginValues>(field: K, value: LoginValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

      // Si no hay URL de backend configurada, simulamos un login exitoso localmente
      if (!apiBase) {
        const user = {
          id: 1,
          nombre: values.username,
          email: values.username,
          rol: "user",
          creado_en: new Date().toISOString(),
        };

        if (values.remember) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        setSubmitting(false);
        router.push("/dashboard");
        return;
      }

      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.username, password: values.password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setFormError(data?.message || "Credenciales inválidas.");
        return;
      }

      const user = data?.user ?? data ?? null;

      if (values.remember) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      router.push("/dashboard");
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Login error", err);
      setFormError("No se pudo iniciar sesión. Intenta nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="login-heading"
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
        <h1 id="login-heading" className="text-2xl font-bold text-[#0f172a]">
          Iniciar sesión
        </h1>
        <p className="mt-1 text-sm text-slate-500">Accede a tu espacio en OpenBlind</p>
      </div>

      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      <Field
        label="Usuario"
        type="text"
        name="username"
        autoComplete="username"
        placeholder="Tu nombre de usuario"
        value={values.username}
        onChange={(e) => handleChange("username", e.target.value)}
        error={errors.username}
        required
      />

      <Field
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        name="password"
        autoComplete="current-password"
        placeholder="••••••••"
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

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-slate-600">
          <input
            type="checkbox"
            checked={values.remember}
            onChange={(e) => handleChange("remember", e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
          />
          Recordarme
        </label>
        <Link href="#" className="font-medium text-[#2563eb] hover:underline">
          Olvidé mi contraseña
        </Link>
      </div>

      <Button type="submit" loading={submitting}>
        Iniciar sesión
      </Button>

      <div className="flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200" />
        o también
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#10b981] bg-white px-4 py-3 text-base font-semibold text-[#0f9d6e] transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
      >
        <MicIcon width={18} height={18} />
        Ingresar mediante voz
      </button>

      <p className="text-center text-sm text-slate-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-semibold text-[#2563eb] underline underline-offset-2">
          Regístrate aquí
        </Link>
      </p>
    </form>
  );
}
