# 📜 Documentación de Gobernanza y Contratos de API - OpenBlind

**Célula:** Célula 3 - Gobernanza, Pruebas y Especificaciones  
**Responsable:** Luis Mejía  
**Proyecto:** OpenBlind - Plataforma Accesible  
**Versión de API:** 1.0.0  
**URL Base (Desarrollo):** `http://localhost:3000/api`  
**Estándar de Accesibilidad:** WCAG 2.1 Nivel AA (Soporte nativo para síntesis de voz mediante `speechMessage`)

---

## 🏛️ 1. Visión General de Gobernanza

Este documento establece la especificación OpenAPI/JSON para los endpoints de la API de OpenBlind. Todos los endpoints deben retornar la propiedad **`speechMessage`** en sus respuestas JSON (tanto en éxitos como en errores), para que la interfaz adaptativa del Frontend (Next.js) pueda reproducir en voz alta la respuesta mediante la Web Speech API (`window.speechSynthesis`).

---

## 🗄️ 2. Modelo de Datos en PostgreSQL

### Tabla: `usuarios`

| Columna | Tipo de Dato | Restricciones | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Identificador único incremental |
| `nombre` | `VARCHAR(150)` | `NOT NULL` | Nombre completo del usuario |
| `email` | `VARCHAR(150)` | `UNIQUE`, `NOT NULL` | Correo electrónico principal |
| `password` | `VARCHAR(255)` | `NOT NULL` | Clave de acceso |
| `rol` | `VARCHAR(50)` | `DEFAULT 'usuario'` | Rol de acceso (`usuario`, `administrador`) |
| `creado_en` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Fecha y hora de creación |

---

## 🔗 3. Contratos de Endpoints de Autenticación (`/api/auth`)

### 3.1. `POST /api/auth/login`
Autentica las credenciales de un usuario existente.

* **Headers:** `Content-Type: application/json`
* **Cuerpo de Petición (Request Body):**
  ```json
  {
    "email": "pablo@openblind.org",
    "password": "password123"
  }
  ```

* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "status": "Success",
    "message": "Inicio de sesión exitoso",
    "speechMessage": "Bienvenido Pablo Reyes. Inicio de sesión exitoso. Redirigiendo a tu panel de control.",
    "user": {
      "id": 1,
      "nombre": "Pablo Reyes",
      "email": "pablo@openblind.org",
      "rol": "administrador",
      "creado_en": "2026-08-21T18:40:00.000Z"
    }
  }
  ```

* **Respuestas de Error:**
  * **`400 Bad Request` (Campos Faltantes):**
    ```json
    {
      "status": "Error",
      "message": "Email y contraseña son obligatorios",
      "speechMessage": "Por favor ingresa tu correo electrónico y contraseña para continuar."
    }
    ```
  * **`401 Unauthorized` (Usuario Inexistente o Clave Incorrecta):**
    ```json
    {
      "status": "Error",
      "message": "Credenciales inválidas (Contraseña incorrecta)",
      "speechMessage": "Credenciales incorrectas. La contraseña ingresada no es válida."
    }
    ```

---

### 3.2. `POST /api/auth/register`
Registra un nuevo usuario en la base de datos PostgreSQL.

* **Headers:** `Content-Type: application/json`
* **Cuerpo de Petición (Request Body):**
  ```json
  {
    "fullName": "Steven Andrade",
    "email": "steven@openblind.org",
    "password": "Password123!"
  }
  ```

* **Respuesta Exitosa (`201 Created`):**
  ```json
  {
    "status": "Success",
    "message": "Usuario registrado exitosamente",
    "speechMessage": "Cuenta creada exitosamente para Steven Andrade. Ya puedes iniciar sesión.",
    "user": {
      "id": 8,
      "nombre": "Steven Andrade",
      "email": "steven@openblind.org",
      "rol": "usuario",
      "creado_en": "2026-08-21T18:45:00.000Z"
    }
  }
  ```

* **Respuestas de Error:**
  * **`400 Bad Request` (Datos Incompletos):**
    ```json
    {
      "status": "Error",
      "message": "Nombre, email y contraseña son obligatorios",
      "speechMessage": "Por favor completa todos los campos requeridos para el registro."
    }
    ```
  * **`409 Conflict` (Email Duplicado):**
    ```json
    {
      "status": "Error",
      "message": "Ya existe un usuario con este email",
      "speechMessage": "Ya existe una cuenta registrada con este correo electrónico."
    }
    ```

---

### 3.3. `POST /api/auth/forgot-password`
Solicita el restablecimiento de contraseña para una cuenta registrada.

* **Headers:** `Content-Type: application/json`
* **Cuerpo de Petición (Request Body):**
  ```json
  {
    "email": "steven@openblind.org"
  }
  ```

* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "status": "Success",
    "message": "Instrucciones de recuperación enviadas",
    "speechMessage": "Se han enviado las instrucciones de recuperación al correo steven@openblind.org.",
    "data": {
      "email": "steven@openblind.org"
    }
  }
  ```

* **Respuestas de Error:**
  * **`404 Not Found` (Correo No Registrado):**
    ```json
    {
      "status": "Error",
      "message": "Usuario no encontrado",
      "speechMessage": "No encontramos ninguna cuenta registrada con el correo proporcionado."
    }
    ```

---

## 👥 4. Contratos de Gestión de Usuarios (`/api/users`)

### 4.1. `GET /api/users`
Obtiene la lista completa de usuarios registrados.

* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "status": "Success",
    "total": 2,
    "data": [
      {
        "id": 1,
        "nombre": "Pablo Reyes",
        "email": "pablo@openblind.org",
        "rol": "administrador",
        "creado_en": "2026-08-21T18:40:00.000Z"
      }
    ]
  }
  ```

### 4.2. `GET /api/users/:id`
Consulta los detalles de un usuario específico por su ID.

* **Respuesta Exitosa (`200 OK`):**
  ```json
  {
    "status": "Success",
    "data": {
      "id": 1,
      "nombre": "Pablo Reyes",
      "email": "pablo@openblind.org",
      "rol": "administrador",
      "creado_en": "2026-08-21T18:40:00.000Z"
    }
  }
  ```

* **Respuesta de Error (`404 Not Found`):**
  ```json
  {
    "status": "Error",
    "message": "Usuario no encontrado",
    "speechMessage": "Usuario no encontrado"
  }
  ```

---

## 📋 5. Resumen de Códigos HTTP Estandarizados

| Código HTTP | Significado | Uso en OpenBlind |
| :--- | :--- | :--- |
| **`200 OK`** | Éxito | Login exitoso, recuperación enviada, consulta de usuarios |
| **`201 Created`** | Creado | Registro de usuario exitoso en PostgreSQL |
| **`400 Bad Request`** | Petición Inválida | Campos faltantes o formato incorrecto |
| **`401 Unauthorized`** | No Autorizado | Credenciales o contraseña incorrectas |
| **`404 Not Found`** | No Encontrado | Usuario o recurso no existe en la base de datos |
| **`409 Conflict`** | Conflicto | Intento de registrar un correo que ya existe |
| **`500 Internal Server Error`** | Error de Servidor | Fallo en la conexión con la BD o excepción no controlada |
