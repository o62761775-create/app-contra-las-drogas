# Spec Delta

## Purpose

Proporcionar los tokens visuales globales de diseño, reset moderno CSS, jerarquía tipográfica accesible y componentes de interfaz reutilizables para garantizar consistencia estética, adaptabilidad Mobile-First y cumplimiento WCAG 2.1 AA en toda la plataforma.

## ADDED Requirements

### Requirement: Institutional Color Palette and Design Tokens
El sistema de estilos SHALL exponer en la pseudo-clase `:root` los tokens cromáticos institucionales del proyecto (`--color-primary`, `--color-secondary`, `--color-tertiary`, `--color-neutral`, `--color-background`, `--color-danger`), junto con elevaciones de sombra y radios estandarizados.

#### Scenario: Tokens declared and accessible in root scope
- **WHEN** el archivo de estilos `styles.css` es cargado por el navegador
- **THEN** las variables CSS de color, sombra y bordes redondeados están disponibles para todos los elementos del DOM

#### Scenario: Color contrast complies with WCAG 2.1 AA
- **WHEN** se combinan los tokens de texto principal (`--color-text-main`) sobre fondo claro (`--color-background`), o texto neutral (`--color-neutral`) sobre botones primarios (`--color-primary`) y de emergencia (`--color-danger`)
- **THEN** la relación de contraste cromático SHALL ser igual o superior a 4.5:1 para texto normal

### Requirement: Fluid Typography and Scale Management
El sistema SHALL implementar una jerarquía tipográfica con fuentes para titulares (`Brogte`, `Duality`) y cuerpo (`Forward Serif`, `Khaleefa`), con fuentes alternativas seguras del sistema y escalas fluidas calculadas mediante la función `clamp()`.

#### Scenario: Fluid typography scaling across screen widths
- **WHEN** la anchura del viewport varía dinámicamente entre dispositivos móviles de 320px y pantallas 4K
- **THEN** los encabezados H1, H2, H3 y textos de lectura escalan de forma continua y proporcional sin desbordar el contenedor

#### Scenario: Safe fallback font rendering
- **WHEN** las fuentes personalizadas no están descargadas localmente
- **THEN** el motor de renderizado aplica las fuentes de sistema especificadas (`sans-serif` para encabezados y `Georgia, serif` para lectura) preservando la legibilidad

### Requirement: Reusable Interactive Component Classes
El sistema SHALL proporcionar clases CSS reutilizables para botones interactivos (`.btn`, `.btn-primary`, `.btn-emergency`), tarjetas de contenido (`.card`) y estados de foco accesible (`:focus-visible`).

#### Scenario: Emergency action button displays distinctive visual cues
- **WHEN** un elemento interactivo incluye la clase `.btn-emergency`
- **THEN** el elemento SHALL adoptar el color de estado crítico (`--color-danger`), esquinas completamente redondeadas (`--radius-full`) y una animación de pulso continuo para rápida localización

#### Scenario: Card components apply elevation and hover feedback
- **WHEN** el usuario interactúa o posiciona el puntero sobre un elemento con clase `.card`
- **THEN** el componente eleva su sombra visual (`--shadow-md`) y aplica una sutil transición vertical (`translateY`) sin afectar el flujo del documento

### Requirement: Modern Accessible Reset and Mobile-First Layout Foundation
El sistema SHALL establecer una base de normalización y maquetación Mobile-First con modelo de caja `border-box`, gestión predecible de márgenes y soporte de foco visual accesible para navegación por teclado.

#### Scenario: Keyboard navigation presents visible focus indicator
- **WHEN** el usuario navega a través de elementos interactivos utilizando la tecla Tab
- **THEN** los elementos activos muestran un anillo de enfoque de alto contraste (`outline: 2px solid var(--color-primary)`) sin recortes de accesibilidad

#### Scenario: Layout default prioritizes mobile viewports
- **WHEN** la interfaz se visualiza en resoluciones inferiores a 768px
- **THEN** la grilla principal `.main-grid` distribuye el contenido en una sola columna vertical adaptativa
