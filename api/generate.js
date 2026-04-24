export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key tidak ditemukan" });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: "Buatkan ide konten viral" }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    let text = "";

    if (data?.candidates?.length > 0) {
      const parts = data.candidates[0].content?.parts || [];
      text = parts.map(p => p.text || "").join("").trim();
    }

    return res.status(200).json({ text });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
