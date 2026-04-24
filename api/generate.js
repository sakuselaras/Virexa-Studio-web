let text = "";

// coba ambil semua kemungkinan format
if (data?.candidates?.length > 0) {
  const parts = data.candidates[0].content?.parts || [];

  text = parts
    .map(p => p.text || "")
    .join("")
    .trim();
}

// fallback kalau kosong
if (!text) {
  console.log("RAW RESPONSE:", JSON.stringify(data, null, 2));
  text = "AI tidak mengembalikan teks (cek log)";
}
