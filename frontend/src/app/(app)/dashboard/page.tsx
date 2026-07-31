
import type { Metadata } from "next";
import DashboardHeader from "@/components/layout/DashboardHeader";
import QuickAccessCard from "@/components/dashboard/QuickAccessCard";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import { BoxIcon, BookIcon, ClockIcon, HeadphonesIcon, HelpIcon, UserIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Inicio | OpenBlind",
};

const quickAccessItems = [
  { title: "Mis módulos", description: "Explora aprendizaje, audiolibros y más.", href: "/dashboard/modulos", icon: BoxIcon, accent: "blue" as const },
  { title: "Lector inteligente", description: "Escucha y navega cualquier contenido.", href: "/dashboard/lector", icon: BookIcon, accent: "green" as const },
  { title: "Historial", description: "Revisa tu actividad reciente.", href: "/dashboard/historial", icon: ClockIcon, accent: "purple" as const },
  { title: "Accesibilidad", description: "Ajusta tu experiencia de navegación.", href: "/dashboard/accesibilidad", icon: HeadphonesIcon, accent: "amber" as const },
  { title: "Ayuda", description: "Tutoriales, FAQ y soporte en vivo.", href: "/dashboard/ayuda", icon: HelpIcon, accent: "pink" as const },
  { title: "Mi perfil", description: "Gestiona tu cuenta y preferencias.", href: "/dashboard/perfil", icon: UserIcon, accent: "slate" as const },
];

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader userName="admin" greeting="Buenas noches" />

      <section className="px-8 py-8">
        <h2 className="text-xs font-bold tracking-wider text-slate-400">ACCESO RÁPIDO</h2>

        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {quickAccessItems.map((item) => (
            <QuickAccessCard key={item.title} {...item} />
          ))}
        </div>

        <h2 className="mt-10 text-xs font-bold tracking-wider text-slate-400">ACTIVIDAD RECIENTE</h2>
        {/* TODO: listar actividad reciente del usuario cuando el backend exponga el endpoint */}
      </section>

      <VoiceCommandButton />
    </>
  );
}
