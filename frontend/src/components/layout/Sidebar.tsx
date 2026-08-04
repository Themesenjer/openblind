"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  EyeIcon,
  HomeIcon,
  GridIcon,
  HeadphonesIcon,
  UserIcon,
  HelpIcon,
  LogoutIcon,
} from "@/components/ui/icons";

const AccessibilityIcon = HeadphonesIcon;

const navItems = [
  { label: "Inicio", href: "/dashboard", icon: HomeIcon, badge: true },
  { label: "Mis módulos", href: "/dashboard/modulos", icon: GridIcon },
  { label: "Lector inteligente", href: "/dashboard/lector", icon: HeadphonesIcon },
  { label: "Accesibilidad", href: "/dashboard/accesibilidad", icon: AccessibilityIcon },
  { label: "Mi perfil", href: "/dashboard/perfil", icon: UserIcon },
  { label: "Centro de ayuda", href: "/dashboard/ayuda", icon: HelpIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-30 flex h-screen w-64 flex-col bg-[#0f172a] text-slate-300 border-r border-slate-800/80 shadow-xl overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#1d4ed8] to-[#2563eb] text-white shadow-md shadow-blue-500/20">
          <EyeIcon width={20} height={20} />
        </span>
        <div>
          <p className="text-base font-bold tracking-tight text-white">OpenBlind</p>
          <p className="text-xs font-medium text-blue-400">Plataforma Accesible</p>
        </div>
      </div>

      {/* User Profile Summary Card */}
      <div className="flex items-center gap-3 border-b border-slate-800/80 px-6 py-4 bg-slate-900/40">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563eb] text-sm font-bold text-white shadow-sm ring-2 ring-blue-400/20">
          A
        </span>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">admin</p>
          <p className="text-xs text-slate-400 truncate">Usuario Activo</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav aria-label="Navegación principal" className="flex-1 space-y-1.5 px-3 py-5">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const IconComp = Icon || (() => null);

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-3 focus-visible:ring-amber-400 ${
                active
                  ? "bg-[#2563eb] text-white font-semibold shadow-md shadow-blue-600/25"
                  : "text-slate-300 hover:bg-slate-800/90 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3.5">
                <IconComp
                  width={19}
                  height={19}
                  className={`transition-transform group-hover:scale-110 ${
                    active ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                  }`}
                />
                <span>{label}</span>
              </span>
              {badge && active && (
                <span className="h-2 w-2 rounded-full bg-white shadow-xs" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action Footer */}
      <div className="border-t border-slate-800/80 px-3 py-4 bg-slate-900/30">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 focus:outline-none focus-visible:ring-3 focus-visible:ring-rose-400"
        >
          <LogoutIcon width={18} height={18} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}
