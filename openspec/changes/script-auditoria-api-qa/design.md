# Design

## Context

El backend de la plataforma "Videojuegos contra las Drogas" está estructurado en Express.js con persistencia SQLite3 y middlewares dedicados a la seguridad, validación de entrada, limitación de peticiones y preservación estricta del anonimato. Véase `proposal.md` para la justificación y trazabilidad con el SRS/SAD.

Para auditar y validar estas capacidades sin añadir peso de dependencias a producción ni acoplarse a frameworks de pruebas internos, se diseña un arnés de pruebas de caja negra ejecutable desde terminal (`tests/api_audit.sh`), apoyado en `curl` y herramientas estándar POSIX.

## Goals / Non-Goals

**Goals:**
- Proporcionar un script ejecutable Bash (`tests/api_audit.sh`) con formato visual claro, banners explicativos por sección, código de colores ANSI y conteo de pruebas aprobadas (`PASS`) y reprobadas (`FAIL`).
- Cubrir los 6 bloques de verificación técnica definidos en la especificación:
  1. Catálogos y Healthcheck (disponibilidad y contratos GET).
  2. Solicitudes de Ayuda y Anonimato (casos A, B y C de guardrail ético).
  3. Registro y resumen de métricas lúdicas (POST y GET).
  4. Robustez de seguridad (captura de JSON corrupto, validación de campos, saneamiento XSS y neutralización de inyección SQL).
  5. Protección contra saturación (bucle forzando HTTP 429) y auditoría de latencia (< 200ms vía `curl -w`).
  6. Privacidad en base de datos SQLite (inspección de esquema para certificar cero campos de IP o rastreo) y cabeceras de blindaje Helmet (`nosniff`, ausencia de `X-Powered-By`).
- Retornar código de salida `0` si todas las pruebas pasan y `1` si hay fallos, permitiendo su integración directa en flujos de integración continua (CI/CD).
- Documentar una matriz de verificación y auditoría técnica de QA con los resultados esperados.

**Non-Goals:**
- No introducir librerías externas de testing (como Jest, Mocha o Supertest) en `package.json` para no inflar dependencias.
- No alterar ni refactorizar el código fuente en producción del backend.
- No realizar pruebas de carga masiva distribuida ni emulación de interacción en navegador (reservado para pruebas e2e en fases posteriores).

## Decisions

### Decisión 1: Automatización mediante Bash y `curl` nativo frente a frameworks Node.js
- **Elección:** Implementar la suite como un script de shell `tests/api_audit.sh` utilizando `curl` y expresiones regulares POSIX (`grep`, `awk`, `sed`).
- **Razón:** Proporciona pruebas de caja negra 100% fidedignas a nivel de protocolo HTTP de red, idénticas a las peticiones reales que emitirá el cliente web o un atacante externo. Funciona de manera portable en entornos Linux, macOS, WSL y Git Bash en Windows sin requerir compilación ni transpilación.
- **Alternativas consideradas:** Jest / Supertest. Se descartaron para mantener `package.json` limpio y ligero, evitando overhead de librerías de prueba en esta fase de auditoría técnica.

### Decisión 2: Estructura modular de aserciones en el script
- **Elección:** Definir funciones auxiliares de comprobación (`assert_status`, `assert_header`, `assert_contains`, `assert_db_clean`) que procesen las cabeceras y cuerpos capturados por `curl -s -i`.
- **Razón:** Centraliza la lógica de validación, el formateo de salida (verde/rojo) y el incremento atómico de contadores de éxito/fallo, evitando código duplicado en los 6 bloques de prueba.
- **Alternativas consideradas:** Comandos `curl` sueltos en un README. Se descartó porque no permite la ejecución desatendida ni el cálculo automatizado del estado final de la auditoría.

### Decisión 3: Orden de ejecución estratégico para el Rate Limiting
- **Elección:** Ejecutar las pruebas de saturación y HTTP 429 en el Bloque 5, inmediatamente antes de la auditoría estática de SQLite y cabeceras.
- **Razón:** Si se probara el límite de tasa al inicio del script, la IP local quedaría bloqueada temporalmente con HTTP 429 durante un minuto, haciendo fallar artificialmente las pruebas funcionales de catálogos y solicitudes de ayuda.
- **Alternativas consideradas:** Desactivar el rate limiter en tests. Se descartó porque invalidaría la auditoría de seguridad del middleware en producción.

### Decisión 4: Tolerancia y resiliencia ante el servicio de OpenAI
- **Elección:** Las pruebas del Bloque 2 (`POST /api/solicitudes-ayuda`) esperan HTTP 201 Created tanto si la API de OpenAI está en línea como si entra en acción el mecanismo de respuesta de emergencia/fallback implementado en `openai.service.js`.
- **Razón:** Garantiza que la auditoría no falle si el entorno de prueba no cuenta temporalmente con conectividad a internet o saldo activo en la API de OpenAI.

## Risks / Trade-offs

- **[Riesgo: Servidor no iniciado antes de ejecutar la suite]** → **Mitigación:** El script ejecuta al inicio una verificación de conectividad contra `GET /api/healthcheck`. Si el servidor no responde, imprime una alerta detallada indicando al auditor que ejecute `npm start` en una terminal paralela y finaliza con código 1 de forma limpia.
- **[Riesgo: Entornos Windows sin soporte nativo de Bash]** → **Mitigación:** El script está diseñado para compatibilidad estricta con Git Bash (incluido habitualmente con Git para Windows), WSL o MSYS2, documentando el comando exacto en las instrucciones de uso.
- **[Riesgo: Polución de datos de prueba en la base de datos SQLite]** → **Mitigación:** Los payloads de prueba utilizan marcadores descriptivos y valores válidos de prueba que no interfieren con la integridad referencial ni la coherencia estadística del sistema.
