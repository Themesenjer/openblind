import { ComponentType } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

type Accent = "blue" | "green" | "purple" | "amber" | "pink" | "slate";

const accentStyles: Record<
  Accent,
  { iconBg: string; iconColor: string; linkColor: string; borderHover: string; glowColor: string }
> = {
  blue: {
    iconBg: "bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/25",
    iconColor: "text-white",
    linkColor: "text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800",
    borderHover: "hover:border-blue-300 hover:shadow-blue-500/10",
    glowColor: "group-hover:opacity-100 bg-blue-500/10",
  },
  green: {
    iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 shadow-emerald-500/25",
    iconColor: "text-white",
    linkColor: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800",
    borderHover: "hover:border-emerald-300 hover:shadow-emerald-500/10",
    glowColor: "group-hover:opacity-100 bg-emerald-500/10",
  },
  purple: {
    iconBg: "bg-gradient-to-tr from-purple-600 to-pink-600 shadow-purple-500/25",
    iconColor: "text-white",
    linkColor: "text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800",
    borderHover: "hover:border-purple-300 hover:shadow-purple-500/10",
    glowColor: "group-hover:opacity-100 bg-purple-500/10",
  },
  amber: {
    iconBg: "bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/25",
    iconColor: "text-white",
    linkColor: "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800",
    borderHover: "hover:border-amber-300 hover:shadow-amber-500/10",
    glowColor: "group-hover:opacity-100 bg-amber-500/10",
  },
  pink: {
    iconBg: "bg-gradient-to-tr from-pink-500 to-rose-600 shadow-pink-500/25",
    iconColor: "text-white",
    linkColor: "text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200 dark:bg-pink-950/60 dark:text-pink-300 dark:border-pink-800",
    borderHover: "hover:border-pink-300 hover:shadow-pink-500/10",
    glowColor: "group-hover:opacity-100 bg-pink-500/10",
  },
  slate: {
    iconBg: "bg-gradient-to-tr from-slate-700 to-slate-900 shadow-slate-500/25",
    iconColor: "text-white",
    linkColor: "text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
    borderHover: "hover:border-slate-400 hover:shadow-slate-500/10",
    glowColor: "group-hover:opacity-100 bg-slate-500/10",
  },
};

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ width?: number; height?: number; className?: string }>;
  accent?: Accent;
  shortcutKey?: string;
}

export default function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
  accent = "blue",
  shortcutKey,
}: QuickAccessCardProps) {
  const styles = accentStyles[accent];
  const IconComp = Icon || (() => null);

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 ${styles.borderHover} hover:-translate-y-1 hover:shadow-xl dark:bg-slate-900/95 dark:border-slate-800`}
    >
      {/* Ambient background glow on hover */}
      <div className={`pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 ${styles.glowColor}`} />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span
            className={`flex h-13 w-13 items-center justify-center rounded-2xl ${styles.iconBg} ${styles.iconColor} shadow-md transition-transform duration-300 group-hover:scale-105`}
            aria-hidden="true"
          >
            <IconComp width={24} height={24} />
          </span>
          {shortcutKey && (
            <kbd
              className="rounded-xl bg-slate-100/80 px-2.5 py-1 text-[11px] font-mono font-bold text-slate-700 border border-slate-200/80 shadow-2xs dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
              title={`Atajo de teclado: ${shortcutKey}`}
            >
              {shortcutKey}
            </kbd>
          )}
        </div>

        <h3 className="mt-5 text-lg font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-300 font-medium">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-6 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        <Link
          href={href}
          prefetch={false}
          aria-label={`Acceder a ${title}: ${description}`}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 ${styles.linkColor}`}
        >
          <span>Ir ahora</span>
          <ChevronRightIcon width={14} height={14} className="transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
