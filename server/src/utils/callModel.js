// Node 18+ has global fetch — no import needed

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export const callModel = async ({
  model,
  system,
  prompt,
  stream = false,
  maxTokens = 800,
  temperature = 0.7,
}) => {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) throw new Error("OPENROUTER_API_KEY missing");

  const body = {
    model,
    messages: [
      system ? { role: "system", content: system } : null,
      { role: "user", content: prompt },
    ].filter(Boolean),
    max_tokens: maxTokens,
    temperature,
    stream,
  };

  const resp = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": "DSA-Mentor",
    },
    body: JSON.stringify(body),
  });

  // Streaming mode → return the raw response stream
  if (stream) return resp;

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Model error: ${resp.status} ${errText}`);
  }

  const json = await resp.json();
  const text = json.choices?.[0]?.message?.content;

  return text ?? "";
};
