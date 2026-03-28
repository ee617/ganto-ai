const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export async function requestOpenAI({ apiKey, model, messages, temperature = 0.2 }) {
  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages,
      temperature
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error OpenAI (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("La API devolvió una respuesta vacía.");
  }

  return content;
}
