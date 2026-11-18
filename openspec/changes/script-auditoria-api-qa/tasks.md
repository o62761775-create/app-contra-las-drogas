# Tasks

## 1. Estructura y Scaffolding del Script de Auditoría

- [x] 1.1 Crear el archivo base `tests/api_audit.sh` con configuración de entorno (`set -e`, definición de colores ANSI, variables de configuración `BASE_URL`, `DB_FILE`, contadores de pruebas y funciones auxiliares de comprobación `assert_status`, `assert_header`, `assert_json_field`) y verificar su estructura sintáctica con `bash -n tests/api_audit.sh`.
- [x] 1.2 Implementar en `tests/api_audit.sh` la rutina de comprobación previa de conectividad contra `GET /api/healthcheck` y verificar que emite una advertencia clara cuando el servidor Express no está en ejecución.

## 2. Bloques de Pruebas Funcionales y de Anonimato

- [x] 2.1 Implementar el Bloque 1 en `tests/api_audit.sh` para auditar la disponibilidad de catálogos (`GET /api/healthcheck`, `GET /api/directorio`, `GET /api/directorio?tipo=Emergencia`, `GET /api/recursos`, `GET /api/recursos/1`, y caso negativo `GET /api/recursos/9999` esperando HTTP 404 estandarizado) y verificar que las aserciones validen códigos y estructura JSON.
- [x] 2.2 Implementar el Bloque 2 en `tests/api_audit.sh` para auditar solicitudes de orientación y anonimato (Caso A con datos completos esperando 201, Caso B omitiendo nombre y edad asignando 'Anónimo' esperando 201, y Caso C con prompt fuera de alcance verificando guardrail de redirección) y validar su respuesta.
- [x] 2.3 Implementar el Bloque 3 en `tests/api_audit.sh` para auditar métricas lúdicas (`POST /api/juegos/stats` esperando 201 y `GET /api/juegos/stats/resumen` esperando 200) y verificar la persistencia y agregación numérica.

## 3. Bloques de Pruebas de Ciberseguridad, Rendimiento e Integridad

- [x] 3.1 Implementar el Bloque 4 en `tests/api_audit.sh` para evaluar la robustez contra entradas maliciosas (payloads vacíos o strings en blanco esperando 400, JSON roto esperando 400, inyección SQL tratada de forma literal mediante parámetros y saneamiento de etiquetas `<script>` contra XSS almacenado) y comprobar que el servidor no crashee.
- [x] 3.2 Implementar el Bloque 5 en `tests/api_audit.sh` para auditar rate limiting (bucle de peticiones rápidas superando el umbral de 10 req/min esperando HTTP 429 Too Many Requests) y medir latencia de respuesta (< 200ms vía `curl -w "%{time_total}"`) según RNF-PER-01.
- [x] 3.3 Implementar el Bloque 6 en `tests/api_audit.sh` para auditar la privacidad en el archivo de base de datos SQLite (inspección de columnas para comprobar cero presencia de IPs o cookies) y verificar las cabeceras Helmet (`X-Content-Type-Options: nosniff`, `X-Frame-Options` y ausencia total de `X-Powered-By`).

## 4. Matriz de Auditoría y Verificación Final

- [x] 4.1 Elaborar la lista de verificación y matriz técnica de auditoría en `docs/audit_checklist.md` documentando la trazabilidad con el SRS/SAD, comandos exactos y resultados esperados.
- [x] 4.2 Otorgar permisos de ejecución al script (`chmod +x tests/api_audit.sh`) y ejecutar la suite completa validando que reporte todos los bloques aprobados con código de salida 0.
- [x] 4.3 Validar especificaciones con `openspec validate --all` y registrar los cambios mediante commit Git con Conventional Commits (`feat: agregar suite automatizada de pruebas y auditoria de seguridad con curl`).
