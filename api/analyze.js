// api/analyze.js
// Vercel Serverless Function — bezpieczny proxy do Anthropic API
// Klucz API nigdy nie trafia do przeglądarki użytkownika

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Brak klucza API — ustaw ANTHROPIC_API_KEY w Vercel" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Brak pola 'prompt' w body" });
    }

    if (prompt.length > 8000) {
      return res.status(400).json({ error: "Prompt zbyt długi" });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({
        error: errData?.error?.message || `Błąd API: ${response.status}`,
      });
    }

    const data = await response.json();
    const text = (data.content || []).map((b) => b.text || "").join("");

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) {
      return res.status(502).json({ error: "Model nie zwrócił poprawnego JSON" });
    }

    const jsonStr = text.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);

    return res.status(200).json(parsed);
  } catch (err) {
    console.error("AceBot API error:", err);
    return res.status(500).json({ error: err.message || "Wewnętrzny błąd serwera" });
  }
}
