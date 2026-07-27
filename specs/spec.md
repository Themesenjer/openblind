
## 4. Requisitos No Funcionales (RNF)

* **RNF-01: Accesibilidad Universal (WCAG 2.1 - Nivel AA)**  
  El sistema debe cumplir estrictamente con las pautas de accesibilidad para contenido web, garantizando navegación completa mediante teclado, alto contraste de elementos visuales y compatibilidad con lectores de pantalla (NVDA, TalkBack, VoiceOver).

* **RNF-02: Rendimiento y Tiempo de Respuesta**  
  Las peticiones del cliente hacia la API del Backend deben responder en un tiempo medio menor a 500 ms en condiciones normales de red, garantizando una respuesta fluida mediante síntesis de voz.

* **RNF-03: Compatibilidad e Integración**  
  La arquitectura modular debe permitir la integración fluida entre los componentes de Frontend y Backend, manteniendo una separación clara de responsabilidades para facilitar el mantenimiento.

* **RNF-04: Seguridad y Privacidad**  
  Las credenciales e información de usuario procesadas en el módulo de autenticación deben transmitirse mediante canales cifrados (HTTPS) y no almacenarse en texto plano.

