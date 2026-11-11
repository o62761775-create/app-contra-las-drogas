# GUÍA DE DISEÑO DE INTERFAZ Y SISTEMA VISUAL (UI/UX)

## Proyecto: Plataforma Interactiva "Videojuegos contra las Drogas"

**Documento:** Frontend Design System & Style Guide  
**Autores:** Heidy Zarai Yance Pariona, Zahory Victoria Palomino Moron  
**Tecnologías:** HTML5, CSS3 (Variables Nativas, Flexbox, Grid), SVG, Canvas  
**Versión:** 1.0.0  
**Estado:** Aprobado para Desarrollo  

---

## 1. Visión de Diseño y Filosofía UX

El diseño visual de la plataforma **"Videojuegos contra las Drogas"** busca transmitir **empatía, serenidad, confianza y accesibilidad**. Se evita el tono punitivo o alarmista, apostando por una estética profesional y limpia que promueva un entorno seguro para los usuarios.

### Principios Fundamentales:
* **Entorno Libre de Estigmas:** Uso de tonos azules calmantes que facilitan la concentración y reducen la ansiedad.
* **Anonimato y Claridad:** Interfaces despejadas con llamadas a la acción (*CTA*) visibles para asistencia rápida.
* **Diseño Responsivo e Inclusivo:** Adaptabilidad total a dispositivos móviles, tablets, PC y consolas.

---

## 2. Paleta de Colores Institucional

La paleta cromática se basa estrictamente en la guía gráfica del proyecto. Se definen tokens de diseño nativos en CSS mediante Custom Properties.

### 2.1 Especificación Cromática

| Rol del Color | Nombre | Código Hexadecimal | Formato RGB | Aplicación Principal |
| :--- | :--- | :--- | :--- | :--- |
| **Primario** | Azul Royal | `#2561BA` | `rgb(37, 97, 186)` | Encabezados, botones primarios, enlaces activos, elementos destacados. |
| **Secundario** | Azul Pizarra | `#365687` | `rgb(54, 86, 135)` | Tarjetas, contenedores secundarios, bordes de enfoque, estados hover. |
| **Terciario** | Azul Oscuro / Grafito | `#324054` | `rgb(50, 64, 84)` | Textos principales, barras de navegación, pie de página (*footer*). |
| **Neutral** | Blanco Puro | `#FFFFFF` | `rgb(255, 255, 255)` | Fondos de tarjetas, texto sobre fondo oscuro, áreas de lectura limpia. |
| **Superficie / Fondo** | Gris Claro Hielo | `#F4F7FA` | `rgb(244, 247, 250)` | Fondo general de la aplicación. |
| **Estado Critico** | Rojo Emergencia | `#E53E3E` | `rgb(229, 62, 62)` | Botón de Marcación Rápida de Emergencia. |

### 2.2 Variables CSS (`:root`)

```css
:root {
  /* Paleta Oficial */
  --color-primary: #2561BA;
  --color-secondary: #365687;
  --color-tertiary: #324054;
  --color-neutral: #FFFFFF;
  
  /* Colores Funcionales */
  --color-background: #F4F7FA;
  --color-surface: #FFFFFF;
  --color-text-main: #324054;
  --color-text-muted: #5A6A80;
  --color-danger: #E53E3E;
  
  /* Sombras y Elevación */
  --shadow-sm: 0 2px 4px rgba(50, 64, 84, 0.08);
  --shadow-md: 0 4px 12px rgba(50, 64, 84, 0.12);
  --shadow-lg: 0 8px 24px rgba(37, 97, 186, 0.15);
  
  /* Bordes Redondeados */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
}
```

---

## 3. Tipografía y Jerarquía Visual

Para mantener un estilo visual consciente y legible, se estructuran las fuentes en dos familias: **Display/Encabezados** y **Lectura/Cuerpo**.

### 3.1 Familias Tipográficas

1. **Titulares y Display:** `Brogte`, `Duality`, sans-serif.
   * *Uso:* Logotipo, títulos principales (H1, H2), nombres de los videojuegos y llamadas de atención.
2. **Cuerpo y Lectura:** `Forward Serif`, `Khaleefa`, serif.
   * *Uso:* Artículos educativos, textos informativos, mensajes del chat y descripción de recursos.

### 3.2 Escala Tipográfica (Mobile & Desktop)

```css
/* Configuración de Fuentes */
body {
  font-family: 'Forward Serif', 'Khaleefa', Georgia, serif;
  font-size: 1rem; /* 16px */
  line-height: 1.6;
  color: var(--color-text-main);
  background-color: var(--color-background);
}

h1, h2, h3, .font-display {
  font-family: 'Brogte', 'Duality', 'Arial Black', sans-serif;
  letter-spacing: -0.02em;
}

/* Escala de Títulos */
h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  color: var(--color-primary);
  line-height: 1.2;
}

h2 {
  font-size: clamp(1.5rem, 3.5vw, 2.2rem);
  color: var(--color-secondary);
  line-height: 1.3;
}

h3 {
  font-size: 1.25rem;
  color: var(--color-tertiary);
}
```

---

## 4. Componentes UI Reutilizables

### 4.1 Botones (`.btn`)

Los botones cuentan con estados interactivos claros y cumplen con las normas de accesibilidad de contraste (WCAG 2.1 AA).

```css
/* Botón Base */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-family: 'Brogte', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  text-decoration: none;
}

/* Botón Primario */
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-neutral);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--color-secondary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

/* Botón de Emergencia / Marcación Rápida */
.btn-emergency {
  background-color: var(--color-danger);
  color: var(--color-neutral);
  border-radius: var(--radius-full);
  animation: pulse 2s infinite;
}
```

### 4.2 Tarjetas Informativas y de Juego (`.card`)

```css
.card {
  background-color: var(--color-surface);
  border: 1px solid rgba(54, 86, 135, 0.15);
  border-radius: var(--radius-md);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--color-primary);
}
```

### 4.3 Interfaz del Chatbot (Asistente de Orientación)

El módulo de orientación usa un formato de burbujas flotantes estilo mensajería anónima:

```css
.chat-container {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-bubble-user {
  background-color: var(--color-primary);
  color: var(--color-neutral);
  align-self: flex-end;
  border-radius: 16px 16px 0px 16px;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  max-width: 80%;
}

.chat-bubble-bot {
  background-color: var(--color-background);
  color: var(--color-tertiary);
  align-self: flex-start;
  border-radius: 16px 16px 16px 0px;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  max-width: 80%;
  border: 1px solid rgba(54, 86, 135, 0.1);
}
```

---

## 5. Diseño para el Módulo de Videojuegos (Canvas HTML5)

El contenedor del juego (`<canvas>`) se adapta automáticamente manteniendo una relación de aspecto fija de **16:9**.

```css
.game-wrapper {
  position: relative;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  aspect-ratio: 16 / 9;
  background-color: var(--color-tertiary);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

canvas#gameCanvas {
  width: 100%;
  height: 100%;
  display: block;
}
```

---

## 6. Layout y Adaptabilidad (Media Queries)

El diseño utiliza una grilla flexible CSS Grid para organizar las vistas principales.

```css
/* Layout Principal */
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Pantallas Medianas y Desktops (Tablets / PC) */
@media (min-width: 768px) {
  .main-grid {
    grid-template-columns: 2fr 1fr; /* Sección juegos/información + Panel Lateral Chat/Directorio */
  }
}
```