# Tasks

## 1. Implementación del Controlador de Ayuda

- [x] 1.1 Configurar las importaciones de `runQuery` desde `../../config/database` y `generarOrientacion` desde `../services/openai.service` en `src/controllers/ayuda.controller.js`, verificando la separación de capas sin acceso directo al driver SQLite.
- [x] 1.2 Implementar la función asíncrona `crearSolicitudAyuda` con extracción segura, salvaguarda de anonimato (`nombreFinal = nombre || 'Anónimo'`, `edadFinal = edad ?? null`), invocación de orientación asistida e inserción parametrizada con `?` en `solicitudes_ayuda`, verificando la exclusión de datos de red.

## 2. Contrato de Respuesta y Manejo de Excepciones

- [x] 2.1 Implementar el retorno con código HTTP 201 Created y payload JSON `{ status: "success", code: 201, message, data: { id, orientacion } }`, envolviendo el flujo en `try...catch` con propagación limpia a `next(error)`.
- [x] 2.2 Exportar `crearSolicitudAyuda` en formato CommonJS (`module.exports`), verificando la coherencia sintáctica del módulo.

## 3. Validación y Control de Versiones

- [x] 3.1 Ejecutar `openspec validate --all` para verificar la validez e integridad de todos los artefactos de OpenSpec en el repositorio.
- [x] 3.2 Realizar el commit de la implementación siguiendo Conventional Commits: `feat: implementar controlador de solicitudes de ayuda con persistencia parametrizada y respuestas estandarizadas`.
