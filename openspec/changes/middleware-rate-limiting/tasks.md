# Tasks

## 1. Configuración de Limitadores de Tráfico

- [x] 1.1 Configurar `apiLimiter` con ventana de 1 minuto (`60000` ms) y 10 peticiones máximas en `src/middleware/rateLimiter.js`, verificando cabeceras estándar IETF y memoria volátil.
- [x] 1.2 Configurar `iaLimiter` con ventana de 1 minuto y 5 peticiones máximas en `src/middleware/rateLimiter.js`, verificando la protección de endpoints de IA.

## 2. Manejador de Respuestas HTTP 429 y Anonimato

- [x] 2.1 Implementar el manejador `handler` devolviendo HTTP 429 bajo la estructura JSON estandarizada del proyecto, verificando que no se expongan ni registren direcciones IP.
- [x] 2.2 Exportar `apiLimiter` e `iaLimiter` en formato CommonJS (`module.exports`), verificando la sintaxis modular.

## 3. Validación y Control de Versiones

- [x] 3.1 Ejecutar `openspec validate --all` para verificar la integridad de todos los artefactos de OpenSpec.
- [x] 3.2 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: implementar middleware de control de tasa rate limiting con respuestas unificadas`.
