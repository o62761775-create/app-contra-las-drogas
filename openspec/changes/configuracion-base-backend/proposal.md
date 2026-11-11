# Proposal

## Why

Para iniciar el desarrollo del proyecto "Videojuegos contra las Drogas", es imprescindible establecer la base estructural y operativa del entorno de ejecución backend en Node.js y Express.js. Esta configuración inicial garantiza la consistencia del stack tecnológico, la correcta gestión de dependencias de producción, la protección de secretos de entorno y una arquitectura de directorios alineada con el estándar técnico y los requisitos no funcionales de seguridad y rendimiento.

Justificación trazable con el SRS:
- **RNF-SEC-03 (Protección de API Keys):** Configuración de variables de entorno seguras (`.env`) y plantilla documentada (`.env.example`).
- **RNF-SEC-02 (Seguridad HTTP):** Incorporación de `helmet` y `express-rate-limit` para fortificación de cabeceras y prevención de abuso.
- **RNF-SEC-01 y REQ-MS-02 (Privacidad y Anonimato):** Exclusión estricta de bases de datos locales, logs y secretos en `.gitignore`.
- **RNF-PER-01 (Rendimiento REST):** Base ligera en Node.js y SQLite3 en modo CommonJS sin sobrecarga innecesaria.
- **Habilitador de RF-01 a RF-05:** Estructuración modular para soportar los controladores de orientación, directorio, recursos y minijuegos.

## What Changes

- Creación del archivo `package.json` con metadatos del proyecto (`videojuegos-contra-drogas-backend`, versión `1.0.0`), tipo de módulo CommonJS, scripts (`start` y `dev` con watch nativo de Node.js) y dependencias de producción (`express`, `sqlite3`, `dotenv`, `helmet`, `express-rate-limit`, `openai`).
- Creación del archivo `.env.example` con comentarios explicativos para `PORT`, `OPENAI_API_KEY` y `NODE_ENV`.
- Configuración de `.gitignore` verificando la exclusión de `node_modules/`, `.env*`, archivos de base de datos SQLite (`database/*.sqlite`, etc.), logs de ejecución y archivos residuales del sistema operativo.
- Creación de la estructura de directorios estandarizada (`config/`, `src/controllers/`, `src/middleware/`, `src/routes/`, `src/services/`, `database/`, `public/`).

### Alcance
- Definición formal de la configuración de paquetes y scripts de ejecución.
- Plantilla de variables de entorno y reglas de exclusión en Git.
- Estructuración de directorios de capas backend y hosting de assets estáticos.

### Fuera de Alcance
- Codificación de endpoints, rutas o lógica de negocio (`server.js`, `api.routes.js`, controladores).
- Implementación de la conexión a base de datos (`config/database.js`) o scripts DDL (`database/schema.sql`).
- Implementación del servicio de integración con OpenAI (`openai.service.js`).
- Implementación de middleware (`errorHandler.js`, `rateLimiter.js`, `validator.js`).
- Creación de assets o código de la interfaz de usuario frontend en `public/`.

## Capabilities

### New Capabilities
- `backend-runtime`: Entorno base, gestión de dependencias, configuración de variables de entorno y estructura modular de directorios para el servidor Node.js/Express.

### Modified Capabilities
*(Ninguna; es el primer cambio del repositorio).*

## Impact

- **Código:** Establece el andamiaje sobre el cual se desarrollarán todos los módulos backend y frontend.
- **Dependencias:** Incorpora `express`, `sqlite3`, `dotenv`, `helmet`, `express-rate-limit` y `openai`.
- **Seguridad y Privacidad:** Mitiga el riesgo de filtración de credenciales (`OPENAI_API_KEY`) y datos de persistencia en Git mediante `.gitignore` y `.env.example`.
