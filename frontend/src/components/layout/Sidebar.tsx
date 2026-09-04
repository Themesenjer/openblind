"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
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

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useAccessibility();

  const navItems = [
    { labelKey: "nav_home", defaultLabel: "Inicio", href: "/dashboard", icon: HomeIcon, badge: true },
    { labelKey: "nav_modules", defaultLabel: "Mis módulos", href: "/dashboard/modulos", icon: GridIcon },
    { labelKey: "nav_reader", defaultLabel: "Lector inteligente", href: "/dashboard/lector", icon: HeadphonesIcon },
    { labelKey: "nav_accessibility", defaultLabel: "Accesibilidad", href: "/dashboard/accesibilidad", icon: AccessibilityIcon },
    { labelKey: "nav_profile", defaultLabel: "Mi perfil", href: "/dashboard/perfil", icon: UserIcon },
    { labelKey: "nav_help", defaultLabel: "Centro de ayuda", href: "/dashboard/ayuda", icon: HelpIcon },
  ];

  return (
    <aside className="fixed top-0 left-0 bottom-0 z-30 flex h-screen w-64 flex-col bg-[#0b1329] text-slate-300 border-r border-slate-800/80 shadow-2xl overflow-y-auto">
      {/* Brand Header */}
      <div className="flex items-center gap-3.5 border-b border-slate-800/70 px-6 py-5.5">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white shadow-lg shadow-blue-600/30 ring-1 ring-white/20">
          <EyeIcon width={22} height={22} />
        </span>
        <div>
          <p className="text-lg font-black tracking-tight text-white">OpenBlind</p>
          <p className="text-xs font-semibold text-blue-400">Plataforma Accesible</p>
        </div>
      </div>

      {/* User Profile Summary Card */}
      <div className="flex items-center gap-3 border-b border-slate-800/70 px-5 py-4 bg-slate-900/60 mx-3 my-3 rounded-2xl border border-slate-800/50">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md ring-2 ring-blue-400/30">
          A
        </span>
        <div className="overflow-hidden">
          <p className="text-sm font-bold text-white truncate">admin</p>
          <p className="text-xs font-medium text-emerald-400 truncate flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Usuario Activo
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav aria-label="Navegación principal" className="flex-1 space-y-1.5 px-3 py-2">
        {navItems.map(({ labelKey, defaultLabel, href, icon: Icon, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const IconComp = Icon || (() => null);
          const label = t(labelKey) || defaultLabel;

          return (
            <Link
              key={href}
              href={href}
              prefetch={false}
              aria-current={active ? "page" : undefined}
              className={`group flex items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-bold transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${
                active
                  ? "bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg shadow-blue-600/30 border border-blue-400/30"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3.5">
                <IconComp
                  width={20}
                  height={20}
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    active ? "text-white" : "text-slate-400 group-hover:text-blue-400"
                  }`}
                />
                <span>{label}</span>
              </span>
              {badge && active && (
                <span className="h-2 w-2 rounded-full bg-white shadow-xs animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action Footer */}
      <div className="border-t border-slate-800/70 px-3 py-4 bg-slate-950/40">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold text-rose-400 transition-all hover:bg-rose-500/15 hover:text-rose-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-400"
        >
          <LogoutIcon width={19} height={19} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}
