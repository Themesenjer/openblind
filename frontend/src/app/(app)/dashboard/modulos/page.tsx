"use client";

import { useState } from "react";
import Link from "next/link";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import {
  SearchIcon,
  ArrowRightIcon,
  LayersIcon,
  NewspaperIcon,
  HeadphonesIcon,
  BookIcon,
  GlobeIcon,
  GraduationCapIcon,
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
  title: string;
  badge: string;
  badgeStyle: string;
  description: string;
  iconName: string;
  iconBg: string;
  href: string;
}

const MODULES: ModuleCardData[] = [
  {
    id: "aprendizaje",
    title: "Aprendizaje",
    badge: "12 lecciones",
    badgeStyle: "bg-blue-50 text-[#2563eb] border border-blue-200/60 font-semibold",
    description: "Cursos interactivos adaptados con audio, texto ampliado y navegación por teclado.",
    iconName: "aprendizaje",
    iconBg: "bg-blue-100/70 text-[#2563eb]",
    href: "/dashboard/modulos/aprendizaje",
  },
  {
    id: "noticias",
    title: "Noticias accesibles",
    badge: "Actualizado hoy",
    badgeStyle: "bg-teal-50 text-teal-700 border border-teal-200/60 font-semibold",
    description: "Lee o escucha las noticias del día con contraste optimizado y síntesis de voz.",
    iconName: "noticias",
    iconBg: "bg-teal-100/70 text-teal-700",
    href: "/dashboard/modulos/noticias",
  },
  {
    id: "audiolibros",
    title: "Audiolibros",
    badge: "Más de 340 títulos",
    badgeStyle: "bg-purple-50 text-purple-700 border border-purple-200/60 font-semibold",
    description: "Biblioteca de audiolibros en español con controles de velocidad y marcadores.",
    iconName: "audiolibros",
    iconBg: "bg-purple-100/70 text-purple-700",
    href: "/dashboard/modulos/audiolibros",
  },
  {
    id: "lectura",
    title: "Lectura inteligente",
    badge: "PDF · EPUB · TXT",
    badgeStyle: "bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold",
    description: "Importa cualquier documento y escúchalo con resaltado de texto sincronizado.",
    iconName: "lectura",
    iconBg: "bg-emerald-100/70 text-emerald-700",
    href: "/dashboard/lector",
  },
  {
    id: "navegacion",
    title: "Navegación web",
    badge: "Asistido por IA",
    badgeStyle: "bg-amber-50 text-amber-700 border border-amber-200/60 font-semibold",
    description: "Navega por sitios web de forma accesible con asistencia de lectura automática.",
    iconName: "navegacion",
    iconBg: "bg-amber-100/70 text-amber-700",
    href: "/dashboard/modulos/navegacion",
  },
  {
    id: "formacion",
    title: "Formación profesional",
    badge: "8 cursos",
    badgeStyle: "bg-rose-50 text-rose-700 border border-rose-200/60 font-semibold",
    description: "Capacitaciones y certificaciones 100% accesibles para el mercado laboral.",
    iconName: "formacion",
    iconBg: "bg-rose-100/70 text-rose-700",
    href: "/dashboard/modulos/formacion",
  },
];

export default function ModulosPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const Search = SearchIcon || (() => null);
  const ArrowRight = ArrowRightIcon || (() => null);

  const filteredModules = MODULES.filter(
    (mod) =>
      mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 sm:px-10 sm:py-10" id="main-content" tabIndex={-1}>
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#2563eb] shadow-sm shadow-blue-500/50" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Catálogo de Módulos
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Explorar módulos
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 font-medium leading-relaxed">
          Todos los módulos están optimizados para lectores de pantalla, síntesis de voz y navegación asistida por teclado.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mt-8 max-w-lg">
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
          placeholder="Buscar módulo por nombre o contenido..."
          className="w-full rounded-2xl border border-slate-200/90 bg-white py-3 pl-11 pr-10 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all focus:border-[#2563eb] focus:outline-none focus:ring-4 focus:ring-blue-500/15"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Modules Grid */}
      <div className="mt-8">
        {filteredModules.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-xs">
            <p className="text-base font-bold text-slate-800">No se encontraron módulos</p>
            <p className="mt-1 text-xs text-slate-500">Intenta buscar con otra palabra clave.</p>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
            >
              Ver todos los módulos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {filteredModules.map((mod) => (
              <article
                key={mod.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5"
              >
                <div>
                  {/* Card Top: Icon + Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${mod.iconBg} transition-transform duration-200 group-hover:scale-105 shadow-xs`}
                    >
                      {renderModuleIcon(mod.iconName)}
                    </div>

                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${mod.badgeStyle}`}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h2 className="mt-5 text-xl font-bold text-slate-900 group-hover:text-[#2563eb] transition-colors">
                    {mod.title}
                  </h2>
                  <p className="mt-2 text-xs text-slate-600 font-normal leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                {/* Primary Action Button */}
                <div className="mt-6 pt-2">
                  <Link
                    href={mod.href}
                    aria-label={`Abrir módulo ${mod.title}`}
                    className="flex w-full items-center justify-between rounded-2xl bg-[#2563eb] px-4 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                  >
                    <span>Abrir módulo</span>
                    <ArrowRight
                      width={16}
                      height={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <VoiceCommandButton />
    </div>
  );
}
