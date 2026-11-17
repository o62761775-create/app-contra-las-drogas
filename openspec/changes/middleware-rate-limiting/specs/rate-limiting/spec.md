# Spec Delta

## Purpose

Define el middleware de control de tasa (rate limiting) en memoria volátil para mitigar ataques de denegación de servicio y proteger la cuota de servicios externos, manteniendo anonimato estricto y respuestas estandarizadas.

## ADDED Requirements

### Requirement: General API Rate Limiting Configuration
El sistema SHALL proveer un middleware de limitación general `apiLimiter` que restrinja el tráfico a un máximo de 10 peticiones por ventana de 60 segundos (`windowMs: 60000`), almacenando contadores en memoria volátil, emitiendo cabeceras estándar `RateLimit-*` y omitiendo el registro de IPs.

#### Scenario: Normal traffic within general limits
- **WHEN** un cliente realiza hasta 10 peticiones dentro de un intervalo de 1 minuto
- **THEN** el middleware permite el paso a los controladores y adjunta cabeceras `RateLimit-*` con la cuota restante.

### Requirement: Standardized Error Response on Rate Limit Exceeded
El sistema SHALL interceptar cualquier petición que exceda el umbral permitido y responder con código HTTP 429 Too Many Requests bajo la estructura JSON homogénea `{ status: "error", code: 429, message, errors: [{ reason }] }`.

#### Scenario: Client exceeds request threshold
- **WHEN** un cliente envía una petición adicional superando el límite de 10 peticiones en 1 minuto
- **THEN** el servidor bloquea la solicitud retornando código HTTP 429 y el payload JSON estandarizado sin registrar la IP en consola ni en almacenamiento.

### Requirement: Strict Rate Limiting for AI Integration Endpoints
El sistema SHALL proveer un middleware específico `iaLimiter` configurado con una ventana de 60 segundos y un límite de 5 peticiones (`max: 5`) para endpoints que consumen la API de OpenAI, devolviendo una respuesta HTTP 429 empática ante excesos.

#### Scenario: AI quota protection threshold
- **WHEN** un cliente intenta enviar más de 5 solicitudes de ayuda asistida en 1 minuto
- **THEN** el middleware `iaLimiter` responde con HTTP 429 protegiendo la cuota externa del servicio de inteligencia artificial.
