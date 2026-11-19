# Proposal

## Why

Para iniciar la construcción de la interfaz de usuario de la plataforma "Videojuegos contra las Drogas" garantizando una experiencia empática, accesible, profesional y libre de estigmas, es imprescindible implementar la base visual del sistema de diseño en `public/css/styles.css`. Este archivo centraliza los tokens de diseño nativos en CSS3 (`:root`), asegurando una identidad estética coherente, escalabilidad visual y cumplimiento riguroso de las directrices de accesibilidad y rendimiento.

Justificación trazable con el SRS y la Guía de Diseño UI/UX:
- **REQ-MS-04 (Diseño Gráfico Consistente):** Unificación de la estética visual en todos los módulos de la aplicación mediante tokens centralizados.
- **RNF-USA-01 (Sistema de Diseño Cromático):** Implementación de la paleta oficial institucional (`--color-primary: #2561BA`, `--color-secondary: #365687`, `--color-tertiary: #324054`, `--color-neutral: #FFFFFF`, `--color-background: #F4F7FA`, `--color-danger: #E53E3E`) y superficies funcionales.
- **RNF-USA-02 (Tipografía y Contrastes WCAG 2.1 AA):** Definición de familias tipográficas institucionales (`Brogte`, `Duality`, `Forward Serif`, `Khaleefa`) con fallbacks seguros de alta legibilidad, escala fluida con `clamp()` y ratios de contraste mayores a 4.5:1 para texto normal.
- **RNF-POR-01 y REQ-MS-06 (Web Responsive & Mobile-First):** Reset moderno y grillas flexibles adaptables desde pantallas móviles de 320px hasta televisores y monitores 4K.
- **REQ-SH-02 (Componentes de Asistencia y Emergencia):** Estilos para llamadas a la acción (*CTA*), botones de marcación rápida (`.btn-emergency` con animación `pulse`) y tarjetas informativas (`.card`).

## What Changes

- Creación del archivo de estilos central `public/css/styles.css`.
- Definición de tokens de diseño globales en `:root`:
  * Paleta cromática oficial y semántica (primario, secundario, terciario, fondo, neutral, peligro).
  * Sombras y elevación adaptativas (`--shadow-sm`, `--shadow-md`, `--shadow-lg`).
  * Radios de curvatura estandarizados (`--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-full`).
  * Variables tipográficas y escala fluida con `clamp()`.
- Reset CSS moderno y normalización accesible (`box-sizing: border-box`, márgenes predecibles, accesibilidad de foco visible `:focus-visible`).
- Componentes base reutilizables:
  * Sistema de botones: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` y `.btn-emergency` (con animación de pulso continuo).
  * Contenedores y tarjetas: `.card`, `.card-header`, `.card-body`, `.badge`.
  * Elementos estructurales para módulos futuros (burbujas de chat `.chat-bubble-user`, `.chat-bubble-bot` y grillas base).

### Alcance
- Archivo de estilos `public/css/styles.css` puro en CSS3 estándar.
- Pruebas visuales y validación de sintaxis CSS y ratios de contraste.

### Fuera de Alcance
- Estructura HTML de la aplicación (`public/index.html`).
- Estilos especializados del canvas de videojuegos (`public/css/game.css`).
- Lógica de interacción en JavaScript (`public/js/`).

## Capabilities

### New Capabilities
- `ui-design-tokens`: Tokens de diseño visual, reset CSS moderno, tipografía fluida y clases utilitarias de componentes para la plataforma web responsive "Videojuegos contra las Drogas".

### Modified Capabilities
*(Ninguna; inicia la especificación de componentes y tokens de la capa de presentación).*

## Impact

- **Frontend / Capa Cliente:** Establece las reglas de estilo y tokens que consumirán todas las vistas, componentes y módulos de la SPA.
- **Privacidad y Cero Rastreo (RNF-SEC-01 / REQ-MS-02):** Todos los estilos y fuentes se consumen de manera estrictamente local y autónoma, sin llamadas a CDNs de terceros ni servicios externos (como Google Fonts) que puedan registrar o exponer la dirección IP del usuario.
- **Seguridad:** Cero código ejecutable, libre de dependencias externas.
