-- Seed de datos iniciales para el catálogo de Módulos (obtenidos del Frontend real)

INSERT INTO modulos (slug, categoria, titulo, badge, descripcion, icon_name, icon_bg, items)
VALUES
(
  'aprendizaje',
  'aprendizaje',
  '{"es-ES": "Aprendizaje"}'::jsonb,
  '{"es-ES": "12 lecciones"}'::jsonb,
  '{"es-ES": "Cursos interactivos adaptados con audio, texto ampliado y navegación por teclado."}'::jsonb,
  'aprendizaje',
  'bg-blue-100/70 text-[#2563eb]',
  '[
    {"id": "1", "title": "Introducción a la Navegación Accesible", "subtitle": "Fundamentos y atajos clave", "duration": "10 min"},
    {"id": "2", "title": "Comandos de Voz Esenciales", "subtitle": "Aprende a controlar la plataforma con la voz", "duration": "15 min"},
    {"id": "3", "title": "Lectores de Pantalla Avanzados", "subtitle": "Técnicas de agilización de lectura", "duration": "20 min"}
  ]'::jsonb
),
(
  'noticias',
  'noticias',
  '{"es-ES": "Noticias accesibles"}'::jsonb,
  '{"es-ES": "Actualizado hoy"}'::jsonb,
  '{"es-ES": "Lee o escucha las noticias del día con contraste optimizado y síntesis de voz."}'::jsonb,
  'noticias',
  'bg-teal-100/70 text-teal-700',
  '[
    {"id": "n1", "title": "Avances tecnológicos en accesibilidad universal", "subtitle": "Tecnología · Hoy", "duration": "5 min lectura"},
    {"id": "n2", "title": "Nuevas herramientas digitales para el empleo", "subtitle": "Actualidad · Hace 2h", "duration": "8 min lectura"},
    {"id": "n3", "title": "Resumen deportivo de la semana en audio", "subtitle": "Deportes · Hace 4h", "duration": "6 min lectura"}
  ]'::jsonb
),
(
  'audiolibros',
  'audiolibros',
  '{"es-ES": "Audiolibros"}'::jsonb,
  '{"es-ES": "Más de 340 títulos"}'::jsonb,
  '{"es-ES": "Biblioteca de audiolibros en español con controles de velocidad y marcadores."}'::jsonb,
  'audiolibros',
  'bg-purple-100/70 text-purple-700',
  '[
    {"id": "a1", "title": "El Principito (Versión Narrada Integrada)", "subtitle": "Antoine de Saint-Exupéry", "duration": "1h 45m"},
    {"id": "a2", "title": "Cien Años de Soledad", "subtitle": "Gabriel García Márquez", "duration": "14h 20m"},
    {"id": "a3", "title": "Don Quijote de la Mancha", "subtitle": "Miguel de Cervantes", "duration": "22h 10m"}
  ]'::jsonb
),
(
  'lectura',
  'herramientas',
  '{"es-ES": "Lectura inteligente"}'::jsonb,
  '{"es-ES": "PDF · EPUB · TXT"}'::jsonb,
  '{"es-ES": "Importa cualquier documento y escúchalo con resaltado de texto sincronizado."}'::jsonb,
  'lectura',
  'bg-emerald-100/70 text-emerald-700',
  '[]'::jsonb
),
(
  'navegacion',
  'herramientas',
  '{"es-ES": "Navegación web"}'::jsonb,
  '{"es-ES": "Asistido por IA"}'::jsonb,
  '{"es-ES": "Navega por sitios web de forma accesible con asistencia de lectura automática."}'::jsonb,
  'navegacion',
  'bg-amber-100/70 text-amber-700',
  '[
    {"id": "w1", "title": "Asistente de Resumen de Páginas Web", "subtitle": "Extrae el texto principal sin publicidad", "duration": "Herramienta Activa"},
    {"id": "w2", "title": "Navegador Simplificado por Bloques", "subtitle": "Estructura encabezados automáticamente", "duration": "Herramienta Activa"}
  ]'::jsonb
),
(
  'formacion',
  'formacion',
  '{"es-ES": "Formación profesional"}'::jsonb,
  '{"es-ES": "8 cursos"}'::jsonb,
  '{"es-ES": "Capacitaciones y certificaciones 100% accesibles para el mercado laboral."}'::jsonb,
  'formacion',
  'bg-rose-100/70 text-rose-700',
  '[
    {"id": "f1", "title": "Certificación en Pruebas de Accesibilidad QA", "subtitle": "Nivel Profesional · 4 semanas", "duration": "Certificado"},
    {"id": "f2", "title": "Desarrollo Web Inclusivo y WCAG 2.2", "subtitle": "Nivel Intermedio · 6 semanas", "duration": "Certificado"}
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
