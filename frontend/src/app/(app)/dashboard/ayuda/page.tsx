"use client";

import { useState } from "react";
import DashboardHeader from "@/components/layout/DashboardHeader";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MailIcon,
  PhoneIcon,
  MessageSquareIcon,
  TargetIcon,
  EyeIcon,
  MicIcon,
  BookIcon,
  PlayIcon,
  XIcon,
  SpeakerIcon,
} from "@/components/ui/icons";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "¿Cómo activo el lector de pantalla?",
    answer:
      'Ve a Configuración de accesibilidad y activa el interruptor "Lector de pantalla". También puedes usar el atajo Alt+R desde cualquier pantalla. Compatible con NVDA, VoiceOver, TalkBack y Narrador de Windows.',
  },
  {
    id: "faq-2",
    question: "¿Cómo navego con el teclado?",
    answer:
      "Usa la tecla Tab para avanzar entre elementos interactivos y Shift+Tab para retroceder. Presiona Enter o Espacio para activar botones y enlaces. Puedes usar los atajos Alt+1 al Alt+6 para saltar rápidamente a secciones principales.",
  },
  {
    id: "faq-3",
    question: "¿Cómo uso los comandos de voz?",
    answer:
      'Haz clic en el botón flotante "Comandos de voz" en la esquina inferior derecha o presiona el atajo de teclado Alt+V. Di claramente comandos como "Ir a módulos", "Lector inteligente" o "Ayuda".',
  },
  {
    id: "faq-4",
    question: "¿Puedo cambiar el tamaño de la letra?",
    answer:
      "Sí, en la sección de Accesibilidad puedes personalizar el tamaño tipográfico, seleccionar alto contraste de pantalla y activar la fuente adaptativa para facilitar la lectura.",
  },
  {
    id: "faq-5",
    question: "¿Cómo recupero mi contraseña?",
    answer:
      "En la pantalla de inicio de sesión, selecciona '¿Olvidaste tu contraseña?'. Ingresa tu correo electrónico registrado y te enviaremos un enlace accesible con instrucciones para restablecerla.",
  },
];

interface VideoTutorial {
  id: string;
  title: string;
  duration: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  videoUrl?: string;
}

const VIDEO_TUTORIALS: VideoTutorial[] = [
  {
    id: "vid-1",
    title: "Primeros pasos en OpenBlind",
    duration: "4:32 min",
    icon: TargetIcon,
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
  {
    id: "vid-2",
    title: "Configurar el lector de pantalla",
    duration: "6:15 min",
    icon: EyeIcon,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "vid-3",
    title: "Navegar con comandos de voz",
    duration: "5:48 min",
    icon: MicIcon,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-700",
  },
  {
    id: "vid-4",
    title: "Usar el lector inteligente",
    duration: "7:20 min",
    icon: BookIcon,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
];

export default function AyudaPage() {
  // Accordion state: default open item 0 (matches prototype)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <DashboardHeader userName="admin" greeting="Centro de Ayuda" />

      <main className="px-6 py-8 sm:px-10 max-w-7xl mx-auto" id="main-content" tabIndex={-1}>
        {/* Page Title Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Centro de ayuda
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Todo lo que necesitas para sacar el máximo provecho de OpenBlind.
          </p>
        </header>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: FAQ Accordion & Videos */}
          <div className="lg:col-span-2 space-y-10">
            {/* FAQ Section */}
            <section aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-xl font-bold text-slate-900 mb-4">
                Preguntas frecuentes
              </h2>

              <div className="space-y-3" role="tablist">
                {FAQ_DATA.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <article
                      key={item.id}
                      className={`rounded-2xl bg-white transition-all duration-200 ${
                        isOpen
                          ? "border-2 border-blue-600 shadow-md ring-2 ring-blue-500/10"
                          : "border border-slate-200 hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${item.id}`}
                        id={`faq-header-${item.id}`}
                        className="flex w-full items-center justify-between p-5 text-left font-bold text-slate-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:ring-offset-2 rounded-2xl"
                      >
                        <span className="text-base text-slate-900">{item.question}</span>
                        <span className="ml-4 flex h-7 w-7 items-center justify-center rounded-full text-blue-600 transition-transform">
                          {isOpen ? (
                            <ChevronUpIcon width={20} height={20} />
                          ) : (
                            <ChevronDownIcon width={20} height={20} className="text-slate-400" />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div
                          id={`faq-answer-${item.id}`}
                          role="region"
                          aria-labelledby={`faq-header-${item.id}`}
                          className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 border-t border-slate-100"
                        >
                          {item.answer}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Videos Accesibles Section */}
            <section aria-labelledby="videos-heading" className="pt-2">
              <h2 id="videos-heading" className="text-xl font-bold text-slate-900 mb-4">
                Videos accesibles
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {VIDEO_TUTORIALS.map((video) => {
                  const Icon = video.icon;
                  return (
                    <div
                      key={video.id}
                      className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${video.iconBg} ${video.iconColor}`}
                        >
                          <Icon width={24} height={24} />
                        </span>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {video.title}
                          </h3>
                          <p className="text-xs text-slate-500">{video.duration}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedVideo(video)}
                        aria-label={`Reproducir video: ${video.title}`}
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
                      >
                        <PlayIcon width={16} height={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right Column: Support Cards */}
          <aside className="space-y-6">
            {/* Contactar Soporte Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-5">
                Contactar soporte
              </h2>

              <div className="space-y-3">
                {/* Email Item */}
                <a
                  href="mailto:soporte@openblind.app"
                  className="group flex items-center gap-3.5 rounded-xl bg-slate-50 p-3.5 transition-colors hover:bg-blue-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <MailIcon width={20} height={20} />
                  </span>
                  <div>
                    <span className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      EMAIL
                    </span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                      soporte@openblind.app
                    </span>
                  </div>
                </a>

                {/* Phone Item */}
                <a
                  href="tel:+18006736254"
                  className="group flex items-center gap-3.5 rounded-xl bg-slate-50 p-3.5 transition-colors hover:bg-emerald-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <PhoneIcon width={20} height={20} />
                  </span>
                  <div>
                    <span className="block text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                      TELÉFONO
                    </span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">
                      +1 800 OPENBLIND
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Chat de Ayuda Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <button
                type="button"
                onClick={() => setIsChatOpen(true)}
                className="flex w-full items-center justify-between rounded-xl text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-400"
              >
                <div className="flex items-center gap-3.5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                    <MessageSquareIcon width={20} height={20} />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Chat de ayuda</h3>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Agente disponible
                    </span>
                  </div>
                </div>

                <span className="text-slate-400">
                  <ChevronDownIcon width={18} height={18} />
                </span>
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <PlayIcon width={20} height={20} />
                </span>
                <div>
                  <h3 id="video-modal-title" className="text-lg font-bold text-white">
                    {selectedVideo.title}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Video tutorial adaptado con audiodescripción ({selectedVideo.duration})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                aria-label="Cerrar reproductor de video"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            {/* Simulated Accessible Player Frame */}
            <div className="mt-5 aspect-video w-full rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
              <div className="relative z-10 space-y-3">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl animate-pulse">
                  <PlayIcon width={28} height={28} />
                </span>
                <p className="text-sm font-semibold text-slate-200">
                  Reproduciendo tutorial con síntesis de voz y subtítulos accesibles.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-slate-800 pt-4">
              <span className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <SpeakerIcon width={16} height={16} /> Audiodescripción activada
              </span>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Cerrar video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Agent Chat Modal */}
      {isChatOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <MessageSquareIcon width={20} height={20} />
                </span>
                <div>
                  <h3 id="chat-modal-title" className="text-base font-bold text-white">
                    Soporte en Vivo OpenBlind
                  </h3>
                  <span className="text-xs font-medium text-emerald-400">
                    • Agente en línea
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                aria-label="Cerrar chat de ayuda"
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <XIcon width={20} height={20} />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-1">
              <div className="rounded-2xl bg-slate-800 p-3.5 text-xs text-slate-200">
                ¡Hola! Soy el asistente accesible de OpenBlind. ¿En qué podemos ayudarte hoy?
              </div>
            </div>

            <div className="mt-4 flex gap-2 pt-3 border-t border-slate-800">
              <input
                type="text"
                placeholder="Escribe tu mensaje o usa dictado..."
                aria-label="Mensaje para el agente"
                className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              />
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Voice Command Button */}
      <VoiceCommandButton />
    </>
  );
}
