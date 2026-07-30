import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di Vercel Environment Variables.' });
    }

    const ai = new GoogleGenAI({ apiKey });
    // Masukkan logika pemanggilan Gemini AI Anda di sini
    
    return res.status(200).json({ success: true, data: "Hasil generasi" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Terjadi kesalahan pada server' });
  }
}
