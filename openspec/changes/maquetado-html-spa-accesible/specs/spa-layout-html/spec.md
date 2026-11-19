# Spec Delta

## Purpose

Proporcionar el documento raíz HTML5 semántico y accesible para la Single Page Application (SPA), garantizando puntos de montaje para todos los módulos del sistema, navegación por teclado accesible y acceso inmediato a líneas de emergencia.

## ADDED Requirements

### Requirement: Semantic HTML5 Architecture and Accessible Landmarks
El documento `public/index.html` SHALL estructurarse mediante elementos semánticos de HTML5 (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) con soporte WAI-ARIA y enlace de salto de navegación.

#### Scenario: Document landmarks are accessible to assistive technologies
- **WHEN** un lector de pantalla o usuario de asistencia inspecciona el documento `index.html`
- **THEN** los puntos de referencia semánticos de encabezado, navegación, contenido principal y pie de página están claramente delimitados con idioma español (`lang="es"`)

#### Scenario: Skip link shifts focus directly to main content
- **WHEN** un usuario que navega por teclado presiona Tab al cargar la página y activa el enlace `.skip-link`
- **THEN** el foco se traslada de forma inmediata al elemento `<main id="main-content">` evitando la repetición de menús

### Requirement: Persistent Emergency Assistance Action
La interfaz SHALL proveer un componente de llamada a la acción de emergencia visible (`.btn-emergency`), accesible desde cualquier punto de la pantalla, que permita la marcación telefónica directa (`tel:106`, `tel:141`) o la apertura de un diálogo modal de crisis.

#### Scenario: Emergency action trigger is operable across all viewport sizes
- **WHEN** el usuario interactúa con la aplicación en pantallas móviles, tablets o computadoras de escritorio
- **THEN** el botón de emergencia se mantiene visible y accesible con texto descriptivo y atributo `aria-label` explícito

### Requirement: Single Page Application Modular Section Layout
El documento SHALL incluir secciones modulares predefinidas con identificadores unívocos para el montaje dinámico de los cuatro módulos del sistema: Videojuego, Recursos, Asistente de Orientación y Directorio.

#### Scenario: Canvas game viewport container is present with 16:9 ratio
- **WHEN** el documento se renderiza en el navegador
- **THEN** la sección `#juego-section` contiene un contenedor con relación 16:9 y el elemento `<canvas id="gameCanvas">` accesible

#### Scenario: Guidance and directory containers ready for client mounting
- **WHEN** el cliente JavaScript inicializa las vistas
- **THEN** existen los contenedores `#chat-section`, `#recursos-section` y `#directorio-section` con estructura semántica receptiva

### Requirement: Zero-Tracking and Privacy-First Metadata Configuration
El encabezado `<head>` del documento SHALL configurar metadatos locales y vincular exclusivamente recursos estáticos locales (`css/styles.css`), sin etiquetas `<script>` o `<link>` hacia dominios de analítica, publicidad o CDNs externas.

#### Scenario: Zero external resource dependencies loaded from third parties
- **WHEN** el navegador analiza las solicitudes de red generadas por `index.html`
- **THEN** ninguna petición HTTP se dirige hacia redes publicitarias o servidores de rastreo de terceros, cumpliendo RNF-SEC-01 y REQ-WH-01
