# Spec Delta

## Purpose

Define el esquema relacional DDL de la base de datos SQLite3, garantizando idempotencia, restricciones de anonimato estricto, estructura para los cuatro módulos clave y datos semilla iniciales.

## ADDED Requirements

### Requirement: Relational Schema DDL Idempotence
El sistema SHALL estructurar el archivo DDL de base de datos utilizando `CREATE TABLE IF NOT EXISTS` en todas las entidades y `INTEGER PRIMARY KEY AUTOINCREMENT` para las claves primarias, permitiendo ejecuciones idempotentes seguras.

#### Scenario: Script execution idempotency
- **WHEN** se ejecuta el script DDL sobre una base de datos nueva o existente
- **THEN** el motor SQLite crea las tablas requeridas sin arrojar errores por ejecuciones sucesivas.

### Requirement: Help Requests Table with Anonymity Guarantees
El sistema SHALL definir la tabla `solicitudes_ayuda` con las columnas `id`, `nombre` (TEXT NOT NULL DEFAULT 'Anónimo'), `edad` (INTEGER NULL con restricción `CHECK(edad IS NULL OR (edad >= 5 AND edad <= 120))`), `mensaje` (TEXT NOT NULL), `respuesta` (TEXT NOT NULL) y `creado_en` (DATETIME DEFAULT CURRENT_TIMESTAMP), omitiendo cualquier identificador de red o dato personal rastreable.

#### Scenario: Insert help request under anonymity rules
- **WHEN** se inserta una solicitud de orientación sin especificar nombre o con un alias opcional
- **THEN** la base de datos asigna 'Anónimo' por defecto y valida que la edad cumpla el rango biológico permitido.

### Requirement: Contacts Directory Table and Seed Records
El sistema SHALL definir la tabla `directorio_contactos` con columnas `id`, `institucion` (TEXT NOT NULL), `telefono` (TEXT NOT NULL), `tipo_servicio` (TEXT NOT NULL), `horario` (TEXT NOT NULL DEFAULT '24/7'), `direccion` (TEXT NULL) y `activo` (INTEGER NOT NULL DEFAULT 1), e incluir al menos 3 registros iniciales mediante sentencias `INSERT OR IGNORE`.

#### Scenario: Emergency contacts catalog availability
- **WHEN** se consulta el directorio de contactos tras inicializar el esquema
- **THEN** el sistema retorna las líneas de emergencia precargadas con teléfonos listos para marcación rápida.

### Requirement: Game Statistics and Educational Resources Tables
El sistema SHALL definir las tablas `estadisticas_juego` (para métricas anónimas de juego) y `recursos_educativos` (fichas científicas categorizadas por sustancia e impacto), e incluir al menos 3 fichas educativas iniciales libres de estigmas mediante `INSERT OR IGNORE`.

#### Scenario: Educational resources seed verification
- **WHEN** se consulta la tabla de recursos educativos
- **THEN** existen al menos 3 fichas informativas con contenido veraz, objetivo y neutral sobre sustancias psicoactivas.
