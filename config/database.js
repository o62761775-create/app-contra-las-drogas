/**
 * ==============================================================================
 * MÓDULO DE CONEXIÓN A BASE DE DATOS (SQLite3)
 * Plataforma: "Videojuegos contra las Drogas"
 * Arquitectura: Conexión persistente, Concurrencia WAL y Consultas Preparadas
 * ==============================================================================
 */

const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

// 1. CONFIGURACIÓN DE RUTAS Y VERIFICACIÓN DE DIRECTORIO
const dbPath = path.resolve(__dirname, '../src/database/database.sqlite');
const schemaPath = path.resolve(__dirname, '../src/database/schema.sql');

// Asegurar que el directorio de la base de datos exista antes de conectar
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// 2. APERTURA DE CONEXIÓN Y OPTIMIZACIÓN DE CONCURRENCIA (Modo WAL)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('[Database] Error crítico al conectar con SQLite3:', err.message);
  } else {
    console.log(`[Database] Conectado exitosamente al archivo SQLite: ${dbPath}`);
  }
});

// Configuración de pragmas para alta concurrencia e integridad referencial
db.serialize(() => {
  // Write-Ahead Logging: permite lecturas simultáneas sin bloquear escrituras
  db.run('PRAGMA journal_mode = WAL;', (err) => {
    if (err) {
      console.error('[Database] Error al activar PRAGMA journal_mode = WAL:', err.message);
    } else {
      console.log('[Database] Modo WAL (Write-Ahead Logging) activado.');
    }
  });

  // Habilitar restricciones de claves foráneas
  db.run('PRAGMA foreign_keys = ON;', (err) => {
    if (err) {
      console.error('[Database] Error al activar PRAGMA foreign_keys = ON:', err.message);
    }
  });
});

// 3. INICIALIZACIÓN AUTOMÁTICA DEL ESQUEMA DDL
/**
 * Lee el archivo schema.sql y ejecuta su contenido para asegurar que las tablas existan.
 * @returns {Promise<void>}
 */
const inicializarBaseDeDatos = () => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(schemaPath)) {
      const errorMsg = `[Database] No se encontró el archivo de esquema en: ${schemaPath}`;
      console.error(errorMsg);
      return reject(new Error(errorMsg));
    }

    try {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');

      db.exec(schemaSql, (err) => {
        if (err) {
          console.error('[Database] Error al ejecutar el script de esquema inicial:', err.message);
          return reject(err);
        }
        console.log('[Database] Esquema DDL inicializado y sincronizado correctamente.');
        resolve();
      });
    } catch (readErr) {
      console.error('[Database] Error al leer el archivo schema.sql:', readErr.message);
      reject(readErr);
    }
  });
};

// 4. MÉTODOS ENCAPSULADOS EN PROMESAS (Prepared Statements con ?)

/**
 * Ejecuta sentencias INSERT, UPDATE o DELETE usando parámetros vinculados.
 * @param {string} sql - Sentencia SQL con marcadores de posición (?)
 * @param {Array} params - Arreglo de valores para los parámetros
 * @returns {Promise<{ id: number, changes: number }>}
 */
const runQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    // Se utiliza function() estándar para mantener el contexto 'this' proporcionado por sqlite3
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({
        id: this.lastID,
        changes: this.changes
      });
    });
  });
};

/**
 * Ejecuta consultas SELECT esperando un único registro.
 * @param {string} sql - Sentencia SQL con marcadores de posición (?)
 * @param {Array} params - Arreglo de valores para los parámetros
 * @returns {Promise<Object|undefined>} Fila obtenida o undefined si no hay coincidencia
 */
const getQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });
};

/**
 * Ejecuta consultas SELECT esperando múltiples registros.
 * @param {string} sql - Sentencia SQL con marcadores de posición (?)
 * @param {Array} params - Arreglo de valores para los parámetros
 * @returns {Promise<Array<Object>>} Lista de registros coincidentes
 */
const allQuery = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows || []);
    });
  });
};

// 5. CIERRE SEGURO (Graceful Shutdown)
process.on('SIGINT', () => {
  console.log('\n[Database] Señal SIGINT recibida. Cerrando conexión SQLite...');
  db.close((err) => {
    if (err) {
      console.error('[Database] Error al cerrar la conexión:', err.message);
    } else {
      console.log('[Database] Conexión cerrada de forma segura.');
    }
    process.exit(err ? 1 : 0);
  });
});

module.exports = {
  db,
  inicializarBaseDeDatos,
  runQuery,
  getQuery,
  allQuery
};
