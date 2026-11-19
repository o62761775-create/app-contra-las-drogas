# Tasks

## 1. Tokens Globales y Reset CSS Base

- [x] 1.1 Crear el archivo `public/css/styles.css` con la declaración completa de variables CSS nativas en `:root` (paleta institucional `--color-primary`, `--color-secondary`, `--color-tertiary`, `--color-neutral`, `--color-background`, `--color-danger`, funcionales de texto, elevaciones `--shadow-*`, radios `--radius-*` y transiciones) y verificar que no existan errores de sintaxis CSS.
- [x] 1.2 Implementar en `public/css/styles.css` el reset moderno accesible (box-sizing `border-box`, eliminación de márgenes residuales, scroll suave, imágenes responsivas y foco visual accesible con `:focus-visible`).

## 2. Tipografía y Jerarquía Fluida

- [x] 2.1 Configurar en `public/css/styles.css` las reglas de tipografía (`@font-face` con fallbacks de sistema para `Brogte`, `Duality`, `Forward Serif`, `Khaleefa`), estilos base para `body`, y escala tipográfica fluida con `clamp()` para encabezados `h1`, `h2`, `h3` y párrafos.
- [x] 2.2 Verificar el cumplimiento de ratio de contraste accesible WCAG 2.1 AA (mínimo 4.5:1) entre los colores de texto y fondo definidos en el sistema.

## 3. Clases Utilitarias y Componentes Reutilizables

- [x] 3.1 Implementar el sistema de botones en `public/css/styles.css`: clase base `.btn`, variantes `.btn-primary`, `.btn-secondary`, `.btn-outline` y el botón de acción crítica `.btn-emergency` con animación `@keyframes pulse` y esquinas redondeadas completas.
- [x] 3.2 Implementar las clases de tarjetas informativas (`.card`, `.card-header`, `.card-body`, `.badge`) con efectos de elevación y transición vertical en `:hover`.
- [x] 3.3 Implementar las clases de layout Mobile-First y contenedores de chat (`.main-grid`, `.chat-container`, `.chat-bubble-user`, `.chat-bubble-bot`) con adaptabilidad progresiva mediante `@media (min-width: 768px)` y `@media (min-width: 1024px)`.

## 4. Verificación y Control de Calidad

- [x] 4.1 Validar que el servidor Express sirva correctamente `public/css/styles.css` a través de `GET /css/styles.css` con código HTTP 200 y cabeceras de contenido correctas (`Content-Type: text/css`).
- [x] 4.2 Validar la integridad de las especificaciones con `openspec validate --all`.
- [x] 4.3 Registrar el cambio mediante commit Git siguiendo Conventional Commits (`feat: implementar sistema de diseno tokens css y componentes base`).
