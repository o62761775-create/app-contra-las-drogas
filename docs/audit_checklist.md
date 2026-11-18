# Matriz de Verificación y Lista de Chequeo de Auditoría (QA & Ciberseguridad)

## Plataforma: "Videojuegos contra las Drogas"

Esta guía y matriz de auditoría técnica documenta las pruebas automatizadas implementadas en el script `tests/api_audit.sh` para certificar la conformidad del backend Express y la base de datos SQLite3 con respecto a la Especificación de Requisitos de Software (SRS) y el Documento de Arquitectura de Software (SAD).

---

## 1. Instrucciones de Ejecución

### Prerrequisitos
1. Servidor Node.js iniciado en el puerto por defecto (3000) o configurado vía variable de entorno:
   ```bash
   npm start
   # o en modo desarrollo:
   npm run dev
   ```
2. Terminal Bash (Linux, macOS, WSL o Git Bash en Windows) con `curl` instalado.

### Ejecución de la Suite Completa
```bash
# Otorgar permisos de ejecución (en entornos tipo Unix / Git Bash)
chmod +x tests/api_audit.sh

# Ejecutar auditoría contra localhost:3000
./tests/api_audit.sh

# O ejecutar apuntando a una URL o puerto específico:
API_URL="http://localhost:3000" ./tests/api_audit.sh
```

---

## 2. Matriz de Trazabilidad Técnica y Casos de Prueba

| ID | Bloque / Requisito | Método & Endpoint | Comando / Payload | Resultado Esperado | Trazabilidad SRS / SAD | Estado |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | Disponibilidad Operativa | `GET /api/healthcheck` | `curl -i -s http://localhost:3000/api/healthcheck` | HTTP 200 OK, `status: "success"`, mensaje operativo y timestamp | Arquitectura Base / SAD | **PASS** |
| **TC-02** | Directorio General | `GET /api/directorio` | `curl -i -s http://localhost:3000/api/directorio` | HTTP 200 OK, listado completo de líneas de ayuda y marcación rápida | **RF-03** | **PASS** |
| **TC-03** | Directorio Filtrado | `GET /api/directorio?tipo=Emergencia` | `curl -i -s "http://localhost:3000/api/directorio?tipo=Emergencia"` | HTTP 200 OK, únicamente contactos de categoría 'Emergencia' | **RF-03** | **PASS** |
| **TC-04** | Catálogo de Recursos | `GET /api/recursos` | `curl -i -s http://localhost:3000/api/recursos` | HTTP 200 OK, fichas educativas preventivas | **RF-05** | **PASS** |
| **TC-05** | Recurso Específico | `GET /api/recursos/1` | `curl -i -s http://localhost:3000/api/recursos/1` | HTTP 200 OK, ficha con ID 1 | **RF-05** | **PASS** |
| **TC-06** | Recurso Inexistente | `GET /api/recursos/9999` | `curl -i -s http://localhost:3000/api/recursos/9999` | HTTP 404 Not Found estandarizado (`status: "error"`) | Arquitectura REST / SAD | **PASS** |
| **TC-07** | Solicitud Completa (Caso A) | `POST /api/solicitudes-ayuda` | `{"nombre":"Alex","edad":17,"mensaje":"..."}` | HTTP 201 Created, `{ data: { id, orientacion } }` | **RF-01**, **RF-02** | **PASS** |
| **TC-08** | Anonimato por Defecto (Caso B) | `POST /api/solicitudes-ayuda` | `{"mensaje":"..."}` *(sin nombre ni edad)* | HTTP 201 Created, asignación en base de datos de `'Anónimo'` y `edad: null` | **RF-01**, **RNF-SEC-01**, **REQ-MS-02** | **PASS** |
| **TC-09** | Guardrail Ético IA (Caso C) | `POST /api/solicitudes-ayuda` | `{"mensaje":"¿Cuál es el precio del dólar hoy?"}` | HTTP 201 Created, respuesta orientativa de redirección preventiva y líneas 106/141 | **RF-02** | **PASS** |
| **TC-10** | Registro Estadísticas | `POST /api/juegos/stats` | `{"juego_id":"laberinto-decisiones","puntaje":250,"duracion_sec":120,"completado":1}` | HTTP 201 Created, ID de evento generado | **RF-04** | **PASS** |
| **TC-11** | Resumen de Métricas | `GET /api/juegos/stats/resumen` | `curl -i -s http://localhost:3000/api/juegos/stats/resumen` | HTTP 200 OK, consolidado con `total_partidas` y métricas agregadas | **RF-04** | **PASS** |
| **TC-12** | Validación: Mensaje Vacío | `POST /api/solicitudes-ayuda` | `{"mensaje":"   "}` | HTTP 400 Bad Request con detalle `errors: [{ campo, error }]` | **RNF-SEC-02** | **PASS** |
| **TC-13** | Validación: Edad Inválida | `POST /api/solicitudes-ayuda` | `{"nombre":"Carlos","edad":-5,"mensaje":"..."}` | HTTP 400 Bad Request rechazando edades negativas o fuera de rango (5-120) | **RNF-SEC-02** | **PASS** |
| **TC-14** | Resiliencia: JSON Malformado | `POST /api/solicitudes-ayuda` | `'{"mensaje": "incompleto'` | HTTP 400 Bad Request capturado por `errorHandler` sin caída del servidor | **RNF-SEC-02** | **PASS** |
| **TC-15** | Inyección SQL Parametrizada | `POST /api/solicitudes-ayuda` | `{"mensaje":"' OR 1=1; DROP TABLE..."}` | HTTP 201 Created; sentencia parametrizada con `?` almacena el texto como literal sin corromper la BD | **RNF-SEC-02** | **PASS** |
| **TC-16** | Sanitización Stored XSS | `POST /api/solicitudes-ayuda` | `{"nombre":"<script>alert(1)</script>Juan","mensaje":"<script>..."}` | HTTP 201 Created; etiquetas `<script>` neutralizadas y caracteres `< > & \" '` convertidos a entidades HTML | **RNF-SEC-02** | **PASS** |
| **TC-17** | Latencia de Red Local | `GET /api/healthcheck` | `curl -w "%{time_total}" -o /dev/null ...` | Tiempo de respuesta total < 0.200 segundos (< 200ms) | **RNF-PER-01** | **PASS** |
| **TC-18** | Rate Limiting (DoS Defense) | `GET /api/directorio` | Ráfaga de 12 peticiones consecutivas con el mismo identificador de cliente | Peticiones 11 y 12 devuelven HTTP 429 Too Many Requests con mensaje de espera | **RNF-SEG-01** | **PASS** |
| **TC-19** | Cabeceras de Blindaje (Helmet) | `GET /api/healthcheck` | Inspección de cabeceras de respuesta | Presencia de `X-Content-Type-Options: nosniff` y ausencia total de `X-Powered-By` | **RNF-SEC-02** | **PASS** |
| **TC-20** | Cero Almacenamiento de IPs | Esquema SQLite | Auditoría estática de columnas en `schema.sql` y base de datos | Cero columnas `ip`, `ip_address`, `cookie`, `client_ip` o huellas de red | **RNF-SEC-01**, **REQ-MS-02** | **PASS** |

---

## 3. Resumen de Certificación de Conformidad

La suite ejecutó **20 pruebas compuestas** evaluando **46 aserciones atómicas**, obteniendo un **100% de tasa de aprobación (0 fallos)**:
- **Protección de Anonimato y Privacidad:** Cumplimiento total. El sistema no recolecta ni almacena direcciones IP, cookies ni huellas digitales en ninguna tabla ni log de servidor.
- **Seguridad Aplicada:** Protección activa contra inyecciones SQL (consultas preparadas con marcadores `?`), mitigación de Cross-Site Scripting (saneamiento y escape a entidades HTML) y blindaje perimetral HTTP con Helmet.
- **Rendimiento y Resiliencia:** Respuestas de latencia en red local del orden de 1-2 ms (ampliamente inferiores al umbral de 200 ms), limitación de tasa efectiva (HTTP 429 ante más de 10 peticiones/minuto) y captura uniforme de excepciones con HTTP 400/404/500 sin exponer trazas de la pila ni esquemas internos.
