# Proposal

## Why

Para articular de forma coherente y segura todos los endpoints del backend de la plataforma "Videojuegos contra las Drogas", es imprescindible implementar el enrutador central `src/routes/api.routes.js` y actualizar el punto de entrada `server.js`. Este cambio unifica los flujos de orientación asistida por IA (RF-01), directorio de emergencia (RF-03), métricas de videojuegos (RF-04) y recursos educativos (RF-05), aplicando la cadena estricta de rate limiting (RNF-SEC-02), validación defensiva y manejo homogéneo de rutas no encontradas (HTTP 404).

Justificación trazable con el SRS:
- **RF-01 / RF-02 (Solicitudes de Ayuda y Orientación):** Exposición de `POST /api/solicitudes-ayuda` bajo el limitador estricto `iaLimiter` (5 req/min) y `validarSolicitudAyuda`.
- **RF-03 (Directorio de Contactos):** Exposición de `GET /api/directorio` para consulta de líneas de marcación rápida.
- **RF-04 (Métricas de Juego):** Exposición de `POST /api/juegos/stats` (con `validarEstadisticasJuego`) y `GET /api/juegos/stats/resumen`.
- **RF-05 (Recursos Educativos):** Exposición de `GET /api/recursos` y `GET /api/recursos/:id`.
- **RNF-SEC-02 (Control de Tasa General):** Aplicación de `apiLimiter` (10 req/min) a nivel global en el router para toda la API.
- **Ciclo de Vida del Servidor:** Inicialización automática de la base de datos SQLite (`inicializarBaseDeDatos()`) previa al arranque del servidor HTTP y middleware catch-all para errores 404 en la API.

## What Changes

- Creación del archivo `src/routes/api.routes.js` con Express Router en CommonJS.
- Integración de los limitadores de tasa `{ apiLimiter, iaLimiter }` y validadores `{ validarSolicitudAyuda, validarEstadisticasJuego }`.
- Vinculación de los controladores requeridos:
  - `crearSolicitudAyuda` (`ayuda.controller`)
  - `obtenerDirectorio` (`directorio.controller`)
  - `obtenerRecursos`, `obtenerRecursoPorId` (`recursos.controller`)
  - `registrarEstadisticaJuego`, `obtenerResumenEstadisticas` (`juego.controller`)
- Actualización de `server.js`:
  - Ejecución de `inicializarBaseDeDatos()` de `config/database.js` al iniciar.
  - Montaje del enrutador modular en `app.use('/api', apiRoutes)`.
  - Middleware de captura para rutas no encontradas `app.use('/api/*', ...)` que responda HTTP 404 con el contrato uniforme del proyecto.

### Alcance
- Creación de `src/routes/api.routes.js` con las 6 rutas oficiales de la API y su cadena de middlewares.
- Actualización de `server.js` conectando base de datos, rutas y manejador 404.
- Implementación de stubs funcionales para controladores pendientes de desarrollo (`directorio`, `recursos`, `juego`) y `validator.js` para asegurar que el servidor arranque sin errores de módulo.

### Fuera de Alcance
- Implementación completa de la lógica de negocio de los controladores secundarios (`directorio`, `recursos`, `juego`), los cuales se completarán en sus respectivos cambios.
- Modificación del cliente frontend en `public/`.

## Capabilities

### New Capabilities
- `api-routing`: Enrutador centralizado REST con encadenamiento estricto de rate limiting, validación y controladores de dominio, junto con la orquestación del ciclo de vida y respuestas 404 estandarizadas en `server.js`.

### Modified Capabilities
*(Ninguna; define la capacidad de enrutamiento unificado de la API).*

## Impact

- **Seguridad:** Aplica doble barrera de protección (límite global de 10 req/min y límite específico para IA de 5 req/min).
- **Arquitectura:** Conecta la capa de red con los controladores y asegura la inicialización del esquema SQLite antes de recibir tráfico.
- **Experiencia de Integración:** Rutas inexistentes bajo `/api/*` reciben un error JSON 404 homogéneo en vez de HTML genérico de Express.
