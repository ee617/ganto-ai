# TeamDead Script AI

Aplicación web para generar, corregir y optimizar scripts **completos** de Roblox Studio en Lua, enfocada en juegos **Team Deathmatch (Rojo/Azul)**.

## Qué incluye

- Generación de sistemas completos (Team Deathmatch, armas, HUD, eventos de partida).
- Corrección de errores de scripts Roblox con devolución de código completo.
- Optimización de rendimiento y estructura Server/Client.
- Modo de autocompletado en tiempo real mientras el usuario escribe.
- Panel básico con prompt, resultado y botón de copia.

## Requisitos

- Node.js 18+
- Clave de API de OpenAI

## Configuración

1. Instalar dependencias:

```bash
npm install
```

2. Crear `.env`:

```env
OPENAI_API_KEY=tu_api_key
OPENAI_MODEL=gpt-4.1-mini
PORT=3000
```

3. Ejecutar:

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Formato de salida forzado para Roblox

La app instruye al modelo para responder con secciones completas:

```txt
=== ServerScript: Nombre ===
-- código Lua
=== LocalScript: Nombre ===
-- código Lua
=== ModuleScript: Nombre ===
-- código Lua
```

Con esto se evita devolver fragmentos incompletos y se facilita pegar directamente en Roblox Studio.

## Arquitectura

- `server.js`: API HTTP y servidor estático.
- `src/promptBuilder.js`: reglas de generación/corrección/optimización/autocomplete.
- `src/openaiClient.js`: cliente de OpenAI.
- `public/`: interfaz web simple.

## Endpoints

### `POST /api/generate`

Body JSON:

```json
{
  "mode": "generate | fix | optimize | autocomplete",
  "prompt": "texto del usuario",
  "currentCode": "codigo opcional"
}
```

Respuesta:

```json
{
  "mode": "generate",
  "result": "scripts completos en formato Roblox"
}
```
