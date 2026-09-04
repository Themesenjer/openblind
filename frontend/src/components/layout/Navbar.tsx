"use client";

import Link from "next/link";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import { EyeIcon, TextSizeIcon, MoonIcon, ContrastIcon, GlobeIcon } from "@/components/ui/icons";

const LANGUAGES = ["es-ES", "es-MX", "en-US", "pt-BR"];

export default function Navbar() {
  const { settings, updateSetting, speakText } = useAccessibility();

  const handleToggleLargeText = () => {
    const next = !settings.largeText;
    updateSetting("largeText", next);
    speakText(next ? "Texto grande activado" : "Texto grande desactivado");
  };

  const handleToggleDarkMode = () => {
    const next = !settings.darkMode;
    updateSetting("darkMode", next);
    speakText(next ? "Modo oscuro activado" : "Modo oscuro desactivado");
  };

  const handleToggleHighContrast = () => {
    const next = !settings.highContrast;
    updateSetting("highContrast", next);
    speakText(next ? "Alto contraste activado" : "Alto contraste desactivado");
  };

  const handleCycleLanguage = () => {
    const currentIndex = LANGUAGES.indexOf(settings.readerLanguage || "es-ES");
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    const nextLang = LANGUAGES[nextIndex];
    updateSetting("readerLanguage", nextLang);
    speakText(`Idioma cambiado a ${nextLang}`);
  };

  const toolbarButtons = [
    {
      id: "largeText",
      label: "Aumentar tamaño de texto",
      icon: TextSizeIcon,
      active: settings.largeText,
      onClick: handleToggleLargeText,
    },
    {
      id: "darkMode",
      label: "Cambiar a modo oscuro",
      icon: MoonIcon,
      active: settings.darkMode,
      onClick: handleToggleDarkMode,
    },
    {
      id: "highContrast",
      label: "Activar alto contraste",
      icon: ContrastIcon,
      active: settings.highContrast,
      onClick: handleToggleHighContrast,
    },
    {
      id: "language",
      label: `Idioma: ${settings.readerLanguage || "es-ES"}`,
      icon: GlobeIcon,
      active: false,
      onClick: handleCycleLanguage,
    },
  ];

  return (
    <header className="flex w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-6 py-3.5 backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800 transition-colors">
      <Link href="/" className="flex items-center gap-2.5 group">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1d4ed8] to-[#2563eb] text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
          <EyeIcon width={19} height={19} />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-[#0f172a] dark:text-white">OpenBlind</span>
      </Link>

      <nav aria-label="Herramientas de accesibilidad" className="flex items-center gap-2">
        {toolbarButtons.map(({ id, label, icon: Icon, active, onClick }) => (
          <button
            key={id}
            type="button"
            onClick={onClick}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={`flex h-9.5 items-center gap-1.5 px-3 rounded-xl border text-xs font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
              active
                ? "bg-[#2563eb] text-white border-blue-600 shadow-md shadow-blue-500/20"
                : "border-slate-200/90 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            <Icon width={17} height={17} />
            {id === "language" && (
              <span className="font-mono text-[10px] uppercase">{settings.readerLanguage?.split("-")[0] || "ES"}</span>
            )}
          </button>
        ))}
      </nav>
    </header>
  );
}
