"use client";

import Link from "next/link";
import { EyeIcon, TextSizeIcon, MoonIcon, ContrastIcon, GlobeIcon } from "@/components/ui/icons";

const toolbarButtons = [
  { label: "Aumentar tamaño de texto", icon: TextSizeIcon },
  { label: "Cambiar a modo oscuro", icon: MoonIcon },
  { label: "Activar alto contraste", icon: ContrastIcon },
  { label: "Cambiar idioma", icon: GlobeIcon },
];

export default function Navbar() {
  return (
    <header className="flex w-full items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-white">
          <EyeIcon width={18} height={18} />
        </span>
        <span className="text-lg font-bold text-[#102a43]">OpenBlind</span>
      </Link>

      <nav aria-label="Herramientas de accesibilidad" className="flex items-center gap-2">
        {toolbarButtons.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
          >
            <Icon width={16} height={16} />
          </button>
        ))}
      </nav>
    </header>
  );
}
