# Spec Delta

## Purpose

Define el conector de base de datos SQLite3 para Node.js, la configuración de concurrencia WAL, la inicialización automática del esquema DDL y la interfaz de promesas con consultas preparadas.

## ADDED Requirements

### Requirement: Persistent Connection and WAL Optimization
El sistema SHALL abrir una conexión persistente a la base de datos en `src/database/database.sqlite` garantizando la creación previa del directorio contenedor y ejecutando de forma inmediata las directivas `PRAGMA journal_mode = WAL;` y `PRAGMA foreign_keys = ON;`.

#### Scenario: Open connection with WAL mode
- **WHEN** se carga el módulo `config/database.js`
- **THEN** la conexión SQLite se abre exitosamente y el modo de registro queda configurado en WAL.

### Requirement: Automated Schema Initialization
El sistema SHALL exponer la función `inicializarBaseDeDatos()` que lea el archivo DDL `src/database/schema.sql` y ejecute su contenido mediante `db.exec()`, registrando el progreso y manejando excepciones de ejecución.

#### Scenario: Execute schema bootstrap
- **WHEN** se invoca la función `inicializarBaseDeDatos()`
- **THEN** las sentencias DDL se aplican sobre la base de datos y se informa el resultado en consola.

### Requirement: Promise-Wrapped Prepared Query Execution
El sistema SHALL proveer y exportar las funciones auxiliares `runQuery(sql, params)`, `getQuery(sql, params)` y `allQuery(sql, params)` encapsuladas en Promesas nativas, obligando al uso de marcadores de posición (`?`) para todos los parámetros dinámicos.

#### Scenario: Execute parameterized query with async/await
- **WHEN** un controlador invoca `runQuery`, `getQuery` o `allQuery` con una consulta SQL y parámetros
- **THEN** la Promesa se resuelve con el resultado correspondiente (`{ id, changes }`, fila única o arreglo de filas) o se rechaza ante un error de SQLite.

### Requirement: Graceful Shutdown Connection Cleanup
El sistema SHALL capturar la señal `SIGINT` del proceso Node.js para invocar `db.close()`, asegurando un cierre ordenado de la base de datos y la persistencia de transacciones en modo WAL antes de la finalización del proceso.

#### Scenario: Clean database closure on interruption
- **WHEN** el proceso recibe una señal de interrupción `SIGINT` (Ctrl+C)
- **THEN** la conexión a SQLite3 se cierra de forma segura y el proceso finaliza sin corrupción de archivos.
