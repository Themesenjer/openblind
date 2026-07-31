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
    <aside className="flex h-screen w-60 flex-col bg-[#0f172a] text-slate-300">
      <div className="flex items-center gap-2 border-b border-slate-800 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white">
          <EyeIcon width={18} height={18} />
        </span>
        <div>
          <p className="text-sm font-bold text-white">OpenBlind</p>
          <p className="text-xs text-slate-400">Vista de usuario</p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-b border-slate-800 px-5 py-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-sm font-semibold text-white">
          A
        </span>
        <div>
          <p className="text-sm font-semibold text-white">admin</p>
          <p className="text-xs text-slate-400">Usuario estándar</p>
        </div>
      </div>

      <nav aria-label="Navegación principal" className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2 ${
                active ? "bg-[#2563eb] text-white" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon width={18} height={18} />
                {label}
              </span>
              {badge && active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-3 py-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-slate-800 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
        >
          <LogoutIcon width={18} height={18} />
          Salir
        </button>
      </div>
    </aside>
  );
}
