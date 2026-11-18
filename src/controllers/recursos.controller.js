/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/controllers/recursos.controller.js
 * Descripción: Controlador para la consulta de recursos educativos preventivos.
 * ==============================================================================
 */

const { allQuery, getQuery } = require('../../config/database');

const obtenerRecursos = async (req, res, next) => {
  try {
    const recursos = await allQuery(
      'SELECT id, titulo, categoria, contenido, fuente, creado_en FROM recursos_educativos ORDER BY id ASC'
    );
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Recursos educativos obtenidos correctamente.',
      data: recursos
    });
  } catch (error) {
    next(error);
  }
};

const obtenerRecursoPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const recurso = await getQuery(
      'SELECT id, titulo, categoria, contenido, fuente, creado_en FROM recursos_educativos WHERE id = ?',
      [id]
    );

    if (!recurso) {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'El recurso educativo solicitado no existe.',
        errors: []
      });
    }

    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Recurso educativo obtenido correctamente.',
      data: recurso
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerRecursos,
  obtenerRecursoPorId
};
