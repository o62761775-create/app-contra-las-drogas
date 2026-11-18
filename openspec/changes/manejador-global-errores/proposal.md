# Proposal

## Why

Para garantizar la estabilidad operativa, la seguridad de la información y la experiencia homogénea del usuario en la plataforma "Videojuegos contra las Drogas", es imprescindible contar con un middleware centralizado de manejo de excepciones en `src/middleware/errorHandler.js`. Sin este componente, cualquier excepción no capturada en un controlador, fallo en consultas SQLite o error de sintaxis en payloads entrantes provocaría caídas del proceso Node.js, exposición de trazas internas (stack traces) o respuestas HTML desestructuradas que violentan el estándar JSON del proyecto.

Justificación trazable con el SRS:
- **RNF-SEC-01 y REQ-MS-02 (Privacidad Estricta en Logging):** Prohíbe registrar direcciones IP, cabeceras de red o el contenido de `req.body` en los logs del servidor al imprimir errores, protegiendo consultas íntimas de orientación y salud mental de los jóvenes.
- **RNF-SEC-02 (Prevención de Fuga de Información):** Neutraliza mensajes técnicos crudos de SQLite (ej. códigos `SQLITE_*`, nombres de tablas o columnas), devolviendo mensajes genéricos seguros para evitar ingeniería inversa de la base de datos.
- **Estándar de Respuestas API:** Garantiza que todo fallo retorne una estructura JSON uniforme `{ status: "error", code, message, errors }` con códigos HTTP pertinentes (400, 413, 500).
- **Control de Ciclo de Vida Express:** Ubicación canónica al final del pipeline de middlewares de `server.js` para capturar cualquier error propagado vía `next(err)`.

## What Changes

- Creación del middleware `src/middleware/errorHandler.js` con la firma de 4 argumentos `(err, req, res, next)` en CommonJS.
- Verificación preventiva de cabeceras ya enviadas (`if (res.headersSent) return next(err);`).
- Registro técnico privado en consola (`req.method`, `req.originalUrl`, `err.message`, y `err.stack` únicamente en modo development), omitiendo `req.ip`, headers y `req.body`.
- Clasificación de errores específicos:
  - **JSON malformado (`SyntaxError` con status 400 y propiedad `body`):** HTTP 400 con mensaje descriptivo.
  - **Payload excedido (`entity.too.large`):** HTTP 413 con mensaje de límite excedido.
  - **Errores de SQLite (`err.code.startsWith('SQLITE_')`):** HTTP 500 con mensaje genérico de protección de datos.
  - **Otros errores imprevistos:** HTTP 500 (o código personalizado si existe) con mensaje estándar.
- Respuesta homogénea JSON estructurada con arreglo `errors`.
- Conexión de `errorHandler` al final de `server.js` tras las rutas y el catch-all 404.

### Alcance
- Implementación de `src/middleware/errorHandler.js`.
- Integración en `server.js` reemplazando el comentario placeholder `// [TODO: Conectar errorHandler.js en el paso 6.1]`.
- Pruebas sintácticas y verificación de la estructura uniforme de respuesta.

### Fuera de Alcance
- Integración con servicios de telemetría de terceros (Sentry, New Relic) para mantener la política de cero rastreo (REQ-WH-01).

## Capabilities

### New Capabilities
- `error-handling`: Middleware centralizado de intercepción y formateo seguro de errores HTTP y de infraestructura, garantizando anonimato en registros de consola y respuestas JSON unificadas.

### Modified Capabilities
*(Ninguna; define la capacidad global de gestión de fallos).*

## Impact

- **Seguridad:** Elimina fugas de información interna de la base de datos y evita trazas de depuración en entornos productivos.
- **Privacidad:** Asegura que los logs de consola nunca contengan IPs ni textos de solicitudes de ayuda.
- **Consistencia de la API:** Garantiza que el 100% de los errores no controlados sigan el esquema JSON corporativo.
