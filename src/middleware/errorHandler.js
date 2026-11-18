/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/middleware/errorHandler.js
 * Descripción: Middleware centralizado para captura y manejo uniforme de excepciones.
 * Arquitectura: Capa de Manejo Global de Errores en CommonJS (Node.js 18+ LTS).
 * Principios: Anonimato por diseño (RNF-SEC-01), prevención de fugas SQLite (RNF-SEC-02),
 *             y respuestas JSON estandarizadas { status, code, message, errors }.
 * ==============================================================================
 */

/**
 * Middleware global de captura de errores para Express.
 *
 * @param {Error} err - Objeto de error capturado
 * @param {import('express').Request} req - Petición HTTP Express
 * @param {import('express').Response} res - Respuesta HTTP Express
 * @param {import('express').NextFunction} next - Siguiente función middleware
 */
const errorHandler = (err, req, res, next) => {
  // 1. Delegar al manejador por defecto si las cabeceras ya fueron transmitidas
  if (res.headersSent) {
    return next(err);
  }

  const isDev = process.env.NODE_ENV === 'development';

  // 2. Registro técnico seguro en consola (Cero IPs, cabeceras ni req.body - RNF-SEC-01)
  console.error(`[Error Handler] ${req.method} ${req.originalUrl} - ${err.message}`);
  if (isDev && err.stack) {
    console.error(err.stack);
  }

  // 3. Clasificación de Excepciones y Mapeo de Códigos de Estado
  let statusCode = 500;
  let message = 'Error interno del servidor.';
  let reason = isDev ? err.message : 'Ocurrió un error inesperado al procesar la solicitud.';

  // A. Error de sintaxis JSON malformado generado por express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'El formato JSON de la petición es inválido.';
    reason = 'Sintaxis JSON no válida en el cuerpo de la solicitud.';
  }
  // B. Error de carga útil que excede el límite permitido (10kb)
  else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'El tamaño de los datos enviados excede el límite permitido.';
    reason = 'El cuerpo de la petición excede el tamaño máximo permitido de 10kb.';
  }
  // C. Excepciones originadas en el motor SQLite3 (protección de esquema - RNF-SEC-02)
  else if (err.code && typeof err.code === 'string' && err.code.startsWith('SQLITE_')) {
    statusCode = 500;
    message = 'Error interno al procesar la operación de datos.';
    reason = isDev ? `Fallo en base de datos: ${err.code}` : 'Error en la capa de persistencia relacional.';
  }
  // D. Errores con código de estado HTTP explícito
  else if (err.statusCode || err.status) {
    statusCode = err.statusCode || err.status;
    message = err.message || 'Error en la solicitud.';
    reason = err.message || 'Error procesando la petición.';
  }

  // 4. Respuesta JSON Homogénea del Proyecto
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: message,
    errors: [
      {
        reason: reason
      }
    ]
  });
};

module.exports = errorHandler;
