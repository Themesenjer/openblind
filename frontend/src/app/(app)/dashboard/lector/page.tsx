"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { autoTranslateText } from "@/lib/i18n";
import { fetchWithAuth } from "@/lib/api";
import {
  PlayIcon,
  PauseIcon,
  SkipBackIcon,
  SkipForwardIcon,
  Volume2Icon,
  VolumeXIcon,
  TextSizeIcon,
  SparklesIcon,
  SpeakerIcon,
  ContrastIcon,
  ChevronDownIcon,
  GlobeIcon,
  CheckIcon,
  SquareIcon,
  CopyIcon,
  TrashIcon,
  DownloadIcon,
} from "@/components/ui/icons";

interface PresetSample {
  id: string;
  title: string;
  author: string;
  textEs: string;
}

const PRESET_SAMPLES: PresetSample[] = [
  {
    id: "quijote",
    title: "Don Quijote de la Mancha",
    author: "Miguel de Cervantes",
    textEs:
      "Don Quijote de la Mancha es una novela escrita por Miguel de Cervantes Saavedra. Publicada en dos partes, en 1605 y 1615, es considerada la obra cumbre de la literatura en lengua española. La historia narra las aventuras de Alonso Quijano, un hidalgo manchego que decide convertirse en caballero andante. Junto a su escudero Sancho Panza, emprende salidas en busca de aventuras.",
  },
  {
    id: "accesibilidad",
    title: "Guía de Accesibilidad Web",
    author: "OpenBlind Team",
    textEs:
      "La accesibilidad web permite que todas las personas puedan percibir, entender, navegar e interactuar con la web. OpenBlind integra lectores de pantalla, comandos de voz y sintetizadores de voz para garantizar un acceso equitativo y sin barreras.",
  },
  {
    id: "comandos",
    title: "Manual de Comandos de Voz",
    author: "Soporte OpenBlind",
    textEs:
      "Puedes presionar el botón de micrófono o usar los comandos de voz en español para navegar por la aplicación. Di 'Ir a módulos' para explorar los cursos o 'Ir a accesibilidad' para cambiar el idioma y el contraste.",
  },
  {
    id: "cuento",
    title: "El Faro de los Sueños",
    author: "Cuento Corto",
    textEs:
      "En la cima de un acantilado cubierto de niebla, un viejo faro iluminaba las olas del océano. Cada destello guiaba a los navegantes en la noche estrellada.",
  },
];

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const LANGUAGE_NAME_MAP: Record<string, string> = {
  "es-ES": "Español (España)",
  "es-MX": "Español (México)",
  "en-US": "English (US)",
  "pt-BR": "Português (Brasil)",
};

export default function LectorInteligentePage() {
  const { settings, updateSetting, speakText, t } = useAccessibility();

  // Safe Component Fallbacks
  const Play = PlayIcon || (() => null);
  const Pause = PauseIcon || (() => null);
  const SkipBack = SkipBackIcon || (() => null);
  const SkipForward = SkipForwardIcon || (() => null);
  const Volume2 = Volume2Icon || (() => null);
  const VolumeX = VolumeXIcon || (() => null);
  const TextSize = TextSizeIcon || (() => null);
  const Sparkles = SparklesIcon || (() => null);
  const Speaker = SpeakerIcon || (() => null);
  const Contrast = ContrastIcon || (() => null);
  const ChevronDown = ChevronDownIcon || (() => null);
  const Globe = GlobeIcon || (() => null);
  const Check = CheckIcon || (() => null);
  const Square = SquareIcon || (() => null);
  const Copy = CopyIcon || (() => null);
  const Trash = TrashIcon || (() => null);
  const Download = DownloadIcon || (() => null);

  // Text State & Translation
  const [selectedPreset, setSelectedPreset] = useState<string>("quijote");
  const [sourceText, setSourceText] = useState<string>(PRESET_SAMPLES[0].textEs);
  const [displayText, setDisplayText] = useState<string>(PRESET_SAMPLES[0].textEs);
  const [sentences, setSentences] = useState<string[]>([]);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [autoTranslate, setAutoTranslate] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [userTexts, setUserTexts] = useState<{ id: number; titulo: string; contenido: string; idioma: string; creado_en: string }[]>([]);

  useEffect(() => {
    const fetchUserTexts = async () => {
      try {
        const res = await fetchWithAuth("/api/lector/textos");
        if (res.ok) {
          const json = await res.json();
          if (json?.status === "Success" && Array.isArray(json.data)) {
            setUserTexts(json.data);
          }
        }
      } catch (e) {
        console.warn("Could not fetch saved texts from backend", e);
      }
    };
    fetchUserTexts();
  }, []);

  // Reader Custom Settings State
  const [fontSize, setFontSize] = useState<number>(18);
  const [highlightText, setHighlightText] = useState<boolean>(true);
  const [contrastMode, setContrastMode] = useState<"normal" | "alto" | "oscuro">("normal");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(settings.readingSpeed || 1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Load browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Sync Voice selection with active language
  useEffect(() => {
    const lang = settings.readerLanguage || "es-ES";
    const matchingVoice = availableVoices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (matchingVoice) {
      setSelectedVoiceName(matchingVoice.name);
    }
  }, [settings.readerLanguage, availableVoices]);

  // Translate sourceText whenever sourceText or settings.readerLanguage changes if autoTranslate is enabled
  const performTranslation = useCallback(
    async (textToTranslate: string, targetLang: string) => {
      if (!textToTranslate.trim()) {
        setDisplayText("");
        setSentences([]);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = await autoTranslateText(textToTranslate, targetLang);
        setDisplayText(translated);

        const sentenceArr = translated
          .split(/(?<=[.!?])\s+/)
          .filter((s) => s.trim().length > 0);
        setSentences(sentenceArr.length > 0 ? sentenceArr : [translated]);
      } catch {
        setDisplayText(textToTranslate);
        setSentences([textToTranslate]);
      } finally {
        setIsTranslating(false);
      }
    },
    []
  );

  // Auto Translate with Debouncing on sourceText or settings.readerLanguage change
  useEffect(() => {
    if (autoTranslate) {
      const timer = setTimeout(() => {
        performTranslation(sourceText, settings.readerLanguage);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setDisplayText(sourceText);
      const sentenceArr = sourceText.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);
      setSentences(sentenceArr.length > 0 ? sentenceArr : [sourceText]);
    }
  }, [sourceText, settings.readerLanguage, autoTranslate, performTranslation]);

  // Speech Synthesis Playback Loop
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (sentences.length === 0) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      if (isMuted) return;

      const textToRead = sentences[currentSentence] || displayText;
      const utterance = new SpeechSynthesisUtterance(textToRead);

      utterance.lang = settings.readerLanguage || "es-ES";
      utterance.rate = playbackSpeed;
      utterance.volume = (settings.volume ?? 80) / 100;

      if (selectedVoiceName) {
        const voiceObj = availableVoices.find((v) => v.name === selectedVoiceName);
        if (voiceObj) utterance.voice = voiceObj;
      }

      utterance.onend = () => {
        if (currentSentence < sentences.length - 1) {
          setCurrentSentence((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentSentence(0);
        }
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      const timer = setTimeout(() => {
        if (currentSentence < sentences.length - 1) {
          setCurrentSentence((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentSentence(0);
        }
      }, 4000 / playbackSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentSentence, sentences, playbackSpeed, isMuted, settings.readerLanguage, settings.volume, selectedVoiceName, availableVoices, displayText]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentSentence(0);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handlePrev = () => {
    if (currentSentence > 0) {
      setCurrentSentence((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence((prev) => prev + 1);
    }
  };

  const handlePresetSelect = (preset: PresetSample) => {
    setSelectedPreset(preset.id);
    setSourceText(preset.textEs);
    setCurrentSentence(0);
    setIsPlaying(false);
    speakText(`Plantilla seleccionada: ${preset.title}`);
  };

  const handleCopyText = () => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(displayText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const handleDownloadTxt = () => {
    if (typeof window === "undefined") return;
    const blob = new Blob([displayText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lectura_openblind_${settings.readerLanguage}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleClearText = () => {
    setSourceText("");
    setDisplayText("");
    setSentences([]);
    setIsPlaying(false);
    setCurrentSentence(0);
  };

  const handleSaveToBackend = async () => {
    if (!displayText.trim()) return;
    const title = sourceText.substring(0, 30) || "Documento Guardado";
    try {
      const res = await fetchWithAuth("/api/lector/textos", {
        method: "POST",
        body: JSON.stringify({
          titulo: title,
          contenido: displayText,
          idioma: settings.readerLanguage || "es-ES",
        }),
      });
      const data = await res.json();
      if (res.ok && data?.data) {
        setUserTexts((prev) => [data.data, ...prev]);
        const msg = data?.speechMessage || "Texto guardado correctamente en la biblioteca";
        speakText(msg);
      }
    } catch (e) {
      console.warn("Failed to save text to backend", e);
    }
  };

  const handleDeleteFromBackend = async (id: number) => {
    try {
      const res = await fetchWithAuth(`/api/lector/textos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUserTexts((prev) => prev.filter((item) => item.id !== id));
        speakText("El texto se eliminó correctamente");
      }
    } catch (e) {
      console.warn("Failed to delete text from backend", e);
    }
  };

  // Dynamic Contrast Styles
  const readerCardStyles = {
    normal: "bg-white text-slate-800 border-slate-200/90 shadow-sm",
    alto: "bg-black text-white border-2 border-yellow-400 shadow-lg",
    oscuro: "bg-[#0f172a] text-slate-100 border-slate-800 shadow-md",
  };

  const highlightStyles = {
    normal: "bg-[#dbeafe] text-[#1e40af] font-semibold rounded-md px-2 py-1 shadow-xs ring-2 ring-blue-400/40",
    alto: "bg-yellow-300 text-black font-extrabold px-2 py-1 rounded-md ring-2 ring-yellow-500",
    oscuro: "bg-blue-900/90 text-blue-100 font-semibold px-2 py-1 rounded-md ring-2 ring-blue-500",
  };

  const progressPercentage = sentences.length > 0 ? ((currentSentence + 1) / sentences.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 px-6 py-8 sm:px-10 sm:py-10 transition-colors duration-200" id="main-content" tabIndex={-1}>
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#2563eb] shadow-sm shadow-blue-500/50" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            {t("reader_title")}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Lector inteligente
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 font-medium leading-relaxed">
          {t("reader_subtitle")}
        </p>
      </div>

      {/* Language Indicator Banner (Synced globally with Accessibility) */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50/80 px-6 py-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Globe width={20} height={20} className="text-[#2563eb]" />
          <span className="text-xs font-semibold text-slate-700">
            {t("reader_lang_indicator")}{" "}
            <strong className="text-[#2563eb]">{LANGUAGE_NAME_MAP[settings.readerLanguage] || settings.readerLanguage}</strong>
          </span>
        </div>

        {/* Quick Language Selector (Updates global accessibility language) */}
        <div className="flex items-center gap-2">
          {["es-ES", "es-MX", "en-US", "pt-BR"].map((langId) => (
            <button
              key={langId}
              type="button"
              onClick={() => {
                updateSetting("readerLanguage", langId);
                speakText(`Idioma del lector cambiado a ${LANGUAGE_NAME_MAP[langId]}`);
              }}
              className={`rounded-lg px-3 py-1 text-xs font-bold transition-all ${
                settings.readerLanguage === langId
                  ? "bg-[#2563eb] text-white shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {langId.split("-")[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Presets Bar */}
      <div className="mt-6">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {t("reader_presets")}
        </span>
        <div className="mt-2.5 flex items-center gap-2.5 overflow-x-auto pb-1">
          {PRESET_SAMPLES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePresetSelect(preset)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                selectedPreset === preset.id
                  ? "border-[#2563eb] bg-[#2563eb] text-white shadow-md shadow-blue-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Sparkles width={14} height={14} />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Reader Input, Translated Document Card & Audio Controls */}
        <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
          {/* Interactive Custom Text Input Box */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="custom-text-input" className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t("reader_custom_input_label")}
              </label>

              {/* Auto Translate Switch */}
              <button
                type="button"
                onClick={() => setAutoTranslate(!autoTranslate)}
                className="flex items-center gap-2 text-xs font-semibold text-[#2563eb]"
              >
                <Check width={14} height={14} className={autoTranslate ? "opacity-100" : "opacity-30"} />
                <span>{t("reader_auto_translate_active")}</span>
              </button>
            </div>

            <textarea
              id="custom-text-input"
              rows={3}
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                setSelectedPreset("");
              }}
              placeholder="Escribe o pega aquí cualquier texto en español para traducirlo automáticamente..."
              className="mt-3 w-full rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-800 focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/15 transition-all"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => performTranslation(sourceText, settings.readerLanguage)}
                  disabled={isTranslating}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-[#2563eb] hover:bg-blue-100 transition-colors"
                >
                  <Globe width={14} height={14} />
                  <span>{isTranslating ? "Traduciendo..." : "Traducir ahora"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleClearText}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Trash width={14} height={14} />
                  <span>{t("reader_clear")}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Copy width={14} height={14} />
                  <span>{copiedToast ? t("reader_copied") : t("reader_copy")}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadTxt}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Download width={14} height={14} />
                  <span>{t("reader_export_txt")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Document Display & Reader Card */}
          <div
            className={`flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 ${readerCardStyles[contrastMode]}`}
          >
            <div>
              {/* Document Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {PRESET_SAMPLES.find((p) => p.id === selectedPreset)?.title || "Texto Personalizado"}
                  </h2>
                  <p className="mt-1 text-xs opacity-75 font-medium">
                    {t("reader_lang_indicator")} {LANGUAGE_NAME_MAP[settings.readerLanguage]}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Audio Waveform Equalizer Animation */}
                  {isPlaying && (
                    <div className="flex items-end gap-1 h-5 px-2">
                      <span className="w-1 bg-[#2563eb] h-3 animate-pulse rounded-full" />
                      <span className="w-1 bg-[#2563eb] h-5 animate-bounce rounded-full" />
                      <span className="w-1 bg-[#2563eb] h-2 animate-pulse rounded-full" />
                      <span className="w-1 bg-[#2563eb] h-4 animate-bounce rounded-full" />
                    </div>
                  )}

                  {isTranslating && (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 animate-pulse">
                      Traduciendo...
                    </span>
                  )}
                  <span
                    className={`rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
                      isPlaying
                        ? "bg-blue-100 text-[#2563eb] border border-blue-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {isPlaying ? "Leyendo en vivo..." : "Pausado"}
                  </span>
                </div>
              </div>

              {/* Synchronized Reading Text */}
              <div
                className="mt-6 leading-relaxed font-normal transition-all min-h-[140px]"
                style={{ fontSize: `${fontSize}px` }}
                aria-live="polite"
              >
                {sentences.length === 0 ? (
                  <p className="text-slate-400 italic">No hay texto para leer. Escribe algo arriba o selecciona una plantilla.</p>
                ) : (
                  sentences.map((sentence, idx) => {
                    const isCurrent = idx === currentSentence;
                    return (
                      <span
                        key={idx}
                        onClick={() => {
                          setCurrentSentence(idx);
                          setIsPlaying(true);
                        }}
                        title="Haz clic para escuchar esta oración"
                        className={`cursor-pointer transition-all ${
                          isCurrent && highlightText
                            ? highlightStyles[contrastMode]
                            : "hover:opacity-80 hover:underline"
                        }`}
                      >
                        {sentence}{" "}
                      </span>
                    );
                  })
                )}
              </div>
            </div>

            {/* Audio Controls Footer */}
            <div className="mt-10 pt-6 border-t border-slate-200/60">
              {/* Playback Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Oración anterior"
                  disabled={currentSentence === 0}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500"
                >
                  <SkipBack width={20} height={20} />
                </button>

                <button
                  type="button"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pausar lectura" : "Iniciar lectura"}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2563eb] text-white shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 hover:bg-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                >
                  {isPlaying ? <Pause width={24} height={24} /> : <Play width={24} height={24} className="ml-1" />}
                </button>

                <button
                  type="button"
                  onClick={handleStop}
                  aria-label="Detener lectura"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500"
                >
                  <Square width={18} height={18} />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Siguiente oración"
                  disabled={currentSentence === sentences.length - 1}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500"
                >
                  <SkipForward width={20} height={20} />
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                  className="ml-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500"
                >
                  {isMuted ? <VolumeX width={20} height={20} /> : <Volume2 width={20} height={20} />}
                </button>
              </div>

              {/* Audio Progress Scrubbing Bar */}
              <div className="mt-6">
                <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full bg-[#2563eb] transition-all duration-300 rounded-full shadow-xs"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Playback Speed Controls */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-xs font-semibold text-slate-500">Velocidad:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {SPEED_OPTIONS.map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`rounded-xl px-3.5 py-1 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        playbackSpeed === speed
                          ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/20"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {speed.toString().replace(".", ",")} x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Reading Options Side Panel */}
        <div className="lg:col-span-4">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900">Opciones de lectura adaptativa</h2>

            <div className="mt-6 space-y-6">
              {/* Option 1: Tamaño de letra */}
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <TextSize width={18} height={18} className="text-[#2563eb]" />
                    Tamaño de letra
                  </span>
                  <span className="font-bold text-[#2563eb]">{fontSize} píxeles</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-400">A</span>
                  <input
                    type="range"
                    min={12}
                    max={32}
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    aria-label="Ajustar tamaño de letra"
                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#2563eb]"
                  />
                  <span className="text-sm font-bold text-slate-600">A+</span>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Option 2: Resaltar texto */}
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Sparkles width={18} height={18} className="text-[#2563eb]" />
                  Resaltar texto
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={highlightText}
                  onClick={() => setHighlightText(!highlightText)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    highlightText ? "bg-[#2563eb]" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      highlightText ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <hr className="border-slate-100" />

              {/* Option 3: Voz del lector */}
              <div>
                <label htmlFor="voice-select" className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Speaker width={18} height={18} className="text-[#2563eb]" />
                  Voz del lector (Detectada)
                </label>
                <div className="relative mt-2">
                  <select
                    id="voice-select"
                    value={selectedVoiceName}
                    onChange={(e) => setSelectedVoiceName(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-semibold text-slate-800 shadow-xs focus:border-[#2563eb] focus:outline-none focus-ring-3 focus:ring-blue-500/15"
                  >
                    {availableVoices.length === 0 ? (
                      <option value="">Voz predeterminada del sistema</option>
                    ) : (
                      availableVoices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                          {voice.name} ({voice.lang})
                        </option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400">
                    <ChevronDown width={16} height={16} />
                  </div>
                </div>
              </div>

              <hr className="border-slate-100" />

              {/* Option 4: Contraste del lector */}
              <div>
                <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Contrast width={18} height={18} className="text-[#2563eb]" />
                  Contraste del lector
                </span>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setContrastMode("normal")}
                    className={`rounded-xl py-2.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      contrastMode === "normal"
                        ? "border-2 border-[#2563eb] text-[#2563eb] bg-white shadow-xs"
                        : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    Normal
                  </button>

                  <button
                    type="button"
                    onClick={() => setContrastMode("alto")}
                    className={`rounded-xl py-2.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      contrastMode === "alto"
                        ? "bg-black text-white ring-2 ring-yellow-400 shadow-xs"
                        : "bg-slate-900 text-white hover:bg-black"
                    }`}
                  >
                    Alto
                  </button>

                  <button
                    type="button"
                    onClick={() => setContrastMode("oscuro")}
                    className={`rounded-xl py-2.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      contrastMode === "oscuro"
                        ? "bg-[#0f172a] text-white ring-2 ring-blue-500 shadow-xs"
                        : "bg-slate-800 text-slate-200 hover:bg-slate-900"
                    }`}
                  >
                    Oscuro
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VoiceCommandButton />
    </div>
  );
}
