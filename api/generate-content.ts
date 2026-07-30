import { GoogleGenAI, Type } from "@google/genai";

// JSON Schema for Gemini Output
const contentResponseSchema = {
  type: Type.OBJECT,
  properties: {
    contentPillars: {
      type: Type.ARRAY,
      description: "Daftar 3-4 pilar konten utama strategi affiliate",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          percentage: { type: Type.STRING, description: "Contoh: 30%" },
          examples: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["title", "description", "percentage", "examples"]
      }
    },
    contentIdeas: {
      type: Type.ARRAY,
      description: "Tepat 30 ide konten affiliate yang unik dan bervariasi. Masing-masing Wajib dilengkapi Hook 2 Detik (Verbal + Visual), Formula Copywriting yang digunakan, dan Skrip Video adegan demi adegan",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER, description: "Nomor 1 sampai 30" },
          title: { type: Type.STRING },
          pillar: { type: Type.STRING },
          format: { type: Type.STRING, description: "Contoh: Unboxing, POV, Drama Singkat, Edukasi, Soft Selling" },
          angle: { type: Type.STRING, description: "Contoh: Mengatasi kegagalan, Rahasia hemat, Komparasi, Review Jujur" },
          formulaUsed: { type: Type.STRING, description: "Salah satu formula: AIDA, PAS, BAB, 4U Headline, HCPI, atau FOMO Loop" },
          quickHook: { type: Type.STRING, description: "Kalimat pembuka / voiceover Hook 2 detik pertama" },
          visualHook: { type: Type.STRING, description: "Aksi visual / B-roll di kamera pada detik 0-2" },
          summary: { type: Type.STRING, description: "Ringkasan konsep ide konten" },
          videoScript: {
            type: Type.ARRAY,
            description: "Adegan skrip video terstruktur (WAJIB BERVARIASI ANTARA 4 HINGGA 10 SCENE PER IDE, JANGAN DISERAGAMKAN 4 SCENE SEMUA) khusus ide konten ini sesuai durasi",
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                timeFrame: { type: Type.STRING, description: "Misal: 00:00 - 00:03" },
                formulaStage: { type: Type.STRING, description: "Tahap formula, misal: Attention / Problem / Before / Hook / Testing / Proof / Solution / CTA" },
                visual: { type: Type.STRING, description: "Aksi/Visual Kamera & B-Roll" },
                audio: { type: Type.STRING, description: "Voiceover/Audio Narasi" },
                overlayText: { type: Type.STRING, description: "Teks Layar (On-Screen Text)" }
              },
              required: ["sceneNumber", "timeFrame", "visual", "audio", "overlayText"]
            }
          }
        },
        required: ["id", "title", "pillar", "format", "angle", "formulaUsed", "quickHook", "visualHook", "summary", "videoScript"]
      }
    },
    hooks: {
      type: Type.ARRAY,
      description: "5 variasi Hook 2 detik pertama yang terbukti convert tinggi",
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "Jenis hook / formula (misal: 4U Headline, Pattern Disrupt, Direct Problem, Bold Statement, Curiosity)" },
          verbalHook: { type: Type.STRING, description: "Teks ucapan / voiceover hook" },
          visualAction: { type: Type.STRING, description: "Aksi visual di kamera pada detik 0-2" },
          whyItWorks: { type: Type.STRING, description: "Alasan mengapa hook ini efektif" }
        },
        required: ["type", "verbalHook", "visualAction", "whyItWorks"]
      }
    },
    videoScript: {
      type: Type.OBJECT,
      description: "Skrip cerita video hero produk terstruktur sesuai durasi yang diminta (berisi 4 - 10 scene)",
      properties: {
        duration: { type: Type.STRING },
        totalScenes: { type: Type.INTEGER, description: "Jumlah total scene (variatif antara 4 sampai 10 scene)" },
        formulaUsed: { type: Type.STRING, description: "Formula copywriting utama yang dipakai (misal: PAS / AIDA / HCPI / BAB / FOMO Loop)" },
        conceptSummary: { type: Type.STRING },
        scenes: {
          type: Type.ARRAY,
          description: "List adegan video (WAJIB antara 4 hingga 10 scene)",
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              timeFrame: { type: Type.STRING, description: "Contoh: 00:00 - 00:03" },
              formulaStage: { type: Type.STRING, description: "Tahap formula adegan ini" },
              visual: { type: Type.STRING, description: "Instruksi visual & B-Roll" },
              audio: { type: Type.STRING, description: "Skrip ucapan / Voiceover" },
              overlayText: { type: Type.STRING, description: "Teks di layar" },
              tips: { type: Type.STRING, description: "Tips ekspresi / angle kamera" }
            },
            required: ["sceneNumber", "timeFrame", "visual", "audio", "overlayText"]
          }
        }
      },
      required: ["duration", "totalScenes", "formulaUsed", "conceptSummary", "scenes"]
    },
    captionData: {
      type: Type.OBJECT,
      description: "Caption persuasif, Call To Action (CTA), dan Hashtag affiliate",
      properties: {
        caption: { type: Type.STRING, description: "Teks caption utama yang menarik perhatian" },
        cta: { type: Type.STRING, description: "Call To Action untuk klik keranjang kuning / link di bio" },
        hashtags: {
          type: Type.ARRAY,
          description: "List hashtag affiliate & niche produk (misal: #affiliate #racuntiktok)",
          items: { type: Type.STRING }
        },
        fullText: { type: Type.STRING, description: "Gabungan caption + CTA + Hashtags siap disalin" }
      },
      required: ["caption", "cta", "hashtags", "fullText"]
    },
    textOverlays: {
      type: Type.ARRAY,
      description: "3-5 rekomendasi teks overlay di layar video",
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER },
          timeFrame: { type: Type.STRING },
          text: { type: Type.STRING, description: "Teks singkat tajam yang muncul di layar" },
          styleTip: { type: Type.STRING, description: "Tips warna / animasi font (contoh: Kuning cetak tebal di tengah)" }
        },
        required: ["sceneNumber", "timeFrame", "text", "styleTip"]
      }
    }
  },
  required: ["contentPillars", "contentIdeas", "hooks", "videoScript", "captionData", "textOverlays"]
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { productName, productDescription, targetAudience, tone, duration, imageBase64, imageMimeType } = body || {};

    if (!productName || !productDescription || !duration) {
      return res.status(400).json({
        error: "Nama produk, deskripsi produk, dan durasi video wajib diisi."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "GEMINI_API_KEY belum dikonfigurasi di Vercel Environment Variables."
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemPrompt = `Kamu adalah seorang Master Content Creator & Top Affiliate Marketer TikTok / IG Reels / Short Video berpengalaman tinggi di Indonesia.
Tugasmu adalah menganalisis foto produk dan detail produk yang diberikan, kemudian membuatkan strategi konten affiliate yang sangat mendalam, kreatif, dan konversinya tinggi.

Gunakan KUMPULAN FORMULA COPYWRITING BERIKUT untuk membangun skrip video adegan demi adegan dan hook:

1. **AIDA (Attention - Interest - Desire - Action)** (Klasik & Serbaguna):
   - Attention: Hook 3 detik pertama (masalah / pertanyaan / statement kontroversial)
   - Interest: Bangun rasa penasaran & kaitkan dengan masalah spesifik audiens
   - Desire: Tunjukkan solusi (produk) + benefit konkret yang dirasakan
   - Action: CTA jelas (klik keranjang kuning, checkout sekarang)

2. **PAS (Problem - Agitate - Solution)** (Paling kuat untuk produk "Pain Point"):
   - Problem: Sebutkan masalah spesifik yang dialami target market
   - Agitate: Perbesar rasa "gregetan"-nya, tampilkan konsekuensi jika dibiarkan
   - Solution: Tunjukkan produk kamu sebagai jawaban pasti

3. **BAB (Before - After - Bridge)** (Bagus untuk transformasi visual / before-after):
   - Before: Kondisi lama (berantakan, ribet, kusam, mahal)
   - After: Kondisi ideal & memuaskan setelah menggunakan produk
   - Bridge: Produk sebagai jembatan langsung ke kondisi "after"

4. **4U Headline Formula** (Khusus untuk Hook & Judul pembuka, wajib minimal 2 dari 4 unsur):
   - Useful (Berguna), Urgent (Mendesak), Unique (Unik/beda), Ultra-specific (Sangat spesifik dengan angka)

5. **HCPI (Hook - Context - Proof - Invite/CTA)** (Script Threads Naratif / Storytelling low hard-selling):
   - Hook: Kalimat pembuka relatable / angka mengejutkan
   - Context: Latar belakang singkat kenapa butuh solusi / cerita ketemu masalah
   - Proof: Durasi pemakaian/testing + hasil/perubahan konkret & detail kredibel
   - Invite/CTA: Ajak cek link / keranjang kuning & sebutkan rating/jumlah review/terjual

6. **FOMO Loop** (Khusus review jujur / unboxing):
   - Hook Skeptis -> Testing/Proses -> Reveal Hasil Tak Terduga -> Social Proof (rating/terjual) -> CTA Terbatas (stok menipis / promo jam tertentu)

CRITICAL RULES UNTUK ADEGAN SKRIP VIDEO:
- OUTPUT YANG DIHASILKAN DALAM ADEGAN SKRIP VIDEO HARUS MEMBERIKAN 4 HINGGA 10 SCENE (4 - 10 SCENES).
- JANGAN DISAMA RATAKAN 4 SCENE SEMUA!
- Variasikan jumlah scene (misal ada yang 4 scene, 5 scene, 6 scene, 7 scene, 8 scene, 9 scene, atau 10 scene) tergantung durasi (${duration}), kerumitan alur, dan jenis formula yang digunakan.
- Tentukan dan sebutkan "formulaUsed" (AIDA, PAS, BAB, 4U Headline, HCPI, atau FOMO Loop) untuk tiap ide konten.
- Tentukan "formulaStage" pada tiap scene (misal: "Attention / Hook", "Problem", "Agitate", "Solution", "Before", "After", "Proof", "CTA").

Lakukan tugas berikut secara lengkap dalam bahasa Indonesia yang komunikatif, menarik, dan sesuai dengan algoritma video pendek (TikTok/Reels/Shorts):
1. **Konten Pilar**: Buat 3-4 pilar konten strategis (misal: Edukasi & Masalah, Soft Selling / Storytelling, Honest Review / Comparison, Lifestyle / Aesthetic).
2. **30 Ide Konten DENGAN Hook 2 Detik & Skrip Video Khusus**: Buat TEPAT 30 ide konten yang variatif (Nomor 1 sampai 30). Setiap ide konten WAJIB memiliki:
   - Hook 2 Detik Pertama (Verbal Voiceover + Visual Action di Kamera)
   - Formula copywriting yang dipakai (formulaUsed)
   - Skrip Video Lengkap adegan demi adegan (4 HINGGA 10 SCENE) dengan timeFrame, formulaStage, Visual B-roll, Voiceover audio, dan Teks Overlay.
3. **Hook 2 Detik Utama**: Buat 5 variasi Hook pembuka utama (Visual + Verbal) mengacu pada Formula 4U Headline / Pattern Disrupt.
4. **Skript Cerita Video Hero**: Buat skrip alur cerita video hero lengkap (4 - 10 scene) sesuai durasi maksimal yang dipilih (${duration}).
5. **Caption + CTA + Hashtag**: Buat caption persuasif, CTA tegas (keranjang kuning), dan hashtag affiliate.
6. **3-5 Teks Overlay**: Buat 3-5 teks overlay di layar untuk memikat penonton tanpa suara.`;

    const userPrompt = `
DETAIL PRODUK:
- Nama Produk: ${productName}
- Deskripsi Produk: ${productDescription}
- Target Audiens: ${targetAudience || "Umum / Pengguna media sosial yang membutuhkan solusi produk ini"}
- Tone Konten: ${tone || "Soft Selling & Storytelling (Bercerita & Relatable)"}
- Durasi Maksimal Video: ${duration}

Silakan analisis gambar produk (jika disertakan) serta detail di atas untuk menghasilkan strategi affiliate terlengkap. Jawablah sesuai struktur JSON yang telah disyaratkan.`;

    const parts: any[] = [];

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: imageMimeType || "image/jpeg",
          data: cleanBase64
        }
      });
    }

    parts.push({ text: userPrompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: contentResponseSchema
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Respon kosong dari Gemini AI API.");
    }

    const parsedData = JSON.parse(responseText);

    return res.status(200).json({
      success: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error("Error generating content:", error);
    return res.status(500).json({
      error: error.message || "Gagal menghasilkan konten affiliate. Silakan coba lagi."
    });
  }
}
