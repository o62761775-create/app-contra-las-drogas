# ESPECIFICACIÓN DE ARQUITECTURA DE SOFTWARE (SAD)

## Proyecto: Plataforma Interactiva "Videojuegos contra las Drogas"

**Documento:** Software Architecture Document (IEEE Std 1016 / ISO/IEC/IEEE 42010)

**Autores:** Heidy Zarai Yance Pariona, Zahory Victoria Palomino Moron

**Tecnologías:** Node.js, Express.js, SQLite3, HTML5/JS Vanilla, OpenAI API

**Versión:** 1.0.0

**Fecha:** 28 de octubre de 2026

**Estado:** Aprobado para Fase de Construcción

---

## 1. Visión General de la Arquitectura

El sistema **"Videojuegos contra las Drogas"** utiliza un patrón de **Arquitectura en Capas (Layered Architecture)** acoplado a un enfoque de **Servicios Desacoplados de Integración** para comunicarse con servicios de inteligencia artificial de terceros (OpenAI API).

El objetivo arquitectónico prioritario es mantener un sistema ultraligero, altamente portable y sin dependencias complejas de infraestructura, garantizando la ejecución multiplataforma (PWA/Responsive Web) con protección estricta de privacidad.

```
+---------------------------------------------------------------------------------+
|                                CAPA DE CLIENTE                                  |
|  [ Web Browser / Mobile / PC / Console Browser ]                               |
|  - HTML5 UI Layout + CSS Custom Variables (Visual Identity)                     |
|  - HTML5 Canvas 2D Game Loop Engine                                             |
|  - API Controller (Fetch Client / Async Communication)                          |
+----------------------------------------+----------------------------------------+
                                         |
                                HTTP/HTTPS Request (JSON)
                                         v
+---------------------------------------------------------------------------------+
|                              CAPA DE APLICACIÓN                                 |
|  [ Node.js + Express REST API Server ]                                          |
|                                                                                 |
|  +------------------------+  +----------------------+  +---------------------+  |
|  |  Security Middleware   |  |   API Controllers    |  |   Service Layer     |  |
|  | - Helmet HTTP Headers  |  | - AyudaController    |  | - OpenAiService     |  |
|  | - CORS Policy          |  | - DirectorioControl  |  | - SQLite DataMapper |  |
|  | - Express RateLimiter  |  | - JuegoStatsControl  |  |                     |  |
|  +------------------------+  +----------------------+  +---------------------+  |
+-----------------------------------+---------------------------------------------+
                                    |
                    +---------------+---------------+
                    |                               |
        SQL Queries (sqlite3)              HTTPS REST API (OpenAI)
                    v                               v
+-----------------------------------+   +-----------------------------------------+
|        CAPA DE PERSISTENCIA       |   |            SERVICIO EXTERNO             |
|  [ SQLite3 Engine ]               |   |  [ OpenAI ChatGPT Engine ]              |
|  - File: /database.sqlite         |   |  - System Prompt Context Enforcement    |
|  - Relational Schema              |   |  - Real-time Guidance Processing        |
+-----------------------------------+   +-----------------------------------------+
```

---

## 2. Descripción de Capas del Sistema

### 2.1 Capa de Presentación (Frontend)

* **Tecnología:** HTML5 Semantic Markup, CSS3 Native Tokens/Variables, JavaScript Vanilla (ES6+).
* **Responsabilidad:** Renderizado de interfaz gráfica de usuario (UI), ejecución interactiva de los videojuegos en elemento `<canvas>`, captura anónima de formularios y envío asíncrono vía `fetch()`.
* **Despliegue:** Archivos estáticos servidos directamente por el middleware `express.static()` desde Node.js.

### 2.2 Capa de Dominio / Aplicación (Backend)

* **Tecnología:** Node.js v18+ LTS, Express.js Framework.
* **Responsabilidad:** Orquestación de peticiones HTTP, sanitización de entradas, enrutamiento REST (`/api/*`), consumo seguro de servicios externos (OpenAI API Key mediante variables de entorno) y aplicación de reglas de negocio.
* **Manejo de Errores:** Interceptor centralizado de excepciones con respuestas estandarizadas HTTP (201, 400, 500).

### 2.3 Capa de Persistencia (Base de Datos)

* **Tecnología:** SQLite3 (Motor de base de datos relacional basado en archivo único `database.sqlite`).
* **Responsabilidad:** Almacenamiento persistente de solicitudes de ayuda anonimizadas, registros de la guía telefónica de emergencia y métricas lúdicas desasociadas de identidad.
* **Modo de Operación:** Conexión persistente mediante controlador asíncrono con *WAL Mode* (Write-Ahead Logging) para optimizar concurrencia de lectura/escritura.

---

## 3. Flujos de Integración y Diagramas de Secuencia

### 3.1 Flujo: Procesamiento de Solicitud de Ayuda con ChatGPT API

```
Actor: Usuario        Frontend (Client)        Backend (Node/Express)        SQLite DB        OpenAI API
     |                        |                          |                       |                 |
     |-- Envia Formulario --->|                          |                       |                 |
     |   (nombre,edad,msg)    |-- POST /api/solicitudes->|                       |                 |
     |                        |   (JSON Payload)         |-- Validar Payload --->|                 |
     |                        |                          |-- Aplicar SystemPrompt----------------->|
     |                        |                          |   + Mensaje de Usuario|                 |
     |                        |                          |<-- Respuesta Orientativa----------------|
     |                        |                          |-- Insertar Registro ->|                 |
     |                        |                          |   (solicitudes_ayuda) |                 |
     |                        |                          |<-- SQL OK ------------|                 |
     |                        |<-- HTTP 201 Created -----|                       |                 |
     |<-- Renderiza Respuesta-|    (Respuesta JSON)      |                       |                 |
```

---

## 4. Matriz de Componentes del Sistema

| Componente | Archivo / Módulo | Responsabilidad |
| :--- | :--- | :--- |
| **Server Entrypoint** | `server.js` | Inicialización del servidor HTTP Express y enlace de rutas. |
| **Database Config** | `config/database.js` | Inicialización de SQLite y ejecución automatizada de scripts DDL. |
| **Ayuda Controller** | `src/controllers/ayuda.controller.js` | Gestión del ciclo de vida de peticiones `/api/solicitudes-ayuda`. |
| **OpenAI Service** | `src/services/openai.service.js` | Cliente REST HTTP a la API de OpenAI con inyección de *System Prompt*. |
| **Security Middleware** | `src/middleware/rateLimiter.js` | Restricción de tasa de peticiones (10 req/min por cliente IP). |
| **Canvas Engine** | `public/js/game.js` | Motor de físicas y ciclo de renderizado de videojuegos en HTML5. |
| **UI Design System** | `public/css/styles.css` | Aplicación de especificación cromática y reglas visuales PWA. |

---

## 5. Estrategia de Seguridad, Rendimiento y Despliegue

### 5.1 Seguridad y Privacidad

1. **Aislamiento de API Keys:** La propiedad `OPENAI_API_KEY` reside exclusivamente en el archivo de configuración `.env` en el servidor Node.js y jamás se expone al cliente web.
2. **Encabezados de Seguridad HTTP:** Implementación de middleware **Helmet.js** para mitigar vulnerabilidades tipo XSS (Cross-Site Scripting) y Clickjacking.
3. **Anonimización Forzada:** Destrucción de cabeceras de IP y omisión de almacenamiento de tokens de sesión para cumplir la directiva de anonimato obligatorio.

### 5.2 Despliegue y Requisitos de Sistema

* **Entorno del Servidor:** Servidor Linux/Windows con Node.js v18+ LTS.
* **Puertos de Red:** Puerto HTTP `3000` (o `$PORT` dinámico asignado por el entorno de hospedaje).
* **Almacenamiento:** Mínimo 100 MB de disco local para el archivo de persistencia `database.sqlite` y assets estáticos.