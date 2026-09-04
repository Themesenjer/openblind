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
  Volume2Icon,
  VolumeXIcon,
} from "@/components/ui/icons";
import { validateRegister } from "@/lib/validation";
import type { AuthFieldErrors, RegisterPayload } from "@/types/auth";
import { getApiBase } from "@/lib/api";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Voice & Accessibility state
  const [isListening, setIsListening] = useState(false);
  const [isVoiceFeedbackEnabled, setIsVoiceFeedbackEnabled] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [announcement, setAnnouncement] = useState("");

  const router = useRouter();
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const fullNameRef = useRef<HTMLInputElement | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  function handleChange(field: keyof RegisterPayload, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  // Helper for SpeechSynthesis & ARIA Live Announcements
  const speakFeedback = useCallback(
    (text: string, force: boolean = false) => {
      setAnnouncement(text);
      if ((isVoiceFeedbackEnabled || force) && typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "es-ES";
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    },
    [isVoiceFeedbackEnabled]
  );

  // Initial welcome speech on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      speakFeedback(
        "Formulario de registro accesible de OpenBlind. Completa tus datos para crear una cuenta. Usa TAB para navegar o presiona Alt + V para comandos de voz."
      );
    }, 600);
    return () => clearTimeout(timer);
  }, [speakFeedback]);

  // Focus-triggered Speech Synthesis for keyboard navigation
  const handleElementFocus = (description: string) => {
    if (isVoiceFeedbackEnabled) {
      speakFeedback(description);
    }
  };

  // Helper function to execute registration against real API
  const executeRegister = useCallback(
    async (payload: RegisterPayload) => {
      setFormError(null);
      setSuccessMessage(null);
      setSubmitting(true);

      try {
        const apiBase = getApiBase();

        const res = await fetch(`${apiBase}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: payload.fullName,
            email: payload.email,
            password: payload.password,
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const speechMsg = data?.speechMessage || data?.message || "No se pudo completar el registro. Intenta nuevamente.";
          setFormError(data?.message || speechMsg);
          speakFeedback(speechMsg, true);
          return;
        }

        const successSpeech = data?.speechMessage || `Cuenta creada exitosamente para ${payload.fullName}. Ya puedes iniciar sesión.`;
        setSuccessMessage(successSpeech);
        speakFeedback(successSpeech, true);
        setValues(INITIAL_VALUES);

        // Redirect to login after successful creation
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } catch (err) {
        console.error("Register error", err);
        const errText = "No se pudo conectar con el servidor Backend. Por favor verifica que la API esté corriendo.";
        setFormError(errText);
        speakFeedback(errText, true);
      } finally {
        setSubmitting(false);
      }
    },
    [router, speakFeedback]
  );

  // Voice command processor for Registration
  const handleVoiceCommand = useCallback(
    (spokenText: string) => {
      const text = spokenText.toLowerCase().trim();
      setTranscript(spokenText);

      if (text.includes("registrar") || text.includes("crear") || text.includes("enviar")) {
        speakFeedback("Enviando formulario de registro al servidor Backend...", true);
        const currentFieldErrors = validateRegister(values);
        if (Object.keys(currentFieldErrors).length > 0) {
          setErrors(currentFieldErrors);
          const firstErr = Object.values(currentFieldErrors)[0];
          if (firstErr) speakFeedback(`Por favor completa los campos: ${firstErr}`, true);
          return;
        }
        executeRegister(values);
      } else if (text.includes("login") || text.includes("iniciar") || text.includes("sesión")) {
        speakFeedback("Navegando a la página de inicio de sesión.", true);
        router.push("/login");
      } else {
        speakFeedback(`Comando "${spokenText}" no reconocido. Di 'Registrarme' o 'Iniciar sesión'.`, true);
      }
    },
    [executeRegister, router, speakFeedback, values]
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
          const finalResult = event.results[i][0].transcript;
          setTranscript(finalResult);
          handleVoiceCommand(finalResult);
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
        return; // Ignorar pausa para evitar cierre automático
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
      speakFeedback("Escuchando. Di 'Registrarme' para enviar tus datos o 'Iniciar sesión'.", true);

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

  // Global Keyboard Shortcuts (Alt + V, Alt + S)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        toggleVoiceInput();
      }

      if (e.altKey && (e.key === "s" || e.key === "S")) {
        e.preventDefault();
        toggleVoiceFeedback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleVoiceInput, toggleVoiceFeedback]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    const fieldErrors = validateRegister(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      const firstErr = Object.values(fieldErrors)[0];
      if (firstErr) speakFeedback(`Error en el formulario: ${firstErr}`, true);
      return;
    }

    await executeRegister(values);
  }

  return (
    <>
      {/* Dynamic Live Region for Screen Readers */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="register-live-region"
      >
        {announcement}
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-labelledby="register-heading"
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
          <h1 id="register-heading" className="text-2xl font-bold text-[#0f172a]">
            Crear cuenta
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Regístrate para empezar a usar la navegación asistida de OpenBlind.
          </p>
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
              {transcript || 'Di "Registrarme" para enviar el formulario'}
            </p>
          </div>
        )}

        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </p>
        )}

        {successMessage && (
          <p role="status" className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-800">
            {successMessage}
          </p>
        )}

        <Field
          ref={fullNameRef}
          label="Nombre completo"
          type="text"
          name="fullName"
          autoComplete="name"
          placeholder="Tu nombre completo"
          value={values.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          onFocus={() => handleElementFocus("Campo: Nombre completo. Ingresa tu nombre y apellido.")}
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
          onFocus={() => handleElementFocus("Campo: Correo electrónico. Ingresa un email válido.")}
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
          onFocus={() => handleElementFocus("Campo: Contraseña. Ingresa una clave segura de al menos 8 caracteres.")}
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
                    ? "Botón: Ocultar contraseña. Presiona Enter para ocultar caracteres."
                    : "Botón: Mostrar contraseña. Presiona Enter para visualizar caracteres."
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

        <Field
          label="Confirmar contraseña"
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          onFocus={() => handleElementFocus("Campo: Confirmar contraseña. Repite exactamente tu clave de acceso.")}
          error={errors.confirmPassword}
          required
        />

        <div onFocus={() => handleElementFocus("Botón: Registrarme. Presiona Enter para enviar el formulario de registro.")}>
          <Button type="submit" loading={submitting}>
            Registrarme
          </Button>
        </div>

        <button
          type="button"
          onClick={toggleVoiceInput}
          onFocus={() =>
            handleElementFocus(
              isListening
                ? "Botón: Desactivar comandos de voz. Presiona Enter o Alt + V."
                : "Botón: Registrarse mediante voz. Presiona Enter o Alt + V para activar el micrófono."
            )
          }
          aria-pressed={isListening}
          aria-label={
            isListening
              ? "Desactivar comandos de voz (Alt + V)"
              : "Registrarse mediante voz (Alt + V)"
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
          <span>{isListening ? "Escuchando... (Di 'Registrarme')" : "Registrarse mediante voz"}</span>
          <kbd className="ml-1 hidden sm:inline-block rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-mono text-emerald-800">
            Alt + V
          </kbd>
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            onFocus={() => handleElementFocus("Enlace: Inicia sesión. Presiona Enter para volver al login.")}
            className="font-semibold text-[#2563eb] underline underline-offset-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 rounded px-1"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </>
  );
}

