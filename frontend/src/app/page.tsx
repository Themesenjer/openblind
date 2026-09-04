"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/api";
import {
  EyeIcon,
  KeyboardIcon,
  MicIcon,
  MicOffIcon,
  ScreenReaderIcon,
  ContrastIcon,
  ArrowRightIcon,
  SpeakerIcon,
  AccessibilityBadgeIcon,
  XIcon,
  CheckIcon,
} from "@/components/ui/icons";

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

const features = [
  { label: "Navegación por teclado", icon: KeyboardIcon, color: "text-blue-600 bg-blue-50 border-blue-200" },
  { label: "Comandos de voz", icon: MicIcon, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { label: "Lector de pantalla", icon: ScreenReaderIcon, color: "text-purple-600 bg-purple-50 border-purple-200" },
  { label: "Alto contraste", icon: ContrastIcon, color: "text-amber-600 bg-amber-50 border-amber-200" },
];

export default function HomePage() {
  const [isListening, setIsListening] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<{ status: string; message: string } | null>(null);
  const router = useRouter();

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  // Connect to Backend API health check
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const apiBase = getApiBase();
        const res = await fetch(`${apiBase}/api/health`);
        const data = await res.json();
        if (data?.status === "OK") {
          setBackendStatus({ status: "OK", message: data.speechMessage || "Backend Conectado" });
        }
      } catch {
        setBackendStatus({ status: "Offline", message: "Modo fuera de línea" });
      }
    };
    checkBackend();
  }, []);

  // Helper for speech feedback (Web Speech API SpeechSynthesis & ARIA Live Region)
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

  // Process voice command for Home Page
  const handleVoiceCommand = useCallback(
    (spokenText: string) => {
      const text = spokenText.toLowerCase().trim();
      setTranscript(spokenText);
      setPermissionError(null);

      if (
        text.includes("ingresar") ||
        text.includes("entrar") ||
        text.includes("comenzar") ||
        text.includes("iniciar") ||
        text.includes("login") ||
        text.includes("sesion") ||
        text.includes("sesión")
      ) {
        speakFeedback("Redirigiendo a inicio de sesión en OpenBlind...");
        router.push("/login");
      } else if (text.includes("dashboard") || text.includes("panel")) {
        speakFeedback("Redirigiendo al panel de control...");
        router.push("/dashboard");
      } else if (text.includes("lector") || text.includes("pantalla")) {
        speakFeedback("Activando lector de pantalla asistido.");
        setIsScreenReaderActive(true);
      } else if (text.includes("ayuda")) {
        speakFeedback("Di ingresar o comenzar para acceder al inicio de sesión.");
      } else {
        speakFeedback(`Comando "${spokenText}" recibido. Di ingresar para iniciar sesión.`);
      }
    },
    [router, speakFeedback]
  );

  // Initialize Speech Recognition
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
      console.warn("SpeechRecognition event:", event.error);
      if (event.error === "no-speech") {
        return; // Ignorar silencio temporal
      }

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsListening(false);
        setPermissionError("Permiso de micrófono no otorgado. Puedes usar la prueba rápida abajo.");
        speakFeedback("Permiso de micrófono no otorgado. Selecciona un comando rápido o usa la navegación por teclado.");
      } else if (event.error === "audio-capture") {
        setIsListening(false);
        setPermissionError("Micrófono no detectado.");
        speakFeedback("Micrófono no detectado. Puedes hacer clic en Comenzar.");
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

  // Toggle Voice Input safely
  const toggleVoiceInput = useCallback(() => {
    setPermissionError(null);

    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore
        }
      }
      setIsListening(false);
      speakFeedback("Reconocimiento de voz detenido.");
    } else {
      setIsListening(true);
      setTranscript("");
      speakFeedback("Escuchando. Di ingresar para acceder a OpenBlind.");

      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn("Speech recognition start skipped or busy", e);
          }
        }
      }, 400);
    }
  }, [isListening, speakFeedback]);

  // Toggle Screen Reader Mode
  const toggleScreenReader = useCallback(() => {
    const nextState = !isScreenReaderActive;
    setIsScreenReaderActive(nextState);

    if (nextState) {
      speakFeedback(
        "Lector de pantalla asistido activado. Bienvenido a OpenBlind, tecnología accesible para todos. Presiona Tab o navega para escuchar las opciones disponibles: Comenzar, Ingresar con voz o Lector de pantalla."
      );
    } else {
      speakFeedback("Lector de pantalla asistido desactivado.");
    }
  }, [isScreenReaderActive, speakFeedback]);

  // Focus feedback handler when screen reader is active
  const handleElementFocus = (text: string) => {
    if (isScreenReaderActive) {
      speakFeedback(text);
    }
  };

  // Keyboard shortcut: Alt + V for voice input
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

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Live Region for Screen Readers (WCAG 2.1 AA) */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="home-live-region"
      >
        {announcement}
      </div>

      {/* Decorative Top Gradient Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-400/20 blur-3xl" />

      <div className="relative z-10 flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        {/* Logo Container with Ambient Glow */}
        <div className="relative">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 opacity-30 blur-lg transition duration-500 hover:opacity-75" />
          <span className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25">
            <EyeIcon width={38} height={38} strokeWidth={2.2} />
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="mt-8 text-4xl font-black tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Bienvenido a <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">OpenBlind</span>
        </h1>
        <p className="mt-3 text-lg font-medium text-slate-600 dark:text-slate-300 max-w-md">
          Plataforma de tecnología interactiva y navegación asistida para todos.
        </p>

        {/* Backend Live Connection Badge */}
        {backendStatus && (
          <div className="mt-3 flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
            <span className={`h-2 w-2 rounded-full ${backendStatus.status === "OK" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            <span>API Backend: {backendStatus.message}</span>
          </div>
        )}

        {/* Active Listening Visual Banner */}
        {isListening && (
          <div
            className="mt-6 flex w-full max-w-md flex-col gap-3 rounded-2xl border border-rose-300 bg-rose-950/95 p-4 text-white shadow-2xl animate-in fade-in"
            role="status"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3.5 w-3.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-rose-500"></span>
                </span>
                <div className="text-left">
                  <p className="text-xs font-bold uppercase tracking-wider text-rose-300">
                    Escuchando voz...
                  </p>
                  <p className="text-sm font-medium text-slate-100 italic truncate max-w-[220px]">
                    {transcript || 'Habla ahora o di "Ingresar"'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsListening(false)}
                aria-label="Detener escucha por voz"
                className="rounded-lg p-1.5 text-slate-300 hover:bg-rose-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <XIcon width={18} height={18} />
              </button>
            </div>

            {/* Voice Command Quick Triggers */}
            <div className="flex items-center justify-between border-t border-rose-900/80 pt-2 text-xs">
              <span className="text-rose-200">Prueba rápida:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleVoiceCommand("ingresar")}
                  className="rounded-lg bg-rose-900/80 px-2.5 py-1 font-semibold text-rose-100 hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  🗣️ Di "Ingresar"
                </button>
                <button
                  type="button"
                  onClick={() => handleVoiceCommand("lector")}
                  className="rounded-lg bg-rose-900/80 px-2.5 py-1 font-semibold text-rose-100 hover:bg-rose-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  🗣️ Di "Lector"
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Permission / Audio Warning Alert */}
        {permissionError && (
          <div className="mt-4 flex w-full max-w-md items-center justify-between rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs font-medium text-amber-900 shadow-sm">
            <span>⚠️ {permissionError}</span>
            <button
              type="button"
              onClick={() => handleVoiceCommand("ingresar")}
              className="ml-2 rounded-lg bg-amber-600 px-2.5 py-1 font-bold text-white hover:bg-amber-700"
            >
              Ingresar Ahora
            </button>
          </div>
        )}

        {/* Active Screen Reader Status Banner */}
        {isScreenReaderActive && (
          <div
            className="mt-6 flex w-full max-w-md items-center gap-3 rounded-2xl border border-blue-300 bg-blue-50 px-4 py-3 text-left text-blue-900 shadow-sm animate-in fade-in"
            role="status"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white">
              <SpeakerIcon width={18} height={18} />
            </span>
            <div className="flex-1 text-xs">
              <p className="font-bold text-blue-950">Lector de pantalla asistido ACTIVO</p>
              <p className="text-blue-700">Pasa el cursor o navega con Tab para escuchar los elementos.</p>
            </div>
          </div>
        )}

        {/* Feature Highlights Badges */}
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {features.map(({ label, icon: Icon, color }) => (
            <li
              key={label}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-extrabold transition-all hover:scale-105 shadow-2xs ${color}`}
            >
              <Icon width={16} height={16} />
              {label}
            </li>
          ))}
        </ul>

        {/* Main Interactive Actions */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3.5">
          {/* Action 0: Direct Guest Mobility (Single Screen) Access without mandatory login */}
     <Link
  href="/movilidad"
  onFocus={() => handleElementFocus("Botón Navegar en Modo Invitado sin registro. Haz clic para usar la guía de movilidad inmediatamente.")}
  onMouseEnter={() => handleElementFocus("Usar Asistencia de Movilidad sin Registro")}
  className="group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-4 text-base font-extrabold text-white shadow-xl shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-emerald-500/35 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 active:scale-[0.98]"
>
  <span>⚡ Usar Movilidad (Sin Registro)</span>
  <ArrowRightIcon width={18} height={18} className="transition-transform group-hover:translate-x-1" />
</Link>

          {/* Action 1: Optional Link to Login */}
          <Link
            href="/login"
            onFocus={() => handleElementFocus("Botón Iniciar Sesión. Haz clic para acceder a tu cuenta guardada.")}
            onMouseEnter={() => handleElementFocus("Iniciar sesión con cuenta existente")}
            className="group relative flex items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 shadow-sm transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          >
            <span>Iniciar Sesión / Guardar Historial</span>
          </Link>

          {/* Action 2: Interactive Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            onFocus={() =>
              handleElementFocus(
                isListening
                  ? "Botón Ingresar con voz. Estado escuchando. Haz clic para detener."
                  : "Botón Ingresar con voz. Haz clic o di ingresar para acceder mediante comandos de voz."
              )
            }
            onMouseEnter={() => handleElementFocus("Activar comandos de voz")}
            aria-pressed={isListening}
            aria-label={
              isListening
                ? "Detener reconocimiento de voz (Atajo Alt + V)"
                : "Ingresar con voz a OpenBlind (Atajo Alt + V)"
            }
            className={`flex items-center justify-center gap-2.5 rounded-2xl border-2 px-5 py-3.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              isListening
                ? "border-rose-600 bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse"
                : "border-emerald-500 bg-white text-emerald-700 hover:bg-emerald-50 shadow-md shadow-emerald-500/10"
            }`}
          >
            {isListening ? (
              <MicOffIcon width={20} height={20} className="animate-bounce" />
            ) : (
              <MicIcon width={20} height={20} className="text-emerald-600" />
            )}
            <span>{isListening ? "Escuchando... (Di 'Ingresar')" : "Ingresar con voz"}</span>
            <kbd className="ml-1 hidden sm:inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-mono text-emerald-800 border border-emerald-200">
              Alt + V
            </kbd>
          </button>

          {/* Action 3: Interactive Screen Reader Toggle Button */}
          <button
            type="button"
            onClick={toggleScreenReader}
            onFocus={() =>
              handleElementFocus(
                isScreenReaderActive
                  ? "Botón Lector de pantalla activo. Haz clic para desactivar."
                  : "Botón Activar lector de pantalla asistido. Haz clic para encender el lector por voz."
              )
            }
            onMouseEnter={() => handleElementFocus("Alternar lector de pantalla por voz")}
            aria-pressed={isScreenReaderActive}
            aria-label={
              isScreenReaderActive
                ? "Desactivar lector de pantalla asistido"
                : "Activar lector de pantalla asistido por voz"
            }
            className={`flex items-center justify-center gap-2.5 rounded-2xl border-2 px-5 py-3.5 text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              isScreenReaderActive
                ? "border-blue-600 bg-blue-600 text-white shadow-lg ring-4 ring-blue-200"
                : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50 shadow-sm"
            }`}
          >
            {isScreenReaderActive ? (
              <CheckIcon width={20} height={20} />
            ) : (
              <SpeakerIcon width={20} height={20} className="text-blue-600" />
            )}
            <span>
              {isScreenReaderActive ? "Lector de pantalla activo 🔊" : "Activar lector de pantalla"}
            </span>
          </button>
        </div>

        {/* WCAG Compliance Badge */}
        <span className="mt-10 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-4 py-2 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-sm">
          <AccessibilityBadgeIcon width={15} height={15} className="text-emerald-600" />
          WCAG 2.1 Nivel AA · Compatible con NVDA, VoiceOver y TalkBack
        </span>
      </div>
    </main>
  );
}
