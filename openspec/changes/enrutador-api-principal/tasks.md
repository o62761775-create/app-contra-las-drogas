# Tasks

## 1. Enrutador Principal API

- [x] 1.1 Crear el enrutador en `src/routes/api.routes.js` inicializando `express.Router()` y aplicando `router.use(apiLimiter)` para control de tasa general en todos los endpoints `/api/*`.
- [x] 1.2 Mapear las 6 rutas de dominio con su cadena de middlewares en `src/routes/api.routes.js`: `POST /solicitudes-ayuda` (con `iaLimiter`, `validarSolicitudAyuda`, `crearSolicitudAyuda`), `GET /directorio`, `GET /recursos`, `GET /recursos/:id`, `POST /juegos/stats` (con `validarEstadisticasJuego`, `registrarEstadisticaJuego`) y `GET /juegos/stats/resumen`.
- [x] 1.3 Asegurar la resolución limpia de dependencias de controladores y validadores en CommonJS para que el enrutador sea cargable sin errores.

## 2. Actualización del Servidor y Manejo 404

- [x] 2.1 Actualizar `server.js` para importar y ejecutar `inicializarBaseDeDatos()` de forma asíncrona previo a `app.listen()`, garantizando la existencia del esquema DDL y modo WAL.
- [x] 2.2 Montar el enrutador de la API en `server.js` mediante `app.use('/api', apiRoutes)`, conservando `GET /api/healthcheck`.
- [x] 2.3 Implementar el middleware catch-all para rutas no reconocidas bajo `/api/*` que retorne HTTP 404 con el contrato uniforme `{ status: "error", code: 404, message, errors: [] }`.

## 3. Validación y Control de Versiones

- [x] 3.1 Ejecutar `openspec validate --all` para validar la coherencia e integridad de todos los artefactos de OpenSpec en el repositorio.
- [x] 3.2 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: implementar enrutador principal de la api y actualizar arranque del servidor con inicializacion de base de datos`.
