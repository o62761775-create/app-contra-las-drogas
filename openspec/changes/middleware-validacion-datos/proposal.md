# Proposal

## Why

Para garantizar la integridad y seguridad de la plataforma "Videojuegos contra las Drogas", es crítico validar y sanitizar las cargas útiles entrantes en las peticiones HTTP POST antes de que alcancen los controladores o servicios externos. Sin una capa de validación centralizada, la aplicación queda vulnerable a inyecciones de secuencias de comandos en sitios cruzados (XSS almacenado), payloads malformados, agotamiento no controlado de tokens en la API de OpenAI y corrupción del modelo de datos en SQLite3.

Justificación trazable con el SRS:
- **RF-01 (Solicitud de Ayuda / Orientación):** Requiere validar que el campo `mensaje` exista, contenga entre 3 y 1000 caracteres (optimizando el consumo de tokens en OpenAI), y respetar el anonimato por diseño asignando `'Anónimo'` por defecto en `nombre` y verificando el rango biológico en `edad` (5 a 120 años).
- **RF-04 (Registro de Métricas de Juego):** Demanda la validación de `juego_id` (no vacío, máx. 50 caracteres), `puntaje` (entero >= 0), `duracion_sec` (entero >= 0) y normalización del flag `completado` (0 o 1).
- **RNF-SEC-01 y REQ-MS-02 (Anonimato Estricto):** Asegura la no obligatoriedad de datos personales y la imposibilidad de inyectar datos de identificación no deseados.
- **RNF-SEC-02 (Seguridad y Sanitización XSS):** Neutralización de caracteres especiales (`<`, `>`, `&`, `"`, `'`) y eliminación de etiquetas `<script>` antes de almacenar o procesar el texto.
- **Estándar de Respuestas API:** Retorno homogéneo de errores HTTP 400 con arreglo estructurado de fallos (`errors`).

## What Changes

- Creación del módulo `src/middleware/validator.js` con CommonJS (`require` / `module.exports`).
- Implementación de la función pura auxiliar `sanitizarTexto(texto)` para el saneamiento defensivo contra XSS y limpieza de espacios en blanco (`.trim()`).
- Implementación del middleware `validarSolicitudAyuda(req, res, next)` para la ruta `POST /api/solicitudes-ayuda`:
  - Validación de presencia, tipo y longitud (3-1000 caracteres) de `mensaje`.
  - Tratamiento opcional y normalización a `'Anónimo'` para `nombre` (máximo 50 caracteres).
  - Validación opcional de `edad` como entero en rango [5, 120], asignando `null` si no se envía.
- Implementación del middleware `validarEstadisticasJuego(req, res, next)` para la ruta `POST /api/juegos/stats`:
  - Validación de `juego_id` (string no vacío, sanitizado, máx. 50 caracteres).
  - Validación de `puntaje` y `duracion_sec` (enteros >= 0).
  - Normalización y verificación de `completado` (booleano o entero mapeado a 0 o 1).
- Generación de respuestas uniformes de error HTTP 400 Bad Request cuando el arreglo acumulativo `errores` no esté vacío:
  `{ status: "error", code: 400, message: "...", errors: [...] }`.

### Alcance
- Creación y exportación de las funciones de sanitización y middlewares de validación en `src/middleware/validator.js`.
- Pruebas y validaciones de sintaxis y cobertura de casos límite (ausencia de campos, tipos incompatibles, valores fuera de rango, payloads con inyecciones XSS).

### Fuera de Alcance
- Conexión del middleware en las rutas de la API (`src/routes/api.routes.js`).
- Lógica de persistencia en SQLite o integración con OpenAI.

## Capabilities

### New Capabilities
- `input-validation`: Middleware centralizado de sanitización defensiva contra XSS y validación estricta de payloads JSON para solicitudes de ayuda y métricas de juego, con respuestas unificadas de error HTTP 400.

### Modified Capabilities
*(Ninguna; define una nueva capacidad transversal de seguridad y validación).*

## Impact

- **Seguridad:** Previene ataques XSS almacenados y payloads gigantes o desestructurados que puedan degradar la API o disparar costos de inferencia en OpenAI.
- **Privacidad:** Refuerza activamente la política de anonimato por diseño forzando `'Anónimo'` en solicitudes sin alias.
- **Capa de Controladores:** Garantiza que los controladores reciban datos limpios, parseados y listos para persistir o procesar en `req.body`.
