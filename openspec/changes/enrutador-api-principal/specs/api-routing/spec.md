# Spec Delta

## Purpose

Define el enrutamiento centralizado de la API REST, la cadena ordenada de middlewares de seguridad, la inicialización automática del esquema de base de datos en el servidor y el contrato uniforme de error 404 para rutas inexistentes.

## ADDED Requirements

### Requirement: Centralized API Routing Pipeline
El sistema SHALL configurar el enrutador modular en `src/routes/api.routes.js` protegiendo la totalidad de los endpoints bajo `/api` con el middleware de control de tasa general `apiLimiter` (10 peticiones por minuto por cliente).

#### Scenario: Global API rate limiting enforcement
- **WHEN** un cliente realiza peticiones sucesivas a cualquier endpoint bajo `/api/*`
- **THEN** el router evalúa `apiLimiter` al inicio de la cadena antes de derivar a las rutas específicas.

### Requirement: Domain Route Mapping and Middleware Chain
El sistema SHALL mapear de manera estricta las 6 rutas de dominio asociadas al SRS: `POST /api/solicitudes-ayuda` (con `iaLimiter`, `validarSolicitudAyuda` y `crearSolicitudAyuda`), `GET /api/directorio` (con `obtenerDirectorio`), `GET /api/recursos` (con `obtenerRecursos`), `GET /api/recursos/:id` (con `obtenerRecursoPorId`), `POST /api/juegos/stats` (con `validarEstadisticasJuego` y `registrarEstadisticaJuego`), y `GET /api/juegos/stats/resumen` (con `obtenerResumenEstadisticas`).

#### Scenario: Dispatch help request route with dedicated IA limiter
- **WHEN** un cliente envía una petición `POST /api/solicitudes-ayuda`
- **THEN** la petición atraviesa secuencialmente `apiLimiter`, `iaLimiter`, `validarSolicitudAyuda` y llega a `crearSolicitudAyuda`.

#### Scenario: Dispatch game metrics route with schema validation
- **WHEN** un cliente envía una petición `POST /api/juegos/stats`
- **THEN** la petición atraviesa `apiLimiter`, es validada por `validarEstadisticasJuego` y procesada por `registrarEstadisticaJuego`.

### Requirement: Server Database Auto-Initialization on Startup
El sistema SHALL importar y ejecutar asíncronamente `inicializarBaseDeDatos()` desde `config/database.js` al iniciar `server.js`, garantizando la existencia y modo WAL del esquema SQLite3 antes de que el servidor comience a escuchar conexiones HTTP.

#### Scenario: Safe database schema verification prior to server listen
- **WHEN** el proceso de `server.js` se ejecuta mediante el comando de inicio
- **THEN** la base de datos ejecuta `PRAGMA journal_mode = WAL;` y el script DDL antes de activar la escucha en el puerto configurado.

### Requirement: Standardized 404 Not Found Contract for Undefined API Routes
El sistema SHALL interceptar cualquier petición dirigida a rutas `/api/*` no declaradas y responder con código HTTP 404 Not Found y el contrato JSON unificado `{ status: "error", code: 404, message: "El endpoint solicitado no existe en la API.", errors: [] }`.

#### Scenario: Client requests undefined API resource
- **WHEN** un cliente realiza una petición a una ruta no existente como `GET /api/desconocido`
- **THEN** el servidor responde con estado HTTP 404 y un JSON homogéneo sin exponer trazas internas ni páginas HTML.
