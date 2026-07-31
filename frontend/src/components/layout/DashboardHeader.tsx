"use client";

import { BellIcon } from "@/components/ui/icons";

interface DashboardHeaderProps {
  userName: string;
  greeting: string;
}

export default function DashboardHeader({ userName, greeting }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">
          {greeting}, <span className="text-[#2563eb]">{userName}</span>. <span aria-hidden>👋</span>
        </h1>
        <p className="text-sm text-slate-500">¿Qué deseas hacer hoy?</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
        >
          <BellIcon width={18} height={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-2 rounded-full border border-slate-200 py-1 pl-1 pr-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb] text-sm font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm font-semibold text-[#0f172a]">{userName}</span>
        </div>
      </div>
    </header>
  );
}
