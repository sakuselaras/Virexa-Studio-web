export default async function handler(req, res) {
  // 🔒 Hanya izinkan POST
  if (req.method !== "POST") {
    return res.status(405).json({ text: "Method not allowed" });
  }

  try {
    const { prompt, image } = req.body;

    if (!prompt) {
      return res.status(400).json({ text: "Prompt kosong" });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ text: "API KEY tidak ditemukan di server" });
    }

    // 🔥 Build payload (support image optional)
    const parts = [{ text: prompt }];

    if (image) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: image
        }
      });
    }

    const payload = {
      contents: [
        {
          parts: parts
        }
      ]
    };

    // 🚀 Request ke Gemini
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    // 🧠 Ambil hasil text dengan aman
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "AI tidak mengembalikan respon";

    // ✅ Kirim ke frontend (format simple)
    return res.status(200).json({ text });

  } catch (error) {
    console.error("ERROR API:", error);

    return res.status(500).json({
      text: "Terjadi kesalahan di server"
    });
  }
}
