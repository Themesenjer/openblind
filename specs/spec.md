# Especificaciones Técnicas y Funcionales - OpenBlind

## 1. Introducción y Propósito
OpenBlind es una solución tecnológica modular diseñada para garantizar la accesibilidad visual de usuarios con discapacidad visual o baja visión en entornos digitales.

---

## 2. Trabajo de concientización “ponte en sus zapatos”
Este ejercicio proporciona un feetback con referencia a las necesidades que puede tener una persona con discapacidad visual al momento de interactuar con un dispositivo electrónico como celulares y computadoras, por eso el equipo de openblind hizo un trabajo de concientización poniéndonos en situación de personas con esta discapacidad para destacar los puntos mas importantes a tener en cuenta al momento de desarrollar este proyecto.
* Las personas con discapacidad visual se les es imposible acceder a un dispositivo electrónico o interactuar con este sin ayuda previa
* El texto en pantalla puede no ser accesible si no es compatible con lectores de pantalla.
* Imágenes, fotografías, gráficos, mapas, capturas de pantalla o videos pueden no proporcionar información equivalente mediante audio o texto.
* Gestos como deslizar, mantener presionado, arrastrar o tocar elementos pequeños pueden ser difíciles de ejecutar.
* Una pantalla táctil no proporciona referencias físicas que permitan saber dónde está cada elemento.
* Escribir en un teclado táctil puede ser más complicado porque las teclas no tienen referencias físicas, para esto se necesita teclados en braille pero son difíciles de conseguir.
* Si no existe retroalimentación sonora o háptica, el usuario puede no saber si una acción fue realizada correctamente. 
* La persona necesita información alternativa mediante audio, texto o interfaces accesibles.
* Aplicaciones que requieren apuntar la cámara hacia un objeto pueden ser difíciles de utilizar si no proporcionan orientación auditiva o háptica.
* Cualquier actividad requeriría asistencia por lo cual la automatización por voz seria esencial para el proyecto 

---

## 3. Historias de Usuario (Casos de Uso)

### HU-01: Autenticacion por voz o teclado
* **Como:** Usuario con discapacidad visual.
* **Quiero:** Iniciar sesión mediante comandos de voz o accesos directos de teclado.
* **Para:** Acceder a la plataforma de forma autónoma sin depender de asistencia externa.

### HU-02: Lectura Adaptativa de Módulos
* **Como:** Usuario con baja visión.
* **Quiero:** Que la interfaz ajuste automáticamente el contraste y el lector de pantalla procese el contenido clave.
* **Para:** Navegar por los módulos del sistema de manera cómoda y sin fatiga visual.

### HU-03: Descripción automática de contenido 
* **Como:** usuario con discapacidad visual
* **Quiero:** recibir descripciones automáticas de imágenes y elementos visuales
* **Para:** comprender la información presentada en pantalla.

### HU-04: Asistencia mediante voz
* **Como:** usuario con discapacidad visual,
* **Quiero:** controlar la aplicación mediante comandos de voz,
* **Para:** interactuar con mayor facilidad.

### HU-05: Perfil de accesibilidad
* **Como:** usuario registrado
* **Quiero:** guardar mis preferencias de accesibilidad
* **Para:** no configurarlas cada vez que utilice la plataforma.

### HU-06: Gestión de módulos
* **Como:** administrador
* **Quiero:** habilitar o deshabilitar módulos de accesibilidad
* **Para:** adaptar la solución a las necesidades de cada organización.

### HU-07: Evaluación de accesibilidad
* **Como:** administrador de un sitio web
* **Quiero:** analizar automáticamente el nivel de accesibilidad de las páginas
* **Para:** identificar incumplimientos de estándares.

### HU-08: Integración mediante API
* **Como:** desarrollador
* **Quiero:** integrar OpenBlind mediante APIs
* **Para:** incorporar funcionalidades de accesibilidad en aplicaciones externas.

### HU-09: Escalabilidad modular
* **Como:** administrador del sistema
* **Quiero:** incorporar nuevos módulos sin modificar la arquitectura principal
* **Para:** mantener una solución flexible y escalable.

---

## 4. Solicitud de Documentación Técnica y Manuales de Usuario: Módulos de Accesibilidad y Perfil en OpenBlind (Frontend)

elaborar la documentación técnica, las guías de arquitectura y el manual de usuario final para las nuevas pantallas y sistemas adaptativos implementados en el frontend de la plataforma *OpenB>
A continuación se detallan las especificaciones técnicas, componentes modificados/creados y requerimientos funcionales:

### 1.  Resumen de Cambios e Implementaciones

Se han integrado dos nuevos módulos principales en el dashboard adaptativo:
1. **Configuración de Accesibilidad (/dashboard/accesibilidad):** Panel interactivo para personalizar la experiencia de navegación (lector de pantalla, alto contraste, modo oscuro, texto gran>
2. **Mi Perfil (/dashboard/perfil):** Vista interactiva del perfil de usuario con estadísticas de aprendizaje, modales de edición de datos y cambio de contraseña con medidor de fortaleza de c>
3. **Remoción de Vistas obsoletas:** Se eliminó de la interfaz cualquier referencia o botón de "Vista de usuario" / "Vista admin".
4. **Estabilidad de Layout (Zero Layout Shift):** Mantenimiento de la barra lateral fija (w-64) para asegurar navegabilidad continua sin saltos de interfaz.

### 2.  Arquitectura Técnica y Estado Global

#### Componentes y Archivos Clave:
* **src/features/accessibility/AccessibilityContext.tsx:** Provider global que administra el estado de accesibilidad, la persistencia en localStorage (openblind_accessibility_settings) y la i>
* **src/app/globals.css:** Hoja de estilos globales enriquecida con variantes personalizadas:
   - @custom-variant dark: Desacopla el modo oscuro de la preferencia del SO y lo vincula estrictamente a la clase .dark.
   - html.high-contrast: Fuerza fondo negro puro (#000000), fuentes blancas (#ffffff) y bordes/enfoque en amarillo vivo (#facc15).
   - html.large-text: Escala tipográfica base (font-size: 118%).
   - html.keyboard-nav: Anillos de enfoque mejorados para navegación con teclado (:focus-visible).
   - html[data-accent="..."]: Sobrescritura dinámica del color de acento primario (Azul, Verde, Violeta, Naranja).
* **src/app/(app)/dashboard/accesibilidad/page.tsx:** Pantalla principal de ajustes de accesibilidad.
* **src/app/(app)/dashboard/perfil/page.tsx:** Pantalla de gestión de perfil e interacción.
* **src/components/dashboard/VoiceCommandButton.tsx:** Botón flotante y listener de comandos por voz sincronizado con el contexto global.
* **src/components/layout/Sidebar.tsx:** Menú de navegación fijo adaptativo.

### 3. ⚙️Especificaciones Funcionales por Módulo

#### A. Módulo de Accesibilidad (/dashboard/accesibilidad)
* **Lector de Pantalla:** Activa/desactiva las locuciones sonoras y retroalimentación auditiva en tiempo real.
* **Modo Alto Contraste:** Conmuta la clase .high-contrast garantizando contraste máximo según norma WCAG 2.1 AA.
* **Modo Oscuro:** Alterna el tema visual entre claro y oscuro mediante la clase .dark.
* **Texto Grande:** Ajusta la escala de fuente global mediante .large-text.
* **Comandos de Voz:** Muestra/oculta el listener de voz flotante (Alt + V).
* **Navegación por Teclado:** Intensifica los anillos de enfoque en botones e insumos interactivos.
* **Audio y Voz:**
   - Velocidad de Lectura: Slider de 0.5x a 2.0x (Valor por defecto: 1.2x).
   - Volumen: Slider de 0% a 100% (Valor por defecto: 80%).
* **Idioma del Lector:** Tarjetas seleccionables para es-ES (España), es-MX (México), en-US (Estados Unidos) y pt-BR (Brasil).
* **Color de Acento:** Selección dinámica entre Azul (#2563eb), Verde (#16a34a), Violeta (#9333ea) y Naranja (#ea580c).
* **Acciones:** Botones "Guardar cambios" y "Restablecer" con avisos por voz y notificaciones toast.
#### B. Módulo Mi Perfil (/dashboard/perfil)
* **Cabecera de Avatar:** Iniciales del usuario (do / C), botón para editar avatar e insignia de "Usuario verificado".
* **Tarjetas de Datos:** Nombre Completo (Carlos), Correo Electrónico (carlos@openblind.app), Fecha de Registro (15 de enero, 2025) y Rol (Usuario estándar).
* **Modal Editar Perfil:** Formulario modal para actualizar nombre y correo en tiempo real con validación y confirmación auditiva.
* **Modal Cambiar Contraseña:** Campo de clave con conmutador para ver/ocultar texto y medidor dinámico de fortaleza (Débil, Media, Fuerte).
* **Estadísticas de Aprendizaje:** Indicadores interactivos de módulos completados (12/15), horas de lectura adaptativa con racha activa ( M-% 5 días seguidos) y comandos de voz ejecutados (8>

### 4.  Cumplimiento de Estándares de Accesibilidad (WCAG 2.1 AA)
Por favor destacar en el manual los siguientes aspectos de accesibilidad implementados:
1. **Regiones en vivo (aria-live="polite" / assertive)**: Notificaciones en segundo plano leídas automáticamente por software lector de pantalla (NVDA, VoiceOver, JAWS).
2. **Atajos globales de teclado:** Soporte para Alt + V (Comandos de voz), Escape (Cerrar modales) y Tab con foco amarillo visible.
3. **Contrastes de Color:** Verificados ratios de contraste mayores a 7:1 en modo alto contraste.

### 5.  Guía de Pruebas y Validación (QA)
Solicitamos incluir los siguientes escenarios en el plan de pruebas:
* **Prueba 1:** Navegar a /dashboard/accesibilidad desde el menú lateral y verificar que no ocurra ningún salto visual (layout shift).
* **Prueba 2:** Activar y desactivar el Modo Oscuro en un sistema operativo con tema oscuro activo, verificando que responda únicamente al interruptor de la app.
* **Prueba 3:** Seleccionar el color de acento Verde o Violeta y confirmar que los botones e indicadores en toda la app cambien inmediatamente de color.
* **Prueba 4:** Navegar a /dashboard/perfil, abrir el modal "Editar perfil", guardar cambios y validar que se emita la locución sonora y la notificación toast.
* **Prueba 5:** Probar el modal "Cambiar contraseña" introduciendo claves cortas e inseguras para verificar el medidor de fortaleza.

---

## 5. Requisitos Funcionales (RF) y Contrato de API

### 5.1 Requisitos Funcionales
* **RF-01:** Autenticación e inicio de sesión adaptativo.
* **RF-02:** Interfaz navegable por lectores de pantalla y comandos de voz.
* **RF-03:** Gestión y consulta de módulos principales de OpenBlind.

### 5.2 Contrato de API (Endpoints Básicos)

#### 🔑 1. Autenticación (Auth)
* **POST `http://localhost:3000/api/auth/login`**
  * **Petición (Frontend envía):**
    ```json
    {
      "email": "prueba@openblind.com",
      "password": "123"
     
    }
     ```

  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
    {  
        "status": "Success",
        "message": "Operación realizada correctamente.",
        "speechMessage": "Inicio de sesión exitoso. Bienvenido, Usuario Prueba.",
        "data": {
        "id": 1,
        "nombre": "Usuario Prueba",
        "email": "prueba@openblind.com",
        "rol": "user",
        "creado_en": "2026-08-06T02:43:28.773Z"
              
      }
    }
    ```

  * **Respuesta de Error**
           • 400 Bad Request: "Email y contraseña son obligatorios"
           • 401 Unauthorized: "Credenciales inválidas, el usuario no existe" / "Credenciales inválidas, contraseña incorrecta"


* **POST `http://localhost:3000/api/users`**
  * **Petición (Frontend envía):**
 
    ```json
    {
      "nombre": "Valentina Vega",
      "email": "valentina@openblind.com",
      "password": "123456",
      "rol": "usuario" 
    }
    ```
  * **Respuesta Esperada (Backend devuelve 200 OK):**

     ```json
    {
        "status": "Success",
         "speeechMessage": "Usuario creado correctamente",
           "data": {
             "id": 8,
            "nombre": "Valentina Vega",
           "email": "vale@openblind.com",
           "rol": "usuario",
             "creado_en": "2026-08-06T02:43:28.773Z"              
      }
     }
     ```

  * **Respuesta de Error** 
           • 400 Bad Request: "Nombre, email y password son obligatorios"
           • 409 Conflict: "Ya existe un usuario con ese correo electrónico"


* **POST `https://moistness-letter-strainer.ngrok-free.dev/api/auth/login`**
  * **Petición (Frontend envía):**
      ```json
      {
         "email": "valentina.actualizada@openblind.com",
         "password": "123456"
      }
      ```

  * **Respuesta Esperada (Backend devuelve 200 OK):**

      ```json
      {
         "status": "Success",
         "message": "Inicio de sesión exitoso",
         "speechMessage": "Bienvenido Valentina Vega. Inicio de sesión exitoso. Redirigiendo a tu panel de control.",
         "user": {
         "id": 25,
         "nombre": "Valentina Vega",
         "email": "valentina.actualizada@openblind.com",
         "rol": "usuario",
         "creado_en": "2026-08-07T00:52:48.148Z"
         }

      }
      ```


#### 👤 2. Gestión de Usuarios

* **PUT `http://localhost:3000/api/users/8`**
  * **Body de la petición (JSON):**

    ```json
        {

           "nombre": "Valentina Vega",
           "email": "valentinaactualizada@openblind.com",
           "password": "123456",
           "rol": "administrador"
        }
        ```

  * **Respuesta del servidor (JSON}:200 OK):**
 
    ```json
        {
           "status": "Success",
           "speechMessage": "Usuario actualizado correctamente",
           "data": {
           "id": 8,
           "nombre": "Valentina Vega Actualizada",
           "email": "valentina.actualizada@openblind.com",
           "rol": "administrador",
           "creado_en": "2026-08-06T02:43:28.773Z"
          }
        }
        ```


  * **Respuesta de Error**
           • 400 Bad Request: "Nombre y email son obligatorios"
           • 404 Not Found: "Usuario no encontrado para actualizar"


* **PUT `http://localhost:3000/api/users/8`**
  * **Body de la petición (JSON):**

    ```json
        {         
           "currentPassword": "123456",
           "newPassword": "456789"
        
        }
        ```
  * **Respuesta del servidor (JSON:200 OK):**


    ```json
        {
           "status": "Success",
           "speechMessage": "La contraseña del usuario Valentina Vega ha sido actualizada con éxito."
        }
        ```


  * **Respuestas de Error:**
           • 400 Bad Request: "La contraseña actual y la nueva contraseña son obligatorias"
           • 401 Unauthorized: "La contraseña actual es incorrecta"
           • 404 Not Found: "Usuario no encontrado"



#### 📚 3. Módulos del Sistema
* **GET `http://localhost:3000/api/users/8`**
  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
        {
           "status": "Success",
           "speechMessage": "mostrando informacion de  Valentina Vega.",
           "data": {
           "id": 8,
           "name": "Valentina Vega Actualizada",
           "email": "valentina.actualizada@openblind.com",
           "role": "admin",
           "created_at": "2026-08-21T13:55:00.000Z"
          
           }
        }
        ```

* **GET `http://localhost:3000/api/users/9`**
  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
        {
           "status": "Success",
           "speechMessage": "mostrando informacion de Pedro Gomez.",
           "data": {
           "id": 9,
           "nombre": "Pedro Gómez",
           "email": "pedro@openblind.com",
           "rol": "admin",
           "creado_en": "2026-07-31T23:03:12.245Z"
           }
        }
        ```
  * **Error(404 Not Found):**
       "usuario no encontrado"

* **DELETE `http://localhost:3000/api/users/9`**
  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
        {
           "status": "Success",
           "speechMessage": "El usuario Valentina Vega fue eliminado con éxito.",
           "data": {
           "id": 8,
           "name": "Valentina Vega",
           "email": "valentina@openblind.com",
           "role": "user"
           }
        }
        ```
  * **Error (404 Not Found):** 
       "Usuario no encontrado para eliminar"


---

## 6. Requisitos No Funcionales (RNF)

* **RNF-01: Accesibilidad Universal (WCAG 2.1 - Nivel AA)**  
  El sistema debe cumplir estrictamente con las pautas de accesibilidad para contenido web, garantizando navegación completa mediante teclado, alto contraste de elementos visuales y compatibilidad con lectores de pantalla (NVDA, TalkBack, VoiceOver).

* **RNF-02: Rendimiento y Tiempo de Respuesta**  
  Las peticiones del cliente hacia la API del Backend deben responder en un tiempo medio menor a 500 ms en condiciones normales de red, garantizando una respuesta fluida mediante síntesis de voz.

* **RNF-03: Compatibilidad e Integración**  
  La arquitectura modular debe permitir la integración fluida entre los componentes de Frontend y Backend, manteniendo una separación clara de responsabilidades para facilitar el mantenimiento.

* **RNF-04: Seguridad y Privacidad**  
  Las credenciales e información de usuario procesadas en el módulo de autenticación deben transmitirse mediante canales cifrados (HTTPS) y no almacenarse en texto plano.

