const modeEl = document.getElementById("mode");
const promptEl = document.getElementById("prompt");
const currentCodeEl = document.getElementById("currentCode");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");

let autoTimer;
let currentController;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#ff8a8a" : "#9fe7b7";
}

async function callGenerate() {
  const mode = modeEl.value;
  const prompt = promptEl.value.trim();
  const currentCode = currentCodeEl.value;

  if (!prompt) {
    setStatus("Escribe un prompt antes de continuar.", true);
    return;
  }

  if (currentController) {
    currentController.abort();
  }

  currentController = new AbortController();

  setStatus("Generando...");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, prompt, currentCode }),
      signal: currentController.signal
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error desconocido");
    }

    resultEl.value = data.result;
    setStatus("Listo: código completo generado.");
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }

    setStatus(error.message, true);
  }
}

generateBtn.addEventListener("click", callGenerate);

copyBtn.addEventListener("click", async () => {
  if (!resultEl.value) {
    setStatus("No hay código para copiar.", true);
    return;
  }

  await navigator.clipboard.writeText(resultEl.value);
  setStatus("Código copiado al portapapeles.");
});

function scheduleAutocomplete() {
  clearTimeout(autoTimer);

  if (modeEl.value !== "autocomplete") {
    return;
  }

  autoTimer = setTimeout(() => {
    callGenerate();
  }, 450);
}

promptEl.addEventListener("input", scheduleAutocomplete);
currentCodeEl.addEventListener("input", scheduleAutocomplete);
modeEl.addEventListener("change", () => {
  if (modeEl.value === "autocomplete") {
    setStatus("Autocompletado activo: responde mientras escribes.");
    scheduleAutocomplete();
  } else {
    setStatus("Modo actualizado.");
  }
});
