"use client";

import { useState } from "react";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { fetchWithAuth } from "@/lib/api";
import {
  EyeIcon,
  ContrastIcon,
  MoonIcon,
  TextSizeIcon,
  MicIcon,
  KeyboardIcon,
  SpeakerIcon,
  Volume2Icon,
  GlobeIcon,
  CheckIcon,
  SparklesIcon,
} from "@/components/ui/icons";

const LANGUAGE_OPTIONS = [
  { id: "es-ES", label: "Español (España)", flag: "es" },
  { id: "es-MX", label: "Español (México)", flag: "mx" },
  { id: "en-US", label: "English (US)", flag: "us" },
  { id: "pt-BR", label: "Português (BR)", flag: "br" },
];

const ACCENT_COLOR_OPTIONS = [
  { id: "blue", label: "Azul (defecto)", colorClass: "bg-blue-600", borderClass: "border-blue-600" },
  { id: "green", label: "Verde", colorClass: "bg-emerald-600", borderClass: "border-emerald-600" },
  { id: "purple", label: "Violeta", colorClass: "bg-purple-600", borderClass: "border-purple-600" },
  { id: "orange", label: "Naranja", colorClass: "bg-orange-600", borderClass: "border-orange-600" },
] as const;

export default function AccesibilidadPage() {
  const { settings, updateSetting, saveSettings, resetSettings, speakText } = useAccessibility();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggle = (key: keyof typeof settings, label: string) => {
    const newValue = !settings[key];
    updateSetting(key, newValue as never);
    const statusText = newValue ? "activado" : "desactivado";
    speakText(`${label} ${statusText}`);
  };

  const handleSave = async () => {
    saveSettings();
    try {
      const payload = {
        lector_pantalla: settings.screenReader,
        alto_contraste: settings.highContrast,
        modo_oscuro: settings.darkMode,
        texto_grande: settings.largeText,
        comandos_voz: settings.voiceCommands,
        navegacion_teclado: settings.keyboardNav,
        velocidad_lectura: settings.readingSpeed,
        volumen: settings.volume,
        idioma: settings.readerLanguage,
        color_acento: settings.accentColor,
      };

      const res = await fetchWithAuth("/api/accessibility", {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const msg = data?.speechMessage || "Configuración de accesibilidad guardada correctamente";
      showToast(msg);
    } catch {
      showToast("Configuración guardada localmente (Backend offline)");
    }
  };

  const handleReset = () => {
    resetSettings();
    showToast("Configuración restablecida a los valores predeterminados");
  };

  const primaryBtnBg = {
    blue: "bg-[#2563eb] hover:bg-blue-700 shadow-blue-600/20",
    green: "bg-[#16a34a] hover:bg-emerald-700 shadow-emerald-600/20",
    purple: "bg-[#9333ea] hover:bg-purple-700 shadow-purple-600/20",
    orange: "bg-[#ea580c] hover:bg-orange-700 shadow-orange-600/20",
  }[settings.accentColor];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-6 py-8 sm:px-10 sm:py-10 transition-colors" id="main-content" tabIndex={-1}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 text-white px-5 py-3.5 shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-3"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <CheckIcon width={16} height={16} />
          </span>
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header Title Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Configuración de accesibilidad
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Personaliza tu experiencia de navegación e idioma.
        </p>
      </div>

      {/* Grid of 6 Core Accessibility Toggle Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Card 1: Lector de pantalla */}
        <div
          className={`flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all ${
            settings.screenReader ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <EyeIcon width={22} height={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Lector de pantalla</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Narración completa de la interfaz compatible con NVDA, VoiceOver y TalkBack
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.screenReader}
            aria-label="Lector de pantalla"
            onClick={() => handleToggle("screenReader", "Lector de pantalla")}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 ${
              settings.screenReader ? "bg-[#2563eb]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                settings.screenReader ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Card 2: Modo alto contraste */}
        <div
          className={`flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all ${
            settings.highContrast ? "border-amber-500 ring-1 ring-amber-500/30" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ContrastIcon width={22} height={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Modo alto contraste</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Máximo contraste para mayor visibilidad en condiciones de baja visión
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.highContrast}
            aria-label="Modo alto contraste"
            onClick={() => handleToggle("highContrast", "Modo alto contraste")}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 ${
              settings.highContrast ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                settings.highContrast ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Card 3: Modo oscuro */}
        <div
          className={`flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all ${
            settings.darkMode ? "border-slate-500 ring-1 ring-slate-500/30" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <MoonIcon width={22} height={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Modo oscuro</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Reduce la fatiga visual en ambientes con poca luz
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.darkMode}
            aria-label="Modo oscuro"
            onClick={() => handleToggle("darkMode", "Modo oscuro")}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 ${
              settings.darkMode ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                settings.darkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Card 4: Texto grande */}
        <div
          className={`flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all ${
            settings.largeText ? "border-purple-500 ring-1 ring-purple-500/30" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TextSizeIcon width={22} height={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Texto grande</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Aumenta el tamaño base del texto en toda la plataforma
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.largeText}
            aria-label="Texto grande"
            onClick={() => handleToggle("largeText", "Texto grande")}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 ${
              settings.largeText ? "bg-purple-600" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                settings.largeText ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Card 5: Comandos de voz */}
        <div
          className={`flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all ${
            settings.voiceCommands ? "border-emerald-500 ring-1 ring-emerald-500/30" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <MicIcon width={22} height={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Comandos de voz</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Controla toda la interfaz con tu voz en español
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.voiceCommands}
            aria-label="Comandos de voz"
            onClick={() => handleToggle("voiceCommands", "Comandos de voz")}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 ${
              settings.voiceCommands ? "bg-[#10b981]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                settings.voiceCommands ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Card 6: Navegación por teclado */}
        <div
          className={`flex items-start justify-between rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-xs transition-all ${
            settings.keyboardNav ? "border-blue-500 ring-1 ring-blue-500/30" : "border-slate-200 dark:border-slate-800"
          }`}
        >
          <div className="flex items-start gap-4 pr-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <KeyboardIcon width={22} height={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Navegación por teclado</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Acceso completo a todas las funciones usando solo el teclado
              </p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.keyboardNav}
            aria-label="Navegación por teclado"
            onClick={() => handleToggle("keyboardNav", "Navegación por teclado")}
            className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-blue-500 ${
              settings.keyboardNav ? "bg-[#2563eb]" : "bg-slate-300 dark:bg-slate-700"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                settings.keyboardNav ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section: Audio y voz */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Audio y voz</h2>

        <div className="mt-6 space-y-6">
          {/* Velocidad de lectura */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <SpeakerIcon width={18} height={18} className="text-[#2563eb]" />
                Velocidad de lectura
              </span>
              <span className="font-bold text-[#2563eb]">{settings.readingSpeed.toFixed(1)}x</span>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={settings.readingSpeed}
                onChange={(e) => updateSetting("readingSpeed", parseFloat(e.target.value))}
                aria-label="Ajustar velocidad de lectura"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 accent-[#2563eb]"
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-400">
              <span>Lenta</span>
              <span>Rápida</span>
            </div>
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          {/* Volumen */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <Volume2Icon width={18} height={18} className="text-[#2563eb]" />
                Volumen
              </span>
              <span className="font-bold text-[#2563eb]">{settings.volume}%</span>
            </div>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                min={0}
                max={100}
                step={5}
                value={settings.volume}
                onChange={(e) => updateSetting("volume", parseInt(e.target.value, 10))}
                aria-label="Ajustar volumen"
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 dark:bg-slate-700 accent-[#2563eb]"
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-400">
              <span>Silencio</span>
              <span>Máximo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section: Idioma del lector (Sincronizado Globalmente) */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <GlobeIcon width={20} height={20} className="text-[#2563eb]" />
          <h2>Idioma de la plataforma y del lector (Sincronizado)</h2>
        </div>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Al cambiar el idioma aquí, se traducirán automáticamente los Módulos, la Navegación y el Lector Inteligente.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = settings.readerLanguage === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => {
                  updateSetting("readerLanguage", lang.id);
                  speakText(`Idioma cambiado a ${lang.label}`);
                }}
                className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#2563eb] bg-blue-50/50 dark:bg-blue-950/30 text-[#2563eb] dark:text-blue-400 font-bold ring-2 ring-blue-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                }`}
              >
                <span className="flex items-center gap-3 text-xs font-semibold">
                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-500">
                    {lang.flag}
                  </span>
                  <span>{lang.label}</span>
                </span>
                {isSelected && <CheckIcon width={18} height={18} className="text-[#2563eb] dark:text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Color del acento */}
      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
        <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
          <SparklesIcon width={20} height={20} className="text-[#2563eb]" />
          <h2>Color del acento</h2>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {ACCENT_COLOR_OPTIONS.map((opt) => {
            const isSelected = settings.accentColor === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  updateSetting("accentColor", opt.id);
                  speakText(`Color de acento cambiado a ${opt.label}`);
                }}
                className={`flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? `${opt.borderClass} bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white ring-2 ring-blue-500/20 font-bold shadow-xs`
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${opt.colorClass}`} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-10 flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className={`rounded-xl px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${primaryBtnBg}`}
        >
          Guardar cambios
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-3 focus-visible:ring-slate-400"
        >
          Restablecer
        </button>
      </div>

      {/* Floating Voice Commands Listener */}
      {settings.voiceCommands && <VoiceCommandButton />}
    </div>
  );
}
