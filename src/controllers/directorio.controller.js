/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/controllers/directorio.controller.js
 * Descripción: Controlador para la consulta del directorio de asistencia y emergencia.
 * ==============================================================================
 */

const { allQuery } = require('../../config/database');

const obtenerDirectorio = async (req, res, next) => {
  try {
    const contactos = await allQuery(
      'SELECT id, institucion, telefono, tipo_servicio, horario, direccion FROM directorio_contactos WHERE activo = 1 ORDER BY id ASC'
    );
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Directorio de contactos obtenido correctamente.',
      data: contactos
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerDirectorio
};
