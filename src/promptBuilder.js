const BASE_RULES = `Eres un desarrollador senior de Roblox Studio especializado en Team Deathmatch.
SIEMPRE responde con código Lua completo y funcional.
No uses placeholders como "..." o "TODO".
Debes separar la respuesta por scripts con este formato estricto:
=== ServerScript: <nombre> ===
<codigo>
=== LocalScript: <nombre> ===
<codigo>
=== ModuleScript: <nombre> ===
<codigo>
Incluye comentarios cortos dentro del código para explicar la lógica.
Usa buenas prácticas:
- Validar nil y referencias.
- Lógica sensible en servidor.
- RemoteEvents para cliente/servidor.
- Estructura compatible con Roblox Studio.
- Soporte para equipos Rojo y Azul.
- Sistema de kills, muertes y ranking para Team Deathmatch.
`;

export function buildMessages({ mode, prompt, currentCode = "" }) {
  if (!prompt || !prompt.trim()) {
    throw new Error("El prompt no puede estar vacío.");
  }

  const instructionsByMode = {
    generate: "Genera un sistema completo a partir del requerimiento del usuario.",
    fix: "Detecta errores del código, explica brevemente y devuelve el script completo corregido.",
    optimize: "Optimiza rendimiento y estabilidad, manteniendo funcionalidad.",
    autocomplete: "Completa y mejora el código en tiempo real según el contexto parcial del usuario."
  };

  const modeInstruction = instructionsByMode[mode] || instructionsByMode.generate;

  const userContent = [
    `Modo: ${mode}.`,
    modeInstruction,
    `Requerimiento del usuario: ${prompt.trim()}`,
    currentCode?.trim() ? `Código actual del usuario:\n${currentCode.trim()}` : ""
  ]
    .filter(Boolean)
    .join("\n\n");

  return [
    { role: "system", content: BASE_RULES },
    { role: "user", content: userContent }
  ];
}
