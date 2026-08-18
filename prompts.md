# 🧠 Bitácora de Prompts e Instrucciones de IA - OpenBlind

Este documento registra los prompts y comandos efectivos descubiertos por el equipo durante el desarrollo del proyecto. Todos los integrantes deben registrar sus consultas aquí para garantizar la trazabilidad y la reutilización de conocimiento.

---

## 📋 Instructivo de Registro (Plantilla Obligatoria)

Cada vez que utilices una IA (ChatGPT, Gemini, Claude, etc.) para generar código, diseñar la arquitectura, redactar documentación o resolver un problema, debes agregar una entrada al final de este archivo siguiendo este formato:

### 📅 [FECHA] - [CÉLULA O MÓDULO]
* **Autor:** Nombre del Integrante
* **Rol / Célula:** (Ej. Célula 1 - Frontend / Célula 3 - QA & Specs)
* **Herramienta IA:** ChatGPT / Gemini / Claude / Copilot
* **Objetivo:** Breve descripción de lo que buscabas resolver.
* **Prompt exacto utilizado:**
  > "Pega aquí el texto exacto de la orden o pregunta enviada a la IA"
* **Resultado / Aplicación:** Explicación de qué parte del código, spec o test se creó o modificó con la respuesta.

---

## 📜 Registros del Equipo

### 📅 22/07/2026 - Gestión y Arquitectura Base
* **Autor:** Pablo Reyes
* **Rol / Célula:** Project Manager / Scrum Master
* **Herramienta IA:** Gemini
* **Objetivo:** Análisis de documentación oficial de Linkear, alineación con ODS 10 y 11 para Ecuador y estructuración del plan de trabajo por Células.
* **Prompt exacto utilizado:**
  > "Estructuración de diagnóstico e informe de integración técnica del Ecosistema Linkear para OpenBlind, definiendo el alcance funcional y la división por células de desarrollo."
* **Resultado / Aplicación:** Creación de la estructura del repositorio base, definición del plan aprobado por la coordinación técnica y organización del flujo en Trello.

---

### 📅 03/08/2026 - Célula 1 (Frontend & Accesibilidad)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Google Stitch / Gemini
* **Objetivo:** Diseñar y prototipar los componentes interactivos `VoiceCommandButton` (Botón Flotante de Comandos de Voz) y `QuickAccessCard` (Tarjeta de Accesos Rápidos), garantizando la integración en Next.js App Router con estándares de accesibilidad universal WCAG 2.1 Nivel AA.
* **Prompt exacto utilizado:**
  > "Diseña en Google Stitch dos componentes interactivos de UI accesibles para la plataforma OpenBlind en Next.js / Tailwind CSS: 
  > 1. Un botón flotante de comandos de voz (VoiceCommandButton) posicionado en la esquina inferior derecha. Debe incluir estado de escucha (isListening) con ondas de audio animadas, integración con la API de Web Speech (SpeechRecognition y SpeechSynthesis para retroalimentación por voz), región interactiva aria-live="assertive" para lectores de pantalla, atajo global de teclado Alt+V y un modal/drawer guía con los comandos disponibles ("Ir a módulos", "Lector inteligente", "Historial", "Accesibilidad", "Ayuda", "Perfil").
  > 2. Una tarjeta de acceso rápido (QuickAccessCard) que soporte variantes de acento de color, atajos visuales (ej. Alt+1), estados de foco de alto contraste (focus-visible:ring-4 focus-visible:ring-amber-400), semántica <article> accesible y retroalimentación táctil/hover. Proporciona el código modular en TypeScript listo para integrarse en /frontend."
---

### 📅 03/08/2026 - Célula 1 (Vista Centro de Ayuda)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Google Stitch / Gemini
* **Objetivo:** Crear la nueva pantalla interactiva del Centro de Ayuda (`/dashboard/ayuda`) replicando fielmente el diseño de prototipo entregado por el usuario, integrada con el flujo de navegación del Dashboard y Sidebar.
* **Prompt exacto utilizado:**
  > "Construye la vista accesible del Centro de Ayuda en Next.js App Router para OpenBlind en /dashboard/ayuda. Debe incluir: 
  > 1. Encabezado con título 'Centro de ayuda' y subtítulo descriptivo.
  > 2. Lista de Preguntas Frecuentes en formato Accordion interactivo con primer elemento abierto por defecto, bordes dinámicos de foco y etiquetas ARIA.
  > 3. Columna lateral con tarjetas de 'Contactar soporte' (Email y Teléfono) y 'Chat de ayuda' (con indicador de agente en línea en tiempo real).
  > 4. Sección de 'Videos accesibles' con cuadrícula 2x2, duraciones, botones de reproducción e integración de reproductor modal con audiodescripción.
  > 5. Botón flotante de comandos de voz activo (VoiceCommandButton)."
* **Resultado / Aplicación:** Creación de `frontend/src/app/(app)/dashboard/ayuda/page.tsx`, actualización de `icons.tsx` y verificación de ruteo desde la tarjeta de accesos rápidos del Dashboard y Sidebar.

---

### 📅 05/08/2026 - Célula 1 (Frontend & Accesibilidad - Componentes Stitch & Next.js)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Google Stitch / Next.js
* **Objetivo:** Refinar y acoplar en el entorno local de Next.js los componentes de UI accesibles de OpenBlind: `VoiceCommandButton` (Botón Flotante con Reconocimiento de Voz y Modal de Comandos), `QuickAccessCard` (Tarjetas de Acceso Rápido con Atajos Alt y Variantes de Acento) y la navegación accesible (`Sidebar` y `Navbar` con atajos de accesibilidad y foco de alto contraste).
* **Prompt exacto utilizado:**
  > "Diseña y refina en Google Stitch los componentes visuales e interactivos de accesibilidad universal para la plataforma OpenBlind en Next.js App Router y Tailwind CSS:
  > 1. Botón Flotante de Comandos de Voz (VoiceCommandButton): Ubicado en la esquina inferior derecha, con indicador visual en tiempo real de estado de escucha (ondas/badge animado), retroalimentación auditiva mediante Web Speech API (SpeechSynthesis y SpeechRecognition), región viva aria-live='assertive' para lectores de pantalla, atajo global de teclado Alt + V, y un drawer/modal interactivo accesible que despliega la guía completa de comandos de voz admitidos ("Ir a módulos", "Lector inteligente", "Historial", "Accesibilidad", "Ayuda", "Perfil").
  > 2. Tarjetas de Acceso Rápido (QuickAccessCard): Formato modular accesible <article> con soporte de variantes de color (azul, verde, púrpura, ámbar, rosa, pizarra), indicadores de atajos de teclado visuales (Alt + 1 al 6), y anillo de enfoque visible de alto contraste (focus-visible:ring-4 focus-visible:ring-amber-400) optimizado para navegación por teclado y lectores de pantalla.
  > 3. Navegación Accesible (Sidebar & Navbar): Menú lateral estático oscuro (#0f172a) con estado activo destacado, distintivos visuales, navegación semántica <nav aria-label="..."> y barra superior con accesos directos de alto contraste y tamaño de fuente ajustables. Proporciona la estructura TypeScript modular e intégrala en el entorno local Next.js."
* **Resultado / Aplicación:** Acoplamiento exitoso de `VoiceCommandButton.tsx`, `QuickAccessCard.tsx`, `Sidebar.tsx` y `Navbar.tsx` en `frontend/src/components/`, verificación en `frontend/src/app/(app)/dashboard/page.tsx` y compilación sin errores (`npm run build` exitoso).

---

### 📅 14/08/2026 - Célula 1 (Conexión Frontend - API Backend de Jandry)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Antigravity / Next.js
* **Objetivo:** Configurar las variables de entorno en `.env.local` con `NEXT_PUBLIC_API_URL` apuntando a `http://localhost:5000` para habilitar el consumo End-to-End de la API de autenticación (`POST /api/auth/login`) desde la interfaz accesible y documentar la colección de pruebas en Postman.
* **Prompt exacto utilizado:**
  > "Configura el archivo .env.local en la raíz de Next.js definiendo NEXT_PUBLIC_API_URL=http://localhost:5000 para enlazar el consumo de peticiones POST fetch desde LoginForm.tsx hacia la API de Jandry, y proporciona la guía paso a paso para probar los endpoints POST /api/auth/login y GET /api/health en Postman."
* **Resultado / Aplicación:** Creación de `frontend/.env.local`, cambio de puerto del backend a 5000 para evitar conflictos y guía completa de consumo en Postman.