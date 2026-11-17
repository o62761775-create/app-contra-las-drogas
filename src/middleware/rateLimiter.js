/**
 * ==============================================================================
 * MIDDLEWARE DE CONTROL DE TASA (RATE LIMITING)
 * Plataforma: "Videojuegos contra las Drogas"
 * Seguridad: Protección contra DoS, abusos y agotamiento de cuota en OpenAI
 * Anonimato: Almacenamiento volátil en memoria sin persistencia de IPs
 * ==============================================================================
 */

const rateLimitModule = require('express-rate-limit');

// Compatibilidad robusta con exportaciones CommonJS de express-rate-limit v7+
const rateLimit = rateLimitModule.rateLimit || rateLimitModule;

// 1. LIMITADOR GENERAL DE API (RNF-SEC-02 / RNF-PER-01)
// Restringe el tráfico general a 10 peticiones por minuto por cliente
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // Ventana de 1 minuto
  limit: 10,           // Máximo 10 peticiones por ventana
  standardHeaders: true, // Retorna cabeceras estándar IETF `RateLimit-*`
  legacyHeaders: false,  // Desactiva cabeceras obsoletas `X-RateLimit-*`

  // Manejador de respuesta unificada HTTP 429 Too Many Requests
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({
      status: 'error',
      code: options.statusCode,
      message: 'Has realizado demasiadas solicitudes en poco tiempo. Por favor, espera un minuto antes de intentar nuevamente.',
      errors: [
        {
          reason: 'Límite de 10 peticiones por minuto excedido.'
        }
      ]
    });
  }
});

// 2. LIMITADOR ESTRICTO PARA ENDPOINTS DE IA (RF-01 / RNF-SEC-03)
// Restringe el acceso a /api/solicitudes-ayuda a 5 peticiones por minuto para proteger la cuota de OpenAI
const iaLimiter = rateLimit({
  windowMs: 60 * 1000, // Ventana de 1 minuto
  limit: 5,            // Máximo 5 consultas por minuto
  standardHeaders: true,
  legacyHeaders: false,

  // Manejador empático y claro con formato JSON homogéneo
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({
      status: 'error',
      code: options.statusCode,
      message: 'Has alcanzado el límite de consultas de orientación asistida. Por favor, espera un minuto para procesar más solicitudes.',
      errors: [
        {
          reason: 'Límite de 5 consultas por minuto a los servicios de orientación excedido.'
        }
      ]
    });
  }
});

module.exports = {
  apiLimiter,
  iaLimiter
};
