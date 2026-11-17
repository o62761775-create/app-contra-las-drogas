# Proposal

## Why

Una vez establecida la configuración base y las dependencias del backend, es necesario implementar el punto de entrada principal de la aplicación HTTP (`server.js`). Este servidor Express orquesta el ciclo de vida del backend, aplica las políticas obligatorias de seguridad y privacidad desde la primera capa de recepción de peticiones, expone los archivos estáticos de la interfaz cliente (SPA y Canvas) y provee un punto de verificación de disponibilidad (*healthcheck*).

Justificación trazable con el SRS:
- **RNF-SEC-01 y REQ-MS-02 (Privacidad y Anonimato Estricto):** Implementación de una política activa de anonimización que neutraliza cabeceras de rastreo de IP (`x-forwarded-for`, `x-real-ip`) antes de que cualquier controlador las procese.
- **RNF-SEC-02 (Seguridad HTTP):** Configuración de `helmet()` para fortificar cabeceras contra ataques de Cross-Site Scripting (XSS) y Clickjacking.
- **RNF-PER-01 (Rendimiento y Prevención DoS):** Limitación del tamaño de los payloads entrantes (`limit: '10kb'`) en `express.json()`.
- **Habilitador de la Arquitectura SAD (Capas de Presentación y Negocio):** Servir contenido estático desde `public/` y definir el anclaje para el enrutador REST (`/api`) y el manejador global de excepciones.

## What Changes

- Creación del archivo `server.js` en la raíz del proyecto.
- Carga de variables de entorno mediante `dotenv.config()`.
- Configuración de la constante `PORT` con respaldo por defecto a 3000 (`process.env.PORT || 3000`).
- Integración de middleware de seguridad `helmet()` con cabeceras estándar.
- Middleware personalizado de anonimización de direcciones IP que sobrescribe/elimina cabeceras de identificación de red en `req.headers`.
- Configuración de `express.json()` restringido a un límite de 10kb.
- Montaje del middleware para servir archivos estáticos desde el directorio `public/` usando `path.join(__dirname, 'public')`.
- Definición del endpoint `GET /api/healthcheck` con la estructura uniforme de respuesta `{ status, code, message, data }`.
- Comentarios de anclaje estructurados para la futura conexión de `api.routes.js` y `errorHandler.js`.
- Inicio de escucha HTTP mediante `app.listen()` con registro descriptivo en consola.

### Alcance
- Implementación completa, funcional y documentada de `server.js`.
- Verificación del endpoint `/api/healthcheck` y del servicio de estáticos.

### Fuera de Alcance
- Implementación de controladores de negocio o rutas REST específicas (`src/routes/api.routes.js`).
- Implementación del middleware centralizado de manejo de errores (`src/middleware/errorHandler.js`).
- Conexión o inicialización del módulo de base de datos SQLite.

## Capabilities

### New Capabilities
- `http-server`: Punto de entrada del servidor Express, ciclo de vida HTTP, cadena de middlewares de seguridad/anonimización, servicio de archivos estáticos y endpoint de healthcheck.

### Modified Capabilities
*(Ninguna; se suma a las capacidades planificadas del backend).*

## Impact

- **Código:** Introduce el archivo ejecutable raíz `server.js`.
- **Seguridad y Privacidad:** Garantiza desde el inicio del pipeline HTTP el anonimato del usuario y la protección de cabeceras web.
- **Endpoints:** Habilita el endpoint público `GET /api/healthcheck`.
