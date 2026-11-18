# Spec Delta

## Purpose

Define las reglas de validación estricta de esquemas JSON, sanitización preventiva contra ataques XSS, normalización de campos anónimos y contratos uniformes de error HTTP 400 para las peticiones entrantes del backend.

## ADDED Requirements

### Requirement: Defensive Text Sanitization against XSS
El sistema SHALL proveer una rutina pura de sanitización `sanitizarTexto` que elimine espacios residuales en los extremos y neutralice secuencias y caracteres especiales HTML (`<`, `>`, `&`, `"`, `'` y etiquetas `<script>`) en cualquier entrada de texto antes de su persistencia o procesamiento.

#### Scenario: Sanitize dangerous script tags and markup
- **WHEN** un cliente envía una cadena de texto que contiene `<script>alert('xss')</script>` o caracteres `<>&"'`
- **THEN** el sistema neutraliza o elimina las etiquetas y escapa los caracteres peligrosos sin alterar el texto legítimo.

#### Scenario: Trim whitespace on harmless text
- **WHEN** un cliente envía texto con espacios en blanco al inicio o al final
- **THEN** la función retorna el texto recortado y limpio.

### Requirement: Help Requests Input Validation and Anonymity Normalization
El sistema SHALL validar el cuerpo JSON de `POST /api/solicitudes-ayuda` exigiendo `mensaje` como string no vacío de 3 a 1000 caracteres, normalizando `nombre` a `'Anónimo'` si está ausente o vacío (máximo 50 caracteres si se proporciona), y validando `edad` como entero opcional entre 5 y 120 años (asignando `null` si no se envía).

#### Scenario: Valid help request payload with anonymous default
- **WHEN** un cliente envía una solicitud con `mensaje` válido y sin `nombre` ni `edad`
- **THEN** la validación pasa exitosamente, asigna `req.body.nombre = 'Anónimo'`, `req.body.edad = null`, y transfiere el control al controlador.

#### Scenario: Invalid help request payload with missing or out-of-bounds fields
- **WHEN** un cliente envía una solicitud con `mensaje` menor a 3 caracteres o mayor a 1000, o una `edad` menor a 5 o mayor a 120
- **THEN** el middleware interrumpe la petición y acumula los fallos en una lista estructurada de errores.

### Requirement: Game Statistics Input Validation and Normalization
El sistema SHALL validar el cuerpo JSON de `POST /api/juegos/stats` exigiendo `juego_id` (string no vacío, sanitizado, máx. 50 caracteres), `puntaje` (entero >= 0), `duracion_sec` (entero >= 0) y normalizando el campo opcional `completado` al entero `0` o `1`.

#### Scenario: Valid game statistics payload
- **WHEN** un cliente envía métricas de juego válidas con `juego_id`, `puntaje`, `duracion_sec` y un booleano en `completado`
- **THEN** el middleware sanitiza `juego_id`, normaliza `completado` a `1` o `0` y permite continuar hacia el controlador.

#### Scenario: Malformed game statistics payload
- **WHEN** un cliente envía un puntaje negativo o `duracion_sec` no numérica
- **THEN** el middleware interrumpe la petición con errores de validación específicos.

### Requirement: Standardized Validation Error Response Contract
El sistema SHALL responder con código HTTP 400 Bad Request y estructura JSON homogénea `{ status: "error", code: 400, message: "...", errors: [...] }` cada vez que una petición falle una o más validaciones, detallando el motivo o campo infractor en el arreglo `errors`.

#### Scenario: Error contract delivery on validation failure
- **WHEN** una petición POST presenta uno o más campos no conformes con las reglas de validación
- **THEN** el servidor retorna código 400 y un payload JSON con `status: "error"`, `code: 400` y la lista acumulativa de violaciones.
