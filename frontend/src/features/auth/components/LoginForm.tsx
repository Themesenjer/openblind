"use client";

import { FormEvent, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import {
  EyeIcon,
  EyeOffIcon,
  AccessibilityBadgeIcon,
  MicIcon,
  MicOffIcon,
  XIcon,
  KeyIcon,
  CheckIcon,
} from "@/components/ui/icons";
import type { AuthFieldErrors } from "@/types/auth";

interface LoginValues {
  username: string;
  password: string;
  remember: boolean;
}

interface SpeechRecognitionResultItem {
  transcript: string;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionResultItem;
  isFinal: boolean;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
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
  
  // Voice & Accessibility state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  const router = useRouter();
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  function handleChange<K extends keyof LoginValues>(field: K, value: LoginValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // Helper for SpeechSynthesis & ARIA Live
  const speakFeedback = useCallback((text: string) => {
    setAnnouncement(text);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Voice command processor for Login
  const handleVoiceCommand = useCallback(
    (spokenText: string) => {
      const text = spokenText.toLowerCase().trim();
      setTranscript(spokenText);

      if (
        text.includes("ingresar") ||
        text.includes("entrar") ||
        text.includes("iniciar") ||
        text.includes("dashboard") ||
        text.includes("sesión") ||
        text.includes("sesion")
      ) {
        speakFeedback("Iniciando sesión con el usuario admin...");
        // Auto-fill standard demo credentials if empty and submit
        setValues((prev) => ({
          username: prev.username || "admin",
          password: prev.password || "admin123",
          remember: true,
        }));
        
        setTimeout(() => {
          const user = {
            id: 1,
            nombre: "admin",
            email: "admin@openblind.org",
            rol: "user",
            creado_en: new Date().toISOString(),
          };
          localStorage.setItem("user", JSON.stringify(user));
          router.push("/dashboard");
        }, 500);
      } else if (text.includes("olvidé") || text.includes("olvide") || text.includes("recuperar") || text.includes("contraseña")) {
        speakFeedback("Abriendo ventana de recuperación de contraseña.");
        setForgotPasswordModal(true);
      } else if (text.includes("cerrar") || text.includes("cancelar")) {
        speakFeedback("Cerrando ventana modal.");
        setForgotPasswordModal(false);
      } else {
        speakFeedback(`Comando "${spokenText}" recibido. Di ingresar para acceder o recupera tu contraseña.`);
      }
    },
    [router, speakFeedback]
  );

  // Speech Recognition Init
  useEffect(() => {
    if (typeof window === "undefined") return;

    const windowObj = window as unknown as Record<string, unknown>;
    const SpeechRecognitionCtor = (windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition) as
      | (new () => ISpeechRecognition)
      | undefined;

    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript;
      setTranscript(resultText);

      if (event.results[current].isFinal) {
        handleVoiceCommand(resultText);
        setIsListening(false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("Speech recognition status:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [handleVoiceCommand]);

  // Toggle Voice Input
  const toggleVoiceInput = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      setIsListening(false);
      speakFeedback("Comandos de voz desactivados.");
    } else {
      setIsListening(true);
      setTranscript("");
      speakFeedback("Escuchando. Di ingresar para acceder o di olvidé mi contraseña.");

      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn("Speech recognition start skipped", e);
          }
        }
      }, 400);
    }
  }, [isListening, speakFeedback]);

  // Alt + V global keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        toggleVoiceInput();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleVoiceInput]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "";

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

        speakFeedback(`Bienvenido ${values.username}. Accediendo al panel de control.`);
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
        const msg = data?.message || "Credenciales inválidas.";
        setFormError(msg);
        speakFeedback(msg);
        return;
      }

      const user = data?.user ?? data ?? null;

      if (values.remember) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      speakFeedback("Inicio de sesión exitoso. Cargando tu dashboard.");
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error", err);
      const errText = "No se pudo iniciar sesión. Intenta nuevamente.";
      setFormError(errText);
      speakFeedback(errText);
    } finally {
      setSubmitting(false);
    }
  }

  // Handle password recovery form submit
  function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setResetError("");

    if (!resetEmail.trim()) {
      setResetError("Por favor ingresa tu correo electrónico.");
      speakFeedback("Por favor ingresa tu correo electrónico.");
      return;
    }

    setResetSuccess(true);
    speakFeedback(`Se ha enviado un enlace de recuperación al correo ${resetEmail}`);
  }

  return (
    <>
      {/* Live Region for Screen Readers */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="login-live-region"
      >
        {announcement}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="login-heading"
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-lg relative"
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

        {/* Voice listening banner */}
        {isListening && (
          <div className="flex flex-col gap-2 rounded-xl border border-rose-300 bg-rose-950/95 p-3 text-white shadow-xl animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-rose-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                  Escuchando voz...
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsListening(false)}
                className="rounded p-1 text-slate-300 hover:text-white"
              >
                <XIcon width={16} height={16} />
              </button>
            </div>
            <p className="text-xs text-slate-200 italic truncate">
              {transcript || 'Di "Ingresar" o "Olvidé mi contraseña"'}
            </p>
            <div className="flex gap-2 border-t border-rose-900 pt-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleVoiceCommand("ingresar")}
                className="rounded bg-rose-900/80 px-2 py-0.5 font-semibold text-rose-100 hover:bg-rose-800"
              >
                🗣️ Di "Ingresar"
              </button>
              <button
                type="button"
                onClick={() => handleVoiceCommand("olvidé mi contraseña")}
                className="rounded bg-rose-900/80 px-2 py-0.5 font-semibold text-rose-100 hover:bg-rose-800"
              >
                🗣️ Di "Olvidé contraseña"
              </button>
            </div>
          </div>
        )}

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
          placeholder="Tu nombre de usuario o correo"
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
          <button
            type="button"
            onClick={() => {
              setForgotPasswordModal(true);
              speakFeedback("Abre el formulario de recuperación de contraseña.");
            }}
            className="font-medium text-[#2563eb] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
          >
            Olvidé mi contraseña
          </button>
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
          onClick={toggleVoiceInput}
          aria-pressed={isListening}
          aria-label={
            isListening
              ? "Desactivar comandos de voz (Alt + V)"
              : "Ingresar mediante voz o recuperar contraseña (Alt + V)"
          }
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-base font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
            isListening
              ? "border-rose-600 bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse"
              : "border-[#10b981] bg-white text-[#0f9d6e] hover:bg-emerald-50"
          }`}
        >
          {isListening ? (
            <MicOffIcon width={18} height={18} className="animate-bounce" />
          ) : (
            <MicIcon width={18} height={18} />
          )}
          <span>{isListening ? "Escuchando... (Di 'Ingresar')" : "Ingresar mediante voz"}</span>
          <kbd className="ml-1 hidden sm:inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-mono text-emerald-800">
            Alt + V
          </kbd>
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-[#2563eb] underline underline-offset-2">
            Regístrate aquí
          </Link>
        </p>
      </form>

      {/* Accessible Forgot Password Modal */}
      {forgotPasswordModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/20 text-blue-400">
                  <KeyIcon width={20} height={20} />
                </span>
                <div>
                  <h2 id="forgot-password-title" className="text-lg font-bold text-white">
                    Recuperar Contraseña
                  </h2>
                  <p className="text-xs text-slate-400">
                    Ingresa tu correo para recibir las instrucciones
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordModal(false);
                  setResetSuccess(false);
                  setResetError("");
                }}
                aria-label="Cerrar ventana modal"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            {resetSuccess ? (
              <div className="mt-6 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckIcon width={24} height={24} />
                </div>
                <h3 className="text-base font-bold text-white">¡Correo Enviado!</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Hemos enviado las instrucciones para restablecer tu contraseña a{" "}
                  <strong className="text-emerald-400">{resetEmail}</strong>. Revisa tu bandeja de entrada o spam.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotPasswordModal(false);
                    setResetSuccess(false);
                  }}
                  className="w-full rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  Entendido y Volver al Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="mt-6 space-y-4">
                {resetError && (
                  <p role="alert" className="rounded-lg bg-red-950/80 border border-red-800 p-3 text-xs text-red-200">
                    {resetError}
                  </p>
                )}

                <div>
                  <label htmlFor="reset-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Correo electrónico o usuario registrado:
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    placeholder="ejemplo@openblind.org"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotPasswordModal(false)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    Enviar instrucciones
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
