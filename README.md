# Videojuegos contra las Drogas

Plataforma web interactiva y educativa para la prevención del consumo de sustancias
psicoactivas y alcohol en jóvenes. Combina minijuegos en HTML5 Canvas, contenido
informativo, un directorio de ayuda con marcación rápida y un asistente conversacional
basado en la API de OpenAI.

## Stack

- HTML5, CSS3 y JavaScript Vanilla (ES6+) — frontend responsive tipo PWA.
- Node.js + Express — API REST.
- SQLite3 — persistencia local.
- OpenAI API — orientación asistida (solo desde el backend).

## Requisitos

- Node.js 18 LTS o superior.
- OpenSpec CLI (instalado en esta máquina).

## Inicio rápido

```bash
npm install
cp .env.example .env   # completar OPENAI_API_KEY y PORT
npm start
```

El servidor escucha por defecto en `http://localhost:3000`.

## Desarrollo guiado por especificaciones (OpenSpec)

Este proyecto usa **OpenSpec** para acordar qué construir antes de escribir código.
El flujo estándar es:

```text
/opsx-explore  →  /opsx-propose  →  /opsx-apply  →  /opsx-archive
```

| Comando | Propósito |
| :--- | :--- |
| `/opsx-explore` | Explorar una idea o problema sin comprometerse a implementarlo. |
| `/opsx-propose` | Crear un cambio con propuesta, specs delta, diseño y tareas. |
| `/opsx-apply` | Implementar las tareas del cambio activo. |
| `/opsx-update` | Revisar y mantener coherente el plan de un cambio. |
| `/opsx-sync` | Sincronizar los deltas con las specs principales. |
| `/opsx-archive` | Archivar un cambio terminado y actualizar las specs. |

### Estructura de OpenSpec

```text
openspec/
├── config.yaml   # contexto y reglas del proyecto para los agentes
├── specs/        # comportamiento vigente del sistema
└── changes/      # cambios en curso (archive/ para los terminados)
```

### CLI útil

```bash
openspec list              # cambios activos
openspec list --specs      # specs principales
openspec view              # panel general
openspec validate --all    # validar estructura de specs y cambios
```

Las instrucciones para agentes de IA están en [`AGENTS.md`](AGENTS.md).

## Documentación

- [SRS](especificaci_n_de_requisitos_de_software_srs%20(1).md) — requisitos y API.
- [SAD](especificaci_n_de_arquitectura_de_software_sad%20(1).md) — arquitectura.
- [Estándar de desarrollo](est_ndar_de_desarrollo_y_buenas_pr_cticas%20(1).md) — convenciones.
- [Guía UI/UX](gu_a_de_dise_o_ui_ux_frontend%20(1).md) — design system.

## Privacidad

El sistema es anónimo por diseño: no almacena direcciones IP, cookies de seguimiento ni
datos personales. El nombre en los formularios es opcional y se registra como
`"Anónimo"` cuando no se indica. No se incluyen anuncios ni analítica de terceros.
