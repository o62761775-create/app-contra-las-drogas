# Tasks

## 1. Función Auxiliar de Sanitización XSS

- [x] 1.1 Implementar la función pura `sanitizarTexto(texto)` en `src/middleware/validator.js` que aplique `.trim()`, neutralice etiquetas `<script>` y reemplace caracteres HTML peligrosos (`&`, `<`, `>`, `"`, `'`) por sus entidades seguras, verificando su comportamiento defensivo.

## 2. Middlewares de Validación de Carga Útil

- [x] 2.1 Implementar el middleware `validarSolicitudAyuda` para `POST /api/solicitudes-ayuda` con validación de `mensaje` (obligatorio, 3-1000 caracteres), asignación de `'Anónimo'` por defecto en `nombre` (máximo 50 caracteres) y validación de `edad` (entero 5-120 o `null`), verificando la sanitización y reasignación en `req.body`.
- [x] 2.2 Implementar el middleware `validarEstadisticasJuego` para `POST /api/juegos/stats` validando `juego_id` (obligatorio, sanitizado, máx. 50 caracteres), `puntaje` (entero >= 0), `duracion_sec` (entero >= 0) y normalización de `completado` (a 0 o 1), verificando la consistencia de tipos.

## 3. Respuesta Uniforme y Control de Versiones

- [x] 3.1 Integrar la detención temprana con respuesta HTTP 400 Bad Request `{ status: "error", code: 400, message, errors }` cuando existan fallos acumulados en el arreglo `errores`, y exportar las funciones del módulo con CommonJS.
- [x] 3.2 Ejecutar `openspec validate --all` para verificar la coherencia de todos los artefactos de OpenSpec en el repositorio.
- [x] 3.3 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: implementar middleware de sanitizacion y validacion de entradas con respuestas estandarizadas`.
