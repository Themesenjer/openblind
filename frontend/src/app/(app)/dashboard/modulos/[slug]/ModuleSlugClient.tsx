"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { fetchWithAuth } from "@/lib/api";
import {
  ArrowRightIcon,
  LayersIcon,
  NewspaperIcon,
  HeadphonesIcon,
  BookIcon,
  GlobeIcon,
  GraduationCapIcon,
  PlayIcon,
  CheckIcon,
  SparklesIcon,
  Volume2Icon,
  XIcon,
} from "@/components/ui/icons";

interface ModuleDetail {
  title: Record<string, string>;
  badge: Record<string, string>;
  description: Record<string, string>;
  icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
  iconBg: string;
  items: {
    id: string;
    title: Record<string, string>;
    subtitle: Record<string, string>;
    duration?: string;
    type?: "lesson" | "braille" | "quiz" | "audio" | "dictation" | "flashcards";
  }[];
}

const MODULE_DETAILS_DATA: Record<string, ModuleDetail> = {
  aprendizaje: {
    title: {
      "es-ES": "Aprendizaje Accesible",
      "es-MX": "Aprendizaje Accesible",
      "en-US": "Accessible Learning",
      "pt-BR": "Aprendizado Acessível",
    },
    badge: {
      "es-ES": "12 lecciones activas",
      "es-MX": "12 lecciones activas",
      "en-US": "12 active lessons",
      "pt-BR": "12 lições ativas",
    },
    description: {
      "es-ES": "Cursos interactivos adaptados con simulador Braille, tarjetas de memoria de atajos de teclado, dictado por voz y cuestionarios auditivos.",
      "es-MX": "Cursos interactivos adaptados con simulador Braille, tarjetas de memoria de atajos de teclado, dictado por voz y cuestionarios auditivos.",
      "en-US": "Interactive courses adapted with Braille simulator, keyboard shortcut flashcards, voice dictation, and audio quizzes.",
      "pt-BR": "Cursos interativos adaptados com simulador Braille, flashcards de atalhos e quizzes sonoros.",
    },
    icon: LayersIcon,
    iconBg: "bg-blue-100/70 text-[#2563eb]",
    items: [
      {
        id: "1",
        title: { "es-ES": "Introducción a la Navegación Accesible", "en-US": "Introduction to Accessible Navigation", "pt-BR": "Introdução à Navegação Acessível" },
        subtitle: { "es-ES": "Fundamentos y atajos clave de teclado", "en-US": "Fundamentals and key keyboard shortcuts", "pt-BR": "Fundamentos e atalhos de teclado" },
        duration: "10 min",
        type: "lesson",
      },
      {
        id: "braille-sim",
        title: { "es-ES": "Simulador Interactivo de Alfabeto Braille", "en-US": "Interactive Braille Alphabet Simulator", "pt-BR": "Simulador Interativo de Alfabeto Braille" },
        subtitle: { "es-ES": "Practica combinaciones de 6 puntos Braille con respuesta sonora", "en-US": "Practice 6-dot Braille combinations with audio feedback", "pt-BR": "Pratique combinações de 6 pontos Braille com áudio" },
        duration: "Práctica Interactiva",
        type: "braille",
      },
      {
        id: "flashcards-nav",
        title: { "es-ES": "Tarjetas Interactivas de Atajos de Teclado", "en-US": "Keyboard Shortcuts Interactive Flashcards", "pt-BR": "Cartões Interativos de Atalhos de Teclado" },
        subtitle: { "es-ES": "Memoriza los atajos principales con pronunciación por voz", "en-US": "Memorize key shortcuts with speech pronunciation", "pt-BR": "Memorize atalhos principais com pronúncia em voz" },
        duration: "Tarjetas 5 min",
        type: "flashcards",
      },
      {
        id: "dictation-practice",
        title: { "es-ES": "Dictado e Interpretación por Voz en Tiempo Real", "en-US": "Real-Time Voice Dictation & Speech Practice", "pt-BR": "Ditado e Interpretação por Voz em Tempo Real" },
        subtitle: { "es-ES": "Dicta frases y comprueba la precisión de lectura con el lector", "en-US": "Dictate sentences and verify speech synthesis accuracy", "pt-BR": "Dite frases e verifique a precisão com o leitor" },
        duration: "Práctica de Voz",
        type: "dictation",
      },
      {
        id: "quiz-acc",
        title: { "es-ES": "Cuestionario Evaluativo de Accesibilidad WCAG", "en-US": "WCAG Accessibility Knowledge Quiz", "pt-BR": "Quiz Avaliativo de Acessibilidade WCAG" },
        subtitle: { "es-ES": "Evalúa tus conocimientos con retroalimentación sonora", "en-US": "Test your skills with audio sound feedback", "pt-BR": "Teste seus conhecimentos com feedback sonoro" },
        duration: "Cuestionario 5 min",
        type: "quiz",
      },
    ],
  },
  noticias: {
    title: {
      "es-ES": "Noticias Accesibles del Día",
      "es-MX": "Noticias Accesibles del Día",
      "en-US": "Daily Accessible News",
      "pt-BR": "Notícias Acessíveis do Dia",
    },
    badge: {
      "es-ES": "Actualizado hoy",
      "es-MX": "Actualizado hoy",
      "en-US": "Updated today",
      "pt-BR": "Atualizado hoje",
    },
    description: {
      "es-ES": "Lee o escucha las noticias del día con contraste optimizado, resalte de lectura y traducción automática.",
      "es-MX": "Lee o escucha las noticias del día con contraste optimizado, resalte de lectura y traducción automática.",
      "en-US": "Read or listen to today's news with optimized contrast, reading highlight, and auto-translation.",
      "pt-BR": "Leia ou ouça notícias do dia com contraste otimizado e tradução automática.",
    },
    icon: NewspaperIcon,
    iconBg: "bg-teal-100/70 text-teal-700",
    items: [
      {
        id: "n1",
        title: { "es-ES": "Avances tecnológicos en accesibilidad universal", "en-US": "Technological advancements in universal accessibility", "pt-BR": "Avanços tecnológicos em acessibilidade universal" },
        subtitle: { "es-ES": "Tecnología e Inteligencia Artificial · Hoy", "en-US": "Technology & AI · Today", "pt-BR": "Tecnologia e IA · Hoje" },
        duration: "5 min lectura",
        type: "audio",
      },
      {
        id: "n2",
        title: { "es-ES": "Nuevas herramientas digitales para la inclusión laboral", "en-US": "New digital tools for workplace inclusion", "pt-BR": "Novas ferramentas digitais para inclusão no trabalho" },
        subtitle: { "es-ES": "Actualidad · Hace 2h", "en-US": "Current Events · 2h ago", "pt-BR": "Atualidades · Há 2h" },
        duration: "8 min lectura",
        type: "audio",
      },
    ],
  },
  audiolibros: {
    title: {
      "es-ES": "Biblioteca de Audiolibros",
      "es-MX": "Biblioteca de Audiolibros",
      "en-US": "Audiobook Library",
      "pt-BR": "Biblioteca de Audiolivros",
    },
    badge: {
      "es-ES": "+340 títulos disponibles",
      "es-MX": "+340 títulos disponibles",
      "en-US": "+340 titles available",
      "pt-BR": "+340 títulos disponíveis",
    },
    description: {
      "es-ES": "Audiolibros narrados con sintetizador adaptativo, control de pitch y marcadores inteligentes.",
      "es-MX": "Audiolibros narrados con sintetizador adaptativo, control de pitch y marcadores inteligentes.",
      "en-US": "Narrated audiobooks with adaptive synthesis, pitch control, and smart bookmarks.",
      "pt-BR": "Audiolivros narrados com controle de velocidade e marcadores inteligentes.",
    },
    icon: HeadphonesIcon,
    iconBg: "bg-purple-100/70 text-purple-700",
    items: [
      {
        id: "a1",
        title: { "es-ES": "El Principito (Versión Narrada Adaptativa)", "en-US": "The Little Prince (Adaptive Narrated Edition)", "pt-BR": "O Pequeno Príncipe (Edição Narrada)" },
        subtitle: { "es-ES": "Antoine de Saint-Exupéry · Narración HD", "en-US": "Antoine de Saint-Exupéry · HD Narration", "pt-BR": "Antoine de Saint-Exupéry · Narração HD" },
        duration: "1h 45m",
        type: "audio",
      },
      {
        id: "a2",
        title: { "es-ES": "Don Quijote de la Mancha (Capítulo 1)", "en-US": "Don Quixote (Chapter 1)", "pt-BR": "Dom Quixote (Capítulo 1)" },
        subtitle: { "es-ES": "Miguel de Cervantes Saavedra", "en-US": "Miguel de Cervantes Saavedra", "pt-BR": "Miguel de Cervantes Saavedra" },
        duration: "25 min",
        type: "audio",
      },
    ],
  },
};

// Braille letter decoder mapping for 6 dots
const BRAILLE_MAP: Record<string, string> = {
  "1": "A",
  "1,2": "B",
  "1,4": "C",
  "1,4,5": "D",
  "1,5": "E",
  "1,2,4": "F",
  "1,2,4,5": "G",
  "1,2,5": "H",
  "2,4": "I",
  "2,4,5": "J",
  "1,3": "K",
  "1,2,3": "L",
  "1,3,4": "M",
  "1,3,4,5": "N",
  "1,3,5": "O",
  "1,2,3,4": "P",
  "1,2,3,4,5": "Q",
  "1,2,3,5": "R",
  "2,3,4": "S",
  "2,3,4,5": "T",
  "1,3,6": "U",
  "1,2,3,6": "V",
  "2,4,5,6": "W",
  "1,3,4,6": "X",
  "1,3,4,5,6": "Y",
  "1,3,5,6": "Z",
};

const FLASHCARDS_DATA = [
  { shortcut: "Tab", action: "Navegar al siguiente elemento interactivo" },
  { shortcut: "Shift + Tab", action: "Navegar al elemento interactivo anterior" },
  { shortcut: "Espacio / Enter", action: "Activar el botón o enlace focalizado" },
  { shortcut: "Alt + 1", action: "Ir al catálogo de Mis Módulos" },
  { shortcut: "Alt + 2", action: "Abrir el Lector Inteligente" },
  { shortcut: "Alt + 4", action: "Abrir la configuración de Accesibilidad" },
];

export default function ModuleSlugClient() {
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug || "";
  const { settings, speakText } = useAccessibility();

  // Active Interactive Activity Modal State
  const [activeActivity, setActiveActivity] = useState<"braille" | "quiz" | "audio_reading" | "dictation" | "flashcards" | null>(null);
  const [activeReadingItem, setActiveReadingItem] = useState<string>("");

  // Braille Simulator State
  const [brailleDots, setBrailleDots] = useState<boolean[]>([false, false, false, false, false, false]);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Flashcard State
  const [currentFlashcard, setCurrentFlashcard] = useState<number>(0);

  // Dictation Practice State
  const [dictationText, setDictationText] = useState<string>("OpenBlind facilita el aprendizaje accesible");

  const Play = PlayIcon || (() => null);
  const ArrowRight = ArrowRightIcon || (() => null);
  const lang = settings.readerLanguage || "es-ES";

  const moduleData = MODULE_DETAILS_DATA[slug] || MODULE_DETAILS_DATA["aprendizaje"];

  const getLangText = (obj: Record<string, string>) => {
    return obj[lang] || obj["es-ES"] || Object.values(obj)[0];
  };

  // Braille dot toggler
  const toggleBrailleDot = (index: number) => {
    const updated = [...brailleDots];
    updated[index] = !updated[index];
    setBrailleDots(updated);

    // Decode letter
    const activeIndices = updated
      .map((val, idx) => (val ? idx + 1 : null))
      .filter((val) => val !== null)
      .join(",");

    const letter = BRAILLE_MAP[activeIndices] || "?";
    if (letter !== "?") {
      speakText(`Letra Braille: ${letter}`);
    }
  };

  const currentBrailleIndices = brailleDots
    .map((val, idx) => (val ? idx + 1 : null))
    .filter((val) => val !== null)
    .join(",");
  const currentBrailleLetter = BRAILLE_MAP[currentBrailleIndices] || "Puntos seleccionados";

  const handleQuizSubmit = (selectedIdx: number) => {
    setQuizAnswer(selectedIdx);
    setQuizSubmitted(true);
    if (selectedIdx === 1) {
      speakText("¡Respuesta Correcta! Las pautas WCAG 2.2 requieren un contraste mínimo de 4.5 a 1.");
    } else {
      speakText("Respuesta Incorrecta. La relación mínima de contraste estándar es 4.5 a 1.");
    }
  };

  const handleOpenItem = async (item: (typeof moduleData.items)[0]) => {
    try {
      await fetchWithAuth(`/api/modulos/${slug}/progreso`, {
        method: "POST",
        body: JSON.stringify({ progreso: 100 }),
      });
    } catch (e) {
      console.warn("Could not update module progress on backend", e);
    }

    if (item.type === "braille") {
      setActiveActivity("braille");
      speakText("Abriendo Simulador Interactivo de Alfabeto Braille");
    } else if (item.type === "quiz") {
      setActiveActivity("quiz");
      setQuizAnswer(null);
      setQuizSubmitted(false);
      speakText("Abriendo Cuestionario Evaluativo de Accesibilidad");
    } else if (item.type === "flashcards") {
      setActiveActivity("flashcards");
      setCurrentFlashcard(0);
      speakText("Abriendo Tarjetas Interactivas de Atajos de Teclado");
    } else if (item.type === "dictation") {
      setActiveActivity("dictation");
      speakText("Abriendo Práctica de Dictado e Interpretación por Voz");
    } else {
      setActiveActivity("audio_reading");
      setActiveReadingItem(getLangText(item.title));
      speakText(`Leyendo lección: ${getLangText(item.title)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 sm:px-10 sm:py-10" id="main-content" tabIndex={-1}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Mapeo de ruta" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link
          href="/dashboard/modulos"
          className="hover:text-[#2563eb] transition-colors"
        >
          Explorar módulos
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{getLangText(moduleData.title)}</span>
      </nav>

      {/* Module Header Container */}
      <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${moduleData.iconBg} shadow-xs`}>
              <moduleData.icon width={32} height={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{getLangText(moduleData.title)}</h1>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563eb] border border-blue-200/60">
                  {getLangText(moduleData.badge)}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium">{getLangText(moduleData.description)}</p>
            </div>
          </div>

          <Link
            href="/dashboard/modulos"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto"
          >
            ← Volver a módulos
          </Link>
        </div>
      </div>

      {/* Module Content Items */}
      <div className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Contenido y Prácticas Interactivas</h2>
        <div className="mt-4 space-y-4">
          {moduleData.items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
                  {item.type === "braille" || item.type === "flashcards" ? (
                    <SparklesIcon width={18} height={18} />
                  ) : item.type === "quiz" ? (
                    <CheckIcon width={18} height={18} />
                  ) : (
                    <Play width={16} height={16} />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{getLangText(item.title)}</h3>
                  <p className="text-xs text-slate-500 font-medium">{getLangText(item.subtitle)}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.duration && (
                  <span className="text-xs font-semibold text-slate-400">{item.duration}</span>
                )}
                <button
                  type="button"
                  onClick={() => handleOpenItem(item)}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                >
                  <span>Iniciar práctica</span>
                  <ArrowRight width={14} height={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Simulador Interactivo de Alfabeto Braille */}
      {activeActivity === "braille" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Simulador de Alfabeto Braille</h3>
              <button
                type="button"
                onClick={() => setActiveActivity(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 font-medium">
              Haz clic en los 6 puntos para activar o desactivar la combinación Braille y decodificar la letra con respuesta sonora:
            </p>

            {/* 6 Dots Braille Cell Grid */}
            <div className="mt-6 flex justify-center">
              <div className="grid grid-cols-2 gap-4 rounded-3xl border-2 border-slate-200 bg-slate-50 p-6 shadow-inner">
                {[0, 1, 2, 3, 4, 5].map((dotIdx) => {
                  const isActive = brailleDots[dotIdx];
                  const dotNum = dotIdx + 1;
                  return (
                    <button
                      key={dotIdx}
                      type="button"
                      onClick={() => toggleBrailleDot(dotIdx)}
                      aria-label={`Punto Braille ${dotNum}`}
                      className={`flex h-16 w-16 items-center justify-center rounded-full text-base font-bold transition-all shadow-md ${
                        isActive
                          ? "bg-[#2563eb] text-white ring-4 ring-blue-300 scale-105"
                          : "bg-white text-slate-400 border-2 border-slate-300 hover:border-blue-400"
                      }`}
                    >
                      {dotNum}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Result Display */}
            <div className="mt-6 rounded-2xl bg-blue-50 border border-blue-200 p-4 text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Letra Decodificada:</span>
              <p className="mt-1 text-3xl font-extrabold text-[#2563eb]">
                {currentBrailleLetter.length === 1 ? `"${currentBrailleLetter}"` : currentBrailleLetter}
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setBrailleDots([false, false, false, false, false, false]);
                }}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Limpiar puntos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Tarjetas Interactivas (Flashcards) */}
      {activeActivity === "flashcards" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Tarjetas de Atajos de Teclado</h3>
              <button
                type="button"
                onClick={() => setActiveActivity(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <div className="mt-6 rounded-3xl border-2 border-blue-200 bg-blue-50/60 p-8 shadow-md transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Atajo {currentFlashcard + 1} de {FLASHCARDS_DATA.length}</span>
              <h4 className="mt-3 text-2xl font-black text-slate-900">{FLASHCARDS_DATA[currentFlashcard].shortcut}</h4>
              <p className="mt-3 text-sm font-medium text-slate-700">{FLASHCARDS_DATA[currentFlashcard].action}</p>

              <button
                type="button"
                onClick={() => speakText(`Atajo ${FLASHCARDS_DATA[currentFlashcard].shortcut}: ${FLASHCARDS_DATA[currentFlashcard].action}`)}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
              >
                <Volume2Icon width={16} height={16} />
                <span>Escuchar atajo</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button
                type="button"
                disabled={currentFlashcard === 0}
                onClick={() => setCurrentFlashcard((prev) => prev - 1)}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-200"
              >
                ← Anterior
              </button>
              <button
                type="button"
                disabled={currentFlashcard === FLASHCARDS_DATA.length - 1}
                onClick={() => setCurrentFlashcard((prev) => prev + 1)}
                className="rounded-xl bg-[#2563eb] px-4 py-2 text-xs font-bold text-white disabled:opacity-40 hover:bg-blue-700"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Práctica de Dictado e Interpretación por Voz */}
      {activeActivity === "dictation" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Dictado e Interpretación por Voz</h3>
              <button
                type="button"
                onClick={() => setActiveActivity(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <p className="mt-3 text-xs text-slate-600 font-medium">
              Escribe o dicta frases para escuchar cómo las procesa la síntesis de voz adaptativa:
            </p>

            <textarea
              rows={3}
              value={dictationText}
              onChange={(e) => setDictationText(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-slate-200 p-4 text-sm font-medium text-slate-800 focus:border-[#2563eb] focus:outline-none focus:ring-3 focus:ring-blue-500/15"
            />

            <div className="mt-4 flex justify-between gap-3">
              <button
                type="button"
                onClick={() => speakText(dictationText, true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
              >
                <Play width={16} height={16} />
                <span>Reproducir Dictado</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  speakText("Escuchando tu voz por el micrófono... Habla claramente una instrucción.", true);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-700"
              >
                <span>Probar Micrófono</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Cuestionario Interactivo de Accesibilidad */}
      {activeActivity === "quiz" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Quiz de Accesibilidad Web (WCAG 2.2)</h3>
              <button
                type="button"
                onClick={() => setActiveActivity(null)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-sm font-bold text-slate-800">
                Pregunta: ¿Cuál es la relación de contraste mínima recomendada para texto normal según el nivel AA de WCAG?
              </p>

              <div className="mt-4 space-y-2.5">
                {["3.0 : 1", "4.5 : 1 (Recomendado)", "7.0 : 1", "2.0 : 1"].map((opt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleQuizSubmit(idx)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-xs font-bold transition-all text-left ${
                      quizAnswer === idx
                        ? idx === 1
                          ? "border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-400"
                          : "border-rose-500 bg-rose-50 text-rose-800 ring-2 ring-rose-400"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{opt}</span>
                    {quizAnswer === idx && (
                      <span>{idx === 1 ? "✓ Correcto" : "✗ Incorrecto"}</span>
                    )}
                  </button>
                ))}
              </div>

              {quizSubmitted && (
                <div
                  className={`mt-4 rounded-2xl p-4 text-xs font-semibold ${
                    quizAnswer === 1
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                  }`}
                >
                  {quizAnswer === 1
                    ? "¡Excelente! La norma WCAG 2.2 nivel AA establece 4.5:1 para garantizar la legibilidad en personas con baja visión."
                    : "Inténtalo de nuevo. La respuesta correcta es 4.5:1 para texto estándar."}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Reproductor / Lector de Lección Audio */}
      {activeActivity === "audio_reading" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-200 text-center">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && "speechSynthesis" in window) {
                    window.speechSynthesis.cancel();
                  }
                  setActiveActivity(null);
                }}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-[#2563eb] shadow-md">
              <Volume2Icon width={32} height={32} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">{activeReadingItem}</h3>
            <p className="mt-2 text-xs text-slate-500 font-medium">
              Lectura adaptativa en curso con síntesis de voz en {settings.readerLanguage}.
            </p>

            <button
              type="button"
              onClick={() => {
                speakText(activeReadingItem);
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700"
            >
              <Play width={16} height={16} />
              <span>Escuchar de nuevo</span>
            </button>
          </div>
        </div>
      )}

      <VoiceCommandButton />
    </div>
  );
}
