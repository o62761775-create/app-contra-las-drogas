# Spec Delta

## Purpose

Define el entorno de ejecución, gestión de dependencias base, configuración de variables de entorno y estructura modular de directorios para el backend de la plataforma.

## ADDED Requirements

### Requirement: Package Configuration and Production Dependencies
El sistema SHALL definir un manifiesto `package.json` con el nombre de proyecto `videojuegos-contra-drogas-backend`, versión `1.0.0`, sistema de módulos CommonJS, scripts estándar de ejecución (`start` con `node server.js` y `dev` con `node --watch server.js`), y dependencias obligatorias de producción (`express` ^4.18.0, `sqlite3` ^5.1.0, `dotenv` ^16.0.0, `helmet` ^7.0.0, `express-rate-limit` ^7.0.0 y `openai` ^4.0.0).

#### Scenario: Manifest validation and dependency resolution
- **WHEN** se inspecciona el archivo `package.json` o se ejecuta la instalación de paquetes
- **THEN** el sistema expone los metadatos, scripts y dependencias requeridos sin discrepancias de versión.

### Requirement: Environment Variable Template and Security Configuration
El sistema SHALL proveer una plantilla `.env.example` comentada que documente las variables obligatorias `PORT` (puerto del servidor), `OPENAI_API_KEY` (secreto de OpenAI restringido a backend) y `NODE_ENV` (entorno de ejecución), manteniendo valores de marcador de posición sin exponer credenciales activas.

#### Scenario: Environment configuration bootstrap
- **WHEN** un desarrollador toma como base `.env.example` para configurar su entorno local
- **THEN** el archivo contiene explicaciones para cada variable y previene la fuga de claves reales.

### Requirement: Sensitive File Exclusion Rules
El sistema SHALL mantener reglas en `.gitignore` para excluir estrictamente dependencias (`node_modules/`), archivos de entorno (`.env*`), archivos físicos de base de datos SQLite (`database/*.sqlite*`), logs de depuración (`npm-debug.log*`) y archivos residuales del sistema operativo.

#### Scenario: Prevention of secret and database leak in version control
- **WHEN** se consulta el estado de Git con archivos de entorno locales o bases de datos SQLite en el espacio de trabajo
- **THEN** Git ignora dichos archivos asegurando que nunca sean versionados ni subidos al repositorio.

### Requirement: Modular Directory Scaffold
El sistema SHALL organizar los componentes del proyecto bajo una arquitectura modular de directorios que incluya `config/`, `src/controllers/`, `src/middleware/`, `src/routes/`, `src/services/`, `database/` y `public/`, asegurando la separación clara de responsabilidades.

#### Scenario: Directory layout inspection
- **WHEN** se valida la estructura de carpetas del repositorio
- **THEN** los directorios de capas backend y activos de cliente existen conforme al estándar técnico.
