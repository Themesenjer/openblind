"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { fetchWithAuth } from "@/lib/api";
import {
  SearchIcon,
  ArrowRightIcon,
  LayersIcon,
  NewspaperIcon,
  HeadphonesIcon,
  BookIcon,
  GlobeIcon,
  GraduationCapIcon,
  SparklesIcon,
} from "@/components/ui/icons";

function renderModuleIcon(iconName: string, width = 26, height = 26) {
  switch (iconName) {
    case "aprendizaje":
      return <LayersIcon width={width} height={height} />;
    case "noticias":
      return <NewspaperIcon width={width} height={height} />;
    case "audiolibros":
      return <HeadphonesIcon width={width} height={height} />;
    case "lectura":
      return <BookIcon width={width} height={height} />;
    case "navegacion":
      return <GlobeIcon width={width} height={height} />;
    case "formacion":
      return <GraduationCapIcon width={width} height={height} />;
    default:
      return <BookIcon width={width} height={height} />;
  }
}

interface ModuleCardData {
  id: string;
  title: Record<string, string>;
  badge: Record<string, string>;
  category: string;
  badgeStyle: string;
  description: Record<string, string>;
  iconName: string;
  iconBg: string;
  href: string;
  progress: number;
}

const MODULES_DATA: ModuleCardData[] = [
  {
    id: "aprendizaje",
    category: "aprendizaje",
    title: {
      "es-ES": "Aprendizaje Accesible",
      "es-MX": "Aprendizaje Accesible",
      "en-US": "Accessible Learning",
      "pt-BR": "Aprendizado Acessível",
    },
    badge: {
      "es-ES": "12 lecciones",
      "es-MX": "12 lecciones",
      "en-US": "12 lessons",
      "pt-BR": "12 lições",
    },
    badgeStyle: "bg-blue-50 text-[#2563eb] border border-blue-200/60 font-semibold",
    description: {
      "es-ES": "Cursos interactivos con simulador Braille, ejercicios sonoros y navegación asistida por teclado.",
      "es-MX": "Cursos interactivos con simulador Braille, ejercicios sonoros y navegación asistida por teclado.",
      "en-US": "Interactive courses with Braille simulator, sound exercises, and keyboard navigation.",
      "pt-BR": "Cursos interativos com simulador Braille, exercícios sonoros e navegação por teclado.",
    },
    iconName: "aprendizaje",
    iconBg: "bg-blue-100/70 text-[#2563eb]",
    href: "/dashboard/modulos/aprendizaje",
    progress: 75,
  },
  {
    id: "noticias",
    category: "noticias",
    title: {
      "es-ES": "Noticias Accesibles",
      "es-MX": "Noticias Accesibles",
      "en-US": "Accessible News",
      "pt-BR": "Notícias Acessíveis",
    },
    badge: {
      "es-ES": "Actualizado hoy",
      "es-MX": "Actualizado hoy",
      "en-US": "Updated today",
      "pt-BR": "Atualizado hoje",
    },
    badgeStyle: "bg-teal-50 text-teal-700 border border-teal-200/60 font-semibold",
    description: {
      "es-ES": "Noticias del día con síntesis de voz, resalte de lectura y traducción automática de contenidos.",
      "es-MX": "Noticias del día con síntesis de voz, resalte de lectura y traducción automática de contenidos.",
      "en-US": "Daily news with text-to-speech, reading highlight, and automatic content translation.",
      "pt-BR": "Notícias diárias com síntese de voz, destaque de leitura e tradução automática.",
    },
    iconName: "noticias",
    iconBg: "bg-teal-100/70 text-teal-700",
    href: "/dashboard/modulos/noticias",
    progress: 40,
  },
  {
    id: "audiolibros",
    category: "audiolibros",
    title: {
      "es-ES": "Biblioteca de Audiolibros",
      "es-MX": "Biblioteca de Audiolibros",
      "en-US": "Audiobook Library",
      "pt-BR": "Biblioteca de Audiolivros",
    },
    badge: {
      "es-ES": "+340 títulos",
      "es-MX": "+340 títulos",
      "en-US": "+340 titles",
      "pt-BR": "+340 títulos",
    },
    badgeStyle: "bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold",
    description: {
      "es-ES": "Audiolibros narrados en múltiples idiomas con control de velocidad, marcadores y notas de voz.",
      "es-MX": "Audiolibros narrados en múltiples idiomas con control de velocidad, marcadores y notas de voz.",
      "en-US": "Audiobooks narrated in multiple languages with speed controls, bookmarks, and voice notes.",
      "pt-BR": "Audiolivros narrados em vários idiomas com controle de velocidade e marcadores.",
    },
    iconName: "audiolibros",
    iconBg: "bg-purple-100/70 text-purple-700",
    href: "/dashboard/modulos/audiolibros",
    progress: 90,
  },
  {
    id: "lectura",
    category: "aprendizaje",
    title: {
      "es-ES": "Lector Inteligente Adaptativo",
      "es-MX": "Lector Inteligente Adaptativo",
      "en-US": "Adaptive Smart Reader",
      "pt-BR": "Leitor Inteligente Adaptativo",
    },
    badge: {
      "es-ES": "Auto-Traductor",
      "es-MX": "Auto-Traductor",
      "en-US": "Auto-Translator",
      "pt-BR": "Tradução Auto",
    },
    badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold",
    description: {
      "es-ES": "Ingresa o importa cualquier texto y escúchalo con resalte sincronizado y auto-traducción en tiempo real.",
      "es-MX": "Ingresa o importa cualquier texto y escúchalo con resalte sincronizado y auto-traducción en tiempo real.",
      "en-US": "Type or import any text and listen with synchronized highlighting and real-time auto-translation.",
      "pt-BR": "Digite ou importe qualquer texto e ouça com destaque sincronizado e tradução em tempo real.",
    },
    iconName: "lectura",
    iconBg: "bg-emerald-100/70 text-emerald-700",
    href: "/dashboard/lector",
    progress: 100,
  },
  {
    id: "navegacion",
    category: "navegacion",
    title: {
      "es-ES": "Navegación Web Asistida",
      "es-MX": "Navegación Web Asistida",
      "en-US": "Assisted Web Navigation",
      "pt-BR": "Navegação Web Assistida",
    },
    badge: {
      "es-ES": "Asistido por IA",
      "es-MX": "Asistido por IA",
      "en-US": "AI Assisted",
      "pt-BR": "Assistido por IA",
    },
    badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold",
    description: {
      "es-ES": "Navega por sitios web de forma accesible con resúmenes automáticos y extracción de texto principal.",
      "es-MX": "Navega por sitios web de forma accesible con resúmenes automáticos y extracción de texto principal.",
      "en-US": "Browse websites accessibly with automated text summaries and distraction-free reader mode.",
      "pt-BR": "Navegue por sites de forma acessível com resumos automáticos e modo leitor sem distrações.",
    },
    iconName: "navegacion",
    iconBg: "bg-amber-100/70 text-amber-700",
    href: "/dashboard/modulos/navegacion",
    progress: 50,
  },
  {
    id: "formacion",
    category: "formacion",
    title: {
      "es-ES": "Formación Profesional QA",
      "es-MX": "Formación Profesional QA",
      "en-US": "Professional QA Training",
      "pt-BR": "Formação Profissional QA",
    },
    badge: {
      "es-ES": "8 certificaciones",
      "es-MX": "8 certificaciones",
      "en-US": "8 certifications",
      "pt-BR": "8 certificações",
    },
    badgeStyle: "bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold",
    description: {
      "es-ES": "Capacitaciones y evaluaciones 100% accesibles en pruebas de accesibilidad WCAG y desarrollo inclusivo.",
      "es-MX": "Capacitaciones y evaluaciones 100% accesibles en pruebas de accesibilidad WCAG y desarrollo inclusivo.",
      "en-US": "Accessible training courses and quizzes in WCAG 2.2 accessibility testing and inclusive development.",
      "pt-BR": "Treinamentos acessíveis em testes de acessibilidade WCAG 2.2 e desenvolvimento inclusivo.",
    },
    iconName: "formacion",
    iconBg: "bg-rose-100/70 text-rose-700",
    href: "/dashboard/modulos/formacion",
    progress: 20,
  },
  {
    id: "dictado",
    category: "aprendizaje",
    title: {
      "es-ES": "Dictado e Interpretación por Voz",
      "es-MX": "Dictado e Interpretación por Voz",
      "en-US": "Voice Dictation & Speech",
      "pt-BR": "Ditado e Interpretação por Voz",
    },
    badge: {
      "es-ES": "Práctica de Voz",
      "es-MX": "Práctica de Voz",
      "en-US": "Voice Practice",
      "pt-BR": "Prática de Voz",
    },
    badgeStyle: "bg-indigo-50 text-indigo-700 border border-indigo-200/60 font-semibold",
    description: {
      "es-ES": "Practica dictado por voz y escucha la pronunciación y corrección fonética en tiempo real.",
      "es-MX": "Practica dictado por voz y escucha la pronunciación y corrección fonética en tiempo real.",
      "en-US": "Practice voice dictation and listen to real-time phonetic correction and pronunciation.",
      "pt-BR": "Pratique ditado por voz e ouça a correção fonética em tempo real.",
    },
    iconName: "aprendizaje",
    iconBg: "bg-indigo-100/70 text-indigo-700",
    href: "/dashboard/modulos/aprendizaje",
    progress: 60,
  },
];

const CATEGORY_TABS = [
  { id: "todos", label: { "es-ES": "Todos", "en-US": "All", "pt-BR": "Todos" } },
  { id: "aprendizaje", label: { "es-ES": "Aprendizaje", "en-US": "Learning", "pt-BR": "Aprendizado" } },
  { id: "noticias", label: { "es-ES": "Noticias", "en-US": "News", "pt-BR": "Notícias" } },
  { id: "audiolibros", label: { "es-ES": "Audiolibros", "en-US": "Audiobooks", "pt-BR": "Audiolivros" } },
  { id: "formacion", label: { "es-ES": "Formación", "en-US": "Training", "pt-BR": "Formação" } },
];

export default function ModulosPage() {
  const { settings, t } = useAccessibility();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todos");
  const [favorites, setFavorites] = useState<string[]>(["aprendizaje", "lectura"]);
  const [modules, setModules] = useState<ModuleCardData[]>(MODULES_DATA);

  useEffect(() => {
    const fetchBackendModules = async () => {
      try {
        const res = await fetchWithAuth("/api/modulos");
        const json = await res.json();
        if (json?.status === "Success" && Array.isArray(json.data)) {
          const favs: string[] = [];
          setModules((prev) =>
            prev.map((mod) => {
              const match = json.data.find(
                (b: { slug?: string; id?: string; progreso?: number; es_favorito?: boolean }) =>
                  (b.slug || b.id) === mod.id
              );
              if (match) {
                if (match.es_favorito) favs.push(mod.id);
                return { ...mod, progress: match.progreso ?? match.progress ?? mod.progress };
              }
              return mod;
            })
          );
          if (favs.length > 0) {
            setFavorites(favs);
          }
        }
      } catch (e) {
        console.warn("Could not fetch modules from backend", e);
      }
    };
    fetchBackendModules();
  }, []);

  const toggleFavorite = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );

    try {
      await fetchWithAuth(`/api/modulos/${id}/favorito`, { method: "POST" });
    } catch (e) {
      console.warn("Failed to sync favorite state with backend", e);
    }
  };

  const Search = SearchIcon || (() => null);
  const ArrowRight = ArrowRightIcon || (() => null);
  const lang = settings.readerLanguage || "es-ES";

  const getLangText = (obj: Record<string, string>) => {
    return obj[lang] || obj["es-ES"] || Object.values(obj)[0];
  };

  const filteredModules = modules.filter((mod) => {
    const titleText = getLangText(mod.title).toLowerCase();
    const descText = getLangText(mod.description).toLowerCase();
    const matchesSearch = titleText.includes(searchQuery.toLowerCase()) || descText.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "todos" || mod.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 px-6 py-8 sm:px-10 sm:py-10 transition-colors duration-200" id="main-content" tabIndex={-1}>
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#2563eb] shadow-sm shadow-blue-500/50" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Catálogo Internacional de Módulos
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          {t("modules_title")}
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 font-medium leading-relaxed">
          {t("modules_subtitle")}
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full max-w-md">
          <label htmlFor="search-modules" className="sr-only">
            Buscar módulo
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search width={20} height={20} />
          </div>
          <input
            id="search-modules"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("modules_search_placeholder")}
            className="w-full rounded-2xl border border-slate-200/90 bg-white py-3 pl-11 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSelectedCategory(tab.id);
              }}
              className={`rounded-2xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === tab.id
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
              }`}
            >
              {getLangText(tab.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="mt-8">
        {filteredModules.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-bold text-slate-800">No se encontraron módulos</p>
            <p className="mt-1 text-xs text-slate-500">Intenta buscar con otra palabra clave o cambiar de categoría.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("todos");
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
            >
              Ver todos los módulos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredModules.map((mod) => {
              const isFav = favorites.includes(mod.id);
              return (
                <article
                  key={mod.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5"
                >
                  <div>
                    {/* Card Top: Icon + Badge + Favorite Toggle */}
                    <div className="flex items-start justify-between gap-3">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${mod.iconBg} transition-transform duration-200 group-hover:scale-105 shadow-xs`}
                      >
                        {renderModuleIcon(mod.iconName)}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleFavorite(mod.id, e)}
                          aria-label={isFav ? "Quitar de favoritos" : "Marcar favorito"}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                            isFav ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-400 hover:text-amber-500"
                          }`}
                        >
                          <SparklesIcon width={14} height={14} />
                        </button>

                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${mod.badgeStyle}`}
                        >
                          {getLangText(mod.badge)}
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h2 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-[#2563eb] transition-colors">
                      {getLangText(mod.title)}
                    </h2>
                    <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">
                      {getLangText(mod.description)}
                    </p>

                    {/* Progress Indicator */}
                    <div className="mt-5 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Progreso del módulo</span>
                        <span className="font-bold text-[#2563eb]">{mod.progress}%</span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-[#2563eb] transition-all duration-300"
                          style={{ width: `${mod.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="mt-6 pt-2">
                    <Link
                      href={mod.href}
                      prefetch={false}
                      aria-label={`Abrir módulo ${getLangText(mod.title)}`}
                      className="flex w-full items-center justify-between rounded-2xl bg-[#2563eb] px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                    >
                      <span>{t("modules_open")}</span>
                      <ArrowRight
                        width={16}
                        height={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <VoiceCommandButton />
    </div>
  );
}
