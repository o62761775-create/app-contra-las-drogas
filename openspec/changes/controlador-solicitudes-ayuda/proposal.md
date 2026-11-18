# Proposal

## Why

Para materializar el caso de uso central de la plataforma "Videojuegos contra las Drogas" (RF-01: Asistente conversacional de orientación preventiva), es indispensable contar con el controlador backend `src/controllers/ayuda.controller.js`. Este controlador coordina la interacción entre la petición HTTP del usuario, el servicio de inteligencia artificial generativa (OpenAI) y la persistencia segura en la base de datos relacional SQLite3, respetando de forma inflexible las políticas de anonimato por diseño y prevención de inyección SQL.

Justificación trazable con el SRS:
- **RF-01 (Solicitudes de Ayuda y Orientación):** Orquestación del flujo de recepción de consultas, invocación del servicio de IA pasando `mensaje` y `edad`, y devolución de la orientación generada al usuario.
- **RNF-SEC-01 y REQ-MS-02 (Anonimato Estricto):** Cero registro o persistencia de direcciones IP, User-Agent o huellas digitales del cliente; salvaguarda explícita de `nombreFinal = nombre || 'Anónimo'` y `edadFinal = edad ?? null`.
- **RNF-SEC-02 (Prevención de Inyección SQL):** Inserción exclusiva en la tabla `solicitudes_ayuda` mediante consultas preparadas con marcadores de posición (`?`) consumidas a través del helper `runQuery` de `config/database.js`.
- **Estándar de Arquitectura y Respuestas:** Separación estricta de responsabilidades (controlador desacoplado de la conexión física a la base de datos), captura de excepciones con `try...catch` delegando a `next(error)` y retorno homogéneo de respuesta HTTP 201 Created.

## What Changes

- Creación del archivo `src/controllers/ayuda.controller.js` utilizando CommonJS (`require` / `module.exports`) y sintaxis moderna ES6+ (`const`, `async/await`, desestructuración).
- Importación desacoplada de la función `runQuery` desde `../../config/database` (o `../config/database` según ruta relativa estándar) y de `generarOrientacion` desde `../services/openai.service`.
- Implementación de la función asíncrona `crearSolicitudAyuda(req, res, next)`:
  1. Extracción de `nombre`, `edad` y `mensaje` desde `req.body`, con salvaguarda defensiva para asegurar anonimato (`nombreFinal = nombre || 'Anónimo'` y `edadFinal = edad ?? null`).
  2. Llamada asíncrona a `generarOrientacion(mensaje, edadFinal)`.
  3. Ejecución de la sentencia preparada `INSERT INTO solicitudes_ayuda (nombre, edad, mensaje, respuesta) VALUES (?, ?, ?, ?)` mediante `runQuery`.
  4. Retorno de respuesta HTTP 201 Created con el contrato uniforme `{ status: "success", code: 201, message: "Solicitud registrada correctamente.", data: { id, orientacion } }`.
  5. Captura y propagación de errores inesperados hacia el middleware global mediante `next(error)`.

### Alcance
- Creación, tipado y exportación de `crearSolicitudAyuda` en `src/controllers/ayuda.controller.js`.
- Pruebas y verificación de integración conceptual del controlador con `runQuery` y `generarOrientacion`.

### Fuera de Alcance
- Implementación del servicio de OpenAI (`src/services/openai.service.js`).
- Enrutamiento HTTP en `src/routes/api.routes.js`.
- Middlewares de validación (`src/middleware/validator.js`) o manejo de tasa (`src/middleware/rateLimiter.js`).

## Capabilities

### New Capabilities
- `help-requests`: Controlador del ciclo de vida de solicitudes de ayuda, orquestando la generación de orientación asistida por IA y la persistencia relacional anónima con respuestas HTTP 201 estandarizadas.

### Modified Capabilities
*(Ninguna; introduce la capacidad de orquestación del flujo de ayuda).*

## Impact

- **Capa de Controladores:** Establece el primer controlador REST de negocio del backend siguiendo los estándares arquitectónicos del proyecto.
- **Persistencia:** Realiza escrituras parametrizadas en la tabla `solicitudes_ayuda` sin acoplarse directamente al driver `sqlite3`.
- **Seguridad y Privacidad:** Garantiza el anonimato total al omitir cualquier metadato de red o identificación personal.
