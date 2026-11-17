# Design

## Context

Para mitigar riesgos de DoS, saturación del backend y sobrecostos por consumo desmedido de la API de OpenAI, el proyecto requiere un middleware de control de tasa en `src/middleware/rateLimiter.js`. En conformidad con RNF-SEC-01 y REQ-MS-02, el middleware debe ser no persistente para no comprometer el anonimato de los usuarios. (Ver `proposal.md` y `specs/rate-limiting/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar `src/middleware/rateLimiter.js` usando CommonJS y sintaxis ES6+.
- Configurar `apiLimiter` con umbral de 10 peticiones/minuto para rutas estándar de la API.
- Configurar `iaLimiter` con umbral más estricto de 5 peticiones/minuto para endpoints con IA.
- Configurar cabeceras IETF modernas (`standardHeaders: true`) y desactivar las obsoletas (`legacyHeaders: false`).
- Manejar respuestas HTTP 429 bajo la estructura JSON homogénea `{ status: "error", code: 429, message, errors }`.
- Preservar el anonimato total operando en memoria volátil sin registrar IPs en consola ni en almacenamiento persistente.

**Non-Goals:**
- Configurar almacenamiento distribuido en Redis/Memcached (la arquitectura es autosuficiente y monoproceso).
- Montar las rutas finales de la API (será responsabilidad de `src/routes/api.routes.js`).

## Decisions

### 1. Librería Base: `express-rate-limit` (^7.0.0)
- **Decisión:** Emplear `express-rate-limit` ya incorporado en `package.json`.
- **Compatibilidad CommonJS:** Se resuelve la función mediante:
  ```javascript
  const rateLimitModule = require('express-rate-limit');
  const rateLimit = rateLimitModule.rateLimit || rateLimitModule;
  ```
- **Justificación:** Garantiza máxima compatibilidad con las diferentes variantes de exportación de CommonJS en versiones modernas de la biblioteca.

### 2. Estrategia de Doble Limitador (General vs IA)
- **`apiLimiter` (10 req/min):**
  - Aplicable a endpoints ligeros como directorio, recursos y registro de estadísticas de juego.
  - Mitiga scraping y bombardeo de peticiones.
- **`iaLimiter` (5 req/min):**
  - Aplicable al endpoint de orientación `/api/solicitudes-ayuda`.
  - Protege la cuota del token de OpenAI y previene abusos de costo computacional.

### 3. Almacenamiento Volátil y Anonimato
- **Decisión:** Mantener el `MemoryStore` nativo en memoria RAM.
- **Justificación:** La política del proyecto prohíbe persistir IPs o identificadores de clientes. Al utilizar almacenamiento volátil en memoria del proceso, los contadores expiran automáticamente al cumplirse la ventana (`windowMs`) y no dejan ningún rastro forense o histórico de red en disco o SQLite.

### 4. Estructura de Salida Estandarizada
- **Respuesta 429 Uniforme:**
  ```json
  {
    "status": "error",
    "code": 429,
    "message": "Has realizado demasiadas solicitudes en poco tiempo. Por favor, espera un minuto antes de intentar nuevamente.",
    "errors": [
      {
        "reason": "Límite de 10 peticiones por minuto excedido."
      }
    ]
  }
  ```

## Risks / Trade-offs

- **[Riesgo de reseteo de contadores ante reinicio del servidor]** → *Mitigación:* Aceptable y deseado; el almacenamiento en memoria volátil prioriza el anonimato sobre la persistencia de cuotas entre reinicios.
- **[Riesgo de bloqueo conjunto tras proxy inverso común]** → *Mitigación:* Se configurará adecuadamente la detección de cliente sin vulnerar la sanitización de cabeceras en producción.
