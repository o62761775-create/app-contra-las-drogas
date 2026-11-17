# Tasks

## 1. Conexión y Optimización SQLite3

- [x] 1.1 Configurar la resolución de rutas absolutas (`database.sqlite`, `schema.sql`) y la creación preventiva del directorio `src/database/` en `config/database.js`, verificando el manejo de rutas.
- [x] 1.2 Instanciar la base de datos con `sqlite3.verbose().Database` y ejecutar inmediatamente `PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`, verificando el log en consola.

## 2. Inicialización DDL y Wrappers de Consultas Preparadas

- [x] 2.1 Implementar la función `inicializarBaseDeDatos()` para leer y aplicar `src/database/schema.sql` mediante `db.exec()`, verificando el manejo de excepciones.
- [x] 2.2 Implementar y exportar las funciones helper envueltas en Promesas (`runQuery`, `getQuery`, `allQuery`) vinculando parámetros mediante `?`, verificando la resolución de resultados.

## 3. Cierre Seguro y Control de Versiones

- [x] 3.1 Registrar el manejador de la señal `SIGINT` para cerrar la conexión de forma ordenada (`db.close()`), verificando la salida limpia del proceso.
- [x] 3.2 Ejecutar `openspec validate --all` para comprobar la integridad de todos los artefactos de OpenSpec.
- [x] 3.3 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: implementar modulo central de conexion a base de datos sqlite con modo wal y promesas`.
