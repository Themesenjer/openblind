
import { ComponentType } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/icons";

type Accent = "blue" | "green" | "purple" | "amber" | "pink" | "slate";

const accentStyles: Record<Accent, { iconBg: string; iconColor: string; linkColor: string }> = {
  blue: { iconBg: "bg-blue-50", iconColor: "text-blue-600", linkColor: "text-blue-700 bg-blue-50" },
  green: { iconBg: "bg-emerald-50", iconColor: "text-emerald-600", linkColor: "text-emerald-700 bg-emerald-50" },
  purple: { iconBg: "bg-purple-50", iconColor: "text-purple-600", linkColor: "text-purple-700 bg-purple-50" },
  amber: { iconBg: "bg-amber-50", iconColor: "text-amber-600", linkColor: "text-amber-700 bg-amber-50" },
  pink: { iconBg: "bg-pink-50", iconColor: "text-pink-600", linkColor: "text-pink-700 bg-pink-50" },
  slate: { iconBg: "bg-slate-100", iconColor: "text-slate-600", linkColor: "text-slate-700 bg-slate-100" },
};

interface QuickAccessCardProps {
  title: string;
  description: string;
  href: string;
  icon: ComponentType<{ width?: number; height?: number }>;
  accent?: Accent;
}

export default function QuickAccessCard({
  title,
  description,
  href,
  icon: Icon,
  accent = "blue",
}: QuickAccessCardProps) {
  const styles = accentStyles[accent];

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconColor}`}>
        <Icon width={22} height={22} />
      </span>

      <h3 className="mt-4 text-base font-bold text-[#0f172a]">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <Link
        href={href}
        className={`mt-4 flex w-fit items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ${styles.linkColor} focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2`}
      >
        Ir ahora
        <ChevronRightIcon width={14} height={14} />
      </Link>
    </div>
  );
}
