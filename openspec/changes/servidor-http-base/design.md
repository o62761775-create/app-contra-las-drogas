# Design

## Context

Tras establecer la configuración de dependencias en `package.json`, el proyecto necesita un punto de entrada (`server.js`) que monte la aplicación Express y orqueste la arquitectura en capas. Las restricciones de dominio exigen anonimato por diseño (RNF-SEC-01), seguridad en cabeceras HTTP (RNF-SEC-02) y respuestas JSON uniformes. (Ver `proposal.md` y `specs/http-server/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar `server.js` en CommonJS con sintaxis ES6+.
- Integrar `helmet()` para fortificar cabeceras de respuesta.
- Implementar un middleware de anonimización forzada de IPs que neutralice cabeceras de red (`x-forwarded-for`, `x-real-ip`, etc.).
- Limitar el cuerpo de peticiones JSON a 10kb para mitigar ataques DoS.
- Servir los activos estáticos del frontend desde `public/` con ruta absoluta.
- Implementar el endpoint `GET /api/healthcheck` con la estructura uniforme `{ status, code, message, data }`.
- Dejar comentarios de anclaje claros para la futura integración de rutas y manejo global de errores.

**Non-Goals:**
- Implementar rutas de negocio (`/api/solicitudes-ayuda`, `/api/directorio`, etc.).
- Implementar controladores ni conexión a SQLite en este archivo.
- Implementar la lógica del manejador global de errores (`errorHandler.js`).

## Decisions

### 1. Ubicación y Formato del Punto de Entrada
- **Decisión:** `server.js` en la raíz del proyecto usando CommonJS (`require` / `module.exports`).
- **Justificación:** Coherente con `package.json` (`"main": "server.js"`, `"type": "commonjs"`), scripts `start`/`dev` y el estándar técnico.
- **Alternativas consideradas:** Agrupar el arranque en `src/server.js`. Descartado porque el estándar ubica `server.js` en raíz y la lógica interna en `src/`.

### 2. Cadena de Middlewares de Seguridad y Anonimización
- **Orden de ejecución:**
  1. `helmet()`: Añade cabeceras de protección (HSTS, Content-Type-Options, Frameguard/Clickjacking).
  2. Middleware de Anonimización: Intercepta cada petición y elimina o sobrescribe cabeceras que contengan la IP de origen (`x-forwarded-for`, `x-real-ip`, `cf-connecting-ip`), garantizando que ningún componente downstream acceda a datos de red del usuario.
  3. `express.json({ limit: '10kb' })`: Parsea payloads JSON pequeños protegiendo el event loop de sobrecargas de memoria.
  4. `express.static()`: Sirve la carpeta `public/` para acceso a la SPA y recursos estáticos.

### 3. Estructura Homogénea de Respuestas de la API
- **Decisión:** Todo endpoint API responde con el formato `{ status, code, message, data|errors }`.
- **Implementación en Healthcheck:**
  ```json
  {
    "status": "success",
    "code": 200,
    "message": "Servidor operativo y funcionando correctamente.",
    "data": {
      "timestamp": "2026-11-12T14:00:00.000Z",
      "environment": "development"
    }
  }
  ```

### 4. Puntos de Anclaje para Futuros Módulos
- Se reservan marcas de comentario explícitas:
  - `// [TODO: Conectar api.routes.js en el paso 5.3]`
  - `// [TODO: Conectar errorHandler.js en el paso 6.1]`

## Risks / Trade-offs

- **[Riesgo de que proxies o balanceadores inyecten cabeceras de IP después del middleware]** → *Mitigación:* El middleware se ejecuta en la capa más temprana posible de Express; en despliegues con proxy inverso se configurará descarte de logs de acceso.
- **[Riesgo de denegación de servicio por payloads grandes]** → *Mitigación:* Se restringe `express.json` a 10kb, suficiente para solicitudes de orientación y chat textual.
