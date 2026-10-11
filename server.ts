import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Initialize Gemini AI
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }
    return new GoogleGenAI({ apiKey });
  };

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Friday AI Chat/Audit API Route
  app.post("/api/friday-ai", async (req, res) => {
    try {
      const { prompt, systemInstruction } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required." });
      }

      const ai = getAI();
      const model = "gemini-2.5-flash";

      const defaultSystem = systemInstruction || 
        "Kamu adalah Friday, AI asisten personal Monk Mode yang dingin, analitis, logis, dan menjunjung tinggi disiplin ekstrem (Brutal Transformation). Output HANYA boleh dalam format HTML murni (<b>, <i>, <p>, <table>, <ul>, dsb). DILARANG KERAS menggunakan format Markdown seperti **, ###, atau asteris. Gunakan bahasa Indonesia yang formal, tegas, tajam namun tetap membangun.";

      const response = await ai.models.generateContent({
        model,
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: defaultSystem,
          temperature: 0.7
        }
      });

      let rawText = response.text || "Maaf, Friday AI tidak dapat memberikan respon saat ini.";
      rawText = rawText.replace(/```html\n?/g, "").replace(/```json\n?/g, "").replace(/```\n?/g, "");

      res.json({ result: rawText });
    } catch (err: any) {
      console.error("Friday AI Error:", err);
      res.status(500).json({ 
        error: "Koneksi Friday AI terganggu. Tetap jalankan protokol.",
        message: err.message || "Internal server error"
      });
    }
  });

  // Bulk Parse JSON Endpoint using Gemini
  app.post("/api/friday-ai/bulk-parse", async (req, res) => {
    try {
      const { text, type } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const ai = getAI();
      const model = "gemini-2.5-flash";

      let promptInstruction = "";
      if (type === "workout") {
        promptInstruction = `Analisis teks jadwal latihan fitness berikut. Ekstrak menjadi JSON array murni:
[
  {"name": "Nama Gerakan", "detail": "Set/Rep/Durasi", "target": "Target Otot"}
]
Teks: ${text}`;
      } else if (type === "toefl" || type === "study") {
        promptInstruction = `Analisis teks jadwal belajar atau deep work berikut. Ekstrak menjadi JSON array murni:
[
  {"name": "Nama Task", "detail": "Instruksi detail", "time": "Durasi (cth: 15m, 30m)"}
]
Teks: ${text}`;
      } else {
        promptInstruction = `Analisis daftar materi/tugas IT berikut. Ekstrak menjadi JSON array murni:
[
  {"type": "video"|"case", "title": "Judul", "url": "URL jika ada", "desc": "Deskripsi jika ada"}
]
Teks: ${text}`;
      }

      const response = await ai.models.generateContent({
        model,
        contents: [{ role: "user", parts: [{ text: promptInstruction }] }],
        config: {
          systemInstruction: "Kembalikan HANYA JSON array murni tanpa markdown, tanpa ```json, tanpa penjelasan awal/akhir.",
          temperature: 0.2
        }
      });

      let textRes = response.text || "[]";
      textRes = textRes.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(textRes);
      res.json({ result: parsed });
    } catch (err: any) {
      console.error("Bulk Parse Error:", err);
      res.status(500).json({ error: "Gagal mengurai teks secara otomatis", message: err.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Monk Mode App Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
