
import { ComponentType } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

type Accent = "blue" | "green" | "purple" | "amber" | "pink" | "slate";

const accentStyles: Record<
  Accent,
  { iconBg: string; iconColor: string; linkColor: string; borderHover: string }
> = {
  blue: {
    iconBg: "bg-blue-100/80",
    iconColor: "text-blue-700",
    linkColor: "text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200",
    borderHover: "hover:border-blue-400 hover:shadow-blue-100",
  },
  green: {
    iconBg: "bg-emerald-100/80",
    iconColor: "text-emerald-700",
    linkColor: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200",
    borderHover: "hover:border-emerald-400 hover:shadow-emerald-100",
  },
  purple: {
    iconBg: "bg-purple-100/80",
    iconColor: "text-purple-700",
    linkColor: "text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200",
    borderHover: "hover:border-purple-400 hover:shadow-purple-100",
  },
  amber: {
    iconBg: "bg-amber-100/80",
    iconColor: "text-amber-800",
    linkColor: "text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200",
    borderHover: "hover:border-amber-400 hover:shadow-amber-100",
  },
  pink: {
    iconBg: "bg-pink-100/80",
    iconColor: "text-pink-700",
    linkColor: "text-pink-700 bg-pink-50 hover:bg-pink-100 border border-pink-200",
    borderHover: "hover:border-pink-400 hover:shadow-pink-100",
  },
  slate: {
    iconBg: "bg-slate-200/80",
    iconColor: "text-slate-800",
    linkColor: "text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-300",
    borderHover: "hover:border-slate-400 hover:shadow-slate-200",
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
    <article className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 ${styles.borderHover} hover:-translate-y-0.5 hover:shadow-md`}>
      <div>
        <div className="flex items-center justify-between">
          <span
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${styles.iconBg} ${styles.iconColor} transition-transform group-hover:scale-105`}
            aria-hidden="true"
          >
            <IconComp width={24} height={24} />
          </span>
          {shortcutKey && (
            <span
              className="rounded-lg bg-slate-100 px-2 py-1 text-[11px] font-mono font-semibold text-slate-500 border border-slate-200"
              title={`Atajo de teclado: ${shortcutKey}`}
            >
              {shortcutKey}
            </span>
          )}
        </div>

        <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">
          {description}
        </p>
      </div>

      <div className="mt-5 pt-2">
        <Link
          href={href}
          aria-label={`Acceder a ${title}: ${description}`}
          className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 ${styles.linkColor}`}
        >
          <span>Ir ahora</span>
          <ChevronRightIcon width={14} height={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

