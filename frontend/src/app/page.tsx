import Link from "next/link";
import {
  EyeIcon,
  KeyboardIcon,
  MicIcon,
  ScreenReaderIcon,
  ContrastIcon,
  ArrowRightIcon,
  SpeakerIcon,
  AccessibilityBadgeIcon,
} from "@/components/ui/icons";

const features = [
  { label: "Navegación por teclado", icon: KeyboardIcon },
  { label: "Comandos de voz", icon: MicIcon },
  { label: "Lector de pantalla", icon: ScreenReaderIcon },
  { label: "Alto contraste", icon: ContrastIcon },
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f8fafc]">
      {/* franja decorativa superior */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#10b981]" />

      <div className="flex w-full max-w-2xl flex-1 flex-col items-center px-4 py-16 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2563eb] text-white shadow-lg">
          <EyeIcon width={36} height={36} strokeWidth={2.2} />
        </span>

        <h1 className="mt-8 text-4xl font-extrabold text-[#0f172a] sm:text-5xl">
          Bienvenido a <span className="text-[#2563eb]">OpenBlind</span>
        </h1>
        <p className="mt-3 text-lg text-slate-500">Tecnología accesible para todos.</p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {features.map(({ label, icon: Icon }) => (
            <li
              key={label}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm"
            >
              <Icon width={16} height={16} />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-10 flex w-full max-w-sm flex-col gap-3">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#2563eb] px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
          >
            Comenzar
            <ArrowRightIcon width={18} height={18} />
          </Link>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#10b981] bg-white px-4 py-3 text-base font-semibold text-[#0f9d6e] transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
          >
            <MicIcon width={18} height={18} />
            Ingresar con voz
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#2563eb] bg-white px-4 py-3 text-base font-semibold text-[#2563eb] transition-colors hover:bg-blue-50 focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
          >
            <SpeakerIcon width={18} height={18} />
            Activar lector de pantalla
          </button>
        </div>

        <span className="mt-8 flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700">
          <AccessibilityBadgeIcon width={14} height={14} />
          WCAG 2.1 Nivel AA · Compatible con NVDA, VoiceOver y TalkBack
        </span>
      </div>
    </main>
  );
}
