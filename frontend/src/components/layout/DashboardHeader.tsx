"use client";

import { useAccessibility } from "@/features/accessibility/AccessibilityContext";
import { BellIcon } from "@/components/ui/icons";

interface DashboardHeaderProps {
  userName: string;
  greeting?: string;
}

export default function DashboardHeader({ userName, greeting }: DashboardHeaderProps) {
  const { t } = useAccessibility();

  const greetingText = greeting || t("greeting_welcome");

  return (
    <header className="flex flex-wrap items-center justify-between border-b border-slate-200/80 bg-white/90 px-8 py-5 gap-4 backdrop-blur-md dark:bg-slate-900/90 dark:border-slate-800">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight text-[#0f172a] dark:text-white">
          {greetingText}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{userName}</span>. <span aria-hidden>👋</span>
        </h1>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{t("sub_what_to_do")}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200/90 text-slate-600 transition-all hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 shadow-2xs"
        >
          <BellIcon width={19} height={19} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500 animate-ping" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose-500" />
        </button>

        <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200/90 bg-white py-1.5 pl-1.5 pr-4 shadow-2xs dark:bg-slate-800/80 dark:border-slate-700">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563eb] to-[#1d4ed8] text-xs font-black text-white shadow-sm">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="text-xs font-bold text-[#0f172a] dark:text-white">{userName}</span>
        </div>
      </div>
    </header>
  );
}
