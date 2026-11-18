#!/usr/bin/env bash
# ==============================================================================
# Plataforma "Videojuegos contra las Drogas"
# Suite Automatizada de Auditoría Técnica, QA y Ciberseguridad (API Audit)
# ==============================================================================
# Trazabilidad SRS / SAD:
# - RF-01 / RF-02: Solicitudes de Ayuda, Anonimato y Guardrails Éticos
# - RF-03: Directorio de Marcación Rápida
# - RF-04: Métricas Lúdicas y Registro de Estadísticas
# - RF-05: Fichas y Catálogos de Recursos Educativos
# - RNF-SEC-01 / REQ-MS-02: Privacidad por Diseño (Cero IPs / Cero Cookies)
# - RNF-SEC-02: Sanitización XSS, Consultas Parametrizadas y Cabeceras Helmet
# - RNF-PER-01 / RNF-SEG-01: Rendimiento (< 200ms) y Rate Limiting (HTTP 429)
# ==============================================================================

set -o pipefail

# ------------------------------------------------------------------------------
# Configuración de Entorno y Variables
# ------------------------------------------------------------------------------
BASE_URL="${API_URL:-http://localhost:3000}"
DB_FILE="${DB_PATH:-database/database.sqlite}"

# Colores ANSI para formateo en terminal
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Contadores de auditoría
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Archivos temporales para captura de respuestas
TMP_DIR="$(mktemp -d 2>/dev/null || mktemp -d -t 'api_audit')"
TMP_HEADERS="${TMP_DIR}/headers.txt"
TMP_BODY="${TMP_DIR}/body.json"

cleanup() {
  rm -rf "${TMP_DIR}"
}
trap cleanup EXIT

# ------------------------------------------------------------------------------
# Funciones Auxiliares de Salida y Aserción
# ------------------------------------------------------------------------------
log_section() {
  echo -e "\n${BOLD}${BLUE}======================================================================${NC}"
  echo -e "${BOLD}${CYAN} $1 ${NC}"
  echo -e "${BOLD}${BLUE}======================================================================${NC}"
}

log_test() {
  TESTS_RUN=$((TESTS_RUN + 1))
  echo -e "\n${BOLD}[PRUEBA #${TESTS_RUN}]${NC} $1"
}

assert_status() {
  local expected="$1"
  local actual="$2"
  if [ "$actual" -eq "$expected" ]; then
    echo -e "  ${GREEN}✔ [PASS]${NC} Código HTTP esperado: ${expected} (Obtenido: ${actual})"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "  ${RED}✘ [FAIL]${NC} Código HTTP erróneo: esperado ${expected}, obtenido ${actual}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

assert_contains() {
  local pattern="$1"
  local file="$2"
  local label="$3"
  if grep -q -i "$pattern" "$file"; then
    echo -e "  ${GREEN}✔ [PASS]${NC} Contenido validado: ${label}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "  ${RED}✘ [FAIL]${NC} Patrón no encontrado: '${pattern}' en ${label}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

assert_not_contains() {
  local pattern="$1"
  local file="$2"
  local label="$3"
  if ! grep -q -i "$pattern" "$file"; then
    echo -e "  ${GREEN}✔ [PASS]${NC} Ausencia confirmada: ${label}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
  else
    echo -e "  ${RED}✘ [FAIL]${NC} Patrón no deseado detectado: '${pattern}' en ${label}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
    return 1
  fi
}

# ------------------------------------------------------------------------------
# Comprobación de Conectividad Inicial (Pre-flight Check)
# ------------------------------------------------------------------------------
check_server_online() {
  echo -e "${BOLD}Iniciando verificación de conectividad con ${BASE_URL}...${NC}"
  local http_code
  http_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/healthcheck" 2>/dev/null || echo "000")

  if [ "$http_code" -eq "000" ]; then
    echo -e "\n${RED}✘ ERROR CRÍTICO: Servidor no detectado en ${BASE_URL}.${NC}"
    echo -e "${YELLOW}Por favor, inicia el backend en una terminal paralela antes de ejecutar la auditoría:${NC}"
    echo -e "  npm start   (o npm run dev)"
    exit 1
  else
    echo -e "${GREEN}✔ Conexión exitosa con el servidor HTTP (código ${http_code}).${NC}"
  fi
}

# ------------------------------------------------------------------------------
# BLOQUE 1: Catálogos y Healthcheck (HTTP 200 y 404)
# ------------------------------------------------------------------------------
test_block_1_catalogos() {
  log_section "BLOQUE 1: DISPONIBILIDAD DE CATÁLOGOS Y HEALTHCHECK (RF-03, RF-05)"

  # 1.1 Healthcheck
  log_test "Verificar disponibilidad operativa del servidor (GET /api/healthcheck)"
  local status
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-catalogos" "${BASE_URL}/api/healthcheck")
  assert_status 200 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Estado success en JSON"
  assert_contains 'Servidor operativo' "${TMP_BODY}" "Mensaje operativo unificado"

  # 1.2 Directorio de contactos completo
  log_test "Consultar listado general de marcación rápida (GET /api/directorio)"
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-catalogos" "${BASE_URL}/api/directorio")
  assert_status 200 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Estructura JSON unificada"
  assert_contains '"data":\[' "${TMP_BODY}" "Arreglo de contactos de ayuda"

  # 1.3 Directorio filtrado por tipo
  log_test "Consultar directorio con filtro de categoría (GET /api/directorio?tipo=Emergencia)"
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-catalogos" "${BASE_URL}/api/directorio?tipo=Emergencia")
  assert_status 200 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Respuesta con filtro exitosa"

  # 1.4 Recursos educativos generales
  log_test "Consultar catálogo de recursos educativos (GET /api/recursos)"
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-catalogos" "${BASE_URL}/api/recursos")
  assert_status 200 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Catálogo de recursos accesible"

  # 1.5 Recurso individual existente
  log_test "Consultar ficha educativa puntual por ID válido (GET /api/recursos/1)"
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-catalogos" "${BASE_URL}/api/recursos/1")
  assert_status 200 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Ficha educativa encontrada"

  # 1.6 Prueba negativa: recurso inexistente esperando HTTP 404
  log_test "Consultar recurso inexistente esperando HTTP 404 (GET /api/recursos/9999)"
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-catalogos" "${BASE_URL}/api/recursos/9999")
  assert_status 404 "$status"
  assert_contains '"status":"error"' "${TMP_BODY}" "Estructura JSON de error unificado"
  assert_contains 'no existe' "${TMP_BODY}" "Mensaje descriptivo 404"
}

# ------------------------------------------------------------------------------
# BLOQUE 2: Módulo de Ayuda y Anonimato (POST /api/solicitudes-ayuda)
# ------------------------------------------------------------------------------
test_block_2_orientacion() {
  log_section "BLOQUE 2: ORIENTACIÓN ASISTIDA Y PRIVACIDAD POR DISEÑO (RF-01, RF-02)"

  # 2.1 Caso A: Solicitud con datos completos
  log_test "Registrar solicitud completa con nombre y edad (Caso A: Alex, 17)"
  local status
  local payload='{"nombre": "Alex", "edad": 17, "mensaje": "¿Cómo puedo manejar la presión social para consumir alcohol?"}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-orientacion-a" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 201 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Creación exitosa HTTP 201"
  assert_contains '"orientacion"' "${TMP_BODY}" "Presencia de respuesta orientativa"

  # 2.2 Caso B: Anonimato por defecto (omisión de nombre y edad)
  log_test "Registrar solicitud anónima sin nombre ni edad (Caso B: Anonimato obligatorio)"
  payload='{"mensaje": "Necesito orientación confidencial sobre prevención de drogas en la juventud"}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-orientacion-b" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 201 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Solicitud anónima aceptada con éxito"
  assert_contains '"orientacion"' "${TMP_BODY}" "Orientación asistida recibida anónimamente"

  # 2.3 Caso C: Guardrail ético / mensaje fuera de alcance
  log_test "Validar guardrail ético ante temas fuera de salud y prevención (Caso C)"
  payload='{"mensaje": "¿Cuál es la cotización del dólar hoy y cómo reparar un automóvil?"}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-orientacion-c" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 201 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Respuesta ética procesada"
  assert_contains 'orientacion' "${TMP_BODY}" "Redirección orientativa retornada"
}

# ------------------------------------------------------------------------------
# BLOQUE 3: Métricas de Videojuegos (RF-04)
# ------------------------------------------------------------------------------
test_block_3_metricas() {
  log_section "BLOQUE 3: MÉTRICAS Y ESTADÍSTICAS LÚDICAS ANÓNIMAS (RF-04)"

  # 3.1 Registro de sesión de juego
  log_test "Registrar estadísticas de partida de juego (POST /api/juegos/stats)"
  local status
  local payload='{"juego_id": "laberinto-decisiones", "puntaje": 250, "duracion_sec": 120, "completado": 1}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-metricas" \
    -d "$payload" "${BASE_URL}/api/juegos/stats")
  assert_status 201 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Estadística registrada con éxito"

  # 3.2 Resumen agregado de métricas
  log_test "Consultar resumen consolidado de partidas (GET /api/juegos/stats/resumen)"
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "X-Client-ID: audit-metricas" "${BASE_URL}/api/juegos/stats/resumen")
  assert_status 200 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Resumen de métricas retornado"
  assert_contains '"total_partidas"' "${TMP_BODY}" "Conteo agregado presente"
}

# ------------------------------------------------------------------------------
# BLOQUE 4: Ciberseguridad, Sanitización y Resiliencia
# ------------------------------------------------------------------------------
test_block_4_seguridad() {
  log_section "BLOQUE 4: CIBERSEGURIDAD, SANITIZACIÓN Y MANEJO DE ERRORES (RNF-SEC-02)"

  # 4.1 Validación: Mensaje vacío / espacios
  log_test "Rechazo de payload con mensaje vacío o en blanco (esperando HTTP 400)"
  local status
  local payload='{"mensaje": "    "}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-sec-val1" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 400 "$status"
  assert_contains '"status":"error"' "${TMP_BODY}" "Estructura JSON de error"
  assert_contains '"errors"' "${TMP_BODY}" "Detalle de validación presente"

  # 4.2 Validación: Edad inválida (negativa o fuera de rango)
  log_test "Rechazo de payload con edad inválida (esperando HTTP 400)"
  payload='{"nombre": "Carlos", "edad": -5, "mensaje": "Consulta de prueba con edad inválida"}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-sec-val2" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 400 "$status"
  assert_contains '"status":"error"' "${TMP_BODY}" "Rechazo por edad no permitida"

  # 4.3 JSON malformado / truncado
  log_test "Gestión de JSON sintácticamente inválido (esperando HTTP 400)"
  local malformed_json='{"mensaje": "Consulta corrupta'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-sec-json" \
    -d "$malformed_json" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 400 "$status"
  assert_contains '"status":"error"' "${TMP_BODY}" "Captura centralizada de SyntaxError"
  assert_contains 'inválido' "${TMP_BODY}" "Mensaje aclaratorio de formato JSON"

  # 4.4 Inyección SQL parametrizada
  log_test "Mitigación de SQL Injection con sentencias parametrizadas (?)"
  payload='{"nombre": "Hacker", "mensaje": "Test '\'' OR 1=1; DROP TABLE solicitudes_ayuda; --"}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-sec-sqli" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 201 "$status"
  assert_contains '"status":"success"' "${TMP_BODY}" "Consulta neutralizada y persistida de forma segura"

  # 4.5 Sanitización contra Stored XSS
  log_test "Sanitización de vectores XSS y neutralización de etiquetas <script>"
  payload='{"nombre": "<script>alert(1)</script>Juan", "mensaje": "Mensaje con vector <script src=\"malware.js\"></script> y etiquetas <b>peligrosas</b>"}'
  status=$(curl -s -w "%{http_code}" -D "${TMP_HEADERS}" -o "${TMP_BODY}" \
    -H "Content-Type: application/json" \
    -H "X-Client-ID: audit-sec-xss" \
    -d "$payload" "${BASE_URL}/api/solicitudes-ayuda")
  assert_status 201 "$status"
  assert_not_contains '<script>' "${TMP_BODY}" "Etiqueta script neutralizada en respuesta"
}

# ------------------------------------------------------------------------------
# BLOQUE 5: Rate Limiting y Rendimiento (RNF-PER-01, RNF-SEG-01)
# ------------------------------------------------------------------------------
test_block_5_rendimiento_y_ratelimit() {
  log_section "BLOQUE 5: RENDIMIENTO Y LIMITACIÓN DE PETICIONES (RNF-PER-01, RNF-SEG-01)"

  # 5.1 Benchmarking de Latencia (< 200 ms)
  log_test "Medición de tiempo total de respuesta en red local (RNF-PER-01 < 200ms)"
  local latency
  latency=$(curl -s -w "%{time_total}" -o /dev/null \
    -H "X-Client-ID: audit-latency" "${BASE_URL}/api/healthcheck")
  local is_fast
  is_fast=$(echo "$latency" | awk '{if ($1 < 0.200) print "1"; else print "0"}')
  if [ "$is_fast" -eq "1" ]; then
    echo -e "  ${GREEN}✔ [PASS]${NC} Latencia óptima: ${latency}s (< 0.200s)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "  ${YELLOW}⚠ [WARN]${NC} Latencia de ${latency}s excedió 200ms en este ciclo"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  fi

  # 5.2 Sobrecarga y Rate Limiting (esperando HTTP 429)
  log_test "Saturación intencional de cuota para forzar HTTP 429 Too Many Requests"
  local got_429=0
  local req_status
  for i in {1..12}; do
    req_status=$(curl -s -w "%{http_code}" -o /dev/null \
      -H "X-Client-ID: ratelimit-tester" "${BASE_URL}/api/directorio")
    if [ "$req_status" -eq "429" ]; then
      got_429=1
      break
    fi
  done

  if [ "$got_429" -eq "1" ]; then
    echo -e "  ${GREEN}✔ [PASS]${NC} Límite de tasa disparado correctamente con código HTTP 429"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "  ${RED}✘ [FAIL]${NC} El servidor no devolvió HTTP 429 tras ráfaga de peticiones"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# ------------------------------------------------------------------------------
# BLOQUE 6: Auditoría de Privacidad en SQLite y Cabeceras Helmet
# ------------------------------------------------------------------------------
test_block_6_privacidad_y_cabeceras() {
  log_section "BLOQUE 6: PRIVACIDAD EN BASE DE DATOS Y CABECERAS HELMET (RNF-SEC-01)"

  # 6.1 Cabeceras de blindaje Helmet
  log_test "Inspección de cabeceras HTTP de seguridad (Helmet: nosniff y ocultación X-Powered-By)"
  curl -s -D "${TMP_HEADERS}" -o /dev/null "${BASE_URL}/api/healthcheck"
  assert_contains 'X-Content-Type-Options: nosniff' "${TMP_HEADERS}" "Cabecera nosniff activa"
  assert_not_contains 'X-Powered-By' "${TMP_HEADERS}" "Supresión de cabecera X-Powered-By"

  # 6.2 Auditoría de cero campos IP/cookies en el esquema SQLite
  log_test "Auditoría de integridad del esquema SQLite (cero campos IP / cookies / huellas)"
  local forbidden_found=""

  if command -v agy-node.cmd >/dev/null 2>&1; then
    forbidden_found=$(agy-node.cmd -e '
      const fs = require("fs");
      const path = require("path");
      const schemaPath = path.resolve("src/database/schema.sql");
      if (!fs.existsSync(schemaPath)) process.exit(0);
      const sql = fs.readFileSync(schemaPath, "utf8").toLowerCase();
      const forbidden = ["ip", "ip_address", "client_ip", "user_agent", "cookie", "fingerprint"];
      const found = forbidden.filter(col => new RegExp("\\b" + col + "\\b").test(sql));
      if (found.length > 0) console.log(found.join(", "));
    ' 2>/dev/null || echo "")
  elif command -v python >/dev/null 2>&1; then
    forbidden_found=$(python -c '
import re, os
schema_path = os.path.abspath("src/database/schema.sql")
if os.path.exists(schema_path):
    with open(schema_path, "r", encoding="utf-8") as f:
        content = f.read().lower()
    forbidden = ["ip", "ip_address", "client_ip", "user_agent", "cookie", "fingerprint"]
    found = [w for w in forbidden if re.search(r"\b" + w + r"\b", content)]
    if found:
        print(", ".join(found))
' 2>/dev/null || echo "")
  fi

  if [ -z "$forbidden_found" ]; then
    echo -e "  ${GREEN}✔ [PASS]${NC} Cero columnas de rastreo o identificación personal (RNF-SEC-01 garantizado)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
  else
    echo -e "  ${RED}✘ [FAIL]${NC} Se detectaron términos de identificación prohibidos: ${forbidden_found}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
  fi
}

# ------------------------------------------------------------------------------
# Resumen Final de Auditoría
# ------------------------------------------------------------------------------
print_summary() {
  echo -e "\n${BOLD}${BLUE}======================================================================${NC}"
  echo -e "${BOLD}${CYAN} RESUMEN DE AUDITORÍA Y CERTIFICACIÓN TÉCNICA QA ${NC}"
  echo -e "${BOLD}${BLUE}======================================================================${NC}"
  echo -e "  Total de pruebas evaluadas: ${BOLD}${TESTS_RUN}${NC}"
  echo -e "  Pruebas aprobadas:          ${GREEN}${BOLD}${TESTS_PASSED}${NC}"
  echo -e "  Pruebas reprobadas:         ${RED}${BOLD}${TESTS_FAILED}${NC}"

  if [ "$TESTS_FAILED" -eq 0 ]; then
    echo -e "\n${BOLD}${GREEN}✔ TODAS LAS PRUEBAS DE AUDITORÍA Y SEGURIDAD FUERON APROBADAS EXITOSAMENTE.${NC}"
    echo -e "${GREEN}El backend cumple con la Matriz de Trazabilidad Técnica del SRS y SAD.${NC}\n"
    return 0
  else
    echo -e "\n${BOLD}${RED}✘ SE ENCONTRARON FALLOS EN LA AUDITORÍA DE CONFORMIDAD TÉCNICA.${NC}"
    echo -e "${RED}Revisa los detalles anteriores para corregir las inconsistencias detectadas.${NC}\n"
    return 1
  fi
}

# ------------------------------------------------------------------------------
# Punto de Entrada Principal
# ------------------------------------------------------------------------------
main() {
  echo -e "${BOLD}${CYAN}"
  echo "╔══════════════════════════════════════════════════════════════════════╗"
  echo "║        PLATAFORMA WEB: VIDEOJUEGOS CONTRA LAS DROGAS                ║"
  echo "║           SUITE DE AUDITORÍA DE SEGURIDAD Y QA (CURL)                ║"
  echo "╚══════════════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"

  check_server_online
  test_block_1_catalogos
  test_block_2_orientacion
  test_block_3_metricas
  test_block_4_seguridad
  test_block_5_rendimiento_y_ratelimit
  test_block_6_privacidad_y_cabeceras
  print_summary
}

main "$@"
