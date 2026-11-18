# Spec Delta

## Purpose

Define el ciclo de vida del controlador de solicitudes de ayuda, orquestando la interacción con el servicio generativo de IA, la persistencia segura y anónima en SQLite3 y la entrega de respuestas HTTP 201 estandarizadas.

## ADDED Requirements

### Requirement: Help Request Orchestration and AI Guidance Generation
El sistema SHALL orquestar la recepción de solicitudes de orientación, invocando asíncronamente el servicio de OpenAI (`generarOrientacion`) con el mensaje y la edad opcional, garantizando como salvaguarda defensiva que si `nombre` no está presente se asigne `'Anónimo'` y si `edad` está ausente se asigne `null`.

#### Scenario: Successful guidance generation with anonymous fallback
- **WHEN** el controlador recibe una petición válida con `mensaje` y sin `nombre`
- **THEN** invoca al servicio de orientación con `edad = null` y asegura que el alias procesado sea `'Anónimo'`.

### Requirement: Parameterized Persistence and Anonymity Enforcement
El sistema SHALL persistir el registro de la solicitud en la tabla `solicitudes_ayuda` utilizando exclusivamente sentencias SQL parametrizadas con marcadores de posición (`?`) a través del módulo central `runQuery`, omitiendo totalmente cualquier captura o almacenamiento de direcciones IP, User-Agent o huellas digitales del usuario.

#### Scenario: Safe parameterized insert into database
- **WHEN** el servicio de orientación retorna la respuesta generada
- **THEN** el sistema ejecuta una sentencia `INSERT INTO solicitudes_ayuda (nombre, edad, mensaje, respuesta) VALUES (?, ?, ?, ?)` garantizando prevención absoluta de inyección SQL.

### Requirement: Standardized Created Response Contract
El sistema SHALL responder inmediatamente tras la inserción con código HTTP 201 Created y la estructura JSON unificada `{ status: "success", code: 201, message: "Solicitud registrada correctamente.", data: { id, orientacion } }`.

#### Scenario: HTTP 201 response on successful help request creation
- **WHEN** la solicitud se inserta exitosamente en la base de datos
- **THEN** el cliente recibe una respuesta con código 201, el identificador autoincremental generado y el texto orientativo devuelto.

### Requirement: Asynchronous Error Forwarding to Global Handler
El sistema SHALL encapsular todo el flujo asíncrono en un bloque `try...catch` y MUST delegar cualquier excepción imprevista (fallo de conexión con la IA o con la base de datos) al middleware de manejo global mediante `next(error)`.

#### Scenario: Runtime exception delegation
- **WHEN** ocurre un error inesperado al invocar el servicio de IA o al persistir en la base de datos
- **THEN** el controlador captura el error y lo propaga a `next(error)` sin colapsar el proceso del servidor.
