import { GenerationRequestInput } from "../types";

export interface PresetProduct extends GenerationRequestInput {
  id: string;
  label: string;
  category: string;
  imageUrl: string;
}

export const ALL_TONE_OPTIONS = [
  "Edukatif",
  "Soft Selling",
  "Hard Selling",
  "Storytelling",
  "Emotional",
  "FOMO",
  "Humor",
  "Professional",
  "Luxury",
  "Premium",
  "Friendly",
  "Casual",
  "Formal",
  "Inspiratif",
  "Motivasional",
  "Persuasif",
  "Viral",
  "Trendy",
  "Aesthetic",
  "ASMR",
  "Sinematik",
  "Minimalis",
  "Dramatis",
  "Eksklusif",
  "Fun",
  "Interaktif",
  "Relatable",
  "Elegant",
  "Gen Z",
  "Millennial"
];

export const TARGET_AUDIENCE_CATEGORIES = [
  "Ibu Rumah Tangga",
  "Pekerja Kantoran",
  "Freelancer",
  "Content Creator",
  "Affiliate",
  "Influencer",
  "Bisnis",
  "Pendidikan",
  "Komunitas",
  "Lifestyle",
  "Olahraga",
  "Kesehatan",
  "Gen Z & Anak Muda",
  "Pejuang Skincare",
  "Anak Kos",
  "Pecinta Gadget & Tech",
  "Lainnya"
];

export const PRESET_PRODUCTS: PresetProduct[] = [
  {
    id: "preset-1",
    label: "Glow Serum Vitamin C",
    category: "Skincare / Kecantikan",
    productName: "AuraGlow Vitamin C Brightening Serum",
    productDescription: "Serum pencerah wajah dengan 10% Vitamin C, Niacinamide, dan Centella Asiatica. Membantu memudarkan bekas jerawat, mencerahkan kulit kusam dalam 14 hari, dan memberikan kelembapan ekstra tanpa rasa lengket.",
    targetAudience: "Ibu Rumah Tangga, Pejuang Skincare, Content Creator",
    tone: "Soft Selling, Storytelling, Aesthetic",
    duration: "60 Detik",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "preset-2",
    label: "Mini Vacuum Portable",
    category: "Elektronik & Rumah Tangga",
    productName: "AirCleaner X1 Wireless Portable Vacuum",
    productDescription: "Mini vacuum cleaner nirkabel daya hisap 9000Pa. Dilengkapi garpu penyedot sudut sempit dan blower. Sangat cocok untuk membersihkan interior mobil, sela-sela keyboard, sofa, dan meja kerja.",
    targetAudience: "Pekerja Kantoran, Anak Kos, Lifestyle",
    tone: "Edukatif, Soft Selling, Relatable",
    duration: "30 Detik",
    imageUrl: "https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "preset-3",
    label: "Tote Bag Kanvas Waterproof",
    category: "Fashion & Aksesoris",
    productName: "UrbanCarry Waterproof Canvas Tote Bag",
    productDescription: "Tote bag kanvas tahan air dengan kompartemen laptop 15.6 inch, banyak kantong organizer, resleting utama anti maling, dan tali bahu busa empuk. Desain aesthetic cocok untuk kuliah dan kerja.",
    targetAudience: "Pekerja Kantoran, Freelancer, Gen Z & Anak Muda",
    tone: "Aesthetic, Minimalis, Trendy",
    duration: "45 Detik",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80"
  }
];

export const TONE_OPTIONS = ALL_TONE_OPTIONS.map((val) => ({
  value: val,
  label: val
}));

export const DURATION_OPTIONS = [
  { value: "15 Detik", label: "15 Detik (Fast Hook & Instant Impact)" },
  { value: "30 Detik", label: "30 Detik (Standar TikTok / Reels Populer)" },
  { value: "45 Detik", label: "45 Detik (Storytelling Ringkas)" },
  { value: "60 Detik", label: "60 Detik / 1 Menit (Edukasi + Demo Lengkap)" },
  { value: "90 Detik", label: "90 Detik / 1.5 Menit (Deep Review + Komparasi)" },
  { value: "120 Detik", label: "120 Detik / 2 Menit (Maksimal - Storytelling Mendalam)" }
];
