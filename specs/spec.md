# Especificaciones Técnicas y Funcionales - OpenBlind

## 1. Introducción y Propósito
OpenBlind es una solución tecnológica modular diseñada para garantizar la accesibilidad visual de usuarios con discapacidad visual o baja visión en entornos digitales.

---

## 2. Historias de Usuario (Casos de Uso)

### HU-01: Autenticación por Voz o Teclado
* **Como:** Usuario con discapacidad visual.
* **Quiero:** Iniciar sesión mediante comandos de voz o accesos directos de teclado.
* **Para:** Acceder a la plataforma de forma autónoma sin depender de asistencia externa.

### HU-02: Lectura Adaptativa de Módulos
* **Como:** Usuario con baja visión.
* **Quiero:** Que la interfaz ajuste automáticamente el contraste y el lector de pantalla procese el contenido clave.
* **Para:** Navegar por los módulos del sistema de manera cómoda y sin fatiga visual.

### HU-03: historia de usuario 3

---

## 3. Requisitos Funcionales (RF)
*(Borrador en proceso por Célula 3)*
* **RF-01:** Autenticación e inicio de sesión adaptativo.
* **RF-02:** Interfaz navegable por lectores de pantalla y comandos de voz.
* **RF-03:** Gestión y consulta de módulos principales de OpenBlind.

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

