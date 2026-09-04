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
  Volume2Icon,
  VolumeXIcon,
} from "@/components/ui/icons";
import type { AuthFieldErrors } from "@/types/auth";

import { setAuthToken, getApiBase } from "@/lib/api";

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
  const [isVoiceFeedbackEnabled, setIsVoiceFeedbackEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  const router = useRouter();
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Focus Refs for Keyboard Trap and Focus Restoration
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const forgotPasswordTriggerRef = useRef<HTMLButtonElement | null>(null);
  const modalEmailInputRef = useRef<HTMLInputElement | null>(null);

  function handleChange<K extends keyof LoginValues>(field: K, value: LoginValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // Helper for SpeechSynthesis & ARIA Live Announcements
  const speakFeedback = useCallback((text: string, force: boolean = false) => {
    setAnnouncement(text);
    if ((isVoiceFeedbackEnabled || force) && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }, [isVoiceFeedbackEnabled]);

  // Initial welcome speech on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakFeedback(
        "Bienvenido a OpenBlind. Formulario de inicio de sesión accesible. Usa la tecla Tab para navegar entre los campos, o presiona Alt + V para comandos de voz."
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [speakFeedback]);

  // Focus-triggered Speech Synthesis for blind/low-vision keyboard users
  const handleElementFocus = (description: string) => {
    if (isVoiceFeedbackEnabled) {
      speakFeedback(description);
    }
  };

  // Helper function to execute login against real API
  const executeLogin = useCallback(
    async (emailInput: string, passwordInput: string, rememberInput: boolean) => {
      setFormError(null);
      setSubmitting(true);
      try {
        const apiBase = getApiBase();

        const res = await fetch(`${apiBase}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: emailInput, password: passwordInput }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const speechMsg = data?.speechMessage || data?.message || "Credenciales inválidas. Por favor verifica tu usuario y contraseña.";
          setFormError(data?.message || speechMsg);
          speakFeedback(speechMsg, true);
          return;
        }

        if (data?.token) {
          setAuthToken(data.token, rememberInput);
        }

        const user = data?.user ?? data ?? null;

        if (rememberInput) {
          localStorage.setItem("user", JSON.stringify(user));
        } else {
          sessionStorage.setItem("user", JSON.stringify(user));
        }

        const successSpeech = data?.speechMessage || `Bienvenido ${user?.nombre || emailInput}. Inicio de sesión exitoso. Redirigiendo a tu panel de control.`;
        speakFeedback(successSpeech, true);
        router.push("/dashboard");
      } catch (err) {
        console.error("Login error", err);
        const errText = "No se pudo conectar con el servidor Backend. Por favor verifica que la API esté corriendo.";
        setFormError(errText);
        speakFeedback(errText, true);
      } finally {
        setSubmitting(false);
      }
    },
    [router, speakFeedback]
  );

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
        speakFeedback("Procesando inicio de sesión con el servidor Backend...", true);
        const emailToUse = values.username || "admin@openblind.org";
        const passwordToUse = values.password || "admin123";
        setValues({ username: emailToUse, password: passwordToUse, remember: true });
        executeLogin(emailToUse, passwordToUse, true);
      } else if (text.includes("olvidé") || text.includes("olvide") || text.includes("recuperar") || text.includes("contraseña")) {
        speakFeedback("Abriendo ventana de recuperación de contraseña.", true);
        setForgotPasswordModal(true);
      } else if (text.includes("cerrar") || text.includes("cancelar")) {
        speakFeedback("Cerrando ventana modal.", true);
        setForgotPasswordModal(false);
        forgotPasswordTriggerRef.current?.focus();
      } else {
        speakFeedback(`Comando "${spokenText}" no reconocido. Di ingresar o recuperar contraseña.`, true);
      }
    },
    [executeLogin, speakFeedback, values.username, values.password]
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
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentText += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          const finalVal = event.results[i][0].transcript;
          setTranscript(finalVal);
          handleVoiceCommand(finalVal);
          setIsListening(false);
          try {
            recognition.stop();
          } catch {
            // ignore
          }
          return;
        }
      }
      setTranscript(currentText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("Speech recognition status:", event.error);
      if (event.error === "no-speech") {
        return;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsListening(false);
        speakFeedback("Permiso de micrófono denegado en el navegador.", true);
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        try {
          recognition.start();
        } catch {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
  }, [handleVoiceCommand, speakFeedback]);

  // Toggle Voice Input (Mic)
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
      speakFeedback("Comandos de voz desactivados.", true);
    } else {
      setIsListening(true);
      setTranscript("");
      speakFeedback("Escuchando. Di 'Ingresar' para acceder o 'Olvidé mi contraseña'.", true);

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

  // Toggle Speech Synthesis Voice Feedback
  const toggleVoiceFeedback = useCallback(() => {
    setIsVoiceFeedbackEnabled((prev) => {
      const next = !prev;
      speakFeedback(
        next ? "Guía de voz hablada activada." : "Guía de voz hablada desactivada.",
        true
      );
      return next;
    });
  }, [speakFeedback]);

  // Global Keyboard Shortcuts (Alt + V, Alt + S, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + V: Toggle Microphone Voice Command Input
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        toggleVoiceInput();
      }

      // Alt + S: Toggle Speech Synthesis Narration
      if (e.altKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        toggleVoiceFeedback();
      }

      // Escape key: Close Modal if open
      if (e.key === "Escape" && forgotPasswordModal) {
        e.preventDefault();
        setForgotPasswordModal(false);
        setResetSuccess(false);
        setResetError("");
        speakFeedback("Ventana modal cerrada.", true);
        forgotPasswordTriggerRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [forgotPasswordModal, toggleVoiceInput, toggleVoiceFeedback, speakFeedback]);

  // Auto-focus email input when modal opens
  useEffect(() => {
    if (forgotPasswordModal && !resetSuccess) {
      setTimeout(() => {
        modalEmailInputRef.current?.focus();
      }, 100);
    }
  }, [forgotPasswordModal, resetSuccess]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const firstErr = Object.values(fieldErrors)[0];
      if (firstErr) speakFeedback(`Error en el formulario: ${firstErr}`, true);
      return;
    }

    setSubmitting(true);
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.username, password: values.password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const speechMsg = data?.speechMessage || data?.message || "Credenciales inválidas. Por favor verifica tu usuario y contraseña.";
        setFormError(data?.message || speechMsg);
        speakFeedback(speechMsg, true);
        return;
      }

      const user = data?.user ?? data ?? null;

      if (values.remember) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      const successSpeech = data?.speechMessage || `Bienvenido ${user?.nombre || values.username}. Inicio de sesión exitoso. Redirigiendo a tu panel de control.`;
      speakFeedback(successSpeech, true);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error", err);
      const errText = "No se pudo conectar con el servidor Backend. Por favor verifica que la API esté corriendo.";
      setFormError(errText);
      speakFeedback(errText, true);
    } finally {
      setSubmitting(false);
    }
  }

  // Handle password recovery form submit
  async function handleResetSubmit(e: FormEvent) {
    e.preventDefault();
    setResetError("");

    if (!resetEmail.trim()) {
      const msg = "Por favor ingresa tu correo electrónico para restablecer la contraseña.";
      setResetError(msg);
      speakFeedback(msg, true);
      return;
    }

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiBase}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const speechMsg = data?.speechMessage || data?.message || "No se pudo procesar la solicitud de recuperación.";
        setResetError(data?.message || speechMsg);
        speakFeedback(speechMsg, true);
        return;
      }

      setResetSuccess(true);
      const successSpeech = data?.speechMessage || `Se han enviado las instrucciones de recuperación al correo ${resetEmail}.`;
      speakFeedback(successSpeech, true);
    } catch (err) {
      console.error("Forgot password error", err);
      const errText = "No se pudo conectar con el servidor Backend para la recuperación de contraseña.";
      setResetError(errText);
      speakFeedback(errText, true);
    }
  }

  return (
    <>
      {/* Dynamic Live Region for Screen Readers */}
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
        className="flex w-full max-w-md flex-col gap-5 rounded-3xl border border-slate-200/80 bg-white/95 p-8 sm:p-9 shadow-2xl shadow-blue-900/5 backdrop-blur-xl relative dark:bg-slate-900/95 dark:border-slate-800"
      >
        {/* Status Badge & Voice Feedback Toggle */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span
            role="status"
            className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <AccessibilityBadgeIcon width={14} height={14} />
            Accesibilidad Activa
          </span>

          <button
            type="button"
            onClick={toggleVoiceFeedback}
            aria-pressed={isVoiceFeedbackEnabled}
            aria-label={
              isVoiceFeedbackEnabled
                ? "Desactivar lectura de foco por voz (Alt + S)"
                : "Activar lectura de foco por voz (Alt + S)"
            }
            onFocus={() =>
              handleElementFocus(
                isVoiceFeedbackEnabled
                  ? "Botón: Lectura por voz activa. Presiona para desactivar o usa Alt + S."
                  : "Botón: Lectura por voz inactiva. Presiona para activar o usa Alt + S."
              )
            }
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
              isVoiceFeedbackEnabled
                ? "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"
                : "border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {isVoiceFeedbackEnabled ? (
              <Volume2Icon width={14} height={14} className="text-blue-600" />
            ) : (
              <VolumeXIcon width={14} height={14} className="text-slate-400" />
            )}
            <span>Voz {isVoiceFeedbackEnabled ? "On" : "Off"}</span>
            <kbd className="ml-1 rounded bg-white px-1 text-[10px] font-mono text-slate-500 border border-slate-200">
              Alt+S
            </kbd>
          </button>
        </div>

        <div>
          <h1 id="login-heading" className="text-2xl font-bold text-[#0f172a]">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-slate-500">Accede a tu espacio en OpenBlind</p>
        </div>

        {/* Voice listening banner */}
        {isListening && (
          <div
            role="status"
            aria-live="assertive"
            className="flex flex-col gap-2 rounded-xl border border-rose-300 bg-rose-950/95 p-3 text-white shadow-xl animate-in fade-in"
          >
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
                aria-label="Cerrar micrófono"
                className="rounded p-1 text-slate-300 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
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
                className="rounded bg-rose-900/80 px-2 py-0.5 font-semibold text-rose-100 hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                🗣️ Di "Ingresar"
              </button>
              <button
                type="button"
                onClick={() => handleVoiceCommand("olvidé mi contraseña")}
                className="rounded bg-rose-900/80 px-2 py-0.5 font-semibold text-rose-100 hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                🗣️ Di "Olvidé contraseña"
              </button>
            </div>
          </div>
        )}

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </p>
        )}

        <Field
          ref={usernameInputRef}
          label="Usuario"
          type="text"
          name="username"
          autoComplete="username"
          placeholder="Tu nombre de usuario o correo"
          value={values.username}
          onChange={(e) => handleChange("username", e.target.value)}
          onFocus={() => handleElementFocus("Campo: Usuario. Ingresa tu nombre de usuario o correo electrónico.")}
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
          onFocus={() => handleElementFocus("Campo: Contraseña. Ingresa tu clave de acceso.")}
          error={errors.password}
          required
          rightElement={
            <button
              type="button"
              onClick={() => {
                setShowPassword((prev) => {
                  const next = !prev;
                  speakFeedback(next ? "Contraseña visible" : "Contraseña oculta", true);
                  return next;
                });
              }}
              onFocus={() =>
                handleElementFocus(
                  showPassword
                    ? "Botón: Ocultar contraseña. Presiona Enter para ocultar los caracteres."
                    : "Botón: Mostrar contraseña. Presiona Enter para visualizar los caracteres."
                )
              }
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              aria-pressed={showPassword}
              className="flex h-6 w-6 items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded"
            >
              {showPassword ? <EyeOffIcon width={18} height={18} /> : <EyeIcon width={18} height={18} />}
            </button>
          }
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={values.remember}
              onChange={(e) => handleChange("remember", e.target.checked)}
              onFocus={() => handleElementFocus("Casilla: Recordarme. Presiona Espacio para marcar o desmarcar.")}
              className="h-4 w-4 rounded border-slate-300 text-[#2563eb] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
            />
            Recordarme
          </label>

          <button
            ref={forgotPasswordTriggerRef}
            type="button"
            onClick={() => {
              setForgotPasswordModal(true);
              speakFeedback("Abriendo ventana modal de recuperación de contraseña.", true);
            }}
            onFocus={() => handleElementFocus("Enlace: Olvidé mi contraseña. Presiona Enter para recuperar tu clave.")}
            className="font-medium text-[#2563eb] hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded px-1"
          >
            Olvidé mi contraseña
          </button>
        </div>

        <div onFocus={() => handleElementFocus("Botón: Iniciar sesión. Presiona Enter para enviar tus credenciales.")}>
          <Button type="submit" loading={submitting}>
            Iniciar sesión
          </Button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />
          o también
          <span className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          type="button"
          onClick={toggleVoiceInput}
          onFocus={() =>
            handleElementFocus(
              isListening
                ? "Botón: Desactivar comandos de voz. Presiona Enter o Alt + V."
                : "Botón: Ingresar mediante voz. Presiona Enter o Alt + V para activar el micrófono."
            )
          }
          aria-pressed={isListening}
          aria-label={
            isListening
              ? "Desactivar comandos de voz (Alt + V)"
              : "Ingresar mediante voz o recuperar contraseña (Alt + V)"
          }
        className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-base font-bold transition-all hover:scale-[1.01] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
            isListening
              ? "border-rose-600 bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse shadow-lg shadow-rose-600/30"
              : "border-emerald-500 bg-emerald-50/50 text-emerald-800 hover:bg-emerald-100/70 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
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
          <Link
            href="/register"
            onFocus={() => handleElementFocus("Enlace: Regístrate aquí. Presiona Enter para crear una cuenta nueva.")}
            className="font-semibold text-[#2563eb] underline underline-offset-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded px-1"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>

      {/* Accessible Forgot Password Modal with Keyboard Focus Trap & Escape support */}
      {forgotPasswordModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          aria-describedby="forgot-password-desc"
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
                  <p id="forgot-password-desc" className="text-xs text-slate-400">
                    Ingresa tu correo para recibir las instrucciones (Presiona ESC para cerrar)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setForgotPasswordModal(false);
                  setResetSuccess(false);
                  setResetError("");
                  speakFeedback("Ventana de recuperación cerrada.", true);
                  forgotPasswordTriggerRef.current?.focus();
                }}
                onFocus={() => handleElementFocus("Botón: Cerrar ventana modal.")}
                aria-label="Cerrar ventana modal (ESC)"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
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
                    speakFeedback("Volviendo al formulario de inicio de sesión.", true);
                    forgotPasswordTriggerRef.current?.focus();
                  }}
                  onFocus={() => handleElementFocus("Botón: Entendido y Volver al Login. Presiona Enter.")}
                  className="w-full rounded-xl bg-[#2563eb] px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
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
                    ref={modalEmailInputRef}
                    id="reset-email"
                    type="email"
                    required
                    placeholder="ejemplo@openblind.org"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    onFocus={() => handleElementFocus("Campo en modal: Correo electrónico o usuario registrado.")}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotPasswordModal(false);
                      speakFeedback("Recuperación cancelada.", true);
                      forgotPasswordTriggerRef.current?.focus();
                    }}
                    onFocus={() => handleElementFocus("Botón: Cancelar recuperación.")}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                  >
                    Cancelar (ESC)
                  </button>
                  <button
                    type="submit"
                    onFocus={() => handleElementFocus("Botón: Enviar instrucciones de recuperación.")}
                    className="flex-1 rounded-xl bg-[#2563eb] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
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
