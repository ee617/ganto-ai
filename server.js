import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { buildMessages } from "./src/promptBuilder.js";
import { requestOpenAI } from "./src/openaiClient.js";

const app = express();
const port = process.env.PORT || 3000;
const model = process.env.OPENAI_MODEL || "gpt-4.1-mini";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, model, timestamp: new Date().toISOString() });
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt, currentCode = "", mode = "generate" } = req.body || {};

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Falta OPENAI_API_KEY en las variables de entorno."
      });
    }

    const messages = buildMessages({ mode, prompt, currentCode });
    const result = await requestOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model,
      messages,
      temperature: mode === "autocomplete" ? 0.15 : 0.2
    });

    return res.json({ mode, result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`TeamDead Script AI ejecutándose en http://localhost:${port}`);
});
