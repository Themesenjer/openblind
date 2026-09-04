"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import { useGuestSession } from "@/features/auth/GuestSessionContext";
import { spatialAudio } from "@/lib/spatialAudio";
import { haptics } from "@/lib/haptics";
import {
  SparklesIcon,
  ShieldCheckIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  XIcon,
  TargetIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from "@/components/ui/icons";
import { getApiBase } from "@/lib/api";

export type DirectionType = "adelante" | "izquierda" | "derecha" | "llegada" | "subir" | "bajar";

export interface StepDetail {
  stepNumber: number;
  direction: DirectionType;
  stepsCount: number;
  title: string;
  spokenText: string;
}

export interface BeaconRoute {
  id: string;
  name: string;
  distanceMeter: number;
  frequency: number;
  steps: StepDetail[];
  isCustom?: boolean;
  city?: string;
}

interface MetricsSummary {
  totalMobilitySessions: number;
  activeVoiceUsersCount: number;
  visuallyImpairedUsersEstimated: number;
  screenReaderAdoptionRate: string;
  voiceCommandUsageRate: string;
}

const QUITO_PRESET_TEMPLATES = [
  {
    name: "Estación Metro San Francisco ➔ Plaza Grande (Quito Centro)",
    stepTitle: "Paso 1: Salida de Estación San Francisco por Calle Sucre",
    direction: "adelante" as DirectionType,
    count: 6,
    spoken: "Paso 1 de 5. Sal de la estación San Francisco del Metro por la escalinata accesible hacia la Calle Sucre."
  },
  {
    name: "Parque La Carolina ➔ Jardín Botánico de Quito",
    stepTitle: "Paso 1: Salida de Metro Estación Iñaquito",
    direction: "adelante" as DirectionType,
    count: 6,
    spoken: "Paso 1 de 5. Sal del Metro Iñaquito y camina 6 pasos rectos por la caminera del parque hacia el Jardín Botánico."
  },
  {
    name: "Terminal Terrestre Quitumbe (Sur) ➔ Estación del Metro Quitumbe",
    stepTitle: "Paso 1: Pasillo Central del Terminal Quitumbe",
    direction: "adelante" as DirectionType,
    count: 8,
    spoken: "Paso 1 de 5. Avanza 8 pasos rectos por el pasillo principal del terminal Quitumbe con guía podotáctil."
  },
  {
    name: "Instituto Yavirac ➔ Mirador de la Virgen del Panecillo",
    stepTitle: "Paso 1: Salida del Campus Yavirac hacia el sendero",
    direction: "adelante" as DirectionType,
    count: 5,
    spoken: "Paso 1 de 5. Sal del Instituto Yavirac y da 5 pasos rectos por la acera con franja podotáctil."
  },
  {
    name: "Basílica del Voto Nacional ➔ Plaza de la Independencia",
    stepTitle: "Paso 1: Descenso por Calle Venezuela",
    direction: "bajar" as DirectionType,
    count: 7,
    spoken: "Paso 1 de 5. Bajada suave por la Calle Venezuela. Avanza 7 pasos manteniendo tu mano en la baranda de guía."
  },
  {
    name: "Plaza Foch (La Mariscal) ➔ Mercado de Artesanías La Mariscal",
    stepTitle: "Paso 1: Cruce de la Calle Reina Victoria",
    direction: "derecha" as DirectionType,
    count: 4,
    spoken: "Paso 1 de 4. Gira 90 grados a la derecha en la Calle Reina Victoria. Semáforo sonoro activo."
  }
];

const DEFAULT_ROUTES: BeaconRoute[] = [
  {
    id: "BCN-UIO-01",
    name: "📍 Quito: Metro San Francisco ➔ Plaza Grande (Centro Histórico)",
    city: "Quito",
    distanceMeter: 1.4,
    frequency: 650,
    steps: [
      {
        stepNumber: 1,
        direction: "adelante",
        stepsCount: 6,
        title: "Paso 1: Salida de Estación San Francisco por Calle Sucre",
        spokenText: "Paso 1 de 5. Sal de la estación San Francisco del Metro por la escalinata accesible hacia la Calle Sucre."
      },
      {
        stepNumber: 2,
        direction: "adelante",
        stepsCount: 5,
        title: "Paso 2: Acera de piedra de la Calle Sucre",
        spokenText: "Paso 2 de 5. Avanza 5 pasos rectos por la vereda adoquinada del Centro Histórico de Quito."
      },
      {
        stepNumber: 3,
        direction: "izquierda",
        stepsCount: 4,
        title: "Paso 3: Giro a la izquierda hacia Calle García Moreno",
        spokenText: "Paso 3 de 5. Gira 90 grados a la izquierda en la esquina de la Calle García Moreno y avanza 4 pasos."
      },
      {
        stepNumber: 4,
        direction: "adelante",
        stepsCount: 5,
        title: "Paso 4: Banda podotáctil de la Plaza Grande",
        spokenText: "Paso 4 de 5. Franja podotáctil detectada. Avanza 5 pasos al frente hacia la Plaza de la Independencia."
      },
      {
        stepNumber: 5,
        direction: "llegada",
        stepsCount: 2,
        title: "Paso 5: Llegada a la Fuente de la Plaza Grande",
        spokenText: "Paso 5 de 5. ¡Llegaste a la Plaza Grande de Quito! El Palacio de Carondelet está a tu izquierda."
      }
    ]
  },
  {
    id: "BCN-UIO-02",
    name: "📍 Quito: Parque La Carolina ➔ Jardín Botánico de Quito",
    city: "Quito",
    distanceMeter: 1.2,
    frequency: 800,
    steps: [
      {
        stepNumber: 1,
        direction: "adelante",
        stepsCount: 6,
        title: "Paso 1: Salida de Metro Estación Iñaquito",
        spokenText: "Paso 1 de 5. Desde la salida del Metro Iñaquito, camina 6 pasos rectos por la caminera del Parque La Carolina."
      },
      {
        stepNumber: 2,
        direction: "adelante",
        stepsCount: 5,
        title: "Paso 2: Pasaje peatonal de la Av. Shyris",
        spokenText: "Paso 2 de 5. Continúa 5 pasos al frente rozando los bolardos de protección peatonal."
      },
      {
        stepNumber: 3,
        direction: "derecha",
        stepsCount: 4,
        title: "Paso 3: Giro a la derecha bordeando la laguna",
        spokenText: "Paso 3 de 5. Gira 90 grados a la derecha bordeando la laguna del parque."
      },
      {
        stepNumber: 4,
        direction: "subir",
        stepsCount: 3,
        title: "Paso 4: Puente de madera accesible",
        spokenText: "Paso 4 de 5. Subida suave de 3 pasos por el puente de madera con pasamanos doble."
      },
      {
        stepNumber: 5,
        direction: "llegada",
        stepsCount: 2,
        title: "Paso 5: Entrada al Jardín Botánico",
        spokenText: "Paso 5 de 5. ¡Llegaste a la recepción del Jardín Botánico de Quito! El orquideario está al frente."
      }
    ]
  },
  {
    id: "BCN-UIO-03",
    name: "📍 Quito: Terminal Terrestre Quitumbe ➔ Estación del Metro",
    city: "Quito",
    distanceMeter: 1.8,
    frequency: 550,
    steps: [
      {
        stepNumber: 1,
        direction: "adelante",
        stepsCount: 8,
        title: "Paso 1: Pasillo Central de Quitumbe",
        spokenText: "Paso 1 de 5. Da 8 pasos al frente por el pasillo principal del terminal Quitumbe con guía podotáctil."
      },
      {
        stepNumber: 2,
        direction: "bajar",
        stepsCount: 5,
        title: "Paso 2: Rampa accesible descendente",
        spokenText: "Paso 2 de 5. Rampa de bajada suave con pasamanos. Avanza 5 pasos hacia el conector del Metro."
      },
      {
        stepNumber: 3,
        direction: "adelante",
        stepsCount: 4,
        title: "Paso 3: Torniquetes con señal auditiva",
        spokenText: "Paso 3 de 5. Avanza 4 pasos directo a los torniquetes del Metro con bips de validación."
      },
      {
        stepNumber: 4,
        direction: "adelante",
        stepsCount: 3,
        title: "Paso 4: Ascensor parlante al andén",
        spokenText: "Paso 4 de 5. Entra al ascensor parlante y presiona el botón marcado en Braille para el Andén Nivel -1."
      },
      {
        stepNumber: 5,
        direction: "llegada",
        stepsCount: 2,
        title: "Paso 5: Andén de Trenes Quitumbe",
        spokenText: "Paso 5 de 5. ¡Has llegado al andén del Metro de Quito! El tren con destino a El Labrador se detendrá al frente."
      }
    ]
  },
  {
    id: "BCN-UIO-04",
    name: "📍 Quito: Instituto Yavirac ➔ Mirador del Panecillo",
    city: "Quito",
    distanceMeter: 1.0,
    frequency: 720,
    steps: [
      {
        stepNumber: 1,
        direction: "adelante",
        stepsCount: 5,
        title: "Paso 1: Salida del Campus Yavirac",
        spokenText: "Paso 1 de 5. Da 5 pasos hacia adelante por el pasillo de salida del Instituto Yavirac."
      },
      {
        stepNumber: 2,
        direction: "adelante",
        stepsCount: 6,
        title: "Paso 2: Sendero del Panecillo",
        spokenText: "Paso 2 de 5. Continúa 6 pasos al frente bordeando la guía podotáctil de la acera."
      },
      {
        stepNumber: 3,
        direction: "subir",
        stepsCount: 5,
        title: "Paso 3: Subida rampa del mirador",
        spokenText: "Paso 3 de 5. Rampa inclinada con pasamanos metálico. Avanza 5 pasos sosteniéndote de la baranda."
      },
      {
        stepNumber: 4,
        direction: "derecha",
        stepsCount: 3,
        title: "Paso 4: Giro a la derecha hacia la explanada",
        spokenText: "Paso 4 de 5. Gira 90 grados a tu derecha hacia la explanada principal."
      },
      {
        stepNumber: 5,
        direction: "llegada",
        stepsCount: 2,
        title: "Paso 5: Base de la Virgen del Panecillo",
        spokenText: "Paso 5 de 5. ¡Llegaste al Mirador del Panecillo! La Virgen de Quito está justo sobre ti."
      }
    ]
  },
  {
    id: "BCN-YAV-01",
    name: "🏫 Yavirac: Entrada Principal ➔ Recepción Central",
    city: "Quito",
    distanceMeter: 1.2,
    frequency: 600,
    steps: [
      {
        stepNumber: 1,
        direction: "adelante",
        stepsCount: 5,
        title: "Paso 1: Avanzar por pasillo principal",
        spokenText: "Paso 1 de 5. Da 5 pasos hacia adelante en línea recta por el pasillo de la entrada."
      },
      {
        stepNumber: 2,
        direction: "adelante",
        stepsCount: 3,
        title: "Paso 2: Banda podotáctil de aviso",
        spokenText: "Paso 2 de 5. Piso con franjas táctiles de aviso detectado. Continúa 3 pasos manteniendo tu guía."
      },
      {
        stepNumber: 3,
        direction: "izquierda",
        stepsCount: 3,
        title: "Paso 3: Giro a la izquierda",
        spokenText: "Paso 3 de 5. Gira 90 grados a tu izquierda. Avanza 3 pasos rozando la pared guía."
      },
      {
        stepNumber: 4,
        direction: "adelante",
        stepsCount: 4,
        title: "Paso 4: Tramo recto hacia mostrador",
        spokenText: "Paso 4 de 5. Avanza 4 pasos rectos. El área está libre de obstáculos."
      },
      {
        stepNumber: 5,
        direction: "llegada",
        stepsCount: 2,
        title: "Paso 5: Llegada a Recepción",
        spokenText: "Paso 5 de 5. ¡Has llegado a la Recepción Central! El mostrador de atención está frente a ti a 1 metro."
      }
    ]
  },
  {
    id: "BCN-YAV-02",
    name: "🏫 Yavirac: Recepción ➔ Biblioteca y Centro de Lectura",
    city: "Quito",
    distanceMeter: 0.8,
    frequency: 850,
    steps: [
      {
        stepNumber: 1,
        direction: "derecha",
        stepsCount: 4,
        title: "Paso 1: Giro a la derecha",
        spokenText: "Paso 1 de 5. Desde la recepción, gira 90 grados a la derecha y camina 4 pasos."
      },
      {
        stepNumber: 2,
        direction: "adelante",
        stepsCount: 6,
        title: "Paso 2: Pasillo A hacia Biblioteca",
        spokenText: "Paso 2 de 5. Continúa 6 pasos al frente. Precaución: Puerta batiente a tu derecha."
      },
      {
        stepNumber: 3,
        direction: "adelante",
        stepsCount: 3,
        title: "Paso 3: Zona alfombrada de lectura",
        spokenText: "Paso 3 de 5. Camina 3 pasos rectos sobre la alfombra guía acústica."
      },
      {
        stepNumber: 4,
        direction: "izquierda",
        stepsCount: 2,
        title: "Paso 4: Giro suave a la izquierda",
        spokenText: "Paso 4 de 5. Da un giro suave a la izquierda y camina 2 pasos hacia la puerta principal."
      },
      {
        stepNumber: 5,
        direction: "llegada",
        stepsCount: 2,
        title: "Paso 5: Entrada a Biblioteca",
        spokenText: "Paso 5 de 5. ¡Llegaste a la entrada de la Biblioteca! Toca la manija a la altura de tu cintura."
      }
    ]
  }
];

const STORAGE_ROUTES_KEY = "openblind_mobility_custom_routes";

export default function MobilitySingleScreen() {
  const { speakText, updateSetting } = useAccessibility();
  const { isGuest } = useGuestSession();

  const [routes, setRoutes] = useState<BeaconRoute[]>(DEFAULT_ROUTES);
  const [activeRouteIndex, setActiveRouteIndex] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isSonarActive, setIsSonarActive] = useState<boolean>(false);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [contrastTheme, setContrastTheme] = useState<"default" | "yellow-black" | "white-black">("default");
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
const [isVoiceSelecting, setIsVoiceSelecting] = useState<boolean>(false);
const routeSelectionRecognitionRef = useRef<any>(null);

  // Modals & Panels state
  const [isAddStepOpen, setIsAddStepOpen] = useState<boolean>(false);
  const [isCreateRouteOpen, setIsCreateRouteOpen] = useState<boolean>(false);
  const [isStepsPanelOpen, setIsStepsPanelOpen] = useState<boolean>(false);

  // Add Step Form state
  const [newStepTitle, setNewStepTitle] = useState<string>("");
  const [newStepDirection, setNewStepDirection] = useState<DirectionType>("adelante");
  const [newStepCount, setNewStepCount] = useState<number>(3);
  const [newStepSpokenText, setNewStepSpokenText] = useState<string>("");
  const [insertPosition, setInsertPosition] = useState<"end" | "after_current">("end");

  // Create Route Form state
  const [newRouteName, setNewRouteName] = useState<string>("");
  const [initialStepTitle, setInitialStepTitle] = useState<string>("");
  const [initialStepDirection, setInitialStepDirection] = useState<DirectionType>("adelante");
  const [initialStepCount, setInitialStepCount] = useState<number>(4);
  const [initialStepSpokenText, setInitialStepSpokenText] = useState<string>("");

  const activeRoute = routes[activeRouteIndex] || routes[0];
  const activeStep = activeRoute.steps[currentStepIndex] || activeRoute.steps[0];

  const sonarIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load custom routes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ROUTES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRoutes(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load custom routes from localStorage", e);
    }
  }, []);

  // Save routes to localStorage whenever they change
  const saveRoutesToStorage = (updatedRoutes: BeaconRoute[]) => {
    setRoutes(updatedRoutes);
    try {
      localStorage.setItem(STORAGE_ROUTES_KEY, JSON.stringify(updatedRoutes));
    } catch (e) {
      console.warn("Could not save routes to localStorage", e);
    }
  };

  // Fetch metrics from backend
  const fetchMetrics = useCallback(async () => {
    try {
     const res = await fetch(`${getApiBase()}/api/metrics/summary`);
      if (res.ok) {
        const json = await res.json();
        if (json?.status === "Success" && json.data) {
          setMetrics(json.data);
        }
      }
    } catch (e) {
      console.warn("Could not fetch metrics summary", e);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Spatial Audio Sonar loop
  useEffect(() => {
    if (isSonarActive && isNavigating) {
      const intervalMs = Math.max(250, Math.floor((activeRoute?.distanceMeter || 1) * 600));
      sonarIntervalRef.current = setInterval(() => {
        spatialAudio.playBeaconSonarPing(activeRoute?.frequency || 600, 0.12);
      }, intervalMs);
    } else {
      if (sonarIntervalRef.current) clearInterval(sonarIntervalRef.current);
    }

    return () => {
      if (sonarIntervalRef.current) clearInterval(sonarIntervalRef.current);
    };
  }, [isSonarActive, isNavigating, activeRoute]);

  // Speak current step out loud
  const speakCurrentStep = useCallback(
    (step: StepDetail) => {
      haptics.shortPulse();
      speakText(step.spokenText, true);
    },
    [speakText]
  );

  const handleToggleNavigation = () => {
    const nextState = !isNavigating;
    setIsNavigating(nextState);
    if (nextState) {
      haptics.beaconReached();
      const introText = `Navegación asistida iniciada. Ruta: ${activeRoute.name}. Escucha las instrucciones paso a paso. ${activeStep.spokenText}`;
      speakText(introText, true);
    } else {
      haptics.shortPulse();
      setIsSonarActive(false);
      speakText("Navegación de movilidad pausada.", true);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeRoute.steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      const nextStep = activeRoute.steps[nextIndex];
      speakCurrentStep(nextStep);
    } else {
      speakText("Has completado todos los pasos de esta ruta. ¡Destino alcanzado!", true);
      haptics.beaconReached();
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      const prevStep = activeRoute.steps[prevIndex];
      speakCurrentStep(prevStep);
    } else {
      speakText("Estás en el primer paso de la ruta.", true);
    }
  };

  const handleRepeatStep = () => {
    speakCurrentStep(activeStep);
  };

  const handleSwitchRoute = () => {
    const nextRouteIdx = (activeRouteIndex + 1) % routes.length;
    setActiveRouteIndex(nextRouteIdx);
    setCurrentStepIndex(0);
    const newRoute = routes[nextRouteIdx];
    haptics.beaconReached();
    spatialAudio.playBeaconSonarPing(newRoute.frequency || 600, 0.25);
    speakText(`Nueva ruta cargada: ${newRoute.name}. ${newRoute.steps[0].spokenText}`, true);
  };
  const parseSpokenRouteNumber = (text: string): number | null => {
  const normalized = text.toLowerCase().trim();
  const wordMap: Record<string, number> = {
    uno: 1, una: 1, primero: 1, primera: 1,
    dos: 2, segundo: 2, segunda: 2,
    tres: 3, tercero: 3, tercera: 3,
    cuatro: 4, cuarto: 4, cuarta: 4,
    cinco: 5, quinto: 5, quinta: 5,
    seis: 6, sexto: 6, sexta: 6,
  };
  for (const word in wordMap) {
    if (normalized.includes(word)) return wordMap[word];
  }
  const digitMatch = normalized.match(/[1-6]/);
  if (digitMatch) return parseInt(digitMatch[0], 10);
  return null;
};

const startVoiceNavigation = useCallback(() => {
  if (typeof window === "undefined") return;

  const windowObj = window as unknown as Record<string, unknown>;
  const SpeechRecognitionCtor = (windowObj.SpeechRecognition || windowObj.webkitSpeechRecognition) as
    | (new () => any)
    | undefined;

  if (!SpeechRecognitionCtor) {
    speakText("Tu navegador no soporta reconocimiento de voz. Usa los botones en pantalla.", true);
    return;
  }

  const routesList = routes
    .map((r, idx) => `Opción ${idx + 1}: ${r.name}.`)
    .join(" ");

  const fullPrompt = `Estas son tus rutas disponibles. ${routesList} Di el número de la ruta que deseas, del 1 al ${routes.length}.`;

  setIsVoiceSelecting(true);

  // Un solo utterance, sin pasar por speakText, para evitar que dos speak() choquen
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(fullPrompt);
  utterance.lang = "es-ES";
  utterance.rate = 1.0;

  utterance.onend = () => {
    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "es-ES";

    recognition.onresult = (event: any) => {
      const spoken = event.results[0][0].transcript;
      const chosenNumber = parseSpokenRouteNumber(spoken);

      if (chosenNumber && chosenNumber >= 1 && chosenNumber <= routes.length) {
        const chosenIndex = chosenNumber - 1;
        const chosenRoute = routes[chosenIndex];
        setActiveRouteIndex(chosenIndex);
        setCurrentStepIndex(0);
        setIsNavigating(true);
        haptics.beaconReached();
        speakText(
          `Ruta ${chosenNumber} seleccionada: ${chosenRoute.name}. Iniciando navegación. ${chosenRoute.steps[0].spokenText}`,
          true
        );
      } else {
        speakText(`No entendí "${spoken}". Por favor di un número del 1 al ${routes.length}. Intenta de nuevo.`, true);
      }
      setIsVoiceSelecting(false);
    };

    recognition.onerror = (event: any) => {
      console.warn("Error de reconocimiento:", event.error);
      speakText("No se detectó tu voz. Intenta de nuevo presionando el botón.", true);
      setIsVoiceSelecting(false);
    };

    recognition.onend = () => setIsVoiceSelecting(false);

    routeSelectionRecognitionRef.current = recognition;
    try {
      recognition.start();
    } catch (e) {
      console.warn("No se pudo iniciar reconocimiento", e);
      setIsVoiceSelecting(false);
    }
  };

  utterance.onerror = (e) => {
    console.warn("Error de síntesis de voz", e);
    setIsVoiceSelecting(false);
  };

  window.speechSynthesis.speak(utterance);
}, [routes, speakText]);

  const triggerEmergencySOS = useCallback(() => {
    setEmergencyActive(true);
    haptics.emergencyAlert();
    spatialAudio.playEmergencySiren();
    const sosText = `ALERTA DE EMERGENCIA SOS. Ubicación actual: ${activeRoute.name}, ${activeStep.title}. Solicitando auxilio de inmediato.`;
    speakText(sosText, true);
  }, [activeRoute.name, activeStep.title, speakText]);

  // Global Keyboard shortcuts: Alt + N, Alt + B, Alt + A, Alt + D, Alt + E
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.altKey || e.ctrlKey || e.metaKey) return;
      const key = e.key ? e.key.toLowerCase() : "";

      if (key === "n") {
        e.preventDefault();
        handleNextStep();
      } else if (key === "b") {
        e.preventDefault();
        handlePrevStep();
      } else if (key === "e") {
        e.preventDefault();
        triggerEmergencySOS();
      } else if (key === "a") {
        e.preventDefault();
        setIsAddStepOpen(true);
        speakText("Formulario para agregar nuevo paso abierto.");
      } else if (key === "d") {
        e.preventDefault();
        setIsCreateRouteOpen(true);
        speakText("Formulario para crear nuevo destino abierto.");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, activeRouteIndex, triggerEmergencySOS, speakText]);

  // Add Step submit handler
  const handleAddStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) {
      speakText("Por favor escribe un título para el nuevo paso.");
      return;
    }

    const finalSpoken =
      newStepSpokenText.trim() ||
      `${newStepTitle}. Da ${newStepCount} pasos hacia ${newStepDirection}.`;

    const updatedRoutes = [...routes];
    const currentRouteObj = { ...updatedRoutes[activeRouteIndex] };
    const currentSteps = [...currentRouteObj.steps];

    const targetPos = insertPosition === "end" ? currentSteps.length : currentStepIndex + 1;

    const newStepObj: StepDetail = {
      stepNumber: targetPos + 1,
      direction: newStepDirection,
      stepsCount: Number(newStepCount) || 3,
      title: newStepTitle.trim(),
      spokenText: finalSpoken
    };

    // Insert step
    currentSteps.splice(targetPos, 0, newStepObj);

    // Re-number stepNumber for all steps in route
    const renumberedSteps = currentSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
      spokenText: s.spokenText.replace(/^Paso \d+ de \d+/, `Paso ${idx + 1} de ${currentSteps.length}`)
    }));

    currentRouteObj.steps = renumberedSteps;
    currentRouteObj.isCustom = true;
    updatedRoutes[activeRouteIndex] = currentRouteObj;

    saveRoutesToStorage(updatedRoutes);
    setCurrentStepIndex(targetPos);
    setIsAddStepOpen(false);

    // Reset form
    setNewStepTitle("");
    setNewStepSpokenText("");
    setNewStepCount(3);

    haptics.beaconReached();
    speakText(`Nuevo paso agregado a la ruta ${currentRouteObj.name}. ${newStepObj.title}. ${newStepObj.spokenText}`, true);
  };

  // Create Route submit handler
  const handleCreateRouteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRouteName.trim()) {
      speakText("Ingresa el nombre del nuevo destino.");
      return;
    }

    const stepTitle = initialStepTitle.trim() || "Paso 1: Iniciar recorrido";
    const stepSpoken =
      initialStepSpokenText.trim() ||
      `Paso 1 de 1. Inicia tu caminata de ${initialStepCount} pasos en dirección ${initialStepDirection} hacia ${newRouteName}.`;

    const newRoute: BeaconRoute = {
      id: `BCN-CUSTOM-${Date.now()}`,
      name: newRouteName.trim(),
      city: "Quito",
      distanceMeter: (initialStepCount * 0.7) / 10 + 0.5,
      frequency: 750,
      isCustom: true,
      steps: [
        {
          stepNumber: 1,
          direction: initialStepDirection,
          stepsCount: Number(initialStepCount) || 4,
          title: stepTitle,
          spokenText: stepSpoken
        }
      ]
    };

    const updatedRoutes = [...routes, newRoute];
    saveRoutesToStorage(updatedRoutes);
    setActiveRouteIndex(updatedRoutes.length - 1);
    setCurrentStepIndex(0);
    setIsCreateRouteOpen(false);

    // Reset form
    setNewRouteName("");
    setInitialStepTitle("");
    setInitialStepSpokenText("");

    haptics.beaconReached();
    speakText(`Nueva ruta creada con éxito: ${newRoute.name}. Puedes agregar más pasos cuando lo desees. ${newRoute.steps[0].spokenText}`, true);
  };

  // Apply preset Quito template to CreateRouteModal form
  const applyQuitoTemplate = (tpl: typeof QUITO_PRESET_TEMPLATES[0]) => {
    setNewRouteName(tpl.name);
    setInitialStepTitle(tpl.stepTitle);
    setInitialStepDirection(tpl.direction);
    setInitialStepCount(tpl.count);
    setInitialStepSpokenText(tpl.spoken);
    speakText(`Plantilla de Quito seleccionada: ${tpl.name}. Puedes ajustar sus datos o hacer clic en Crear Destino.`);
  };

  // Delete Step handler
  const handleDeleteStep = (stepIdx: number) => {
    if (activeRoute.steps.length <= 1) {
      speakText("No puedes eliminar el único paso de una ruta. En su lugar, puedes agregar más pasos.");
      return;
    }

    const updatedRoutes = [...routes];
    const currentRouteObj = { ...updatedRoutes[activeRouteIndex] };
    const currentSteps = [...currentRouteObj.steps];

    currentSteps.splice(stepIdx, 1);

    const renumberedSteps = currentSteps.map((s, idx) => ({
      ...s,
      stepNumber: idx + 1,
      spokenText: s.spokenText.replace(/^Paso \d+ de \d+/, `Paso ${idx + 1} de ${currentSteps.length}`)
    }));

    currentRouteObj.steps = renumberedSteps;
    updatedRoutes[activeRouteIndex] = currentRouteObj;

    saveRoutesToStorage(updatedRoutes);
    const nextIdx = Math.min(currentStepIndex, renumberedSteps.length - 1);
    setCurrentStepIndex(nextIdx);

    speakText(`Paso eliminado. Ahora la ruta tiene ${renumberedSteps.length} pasos.`, true);
  };

  // Reset to default routes
  const handleResetDefaults = () => {
    setRoutes(DEFAULT_ROUTES);
    setActiveRouteIndex(0);
    setCurrentStepIndex(0);
    try {
      localStorage.removeItem(STORAGE_ROUTES_KEY);
    } catch (e) {
      console.warn("Failed to clear routes from localStorage", e);
    }
    speakText("Rutas de Quito y pasos restablecidos a la configuración inicial por defecto.", true);
  };

  const applyContrastTheme = (theme: "default" | "yellow-black" | "white-black") => {
    setContrastTheme(theme);
    if (theme === "yellow-black") {
      updateSetting("highContrast", true);
      speakText("Tema Amarillo sobre Negro activado.");
    } else if (theme === "white-black") {
      updateSetting("highContrast", true);
      speakText("Tema Blanco sobre Negro activado.");
    } else {
      updateSetting("highContrast", false);
      speakText("Tema estándar restaurado.");
    }
  };

  const themeContainerClass =
    contrastTheme === "yellow-black"
      ? "bg-black text-yellow-300 border-yellow-400 font-bold"
      : contrastTheme === "white-black"
      ? "bg-black text-white border-white font-bold"
      : "bg-slate-900 text-white border-amber-400/80";

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto max-w-5xl space-y-6 focus:outline-none"
      aria-label="Pantalla Única con Instrucciones de Pasos Hablados y Ubicaciones de Quito"
    >
      {/* Emergency Alert */}
      {emergencyActive && (
        <section
          role="alert"
          className="rounded-3xl bg-rose-700 p-6 text-white shadow-2xl border-4 border-amber-300 flex items-center justify-between gap-4 animate-bounce"
        >
          <div className="flex items-center gap-3">
            <span className="text-4xl">🚨</span>
            <div>
              <h2 className="text-xl font-black uppercase">¡EMERGENCIA SOS ACTIVADA!</h2>
              <p className="text-sm font-semibold">Ubicación reportada: {activeRoute.name}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEmergencyActive(false);
              speakText("Alerta de emergencia desactivada.");
            }}
            className="rounded-2xl bg-white text-rose-900 px-5 py-3 text-xs font-black uppercase shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-300"
          >
            Desactivar SOS
          </button>
        </section>
      )}

      {/* Main Header & Global Navigation Controls */}
      <section
        aria-live="assertive"
        className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-2xl border-4 transition-colors ${themeContainerClass}`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3.5 py-1 text-xs font-black tracking-wider text-emerald-300 uppercase">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                Navegación Quito (Ecuador)
              </span>

              {isGuest && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 px-3.5 py-1 text-xs font-black text-amber-300">
                  <ShieldCheckIcon width={14} height={14} />
                  Modo Invitado (Sin Registro)
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Rutas Habladas de Quito y Destinos
            </h1>

            <p className="text-base text-slate-300 max-w-2xl font-medium">
              Navega paso a paso por puntos emblemáticos de Quito (Metro, Centro Histórico, La Carolina, Quitumbe, Yavirac) o crea tus propias ubicaciones.
            </p>
          </div>

                    <div className="flex flex-col gap-3 min-w-[220px]">
            <button
              onClick={handleToggleNavigation}
              aria-label={isNavigating ? "Pausar guía hablada paso a paso" : "Iniciar guía hablada paso a paso por voz"}
              className={`w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4 text-base font-extrabold transition-all shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 active:scale-95 ${
                isNavigating
                  ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              <SparklesIcon width={22} height={22} />
              {isNavigating ? "Pausar Guía" : "🔊 Iniciar Pasos por Voz"}
            </button>

            <button
              type="button"
              onClick={startVoiceNavigation}
              disabled={isVoiceSelecting}
              aria-label="Iniciar navegación por voz: escucha las rutas disponibles y elige una diciendo su número"
              className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-4 text-base font-extrabold text-white shadow-xl transition-all hover:scale-[1.02] focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 disabled:opacity-60"
            >
              {isVoiceSelecting ? "🎙️ Escuchando tu elección..." : "🎙️ Iniciar Navegación por Voz"}
            </button>

            {/* Quick Action Buttons for Custom Steps & Destinations */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsAddStepOpen(true);
                  speakText("Formulario para agregar nuevo paso abierto.");
                }}
                className="flex items-center justify-center gap-1.5 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/50 px-3 py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                title="Atajo Alt + A"
              >
                <PlusIcon width={16} height={16} />
                + Paso
              </button>

              <button
                onClick={() => {
                  setIsCreateRouteOpen(true);
                  speakText("Formulario para crear nuevo destino en Quito abierto.");
                }}
                className="flex items-center justify-center gap-1.5 text-xs font-bold bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/50 px-3 py-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                title="Atajo Alt + D"
              >
                <TargetIcon width={16} height={16} />
                + Destino Quito
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spoken Step-by-Step Interactive Card */}
      <section
        aria-label="Tarjetero de pasos detallados hablados para llegar a destino en Quito"
        className="rounded-3xl border-4 border-amber-400 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-xl space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
              Destino en Quito Seleccionado
            </span>
            <div className="flex items-center gap-3">
              <select
                value={activeRouteIndex}
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  setActiveRouteIndex(idx);
                  setCurrentStepIndex(0);
                  const selectedRoute = routes[idx];
                  speakText(`Cargando ruta de Quito: ${selectedRoute.name}. ${selectedRoute.steps[0].spokenText}`, true);
                }}
                aria-label="Seleccionar destino o ruta de navegación en Quito"
                className="rounded-2xl border-2 border-amber-400 bg-amber-50 dark:bg-slate-800 px-4 py-2 text-base font-extrabold text-slate-900 dark:text-amber-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
              >
                {routes.map((r, idx) => (
                  <option key={r.id} value={idx}>
                    {r.name} ({r.steps.length} pasos) {r.isCustom ? "★ Personalizada" : ""}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSwitchRoute}
                className="text-xs font-extrabold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Siguiente Ruta ➔
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-700 px-4 py-1.5 text-xs font-black text-amber-900 dark:text-amber-200">
              Paso {activeStep?.stepNumber || 1} de {activeRoute.steps.length}
            </span>

            <button
              onClick={() => {
                const nextState = !isStepsPanelOpen;
                setIsStepsPanelOpen(nextState);
                speakText(nextState ? "Lista completa de pasos abierta." : "Lista de pasos cerrada.");
              }}
              aria-expanded={isStepsPanelOpen}
              className="flex items-center gap-1 text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-200"
            >
              <span>Ver Todos los Pasos ({activeRoute.steps.length})</span>
              {isStepsPanelOpen ? <ChevronUpIcon width={16} height={16} /> : <ChevronDownIcon width={16} height={16} />}
            </button>
          </div>
        </div>

        {/* Big Spoken Instruction Box */}
        <div className="rounded-3xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-800/80 p-6 text-center space-y-3 shadow-inner">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-amber-400 text-slate-950 text-3xl font-black shadow-md">
            {activeStep?.direction === "adelante" && "⬆️"}
            {activeStep?.direction === "izquierda" && "⬅️"}
            {activeStep?.direction === "derecha" && "➡️"}
            {activeStep?.direction === "subir" && "↗️"}
            {activeStep?.direction === "bajar" && "↘️"}
            {activeStep?.direction === "llegada" && "🎯"}
          </div>

          <h3 className="text-2xl font-black text-slate-900 dark:text-amber-100">
            {activeStep?.title}
          </h3>

          <p className="text-lg font-bold text-slate-800 dark:text-amber-200 max-w-xl mx-auto leading-relaxed">
            "{activeStep?.spokenText}"
          </p>

          <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            Distancia estimada de este tramo: {activeStep?.stepsCount || 0} pasos ({((activeStep?.stepsCount || 0) * 0.7).toFixed(1)} metros)
          </p>
        </div>

        {/* Large Accessible Action Buttons for Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            aria-label="Escuchar paso anterior de la ruta"
            className="flex items-center justify-center gap-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 px-5 py-4 text-base font-extrabold text-slate-800 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          >
            ⏮️ Paso Anterior (Alt+B)
          </button>

          <button
            onClick={handleRepeatStep}
            aria-label="Repetir en voz alta la instrucción del paso actual"
            className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-4 text-base font-black shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          >
            🔊 Repetir Paso
          </button>

          <button
            onClick={handleNextStep}
            disabled={currentStepIndex === activeRoute.steps.length - 1}
            aria-label="Avanzar y escuchar el siguiente paso para llegar"
            className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-4 text-base font-extrabold shadow-lg disabled:opacity-40 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          >
            ⏭️ Siguiente Paso (Alt+N)
          </button>
        </div>

        {/* Dynamic Controls for Adding Steps & New Destination */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsAddStepOpen(true);
                speakText("Abriendo formulario para agregar un nuevo paso a la ruta activa.");
              }}
              className="flex items-center gap-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2.5 text-xs font-black shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
            >
              <PlusIcon width={16} height={16} />
              <span>➕ Agregar Paso a esta Ruta</span>
            </button>

            <button
              onClick={() => {
                setIsCreateRouteOpen(true);
                speakText("Abriendo formulario para crear una nueva ruta o destino en Quito.");
              }}
              className="flex items-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 text-xs font-black shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
            >
              <TargetIcon width={16} height={16} />
              <span>🎯 Crear Nuevo Destino (Quito)</span>
            </button>
          </div>

          <button
            onClick={handleResetDefaults}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            Restablecer rutas de Quito
          </button>
        </div>

        {/* Expandable Step Manager Panel */}
        {isStepsPanelOpen && (
          <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h4 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
                Lista Completa de Pasos para: {activeRoute.name}
              </h4>
              <span className="text-[11px] font-medium text-slate-500">
                Haz clic o pulsa Enter en un paso para navegar directamente a él
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {activeRoute.steps.map((st, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-xl p-3 border transition-all ${
                    idx === currentStepIndex
                      ? "bg-amber-100 dark:bg-amber-950/80 border-amber-400 font-bold"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300"
                  }`}
                >
                  <button
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      speakCurrentStep(st);
                    }}
                    className="flex-1 text-left flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-xs font-black">
                      {st.stepNumber}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {st.title} {idx === currentStepIndex ? "(Paso Actual)" : ""}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic truncate max-w-md">
                        {st.spokenText}
                      </p>
                    </div>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteStep(idx)}
                      disabled={activeRoute.steps.length <= 1}
                      aria-label={`Eliminar el paso ${st.stepNumber}`}
                      className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                      title="Eliminar este paso"
                    >
                      <TrashIcon width={16} height={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Modal: Add Step to Active Route */}
      {isAddStepOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-step-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-lg rounded-3xl border-2 border-amber-400 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400 text-slate-950">
                  <PlusIcon width={20} height={20} />
                </span>
                <div>
                  <h3 id="add-step-title" className="text-lg font-black">
                    Agregar Nuevo Paso a la Ruta
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                    Ruta: {activeRoute.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddStepOpen(false)}
                aria-label="Cerrar modal de agregar paso"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <form onSubmit={handleAddStepSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">
                  Título del Paso (Ubicación / Referencia en Quito):
                </label>
                <input
                  type="text"
                  required
                  value={newStepTitle}
                  onChange={(e) => setNewStepTitle(e.target.value)}
                  placeholder="Ej: Paso 4: Subir rampa de la Plaza de San Francisco o virar a la Sucre..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">
                    Dirección:
                  </label>
                  <select
                    value={newStepDirection}
                    onChange={(e) => setNewStepDirection(e.target.value as DirectionType)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs font-bold"
                  >
                    <option value="adelante">⬆️ Avanzar Recto</option>
                    <option value="izquierda">⬅️ Giro a la Izquierda</option>
                    <option value="derecha">➡️ Giro a la Derecha</option>
                    <option value="subir">↗️ Subir Rampa/Escaleras</option>
                    <option value="bajar">↘️ Bajar Rampa/Escaleras</option>
                    <option value="llegada">🎯 Llegada a Destino</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">
                    Pasos Estimados (Distancia):
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={newStepCount}
                    onChange={(e) => setNewStepCount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">
                  Instrucción Hablada Completa:
                </label>
                <textarea
                  rows={3}
                  value={newStepSpokenText}
                  onChange={(e) => setNewStepSpokenText(e.target.value)}
                  placeholder="Ej: Gira 90 grados a tu izquierda por la calle García Moreno. Avanza 4 pasos usando tu bastón..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs font-medium focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">
                  Posición donde insertar el paso:
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="insertPos"
                      value="end"
                      checked={insertPosition === "end"}
                      onChange={() => setInsertPosition("end")}
                    />
                    <span>Al final de la ruta (Paso {activeRoute.steps.length + 1})</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="insertPos"
                      value="after_current"
                      checked={insertPosition === "after_current"}
                      onChange={() => setInsertPosition("after_current")}
                    />
                    <span>Después del paso actual (Paso {currentStepIndex + 2})</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddStepOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 text-xs font-black shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                >
                  <CheckIcon width={16} height={16} />
                  Guardar Paso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Route / Destination */}
      {isCreateRouteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-route-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-xl rounded-3xl border-2 border-blue-500 bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-slate-100 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <TargetIcon width={20} height={20} />
                </span>
                <div>
                  <h3 id="create-route-title" className="text-lg font-black">
                    Crear Nuevo Destino en Quito
                  </h3>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-bold">
                    Elige una plantilla emblemática de Quito o define tu propio lugar
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateRouteOpen(false)}
                aria-label="Cerrar modal de nuevo destino"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            {/* Quito Preset Templates Quick Bar */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-black uppercase text-amber-600 dark:text-amber-400 tracking-wider">
                📍 Cargar plantilla rápida de punto famoso de Quito:
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {QUITO_PRESET_TEMPLATES.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyQuitoTemplate(tpl)}
                    className="text-[11px] font-bold bg-amber-50 dark:bg-amber-950/80 hover:bg-amber-100 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 px-2.5 py-1 rounded-lg text-left"
                  >
                    + {tpl.name.split("➔")[1] || tpl.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateRouteSubmit} className="space-y-4 text-xs font-bold pt-2">
              <div>
                <label className="block mb-1 text-slate-700 dark:text-slate-300">
                  Nombre del Destino o Lugar en Quito:
                </label>
                <input
                  type="text"
                  required
                  value={newRouteName}
                  onChange={(e) => setNewRouteName(e.target.value)}
                  placeholder="Ej: Basílica del Voto Nacional, Mercado Central de Quito, Estación El Labrador..."
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              <div className="rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 p-4 space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-blue-800 dark:text-blue-300">
                  Primer Paso del Recorrido
                </h4>

                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">
                    Título del primer paso:
                  </label>
                  <input
                    type="text"
                    value={initialStepTitle}
                    onChange={(e) => setInitialStepTitle(e.target.value)}
                    placeholder="Ej: Paso 1: Salir del Metro por la Calle Guayaquil"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-slate-700 dark:text-slate-300">
                      Dirección inicial:
                    </label>
                    <select
                      value={initialStepDirection}
                      onChange={(e) => setInitialStepDirection(e.target.value as DirectionType)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold"
                    >
                      <option value="adelante">⬆️ Avanzar Recto</option>
                      <option value="izquierda">⬅️ Giro a la Izquierda</option>
                      <option value="derecha">➡️ Giro a la Derecha</option>
                      <option value="subir">↗️ Subir Rampa/Escaleras</option>
                      <option value="bajar">↘️ Bajar Rampa/Escaleras</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 text-slate-700 dark:text-slate-300">
                      Pasos aproximados:
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={initialStepCount}
                      onChange={(e) => setInitialStepCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700 dark:text-slate-300">
                    Instrucción hablada:
                  </label>
                  <textarea
                    rows={2}
                    value={initialStepSpokenText}
                    onChange={(e) => setInitialStepSpokenText(e.target.value)}
                    placeholder="Ej: Sal del Metro y camina 6 pasos rectos por la calle adoquinada..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateRouteOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-black shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                >
                  <CheckIcon width={16} height={16} />
                  Crear Destino en Quito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Metrics & Impact Panel */}
      <section
        aria-label="Métricas de adopción de voz en tiempo real"
        className="rounded-3xl border-2 border-emerald-500/40 bg-emerald-950/90 text-white p-6 sm:p-8 shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-sm font-black tracking-wider text-emerald-300 uppercase">
              📊 Métricas de Adopción de Pasos Hablados (Linkear)
            </h3>
          </div>
          <button
            onClick={fetchMetrics}
            className="text-[11px] font-extrabold bg-emerald-900 hover:bg-emerald-800 text-emerald-200 px-3 py-1 rounded-lg border border-emerald-700"
          >
            Actualizar 🔄
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="rounded-2xl bg-emerald-900/60 p-4 border border-emerald-800">
            <p className="text-2xl font-black text-emerald-300">{metrics?.visuallyImpairedUsersEstimated || 76}</p>
            <p className="text-[11px] font-semibold text-emerald-200 mt-1">Usuarios No Videntes</p>
          </div>
          <div className="rounded-2xl bg-emerald-900/60 p-4 border border-emerald-800">
            <p className="text-2xl font-black text-emerald-300">{metrics?.totalMobilitySessions || 142}</p>
            <p className="text-[11px] font-semibold text-emerald-200 mt-1">Sesiones de Movilidad</p>
          </div>
          <div className="rounded-2xl bg-emerald-900/60 p-4 border border-emerald-800">
            <p className="text-2xl font-black text-emerald-300">{metrics?.screenReaderAdoptionRate || "94%"}</p>
            <p className="text-[11px] font-semibold text-emerald-200 mt-1">Lector de Pantalla</p>
          </div>
          <div className="rounded-2xl bg-emerald-900/60 p-4 border border-emerald-800">
            <p className="text-2xl font-black text-emerald-300">{metrics?.voiceCommandUsageRate || "88%"}</p>
            <p className="text-[11px] font-semibold text-emerald-200 mt-1">Comandos por Voz</p>
          </div>
        </div>
      </section>

      {/* Contrast Selector */}
      <section aria-label="Selector de temas de alto contraste" className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-6 space-y-3">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          🎨 Contraste para Lectura de Instrucciones
        </h3>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => applyContrastTheme("default")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold border transition-all ${
              contrastTheme === "default" ? "bg-slate-900 text-white border-slate-900" : "bg-slate-100 text-slate-800 border-slate-300"
            }`}
          >
            Estándar Accesible
          </button>
          <button
            onClick={() => applyContrastTheme("yellow-black")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all ${
              contrastTheme === "yellow-black" ? "bg-black text-yellow-300 border-yellow-400 ring-4 ring-yellow-400/40" : "bg-black text-yellow-400 border-yellow-400"
            }`}
          >
            🟡 Amarillo sobre Negro (Baja Visión)
          </button>
          <button
            onClick={() => applyContrastTheme("white-black")}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black border-2 transition-all ${
              contrastTheme === "white-black" ? "bg-black text-white border-white ring-4 ring-white/40" : "bg-black text-white border-white"
            }`}
          >
            ⚪ Blanco sobre Negro (Modo Oscuro)
          </button>
        </div>
      </section>
    </main>
  );
}
