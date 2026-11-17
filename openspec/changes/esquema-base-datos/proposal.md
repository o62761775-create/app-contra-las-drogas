# Proposal

## Why

Para habilitar la persistencia de datos de la plataforma "Videojuegos contra las Drogas", es indispensable definir el esquema relacional en SQLite3 que sirva como base para los módulos funcionales de ayuda, directorio de contactos, métricas lúdicas y recursos educativos. Este esquema debe modelarse bajo el principio de privacidad y anonimato por diseño, asegurando que ninguna estructura de datos almacene identificadores personales o de red.

Justificación trazable con el SRS:
- **RF-01 (Solicitudes de Ayuda):** Soporte de almacenamiento para consultas y respuestas orientativas mediante la tabla `solicitudes_ayuda`.
- **RF-03 (Directorio y Marcación Rápida):** Persistencia de líneas de asistencia y centros en la tabla `directorio_contactos`.
- **RF-04 (Minijuegos Preventivos):** Métricas agregadas de juego anónimas en `estadisticas_juego`.
- **RF-05 y REQ-MS-01 (Contenido Informativo Objetivo):** Almacenamiento de fichas científicas y preventivas en `recursos_educativos`.
- **RNF-SEC-01 y REQ-MS-02 (Privacidad y Anonimato Estricto):** Cero campos de IP, correo o datos personales rastreables; alias opcional con valor por defecto `'Anónimo'`.

## What Changes

- Creación del archivo de definición de datos `schema.sql` en `src/database/schema.sql` (y respaldo en `database/schema.sql`).
- Creación idempotente (`CREATE TABLE IF NOT EXISTS`) de las 4 tablas principales con llaves primarias `INTEGER PRIMARY KEY AUTOINCREMENT`:
  1. `solicitudes_ayuda`: consultas de orientación, alias opcional, validación de edad y respuesta generada.
  2. `directorio_contactos`: catálogo de líneas de emergencia, teléfonos de marcación rápida, tipo de servicio y horarios.
  3. `estadisticas_juego`: métricas de jugabilidad (juego, puntaje, duración y estado de completado) sin vínculo a usuario.
  4. `recursos_educativos`: fichas informativas categorizadas por sustancia y temática de salud.
- Incorporación de datos semilla (`INSERT OR IGNORE`) con 3 contactos de emergencia reales y 3 fichas educativas basadas en evidencia y libres de estigmas.

### Alcance
- Script DDL completo, comentado e idempotente para SQLite3.
- Inserción de semillas iniciales verificando no duplicación.

### Fuera de Alcance
- Código de conexión y ejecución desde Node.js (`config/database.js`).
- Lógica de controladores o rutas REST que consuman las tablas.
- Archivo binario de base de datos (`database.sqlite`), el cual permanece excluido en `.gitignore`.

## Capabilities

### New Capabilities
- `sqlite-schema`: Definición DDL del modelo de datos relacional en SQLite3, restricciones de anonimato, tablas del dominio y semillas iniciales.

### Modified Capabilities
*(Ninguna; expande el diseño del backend).*

## Impact

- **Datos y Persistencia:** Define el contrato formal de persistencia para todos los repositorios y servicios del backend.
- **Privacidad:** Garantiza a nivel estructural la imposibilidad de persistir direcciones IP o identidades reales.
