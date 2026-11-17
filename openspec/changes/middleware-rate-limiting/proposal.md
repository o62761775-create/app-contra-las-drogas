# Proposal

## Why

Para proteger la disponibilidad de la plataforma "Videojuegos contra las Drogas" frente a ataques de denegación de servicio (DoS), sondeos automatizados y consumo abusivo de la API externa de OpenAI, se requiere implementar un middleware de control de tasa (*Rate Limiting*). Esta capa de seguridad debe mitigar el tráfico excesivo sin comprometer la política de anonimato estricto, manteniendo los contadores en memoria volátil y respondiendo con el formato JSON unificado del proyecto ante excesos de cuota.

Justificación trazable con el SRS:
- **RNF-SEC-02 (Seguridad HTTP y Protección contra Abuso):** Implementación de limitación de tasa obligatoria en endpoints públicos mediante `express-rate-limit`.
- **RNF-PER-01 (Rendimiento del Servidor):** Preserva la estabilidad del event loop y los tiempos de respuesta por debajo de 200ms evitando la saturación del servidor.
- **RNF-SEC-01 y REQ-MS-02 (Privacidad y Anonimato):** Uso exclusivo del almacén en memoria volátil; prohibición expresa de registrar o persistir direcciones IP en disco, base de datos o logs.
- **RF-01 y RNF-SEC-03 (Protección de Cuota de IA):** Limitador estricto (`iaLimiter`, 5 req/min) diseñado para salvaguardar el endpoint `/api/solicitudes-ayuda` y prevenir el agotamiento de saldo en la API de OpenAI.

## What Changes

- Creación del archivo `src/middleware/rateLimiter.js`.
- Configuración de `apiLimiter`: limitador general de 10 peticiones por ventana de 1 minuto (`windowMs: 60000`, `max: 10`) para rutas generales de la API.
- Configuración de `iaLimiter`: limitador específico más restrictivo (5 peticiones por ventana de 1 minuto) para endpoints que consumen OpenAI.
- Configuración de cabeceras HTTP: `standardHeaders: true` (`RateLimit-*`) y `legacyHeaders: false` (`X-RateLimit-*`).
- Manejador personalizado (`handler`) que retorna HTTP 429 con el contrato de error homogéneo:
  `{ status: "error", code: 429, message: "...", errors: [{ reason: "..." }] }`.
- Almacenamiento en memoria volátil (MemoryStore) sin persistencia de IPs ni logging en consola.

### Alcance
- Implementación completa, comentada y documentada del archivo `src/middleware/rateLimiter.js`.
- Verificación de la estructura de limitadores y respuestas estándar HTTP 429.

### Fuera de Alcance
- Montaje del middleware en el router Express (`src/routes/api.routes.js`).
- Implementación de stores distribuidos (Redis/Memcached), dado que la arquitectura estipula una solución nativa ligera en proceso único.

## Capabilities

### New Capabilities
- `rate-limiting`: Control de tasa de peticiones en memoria volátil para endpoints REST generales y servicios de IA, con cabeceras estándar IETF y respuestas de error 429 unificadas.

### Modified Capabilities
*(Ninguna).*

## Impact

- **Código:** Introduce el middleware de seguridad en `src/middleware/rateLimiter.js`.
- **Seguridad:** Previene ataques de fuerza bruta, spam y denegación de servicio.
- **Privacidad:** Garantiza que no se generen registros persistentes de direcciones IP.
