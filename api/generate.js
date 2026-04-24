export default async function handler(req, res) {
  // Pastikan hanya menerima method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // NEW FEATURE: Mengambil API key dan membersihkan spasi/karakter tersembunyi
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing in Vercel Environment Variables' });
  }

  const { action, prompt, base64Image, base64Images, ratio } = req.body;

  try {
    // Handling endpoint text generator
    if (action === 'text') {
      let parts = [{ text: prompt }];
      
      // Jika ada gambar sisipkan ke dalam payload
      if (base64Image) {
        parts.push({ inlineData: { mimeType: "image/jpeg", data: base64Image } });
      }
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts }] })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Terjadi kesalahan pada server AI Gemini');
      
      return res.status(200).json({ text: data.candidates?.[0]?.content?.parts?.[0]?.text || "" });
    } 
    
    // Handling endpoint image editor
    if (action === 'image') {
      const imageParts = base64Images.map(b64 => ({
        inlineData: { mimeType: "image/jpeg", data: b64 }
      }));
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [ { text: prompt }, ...imageParts ] }],
            generationConfig: { responseModalities: ['TEXT', 'IMAGE'] } 
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || 'Terjadi kesalahan render pada server AI Gemini');
      
      const base64 = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;
      if (!base64) throw new Error("AI gagal merender gambar, tidak ada respons base64");
      
      return res.status(200).json({ imageUrl: `data:image/jpeg;base64,${base64}` });
    }

    return res.status(400).json({ error: 'Action parameter (text/image) is required' });
    
  } catch (error) {
    // NEW FEATURE: Log di Vercel Dashboard untuk memudahkan debug masalah API
    console.error("Vercel Backend Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
