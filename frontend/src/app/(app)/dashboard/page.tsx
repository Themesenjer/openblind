
import type { Metadata } from "next";
import DashboardHeader from "@/components/layout/DashboardHeader";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { BoxIcon, BookIcon, ClockIcon, HeadphonesIcon, HelpIcon, UserIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Inicio | OpenBlind",
};

const quickAccessItems = [
  { title: "Mis módulos", description: "Explora aprendizaje, audiolibros y más.", href: "/dashboard/modulos", icon: BoxIcon, accent: "blue" as const, shortcutKey: "Alt + 1" },
  { title: "Lector inteligente", description: "Escucha y navega cualquier contenido.", href: "/dashboard/lector", icon: BookIcon, accent: "green" as const, shortcutKey: "Alt + 2" },
  { title: "Historial", description: "Revisa tu actividad reciente.", href: "/dashboard/historial", icon: ClockIcon, accent: "purple" as const, shortcutKey: "Alt + 3" },
  { title: "Accesibilidad", description: "Ajusta tu experiencia de navegación.", href: "/dashboard/accesibilidad", icon: HeadphonesIcon, accent: "amber" as const, shortcutKey: "Alt + 4" },
  { title: "Ayuda", description: "Tutoriales, FAQ y soporte en vivo.", href: "/dashboard/ayuda", icon: HelpIcon, accent: "pink" as const, shortcutKey: "Alt + 5" },
  { title: "Mi perfil", description: "Gestiona tu cuenta y preferencias.", href: "/dashboard/perfil", icon: UserIcon, accent: "slate" as const, shortcutKey: "Alt + 6" },
];

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader userName="admin" greeting="Bienvenido" />

      <main className="px-8 py-8" id="main-content" tabIndex={-1}>
        <section aria-labelledby="quick-access-title">
          <h2 id="quick-access-title" className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Acceso Rápido y Módulos Principales
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {quickAccessItems.map((item) => (
              <QuickAccessCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section aria-labelledby="recent-activity-title" className="mt-12">
          <h2 id="recent-activity-title" className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Actividad Reciente
          </h2>
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-6 text-center text-sm text-slate-500">
            Sin actividades recientes. Las acciones realizadas mediante voz y lectura adaptativa aparecerán aquí.
          </div>
        </section>
      </main>

      <VoiceCommandButton />
    </>
  );
}

