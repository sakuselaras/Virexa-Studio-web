export default async function handler(req, res) {
  return res.status(200).json({
    status: "API ROUTE HIDUP",
    geminiKey: process.env.GEMINI_API_KEY ? "ADA" : "KOSONG",
    googleKey: process.env.GOOGLE_API_KEY ? "ADA" : "KOSONG"
  });
}
