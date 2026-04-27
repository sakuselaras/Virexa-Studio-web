const express = require('express');
const path = require('path');
const app = express();

// Middleware untuk menyajikan file statis dari folder 'public'
// Pastikan index.html dan Admin.html berada di dalam folder 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Route untuk halaman utama (mengarah ke public/index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route untuk halaman Admin (bisa diakses via namadomain.com/admin)
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Admin.html'));
});

// Menangani route yang tidak ditemukan (404)
app.use((req, res) => {
    res.status(404).send('Halaman tidak ditemukan');
});

// Penting untuk Vercel: Jangan gunakan app.listen(...) jika hanya menggunakan Vercel Serverless
// Namun untuk testing lokal, kita bisa mengecek apakah dijalankan langsung
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server lokal berjalan di http://localhost:${PORT}`);
    });
}

// Export app agar bisa digunakan oleh Vercel Serverless Functions
module.exports = app;
