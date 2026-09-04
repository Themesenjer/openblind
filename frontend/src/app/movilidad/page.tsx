"use client";

import Link from "next/link";
import DashboardHeader from "@/components/layout/DashboardHeader";
import MobilitySingleScreen from "@/components/dashboard/MobilitySingleScreen";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function MovilidadGuestPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <DashboardHeader userName="Invitado" greeting="Asistente de Movilidad" />

      <div className="px-6 py-6">
        {/* Solo la experiencia de movilidad, sin módulos ni ajustes secundarios */}
        <MobilitySingleScreen />

        {/* Único enlace opcional: crear cuenta para guardar historial */}
        <div className="mx-auto mt-8 flex max-w-5xl justify-center">
          <Link
            href="/login"
            className="group inline-flex items-center gap-2 rounded-2xl border-2 border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
          >
            <span>Iniciar Sesión / Guardar Historial</span>
            <ArrowRightIcon width={16} height={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}