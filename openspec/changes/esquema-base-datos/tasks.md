# Tasks

## 1. Definición del Esquema DDL de Tablas

- [x] 1.1 Definir las sentencias idempotentes `CREATE TABLE IF NOT EXISTS` para `solicitudes_ayuda` (con `nombre` por defecto 'Anónimo' y `CHECK` de edad) y `directorio_contactos` en `src/database/schema.sql`, verificando la sintaxis DDL.
- [x] 1.2 Definir las sentencias `CREATE TABLE IF NOT EXISTS` para `estadisticas_juego` y `recursos_educativos` en `src/database/schema.sql`, verificando las restricciones de integridad y anonimato.

## 2. Inserción de Datos Semilla Iniciales

- [x] 2.1 Agregar sentencias `INSERT OR IGNORE` para 3 registros reales de asistencia en `directorio_contactos`, verificando el formato de teléfonos para marcación rápida.
- [x] 2.2 Agregar sentencias `INSERT OR IGNORE` para 3 fichas informativas científicas y neutrales en `recursos_educativos`, verificando el tono objetivo y libre de estigmas.

## 3. Sincronización y Control de Versiones

- [x] 3.1 Sincronizar el script en el directorio estándar `database/schema.sql` asegurando coherencia entre capas.
- [x] 3.2 Ejecutar `openspec validate --all` para validar la coherencia de todos los artefactos de OpenSpec.
- [x] 3.3 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: definir esquema ddl de base de datos sqlite con tablas y semillas iniciales`.
