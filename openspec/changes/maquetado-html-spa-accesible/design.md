# Design

## Context

Con los tokens y el sistema de diseño visual consolidados en `public/css/styles.css`, se requiere construir el punto de entrada principal del cliente web: `public/index.html`. Este archivo articulará la estructura de la aplicación de página única (SPA), sirviendo de base para los módulos de interfaz de usuario, accesibilidad para lectores de pantalla y puntos de montaje para los scripts de negocio. Véase `proposal.md` para la motivación y trazabilidad con el SRS y el SAD.

## Goals / Non-Goals

**Goals:**
- Construir un documento HTML5 semántico y accesible (`lang="es"`), estructurado con puntos de referencia estándar (`<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`) y roles WAI-ARIA.
- Incorporar un enlace de salto de navegación accesible (`.skip-link`) que permita a usuarios de teclado y lectores de pantalla ir directamente a `#main-content`.
- Proveer un botón de emergencia de marcación rápida persistente y destacado (`.btn-emergency`), que active un diálogo modal nativo `<dialog id="modal-emergencia">` con números de contacto directo (`tel:106`, `tel:141`).
- Diseñar la barra de navegación accesible por pestañas para alternar entre las secciones de la SPA:
  * `#juego-section`: Contenedor del videojuego con relación 16:9 y elemento `<canvas id="gameCanvas">`.
  * `#recursos-section`: Catálogo informativo con buscador y contenedor de tarjetas.
  * `#chat-section`: Interfaz del asistente de orientación anónimo con historial y formulario.
  * `#directorio-section`: Directorio telefónico de asistencia y filtros.
- Garantizar que la información de emergencia crítica sea legible de inmediato sin depender de la ejecución de JavaScript (*Progressive Enhancement*).
- Respetar la política de cero rastreo (sin scripts de analítica, sin cookies y sin CDNs de terceros).

**Non-Goals:**
- No implementar la lógica de eventos en JavaScript (reservado para los módulos `app.js`, `chat.js`, etc.).
- No implementar el Service Worker ni manifiesto PWA (reservado para el cambio de PWA).

## Decisions

### Decisión 1: Arquitectura Single Page Application (SPA) en un único archivo `index.html`
- **Elección:** Consolidar todas las vistas principales en secciones semánticas (`<section id="...">`) dentro de `index.html`, gestionando su visibilidad mediante atributos `hidden` y clases CSS.
- **Razón:** Elimina la latencia de recargas de página completas, preserva el estado del bucle del videojuego en Canvas en memoria, y optimiza la caché de la aplicación para funcionamiento offline.
- **Alternativas consideradas:** Múltiples páginas HTML estáticas (`juego.html`, `chat.html`, `recursos.html`). Se descartó porque provocaría la pérdida de la sesión de juego y degradaría la fluidez en dispositivos móviles.

### Decisión 2: Uso del elemento nativo `<dialog>` para el modal de emergencia
- **Elección:** Emplear la etiqueta nativa `<dialog id="modal-emergencia">` para el panel de marcación rápida y contención de crisis.
- **Razón:** Proporciona accesibilidad integrada por especificación del navegador: gestión automática de foco, cierre con tecla Escape, bloqueo de scroll en el fondo y backdrop nativo sin librerías externas.
- **Alternativas consideradas:** Modales construidos con `div` y JavaScript personalizado. Se descartó para evitar complejidad innecesaria y garantizar máxima compatibilidad accesible.

### Decisión 3: Accesibilidad WAI-ARIA y Texto Alternativo en Canvas
- **Elección:** Incluir texto descriptivo accesible y controles de teclado alternativos dentro de la etiqueta `<canvas id="gameCanvas">El videojuego educativo no pudo cargarse o su navegador no soporta Canvas 2D...</canvas>`.
- **Razón:** Cumple con la norma WCAG 2.1 AA para elementos gráficos interactivos, permitiendo que usuarios con discapacidades visuales conozcan el propósito pedagógico del minijuego.
- **Alternativas consideradas:** Canvas vacío sin hijos. Se descartó por violar las buenas prácticas de accesibilidad.

## Risks / Trade-offs

- **[Riesgo: Navegadores antiguos sin soporte para `<dialog>`]** → **Mitigación:** Todos los navegadores modernos (Chrome, Firefox, Safari, Edge desde 2022) soportan `<dialog>` de forma nativa; además, los números telefónicos críticos se proveen también en enlaces directos `tel:` en el pie de página y en el directorio estático como respaldo.
- **[Riesgo: Anuncio confuso de secciones ocultas en lectores de pantalla]** → **Mitigación:** Las secciones inactivas utilizan el atributo booleano estándar `hidden`, lo que garantiza que los motores de accesibilidad las ignoren por completo hasta que el usuario las seleccione activamente.
