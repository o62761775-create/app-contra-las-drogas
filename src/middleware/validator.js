/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/middleware/validator.js
 * Descripción: Middleware de validación de esquemas y sanitización defensiva contra XSS.
 * Arquitectura: Capa de Seguridad e Integridad de Entrada (Node.js 18+ LTS).
 * Principios: Anonimato por diseño (RNF-SEC-01), respuestas uniformes 400 Bad Request.
 * ==============================================================================
 */

/**
 * Función pura que recorta espacios en blanco y neutraliza caracteres peligrosos de HTML.
 * @param {string} texto
 * @returns {string}
 */
const sanitizarTexto = (texto) => {
  if (typeof texto !== 'string') return '';
  return texto
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

/**
 * Validador para POST /api/solicitudes-ayuda
 */
const validarSolicitudAyuda = (req, res, next) => {
  const errores = [];
  const { mensaje, nombre, edad } = req.body || {};

  // 1. Campo mensaje (Obligatorio)
  if (!mensaje || typeof mensaje !== 'string' || mensaje.trim().length === 0) {
    errores.push({
      campo: 'mensaje',
      error: 'El campo "mensaje" es obligatorio y debe contener texto.'
    });
  } else {
    const trimmed = mensaje.trim();
    if (trimmed.length < 3 || trimmed.length > 1000) {
      errores.push({
        campo: 'mensaje',
        error: 'El campo "mensaje" debe tener entre 3 y 1000 caracteres.'
      });
    } else {
      req.body.mensaje = sanitizarTexto(trimmed);
    }
  }

  // 2. Campo nombre (Opcional - Anonimato por diseño)
  if (nombre === undefined || nombre === null || (typeof nombre === 'string' && nombre.trim() === '')) {
    req.body.nombre = 'Anónimo';
  } else if (typeof nombre !== 'string') {
    errores.push({
      campo: 'nombre',
      error: 'El campo "nombre" debe ser una cadena de texto válida.'
    });
  } else {
    const trimmedNombre = nombre.trim();
    if (trimmedNombre.length > 50) {
      errores.push({
        campo: 'nombre',
        error: 'El campo "nombre" no puede exceder los 50 caracteres.'
      });
    } else {
      req.body.nombre = sanitizarTexto(trimmedNombre);
    }
  }

  // 3. Campo edad (Opcional)
  if (edad === undefined || edad === null || edad === '') {
    req.body.edad = null;
  } else {
    const numEdad = Number(edad);
    if (!Number.isInteger(numEdad) || numEdad < 5 || numEdad > 120) {
      errores.push({
        campo: 'edad',
        error: 'El campo "edad" debe ser un número entero válido entre 5 y 120 años.'
      });
    } else {
      req.body.edad = numEdad;
    }
  }

  if (errores.length > 0) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Los datos proporcionados no cumplen con los requisitos de validación.',
      errors: errores
    });
  }

  next();
};

/**
 * Validador para POST /api/juegos/stats
 */
const validarEstadisticasJuego = (req, res, next) => {
  const errores = [];
  const { juego_id, puntaje, duracion_sec, completado } = req.body || {};

  // 1. juego_id (Obligatorio)
  if (!juego_id || typeof juego_id !== 'string' || juego_id.trim().length === 0) {
    errores.push({
      campo: 'juego_id',
      error: 'El campo "juego_id" es obligatorio y no puede estar vacío.'
    });
  } else if (juego_id.trim().length > 50) {
    errores.push({
      campo: 'juego_id',
      error: 'El campo "juego_id" no puede exceder los 50 caracteres.'
    });
  } else {
    req.body.juego_id = sanitizarTexto(juego_id);
  }

  // 2. puntaje (Obligatorio, entero >= 0)
  const numPuntaje = Number(puntaje);
  if (puntaje === undefined || puntaje === null || puntaje === '' || !Number.isInteger(numPuntaje) || numPuntaje < 0) {
    errores.push({
      campo: 'puntaje',
      error: 'El campo "puntaje" es obligatorio y debe ser un número entero mayor o igual a 0.'
    });
  } else {
    req.body.puntaje = numPuntaje;
  }

  // 3. duracion_sec (Obligatorio, entero >= 0)
  const numDuracion = Number(duracion_sec);
  if (duracion_sec === undefined || duracion_sec === null || duracion_sec === '' || !Number.isInteger(numDuracion) || numDuracion < 0) {
    errores.push({
      campo: 'duracion_sec',
      error: 'El campo "duracion_sec" es obligatorio y debe ser un número entero mayor o igual a 0.'
    });
  } else {
    req.body.duracion_sec = numDuracion;
  }

  // 4. completado (Opcional, booleano o 0/1)
  if (completado === undefined || completado === null || completado === '') {
    req.body.completado = 0;
  } else if (typeof completado === 'boolean') {
    req.body.completado = completado ? 1 : 0;
  } else if (completado === 1 || completado === 0 || completado === '1' || completado === '0') {
    req.body.completado = Number(completado);
  } else {
    errores.push({
      campo: 'completado',
      error: 'El campo "completado" debe ser un booleano o un valor binario (0 o 1).'
    });
  }

  if (errores.length > 0) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Los datos proporcionados no cumplen con los requisitos de validación.',
      errors: errores
    });
  }

  next();
};

module.exports = {
  sanitizarTexto,
  validarSolicitudAyuda,
  validarEstadisticasJuego
};
