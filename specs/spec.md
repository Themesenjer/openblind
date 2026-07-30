# Especificaciones Técnicas y Funcionales - OpenBlind

## 1. Introducción y Propósito
OpenBlind es una solución tecnológica modular diseñada para garantizar la accesibilidad visual de usuarios con discapacidad visual o baja visión en entornos digitales.

---

## 2. Historias de Usuario (Casos de Uso)

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

## 3. Requisitos Funcionales (RF) y Contrato de API

### 3.1 Requisitos Funcionales
* **RF-01:** Autenticación e inicio de sesión adaptativo.
* **RF-02:** Interfaz navegable por lectores de pantalla y comandos de voz.
* **RF-03:** Gestión y consulta de módulos principales de OpenBlind.

### 3.2 Contrato de API (Endpoints Básicos)

#### 🔑 1. Autenticación (Auth)
* **POST `/api/auth/login`**
  * **Petición (Frontend envía):**
    ```json
    {
      "email": "usuario@openblind.com",
      "password": "miPasswordSeguro"
    }
    ```
  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
      "user": {
        "id": 1,
        "nombre": "Juan Pérez",
        "rol": "estudiante"
      }
    }
    ```

#### 👤 2. Gestión de Usuarios
* **GET `/api/users/profile`** *(Requiere Token)*
  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "usuario@openblind.com",
      "preferencias": {
        "altoContraste": true,
        "velocidadVoz": 1.2
      }
    }
    ```

#### 📚 3. Módulos del Sistema
* **GET `/api/modules`**
  * **Respuesta Esperada (Backend devuelve 200 OK):**
    ```json
    [
      {
        "id": 101,
        "titulo": "Módulo de Accesibilidad Teclado",
        "descripcion": "Atajos de teclado y navegación rápida",
        "completado": false
      }
    ]
    ```

---

## 4. Requisitos No Funcionales (RNF)

* **RNF-01: Accesibilidad Universal (WCAG 2.1 - Nivel AA)**  
  El sistema debe cumplir estrictamente con las pautas de accesibilidad para contenido web, garantizando navegación completa mediante teclado, alto contraste de elementos visuales y compatibilidad con lectores de pantalla (NVDA, TalkBack, VoiceOver).

* **RNF-02: Rendimiento y Tiempo de Respuesta**  
  Las peticiones del cliente hacia la API del Backend deben responder en un tiempo medio menor a 500 ms en condiciones normales de red, garantizando una respuesta fluida mediante síntesis de voz.

* **RNF-03: Compatibilidad e Integración**  
  La arquitectura modular debe permitir la integración fluida entre los componentes de Frontend y Backend, manteniendo una separación clara de responsabilidades para facilitar el mantenimiento.

* **RNF-04: Seguridad y Privacidad**  
  Las credenciales e información de usuario procesadas en el módulo de autenticación deben transmitirse mediante canales cifrados (HTTPS) y no almacenarse en texto plano.

