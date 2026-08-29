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

### 📅 05/08/2026 - Célula 2 (Backend & Base de Datos)
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
###   06/08/2026 - CÉLULA 2 / BACKEND - ACTUALIZACIÓN PATCH
* **Autor:** Aníbal Ismael Sarango
* **Rol / Célula:** Doer / Célula 2
* **Herramienta IA:** Google Antigravity y ChatGPT
* **Objetivo:** Implementar una actualización parcial de usuarios mediante PATCH.
* **Prompt exacto utilizado:**
  > Analiza el backend Express/Node actual de OpenBlind y propón la implementación del endpoint:
  > PATCH /api/users/:id
  > Objetivo:
  > Permitir la actualización parcial de un usuario existente en PostgreSQL. El cliente podrá enviar uno o varios de estos campos:
  >   • nombre 
  >   • email 
  >   • password 
  >   • rol 
  > Requisitos:
  >   1. No todos los campos serán obligatorios. 
  >   2. Debe enviarse al menos uno de los campos permitidos. 
  >   3. Si el body está vacío o no contiene campos válidos, debe responder HTTP 400. 
  >   4. Verifica primero que el usuario indicado por :id exista. 
  >   5. Si el usuario no existe, responde HTTP 404 con el mensaje "Usuario no encontrado". 
  >   6. Si se envía email, verifica que no pertenezca a otro usuario. 
  >   7. Si el email ya pertenece a otro usuario, responde HTTP 409 con el mensaje "Ya existe un usuario con ese email". 
  >   8. Actualiza únicamente los campos enviados. 
  >   9. Utiliza consultas PostgreSQL parametrizadas. 
  >  10. No incluyas password en la respuesta. 
  >  11. La respuesta exitosa debe ser HTTP 200 con el formato JSON estándar Success. 
  > Condiciones:
  >   • Mantener PUT sin cambios. 
  >   • No modificar endpoints existentes. 
  >   • Reutilizar AppError, catchAsync y errorHandler. 
  >   • Mantener separación entre rutas, controladores y middlewares. 
  >   • Crear una función independiente para actualización parcial. 
  >   • No realizar cambios en frontend. 
  >   • No ejecutar git add, git commit ni git push. 
  >   • Antes de cambiar archivos, presentar comportamiento, códigos HTTP, archivos, código, SQL parametrizado, payloads, pruebas y riesgos. 
  >   • Esperar aprobación antes de aplicar cambios. 
* **Resultado / Aplicación:** Antigravity realizó el análisis inicial. Se agregó controlador, middleware de validación y ruta PATCH. Se probaron casos 200, 400, 404 y 409. Posteriormente, el Scrum Master indicó que PATCH no se utilizará oficialmente por el momento y que se trabajará con PUT.

---

### 📅 14/08/2026 - Célula 1 (Conexión Frontend - API Backend de Jandry)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Antigravity / Next.js
* **Objetivo:** Configurar las variables de entorno en `.env.local` con `NEXT_PUBLIC_API_URL` apuntando a `http://localhost:5000` para habilitar el consumo End-to-End de la API de autenticación (`POST /api/auth/login`) desde la interfaz accesible y documentar la colección de pruebas en Postman.
* **Prompt exacto utilizado:**
  > "Configura el archivo .env.local en la raíz de Next.js definiendo NEXT_PUBLIC_API_URL=http://localhost:5000 para enlazar el consumo de peticiones POST fetch desde LoginForm.tsx hacia la API de Jandry, y proporciona la guía paso a paso para probar los endpoints POST /api/auth/login y GET /api/health en Postman."
* **Resultado / Aplicación:** Creación de `frontend/.env.local`, cambio de puerto del backend a 5000 para evitar conflictos y guía completa de consumo en Postman.

---

###   17/08/2026 - Célula 1 (Frontend & Accesibilidad - Lectura de Respuestas Backend con SpeechSynthesis y Atributos WCAG)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Google Stitch / Next.js
* **Objetivo:** Refinar los componentes de interfaz en Google Stitch incluyendo atributos explícitos de accesibilidad (aria-label, aria-live, aria-describedby, aria-expanded, role) e indicado>
* **Prompt exacto utilizado:**
  >  "Diseña y refina en Google Stitch componentes de UI accesibles para la plataforma OpenBlind en Next.js App Router y Tailwind CSS que incorporen estándares universales WCAG 2.1 Nivel AA:
  >   1. Atributos de Accesibilidad y Foco de Teclado: Todos los componentes interactivos (botones, enlaces, modales y campos de entrada) deben incluir atributos semánticos explícitos (aria-l>
  >   2. Lectura Parlante Nativa con window.speechSynthesis: Implementar una utilidad nativa en JavaScript de 3 líneas de código que reciba las respuestas HTTP y mensajes JSON devueltos por l>
  >      const utterance = new SpeechSynthesisUtterance(textoRespuestaBackend);
  >      utterance.lang = 'es-ES';
  >      window.speechSynthesis.speak(utterance);
  >   3. Integración en Flujos de Autenticación y Lector Adaptativo: Aplicar esta voz en el login al recibir respuestas del servidor y en el lector inteligente para la lectura continua sincro>
* **Resultado / Aplicación:** Registro del prompt en prompts.md, verificación de la función speakFeedback basada en window.speechSynthesis en LoginForm.tsx y LectorInteligentePage.tsx, e inte>

---

###   18/08/2026 - Célula 1 (Frontend & Accesibilidad - Flujo de Login Accesible con SpeechSynthesis y Navegación por Teclado)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad
* **Herramienta IA:** Antigravity / Next.js
* **Objetivo:** Culminar la implementación del flujo de Login accesible en Next.js, integrando los eventos de voz mediante la API nativa window.speechSynthesis (lectura hablada al recibir foc>
* **Prompt exacto utilizado:**
  >  "Steven continúa con la implementación del flujo de Login accesible en Next.js, integrando los eventos de voz (speechSynthesis) y la navegación por teclado."
* **Resultado / Aplicación:** Actualización completa de frontend/src/features/auth/components/LoginForm.tsx, integración de listeners onFocus que invocan speechSynthesis en español (es-ES), g>

---

###   19/08/2026 - Célula 2 (Script de Datos de Prueba Seed SQL & Colección Postman)
* **Autor:** Jandry / Aníbal Sarango
* **Rol / Célula:** Célula 2 - Backend & Base de Datos, potsman
* **Herramienta IA:** Antigravity / PostgreSQL
* **Objetivo:** Crear el script de población automatizada de base de datos (seed.js / seed.sql) con 7 usuarios de prueba de distintos roles y generar la colección oficial de Postman para prue>
* **Prompt exacto utilizado:**
  >  "Crea un script de automatización en Node.js (backend/src/config/seed.js) y un archivo SQL (backend/seed.sql) para poblar la base de datos PostgreSQL de OpenBlind con 7 usuarios de prueb>
* **Resultado / Aplicación:** Creación de backend/seed.sql y backend/src/config/seed.js, poblamiento exitoso de la base de datos y entrega de la colección de pruebas en Postman para el equipo.

---

###   20/08/2026 - Célula 1 (Conexión E2E de Login Accesible con API Backend y SpeechSynthesis)
* **Autor:** Steven Andrade
* **Rol / Célula:** Célula 1 - Frontend & Accesibilidad (Líder)
* **Herramienta IA:** Antigravity / Next.js / Express.js
* **Objetivo:** Lograr la integración End-to-End (E2E) completa del flujo de Login y Autenticación entre el Frontend (Next.js) y la API del Backend (Express + PostgreSQL), asegurando que la c>
* **Prompt exacto utilizado:**
  >  "Conectar el flujo del Login en Next.js consumiendo los datos reales de la API en el Backend (http://localhost:5000/api/auth/login). Validar que la voz del navegador (speechSynthesis) pr>
* **Resultado / Aplicación:**
    1. Conexión E2E funcional entre LoginForm.tsx y POST /api/auth/login.
    2. Implementación de respuestas estandarizadas con speechMessage en backend/src/index.js, backend/src/utils/AppError.js y backend/src/middlewares/errorHandler.js.
    3. Carga y reproducción automática del mensaje hablado mediante window.speechSynthesis.speak().
    4. Creación del script de datos de prueba backend/src/config/seed.js y backend/seed.sql con 7 usuarios de prueba.
    5. Compilación del proyecto (next build) verificada y exitosa.

---

###   28/08/2026 - Célula 1 (Cliente API Centralizado & Gestión JWT)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
* **Objetivo:** Implementar un cliente de API centralizado en TypeScript (lib/api.ts) para gestionar la URL base del Backend, el almacenamiento seguro de tokens JWT (openblind_token) en localStorage/sessionStorage y la inyección automatizada del encabezado HTTP Authorization: Bearer <token> en todas las peticiones protegidas.
* **Prompt exacto utilizado:**
  >  "Crea y optimiza el módulo helper /frontend/src/lib/api.ts en TypeScript para conectar el Frontend Next.js con el Backend Express/PostgreSQL de OpenBlind. Debe incluir:
  >   getApiBase() para obtener la URL base limpia evitando duplicaciones de la ruta /api.
  >   Funciones getAuthToken(), setAuthToken(token, remember) y removeAuthToken() para gestionar el token JWT en localStorage o sessionStorage.
  >   La función asíncrona fetchWithAuth(endpoint, options) que inyecte automáticamente Content-Type: application/json y Authorization: Bearer <token> en todas las peticiones a rutas protegidas, manejando de forma limpia respuestas JSON y caídas de servidor."

---

###   28/08/2026 - Célula 1 (Autenticación y Captura de Token JWT)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
* **Objetivo:** Conectar las pantallas de inicio de sesión (LoginForm.tsx) y registro (RegisterForm.tsx) con los endpoints /api/auth/login y /api/auth/register, capturando el token JWT devuelto, manejando contraseñas encriptadas con Bcryptjs y leyendo en voz alta la propiedad speechMessage para usuarios con discapacidad visual.
* **Prompt exacto utilizado:**
  >  "Actualiza los componentes LoginForm.tsx y RegisterForm.tsx en /frontend/src/features/auth/components para integrarlos con la API del Backend:
  >   En LoginForm.tsx, ejecuta la petición POST /api/auth/login con email y password. Al recibir una respuesta exitosa 200 OK, guarda el token JWT mediante setAuthToken(data.token, remember) y almacena la sesión del usuario.
  >   Lee y anuncia por altavoz la propiedad accesible speechMessage devuelta por el servidor usando speechSynthesis y actualiza la región aria-live.
  >   En RegisterForm.tsx, conecta el formulario con POST /api/auth/register enviando fullName, email y password, gestionando los códigos de estado 201 Created y 409 Conflict."

---

###   28/08/2026 - Célula 1 (Perfil de Usuario y Cambio de Contraseña)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
+ **Objetivo:** Conectar la pantalla Mi Perfil (/dashboard/perfil) con los endpoints del Backend para consultar los datos del usuario en PostgreSQL (GET /api/users/profile), actualizar nombre/correo (PUT /api/users/profile) y permitir el cambio seguro de contraseña (PUT /api/users/password).
* **Prompt exacto utilizado:**
  >  "Refactoriza la página de perfil /frontend/src/app/(app)/dashboard/perfil/page.tsx para conectar todos los formularios con la API del Backend utilizando fetchWithAuth:
  >   Al montar el componente, consulta GET /api/users/profile para cargar el nombre real, correo, fecha de registro y rol del usuario autenticado por JWT en PostgreSQL.
  >   En el modal de edición de perfil, conecta el envío del formulario a PUT /api/users/profile enviando { nombre, email }.
  >   En el modal de cambio de contraseña, conecta la acción a PUT /api/users/password enviando { actual, nueva } para que el backend valide la clave anterior con Bcryptjs y guarde el nuevo hash. Muestra notificaciones toast y retroalimentación de voz speechMessage ante éxitos o errores."

---

###   28/08/2026 - Célula 1 (Sincronización de Accesibilidad Universal)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
* **Objetivo:** Integrar el estado global de accesibilidad (AccessibilityContext.tsx) y la pantalla de configuración (/dashboard/accesibilidad) con PostgreSQL mediante los endpoints GET /api/accessibility y PUT /api/accessibility.
* **Prompt exacto utilizado:**
  >  "Conecta la gestión de accesibilidad de OpenBlind con la base de datos PostgreSQL:
  >   En AccessibilityContext.tsx, añade una función al montar el cliente para consultar GET /api/accessibility mediante fetchWithAuth. Mapea las columnas en formato snake_case de la BD (lector_pantalla, alto_contraste, modo_oscuro, texto_grande, velocidad_lectura, volumen, idioma, color_acento) a las propiedades del estado React en camelCase.
  >   En /dashboard/accesibilidad/page.tsx, actualiza la función handleSave para enviar un objeto formateado a PUT /api/accessibility mediante fetchWithAuth, logrando que las preferencias persistidas en la BD se apliquen de forma inmediata y se recuperen en cualquier dispositivo al iniciar sesión."

---

###   28/08/2026 - Célula 1 (Catálogo de Módulos, Favoritos y Progreso)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
* **Objetivo:** Conectar el catálogo principal de módulos (/dashboard/modulos) y la vista detallada de lecciones (/dashboard/modulos/[slug]) con la base de datos para recuperar lecciones con soporte JSONB, alternar estado de favoritos y registrar el porcentaje de progreso por usuario.
* **Prompt exacto utilizado:**
  >  "Integra las pantallas del catálogo de módulos con la API de Backend:
  >   En /dashboard/modulos/page.tsx, sustituye la llamada estática por GET /api/modulos usando fetchWithAuth. Combina el catálogo de 6 tarjetas con el progreso e indica si cada módulo es favorito del usuario autenticado.
  >   Actualiza la función toggleFavorite para invocar POST /api/modulos/:slug/favorito al presionar la estrella de favorito.
  >   En /dashboard/modulos/[slug]/page.tsx, añade la sincronización de avance llamando a POST /api/modulos/:slug/progreso con { progreso: 100 } al completar ejercicios interactivos (simulador Braille, cuestionarios WCAG y flashcards de atajos)."

---

###   28/08/2026 - Célula 1 (Lector Inteligente & Persistencia de Textos)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
* **Objetivo:** Vincular la biblioteca del Lector Inteligente (/dashboard/lector) con la tabla textos_lector de PostgreSQL a través de los endpoints GET, POST y DELETE en /api/lector/textos.
* **Prompt exacto utilizado:**
  >  "Añade persistencia en la base de datos para el Lector Inteligente en /frontend/src/app/(app)/dashboard/lector/page.tsx:
  >   Implementa el estado userTexts e invoca GET /api/lector/textos con fetchWithAuth al cargar la página para obtener los documentos almacenados del usuario.
  >   Crea la función handleSaveToBackend que capture el contenido y título de la lectura actual y envíe POST /api/lector/textos con { titulo, contenido, idioma }.
  >   Crea la función handleDeleteFromBackend para eliminar documentos de la biblioteca llamando a DELETE /api/lector/textos/:id.
  >   Mantén la ejecución local de la síntesis de voz con window.speechSynthesis y el resaltado dinámico de oraciones intactos."

---

###   28/08/2026 - Célula 1 (Panel Principal y Verificación de Salud del Sistema)
* **Autor:** Stevens
* **Rol / Célula:** Célula 1 - Frontend & Backend (Doer / Developer)
* **Herramienta IA:** Antigravity (Gemini 3.6 Flash / Pro)
* **Objetivo:** Conectar el Dashboard principal (/dashboard) y la página de aterrizaje (app/page.tsx) con las peticiones de perfil y la ruta de diagnóstico /api/health, asegurando una compilación TypeScript sin errores y un build de producción limpio en Next.js.
* **Prompt exacto utilizado:**
  >  "Finaliza la integración global del Frontend OpenBlind:
  >   En /dashboard/page.tsx, actualiza la función de carga inicial invocando GET /api/users/profile mediante fetchWithAuth para personalizar la tarjeta de saludo con el nombre real del usuario autenticado.
  >   En app/page.tsx, conecta la comprobación de estado al endpoint GET /api/health mediante getApiBase() mostrando la etiqueta de estado accesible.
  >   Ejecuta la verificación de tipos TypeScript (npx tsc --noEmit) y la compilación de producción Next.js (npm run build), solucionando cualquier error de firmas de funciones o tipos ausentes para garantizar 0 errores en build."

---
