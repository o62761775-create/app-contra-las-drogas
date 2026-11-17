-- ==============================================================================
-- Plataforma: Videojuegos contra las Drogas
-- Archivo: database/schema.sql (Sincronizado con src/database/schema.sql)
-- Descripción: Definición DDL idempotente del esquema de datos relacional SQLite3.
-- Principios: Anonimato por diseño (sin IPs ni datos rastreables), modo WAL,
--             convenciones snake_case y datos semilla no duplicables.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLA: solicitudes_ayuda
-- Registra consultas anónimas de orientación asistidas por el sistema y OpenAI.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS solicitudes_ayuda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL DEFAULT 'Anónimo',
    edad INTEGER CHECK (edad IS NULL OR (edad >= 5 AND edad <= 120)),
    mensaje TEXT NOT NULL,
    respuesta TEXT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 2. TABLA: directorio_contactos
-- Catálogo de líneas de atención, centros de emergencia y apoyo psicológico.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS directorio_contactos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    institucion TEXT NOT NULL,
    telefono TEXT NOT NULL,
    tipo_servicio TEXT NOT NULL,
    horario TEXT NOT NULL DEFAULT '24/7',
    direccion TEXT,
    activo INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT uq_directorio_institucion_telefono UNIQUE (institucion, telefono)
);

-- ------------------------------------------------------------------------------
-- 3. TABLA: estadisticas_juego
-- Métricas lúdicas completamente anónimas generadas por minijuegos HTML5 Canvas.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS estadisticas_juego (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    juego_id TEXT NOT NULL,
    puntaje INTEGER NOT NULL DEFAULT 0,
    duracion_segundos INTEGER NOT NULL,
    completado INTEGER NOT NULL DEFAULT 1 CHECK (completado IN (0, 1)),
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- 4. TABLA: recursos_educativos
-- Fichas informativas objetivas, neutrales y basadas en evidencia científica.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recursos_educativos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL UNIQUE,
    categoria TEXT NOT NULL,
    contenido TEXT NOT NULL,
    fuente TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATOS SEMILLA (Seed Data)
-- Sentencias INSERT OR IGNORE para inicialización segura e idempotente.
-- ==============================================================================

-- Directorio de contactos de asistencia (marcación rápida con formato tel:)
INSERT OR IGNORE INTO directorio_contactos (institucion, telefono, tipo_servicio, horario, direccion, activo)
VALUES 
    (
        'Línea 106: El Poder de Ser Escuchado',
        'tel:106',
        'Apoyo Psicológico y Salud Mental',
        '24/7',
        'Atención telefónica gratuita distrital y nacional',
        1
    ),
    (
        'ICBF - Línea de Protección a Niños, Niñas y Adolescentes',
        'tel:141',
        'Protección y Emergencia para Menores',
        '24/7',
        'Cobertura nacional gratuita',
        1
    ),
    (
        'Línea Nacional de Orientación en Sustancias Psicoactivas',
        'tel:018000112439',
        'Orientación y Prevención de Adicciones',
        '24/7',
        'Ministerio de Salud y Protección Social',
        1
    );

-- Recursos educativos informativos y preventivos libres de estigmas
INSERT OR IGNORE INTO recursos_educativos (titulo, categoria, contenido, fuente)
VALUES
    (
        'El cerebro adolescente y el impacto del alcohol',
        'Sustancias',
        'Durante la adolescencia y primera juventud, el cerebro experimenta un proceso clave de neurodesarrollo y poda sináptica. El consumo temprano de alcohol altera la maduración de la corteza prefrontal, afectando el autocontrol, la memoria de trabajo y la toma responsable de decisiones.',
        'Organización Mundial de la Salud (OMS)'
    ),
    (
        'Mitos y realidades sobre el vapeo y la nicotina',
        'Mitos y Realidades',
        'Aunque los cigarrillos electrónicos suelen comercializarse como alternativas inocuas, contienen nicotina de rápida absorción y compuestos químicos que causan inflamación bronquial y estrés oxidativo celular, consolidando patrones tempranos de dependencia.',
        'Centros para el Control y la Prevención de Enfermedades (CDC) / OPS'
    ),
    (
        'Estrategias de regulación emocional y asertividad frente a la presión social',
        'Prevención',
        'Desarrollar habilidades asertivas para comunicar límites claros, reconocer disparadores de ansiedad y fortalecer vínculos de confianza comunitarios constituyen factores protectores esenciales que evitan recurrir al consumo de sustancias psicoactivas como vía de escape.',
        'UNODC / Ministerio de Salud y Protección Social'
    );
