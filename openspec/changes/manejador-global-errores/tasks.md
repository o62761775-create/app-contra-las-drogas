# Tasks

## 1. Implementación del Middleware de Errores

- [x] 1.1 Crear `src/middleware/errorHandler.js` con la firma `(err, req, res, next)`, verificación `res.headersSent` y registro técnico seguro en `console.error` excluyendo `req.ip` y `req.body`.
- [x] 1.2 Implementar la clasificación de excepciones para sintaxis JSON (HTTP 400), payload excedido (HTTP 413), errores SQLite neutralizados (HTTP 500) y fallos no controlados, formateando el payload JSON uniforme `{ status: "error", code, message, errors }`.

## 2. Conexión en el Servidor

- [x] 2.1 Importar y conectar `errorHandler` al final del pipeline en `server.js` después de las rutas y del catch-all 404, verificando el flujo de captura de excepciones.

## 3. Validación y Control de Versiones

- [x] 3.1 Ejecutar `openspec validate --all` para verificar la integridad de todos los artefactos de OpenSpec en el repositorio.
- [x] 3.2 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: implementar middleware centralizado de manejo de excepciones y conectar en server.js`.
