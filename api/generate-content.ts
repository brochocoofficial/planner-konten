import { GoogleGenAI, Type } from "@google/genai";

// JSON Schema untuk Gemini API
const contentResponseSchema = {
  type: Type.OBJECT,
  properties: {
    contentPillars: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          percentage: { type: Type.STRING },
          examples: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["title", "description", "percentage", "examples"]
      }
    },
    contentIdeas: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          title: { type: Type.STRING },
          pillar: { type: Type.STRING },
          format: { type: Type.STRING },
          angle: { type: Type.STRING },
          formulaUsed: { type: Type.STRING },
          quickHook: { type: Type.STRING },
          visualHook: { type: Type.STRING },
          summary: { type: Type.STRING },
          videoScript: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.INTEGER },
                timeFrame: { type: Type.STRING },
                formulaStage: { type: Type.STRING },
                visual: { type: Type.STRING },
                audio: { type: Type.STRING },
                overlayText: { type: Type.STRING }
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
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          verbalHook: { type: Type.STRING },
          visualAction: { type: Type.STRING },
          whyItWorks: { type: Type.STRING }
        },
        required: ["type", "verbalHook", "visualAction", "whyItWorks"]
      }
    },
    videoScript: {
      type: Type.OBJECT,
      properties: {
        duration: { type: Type.STRING },
        totalScenes: { type: Type.INTEGER },
        formulaUsed: { type: Type.STRING },
        conceptSummary: { type: Type.STRING },
        scenes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              sceneNumber: { type: Type.INTEGER },
              timeFrame: { type: Type.STRING },
              formulaStage: { type: Type.STRING },
              visual: { type: Type.STRING },
              audio: { type: Type.STRING },
              overlayText: { type: Type.STRING },
              tips: { type: Type.STRING }
            },
            required: ["sceneNumber", "timeFrame", "visual", "audio", "overlayText"]
          }
        }
      },
      required: ["duration", "totalScenes", "formulaUsed", "conceptSummary", "scenes"]
    },
    captionData: {
      type: Type.OBJECT,
      properties: {
        caption: { type: Type.STRING },
        cta: { type: Type.STRING },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
        fullText: { type: Type.STRING }
      },
      required: ["caption", "cta", "hashtags", "fullText"]
    },
    textOverlays: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.INTEGER },
          timeFrame: { type: Type.STRING },
          text: { type: Type.STRING },
          styleTip: { type: Type.STRING }
        },
        required: ["sceneNumber", "timeFrame", "text", "styleTip"]
      }
    }
  },
  required: ["contentPillars", "contentIdeas", "hooks", "videoScript", "captionData", "textOverlays"]
};

// Fungsi pembantu agar aman digunakan di Node (Express) maupun Vercel Edge/Fetch
function sendJsonResponse(res: any, statusCode: number, data: any) {
  if (res && typeof res.status === "function") {
    return res.status(statusCode).json(data);
  }
  return new Response(JSON.stringify(data), {
    status: statusCode,
    headers: { "Content-Type": "application/json" }
  });
}

export default async function handler(req: any, res?: any) {
  const method = req.method || "POST";
  if (method !== "POST") {
    return sendJsonResponse(res, 405, { error: "Method Not Allowed" });
  }

  try {
    let body = req.body;
    if (!body && typeof req.json === "function") {
      try {
        body = await req.json();
      } catch {
        body = {};
      }
    } else if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { productName, productDescription, targetAudience, tone, duration, imageBase64, imageMimeType } = body || {};

    if (!productName || !productDescription || !duration) {
      return sendJsonResponse(res, 400, {
        error: "Nama produk, deskripsi produk, dan durasi video wajib diisi."
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return sendJsonResponse(res, 500, {
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

    const systemPrompt = `Kamu adalah seorang Master Content Creator & Top Affiliate Marketer TikTok / IG Reels / Short Video berpengalaman tinggi di Indonesia...`;
    const userPrompt = `
DETAIL PRODUK:
- Nama Produk: ${productName}
- Deskripsi Produk: ${productDescription}
- Target Audiens: ${targetAudience || "Umum"}
- Tone Konten: ${tone || "Soft Selling"}
- Durasi Maksimal Video: ${duration}`;

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

    return sendJsonResponse(res, 200, {
      success: true,
      data: parsedData
    });

  } catch (error: any) {
    console.error("Error generating content:", error);
    return sendJsonResponse(res, 500, {
      error: error.message || "Gagal menghasilkan konten affiliate. Silakan coba lagi."
    });
  }
}
