/**
 * ==============================================================================
 * Plataforma: Videojuegos contra las Drogas
 * Archivo: src/services/openai.service.js
 * Descripción: Servicio de integración con la API de OpenAI para generación de
 *              orientación asistida, con guardrails éticos y modo de contingencia.
 * Trazabilidad: RF-01 (Orientación asistida), RF-02 (Guardrails de IA).
 * ==============================================================================
 */

let OpenAI;
try {
  OpenAI = require('openai');
} catch (e) {
  OpenAI = null;
}

const TEMAS_PREVENCION_REGEX = /(droga|alcohol|sustancia|cannabis|marihuana|vapeo|coca|tabaco|adicci|presi[oó]n|ansiedad|depresi[oó]n|ayuda|emoci[oó]n|amigo|familia|soledad|estr[eé]s|adicto|consumo|salud|orientaci[oó]n)/i;

const TEMAS_FUERA_DE_ALCANCE_REGEX = /(d[oó]lar|cotizaci[oó]n|auto|coche|veh[ií]culo|reparar|python|javascript|programar|c[oó]digo|capital de|receta de cocina|finanzas|cripto)/i;

/**
 * Mensaje ético de redirección cuando la consulta no pertenece al ámbito de salud.
 */
const MENSAJE_REDIRECCION_ETICA =
  'Este servicio está especializado exclusivamente en orientación preventiva sobre salud mental, sustancias psicoactivas, alcohol y bienestar emocional en jóvenes. Si requieres asistencia en otros tópicos te sugerimos consultar fuentes apropiadas. Si estás pasando por un momento difícil o tienes dudas sobre consumo, cuentas con la Línea 106 o Línea 141 disponibles 24/7 de forma confidencial y gratuita.';

/**
 * Respuesta empática por defecto en modo contingencia (sin API key o ante error de red).
 */
const generarRespuestaContingencia = (mensaje, edad) => {
  const saludoEdad = edad ? ` Considerando tu edad (${edad} años), es` : ' Es';
  return (
    `Gracias por comunicarte y compartir tu inquietud.${saludoEdad} muy valioso buscar orientación informada. ` +
    'Tomar decisiones saludables implica conocer los riesgos de las sustancias, fortalecer tu autonomía y aprender a decir "no" ante la presión social. ' +
    'Recuerda que no estás solo: cuentas con profesionales listos para escucharte sin juzgarte en la Línea Nacional 106 y en la Línea 141 (gratuitas y 24/7).'
  );
};

/**
 * Genera una respuesta orientativa asistida para una solicitud de ayuda.
 *
 * @param {string} mensaje - Mensaje o consulta enviada por el usuario.
 * @param {number|null} edad - Edad del usuario (opcional).
 * @returns {Promise<string>} Texto orientativo con guardrails aplicados.
 */
const generarOrientacion = async (mensaje, edad = null) => {
  if (!mensaje || typeof mensaje !== 'string') {
    return 'Por favor comparte tu consulta para que podamos brindarte orientación.';
  }

  const textoLimpio = mensaje.trim();

  // Guardrail ético: Detección de consultas claramente ajenas al propósito
  if (TEMAS_FUERA_DE_ALCANCE_REGEX.test(textoLimpio) && !TEMAS_PREVENCION_REGEX.test(textoLimpio)) {
    return MENSAJE_REDIRECCION_ETICA;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'tu_clave_de_openai_aqui' || !OpenAI) {
    return generarRespuestaContingencia(textoLimpio, edad);
  }

  try {
    const openai = new OpenAI({ apiKey });
    const promptSistema =
      'Eres un orientador educativo y de salud mental empático, comprensivo y profesional de la plataforma "Videojuegos contra las Drogas". ' +
      'Tu objetivo es guiar a jóvenes en prevención de sustancias psicoactivas y manejo emocional, sin juzgar ni estigmatizar. ' +
      'Si el usuario pregunta algo no relacionado con salud o adicciones, reorienta respetuosamente. ' +
      'Recuerda siempre mencionar las líneas de ayuda gratuitas y confidenciales (Línea 106 y Línea 141) cuando sea conveniente.';

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: promptSistema },
        {
          role: 'user',
          content: edad ? `[Usuario de ${edad} años]: ${textoLimpio}` : textoLimpio
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return completion.choices?.[0]?.message?.content?.trim() || generarRespuestaContingencia(textoLimpio, edad);
  } catch (error) {
    // Si la API falla por saldo, red o timeout, se retorna el modo de contingencia sin romper el flujo
    return generarRespuestaContingencia(textoLimpio, edad);
  }
};

module.exports = {
  generarOrientacion
};
