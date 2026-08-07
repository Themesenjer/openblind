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
* **Autor:** Stevens Tene
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Google Stitch / Gemini
* **Objetivo:** Diseñar y prototipar los componentes interactivos `VoiceCommandButton` (Botón Flotante de Comandos de Voz) y `QuickAccessCard` (Tarjeta de Accesos Rápidos), garantizando la integración en Next.js App Router con estándares de accesibilidad universal WCAG 2.1 Nivel AA.
* **Prompt exacto utilizado:**
  > "Diseña en Google Stitch dos componentes interactivos de UI accesibles para la plataforma OpenBlind en Next.js / Tailwind CSS: 
  > 1. Un botón flotante de comandos de voz (VoiceCommandButton) posicionado en la esquina inferior derecha. Debe incluir estado de escucha (isListening) con ondas de audio animadas, integración con la API de Web Speech (SpeechRecognition y SpeechSynthesis para retroalimentación por voz), región interactiva aria-live="assertive" para lectores de pantalla, atajo global de teclado Alt+V y un modal/drawer guía con los comandos disponibles ("Ir a módulos", "Lector inteligente", "Historial", "Accesibilidad", "Ayuda", "Perfil").
  > 2. Una tarjeta de acceso rápido (QuickAccessCard) que soporte variantes de acento de color, atajos visuales (ej. Alt+1), estados de foco de alto contraste (focus-visible:ring-4 focus-visible:ring-amber-400), semántica <article> accesible y retroalimentación táctil/hover. Proporciona el código modular en TypeScript listo para integrarse en /frontend."
---

### 📅 03/08/2026 - Célula 1 (Vista Centro de Ayuda)
* **Autor:** Stevens Tene
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

###   05/08/2026 - Célula 2 (Backend & Base de Datos)
* **Autor:** Aníbal Ismael Sarango
* **Rol / Célula:** Célula 2 - Backend & Base de Datos
* **Herramienta IA:** Google Antigravity
* **Objetivo:** Auditar integralmente el backend Express/Node de OpenBlind y completar la refactorización de las peticiones HTTP existentes, organizando correctamente rutas, controladores, middlewares y utilidades sin alterar el funcionamiento actual de la API.
* **Prompt exacto utilizado:**

  > "Analiza integralmente el backend Express/Node actual del proyecto OpenBlind.
  > El objetivo es completar el 100 % de la refactorización y organización de todas las peticiones HTTP existentes, reutilizando correctamente controladores, rutas, middlewares y utilidades.

  > Realiza primero una auditoría completa e identifica:
  > 1. Todas las rutas y peticiones HTTP existentes.
  > 2. Qué rutas todavía contienen lógica que debería estar en controladores.
  > 3. Qué controladores están incompletos o faltan.
  > 4. Qué bloques de código, consultas o validaciones están duplicados.
  > 5. Qué lógica puede reutilizarse mediante middlewares o funciones auxiliares.
  > 6. Qué rutas o middlewares están incompletos.
  > 7. Posibles errores en códigos HTTP, validaciones, manejo de excepciones o respuestas JSON.
  > 8. Qué partes todavía impiden considerar la refactorización como completada al 100 %.

  > Condiciones obligatorias:
  > - Trabaja únicamente sobre las funcionalidades y peticiones HTTP ya existentes.
  > - Mantén exactamente los endpoints actuales.
  > - No cambies los métodos HTTP.
  > - No cambies la estructura de las respuestas JSON.
  > - No cambies los códigos HTTP existentes, salvo que detectes un error y lo expliques antes.
  > - No alteres el funcionamiento de PostgreSQL ni las consultas SQL sin justificarlo.
  > - Reutiliza AppError, errorHandler y catchAsync.
  > - Separa completamente la lógica de negocio de las rutas.
  > - Evita cualquier duplicación de lógica.
  > - No crees endpoints ni funcionalidades nuevas sin aprobación.
  > - No modifiques el frontend.
  > - No ejecutes comandos Git.
  > - No realices git add, git commit ni git push.

  > Antes de modificar cualquier archivo, presenta:
  > 1. El inventario completo de rutas actuales.
  > 2. El estado actual de cada ruta, controlador y middleware.
  > 3. Los problemas encontrados.
  > 4. El porcentaje aproximado de avance actual.
  > 5. Todo lo que falta para alcanzar el 100 %.
  > 6. El plan de implementación dividido en etapas.
  > 7. La lista exacta de archivos que crearías o modificarías.
  > 8. Los riesgos de cada cambio.
  > 9. El listado completo de pruebas necesarias en Postman o Thunder Client.
  > 10. Los resultados esperados de cada petición HTTP.

  > Espera mi aprobación antes de aplicar cualquier modificación."
* **Resultado / Aplicación:** Antigravity realizó una auditoría completa del backend y determinó que la estructura modular estaba aproximadamente en un 85 %. Propuso extraer el healthcheck a su propio controlador y ruta, crear un middleware global para rutas no encontradas, mover las validaciones de campos obligatorios a un middleware reutilizable y dejar index.js únicamente para la configuración del servidor y el montaje de rutas.

---


###   06/08/2026 - Celula 2 / backend - actualizacion PUT
* **Autor:** Aníbal Ismael Sarango
* **Rol / Célula:** Doer / Célula 2
* **Herramienta IA:** Google Antigravity / ChatGPT
* **Objetivo:** Implementar la actualización completa de usuarios mediante el método PUT.
* **Prompt exacto utilizado:**
  > Prompt reconstruido para documentación a partir del trabajo realizado:
  > Analiza el backend actual de OpenBlind desarrollado con Node.js, Express y PostgreSQL e implementa el endpoint:
  > PUT /api/users/:id

  > Objetivo:
  > Permitir la actualización completa de un usuario existente.

  > Requisitos:
  >   •	El body debe incluir obligatoriamente nombre, email, password y rol. 
  >   •	Si falta alguno de estos campos, responder HTTP 400. 
  >   •	Verificar primero que el usuario indicado por :id exista. 
  >   •	Si el usuario no existe, responder HTTP 404 con el mensaje "Usuario no encontrado". 
  >   •	Verificar que el nuevo email no pertenezca a otro usuario. 
  >   •	Si el email pertenece a otro usuario, responder HTTP 409 con el mensaje "Ya existe un usuario con ese email". 
  >   •	Utilizar consultas PostgreSQL parametrizadas. 
  >   •	Actualizar los datos del usuario. 
  >   •	No devolver password en la respuesta. 
  >   •	Si la actualización es correcta, responder HTTP 200 con status "Success", mensaje "Usuario actualizado correctamente" y los datos públicos del usuario. 
  >   •	Mantener la arquitectura modular existente usando userController.js, userRoutes.js y validationMiddleware. 
  >   •	Reutilizar AppError, catchAsync y errorHandler. 
  >   •	No modificar otros endpoints. 
  >   •	No realizar cambios en frontend. 
  >   •	No ejecutar git add, git commit ni git push. 
  >   •	Antes de realizar cambios, mostrar archivos afectados, código propuesto, consultas SQL, códigos HTTP y casos de prueba. 
* **Resultado / Aplicación:** Se implementó PUT /api/users/:id, permitiendo actualizar completamente un usuario. Se agregaron validaciones para campos obligatorios, usuario inexistente y correo duplicado. El endpoint fue probado correctamente con respuestas HTTP 200, 400, 404 y 409.

---
