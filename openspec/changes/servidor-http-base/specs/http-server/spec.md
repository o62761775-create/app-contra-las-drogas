# Spec Delta

## Purpose

Define el ciclo de vida del servidor HTTP Express, la cadena de middlewares de seguridad y anonimización de IPs, el servicio de activos estáticos y el endpoint de healthcheck.

## ADDED Requirements

### Requirement: HTTP Server Lifecycle and Port Configuration
El sistema SHALL inicializar una aplicación Express cargando variables de entorno mediante `dotenv`, escuchando en el puerto definido por `process.env.PORT` con valor por defecto 3000, e informando el puerto y entorno activo al iniciar.

#### Scenario: Server startup on configured port
- **WHEN** se inicia la aplicación mediante el comando de arranque
- **THEN** el servidor se vincula al puerto especificado y emite un mensaje de estado limpio en consola.

### Requirement: Security Headers and Client Anonymization Pipeline
El sistema SHALL aplicar cabeceras de protección web mediante `helmet()` y MUST ejecutar un middleware de anonimización previo al enrutamiento que neutralice cabeceras de rastreo de red como `x-forwarded-for` y `x-real-ip` en `req.headers`.

#### Scenario: Enforce security headers and IP stripping
- **WHEN** una petición HTTP entrante llega al servidor con cabeceras de identificación de IP
- **THEN** la respuesta incluye las cabeceras de seguridad de Helmet y el objeto de la petición queda desprovisto de identificadores de IP.

### Requirement: Payload Size Restriction and Static Asset Delivery
El sistema SHALL limitar el parseo de cuerpos JSON entrantes a un tamaño máximo de 10kb (`limit: '10kb'`) y SHALL servir archivos estáticos directamente desde el directorio `public/` usando la ruta absoluta resuelta con `path.join`.

#### Scenario: Successful static file serving and payload parsing
- **WHEN** un cliente solicita recursos de la aplicación web o envía un payload JSON menor o igual a 10kb
- **THEN** el servidor responde con el recurso estático solicitado o procesa el cuerpo JSON de forma segura.

### Requirement: Healthcheck Endpoint
El sistema SHALL exponer un endpoint público `GET /api/healthcheck` que responda con código HTTP 200 y el contrato JSON estandarizado del proyecto con `status`, `code`, `message` y `data` (conteniendo `timestamp` en formato ISO y `environment`).

#### Scenario: Verify service health status
- **WHEN** un cliente o monitor de infraestructura realiza una petición `GET /api/healthcheck`
- **THEN** el servidor retorna código 200 con `{ status: "success", code: 200, message: "Servidor operativo y funcionando correctamente.", data: { timestamp, environment } }`.
