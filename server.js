/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: server.js
 * Descripción: Punto de entrada principal del servidor HTTP Express.
 * Arquitectura: Capa de Presentación y Servidor REST en CommonJS (Node.js 18+ LTS).
 * Principios: Anonimato por diseño (RNF-SEC-01), seguridad de cabeceras (RNF-SEC-02),
 *             control de payload, inicialización DDL y respuestas JSON unificadas.
 * ==============================================================================
 */

// 1. Carga de variables de entorno al inicio del ciclo de vida
require('dotenv').config();

const express = require('express');
const path = require('path');
const helmet = require('helmet');

// Módulos de infraestructura y enrutamiento
const { inicializarBaseDeDatos } = require('./config/database');
const apiRoutes = require('./src/routes/api.routes');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// 2. Middlewares de Seguridad y Privacidad

// Fortificación de cabeceras HTTP contra ataques XSS, Clickjacking y MIME sniffing
app.use(helmet());

// Política de Anonimización Forzada (REQ-MS-02 / RNF-SEC-01):
// Elimina de forma preventiva cualquier cabecera de rastreo de red o IP en req.headers,
// garantizando que el servidor y los módulos downstream no almacenen ni procesen IPs.
app.use((req, res, next) => {
    delete req.headers['x-forwarded-for'];
    delete req.headers['x-real-ip'];
    delete req.headers['cf-connecting-ip'];
    delete req.headers['fastly-client-ip'];
    delete req.headers['true-client-ip'];
    delete req.headers['x-client-ip'];
    delete req.headers['x-cluster-client-ip'];
    next();
});

// Parseo de cuerpos JSON con restricción estricta de 10kb para mitigar sobrecargas DoS
app.use(express.json({ limit: '10kb' }));

// 3. Servicio de Archivos Estáticos (Frontend PWA: HTML5, CSS3, JS Vanilla y Canvas)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Rutas Base y Healthcheck

/**
 * GET /api/healthcheck
 * Endpoint de verificación de estado y salud operativa del servidor.
 */
app.get('/api/healthcheck', (req, res) => {
    return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Servidor operativo y funcionando correctamente.',
        data: {
            timestamp: new Date().toISOString(),
            environment: NODE_ENV
        }
    });
});

// 5. Montaje de Rutas de la API REST
app.use('/api', apiRoutes);

// 6. Middleware Catch-all para Rutas API No Definidas (HTTP 404)
app.use('/api/*', (req, res) => {
    return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'El endpoint solicitado no existe en la API.',
        errors: []
    });
});

// 7. Middleware Centralizado de Manejo de Excepciones
app.use(errorHandler);

// 7. Inicialización de Base de Datos y Arranque del Servidor HTTP
inicializarBaseDeDatos()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`[Servidor] Plataforma operativa en http://localhost:${PORT}`);
            console.log(`[Servidor] Entorno de ejecución: ${NODE_ENV}`);
        });
    })
    .catch((err) => {
        console.error('[Servidor] Error crítico al inicializar la base de datos:', err.message);
        process.exit(1);
    });

module.exports = app;
