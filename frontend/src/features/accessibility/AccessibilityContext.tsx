"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getTranslation } from "@/lib/i18n";
import { fetchWithAuth } from "@/lib/api";

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  darkMode: boolean;
  largeText: boolean;
  voiceCommands: boolean;
  keyboardNav: boolean;
  readingSpeed: number;
  volume: number;
  readerLanguage: string;
  accentColor: "blue" | "green" | "purple" | "orange";
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  screenReader: true,
  highContrast: false,
  darkMode: false,
  largeText: false,
  voiceCommands: true,
  keyboardNav: true,
  readingSpeed: 1.2,
  volume: 80,
  readerLanguage: "es-ES",
  accentColor: "blue",
};

const STORAGE_KEY = "openblind_accessibility_settings";
const TOKEN_KEY = "openblind_token";

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  saveSettings: () => void;
  resetSettings: () => void;
  speakText: (text: string, force?: boolean) => void;
  t: (key: string) => string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [announcement, setAnnouncement] = useState("");
  const router = useRouter();

  // Load saved settings from localStorage and Backend on initial client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Could not load accessibility settings from localStorage", e);
    }

    const loadBackendSettings = async () => {
      if (typeof window === "undefined") return;

      // Modo invitado: sin token no hay sesión, no se consulta el backend
      const hasToken =
        localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
      if (!hasToken) return;

      try {
        const res = await fetchWithAuth("/api/accessibility");
        if (res.ok) {
          const json = await res.json();
          if (json?.status === "Success" && json.data) {
            const db = json.data;
            const accentMap: Record<string, "blue" | "green" | "purple" | "orange"> = {
              azul: "blue",
              blue: "blue",
              verde: "green",
              green: "green",
              violeta: "purple",
              purple: "purple",
              naranja: "orange",
              orange: "orange",
            };

            setSettings((prev) => ({
              ...prev,
              screenReader: db.lector_pantalla ?? prev.screenReader,
              highContrast: db.alto_contraste ?? prev.highContrast,
              darkMode: db.modo_oscuro ?? prev.darkMode,
              largeText: db.texto_grande ?? prev.largeText,
              voiceCommands: db.comandos_voz ?? prev.voiceCommands,
              keyboardNav: db.navegacion_teclado ?? prev.keyboardNav,
              readingSpeed: typeof db.velocidad_lectura === "number" ? db.velocidad_lectura : parseFloat(db.velocidad_lectura) || prev.readingSpeed,
              volume: typeof db.volumen === "number" ? db.volumen : parseInt(db.volumen, 10) || prev.volume,
              readerLanguage: db.idioma === "es" ? "es-ES" : db.idioma || prev.readerLanguage,
              accentColor: accentMap[db.color_acento] || prev.accentColor,
            }));
          }
        }
      } catch (e) {
        console.warn("Could not load settings from backend API", e);
      }
    };

    loadBackendSettings();
  }, []);

  // Apply DOM classes and attributes whenever settings change
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    const body = document.body;

    // Dark Mode
    if (settings.darkMode) {
      root.classList.add("dark");
      body?.classList.add("dark");
    } else {
      root.classList.remove("dark");
      body?.classList.remove("dark");
    }

    // High Contrast Mode
    if (settings.highContrast) {
      root.classList.add("high-contrast");
      body?.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
      body?.classList.remove("high-contrast");
    }

    // Large Text Mode
    if (settings.largeText) {
      root.classList.add("large-text");
    } else {
      root.classList.remove("large-text");
    }

    // Keyboard Navigation Mode
    if (settings.keyboardNav) {
      root.classList.add("keyboard-nav");
    } else {
      root.classList.remove("keyboard-nav");
    }

    // Accent Color Data Attribute
    root.setAttribute("data-accent", settings.accentColor);
  }, [settings]);

  const t = useCallback(
    (key: string) => {
      return getTranslation(key, settings.readerLanguage);
    },
    [settings.readerLanguage]
  );

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {
          console.warn("Failed to persist setting", e);
        }

        return updated;
      });
    },
    []
  );

  const speakText = useCallback(
    (text: string, force: boolean = false) => {
      setAnnouncement(text);
      if (!settings.screenReader && !force) return;
      if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = settings.readerLanguage || "es-ES";
        utterance.rate = settings.readingSpeed || 1.0;
        utterance.volume = (settings.volume ?? 80) / 100;

        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          const langPrefix = (settings.readerLanguage || "es-ES").split("-")[0].toLowerCase();
          const matchingVoice = voices.find((v) => v.lang.toLowerCase().startsWith(langPrefix));
          if (matchingVoice) {
            utterance.voice = matchingVoice;
          }
        }

        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.warn("Speech synthesis error", e);
      }
    },
    [settings.screenReader, settings.readerLanguage, settings.readingSpeed, settings.volume]
  );

  // Global Keyboard Shortcuts (Alt + 1..6, Alt + H, Alt + R, Alt + C)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Require Alt key pressed without Ctrl/Meta
      if (!e.altKey || e.ctrlKey || e.metaKey) return;

      const key = e.key ? e.key.toLowerCase() : "";
      const code = e.code || "";

      // Alt + 1: Mis módulos
      if (key === "1" || code === "Digit1" || code === "Numpad1") {
        e.preventDefault();
        speakText("Navegando a Mis Módulos");
        router.push("/dashboard/modulos");
      }
      // Alt + 2: Lector inteligente
      else if (key === "2" || code === "Digit2" || code === "Numpad2") {
        e.preventDefault();
        speakText("Navegando al Lector Inteligente");
        router.push("/dashboard/lector");
      }
      // Alt + 3: Historial
      else if (key === "3" || code === "Digit3" || code === "Numpad3") {
        e.preventDefault();
        speakText("Navegando al Historial");
        router.push("/dashboard/historial");
      }
      // Alt + 4: Accesibilidad
      else if (key === "4" || code === "Digit4" || code === "Numpad4") {
        e.preventDefault();
        speakText("Navegando a la pantalla de Accesibilidad");
        router.push("/dashboard/accesibilidad");
      }
      // Alt + 5: Centro de Ayuda
      else if (key === "5" || code === "Digit5" || code === "Numpad5") {
        e.preventDefault();
        speakText("Navegando al Centro de Ayuda");
        router.push("/dashboard/ayuda");
      }
      // Alt + 6: Mi Perfil
      else if (key === "6" || code === "Digit6" || code === "Numpad6") {
        e.preventDefault();
        speakText("Navegando a Mi Perfil");
        router.push("/dashboard/perfil");
      }
      // Alt + H or Alt + 0: Inicio / Dashboard
      else if (key === "h" || key === "0" || code === "KeyH" || code === "Digit0") {
        e.preventDefault();
        speakText("Navegando al Inicio");
        router.push("/dashboard");
      }
      // Alt + R: Conmutar Lector de Pantalla
      else if (key === "r" || code === "KeyR") {
        e.preventDefault();
        setSettings((prev) => {
          const next = !prev.screenReader;
          const text = next ? "Lector de pantalla activado" : "Lector de pantalla desactivado";
          setAnnouncement(text);
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = prev.readerLanguage || "es-ES";
            window.speechSynthesis.speak(utterance);
          }
          return { ...prev, screenReader: next };
        });
      }
      // Alt + C: Conmutar Alto Contraste
      else if (key === "c" || code === "KeyC") {
        e.preventDefault();
        setSettings((prev) => {
          const next = !prev.highContrast;
          const text = next ? "Alto contraste activado" : "Alto contraste desactivado";
          setAnnouncement(text);
          if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = prev.readerLanguage || "es-ES";
            window.speechSynthesis.speak(utterance);
          }
          return { ...prev, highContrast: next };
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, speakText]);

  const saveSettings = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      speakText("Configuración de accesibilidad guardada correctamente.");
    } catch (e) {
      console.warn("Failed to save settings", e);
    }
  }, [settings, speakText]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ACCESSIBILITY_SETTINGS));
      speakText("Configuración restablecida a los valores predeterminados.");
    } catch (e) {
      console.warn("Failed to reset settings", e);
    }
  }, [speakText]);

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        saveSettings,
        resetSettings,
        speakText,
        t,
      }}
    >
      <div aria-live="assertive" aria-atomic="true" className="sr-only">
        {announcement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}