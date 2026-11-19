# Proposal

## Why

Para articular visualmente todas las funcionalidades de la plataforma "Videojuegos contra las Drogas" y proporcionar un punto de entrada accesible, responsive y libre de estigmas, es fundamental implementar la estructura semántica base de la Single Page Application (SPA) en `public/index.html`. Esta interfaz concentra la navegación accesible entre los cuatro módulos neurálgicos del sistema (Videojuego Canvas, Recursos Educativos, Asistente Conversacional y Directorio de Marcación Rápida), asegurando el acceso inmediato a ayuda en situaciones de crisis y el cumplimiento estricto de las directrices de accesibilidad WAI-ARIA y privacidad.

Justificación trazable con el SRS y el SAD:
- **REQ-MS-04 y RNF-USA-02 (Semántica y Accesibilidad WAI-ARIA):** Estructura basada en etiquetas HTML5 semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`), enlaces de salto para lectores de pantalla (*skip-to-content*), atributos `aria-label`, `aria-live` y navegación por teclado.
- **REQ-SH-02 (Asistencia Inmediata y Marcación Rápida):** Ubicación prominente y persistente del botón de emergencia (`.btn-emergency`) con enlace directo a líneas de crisis gratuitas (`tel:106`, `tel:141`).
- **REQ-MS-06 y RNF-POR-01 (Multiplataforma y Responsive):** Viewport meta configurado para adaptación fluida en teléfonos móviles (desde 320px), tablets, computadoras y pantallas de consolas conectadas a TV.
- **RF-01 a RF-05 (Integración Modular SPA):** Contenedores semánticos listos para el montaje del minijuego HTML5 Canvas (`#gameCanvas`), el panel de chat de orientación, las tarjetas de recursos y el directorio telefónico.
- **RNF-SEC-01, REQ-MS-02 y REQ-WH-01 (Privacidad y Cero Anuncios):** Estructura 100% limpia sin scripts de publicidad, analíticas invasivas ni dependencias de trackers externos.

## What Changes

- Creación del archivo `public/index.html` como punto de entrada de la aplicación.
- Configuración de metadatos modernos en `<head>`:
  * Codificación UTF-8, viewport responsive y descripción informativa.
  * Metaetiquetas de seguridad y vinculación con la hoja de estilos institucional `css/styles.css`.
  * Declaración para preparación PWA (color de tema `#2561BA`).
- Estructura del cuerpo accesible:
  * Enlace accesible de salto al contenido principal (`.skip-link`).
  * Header institucional con logotipo, título y lema preventivo.
  * Botón destacado de marcación rápida de emergencia (con atributos ARIA y diálogo accesible).
  * Barra de navegación principal (`<nav>`) con botones de alternancia de pestañas/secciones accesibles (`role="tablist"` o navegación SPA).
  * Contenedor principal `<main>` con grilla responsive `.main-grid`:
    - Sección del videojuego preventivo con wrapper 16:9 y elemento `<canvas id="gameCanvas">`.
    - Sección de recursos educativos (`#recursos-section`).
    - Sección del asistente conversacional anónimo (`#chat-section`).
    - Sección del directorio de ayuda y centros de asistencia (`#directorio-section`).
  * Pie de página institucional (`<footer>`) con aviso de confidencialidad, créditos y aviso de no recolección de datos personales.

### Alcance
- Archivo `public/index.html` con maquetación semántica y atributos de accesibilidad WAI-ARIA.
- Vinculación con `public/css/styles.css`.

### Fuera de Alcance
- Lógica de interacción en JavaScript (`public/js/`).
- Service Worker y manifiesto PWA (Prompt 3).
- Implementación de la lógica del juego Canvas (Prompt 7 y 8).

## Capabilities

### New Capabilities
- `spa-layout-html`: Estructura semántica HTML5, maquetación responsive SPA y accesibilidad WAI-ARIA para la plataforma "Videojuegos contra las Drogas".

### Modified Capabilities
*(Ninguna; introduce la capacidad de interfaz y estructura HTML de la SPA).*

## Impact

- **Capa Cliente (Frontend):** Proporciona la plantilla HTML5 sobre la cual se montarán los módulos JavaScript de chat, recursos, directorio y el bucle del videojuego.
- **Accesibilidad:** Garantiza el soporte para lectores de pantalla, navegación por teclado y cumplimiento de WCAG 2.1 AA.
- **Privacidad:** Cero scripts externos, fuentes de terceros o píxeles de rastreo en el documento HTML.
