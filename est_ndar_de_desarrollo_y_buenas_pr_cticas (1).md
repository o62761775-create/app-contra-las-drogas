# ESTÁNDAR DE DESARROLLO Y BUENAS PRÁCTICAS DE CÓDIGO

## Proyecto: Plataforma Interactiva "Videojuegos contra las Drogas"

**Documento:** Coding Standards & Technical Guidelines

**Autores:** Heidy Zarai Yance Pariona, Zahory Victoria Palomino Moron

**Tecnologías:** Node.js, Express.js, SQLite3, HTML5, CSS3, JavaScript Vanilla (ES6+)

**Versión:** 1.0.0

**Fecha:** 28 de octubre de 2026

**Estado:** Aprobado para Fase de Construcción

---

## 1. Introducción y Propósito

El presente documento establece las reglas, normas de codificación y buenas prácticas obligatorias para el desarrollo de la plataforma web **"Videojuegos contra las Drogas"**.

El objetivo es garantizar la mantenibilidad, legibilidad, seguridad y rendimiento del código fuente, permitiendo que cualquier desarrollador pueda entender, auditar o escalar el proyecto siguiendo los mismos patrones de diseño.

---

## 2. Estructura Estándar del Proyecto

El proyecto adoptará una arquitectura modular clara, separando la capa cliente (servida como contenido estático) de la capa servidor y la base de datos.

```text
videojuegos-contra-drogas/
├── config/                      # Archivos de configuración general
│   └── database.js              # Inicialización y pool de SQLite3
├── public/                      # Capa Cliente / Archivos estáticos
│   ├── assets/                  # Audio e imágenes optimizadas
│   │   ├── audio/
│   │   └── images/
│   ├── css/                     # Hojas de estilo
│   │   ├── styles.css           # Estilos globales y tokens CSS
│   │   └── game.css             # Estilos específicos del Canvas
│   ├── js/                      # Scripts del cliente
│   │   ├── app.js               # Controlador global de la SPA
│   │   ├── chat.js              # Módulo de integración con el chatbot
│   │   └── game.js              # Motor de videojuego en HTML5 Canvas
│   └── index.html               # Punto de entrada de la interfaz de usuario
├── src/                         # Capa Servidor (Backend Node.js)
│   ├── controllers/             # Manejadores de rutas REST
│   │   ├── ayuda.controller.js  # Lógica para /api/solicitudes-ayuda
│   │   ├── directorio.controller.js
│   │   └── juego.controller.js
│   ├── middleware/              # Interceptores de peticiones HTTP
│   │   ├── errorHandler.js      # Manejador central de excepciones
│   │   ├── rateLimiter.js       # Protección contra denegación de servicio
│   │   └── validator.js         # Sanitización de datos de entrada
│   ├── routes/                  # Definición de endpoints Express
│   │   └── api.routes.js        # Enrutador principal de la API
│   └── services/                # Capa de integración con servicios
│       └── openai.service.js    # Conector REST a la API de OpenAI
├── database/                    # Persistencia de datos
│   ├── database.sqlite          # Archivo físico de SQLite (ignorado en Git)
│   └── schema.sql               # Scripts DDL de creación de tablas
├── .env.example                 # Plantilla de variables de entorno
├── .gitignore                   # Exclusión de archivos sensibles
├── package.json                 # Gestión de dependencias Node.js
├── README.md                    # Documentación de inicio rápido
└── server.js                    # Punto de entrada de la aplicación HTTP
```

---

## 3. Convenciones de Nombres (Naming Conventions)

Para asegurar coherencia entre archivos, variables y bases de datos, se aplican las siguientes normas estrictas:

| Elemento | Convención | Ejemplo |
| :--- | :--- | :--- |
| **Variables y Funciones JS** | `camelCase` | `obtenerSolicitudes()`, `usuarioAnonimo` |
| **Clases y Componentes JS** | `PascalCase` | `MotorJuego`, `ChatController` |
| **Constantes globales / Env** | `UPPER_SNAKE_CASE` | `OPENAI_API_KEY`, `MAX_RATE_LIMIT` |
| **Archivos JavaScript / CSS** | `kebab-case` | `ayuda.controller.js`, `styles.css` |
| **Clases CSS (BEM Simplificado)**| `kebab-case` | `.btn-primary`, `.chat-bubble-user` |
| **Tablas en Base de Datos** | `snake_case` (Plural) | `solicitudes_ayuda`, `estadisticas_juego` |
| **Columnas en Base de Datos** | `snake_case` (Singular)| `creado_en`, `duracion_sec` |
| **Rutas API REST** | `kebab-case` (Plural) | `/api/solicitudes-ayuda`, `/api/directorio` |

---

## 4. Estándares para el Frontend (HTML5, CSS3, JavaScript)

### 4.1 HTML5 Semántico
* Se deben utilizar etiquetas semánticas (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) para garantizar la accesibilidad y optimización.
* Todos los elementos interactivos o de formulario deben incluir atributos `id`, `name` y `aria-label` cuando corresponda.

### 4.2 CSS3 y Tokens Visuales
* **Prohibido el uso de CSS In-line** (`style="..."`) dentro del código HTML.
* **Uso obligatorio de Variables Nativas CSS (`:root`):**
  Todos los colores deben consumirse exclusivamente desde las variables del *Design System* oficial (`--color-primary`, `--color-secondary`, etc.).
* **Responsividad:** El diseño debe construirse siguiendo la estrategia **Mobile-First** usando CSS Flexbox y Grid, empleando la función `clamp()` o media queries estándar (`min-width: 768px`).

```css
/* Ejemplo de declaración obligatoria en styles.css */
:root {
  --color-primary: #2561BA;
  --color-secondary: #365687;
  --color-tertiary: #324054;
  --color-neutral: #FFFFFF;
  --color-bg: #F4F7FA;
}

.card-ayuda {
  background-color: var(--color-neutral);
  border: 1px solid var(--color-secondary);
  border-radius: 8px;
}
```

### 4.3 JavaScript Vanilla (ES6+)
* **Modo Estricto:** Se utilizará sintaxis moderna ES6+ (`const`, `let`, funciones flecha `() => {}`, desestructuración). **Queda prohibido el uso de `var`**.
* **Peticiones Asíncronas:** Se utilizará la API nativa `fetch()` combinada con `async/await`.
* **Manejo de Errores en Cliente:** Toda llamada de red debe incluir un bloque `try...catch` con una respuesta visual limpia al usuario.

```javascript
// Ejemplo estándar de petición Fetch en el cliente
async function enviarSolicitudAyuda(payload) {
  try {
    const response = await fetch('/api/solicitudes-ayuda', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error en la solicitud');
    }

    return data;
  } catch (error) {
    console.error('[Client Error]:', error.message);
    alert('Ocurrió un problema al enviar la consulta. Por favor intenta de nuevo.');
  }
}
```

---

## 5. Estándares para el Backend (Node.js & Express)

### 5.1 Manejo de Controladores y Promesas
* Cada controlador debe ser una función asíncrona dedicada que procese la petición (`req`) y retorne una respuesta estandarizada (`res`).
* No se debe incluir lógica de base de datos directamente en el controlador; se debe consumir a través del módulo de persistencia `config/database.js` o servicios dedicados.

### 5.2 Estructura Homogénea de Respuestas JSON
Todas las respuestas de la API deben seguir el estándar unificado de salida:

#### Respuestas Exitosas (`200 OK`, `201 Created`):
```json
{
  "status": "success",
  "code": 201,
  "message": "Solicitud registrada correctamente.",
  "data": {
    "id": 12,
    "orientacion": "Mensaje orientativo de ayuda..."
  }
}
```

#### Respuestas de Error (`400 Bad Request`, `500 Internal Error`):
```json
{
  "status": "error",
  "code": 400,
  "message": "El campo 'mensaje' es obligatorio y no puede estar vacío.",
  "errors": []
}
```

---

## 6. Estándares para la Base de Datos (SQLite3)

### 6.1 Prevención Extrema de Inyección SQL
* **Queda estrictamente prohibida la concatenación directa de cadenas en sentencias SQL.**
* Se deben utilizar obligatoriamente **consultas preparadas (Prepared Statements)** mediante marcadores de posición (`?`).

```javascript
// FORMA INCORRECTA (Vulnerable a SQL Injection)
// const sql = `INSERT INTO solicitudes_ayuda (mensaje) VALUES ('${req.body.mensaje}')`;

// FORMA CORRECTA (Uso de parámetros SQLite3)
const sql = `INSERT INTO solicitudes_ayuda (nombre, edad, mensaje, respuesta) VALUES (?, ?, ?, ?)`;
const params = [nombre || 'Anónimo', edad || null, mensaje, respuestaIA];

db.run(sql, params, function(err) {
  if (err) {
    console.error('Error al insertar registro:', err.message);
    return callback(err);
  }
  callback(null, this.lastID);
});
```

### 6.2 Modificaciones del Esquema (DDL)
* Los cambios estructurales en la base de datos se realizarán mediante scripts SQL contenidos dentro de la carpeta `database/schema.sql`.

---

## 7. Buenas Prácticas de Seguridad y Privacidad

1. **Aislamiento de Claves Secretas:**
   * Las variables del entorno (como `OPENAI_API_KEY` o `PORT`) residirán únicamente en el archivo `.env`.
   * El archivo `.env` **JAMÁS** debe subirse al repositorio de código (debe figurar en `.gitignore`).

2. **Anonimización por Diseño:**
   * El sistema no almacenará direcciones IP ni rastreará cookies de navegación en los endpoints públicos de la aplicación.
   * Si el usuario no especifica su nombre en las consultas de ayuda, la aplicación guardará de forma predeterminada el valor `'Anónimo'`.

3. **Seguridad HTTP:**
   * Se debe activar el paquete `helmet` en Node.js para ocultar cabeceras sensibles del servidor y prevenir ataques XSS.

---

## 8. Convención de Commits y Control de Versiones (Git)

Los mensajes de confirmación de código (*Git Commits*) deben seguir una estructura descriptiva basada en el estándar *Conventional Commits*:

* `feat:` Nueva característica desarrollada. (Ejemplo: `feat: agregar controlador para solicitudes de ayuda`)
* `fix:` Corrección de un error o bug. (Ejemplo: `fix: corregir validacion de campos vacios en el formulario`)
* `docs:` Cambios únicamente en la documentación. (Ejemplo: `docs: actualizar el diagrama del SDD`)
* `style:` Ajustes visuales en CSS o formato de código sin alterar lógica. (Ejemplo: `style: aplicar paleta institucional al boton de ayuda`)
* `refactor:` Reorganización de código que no corrige errores ni agrega funciones.

---

## 9. Matriz de Cumplimiento Técnico

| Criterio | Obligatoriedad | Herramienta de Verificación |
| :--- | :--- | :--- |
| **Separación de Capas** | Alta | Revisión de Estructura de Directorios |
| **Uso de Variables CSS** | Alta | Inspección de Código en `styles.css` |
| **Consultas SQL Preparadas** | Crítica | Auditoría de Seguridad en `config/database.js` |
| **Respuestas JSON Estandarizadas** | Alta | Pruebas de API (Postman / Fetch) |
| **Anonimato de Datos** | Crítica | Inspección de campos en SQLite |