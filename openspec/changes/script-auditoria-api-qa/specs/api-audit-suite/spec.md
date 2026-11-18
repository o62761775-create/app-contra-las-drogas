# Spec Delta

## Purpose

Proporcionar una suite ejecutable de auditoría técnica y pruebas de caja negra automatizadas en Bash para validar el cumplimiento de los contratos REST, seguridad, rendimiento y privacidad por diseño del backend de la plataforma.

## ADDED Requirements

### Requirement: Automated Catalog and Healthcheck Auditing
La suite de auditoría SHALL verificar la disponibilidad operativa del servidor y la lectura íntegra de los catálogos públicos informativos mediante peticiones HTTP GET.

#### Scenario: Healthcheck endpoint returns HTTP 200 and operational status
- **WHEN** la suite ejecuta `curl -i -s http://localhost:3000/api/healthcheck`
- **THEN** la respuesta HTTP SHALL tener código 200 y contener `{"status":"success","code":200,"message":"Servidor operativo"}`

#### Scenario: Help directory listing returns HTTP 200 with contact records
- **WHEN** la suite consulta `curl -i -s http://localhost:3000/api/directorio`
- **THEN** la respuesta HTTP SHALL tener código 200 y una lista de líneas de marcación rápida activas

#### Scenario: Filtered directory listing returns HTTP 200 with matching category
- **WHEN** la suite consulta `curl -i -s "http://localhost:3000/api/directorio?tipo=Emergencia"`
- **THEN** la respuesta HTTP SHALL tener código 200 y listar únicamente contactos clasificados como Emergencia

#### Scenario: Educational resources retrieval returns HTTP 200 and negative check returns HTTP 404
- **WHEN** la suite consulta `GET /api/recursos`, `GET /api/recursos/1` y un recurso inexistente `GET /api/recursos/9999`
- **THEN** los recursos existentes responden HTTP 200 y el recurso inexistente responde HTTP 404 con mensaje unificado

### Requirement: Automated Anonymity and Guidance Flow Auditing
La suite de auditoría SHALL verificar el procesamiento de solicitudes de ayuda y orientación psicológica garantizando la preservación del anonimato y la activación de guardrails éticos.

#### Scenario: Complete help request submission returns HTTP 201 with orientation
- **WHEN** la suite envía `POST /api/solicitudes-ayuda` con `nombre`, `edad` y `mensaje` válidos
- **THEN** el servidor responde HTTP 201 Created retornando el identificador generado y la orientación orientativa

#### Scenario: Anonymous help request omits name and assigns anonymous identity
- **WHEN** la suite envía `POST /api/solicitudes-ayuda` omitiendo `nombre` y `edad` con un `mensaje` válido
- **THEN** el servidor responde HTTP 201 Created y persiste el registro con nombre 'Anónimo'

#### Scenario: Out of scope request triggers ethical guidance redirection
- **WHEN** la suite envía `POST /api/solicitudes-ayuda` con un mensaje ajeno a la salud mental o prevención
- **THEN** la respuesta HTTP SHALL ser 201 Created y el contenido de la respuesta redirige respetuosamente al propósito preventivo de la plataforma

### Requirement: Automated Game Metrics Auditing
La suite de auditoría SHALL verificar el registro de eventos lúdicos y la consulta del resumen consolidado de métricas sin asociar identidades de usuario.

#### Scenario: Game session record registration returns HTTP 201
- **WHEN** la suite envía `POST /api/juegos/stats` con `juego_id`, `duracion_segundos` y `nivel_alcanzado` válidos
- **THEN** el servidor responde HTTP 201 Created confirmando el registro de la métrica

#### Scenario: Aggregated game statistics summary returns HTTP 200
- **WHEN** la suite consulta `GET /api/juegos/stats/resumen`
- **THEN** el servidor responde HTTP 200 OK con el consolidado numérico de partidas y tiempo jugado

### Requirement: Automated Security and Input Sanitization Auditing
La suite de auditoría SHALL evaluar la resistencia del backend frente a entradas maliciosas, inyecciones de código y cargas corruptas.

#### Scenario: Blank or invalid input payloads return HTTP 400 with unified errors
- **WHEN** la suite envía `POST /api/solicitudes-ayuda` con mensaje vacío o edad fuera de rango
- **THEN** el servidor responde HTTP 400 Bad Request con estructura `{status:"error", code:400, errors:[...]}`

#### Scenario: Malformed JSON payload returns HTTP 400 without crashing server
- **WHEN** la suite envía una petición POST con sintaxis JSON rota o truncada
- **THEN** el servidor responde HTTP 400 Bad Request indicando formato JSON inválido

#### Scenario: SQL injection payload is neutralized by prepared statements
- **WHEN** la suite envía un mensaje con patrones de inyección SQL (`' OR '1'='1; DROP TABLE...`)
- **THEN** el texto es almacenado de forma literal mediante consultas parametrizadas sin alterar la base de datos

#### Scenario: Stored XSS vectors are neutralized and escaped
- **WHEN** la suite envía un nombre o mensaje con etiquetas `<script>` o caracteres HTML peligrosos
- **THEN** los caracteres son convertidos a entidades HTML seguras mitigando la ejecución de scripts

### Requirement: Automated Rate Limiting and Latency Benchmarking
La suite de auditoría SHALL certificar los mecanismos de protección contra saturación (DoS) y el cumplimiento de las metas de rendimiento temporal.

#### Scenario: Exceeding request rate limit triggers HTTP 429 Too Many Requests
- **WHEN** la suite ejecuta un bucle de más de 10 peticiones por minuto desde el mismo cliente hacia `/api/*`
- **THEN** las peticiones que exceden la cuota son rechazadas con HTTP 429 Too Many Requests

#### Scenario: Local response latency remains below 200 milliseconds
- **WHEN** la suite mide la latencia de respuesta en endpoints REST locales utilizando `curl -w "%{time_total}"`
- **THEN** el tiempo de respuesta total SHALL ser inferior a 200 milisegundos satisfaciendo RNF-PER-01

### Requirement: Automated Privacy and Security Headers Auditing
La suite de auditoría SHALL certificar la política de cero recolección de datos personales y la presencia de cabeceras de blindaje HTTP.

#### Scenario: Database schema and tables contain zero IP or tracking fields
- **WHEN** la suite audita las columnas de las tablas `solicitudes_ayuda` y `estadisticas_juego` en SQLite
- **THEN** ninguna columna ni registro contiene direcciones IP, huellas de navegador ni identificadores de red

#### Scenario: Helmet security headers are present and identity disclosure is suppressed
- **WHEN** la suite inspecciona las cabeceras HTTP de cualquier respuesta del servidor
- **THEN** la cabecera `X-Content-Type-Options: nosniff` está presente y `X-Powered-By` está ausente
