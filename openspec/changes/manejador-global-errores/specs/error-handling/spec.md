# Spec Delta

## Purpose

Define el comportamiento del middleware centralizado de manejo de excepciones, la clasificación de códigos de estado HTTP, la política de privacidad estricta en el registro de errores y el contrato homogéneo de respuesta ante fallos.

## ADDED Requirements

### Requirement: Centralized Error Middleware Pipeline
El sistema SHALL capturar todas las excepciones no controladas de la aplicación mediante un middleware Express de 4 parámetros `errorHandler(err, req, res, next)` montado al final del pipeline de middlewares, transfiriendo el control a `next(err)` si `res.headersSent` es verdadero.

#### Scenario: Intercept unhandled exception before response sent
- **WHEN** un controlador o middleware propaga un error mediante `next(error)` o una excepción no capturada
- **THEN** el middleware intercepta el fallo e impide que el proceso de Node.js colapse.

#### Scenario: Delegate when headers are already sent
- **WHEN** ocurre un error y las cabeceras HTTP ya fueron transmitidas al cliente
- **THEN** el middleware delega inmediatamente a `next(err)` respetando el ciclo de Express.

### Requirement: Privacy-Compliant Error Logging
El sistema SHALL registrar en consola (`console.error`) el método HTTP, la URL (`req.method`, `req.originalUrl`), el mensaje de error y el stack trace únicamente en modo development, y MUST omitir totalmente direcciones IP (`req.ip`), cabeceras de red y el cuerpo de la petición (`req.body`).

#### Scenario: Safe logging in development without sensitive user data
- **WHEN** se produce una excepción en entorno de desarrollo (`NODE_ENV === 'development'`)
- **THEN** se imprimen trazas técnicas en consola sin exponer datos de red ni consultas del usuario.

#### Scenario: Clean logging in production
- **WHEN** se produce una excepción en entorno productivo (`NODE_ENV === 'production'`)
- **THEN** se registra únicamente un resumen mínimo del error sin stack trace ni datos personales.

### Requirement: Specialized Exception Classification and Status Mapping
El sistema SHALL clasificar los errores reconociendo fallos de sintaxis JSON (HTTP 400), carga útil excesiva `entity.too.large` (HTTP 413), excepciones de base de datos SQLite con código `SQLITE_*` (HTTP 500 sanitizado sin detalles de esquema) y otros errores no controlados (HTTP 500 o código personalizado).

#### Scenario: Malformed JSON syntax error mapping
- **WHEN** un cliente envía un cuerpo JSON corrupto que falla al parsearse en `express.json()`
- **THEN** el sistema responde con código HTTP 400 y el mensaje "El formato JSON de la petición es inválido.".

#### Scenario: Database error sanitization
- **WHEN** ocurre una excepción originada en el motor SQLite (`SQLITE_*`)
- **THEN** el sistema responde con código HTTP 500 y el mensaje genérico "Error interno al procesar la operación de datos.", ocultando tablas y sentencias SQL.

#### Scenario: Oversized payload error mapping
- **WHEN** una petición supera el límite de 10kb configurado en el servidor
- **THEN** el sistema responde con código HTTP 413 y el mensaje "El tamaño de los datos enviados excede el límite permitido.".

### Requirement: Standardized Error JSON Response Structure
El sistema SHALL entregar la respuesta de error bajo la estructura JSON estandarizada `{ status: "error", code: statusCode, message: message, errors: [ { reason: detalle } ] }`.

#### Scenario: Deliver uniform error payload to client
- **WHEN** el middleware procesa cualquier fallo clasificado
- **THEN** la respuesta emitida al cliente coincide exactamente con el contrato JSON del proyecto.
