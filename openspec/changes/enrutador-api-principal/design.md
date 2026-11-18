# Design

## Context

El proyecto dispone del servidor HTTP base (`server.js`), el módulo de persistencia SQLite3 con modo WAL (`config/database.js`), el esquema DDL (`src/database/schema.sql`), los limitadores de tasa (`src/middleware/rateLimiter.js`) y el primer controlador de negocio (`src/controllers/ayuda.controller.js`). Para conectar la capa de transporte con los servicios y controladores, se requiere un enrutador central en `src/routes/api.routes.js` y la actualización del punto de entrada `server.js` para asegurar que la base de datos se inicialice antes de abrir el puerto HTTP y que las rutas inexistentes retornen un error 404 uniforme. (Ver `proposal.md` y `specs/api-routing/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar `src/routes/api.routes.js` con las 6 rutas del dominio y su orden secuencial de middlewares (límite general `apiLimiter`, límite IA `iaLimiter`, y validadores).
- Actualizar `server.js` para ejecutar `inicializarBaseDeDatos()` de forma asíncrona previo a `app.listen()`.
- Montar las rutas bajo el prefijo `/api` (`app.use('/api', apiRoutes)`), manteniendo `GET /api/healthcheck`.
- Implementar un middleware catch-all para rutas no coincidentes bajo `/api/*` que retorne HTTP 404 con el contrato homogéneo `{ status: "error", code: 404, message: "El endpoint solicitado no existe en la API.", errors: [] }`.

**Non-Goals:**
- Desarrollar la lógica de negocio completa de los controladores secundarios (`directorio`, `recursos`, `juego`), los cuales se definirán en sus respectivas especificaciones funcionales.

## Decisions

### 1. Inicialización Idempotente Previa a la Escucha HTTP
- **Decisión:** En `server.js`, la función `inicializarBaseDeDatos()` se invoca antes de enlazar el puerto:
  ```javascript
  inicializarBaseDeDatos()
    .then(() => {
      app.listen(PORT, () => { ... });
    })
    .catch((err) => {
      console.error('[Servidor] Error crítico al inicializar la base de datos:', err.message);
      process.exit(1);
    });
  ```
- **Justificación:** Previene que el servidor comience a recibir tráfico y consultas cuando la base de datos no está en modo WAL o las tablas aún no se han creado (principio fail-fast).

### 2. Jerarquía de Middlewares en `api.routes.js`
- **Decisión:**
  1. `router.use(apiLimiter)`: Aplica de forma obligatoria la ventana de 10 peticiones/minuto a toda la API.
  2. En `POST /solicitudes-ayuda`: Cadena `[iaLimiter, validarSolicitudAyuda, crearSolicitudAyuda]`.
  3. En `POST /juegos/stats`: Cadena `[validarEstadisticasJuego, registrarEstadisticaJuego]`.
  4. Rutas GET de lectura directa a controladores.
- **Justificación:** Garantiza que los endpoints más costosos (inferencia en OpenAI y escritura lúdica) cuenten con limitadores dedicados y filtros de sanitización antes de llegar a la lógica de negocio.

### 3. Captura Estricta de Rutas 404 en la API
- **Decisión:** Registrar `app.use('/api/*', (req, res) => { ... })` inmediatamente después de montar `apiRoutes`.
- **Justificación:** Evita que clientes de la API reciban respuestas en formato HTML genérico cuando solicitan endpoints inexistentes bajo el namespace `/api`.

### 4. Resolución Segura de Dependencias de Controladores
- **Decisión:** Para garantizar que `api.routes.js` sea sintácticamente válido y ejecutable en CommonJS sin provocar `MODULE_NOT_FOUND` antes de que se completen los cambios de los controladores secundarios (`directorio`, `recursos`, `juego`) y `validator.js`, se proporcionarán implementaciones o stubs que respeten la firma estándar `(req, res, next)`.

## Risks / Trade-offs

- **[Riesgo de falla en arranque si el archivo de esquema no existe]** → *Mitigación:* `config/database.js` y `src/database/schema.sql` ya están implementados y verificados en el repositorio.
- **[Riesgo de rutas colisionando con assets estáticos]** → *Mitigación:* El prefijo `/api` aísla de forma determinista la API REST de los recursos servidos desde `public/`.
