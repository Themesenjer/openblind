"use client";

import { MicIcon } from "@/components/ui/icons";

export default function VoiceCommandButton() {
  return (
    <button
      type="button"
      className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-[#10b981] px-5 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-[#0f9d6e] focus:outline-none focus-visible:outline-3 focus-visible:outline-[#f59e0b] focus-visible:outline-offset-2"
      aria-label="Activar comandos de voz"
    >
      <MicIcon width={18} height={18} />
      Comandos de voz
    </button>
  );
}
