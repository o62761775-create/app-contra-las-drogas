/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/routes/api.routes.js
 * Descripción: Enrutador centralizado de la API REST.
 * Arquitectura: Capa de Enrutamiento y Despacho en CommonJS (Node.js 18+ LTS).
 * Principios: Trazabilidad SRS (RF-01 a RF-05), rate limiting estratificado,
 *             validación previa y convenciones REST en kebab-case.
 * ==============================================================================
 */

const express = require('express');
const router = express.Router();

// Middlewares de seguridad y validación
const { apiLimiter, iaLimiter } = require('../middleware/rateLimiter');
const { validarSolicitudAyuda, validarEstadisticasJuego } = require('../middleware/validator');

// Controladores de dominio
const { crearSolicitudAyuda } = require('../controllers/ayuda.controller');
const { obtenerDirectorio } = require('../controllers/directorio.controller');
const { obtenerRecursos, obtenerRecursoPorId } = require('../controllers/recursos.controller');
const { registrarEstadisticaJuego, obtenerResumenEstadisticas } = require('../controllers/juego.controller');

// 1. Control de Tasa Global para todos los endpoints bajo /api/* (10 req/min)
router.use(apiLimiter);

// 2. Definición de Rutas de Dominio

// A. Solicitudes de Ayuda y Orientación Asistida por IA (RF-01 / RF-02)
router.post(
  '/solicitudes-ayuda',
  iaLimiter,
  validarSolicitudAyuda,
  crearSolicitudAyuda
);

// B. Directorio de Líneas de Ayuda y Marcación Rápida (RF-03)
router.get(
  '/directorio',
  obtenerDirectorio
);

// C. Recursos Educativos y Preventivos Objetivos (RF-05)
router.get(
  '/recursos',
  obtenerRecursos
);

router.get(
  '/recursos/:id',
  obtenerRecursoPorId
);

// D. Métricas Anónimas de Videojuegos HTML5 Canvas (RF-04)
router.post(
  '/juegos/stats',
  validarEstadisticasJuego,
  registrarEstadisticaJuego
);

router.get(
  '/juegos/stats/resumen',
  obtenerResumenEstadisticas
);

module.exports = router;
