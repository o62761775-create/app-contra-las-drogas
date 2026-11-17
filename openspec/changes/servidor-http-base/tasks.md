# Tasks

## 1. Middlewares de Seguridad y Anonimización

- [x] 1.1 Configurar e instanciar `helmet()` y el middleware de anonimización forzada de IPs (`x-forwarded-for`, `x-real-ip`) en `server.js`, verificando que se ejecuten al inicio de la cadena.
- [x] 1.2 Configurar `express.json({ limit: '10kb' })` y el servicio de archivos estáticos desde `public/` con `path.join(__dirname, 'public')`, verificando las restricciones de carga y ruta absoluta.

## 2. Endpoints Base y Anclajes Arquitecturales

- [x] 2.1 Implementar el endpoint `GET /api/healthcheck` con respuesta HTTP 200 y contrato JSON estándar `{ status, code, message, data }`, verificando que incluya `timestamp` y `environment`.
- [x] 2.2 Agregar comentarios de anclaje para la integración de `api.routes.js` (`// [TODO: Conectar api.routes.js en el paso 5.3]`) y `errorHandler.js` (`// [TODO: Conectar errorHandler.js en el paso 6.1]`), verificando su posición en el pipeline.

## 3. Inicialización y Control de Versiones

- [x] 3.1 Implementar la escucha HTTP con `app.listen(PORT, ...)` mostrando mensaje limpio en consola con el puerto y `NODE_ENV`, verificando la sintaxis del archivo.
- [x] 3.2 Ejecutar `openspec validate --all` para validar la coherencia de todos los artefactos de OpenSpec.
- [x] 3.3 Realizar el commit de la implementación de `server.js` siguiendo Conventional Commits: `feat: implementar servidor express base con middlewares de seguridad y healthcheck`.
