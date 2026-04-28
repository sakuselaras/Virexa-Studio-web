export default async function handler(req, res) {
  // hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt wajib diisi" });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ]
        }),
      }
    );

    const data = await response.json();

    // ambil teks hasil AI dengan aman
    let text = "Tidak ada respon dari AI";

    if (data?.candidates?.length > 0) {
      const parts = data.candidates[0].content?.parts || [];

      for (const part of parts) {
        if (part.text) {
          text += part.text;
        }
      }
    }

    return res.status(200).json({
      success: true,
      result: text,
      raw: data // opsional (untuk debug)
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
