# Design

## Context

El servidor Express (`server.js`) ya cuenta con limitación de payloads JSON a 10kb y anonimización de cabeceras de red. Para procesar solicitudes en `POST /api/solicitudes-ayuda` y `POST /api/juegos/stats`, se requiere una capa intermedia de validación y saneamiento en `src/middleware/validator.js` que proteja contra inyecciones XSS almacenadas, respete la política de anonimato por diseño (REQ-MS-02) y evite consumos desmedidos de tokens en la API de OpenAI (RF-01). (Ver `proposal.md` y `specs/input-validation/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar una función pura `sanitizarTexto(texto)` nativa (sin dependencias externas) que neutralice etiquetas `<script>` y escape caracteres HTML peligrosos (`&`, `<`, `>`, `"`, `'`).
- Implementar el middleware `validarSolicitudAyuda` con acumulación de errores, longitud de 3 a 1000 caracteres en `mensaje`, normalización obligatoria de `nombre` a `'Anónimo'` cuando no se proporcione, y validación de `edad` como entero en rango [5, 120] (o `null`).
- Implementar el middleware `validarEstadisticasJuego` validando `juego_id`, `puntaje` (>= 0), `duracion_sec` (>= 0) y normalización de `completado` a 0 o 1.
- Retornar el contrato uniforme de error HTTP 400 cuando existan fallos de validación.

**Non-Goals:**
- Instalar dependencias pesadas de terceros (ej. Joi, Zod, express-validator) para mantener la ligereza y portabilidad del backend.
- Conectar las rutas con la base de datos o el cliente OpenAI.

## Decisions

### 1. Validación Nativa sin Dependencias de Terceros
- **Decisión:** Desarrollar los validadores y la sanitización empleando JavaScript Vanilla ES6+ nativo.
- **Justificación:** Cumple con la regla del estándar de no agregar librerías innecesarias cuando las primitivas del lenguaje (`typeof`, `Number.isInteger`, expresiones regulares, `String.prototype.trim`) cubren el 100% de los requisitos con alto rendimiento y cero superficie de ataque adicional.
- **Alternativas consideradas:** `express-validator` o `zod`. Descartados para evitar sobrecargar dependencias y mantener coherencia con la política CommonJS y la sencillez arquitectónica del proyecto.

### 2. Estrategia de Sanitización contra XSS
- **Decisión:** `sanitizarTexto` aplica primero `.trim()`, elimina bloques `<script>...</script>` (con banderas case-insensitive y multilinea), y reemplaza entidades sensibles:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
- **Justificación:** Previene ejecución accidental o almacenamiento malicioso de scripts en SQLite y su posterior renderizado en el cliente web o envío al LLM.

### 3. Normalización Defensiva en `req.body`
- **Decisión:** Los middlewares modifican directamente las propiedades en `req.body` con los valores limpios y tipados (`Number` para edad/puntaje/duración, `0` o `1` para completado, `'Anónimo'` por defecto en nombre).
- **Justificación:** Los controladores downstream reciben parámetros confiables, sanitizados y tipados, eliminando código duplicado de parsing en los controladores.

### 4. Acumulación Completa de Errores
- **Decisión:** Se evalúan todos los campos del cuerpo y se acumulan los mensajes en un arreglo `errores = []`. Si `errores.length > 0`, se devuelve HTTP 400 con el listado completo.
- **Justificación:** Mejora la experiencia del cliente (frontend/PWA) al informar de todas las inconsistencias en un único ciclo de petición/respuesta.

## Risks / Trade-offs

- **[Riesgo de denegación de servicio por expresiones regulares en sanitización (ReDoS)]** → *Mitigación:* Los payloads ya están limitados a 10kb por `express.json` y `mensaje` está restringido a 1000 caracteres antes de procesar transformaciones complejas.
- **[Riesgo de sanitización redundante al renderizar en cliente]** → *Mitigación:* Se define una convención clara: el backend almacena texto sanitizado defensivamente y los clientes consumen APIs seguras.
