/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/controllers/ayuda.controller.js
 * Descripción: Controlador para la gestión de solicitudes anónimas de ayuda
 *              y orientación preventiva asistida por IA.
 * Arquitectura: Capa de Controladores (REST) en CommonJS (Node.js 18+ LTS).
 * Principios: Anonimato por diseño (RNF-SEC-01 / REQ-MS-02), consultas preparadas
 *             contra inyección SQL (RNF-SEC-02) y respuestas JSON homogéneas.
 * ==============================================================================
 */

const { runQuery } = require('../../config/database');
const { generarOrientacion } = require('../services/openai.service');

/**
 * Procesa y registra una nueva solicitud de orientación y ayuda.
 * Endpoint: POST /api/solicitudes-ayuda
 *
 * @param {import('express').Request} req - Petición HTTP Express
 * @param {import('express').Response} res - Respuesta HTTP Express
 * @param {import('express').NextFunction} next - Siguiente función middleware
 */
const crearSolicitudAyuda = async (req, res, next) => {
  try {
    // Paso 1 - Extracción de Datos Sanitizados y salvaguardas de anonimato
    const { nombre, edad, mensaje } = req.body;

    const nombreFinal = (typeof nombre === 'string' && nombre.trim() !== '')
      ? nombre.trim()
      : 'Anónimo';

    const edadFinal = (edad !== undefined && edad !== null && edad !== '')
      ? Number(edad)
      : null;

    // Paso 2 - Generación de Orientación Asistida mediante el servicio OpenAI
    const respuestaOrientativa = await generarOrientacion(mensaje, edadFinal);

    // Paso 3 - Persistencia Segura (Prevención de Inyección SQL con consultas preparadas)
    // Cero registro de direcciones IP, User-Agent o huellas de red (RNF-SEC-01)
    const sql = 'INSERT INTO solicitudes_ayuda (nombre, edad, mensaje, respuesta) VALUES (?, ?, ?, ?)';
    const resultado = await runQuery(sql, [nombreFinal, edadFinal, mensaje, respuestaOrientativa]);

    // Paso 4 - Respuesta JSON Estandarizada (HTTP 201 Created)
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Solicitud registrada correctamente.',
      data: {
        id: resultado.id,
        orientacion: respuestaOrientativa
      }
    });
  } catch (error) {
    // Paso 5 - Delegación de errores asíncronos al middleware centralizado
    next(error);
  }
};

module.exports = {
  crearSolicitudAyuda
};
