# Design

## Context

El proyecto requiere una base técnica inicial para el backend que garantice la separación en capas definida en el Estándar de Desarrollo y el SAD. Dado que el proyecto usa JavaScript Vanilla en frontend y Node.js/Express en backend sin frameworks pesados, la configuración del runtime debe ser minimalista, segura y reproducible. (Ver `proposal.md` y `specs/backend-runtime/spec.md`).

## Goals / Non-Goals

**Goals:**
- Establecer el manifiesto `package.json` con dependencias mínimas justificadas y scripts nativos.
- Proveer la plantilla `.env.example` documentada para configuración local segura.
- Garantizar que `.gitignore` excluya secretos, dependencias y bases de datos locales.
- Crear la estructura física de carpetas requerida por el estándar modular (`config/`, `src/`, `database/`, `public/`).

**Non-Goals:**
- Implementar la lógica de servidor en `server.js` ni el enrutador `src/routes/api.routes.js`.
- Crear el script DDL `database/schema.sql` ni inicializar la conexión SQLite `config/database.js`.
- Implementar controladores o servicios (`src/controllers/`, `src/services/`).

## Decisions

### 1. Sistema de Módulos: CommonJS (`require` / `module.exports`)
- **Decisión:** Mantener CommonJS en el entorno Node.js del backend.
- **Justificación:** Coherencia estricta con el estándar técnico del proyecto y compatibilidad nativa con las versiones LTS de Node.js y los paquetes del ecosistema (`sqlite3`, `express`).
- **Alternativas consideradas:** ES Modules (`"type": "module"`). Descartado por requerir ajustes adicionales en resolución de extensiones y compatibilidad con scripts existentes.

### 2. Justificación de Dependencias de Producción
- **`express` (^4.18.0):** Framework HTTP minimalista y estándar de facto para la API REST.
- **`sqlite3` (^5.1.0):** Driver nativo para la base de datos relacional ligera en archivo único (modo WAL).
- **`dotenv` (^16.0.0):** Carga segura de variables de entorno desde `.env` al proceso de Node.js.
- **`helmet` (^7.0.0):** Fortificación de cabeceras HTTP de seguridad requerida por RNF-SEC-02.
- **`express-rate-limit` (^7.0.0):** Limitación de tasa para mitigar abusos y DoS en endpoints públicos.
- **`openai` (^4.0.0):** SDK oficial para consumo de la API de orientación conversacional exclusivamente desde backend (RNF-SEC-03).
- **Alternativas consideradas:** Uso exclusivo de módulos nativos de Node (`http`, etc.). Descartado por complejidad y mayor margen de error en seguridad y rate limiting.

### 3. Scripts de Ejecución Nativos
- **Decisión:** Usar `node server.js` para `start` y `node --watch server.js` para `dev`.
- **Justificación:** Node.js 18+ cuenta con el flag nativo `--watch`, eliminando la necesidad de dependencias adicionales como `nodemon`.

### 4. Estructura de Directorios y Separación de Responsabilidades
- **Decisión:** Implementar la jerarquía:
  - `config/`: Configuración del sistema (base de datos, etc.).
  - `src/controllers/`: Manejadores de peticiones y respuestas uniformes.
  - `src/middleware/`: Manejo de errores, rate limit y validaciones.
  - `src/routes/`: Enrutamiento modular Express.
  - `src/services/`: Clientes externos (OpenAI).
  - `database/`: Scripts DDL y persistencia física SQLite (excluida de git).
  - `public/`: Assets y vistas estáticas de la SPA/PWA.

## Risks / Trade-offs

- **[Riesgo de exposición accidental de .env o base de datos en Git]** → *Mitigación:* Validación estricta y prueba de `.gitignore` antes de cualquier confirmación de código.
- **[Riesgo de discrepancia de versiones de Node.js con flag --watch]** → *Mitigación:* El proyecto requiere Node.js 18+ LTS donde `--watch` es soportado de manera estable.
