const express = require('express');
const path = require('path');
const app = express();

// Tingkatkan limit JSON agar bisa menerima gambar Base64 dari frontend
app.use(express.json({ limit: '50mb' }));

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk halaman utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- ENDPOINT BACKEND UNTUK API GEMINI ---
app.post('/api/gemini', async (req, res) => {
    try {
        // Mengambil API Key dari Environment Variables Vercel
        // Pastikan Anda menamakan variabelnya GEMINI_API_KEY di dashboard Vercel
        const apiKey = process.env.GEMINI_API_KEY; 
        
        if (!apiKey) {
            return res.status(500).json({ error: 'API Key Gemini belum disetting di Environment Variables Vercel.' });
        }

        // Ambil SELURUH payload yang sudah dirakit oleh index.html Anda
        const payloadDariFrontend = req.body;

        // Teruskan langsung ke server Google Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payloadDariFrontend) // Teruskan payload utuh
        });

        const data = await response.json();
        
        // Cek jika Google API mengembalikan error
        if (!response.ok) {
            console.error('Error dari Google API:', data);
            return res.status(response.status).json(data);
        }

        // Kirim balik respon dari Gemini ke index.html
        res.json(data);
    } catch (error) {
        console.error('Error saat menghubungi Gemini:', error);
        res.status(500).json({ error: 'Terjadi kesalahan pada server backend.' });
    }
});

// Menangani route yang tidak ditemukan (404)
app.use((req, res) => {
    res.status(404).send('Halaman tidak ditemukan');
});

// Ekspor app agar bisa dijalankan oleh Vercel
module.exports = app;
