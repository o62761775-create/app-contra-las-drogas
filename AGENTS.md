# AGENTS.md

Guía de trabajo para agentes de IA (OpenCode y otros) en este repositorio.

## Proyecto

Plataforma web interactiva **"Videojuegos contra las Drogas"**: PWA educativa y de
prevención del consumo de sustancias psicoactivas y alcohol en jóvenes. Incluye
minijuegos en HTML5 Canvas, contenido informativo, directorio de ayuda con marcación
rápida y un asistente conversacional apoyado en la API de OpenAI.

Este repositorio usa **OpenSpec** (Spec-Driven Development, SDD) para planificar cada
cambio antes de escribir código.

## Stack y arquitectura

- **Frontend:** HTML5 semántico, CSS3 con variables nativas (mobile-first, Flexbox/Grid)
  y JavaScript Vanilla ES6+ (sin frameworks).
- **Backend:** Node.js 18+ LTS con Express (API REST).
- **Base de datos:** SQLite3 (archivo único, modo WAL, consultas preparadas).
- **Servicio externo:** OpenAI API, invocada solo desde el backend.

```
public/                 # Cliente (HTML, CSS, JS, assets)
src/controllers/        # Controladores REST
src/middleware/         # Validación, rate limiting, manejo de errores
src/routes/             # Enrutador de la API
src/services/           # Integración con OpenAI y otros servicios
config/database.js      # Inicialización de SQLite
database/schema.sql     # DDL de tablas
server.js               # Punto de entrada del servidor
openspec/               # Especificaciones y cambios (OpenSpec)
.opencode/              # Skills y comandos de OpenSpec para OpenCode
.agents/                # Skills y workflows de OpenSpec para Antigravity
```

## Comandos

```bash
npm install             # instalar dependencias
npm start               # iniciar el servidor (puerto 3000 por defecto)
npm run dev             # modo desarrollo con recarga
openspec list           # ver cambios activos
openspec list --specs   # ver especificaciones principales
openspec view           # panel general del proyecto
openspec validate --all # validar specs y cambios
```

> El CLI de OpenSpec ya está instalado en la máquina. En una terminal nueva debe estar
> disponible como `openspec`; si no, abre otra terminal para recargar el PATH.

## Flujo de trabajo con OpenSpec (obligatorio)

Antes de implementar una funcionalidad, crea o actualiza su plan en OpenSpec. No
escribas código de una funcionalidad nueva sin un cambio aprobado.

1. **Explorar** (opcional): `/opsx-explore` para analizar el problema y las opciones.
2. **Proponer:** `/opsx-propose <descripción-o-nombre-del-cambio>`. Genera
   `proposal.md`, las specs delta, `design.md` y `tasks.md` en
   `openspec/changes/<cambio>/`. Solo planifica: no modifica código.
3. **Implementar:** `/opsx-apply`. Ejecuta las tareas del cambio en orden y marca los
   checkboxes.
4. **Actualizar plan:** `/opsx-update` si cambian las decisiones o el alcance.
5. **Sincronizar specs:** `/opsx-sync` para llevar los deltas a `openspec/specs/` sin
   archivar.
6. **Archivar:** `/opsx-archive` cuando el cambio esté implementado y validado.

Reglas del proyecto para los artefactos: `openspec/config.yaml`. Léelo antes de
planificar. Las specs principales (`openspec/specs/`) describen el comportamiento
vigente; los cambios en curso viven en `openspec/changes/`.

## Convenciones de código

- **Idioma:** nombres de archivos, variables y rutas en el idioma y formato que define
  el estándar del proyecto; UI, mensajes y documentación en español.
- **Nombres:** `camelCase` para variables/funciones, `PascalCase` para clases,
  `UPPER_SNAKE_CASE` para constantes, `kebab-case` para archivos y clases CSS,
  `snake_case` para tablas y columnas SQL.
- **JavaScript:** ES6+, `const`/`let` (prohibido `var`), `async/await` y `try...catch`
  en toda llamada de red.
- **CSS:** sin `style=""` inline; consumir siempre las variables de `:root`.
- **SQL:** solo consultas preparadas con `?`; nunca concatenar cadenas.
- **API:** respuestas uniformes `{status, code, message, data|errors}`.
- **Commits:** Conventional Commits (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`).
- **Privacidad:** no registrar IPs ni datos personales; `nombre` vacío se guarda como
  `"Anónimo"`.
- **Secretos:** `OPENAI_API_KEY` y similares solo en `.env` (ignorado por Git).

## Documentos de referencia

- `especificaci_n_de_requisitos_de_software_srs (1).md` — requisitos, MoSCoW y API.
- `especificaci_n_de_arquitectura_de_software_sad (1).md` — capas, componentes y flujos.
- `est_ndar_de_desarrollo_y_buenas_pr_cticas (1).md` — estructura y estándares de código.
- `gu_a_de_dise_o_ui_ux_frontend (1).md` — design system, tipografía y componentes UI.
