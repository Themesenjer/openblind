import Link from "next/link";
import VoiceCommandButton from "@/components/dashboard/VoiceCommandButton";
import {
  ArrowRightIcon,
  LayersIcon,
  NewspaperIcon,
  HeadphonesIcon,
  BookIcon,
  GlobeIcon,
  GraduationCapIcon,
  PlayIcon,
} from "@/components/ui/icons";

interface ModuleDetail {
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
  iconBg: string;
  items: { id: string; title: string; subtitle: string; duration?: string }[];
}

const MODULE_DETAILS: Record<string, ModuleDetail> = {
  aprendizaje: {
    title: "Aprendizaje",
    badge: "12 lecciones disponibles",
    description: "Cursos interactivos adaptados con audio, texto ampliado y navegación por teclado.",
    icon: LayersIcon,
    iconBg: "bg-blue-100/70 text-[#2563eb]",
    items: [
      { id: "1", title: "Introducción a la Navegación Accesible", subtitle: "Fundamentos y atajos clave", duration: "10 min" },
      { id: "2", title: "Comandos de Voz Esenciales", subtitle: "Aprende a controlar la plataforma con la voz", duration: "15 min" },
      { id: "3", title: "Lectores de Pantalla Avanzados", subtitle: "Técnicas de agilización de lectura", duration: "20 min" },
    ],
  },
  noticias: {
    title: "Noticias accesibles",
    badge: "Actualizado hoy",
    description: "Lee o escucha las noticias del día con contraste optimizado y síntesis de voz.",
    icon: NewspaperIcon,
    iconBg: "bg-teal-100/70 text-teal-700",
    items: [
      { id: "n1", title: "Avances tecnológicos en accesibilidad universal", subtitle: "Tecnología · Hoy", duration: "5 min lectura" },
      { id: "n2", title: "Nuevas herramientas digitales para el empleo", subtitle: "Actualidad · Hace 2h", duration: "8 min lectura" },
      { id: "n3", title: "Resumen deportivo de la semana en audio", subtitle: "Deportes · Hace 4h", duration: "6 min lectura" },
    ],
  },
  audiolibros: {
    title: "Audiolibros",
    badge: "+340 títulos disponibles",
    description: "Biblioteca de audiolibros en español con controles de velocidad y marcadores.",
    icon: HeadphonesIcon,
    iconBg: "bg-purple-100/70 text-purple-700",
    items: [
      { id: "a1", title: "El Principito (Versión Narrada Integrada)", subtitle: "Antoine de Saint-Exupéry", duration: "1h 45m" },
      { id: "a2", title: "Cien Años de Soledad", subtitle: "Gabriel García Márquez", duration: "14h 20m" },
      { id: "a3", title: "Don Quijote de la Mancha", subtitle: "Miguel de Cervantes", duration: "22h 10m" },
    ],
  },
  navegacion: {
    title: "Navegación web asistida",
    badge: "Asistido por IA",
    description: "Navega por sitios web de forma accesible con asistencia de lectura automática.",
    icon: GlobeIcon,
    iconBg: "bg-amber-100/70 text-amber-700",
    items: [
      { id: "w1", title: "Asistente de Resumen de Páginas Web", subtitle: "Extrae el texto principal sin publicidad", duration: "Herramienta Activa" },
      { id: "w2", title: "Navegador Simplificado por Bloques", subtitle: "Estructura encabezados automáticamente", duration: "Herramienta Activa" },
    ],
  },
  formacion: {
    title: "Formación profesional",
    badge: "8 cursos certificados",
    description: "Capacitaciones y certificaciones 100% accesibles para el mercado laboral.",
    icon: GraduationCapIcon,
    iconBg: "bg-rose-100/70 text-rose-700",
    items: [
      { id: "f1", title: "Certificación en Pruebas de Accesibilidad QA", subtitle: "Nivel Profesional · 4 semanas", duration: "Certificado" },
      { id: "f2", title: "Desarrollo Web Inclusivo y WCAG 2.2", subtitle: "Nivel Intermedio · 6 semanas", duration: "Certificado" },
    ],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = MODULE_DETAILS[slug];
  return {
    title: mod ? `${mod.title} | OpenBlind` : "Módulo | OpenBlind",
  };
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moduleData = MODULE_DETAILS[slug];

  const Play = PlayIcon || (() => null);
  const ArrowRight = ArrowRightIcon || (() => null);

  if (!moduleData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-xl rounded-3xl bg-white p-8 border border-slate-200/90 text-center shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Módulo en preparación</h1>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            Este módulo se encuentra en proceso de carga. Puedes explorar los módulos principales.
          </p>
          <Link
            href="/dashboard/modulos"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-colors"
          >
            Volver a Explorar Módulos
          </Link>
        </div>
      </div>
    );
  }

  const IconComp = moduleData.icon || BookIcon;

  return (
    <div className="min-h-screen bg-[#f8fafc] px-6 py-8 sm:px-10 sm:py-10" id="main-content" tabIndex={-1}>
      {/* Breadcrumb Navigation */}
      <nav aria-label="Mapeo de ruta" className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/dashboard/modulos" className="hover:text-[#2563eb] transition-colors">
          Explorar módulos
        </Link>
        <span>/</span>
        <span className="font-semibold text-slate-800">{moduleData.title}</span>
      </nav>

      {/* Module Header Container */}
      <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-5">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${moduleData.iconBg} shadow-xs`}>
              <IconComp width={32} height={32} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{moduleData.title}</h1>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#2563eb] border border-blue-200/60">
                  {moduleData.badge}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 font-medium">{moduleData.description}</p>
            </div>
          </div>

          <Link
            href="/dashboard/modulos"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors self-start sm:self-auto"
          >
            ← Volver a módulos
          </Link>
        </div>
      </div>

      {/* Module Content Items */}
      <div className="mt-8">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Contenido disponible</h2>
        <div className="mt-4 space-y-4">
          {moduleData.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
                  <Play width={16} height={16} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">{item.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {item.duration && (
                  <span className="text-xs font-semibold text-slate-400">{item.duration}</span>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#2563eb] hover:bg-blue-100 transition-colors"
                >
                  <span>Iniciar</span>
                  <ArrowRight width={14} height={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <VoiceCommandButton />
    </div>
  );
}
