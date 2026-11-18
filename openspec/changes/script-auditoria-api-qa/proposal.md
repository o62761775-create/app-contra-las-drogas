# Proposal

## Why

Para certificar la calidad, robustez y seguridad del backend de la plataforma "Videojuegos contra las Drogas", es imprescindible contar con una suite de pruebas de caja negra automatizable en Bash (`tests/api_audit.sh`) y una matriz de auditoría de ciberseguridad. Este conjunto de pruebas valida de forma reproducible que el servidor Express y la base de datos SQLite3 cumplan a cabalidad con la Matriz de Trazabilidad Técnica del SRS y SAD: lectura de catálogos, privacidad por diseño, mitigación de inyecciones XSS y SQL, respuesta ante payloads maliciosos, límites de tasa y cabeceras de seguridad HTTP.

Justificación trazable con el SRS:
- **RF-01 / RF-02 (Orientación Asistida y Guardrails de IA):** Validación de solicitudes completas (201), anonimato obligatorio asignando `'Anónimo'` (201) y guardrail de rechazo educado ante prompts ajenos a la salud y prevención.
- **RF-03 (Directorio de Ayuda):** Consulta de líneas de marcación rápida (`GET /api/directorio`) y filtrado por tipo de servicio.
- **RF-04 (Métricas Lúdicas):** Registro de estadísticas anónimas (`POST /api/juegos/stats`) y consulta de métricas agregadas (`GET /api/juegos/stats/resumen`).
- **RF-05 (Recursos Educativos):** Listado y lectura individual de fichas (`GET /api/recursos`, `GET /api/recursos/:id`), y respuesta 404 ante identificadores inexistentes.
- **RNF-SEC-01 y REQ-MS-02 (Auditoría de Privacidad y Anonimato):** Verificación por script de las tablas `solicitudes_ayuda` y `estadisticas_juego`, certificando la ausencia absoluta de columnas o datos de IPs o cookies.
- **RNF-SEC-02 (Ciberseguridad y Resiliencia):** Pruebas de inyección SQL, saneamiento de etiquetas `<script>` (XSS almacenado), captura de JSON corrupto (400) y verificación de cabeceras Helmet (`X-Content-Type-Options: nosniff`, `X-Frame-Options`, descarte de `X-Powered-By`).
- **RNF-PER-01 y RNF-SEG-01 (Rendimiento y Rate Limiting):** Bucle de sobrecarga forzando HTTP 429 Too Many Requests y medición de latencia inferior a 200ms en red local con `curl -w`.

## What Changes

- Creación del script ejecutable `tests/api_audit.sh` modular y estructurado con colores y códigos de salida para ejecución desatendida en entornos Bash/Linux/Mac/Git Bash.
- Incorporación de pruebas en 6 bloques temáticos:
  1. Catálogos y Healthcheck (HTTP 200 y 404).
  2. Módulo de Ayuda y Anonimato (Casos A, B y C de guardrail).
  3. Métricas de Videojuegos (POST y agregación GET).
  4. Seguridad, XSS, Inyección SQL y JSON malformado (HTTP 400 y neutralización).
  5. Rate Limiting (bucle HTTP 429) y auditoría de tiempo de respuesta (< 200ms).
  6. Auditoría de esquema SQLite (cero IPs) y cabeceras Helmet.
- Elaboración de una lista de verificación y matriz de auditoría técnica documentada con resultados esperados.

### Alcance
- Script `tests/api_audit.sh` ejecutable con `curl` y utilidades POSIX estándar.
- Matriz de verificación técnica en la documentación del cambio.

### Fuera de Alcance
- Modificación del código fuente del backend (`server.js`, rutas o controladores).
- Pruebas de estrés masivo distribuido (ej. JMeter, k6) o suites de UI con navegadores.

## Capabilities

### New Capabilities
- `api-audit-suite`: Suite automatizable de auditoría y pruebas funcionales de seguridad, rendimiento, anonimato y contratos REST mediante scripts de terminal basados en `curl`.

### Modified Capabilities
*(Ninguna; incorpora la capacidad de pruebas y aseguramiento de calidad).*

## Impact

- **Calidad y Verificación:** Permite verificar en cualquier momento la conformidad del backend antes de despliegues.
- **Cumplimiento de Privacidad:** Automatiza la comprobación de que ninguna tabla o log retenga identificadores personales.
- **Seguridad Comprobada:** Valida activamente que las defensas contra XSS, SQLi y DoS estén operativas.
