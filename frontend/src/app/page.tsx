"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  { label: "Navegación por teclado", icon: KeyboardIcon },
  { label: "Comandos de voz", icon: MicIcon },
  { label: "Lector de pantalla", icon: ScreenReaderIcon },
  { label: "Alto contraste", icon: ContrastIcon },
];

export default function HomePage() {
  const [isListening, setIsListening] = useState(false);
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const router = useRouter();

  const recognitionRef = useRef<ISpeechRecognition | null>(null);

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
      console.warn("SpeechRecognition event:", event.error);
      setIsListening(false);

      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setPermissionError("Permiso de micrófono no otorgado. Puedes usar la prueba rápida abajo.");
        speakFeedback("Permiso de micrófono no otorgado. Selecciona un comando rápido o usa la navegación por teclado.");
      } else if (event.error === "audio-capture") {
        setPermissionError("Micrófono no detectado.");
        speakFeedback("Micrófono no detectado. Puedes hacer clic en Comenzar.");
      }
      // For benign errors like 'no-speech' or 'aborted', we do NOT show noisy error messages
    };

    recognition.onend = () => {
      setIsListening(false);
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
          // Ignore error if already stopped
        }
      }
      setIsListening(false);
      speakFeedback("Reconocimiento de voz detenido.");
    } else {
      setIsListening(true);
      setTranscript("");
      speakFeedback("Escuchando. Di ingresar para acceder a OpenBlind.");

      // Delay recognition start slightly so TTS utterance doesn't overlap/abort microphone input
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
    <main className="flex min-h-screen flex-col items-center bg-[#f8fafc]">
      {/* Live Region for Screen Readers (WCAG 2.1 AA) */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="home-live-region"
      >
        {announcement}
      </div>

      {/* Decorative Top Accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#10b981]" />

      <div className="flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-12 text-center">
        {/* Logo Icon */}
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2563eb] text-white shadow-lg shadow-blue-500/20">
          <EyeIcon width={36} height={36} strokeWidth={2.2} />
        </span>

        {/* Title & Subtitle */}
        <h1 className="mt-8 text-4xl font-extrabold text-[#0f172a] sm:text-5xl">
          Bienvenido a <span className="text-[#2563eb]">OpenBlind</span>
        </h1>
        <p className="mt-3 text-lg text-slate-600">Tecnología accesible para todos.</p>

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

            {/* Simulated Voice Command Quick Triggers (Guarantees testing works anywhere) */}
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

        {/* Feature Highlights */}
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {features.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              <Icon width={16} height={16} />
              {label}
            </li>
          ))}
        </ul>

        {/* Main Interactive Actions */}
        <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
          {/* Action 1: Primary Link to Login */}
          <Link
            href="/login"
            onFocus={() => handleElementFocus("Botón Comenzar. Haz clic para ir al inicio de sesión.")}
            onMouseEnter={() => handleElementFocus("Comenzar e ir al inicio de sesión")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3.5 text-base font-semibold text-white shadow-md transition-all hover:bg-[#1d4ed8] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2"
          >
            <span>Comenzar (Iniciar Sesión)</span>
            <ArrowRightIcon width={18} height={18} />
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
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 text-base font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              isListening
                ? "border-rose-600 bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse"
                : "border-[#10b981] bg-white text-[#0f9d6e] hover:bg-emerald-50"
            }`}
          >
            {isListening ? (
              <MicOffIcon width={20} height={20} className="animate-bounce" />
            ) : (
              <MicIcon width={20} height={20} />
            )}
            <span>{isListening ? "Escuchando... (Di 'Ingresar')" : "Ingresar con voz"}</span>
            <kbd className="ml-1 hidden sm:inline-block rounded bg-emerald-100 px-2 py-0.5 text-xs font-mono text-emerald-800">
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
            className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3.5 text-base font-semibold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              isScreenReaderActive
                ? "border-[#2563eb] bg-[#2563eb] text-white shadow-md ring-4 ring-blue-200"
                : "border-[#2563eb] bg-white text-[#2563eb] hover:bg-blue-50"
            }`}
          >
            {isScreenReaderActive ? (
              <CheckIcon width={20} height={20} />
            ) : (
              <SpeakerIcon width={20} height={20} />
            )}
            <span>
              {isScreenReaderActive ? "Lector de pantalla activo 🔊" : "Activar lector de pantalla"}
            </span>
          </button>
        </div>

        {/* WCAG Compliance Badge */}
        <span className="mt-8 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          <AccessibilityBadgeIcon width={14} height={14} />
          WCAG 2.1 Nivel AA · Compatible con NVDA, VoiceOver y TalkBack
        </span>
      </div>
    </main>
  );
}
