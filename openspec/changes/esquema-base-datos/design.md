# Design

## Context

El proyecto requiere estructurar formalmente la base de datos relacional SQLite3 para soportar las consultas de ayuda preventiva (RF-01), el directorio de contactos con marcación rápida (RF-03), las estadísticas anónimas de los minijuegos (RF-04) y el catálogo de recursos educativos (RF-05). En cumplimiento de RNF-SEC-01 y REQ-MS-02, el esquema debe garantizar anonimato absoluto por diseño. (Ver `proposal.md` y `specs/sqlite-schema/spec.md`).

## Goals / Non-Goals

**Goals:**
- Definir un script SQL (`schema.sql`) 100% idempotente utilizando `CREATE TABLE IF NOT EXISTS`.
- Implementar llaves primarias `INTEGER PRIMARY KEY AUTOINCREMENT` y tipos nativos SQLite (`INTEGER`, `TEXT`, `DATETIME`).
- Aplicar restricciones de integridad: `nombre` por defecto `'Anónimo'`, `CHECK` de rango etario (5 a 120 años) y campos obligatorios `NOT NULL`.
- Incluir sentencias `INSERT OR IGNORE` con datos semilla realistas para directorio y recursos educativos con tono científico y libre de estigmas.
- Ubicar el archivo en `src/database/schema.sql` y sincronizarlo en `database/schema.sql`.

**Non-Goals:**
- Implementar el pool o inicializador en Node.js (`config/database.js`).
- Ejecutar migraciones destructivas (`DROP TABLE`).
- Almacenar datos personales identificables (cero IPs, correos o números personales de usuarios).

## Decisions

### 1. Convenciones y Tipado SQLite3
- **Nombres de tablas:** `snake_case` plural (`solicitudes_ayuda`, `directorio_contactos`, `estadisticas_juego`, `recursos_educativos`).
- **Nombres de columnas:** `snake_case` singular (`id`, `nombre`, `edad`, `mensaje`, `respuesta`, `creado_en`).
- **Tipado estricto:** Aprovechar afinidades de tipo SQLite (`INTEGER`, `TEXT`, `DATETIME`) y valores automáticos (`CURRENT_TIMESTAMP`).

### 2. Garantías de Privacidad y Anonimato
- **`solicitudes_ayuda`:**
  - `nombre TEXT NOT NULL DEFAULT 'Anónimo'`: Permite registrar alias libre sin obligar a identificación.
  - `edad INTEGER CHECK (edad IS NULL OR (edad >= 5 AND edad <= 120))`: Valida coherencia etaria sin exigir el dato.
  - No existen columnas de IP, cookies, geolocalización o metadatos de navegador.

### 3. Idempotencia y Datos Semilla
- Se emplean sentencias `CREATE TABLE IF NOT EXISTS`.
- Se definen índices o restricciones `UNIQUE` en entidades semilla (`institucion, telefono` en directorio; `titulo` en recursos) combinados con `INSERT OR IGNORE`, garantizando que múltiples ejecuciones del script no alteren datos existentes ni generen duplicados.

### 4. Ubicación del Archivo DDL
- Se creará en `src/database/schema.sql` (conforme a la petición del usuario) y se mantendrá idéntico en `database/schema.sql` (conforme al estándar general del repositorio).

## Risks / Trade-offs

- **[Riesgo de colisión de tipos o sintaxis SQLite3]** → *Mitigación:* Se utiliza sintaxis ANSI/SQLite compatible con `sqlite3` v5.1.0+ sin extensiones propietarias.
- **[Riesgo de datos semilla duplicados en reejecución]** → *Mitigación:* Uso estricto de cláusulas `INSERT OR IGNORE` e identificadores únicos.
