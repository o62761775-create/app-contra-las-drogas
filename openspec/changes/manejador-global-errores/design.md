# Design

## Context

El servidor HTTP Express (`server.js`) despacha peticiones hacia `src/routes/api.routes.js`, donde los controladores y servicios pueden propagar errores síncronos o asíncronos mediante `next(error)`. Para interceptar cualquier fallo inesperado, prevenir fugas de información sobre la estructura de la base de datos SQLite y evitar respuestas no estandarizadas, se requiere implementar `src/middleware/errorHandler.js` y conectarlo como último middleware del pipeline en `server.js`. (Ver `proposal.md` y `specs/error-handling/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar la función middleware Express `errorHandler(err, req, res, next)` con 4 parámetros en `src/middleware/errorHandler.js`.
- Comprobar `if (res.headersSent) return next(err);` para no intentar escribir cabeceras duplicadas.
- Registrar fallos en `console.error` con método, URL y mensaje técnico (y `stack` solo si `NODE_ENV === 'development'`), sin registrar `req.ip`, cabeceras de cliente ni `req.body`.
- Clasificar errores específicos:
  - JSON malformado (`SyntaxError` con status 400 y propiedad `body`) → HTTP 400.
  - Carga excesiva (`err.type === 'entity.too.large'`) → HTTP 413.
  - Excepciones SQLite (`err.code.startsWith('SQLITE_')`) → HTTP 500 neutralizado.
  - Fallos generales → `err.statusCode || err.status || 500`.
- Devolver siempre la estructura unificada `{ status: "error", code, message, errors }`.
- Conectar `app.use(errorHandler);` al final de `server.js`.

**Non-Goals:**
- Instalar dependencias adicionales de registro (como Winston o Morgan) o servicios externos de telemetría.
- Alterar la lógica interna de los controladores existentes.

## Decisions

### 1. Firma Canónica de Manejo de Errores en Express
- **Decisión:** Mantener estrictamente los cuatro parámetros `(err, req, res, next)`.
- **Justificación:** Express inspecciona la aridad de la función (`fn.length === 4`) para identificarla como manejador de errores. Omitir el cuarto parámetro `next` provocaría que Express lo trate como middleware normal, ignorando las excepciones.

### 2. Privacidad Absoluta en Registros de Servidor (Logging)
- **Decisión:** En `console.error`, se registran únicamente `req.method`, `req.originalUrl` y `err.message` (más `err.stack` en modo development). Se prohíbe terminantemente imprimir `req.ip` o `req.body`.
- **Justificación:** En cumplimiento de RNF-SEC-01 y REQ-MS-02, el cuerpo de las solicitudes puede contener revelaciones sensibles sobre consumo de sustancias o estados emocionales de menores de edad, las cuales nunca deben persistir en registros volátiles o de archivo.

### 3. Sanitización de Mensajes de Base de Datos
- **Decisión:** Ante errores con código `SQLITE_*`, el middleware intercepta el mensaje y retorna `statusCode = 500` con `message = 'Error interno al procesar la operación de datos.'`, descartando nombres de tablas, campos o restricciones de la respuesta al cliente.
- **Justificación:** Previene fuga de metadatos del esquema relacional (RNF-SEC-02).

### 4. Ubicación en `server.js`
- **Decisión:** Conectar `app.use(errorHandler);` inmediatamente después del middleware catch-all de 404 (`app.use('/api/*', ...)`).
- **Justificación:** Al situarse al final de la cadena de Express, captura tanto errores originados en rutas REST como excepciones generadas durante la resolución de peticiones.

## Risks / Trade-offs

- **[Riesgo de respuestas duplicadas si un controlador no retorna]** → *Mitigación:* Se verifica `res.headersSent` al inicio del manejador.
- **[Riesgo de stack traces visibles para usuarios en producción]** → *Mitigación:* Se restringe la inclusión de `err.stack` y detalles crudos únicamente cuando `NODE_ENV === 'development'`.
