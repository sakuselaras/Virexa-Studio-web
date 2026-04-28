// NEW FEATURE: Vercel Serverless Function sebagai proxy penghubung API Key Gemini
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    // Mengambil API Key dari Environment Variables Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server Error: GEMINI_API_KEY belum diatur di Vercel' });

    // Mengambil target model dari parameter URL (dikirim dari frontend)
    const { model } = req.query;
    const targetUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        if (!response.ok) return res.status(response.status).json(data);

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
