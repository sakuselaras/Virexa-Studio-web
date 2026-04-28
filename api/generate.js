export default async function handler(req, res) {
  try {
    console.log("BODY:", req.body); // 🔥 DEBUG

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt wajib diisi" });
    }

    // lanjut seperti biasa...
