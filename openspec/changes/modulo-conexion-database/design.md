# Design

## Context

Para que los controladores REST y servicios del backend interactúen con la persistencia relacional, el proyecto requiere un módulo centralizado (`config/database.js`) que encapsule la conexión a SQLite3. El estándar de desarrollo prohíbe la manipulación directa de la base de datos o la concatenación de cadenas SQL en los controladores, exigiendo el uso obligatorio de consultas preparadas (`?`) y el aprovechamiento del modo WAL para concurrencia. (Ver `proposal.md` y `specs/sqlite-client/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar `config/database.js` en CommonJS con sintaxis ES6+.
- Abrir la base de datos en `src/database/database.sqlite` garantizando la creación de directorios.
- Activar de inmediato `PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`.
- Crear `inicializarBaseDeDatos()` para aplicar el DDL de `src/database/schema.sql` con `db.exec()`.
- Exportar wrappers en Promesas (`runQuery`, `getQuery`, `allQuery`) que obliguen al uso de parámetros vinculados.
- Manejar el cierre ordenado de la base de datos ante la señal `SIGINT`.

**Non-Goals:**
- Introducir un ORM pesado (Sequelize, TypeORM, Prisma); la arquitectura estipula SQLite3 nativo ligero.
- Manejar lógica de controladores o serialización de respuestas HTTP en este módulo.

## Decisions

### 1. Conexión Persistente y Modo WAL
- **Decisión:** Mantener una única instancia de conexión activa (`singleton`) exportada para la aplicación.
- **Justificación:** SQLite opera de forma óptima en un solo proceso con una única conexión persistente cuando está en modo WAL (Write-Ahead Logging). Esto permite que múltiples peticiones lean concurrentemente sin bloquear a los lectores mientras se realiza una escritura.

### 2. Encapsulamiento en Promesas Nativas
- **Decisión:** Envolver los métodos basados en callbacks de `sqlite3` (`run`, `get`, `all`) en Promesas estándar de JavaScript:
  - `runQuery`: Resuelve `{ id: this.lastID, changes: this.changes }` accediendo al contexto de la función callback tradicional de `db.run`.
  - `getQuery`: Resuelve con la fila (`row`) o `undefined`.
  - `allQuery`: Resuelve con el arreglo de filas (`rows`).
- **Justificación:** Permite el uso fluido de `async/await` y bloques `try...catch` en los controladores, garantizando el paso de parámetros sanitizados (`params = []`).

### 3. Idempotencia y Carga de Esquema
- **Decisión:** La función `inicializarBaseDeDatos()` lee `src/database/schema.sql` usando `fs.readFileSync` (o equivalente) y lo pasa a `db.exec()`.
- **Justificación:** Dado que `schema.sql` usa `CREATE TABLE IF NOT EXISTS` e `INSERT OR IGNORE`, la inicialización se puede invocar de forma segura al arrancar el servidor sin riesgo de borrar o duplicar información.

### 4. Cierre Limpio (Graceful Shutdown)
- **Decisión:** Suscribirse al evento `SIGINT` del proceso para ejecutar `db.close()`.
- **Justificación:** En modo WAL, cerrar la conexión ordenadamente asegura que las páginas del archivo `-wal` se sincronicen (*checkpoint*) con el archivo principal `database.sqlite`.

## Risks / Trade-offs

- **[Riesgo de bloqueo de base de datos por escrituras concurrentes intensivas]** → *Mitigación:* Modo WAL reduce los bloqueos a mínimos imperceptibles para la escala esperada del proyecto.
- **[Riesgo de pérdida de contexto `this` en `db.run`]** → *Mitigación:* La función callback interna de `runQuery` se implementa con `function(err)` convencional en lugar de función flecha para conservar `this.lastID` y `this.changes`.
