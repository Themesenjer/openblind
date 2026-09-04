"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import MobilitySingleScreen from "@/components/dashboard/MobilitySingleScreen";
import { BoxIcon, BookIcon, ClockIcon, HeadphonesIcon, HelpIcon, UserIcon } from "@/components/ui/icons";
import { fetchWithAuth } from "@/lib/api";

const quickAccessItems = [
  { title: "Mis módulos", description: "Explora aprendizaje, audiolibros y más.", href: "/dashboard/modulos", icon: BoxIcon, accent: "blue" as const, shortcutKey: "Alt + 1" },
  { title: "Lector inteligente", description: "Escucha y navega cualquier contenido.", href: "/dashboard/lector", icon: BookIcon, accent: "green" as const, shortcutKey: "Alt + 2" },
  { title: "Historial", description: "Revisa tu actividad reciente.", href: "/dashboard/historial", icon: ClockIcon, accent: "purple" as const, shortcutKey: "Alt + 3" },
  { title: "Accesibilidad", description: "Ajusta tu experiencia de navegación.", href: "/dashboard/accesibilidad", icon: HeadphonesIcon, accent: "amber" as const, shortcutKey: "Alt + 4" },
  { title: "Ayuda", description: "Tutoriales, FAQ y soporte en vivo.", href: "/dashboard/ayuda", icon: HelpIcon, accent: "pink" as const, shortcutKey: "Alt + 5" },
  { title: "Mi perfil", description: "Gestiona tu cuenta y preferencias.", href: "/dashboard/perfil", icon: UserIcon, accent: "slate" as const, shortcutKey: "Alt + 6" },
];

interface DashboardSummaryData {
  user?: { nombre: string; email: string; rol: string };
  actividadReciente?: { id: number; titulo: string; fecha: string; tipo: string }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummaryData | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetchWithAuth("/api/users/profile");
        const json = await res.json();
        if (json?.status === "Success" && json.data) {
          setData({ user: json.data });
        }
      } catch (err) {
        console.warn("Could not fetch dashboard user profile from backend", err);
      }
    };
    fetchSummary();
  }, []);

  const userName = data?.user?.nombre || "Usuario (Modo Invitado / Directo)";

  return (
    <>
      <DashboardHeader userName={userName} greeting="Asistente de Movilidad" />

      <div className="px-6 py-6 space-y-10">
        {/* Single Screen Mobility Core Experience */}
        <MobilitySingleScreen />

        {/* Quick Access Cards */}
        <main className="mx-auto max-w-5xl" id="main-content" tabIndex={-1}>
          <section aria-labelledby="quick-access-title">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
              <h2 id="quick-access-title" className="text-xs font-black tracking-wider text-slate-500 uppercase">
                Módulos Secundarios y Ajustes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {quickAccessItems.map((item) => (
                <QuickAccessCard key={item.title} {...item} />
              ))}
            </div>
          </section>
        </main>
      </div>

      <VoiceCommandButton />
    </>
  );
}
