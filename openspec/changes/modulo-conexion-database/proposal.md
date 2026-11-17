# Proposal

## Why

Para comunicar la capa de controladores REST con la base de datos relacional SQLite3, el sistema requiere un módulo centralizado (`config/database.js`) que actúe como único punto de acceso y abstracción a la persistencia. Este conector debe optimizar la concurrencia en disco mediante el modo WAL (Write-Ahead Logging), asegurar la integridad referencial y proveer una interfaz basada en Promesas con consultas preparadas obligatorias (`?`), eliminando cualquier riesgo de Inyección SQL.

Justificación trazable con el SRS:
- **RNF-PER-01 y Restricción de Entorno SQLite (SRS Sección 2.3):** Concurrencia optimizada mediante `PRAGMA journal_mode = WAL;`, permitiendo lecturas concurrentes sin bloquear escrituras para sostener tiempos de respuesta <200ms.
- **RNF-SEC-01 y REQ-MS-02 (Seguridad y Buenas Prácticas):** Erradicación de Inyección SQL forzando consultas preparadas parametrizadas en `runQuery`, `getQuery` y `allQuery`.
- **Habilitador de RF-01, RF-03, RF-04 y RF-05:** Conector asíncrono (`async/await`) para registrar solicitudes, consultar directorio, persistir estadísticas y listar recursos.

## What Changes

- Creación del archivo `config/database.js`.
- Resolución de rutas absolutas para el archivo de datos (`src/database/database.sqlite`) y el esquema DDL (`src/database/schema.sql`).
- Creación automática del directorio `src/database/` mediante `fs.mkdirSync(..., { recursive: true })` antes de la conexión.
- Apertura de la instancia SQLite3 en modo `.verbose()`.
- Ejecución inmediata de directivas de optimización e integridad: `PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`.
- Función `inicializarBaseDeDatos()` para leer y aplicar `schema.sql` mediante `db.exec()`.
- Abstracción de consultas en Promesas nativas:
  - `runQuery(sql, params)`: para sentencias `INSERT`, `UPDATE`, `DELETE` con `{ id, changes }`.
  - `getQuery(sql, params)`: para lecturas `SELECT` de registro único.
  - `allQuery(sql, params)`: para lecturas `SELECT` de múltiples registros.
- Gestión de apagado controlado (*Graceful Shutdown*) cerrando la conexión en eventos `SIGINT`.

### Alcance
- Implementación completa, comentada y tipada del módulo `config/database.js`.
- Verificación de la inicialización de SQLite y ejecución del esquema DDL.

### Fuera de Alcance
- Definición de tablas y datos semilla (definidos en `schema.sql`).
- Implementación de controladores REST (`src/controllers/`).

## Capabilities

### New Capabilities
- `sqlite-client`: Conector singleton a SQLite3, optimización de concurrencia WAL, inicialización de esquema y helpers asíncronos con consultas preparadas.

### Modified Capabilities
*(Ninguna).*

## Impact

- **Código:** Introduce el módulo base de persistencia para todos los controladores y servicios.
- **Rendimiento:** Habilita el modo WAL para alta concurrencia en lecturas/escrituras.
- **Seguridad:** Garantiza el estándar obligatorio de consultas parametrizadas con marcadores `?`.
