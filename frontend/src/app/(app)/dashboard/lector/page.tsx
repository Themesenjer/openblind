"use client";

import { useState, useEffect, useRef } from "react";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
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
} from "@/components/ui/icons";

// Document sentences for synchronized reading
const DOCUMENT_SENTENCES = [
  "Don Quijote de la Mancha es una novela escrita por Miguel de Cervantes Saavedra .",
  "Publicada en dos partes, en 1605 y 1615, es considerada la obra cumbre de la literatura en lengua española y una de las más importantes de la literatura universal .",
  "La historia narra las aventuras de Alonso Quijano, un hidalgo manchego que, enloquecido por la lectura de libros de caballerías, decide convertirse en caballero andante con el nombre de don Quijote de la Mancha .",
  "Junto a su escudero Sancho Panza, un labrador de su aldea, emprende tres salidas en busca de aventuras .",
];

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const VOICE_OPTIONS = [
  { label: "Español (España) · Femenina", lang: "es-ES" },
  { label: "Español (España) · Masculino", lang: "es-ES" },
  { label: "Español (México) · Femenina", lang: "es-MX" },
  { label: "Español (Latinoamérica) · Neutro", lang: "es-US" },
];

export default function LectorInteligentePage() {
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

  // Reader Settings State
  const [fontSize, setFontSize] = useState<number>(18);
  const [highlightText, setHighlightText] = useState<boolean>(true);
  const [selectedVoice, setSelectedVoice] = useState<string>("Español (España) · Femenina");
  const [contrastMode, setContrastMode] = useState<"normal" | "alto" | "oscuro">("normal");

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSentence, setCurrentSentence] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // SpeechSynthesis Engine
  useEffect(() => {
    if (!isPlaying) {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      if (isMuted) return;

      const textToRead = DOCUMENT_SENTENCES[currentSentence];
      const utterance = new SpeechSynthesisUtterance(textToRead);

      const voiceObj = VOICE_OPTIONS.find((v) => v.label === selectedVoice);
      utterance.lang = voiceObj ? voiceObj.lang : "es-ES";
      utterance.rate = playbackSpeed;

      utterance.onend = () => {
        if (currentSentence < DOCUMENT_SENTENCES.length - 1) {
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
        if (currentSentence < DOCUMENT_SENTENCES.length - 1) {
          setCurrentSentence((prev) => prev + 1);
        } else {
          setIsPlaying(false);
          setCurrentSentence(0);
        }
      }, 4000 / playbackSpeed);

      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentSentence, playbackSpeed, isMuted, selectedVoice]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handlePrev = () => {
    if (currentSentence > 0) {
      setCurrentSentence((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSentence < DOCUMENT_SENTENCES.length - 1) {
      setCurrentSentence((prev) => prev + 1);
    }
  };

  // Dynamic Contrast Styles
  const readerCardStyles = {
    normal: "bg-white text-slate-800 border-slate-200/90 shadow-sm",
    alto: "bg-black text-white border-2 border-yellow-400 shadow-lg",
    oscuro: "bg-[#0f172a] text-slate-100 border-slate-800 shadow-md",
  };

  const highlightStyles = {
    normal: "bg-[#dbeafe] text-[#1e40af] font-medium rounded-md px-1.5 py-0.5 shadow-2xs",
    alto: "bg-yellow-300 text-black font-bold px-1.5 py-0.5 rounded-md",
    oscuro: "bg-blue-900/90 text-blue-100 font-medium px-1.5 py-0.5 rounded-md",
  };

  const progressPercentage = ((currentSentence + 1) / DOCUMENT_SENTENCES.length) * 100;

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 sm:px-10 sm:py-10" id="main-content" tabIndex={-1}>
      {/* Top Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#2563eb] shadow-sm shadow-blue-500/50" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Lectura Adaptativa
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Lector inteligente
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 font-medium leading-relaxed">
          Navega el contenido mediante síntesis de voz, resaltado sincronizado y controles de lectura accesible.
        </p>
      </div>

      {/* Main Grid Layout */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Reader Document Card & Audio Controls */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div
            className={`flex flex-col justify-between rounded-3xl border p-8 transition-all duration-300 ${readerCardStyles[contrastMode]}`}
          >
            <div>
              {/* Document Header */}
              <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200/50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Don Quijote de la Mancha</h2>
                  <p className="mt-1 text-xs opacity-75 font-medium">Miguel de Cervantes · Capítulo 1</p>
                </div>
                <span
                  className={`rounded-full px-3.5 py-1 text-xs font-bold transition-colors ${
                    isPlaying
                      ? "bg-blue-100 text-[#2563eb] border border-blue-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {isPlaying ? "Leyendo..." : "Pausado"}
                </span>
              </div>

              {/* Synchronized Reading Text */}
              <div
                className="mt-6 leading-relaxed font-normal transition-all"
                style={{ fontSize: `${fontSize}px` }}
                aria-live="polite"
              >
                {DOCUMENT_SENTENCES.map((sentence, idx) => {
                  const isCurrent = idx === currentSentence;
                  return (
                    <span
                      key={idx}
                      onClick={() => {
                        setCurrentSentence(idx);
                        setIsPlaying(true);
                      }}
                      className={`cursor-pointer transition-all ${
                        isCurrent && highlightText
                          ? highlightStyles[contrastMode]
                          : "hover:opacity-80"
                      }`}
                    >
                      {sentence}{" "}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Audio Controls Footer */}
            <div className="mt-10 pt-6 border-t border-slate-200/60">
              {/* Playback Action Buttons */}
              <div className="flex items-center justify-center gap-4">
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
                  onClick={handleNext}
                  aria-label="Siguiente oración"
                  disabled={currentSentence === DOCUMENT_SENTENCES.length - 1}
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
            <h2 className="text-base font-bold text-slate-900">Opciones de lectura</h2>

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
                  Voz del lector
                </label>
                <div className="relative mt-2">
                  <select
                    id="voice-select"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-xs font-semibold text-slate-800 shadow-xs focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/15"
                  >
                    {VOICE_OPTIONS.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
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
