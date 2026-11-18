/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/controllers/juego.controller.js
 * Descripción: Controlador para el registro de métricas y estadísticas anónimas de juego.
 * ==============================================================================
 */

const { runQuery, allQuery } = require('../../config/database');

const registrarEstadisticaJuego = async (req, res, next) => {
  try {
    const { juego_id, puntaje, duracion_sec, completado } = req.body;
    const sql = 'INSERT INTO estadisticas_juego (juego_id, puntaje, duracion_segundos, completado) VALUES (?, ?, ?, ?)';
    const resultado = await runQuery(sql, [juego_id, puntaje, duracion_sec, completado ?? 0]);

    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Estadística de juego registrada correctamente.',
      data: {
        id: resultado.id
      }
    });
  } catch (error) {
    next(error);
  }
};

const obtenerResumenEstadisticas = async (req, res, next) => {
  try {
    const sql = `
      SELECT 
        juego_id, 
        COUNT(*) AS total_partidas, 
        ROUND(AVG(puntaje), 2) AS puntaje_promedio, 
        MAX(puntaje) AS puntaje_maximo
      FROM estadisticas_juego
      GROUP BY juego_id
    `;
    const resumen = await allQuery(sql);

    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Resumen de estadísticas obtenido correctamente.',
      data: resumen
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registrarEstadisticaJuego,
  obtenerResumenEstadisticas
};
