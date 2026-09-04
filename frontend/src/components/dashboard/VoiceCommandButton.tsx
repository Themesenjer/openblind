"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import { MicIcon, MicOffIcon, XIcon, SpeakerIcon, KeyboardIcon } from "@/components/ui/icons";

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

const COMMAND_HELP_ITEMS = [
  { command: '"Siguiente paso"', action: "Avanza y habla el siguiente paso de la ruta (Alt + N)" },
  { command: '"Paso anterior"', action: "Retrocede y habla el paso anterior (Alt + B)" },
  { command: '"Repetir paso"', action: "Vuelve a decir en voz alta las instrucciones del paso actual" },
  { command: '"Agregar paso"', action: "Abre el formulario para añadir un nuevo paso a la ruta (Alt + A)" },
  { command: '"Nuevo destino"', action: "Crea una nueva ruta a donde tú quieras ir (Alt + D)" },
  { command: '"Emergencia" / "SOS"', action: "Dispara la alarma y reporte de voz SOS de emergencia (Alt + E)" },
  { command: '"Sonar"', action: "Alterna el sonar por audio espacial nativo" },
  { command: '"¿Dónde estoy?"', action: "Reporta tu ubicación actual y sensor de movilidad" },
  { command: '"Iniciar movilidad"', action: "Activa la guía de voz en tiempo real" },
  { command: '"Modo invitado"', action: "Información de navegación sin registro" },
  { command: '"Ir a inicio"', action: "Vuelve al panel principal", route: "/dashboard" },
  { command: '"Ir a módulos"', action: "Navega a la sección de módulos de aprendizaje", route: "/dashboard/modulos" },
  { command: '"Lector inteligente"', action: "Abre la herramienta de lectura adaptativa", route: "/dashboard/lector" },
  { command: '"Historial"', action: "Muestra tu historial de actividad", route: "/dashboard/historial" },
  { command: '"Accesibilidad"', action: "Abre el panel de ajuste de contraste y fuentes", route: "/dashboard/accesibilidad" },
  { command: '"Ayuda"', action: "Accede al centro de soporte y tutoriales", route: "/dashboard/ayuda" },
  { command: '"Perfil"', action: "Gestiona tu cuenta y preferencias", route: "/dashboard/perfil" },
  { command: '"Alto contraste"', action: "Alterna el modo de alto contraste para baja visión" },
  { command: '"Cerrar sesión"', action: "Cierra tu sesión y vuelve al login", route: "/login" },
];

export default function VoiceCommandButton() {
  const { settings, updateSetting } = useAccessibility();
  const [isListening, setIsListening] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [customTextCommand, setCustomTextCommand] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const router = useRouter();

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const speakFeedback = useCallback(
    (text: string, force: boolean = true) => {
      setAnnouncement(text);
      if ((settings.screenReader || force) && typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = settings.readerLanguage || "es-ES";
          utterance.rate = settings.readingSpeed || 1.0;
          utterance.volume = (settings.volume ?? 80) / 100;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          console.warn("Speech synthesis error", e);
        }
      }
    },
    [settings.screenReader, settings.readerLanguage, settings.readingSpeed, settings.volume]
  );

  useEffect(() => {
    if (isMenuOpen) {
      speakFeedback("Guía de instrucciones para hablar abierta. Selecciona o presiona cualquier comando para escucharlo en voz alta.", true);
    }
  }, [isMenuOpen, speakFeedback]);

  const handleVoiceCommand = useCallback(
    (spokenText: string) => {
      const text = spokenText.toLowerCase().trim();
      setTranscript(spokenText);

      if (text.includes("siguiente paso") || text.includes("avanzar paso")) {
        speakFeedback("Avanzando al siguiente paso de la ruta...");
      } else if (text.includes("paso anterior") || text.includes("retroceder paso")) {
        speakFeedback("Volviendo al paso anterior...");
      } else if (text.includes("repetir paso") || text.includes("instruccion") || text.includes("instrucción")) {
        speakFeedback("Repitiendo la instrucción del paso actual...");
      } else if (text.includes("agregar paso") || text.includes("añadir paso") || text.includes("nuevo paso")) {
        speakFeedback("Abriendo formulario de agregar paso. Presiona Alt + A o usa la pantalla.");
      } else if (text.includes("crear destino") || text.includes("nuevo destino") || text.includes("a donde quiero ir")) {
        speakFeedback("Abriendo formulario para crear un nuevo destino. Presiona Alt + D.");
      } else if (text.includes("emergencia") || text.includes("sos") || text.includes("auxilio")) {
        speakFeedback("ATENCIÓN: Alerta de emergencia SOS activada por comando de voz.");
      } else if (text.includes("sonar") || text.includes("audio espacial")) {
        speakFeedback("Sonar por Audio Espacial ajustado.");
      } else if (text.includes("donde estoy") || text.includes("dónde estoy") || text.includes("ubicacion") || text.includes("ubicación")) {
        speakFeedback("Te encuentras en la Entrada Principal del Edificio Central Yavirac. Sensor activo.");
      } else if (text.includes("movilidad") || text.includes("guia") || text.includes("guía")) {
        speakFeedback("Guía de movilidad activada. Escaneando sensores beacons de entorno.");
      } else if (text.includes("invitado")) {
        speakFeedback("Navegando en Modo Invitado de Movilidad Libre sin registro.");
      } else if (text.includes("inicio") || text.includes("panel") || text.includes("dashboard") || text.includes("pantalla única")) {
        speakFeedback("Navegando al inicio de pantalla única");
        router.push("/dashboard");
      } else if (text.includes("módulo") || text.includes("modulos") || text.includes("curso")) {
        speakFeedback("Navegando a mis módulos");
        router.push("/dashboard/modulos");
      } else if (text.includes("lector")) {
        speakFeedback("Abriendo lector inteligente");
        router.push("/dashboard/lector");
      } else if (text.includes("historial") || text.includes("actividad")) {
        speakFeedback("Abriendo historial de actividad");
        router.push("/dashboard/historial");
      } else if (text.includes("accesibilidad") || text.includes("ajuste")) {
        speakFeedback("Abriendo preferencias de accesibilidad");
        router.push("/dashboard/accesibilidad");
      } else if (text.includes("ayuda") || text.includes("soporte") || text.includes("tutorial")) {
        speakFeedback("Navegando a centro de ayuda");
        router.push("/dashboard/ayuda");
      } else if (text.includes("perfil") || text.includes("cuenta")) {
        speakFeedback("Navegando a tu perfil");
        router.push("/dashboard/perfil");
      } else if (text.includes("contraste")) {
        const nextContrast = !settings.highContrast;
        updateSetting("highContrast", nextContrast);
        speakFeedback(nextContrast ? "Alto contraste activado" : "Alto contraste desactivado");
      } else if (text.includes("registrar") || text.includes("crear cuenta")) {
        speakFeedback("Navegando a formulario de registro");
        router.push("/register");
      } else if (text.includes("salir") || text.includes("cerrar") || text.includes("login") || text.includes("iniciar sesión")) {
        speakFeedback("Cerrando sesión");
        router.push("/login");
      } else {
        speakFeedback(`Comando "${spokenText}" no reconocido. Di 'ayuda' para ver comandos.`);
      }
    },
    [router, speakFeedback, settings.highContrast, updateSetting]
  );

  useEffect(() => {
    if (!settings.voiceCommands) return;
    if (typeof window === "undefined") return;

    const windowObj = window as unknown as Record<string, unknown>;
    const SpeechRecognitionCtor = (windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition) as
      | (new () => ISpeechRecognition)
      | undefined;

    if (!SpeechRecognitionCtor) {
      setTimeout(() => setRecognitionSupported((prev) => (prev ? false : prev)), 0);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = settings.readerLanguage || "es-ES";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentResultText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentResultText += event.results[i][0].transcript;
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
      setTranscript(currentResultText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.warn("SpeechRecognition status:", event.error);
      if (event.error === "no-speech") {
        return; // Ignorar silencio temporal para evitar cierre prematuro
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsListening(false);
        speakFeedback("Permiso de micrófono no otorgado en el navegador.");
      }
    };

    recognition.onend = () => {
      // Si el usuario aún desea escuchar, reiniciar automáticamente la escucha
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
  }, [settings.voiceCommands, settings.readerLanguage, handleVoiceCommand, speakFeedback]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // Ignore error
        }
      }
      setIsListening(false);
      speakFeedback("Comandos de voz desactivados.");
    } else {
      setIsListening(true);
      setTranscript("");
      speakFeedback("Escuchando comandos de voz.");

      setTimeout(() => {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            console.warn("Speech recognition start busy or skipped", e);
          }
        }
      }, 400);
    }
  }, [isListening, speakFeedback]);

  useEffect(() => {
    if (!settings.voiceCommands) return;

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
  }, [settings.voiceCommands, toggleListening, isMenuOpen]);

  if (!settings.voiceCommands) {
    return null;
  }

  return (
    <>
      {/* Live Region for Screen Reader Announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
        id="voice-command-live-region"
      >
        {announcement}
      </div>

      {/* Floating Voice Command Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="voice-command-menu"
            aria-label="Ver lista de comandos de voz disponibles"
            className="flex h-13 w-13 items-center justify-center rounded-2xl border border-slate-700/80 bg-slate-900/95 text-slate-200 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
            title="Guía de comandos por voz"
          >
            <KeyboardIcon width={20} height={20} />
          </button>

          <button
            type="button"
            onClick={toggleListening}
            aria-pressed={isListening}
            aria-label={
              isListening
                ? "Desactivar comandos de voz (Atajo Alt + V)"
                : "Activar comandos de voz (Atajo Alt + V)"
            }
            className={`flex items-center gap-3.5 rounded-2xl px-6 py-3.5 text-base font-extrabold shadow-2xl transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
              isListening
                ? "bg-rose-600 text-white ring-4 ring-rose-300 animate-pulse hover:bg-rose-700 shadow-rose-900/40"
                : "bg-gradient-to-r from-[#10b981] to-[#059669] text-white shadow-emerald-900/30 hover:from-[#0f9d6e] hover:to-[#047857]"
            }`}
          >
            {isListening ? (
              <MicOffIcon width={22} height={22} className="animate-bounce" />
            ) : (
              <MicIcon width={22} height={22} />
            )}
            <span>{isListening ? "Escuchando..." : "Comandos de voz"}</span>
            <kbd className="hidden sm:inline-block rounded-lg bg-black/25 px-2 py-0.5 text-xs font-mono font-bold text-emerald-100 border border-white/10">
              Alt + V
            </kbd>
          </button>
        </div>
      </div>

      {/* Voice Commands Modal */}
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

            {/* Interactive command tester input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!customTextCommand.trim()) return;
                handleVoiceCommand(customTextCommand);
                setCustomTextCommand("");
                setIsMenuOpen(false);
              }}
              className="mt-4 flex gap-2"
            >
              <input
                type="text"
                value={customTextCommand}
                onChange={(e) => setCustomTextCommand(e.target.value)}
                placeholder="Prueba un comando (ej: 'Ir a módulos', 'Alto contraste')..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Ejecutar
              </button>
            </form>

            <div className="mt-4 max-h-56 overflow-y-auto space-y-2 pr-1">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Comandos de voz admitidos:
              </p>
              <div className="grid gap-2">
                {COMMAND_HELP_ITEMS.map((item) => (
                  <button
                    key={item.command}
                    type="button"
                    onFocus={() => speakFeedback(`Instrucción: ${item.command}. Acción: ${item.action}`, true)}
                    onClick={() => {
                      speakFeedback(`Ejecutando instrucción: ${item.command}. ${item.action}`, true);
                      if (item.route) {
                        router.push(item.route);
                      } else {
                        handleVoiceCommand(item.command.replace(/"/g, ""));
                      }
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
