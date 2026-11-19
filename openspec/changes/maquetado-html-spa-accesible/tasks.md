# Tasks

## 1. Documento Base y Encabezado Semántico

- [ ] 1.1 Crear el archivo `public/index.html` con estructura base HTML5 (`<!DOCTYPE html>`, `<html lang="es">`), metadatos en `<head>` (charset UTF-8, viewport responsive, theme-color `#2561BA`, descripción de salud y prevención, vinculación con `css/styles.css`) y verificar la validez sintáctica de las etiquetas.
- [ ] 1.2 Implementar en `public/index.html` el enlace accesible de salto al contenido (`<a href="#main-content" class="skip-link">`) y la cabecera institucional `<header>` con logotipo, títulos (`h1`, `p.lead`) y botón destacado de acción crítica `.btn-emergency`.

## 2. Navegación Accesible y Diálogo Modal de Emergencia

- [ ] 2.1 Implementar la barra de navegación accesible (`<nav aria-label="Navegación principal">`) con botones de navegación SPA (`#nav-juego`, `#nav-recursos`, `#nav-chat`, `#nav-directorio`) estructurados con atributos ARIA (`role="tab"`, `aria-selected`, `aria-controls`).
- [ ] 2.2 Implementar el modal de emergencia nativo (`<dialog id="modal-emergencia">`) con enlaces directos de marcación rápida (`tel:106`, `tel:141`), mensaje de contención psicológica inmediata y botón accesible de cierre.

## 3. Contenedores Modulares del Layout Principal

- [ ] 3.1 Estructurar el elemento `<main id="main-content">` con la grilla responsive `.main-grid`, integrando la sección del videojuego (`#juego-section`) con contenedor 16:9 y elemento accesible `<canvas id="gameCanvas">`.
- [ ] 3.2 Integrar las secciones modulares para Recursos Educativos (`#recursos-section` con buscador y grid de tarjetas), Asistente de Orientación (`#chat-section` con contenedor `.chat-container`, historial y formulario) y Directorio de Ayuda (`#directorio-section`).
- [ ] 3.3 Implementar el pie de página institucional (`<footer role="contentinfo">`) con aviso de confidencialidad, ausencia estricta de cookies o rastreo personal, y enlaces a líneas de asistencia pública.

## 4. Verificación y Control de Calidad

- [ ] 4.1 Validar que el servidor Express entregue correctamente `public/index.html` en la raíz `GET /` con código HTTP 200 y cabeceras correctas (`Content-Type: text/html`).
- [ ] 4.2 Validar la conformidad de las especificaciones con `openspec validate --all`.
- [ ] 4.3 Registrar el cambio mediante commit Git siguiendo Conventional Commits (`feat: implementar maquetado semantico html5 y layout spa accesible`).
