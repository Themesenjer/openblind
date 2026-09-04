"use client";

import { useEffect, useState } from "react";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { HeadphonesIcon, BookIcon, MicIcon, CheckCircleIcon } from "@/components/ui/icons";
import { fetchWithAuth } from "@/lib/api";

interface ActivityItem {
  id: string | number;
  title: string;
  description: string;
  time: string;
  iconBg: string;
}

const RECENT_ACTIVITIES_DEFAULT: ActivityItem[] = [
  {
    id: "1",
    title: "Don Quijote de la Mancha - Capítulo 1",
    description: "Lectura escuchada al 85% de velocidad",
    time: "Hace 15 minutos",
    iconBg: "bg-purple-100/70 text-purple-700",
  },
  {
    id: "2",
    title: 'Comando de voz: "Ir a módulos"',
    description: "Navegación asistida por voz",
    time: "Hace 1 hora",
    iconBg: "bg-emerald-100/70 text-emerald-700",
  },
  {
    id: "3",
    title: "Introducción a la Navegación Accesible",
    description: "Módulo completado",
    time: "Ayer a las 16:30",
    iconBg: "bg-blue-100/70 text-[#2563eb]",
  },
];

export default function HistorialPage() {
  const [activities, setActivities] = useState<ActivityItem[]>(RECENT_ACTIVITIES_DEFAULT);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetchWithAuth("/api/history");
        const json = await res.json();
        if (json?.status === "Success" && Array.isArray(json.data)) {
          const mapped = json.data.map((item: { id: number; action: string; category: string; timestamp: string }) => ({
            id: item.id,
            title: item.action,
            description: `Categoría: ${item.category}`,
            time: item.timestamp,
            iconBg: item.category === "Voz" ? "bg-emerald-100/70 text-emerald-700" : "bg-blue-100/70 text-[#2563eb]",
          }));
          setActivities(mapped);
        }
      } catch (err) {
        console.warn("Could not fetch activity history from backend", err);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 px-6 py-8 sm:px-10 sm:py-10 transition-colors duration-200" id="main-content" tabIndex={-1}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-[#2563eb] shadow-sm shadow-blue-500/50" />
          <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
            Registro de Actividad (Backend Sincronizado)
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Historial de actividad
        </h1>
        <p className="max-w-3xl text-sm text-slate-600 font-medium leading-relaxed">
          Consulta tus acciones recientes, sesiones de lectura adaptativa y comandos de voz ejecutados.
        </p>
      </div>

      {/* Activity List */}
      <div className="mt-8 space-y-4">
        {activities.map((activity) => (
          <article
            key={activity.id}
            className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${activity.iconBg} shadow-xs`}>
                <HeadphonesIcon width={22} height={22} />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{activity.title}</h2>
                <p className="text-xs text-slate-500 font-medium">{activity.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400">{activity.time}</span>
              <CheckCircleIcon width={18} height={18} className="text-emerald-500" />
            </div>
          </article>
        ))}
      </div>

      <VoiceCommandButton />
    </div>
  );
}
