# Design

## Context

El proyecto cuenta con la conexión a SQLite en `config/database.js` (con el helper parametrizado `runQuery`) y el esquema relacional en `src/database/schema.sql` (tabla `solicitudes_ayuda`). El endpoint `POST /api/solicitudes-ayuda` debe desacoplar la capa de transporte HTTP de la persistencia y de la inteligencia artificial, siguiendo una arquitectura en capas limpia. (Ver `proposal.md` y `specs/help-requests/spec.md`).

## Goals / Non-Goals

**Goals:**
- Implementar el controlador `src/controllers/ayuda.controller.js` con el método `crearSolicitudAyuda(req, res, next)`.
- Extraer defensivamente `nombre`, `edad` y `mensaje` de `req.body`, garantizando `'Anónimo'` y `null` como salvaguardas para campos opcionales.
- Invocar el servicio de inteligencia artificial `generarOrientacion(mensaje, edadFinal)` de forma asíncrona.
- Persistir de forma segura en `solicitudes_ayuda` mediante `runQuery` y marcadores de posición `?`.
- Devolver el contrato de respuesta HTTP 201 Created con el ID generado y la orientación obtenida.
- Capturar y propagar cualquier fallo imprevisto a través de `next(error)`.

**Non-Goals:**
- Importar la librería `sqlite3` o abrir conexiones directamente en el controlador.
- Implementar la lógica interna de comunicación HTTP con OpenAI (delegada a `src/services/openai.service.js`).
- Definir las rutas HTTP (delegadas a `src/routes/api.routes.js`).

## Decisions

### 1. Desacoplamiento de Capas e Inyección de Servicios
- **Decisión:** El controlador solo importa el helper `runQuery` de `../../config/database` y `generarOrientacion` de `../services/openai.service`.
- **Justificación:** Respeta estrictamente el principio de responsabilidad única (SRP) y las directrices de `AGENTS.md`. El controlador no conoce detalles del motor SQLite ni de los encabezados de autenticación de OpenAI.

### 2. Salvaguarda Defensiva de Anonimato
- **Decisión:** Aunque `validator.js` asigne `'Anónimo'` por defecto y verifique `edad`, el controlador aplica:
  ```javascript
  const nombreFinal = nombre || 'Anónimo';
  const edadFinal = edad !== undefined && edad !== null && edad !== '' ? Number(edad) : null;
  ```
- **Justificación:** Garantiza cumplimiento irrestricto de RNF-SEC-01 y REQ-MS-02 incluso si el controlador es invocado en entornos de testing unitario sin el middleware previo.

### 3. Consultas Preparadas contra Inyección SQL
- **Decisión:** Emplear la sentencia `INSERT INTO solicitudes_ayuda (nombre, edad, mensaje, respuesta) VALUES (?, ?, ?, ?)` pasando el array de parámetros a `runQuery`.
- **Justificación:** La concatenación de strings está expresamente prohibida por el estándar de seguridad (RNF-SEC-02).

### 4. Propagación de Errores Asíncronos
- **Decisión:** Toda la operación se encierra en un bloque `try...catch(error)` que ejecuta `next(error)`.
- **Justificación:** Permite que el middleware centralizado de errores capture excepciones de red con OpenAI o caídas de base de datos, formateando una respuesta homogénea sin interrumpir el proceso de Node.js.

## Risks / Trade-offs

- **[Riesgo de lentitud o caída de OpenAI]** → *Mitigación:* La llamada asíncrona está dentro del bloque `try...catch`. Cualquier fallo en el servicio de IA es capturado limpiamente y delegado a `next(error)` para que el cliente reciba un código de error controlado.
- **[Riesgo de datos desalineados si la inserción en BD falla]** → *Mitigación:* Si `runQuery` arroja error, no se emite respuesta HTTP 201; la promesa rechazada es atrapada y transferida al manejador global.
