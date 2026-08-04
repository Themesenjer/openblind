"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MicIcon, MicOffIcon, XIcon, SpeakerIcon, KeyboardIcon, CheckIcon } from "@/components/ui/icons";

// Decoupled voice command list for easy expansion
const COMMAND_HELP_ITEMS = [
  { command: '"Ir a módulos"', action: "Navega a la sección de módulos de aprendizaje", route: "/dashboard/modulos" },
  { command: '"Lector inteligente"', action: "Abre la herramienta de lectura adaptativa", route: "/dashboard/lector" },
  { command: '"Historial"', action: "Muestra tu historial de actividad", route: "/dashboard/historial" },
  { command: '"Accesibilidad"', action: "Abre el panel de ajuste de contraste y fuentes", route: "/dashboard/accesibilidad" },
  { command: '"Ayuda"', action: "Accede al centro de soporte y tutoriales", route: "/dashboard/ayuda" },
  { command: '"Perfil"', action: "Gestiona tu cuenta y preferencias", route: "/dashboard/perfil" },
];

export default function VoiceCommandButton() {
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const router = useRouter();

  // Reference for SpeechRecognition instance
  const recognitionRef = useRef<any>(null);

  // Helper for SpeechSynthesis (Screen reader vocal feedback)
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

  // Process voice commands
  const handleVoiceCommand = useCallback(
    (spokenText: string) => {
      const text = spokenText.toLowerCase().trim();
      setTranscript(spokenText);

      if (text.includes("módulo") || text.includes("modulos")) {
        speakFeedback("Navegando a mis módulos");
        router.push("/dashboard/modulos");
      } else if (text.includes("lector")) {
        speakFeedback("Abriendo lector inteligente");
        router.push("/dashboard/lector");
      } else if (text.includes("historial")) {
        speakFeedback("Abriendo historial de actividad");
        router.push("/dashboard/historial");
      } else if (text.includes("accesibilidad")) {
        speakFeedback("Abriendo preferencias de accesibilidad");
        router.push("/dashboard/accesibilidad");
      } else if (text.includes("ayuda") || text.includes("soporte")) {
        speakFeedback("Navegando a centro de ayuda");
        router.push("/dashboard/ayuda");
      } else if (text.includes("perfil") || text.includes("cuenta")) {
        speakFeedback("Navegando a tu perfil");
        router.push("/dashboard/perfil");
      } else {
        speakFeedback(`Comando "${spokenText}" no reconocido. Di ayuda para ver comandos.`);
      }
    },
    [router, speakFeedback]
  );

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "es-ES";

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript;
      setTranscript(resultText);

      if (event.results[current].isFinal) {
        handleVoiceCommand(resultText);
        setIsListening(false);
      }
    };

    recognition.onerror = (event: any) => {
      console.warn("Error en reconocimiento de voz:", event.error);
      setIsListening(false);
      if (event.error !== "no-speech") {
        speakFeedback("No se pudo procesar el audio. Por favor intenta de nuevo.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, [handleVoiceCommand, speakFeedback]);

  // Toggle listening
  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      speakFeedback("Comandos de voz desactivados.");
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
          setTranscript("");
          speakFeedback("Escuchando comandos de voz. Di un comando o presiona Alt mas V para cancelar.");
        } catch (e) {
          console.warn("Speech recognition busy or failed to start", e);
          setIsListening(true);
          speakFeedback("Escuchando comandos de voz.");
        }
      } else {
        // Fallback simulation mode for browsers without native Web Speech API support
        setIsListening(true);
        speakFeedback("Modo de comandos de voz activo. Selecciona un comando o usa el teclado.");
      }
    }
  }, [isListening, speakFeedback]);

  // Global Keyboard Shortcut: Alt + V
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        toggleListening();
      }
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleListening, isMenuOpen]);

  return (
    <>
      {/* Dynamic Screen Reader Announcement Region (WCAG 2.1 AA) */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="voice-command-live-region"
      >
        {announcement}
      </div>

      {/* Floating Voice Command Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Active Listening Pulse Badge */}
        {isListening && (
          <div
            className="flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-950/90 px-4 py-3 text-white shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2"
            role="status"
          >
            <span className="relative flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-rose-500"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wider text-rose-300 uppercase">
                Escuchando voz...
              </span>
              <span className="text-sm font-medium text-slate-100 italic max-w-[200px] truncate">
                {transcript || "Habla ahora..."}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsListening(false)}
              aria-label="Detener escucha por voz"
              className="ml-2 rounded-lg p-1 text-slate-300 hover:bg-rose-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <XIcon width={16} height={16} />
            </button>
          </div>
        )}

        {/* Main Floating Voice Button Group */}
        <div className="flex items-center gap-2">
          {/* Quick Help Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="voice-command-menu"
            aria-label="Ver lista de comandos de voz disponibles"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-200 shadow-xl transition-all hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            title="Guía de comandos por voz"
          >
            <KeyboardIcon width={20} height={20} />
          </button>

          {/* Primary Floating Action Button */}
          <button
            type="button"
            onClick={toggleListening}
            aria-pressed={isListening}
            aria-label={
              isListening
                ? "Desactivar comandos de voz (Atajo Alt + V)"
                : "Activar comandos de voz (Atajo Alt + V)"
            }
            className={`flex items-center gap-3 rounded-full px-6 py-4 text-base font-bold shadow-2xl transition-all duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${
              isListening
                ? "bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse hover:bg-rose-700"
                : "bg-[#10b981] text-white hover:bg-[#0f9d6e] hover:shadow-emerald-900/30"
            }`}
          >
            {isListening ? (
              <MicOffIcon width={22} height={22} className="animate-bounce" />
            ) : (
              <MicIcon width={22} height={22} />
            )}
            <span>{isListening ? "Escuchando..." : "Comandos de voz"}</span>
            <kbd className="hidden sm:inline-block rounded bg-black/20 px-2 py-0.5 text-xs font-mono text-emerald-100">
              Alt + V
            </kbd>
          </button>
        </div>
      </div>

      {/* Accessible Voice Command Modal / Drawer */}
      {isMenuOpen && (
        <div
          id="voice-command-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                  <SpeakerIcon width={22} height={22} />
                </span>
                <div>
                  <h3 id="voice-modal-title" className="text-lg font-bold text-white">
                    Comandos de Voz Accesibles
                  </h3>
                  <p className="text-xs text-slate-400">
                    Navegación manos libres cumpliendo norma WCAG 2.1 AA
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar modal de comandos por voz"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Comandos de voz admitidos:
              </p>
              <div className="grid gap-2">
                {COMMAND_HELP_ITEMS.map((item) => (
                  <button
                    key={item.command}
                    type="button"
                    onClick={() => {
                      speakFeedback(`Ejecutando ${item.command}`);
                      router.push(item.route);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-left transition-colors hover:border-emerald-500/50 hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <div>
                      <span className="font-mono text-sm font-bold text-emerald-400">
                        {item.command}
                      </span>
                      <p className="text-xs text-slate-400">{item.action}</p>
                    </div>
                    <span className="rounded-lg bg-emerald-950 px-2 py-1 text-[11px] font-medium text-emerald-300 border border-emerald-800/40">
                      Ejecutar
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                <span>Atajo global: <kbd className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-slate-200">Alt + V</kbd></span>
              </div>
              {!recognitionSupported && (
                <span className="text-amber-400">
                  Nota: Reconocimiento nativo simulado en tu navegador.
                </span>
              )}
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="w-full sm:w-auto rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

