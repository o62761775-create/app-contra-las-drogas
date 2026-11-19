# Design

## Context

La capa cliente de la plataforma "Videojuegos contra las Drogas" se sirve de forma estática desde el directorio `public/` a través de Node.js/Express. Para establecer los cimientos visuales del sistema y permitir que las subsiguientes vistas y módulos interactivos compartan una apariencia armónica y accesible, se requiere la implementación del sistema de diseño en `public/css/styles.css`. Véase `proposal.md` para la motivación y trazabilidad con el SRS y la Guía de Diseño UI/UX.

## Goals / Non-Goals

**Goals:**
- Implementar un sistema de diseño 100% nativo en CSS3, sin necesidad de frameworks externos (Bootstrap, Tailwind) ni preprocesadores (SASS, LESS).
- Definir en `:root` los tokens oficiales del proyecto: colores institucionales, colores funcionales de superficie y texto, sombras multicapa, radios de curvatura y escalas tipográficas.
- Proveer una normalización CSS moderna (Box-Sizing `border-box`, control de márgenes, accesibilidad con `:focus-visible`).
- Definir tipografía fluida con funciones `clamp()` para asegurar legibilidad continua en pantallas desde 320px hasta 4K.
- Diseñar las clases utilitarias y de componentes requeridas por el SRS:
  * Botones con estados hover, active y focus: `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-outline` y `.btn-emergency` (con animación `@keyframes pulse`).
  * Tarjetas de contenido `.card` con elevación interactiva.
  * Clases base para la estructura del chat (`.chat-container`, `.chat-bubble-user`, `.chat-bubble-bot`).
  * Estructura de grilla responsive `.main-grid` con estrategia Mobile-First.
- Garantizar accesibilidad conforme a la norma WCAG 2.1 AA en ratios de contraste y navegación por teclado.

**Non-Goals:**
- No implementar el marcado HTML de la aplicación (reservado para el cambio de maquetado SPA).
- No implementar lógica en JavaScript para interacción de componentes.
- No incluir reglas de renderizado del Canvas de videojuegos (reservado para `public/css/game.css`).

## Decisions

### Decisión 1: Variables nativas CSS3 (`:root`) frente a preprocesadores
- **Elección:** Utilizar exclusivamente Custom Properties nativas de CSS3.
- **Razón:** Compatibilidad universal en todos los navegadores modernos, eliminación de pasos de transpilación o compilación en Node.js, y capacidad de adaptación dinámica de temas en tiempo de ejecución.
- **Alternativas consideradas:** SASS / PostCSS / Tailwind CSS. Se descartaron para respetar la regla arquitectónica de cero dependencias en frontend y ligereza extrema.

### Decisión 2: Enfoque Mobile-First y Grillas Progresivas
- **Elección:** Construir las reglas base orientadas a pantallas de dispositivos móviles (1 columna vertical, controles táctiles amplios) y expandir el layout mediante `@media (min-width: 768px)` y `@media (min-width: 1024px)`.
- **Razón:** Los jóvenes y usuarios en situación de crisis acceden predominantemente desde teléfonos inteligentes; una estructura Mobile-First asegura el menor tiempo de primer pintado (FCP) y máxima fluidez.
- **Alternativas consideradas:** Desktop-first con max-width queries. Se descartó por generar sobreescrituras innecesarias en dispositivos móviles.

### Decisión 3: Autosuficiencia de fuentes y privacidad estricta
- **Elección:** Declarar las fuentes institucionales (`Brogte`, `Duality`, `Forward Serif`, `Khaleefa`) mediante `@font-face` con fallbacks robustos del sistema operativo (`system-ui`, `Arial Black`, `Georgia`, `serif`), sin importar librerías de Google Fonts ni CDNs remotas.
- **Razón:** El principio de privacidad por diseño (RNF-SEC-01 / REQ-MS-02) prohíbe conexiones a terceros que puedan recolectar direcciones IP o datos de navegación.
- **Alternativas consideradas:** Carga desde Google Fonts o Adobe Fonts. Se descartó por violar la política de privacidad y cero rastreo.

## Risks / Trade-offs

- **[Riesgo: Archivos de fuentes propietarias aún no presentes en `public/assets/`]** → **Mitigación:** La pila de fuentes declara fallbacks seguros de alta legibilidad (`Georgia`, `serif`, `sans-serif`) que renderizan con proporciones métricas similares antes de incorporar los binarios `.woff2`.
- **[Riesgo: Variaciones de contraste en pantallas de bajo brillo o modo nocturno forzado]** → **Mitigación:** Los contrastes cromáticos de la paleta oficial superan holgadamente la relación 4.5:1 (Azul Royal sobre Blanco = 5.9:1; Azul Oscuro sobre Fondo Hielo = 8.2:1), satisfaciendo los niveles AA y AAA de las pautas WCAG.
