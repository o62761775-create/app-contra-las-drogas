# ESPECIFICACIÓN DE REQUISITOS DE SOFTWARE (SRS)
## Proyecto: Plataforma Interactiva "Videojuegos contra las Drogas"

**Documento:** IEEE Std 830-1998 / ISO/IEC/IEEE 29148 Adapter  
**Autores:** Heidy Zarai Yance Pariona, Zahory Victoria Palomino Moron  
**Versión:** 1.0.0  
**Fecha:** 28 de octubre de 2026  
**Estado:** Aprobado para Diseño y Desarrollo (SDD)  

---

## 1. Introducción

### 1.1 Propósito
El presente documento tiene como objetivo definir la Especificación de Requisitos de Software (SRS) para la plataforma web interactiva y educativa **"Videojuegos contra las Drogas"**. Este documento sirve como base técnica oficial para el equipo de desarrollo, diseñadores y partes interesadas, guiando la fase de arquitectura (SDD), codificación y pruebas del sistema.

### 1.2 Alcance del Sistema
La plataforma "Videojuegos contra las Drogas" es un sistema enfocado en la prevención del consumo de sustancias psicoactivas y alcoholismo en jóvenes. Combina elementos lúdicos (minijuegos interactivos en HTML5/JS), contenido informativo veraz y libre de estigmas, un directorio de ayuda con marcación rápida y un asistente conversacional basado en la API de ChatGPT para brindar orientación inicial inmediata y anónima.

El sistema se construirá como una **Aplicación Web Responsive (PWA)**, garantizando compatibilidad multiplataforma en PC, smartphones, tablets y consolas de videojuegos mediante navegadores modernos.

### 1.3 Arquitectura General de Tecnologías
- **Frontend:** HTML5, CSS3 (Custom Properties & Responsive Design), JavaScript Vanilla (ES6+).
- **Backend:** Node.js, Express.js (REST API).
- **Base de Datos:** SQLite3 (Persistencia liviana de solicitudes, recursos y métricas).
- **Servicios Externos:** OpenAI API (ChatGPT - Modelo de orientación asistida).

---

## 2. Descripción General

### 2.1 Perspectiva del Producto
El sistema opera bajo un patrón de arquitectura en tres capas (*Client-Server architecture*):
1. **Capa de Presentación (Frontend):** Interfaz web ligera ejecutable en navegadores cliente.
2. **Capa de Lógica de Negocio (Backend):** Servidor HTTP en Node.js que gestiona rutas REST, aplica políticas de seguridad y comunica con servicios de IA.
3. **Capa de Datos e Integración:** Base de datos relacional SQLite y la API externa de OpenAI.

### 2.2 Características de los Usuarios
- **Usuario Final (Jóvenes / Público General):** Personas que buscan información sobre efectos de sustancias, apoyo para el cese del consumo o entretenimiento interactivo preventivo. No requieren conocimientos técnicos.
- **Usuario en Crisis / Vulnerable:** Usuario que requiere asistencia inmediata o soporte psicológico.
- **Administrador del Sistema:** Personal encargado de mantener actualizado el directorio de ayuda y auditar métricas de uso (sin acceso a datos personales).

### 2.3 Restricciones del Sistema
- **Sin Monetización / Publicidad:** Queda terminantemente prohibido incorporar redes de anuncios de terceros (*Zero Ads Policy*).
- **Anonimato Obligatorio:** No se exigirá autenticación previa (login/registro) para acceder a los minijuegos, la información preventiva o la solicitud de orientaciones.
- **Entorno de Ejecución SQLite:** Al ser una base de datos basada en archivos local, las operaciones de escritura concurrentes deben estar optimizadas en el backend.

---

## 3. Clasificación de Requisitos (Metodología MoSCoW)

| Identificador | Requisito | Prioridad | Clasificación |
| :--- | :--- | :--- | :--- |
| **REQ-MS-01** | Información veraz, objetiva y sin juicios sobre sustancias | Must Have | Funcional |
| **REQ-MS-02** | Garantía de Protección de Datos Personales y Anonimato | Must Have | No Funcional / Seguridad |
| **REQ-MS-03** | Inclusión de Minijuegos Interactivos sobre Prevención | Must Have | Funcional |
| **REQ-MS-04** | Diseño Gráfico Consistente con la Temática Visual | Must Have | No Funcional / Usabilidad |
| **REQ-MS-05** | Controles de Juego Intuitivos y Adaptables | Must Have | No Funcional / Usabilidad |
| **REQ-MS-06** | Compatibilidad Multiplataforma (PWA / Web Responsive) | Must Have | No Funcional / Portabilidad |
| **REQ-SH-01** | Asistente de Orientación Asistida mediante ChatGPT API | Should Have | Funcional |
| **REQ-SH-02** | Directorio de Contactos de Emergencia y Marcación Rápida | Should Have | Funcional |
| **REQ-SH-03** | Audio Inmersivo y Efectos Sonoros Adaptativos | Should Have | No Funcional / UX |
| **REQ-WH-01** | Exclusión Absoluta de Anuncios Publicitarios | Won't Have | Regla de Negocio |

---

## 4. Requisitos Funcionales Detallados

### 4.1 Módulo de Orientación y Solicitudes de Ayuda
#### **RF-01: Registro y Procesamiento de Solicitudes de Orientación**
- **Descripción:** El sistema debe permitir al usuario enviar una solicitud de ayuda u orientación médica/psicológica básica a través del endpoint REST.
- **Entrada:** JSON con campos opcionales (`nombre`, `edad`, `mensaje`).
- **Procesamiento:** El backend procesa la solicitud, la valida y genera una respuesta orientativa utilizando el servicio asistido por IA o respuestas predeterminadas de contención.
- **Salida:** Respuesta HTTP 201 (Creado) con cuerpo de confirmación y mensaje orientativo. En caso de fallo de formato, HTTP 400.

#### **RF-02: Asistente Conversacional Inteligente (ChatGPT API)**
- **Descripción:** El sistema integrará la API de OpenAI desde el backend para proporcionar respuestas informativas y de contención en tiempo real.
- **Regla de Sistema:** El backend incluirá un *System Prompt* estricto que restringe las respuestas a temas de prevención, salud mental y tratamiento de adicciones, bloqueando respuestas fuera de contexto.

#### **RF-03: Directorio de Marcación Rápida**
- **Descripción:** La interfaz debe proveer un menú accesible con números de contacto directo (`tel:` URI scheme) a líneas de atención de salud pública y centros de rehabilitación locales.

### 4.2 Módulo de Videojuegos Preventivos
#### **RF-04: Ejecución de Minijuegos en Cliente**
- **Descripción:** El frontend debe ejecutar minijuegos desarrollados en HTML5 Canvas y JavaScript Vanilla enfocados en la toma de decisiones y la concienciación sobre el consumo de drogas.
- **Comportamiento:** Los juegos deben ejecutarse directamente en el navegador sin requerir complementos ni descargas adicionales.

#### **RF-05: Módulo Informativo Educativo**
- **Descripción:** Sección de consulta con fichas informativas sobre el impacto biológico, psicológico y social del consumo de alcohol y drogas, redactadas con rigor científico y tono neutro.

---

## 5. Requisitos No Funcionales (Atributos de Calidad)

### 5.1 Seguridad y Privacidad (ISO/IEC 25010)
- **RNF-SEC-01 (Anonimato por Diseño):** El sistema no almacenará direcciones IP ni rastreará al usuario. El campo `nombre` en los formularios será opcional (pudiendo ser un alias).
- **RNF-SEC-02 (Cifrado de Comunicaciones):** Toda comunicación entre el navegador cliente, el servidor Node.js y la API de OpenAI debe realizarse obligatoriamente mediante transporte cifrado **TLS/HTTPS**.
- **RNF-SEC-03 (Protección de API Keys):** Las claves de la API de ChatGPT deben permanecer estrictamente protegidas en el servidor Node.js mediante variables de entorno (`.env`), nunca expuestas en el código cliente.

### 5.2 Usabilidad y Diseño Visual
- **RNF-USA-01 (Sistema de Diseño Cromático):** La interfaz respetará la paleta de colores institucional:
  - Color Primario: `#2561BA`
  - Color Secundario: `#365687`
  - Color Terciario: `#324054`
  - Color Neutral: `#FFFFFF`
- **RNF-USA-02 (Tipografía y Contrastes):** Uso estandarizado de tipografías primarias de exhibición (*Brogte*, *Duality*) y secundarias de lectura legibles (*Forward Serif*, *Khaleefa*), garantizando el cumplimiento de contraste WCAG 2.1 AA.
- **RNF-USA-03 (Adaptabilidad de Controles):** Los controles del videojuego deben mapearse automáticamente a entrada táctil (pantallas móviles), teclado (PC) o Gamepad (consolas).

### 5.3 Rendimiento y Portabilidad
- **RNF-PER-01 (Tiempo de Respuesta):** Los endpoints REST del servidor Node.js deben responder en menos de 200ms (excluyendo la latencia propia de la llamada a la API de ChatGPT).
- **RNF-POR-01 (Web Responsive):** El layout debe adaptarse dinámicamente mediante CSS Flexbox/Grid a resoluciones desde 320px (móviles) hasta 4K (desktops y consolas conectadas a TV).

---

## 6. Especificación de Endpoints REST (API Specification)

### Endpoint: `POST /api/solicitudes-ayuda`
- **Descripción:** Recibe y procesa consultas de apoyo u orientación de los usuarios.
- **Headers:** `Content-Type: application/json`

#### Estructura de Petición (Request Body):
```json
{
  "nombre": "Juan",
  "edad": 16,
  "mensaje": "Necesito orientación"
}
```

#### Respuestas HTTP:
- **`201 Created`**: Solicitud registrada y procesada exitosamente.
  ```json
  {
    "status": "success",
    "code": 201,
    "message": "Solicitud registrada correctamente.",
    "data": {
      "orientacion": "Recuerda que no estás solo. Puedes comunicarte a la línea gratuita de atención..."
    }
  }
  ```
- **`400 Bad Request`**: Formato de JSON inválido o mensaje vacío.
  ```json
  {
    "status": "error",
    "code": 400,
    "message": "Datos enviados incorrectamente o incompletos."
  }
  ```
- **`500 Internal Server Error`**: Fallo interno en la base de datos SQLite o en el servidor Node.js.
  ```json
  {
    "status": "error",
    "code": 500,
    "message": "Error interno del servidor."
  }
  ```

---

## 7. Matriz de Trazabilidad de Requisitos

| ID Requisito | Descripción Breve | Componente Frontend | Componente Backend | Base de Datos (SQLite) |
| :--- | :--- | :--- | :--- | :--- |
| **RF-01** | Solicitud de Ayuda | Formulario UI / Fetch API | Controller `/api/solicitudes-ayuda` | Tabla `solicitudes_ayuda` |
| **RF-02** | Chatbot Preventivo | Interfaz Chat JS | Service `openai.service.js` | N/A (En tránsito) |
| **RF-03** | Marcación Rápida | Componente HTML `DirectorioView` | Controller `/api/directorio` | Tabla `directorio_contactos` |
| **RF-04** | Minijuegos Preventivos | Módulo HTML5 `<canvas>` / JS | Servidor de archivos estáticos | Tabla `estadisticas_juego` |
| **RF-05** | Contenido Informativo | Vista Informativa HTML/CSS | Router `/api/recursos` | Tabla `recursos_educativos` |
