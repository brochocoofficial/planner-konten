export interface ContentPillar {
  title: string;
  description: string;
  percentage: string;
  examples: string[];
}

export interface ScriptScene {
  sceneNumber: number;
  timeFrame: string;
  visual: string;
  audio: string;
  overlayText: string;
  formulaStage?: string; // Tahapan formula copywriting (e.g., Attention, Problem, Agitate, Solution, Proof, Before, After, etc.)
  tips?: string;
}

export interface ContentIdea {
  id: number;
  title: string;
  pillar: string;
  format: string; // e.g. "Unboxing", "POV / Relatable", "Edukasi Produk", "Problem-Solving"
  angle: string;  // e.g. "Bandingin dengan produk lama", "Kesalahan pemula", "Rahasia glowing"
  formulaUsed?: string; // Formula copywriting yang digunakan: AIDA, PAS, BAB, 4U Headline, HCPI, atau FOMO Loop
  quickHook: string; // Verbal / Voiceover hook 2 detik
  visualHook?: string; // Visual action 2 detik di kamera
  summary: string;
  videoScript?: ScriptScene[]; // Skrip video khusus adegan demi adegan (4 - 10 scene)
}

export interface HookOption {
  type: string; // e.g., "Pattern Disrupt", "Controversy / Bold Statement", "Direct Problem", "Curiosity / Story"
  verbalHook: string;
  visualAction: string;
  whyItWorks: string;
}

export interface VideoScript {
  duration: string;
  totalScenes: number;
  formulaUsed?: string;
  conceptSummary: string;
  scenes: ScriptScene[];
}

export interface CaptionData {
  caption: string;
  cta: string;
  hashtags: string[];
  fullText: string;
}

export interface TextOverlay {
  sceneNumber: number;
  timeFrame: string;
  text: string;
  styleTip: string;
}

export interface GeneratedContentResult {
  id: string;
  timestamp: number;
  productInfo: {
    productName: string;
    productDescription: string;
    targetAudience?: string;
    tone?: string;
    duration: string;
    imagePreviewUrl?: string;
  };
  contentPillars: ContentPillar[];
  contentIdeas: ContentIdea[];
  hooks: HookOption[];
  videoScript: VideoScript;
  captionData: CaptionData;
  textOverlays: TextOverlay[];
}

export interface GenerationRequestInput {
  productName: string;
  productDescription: string;
  targetAudience?: string;
  tone?: string;
  duration: string;
  imageBase64?: string;
  imageMimeType?: string;
}
