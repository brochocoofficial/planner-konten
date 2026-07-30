import React, { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Sparkles, CheckCircle2, AlertCircle, Clock, ChevronDown, Info } from "lucide-react";
import { GenerationRequestInput } from "../types";
import {
  PRESET_PRODUCTS,
  ALL_TONE_OPTIONS,
  TARGET_AUDIENCE_CATEGORIES,
  DURATION_OPTIONS,
  PresetProduct
} from "../data/presets";
import { MultiSelect } from "./MultiSelect";

interface ProductFormProps {
  onSubmit: (data: GenerationRequestInput) => void;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onSubmit, isLoading }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imageMimeType, setImageMimeType] = useState<string | undefined>(undefined);

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [selectedAudiences, setSelectedAudiences] = useState<string[]>([
    "Ibu Rumah Tangga",
    "Pekerja Kantoran"
  ]);
  const [customAudienceDetail, setCustomAudienceDetail] = useState("");
  const [selectedTones, setSelectedTones] = useState<string[]>([
    "Soft Selling",
    "Storytelling"
  ]);
  const [duration, setDuration] = useState(DURATION_OPTIONS[3].value); // Default 60 Detik

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "File harus berupa gambar (JPG, PNG, WebP)" }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Ukuran gambar maksimal 10MB" }));
      return;
    }

    setErrors((prev) => {
      const copy = { ...prev };
      delete copy.image;
      return copy;
    });

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImagePreview(base64String);
      setImageBase64(base64String);
      setImageMimeType(file.type);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageBase64(undefined);
    setImageMimeType(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const loadPreset = (preset: PresetProduct) => {
    setProductName(preset.productName);
    setProductDescription(preset.productDescription);

    if (preset.targetAudience) {
      const parsedAudience = preset.targetAudience
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      setSelectedAudiences(parsedAudience.slice(0, 5));
    } else {
      setSelectedAudiences(["Ibu Rumah Tangga", "Pekerja Kantoran"]);
    }

    if (preset.tone) {
      const parsedTone = preset.tone
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      setSelectedTones(parsedTone.slice(0, 5));
    } else {
      setSelectedTones(["Soft Selling", "Storytelling"]);
    }

    setDuration(preset.duration);
    setImagePreview(preset.imageUrl);
    setImageBase64(preset.imageUrl);
    setImageMimeType("image/jpeg");
    setErrors({});
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!imagePreview) {
      newErrors.image = "Foto produk wajib diunggah.";
    }
    if (!productName.trim()) {
      newErrors.productName = "Nama produk wajib diisi.";
    }
    if (!productDescription.trim()) {
      newErrors.productDescription = "Deskripsi produk wajib diisi.";
    }
    if (!duration) {
      newErrors.duration = "Durasi video wajib dipilih.";
    }
    if (selectedTones.length < 1) {
      newErrors.tone = "Pilih minimal 1 tone konten.";
    }
    if (selectedTones.length > 5) {
      newErrors.tone = "Maksimal 5 tone konten dapat dipilih.";
    }
    if (selectedAudiences.length < 1 && !customAudienceDetail.trim()) {
      newErrors.targetAudience = "Pilih minimal 1 target audiens.";
    }
    if (selectedAudiences.length > 5) {
      newErrors.targetAudience = "Maksimal 5 target audiens dapat dipilih.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formattedTone = selectedTones.join(", ");
    const audienceParts = [...selectedAudiences];
    if (customAudienceDetail.trim()) {
      audienceParts.push(`Detail: ${customAudienceDetail.trim()}`);
    }
    const formattedAudience = audienceParts.join(", ");

    onSubmit({
      productName: productName.trim(),
      productDescription: productDescription.trim(),
      targetAudience: formattedAudience.trim() || undefined,
      tone: formattedTone.trim() || undefined,
      duration,
      imageBase64,
      imageMimeType
    });
  };

  return (
    <div id="product-form-container" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-[0_0_30px_rgba(14,165,233,0.1)]">
      {/* Form Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 mb-2 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
            <Sparkles className="w-3.5 h-3.5" /> Fast AI Generator for Affiliates
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Formulir Generator Konten Affiliate
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Lengkapi data produk di bawah untuk menghasilkan 30 Ide, Hook 2 Detik, Skrip Video & Caption Affiliate.
          </p>
        </div>

        {/* Preset quick test buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Contoh Cepat:</span>
          {PRESET_PRODUCTS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => loadPreset(preset)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-all font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>+ {preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Upload Foto Produk (WAJIB) */}
        <div>
          <label className="flex items-center justify-between text-sm font-semibold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5">
              1. Foto Produk <span className="text-rose-400 text-xs font-bold">(Wajib)</span>
            </span>
            <span className="text-xs text-slate-400 font-normal">PNG, JPG, WEBP (Max 10MB)</span>
          </label>

          {imagePreview ? (
            <div className="relative rounded-xl border-2 border-sky-500/50 bg-slate-950/60 p-3 flex flex-col sm:flex-row items-center gap-4 group shadow-[0_0_15px_rgba(14,165,233,0.15)]">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Preview Produk"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                  <CheckCircle2 className="w-4 h-4" /> Foto Produk Siap Menganalisis
                </div>
                <p className="text-xs text-slate-400">
                  AI akan mendeteksi kemasan, warna, tekstur, dan bentuk produk dari gambar ini secara otomatis.
                </p>
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors font-medium cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" /> Ganti Gambar Produk
                </button>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                errors.image
                  ? "border-rose-500 bg-rose-500/5"
                  : "border-slate-700 hover:border-sky-500 bg-slate-950/40 hover:bg-slate-950/80"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3 text-sky-400">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Klik untuk unggah foto produk atau drag & drop ke sini
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Gunakan foto produk yang jelas & terang agar analisis AI maksimal
              </p>
            </div>
          )}

          {errors.image && (
            <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.image}
            </p>
          )}
        </div>

        {/* Grid Step 2 & 6: Nama & Durasi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Step 2: Nama Produk (WAJIB) */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-semibold text-slate-200 mb-2">
              2. Nama Produk <span className="text-rose-400 text-xs font-bold">(Wajib)</span>
            </label>
            <input
              id="product-name"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Skintific 5X Ceramide Barrier Moisture Gel"
              className={`w-full px-4 py-2.5 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
                errors.productName ? "border-rose-500" : "border-slate-700 hover:border-slate-600"
              }`}
            />
            {errors.productName && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.productName}
              </p>
            )}
          </div>

          {/* Step 6: Durasi Video (WAJIB, max 2m) */}
          <div>
            <label htmlFor="video-duration" className="block text-sm font-semibold text-slate-200 mb-2">
              6. Durasi Maksimal Video <span className="text-rose-400 text-xs font-bold">(Wajib - Max 2 Menit)</span>
            </label>
            <div className="relative">
              <select
                id="video-duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all cursor-pointer"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                    ⏱️ {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {errors.duration && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.duration}
              </p>
            )}
          </div>
        </div>

        {/* Step 3: Deskripsi Produk (WAJIB) */}
        <div>
          <label htmlFor="product-desc" className="block text-sm font-semibold text-slate-200 mb-2">
            3. Deskripsi Produk & Keunggulan Utama <span className="text-rose-400 text-xs font-bold">(Wajib)</span>
          </label>
          <textarea
            id="product-desc"
            rows={4}
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="Tuliskan fitur utama, keunggulan, harga promo, bahan, komisi, atau masalah yang bisa diselesaikan produk ini..."
            className={`w-full px-4 py-3 rounded-xl bg-slate-950 border text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all ${
              errors.productDescription ? "border-rose-500" : "border-slate-700 hover:border-slate-600"
            }`}
          />
          {errors.productDescription && (
            <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.productDescription}
            </p>
          )}
        </div>

        {/* Step 4 & 5: Target Audiens & Tone Konten MultiSelects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800/80">
          {/* Step 4: Target Audiens (Multi Select: 1-5 choices) */}
          <div>
            <MultiSelect
              id="target-audience-multiselect"
              stepNumber="4."
              label="Target Audiens"
              isRequired={true}
              options={TARGET_AUDIENCE_CATEGORIES}
              selectedValues={selectedAudiences}
              onChange={setSelectedAudiences}
              maxSelection={5}
              minSelection={1}
              maxErrorMessage="Maksimal 5 target audiens dapat dipilih."
              placeholder="Pilih 1 - 5 target audiens..."
              helperText="Pilih maksimal 5 kategori audiens yang menjadi target utama promosi produk ini."
              customDetailValue={customAudienceDetail}
              onCustomDetailChange={setCustomAudienceDetail}
              customDetailPlaceholder="Tuliskan detail tambahan target audiens (opsional)..."
            />
            {errors.targetAudience && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.targetAudience}
              </p>
            )}
          </div>

          {/* Step 5: Tone Konten (Multi Select: 1-5 choices) */}
          <div>
            <MultiSelect
              id="content-tone-multiselect"
              stepNumber="5."
              label="Tone Konten"
              isRequired={true}
              options={ALL_TONE_OPTIONS}
              selectedValues={selectedTones}
              onChange={setSelectedTones}
              maxSelection={5}
              minSelection={1}
              maxErrorMessage="Maksimal 5 tone konten dapat dipilih."
              placeholder="Pilih 1 - 5 tone konten..."
              helperText="Pilih gaya penyampaian pesan video yang paling cocok dengan karakter akun milikmu."
            />
            {errors.tone && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.tone}
              </p>
            )}
          </div>
        </div>

        {/* Form Submit CTA */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-slate-950 bg-sky-500 hover:bg-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.35)] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5 fill-slate-950 animate-pulse" />
            <span>Generate Strategi Konten Affiliate Lengkap</span>
          </button>
        </div>
      </form>
    </div>
  );
};
