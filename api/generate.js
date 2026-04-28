export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt } = req.body || {};

    if (!prompt) {
      return res.status(400).json({ error: "Prompt kosong" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            response_modalities: ["TEXT", "IMAGE"]
          }
        }),
      }
    );

    const data = await response.json();

    let text = "";
    let image = null;

    if (data && data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content?.parts || [];

      for (const part of parts) {
        if (part.text) text += part.text;
        if (part.inlineData && part.inlineData.data) {
          image = part.inlineData.data;
        }
      }
    }

    return res.status(200).json({
      success: true,
      text,
      image
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message || "Internal Server Error"
    });
  }
}
