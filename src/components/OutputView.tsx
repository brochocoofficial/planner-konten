import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  LayoutGrid,
  Lightbulb,
  Film,
  FileText,
  Type,
  Video,
  ArrowLeft,
  Search,
  Clock,
  Download,
  Printer,
  FileSpreadsheet,
  Eye,
  Volume2,
  FileType
} from "lucide-react";
import { GeneratedContentResult, ContentIdea } from "../types";
import { IdeaDetailModal } from "./IdeaDetailModal";
import { downloadPdfReport } from "../utils/generatePdf";

interface OutputViewProps {
  result: GeneratedContentResult;
  onBackToForm: () => void;
}

export const OutputView: React.FC<OutputViewProps> = ({ result, onBackToForm }) => {
  const [activeTab, setActiveTab] = useState<"pillars" | "ideas" | "hooks" | "script" | "caption" | "overlays">("ideas");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<ContentIdea | null>(null);

  // Search & Filter for 30 Ideas
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPillarFilter, setSelectedPillarFilter] = useState<string>("all");

  const copyToClipboard = (text: string, sectionName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Filter 30 ideas
  const filteredIdeas = result.contentIdeas.filter((idea) => {
    const matchesSearch =
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.quickHook.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPillar =
      selectedPillarFilter === "all" || idea.pillar.toLowerCase() === selectedPillarFilter.toLowerCase();

    return matchesSearch && matchesPillar;
  });

  // Extract unique pillars for filter dropdown
  const uniquePillars = Array.from(new Set(result.contentIdeas.map((i) => i.pillar)));

  const generateFullTextReport = () => {
    return `==================================================
PAKET STRATEGI KONTEN AFFILIATE PRO
PRODUK: ${result.productInfo.productName}
DURASI VIDEO: ${result.productInfo.duration}
DESKRIPSI: ${result.productInfo.productDescription}
==================================================

1. KONTEN PILAR STRATEGIS
${result.contentPillars
  .map(
    (p, idx) =>
      `[Pilar ${idx + 1}] ${p.title} (${p.percentage})
Description: ${p.description}
Contoh Tema: ${p.examples.join(", ")}`
  )
  .join("\n\n")}

--------------------------------------------------
2. 30 IDE KONTEN DENGAN HOOK 2 DETIK & SKRIP VIDEO
${result.contentIdeas
  .map(
    (i) =>
      `========================================
IDE #${i.id}: ${i.title}
Pilar: ${i.pillar} | Format: ${i.format} | Angle: ${i.angle}

HOOK 2 DETIK PERTAMA:
🗣️ Voiceover: "${i.quickHook}"
🎬 Visual: ${i.visualHook || "Aksi cepat di kamera"}

RINGKASAN KONSEP:
${i.summary}

SKRIP ADEGAN DEMI ADEGAN:
${
  i.videoScript && i.videoScript.length > 0
    ? i.videoScript
        .map(
          (s) =>
            `  • Scene ${s.sceneNumber} (${s.timeFrame}):
    - Visual: ${s.visual}
    - Audio: "${s.audio}"
    - Text Overlay: "${s.overlayText}"`
        )
        .join("\n")
    : "  - Sesuai ringkasan konsep di atas."
}`
  )
  .join("\n\n")}

--------------------------------------------------
3. HOOK 2 DETIK PERTAMA UTAMA
${result.hooks
  .map(
    (h, idx) =>
      `Variasi #${idx + 1} [${h.type}]
Visual Kamera: ${h.visualAction}
Voiceover: "${h.verbalHook}"
Mengapa Efektif: ${h.whyItWorks}`
  )
  .join("\n\n")}

--------------------------------------------------
4. SKRIPT CERITA VIDEO HERO (${result.videoScript.duration})
Ringkasan: ${result.videoScript.conceptSummary}

${result.videoScript.scenes
  .map(
    (s) =>
      `[Scene ${s.sceneNumber} - ${s.timeFrame}]
Visual: ${s.visual}
Voiceover: "${s.audio}"
Text Overlay: "${s.overlayText}"`
  )
  .join("\n\n")}

--------------------------------------------------
5. CAPTION, CTA & HASHTAG
${result.captionData.fullText}

--------------------------------------------------
6. 3-5 TEKS OVERLAY
${result.textOverlays.map((t) => `Scene ${t.sceneNumber} (${t.timeFrame}): "${t.text}" - ${t.styleTip}`).join("\n")}
`;
  };

  const handleDownloadTxt = () => {
    const reportText = generateFullTextReport();
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Affiliate-Strategy-${result.productInfo.productName.replace(/[^a-zA-Z0-9]/g, "-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadMarkdown = () => {
    const mdText = `# Paket Konten Affiliate: ${result.productInfo.productName}
**Durasi:** ${result.productInfo.duration}  
**Deskripsi:** ${result.productInfo.productDescription}

---

## 1. Konten Pilar Strategis
${result.contentPillars
  .map((p, idx) => `### ${idx + 1}. ${p.title} (${p.percentage})\n${p.description}\n- **Contoh:** ${p.examples.join(", ")}`)
  .join("\n\n")}

---

## 2. 30 Ide Konten dengan Hook 2 Detik & Skrip Video
${result.contentIdeas
  .map(
    (i) => `### Ide #${i.id}: ${i.title}
- **Pilar:** ${i.pillar} | **Format:** ${i.format} | **Angle:** ${i.angle}
- **Hook 2 Detik (Voiceover):** "${i.quickHook}"
- **Visual Kamera (0-2s):** ${i.visualHook || "-"}
- **Ringkasan:** ${i.summary}

#### Skrip Video:
${
  i.videoScript && i.videoScript.length > 0
    ? i.videoScript
        .map((s) => `1. **Scene ${s.sceneNumber} (${s.timeFrame})**\n   - Visual: ${s.visual}\n   - Voiceover: "${s.audio}"\n   - Overlay: "${s.overlayText}"`)
        .join("\n")
    : "Sesuai ringkasan konsep di atas."
}`
  )
  .join("\n\n")}

---

## 3. Hook 2 Detik Utama
${result.hooks.map((h, idx) => `* **Variasi ${idx + 1} (${h.type}):**  \n  *Visual:* ${h.visualAction}  \n  *Voiceover:* "${h.verbalHook}"`).join("\n\n")}

---

## 4. Caption & CTA
\`\`\`text
${result.captionData.fullText}
\`\`\`
`;

    const element = document.createElement("a");
    const file = new Blob([mdText], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Affiliate-Strategy-${result.productInfo.productName.replace(/[^a-zA-Z0-9]/g, "-")}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadPdf = () => {
    downloadPdfReport(result);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyAll = () => {
    copyToClipboard(generateFullTextReport(), "all");
  };

  return (
    <div id="output-view" className="space-y-6">
      {/* Top Banner / Product Summary Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-[0_0_25px_rgba(14,165,233,0.1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToForm}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex-shrink-0 cursor-pointer"
              title="Kembali ke formulir"
            >
              <ArrowLeft className="w-5 h-5 text-sky-400" />
            </button>

            {result.productInfo.imagePreviewUrl && (
              <img
                src={result.productInfo.imagePreviewUrl}
                alt={result.productInfo.productName}
                className="w-14 h-14 rounded-xl object-cover bg-slate-950 border border-sky-500/30 flex-shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.2)]"
              />
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  ✓ 30 Ide & Skrip Siap Pakai
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                  ⏱️ Durasi Max: {result.productInfo.duration}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 tracking-tight">
                {result.productInfo.productName}
              </h2>
            </div>
          </div>

          {/* Action Bar: Copy All & Download Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleDownloadPdf}
              className="flex-1 md:flex-none py-2.5 px-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all cursor-pointer"
              title="Download Hasil Strategi dalam Format PDF"
            >
              <FileType className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="flex-1 md:flex-none py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-sky-400" />
              <span>.TXT</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex-1 md:flex-none py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-400" />
              <span>.MD</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak / Simpan melalui Printer Browser"
            >
              <Printer className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={handleCopyAll}
              className="flex-1 md:flex-none py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedSection === "all" ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Semua</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 scrollbar-none">
          <button
            onClick={() => setActiveTab("ideas")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "ideas"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>30 Ide & Skrip Video</span>
            <span className="px-2 py-0.2 text-[10px] bg-slate-900 text-sky-300 rounded-full font-bold border border-sky-500/30">
              30
            </span>
          </button>

          <button
            onClick={() => setActiveTab("pillars")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "pillars"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Konten Pilar</span>
          </button>

          <button
            onClick={() => setActiveTab("hooks")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "hooks"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Hook 2s Utama</span>
          </button>

          <button
            onClick={() => setActiveTab("script")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "script"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Skript Hero</span>
          </button>

          <button
            onClick={() => setActiveTab("caption")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "caption"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Caption & CTA</span>
          </button>

          <button
            onClick={() => setActiveTab("overlays")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "overlays"
                ? "bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
                : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Type className="w-4 h-4" />
            <span>Teks Overlay</span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <div id="tab-content" className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-2xl">
        {/* ==================== TAB: 30 IDE KONTEN & SKRIP ==================== */}
        {activeTab === "ideas" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-sky-400" />
                  30 Ide Konten DENGAN Hook 2s & Skrip Video Khusus
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Klik pada ide mana saja untuk membuka & mengunduh skrip adegan demi adegan lengkap dan instruksi visual kamera!
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadTxt}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(14,165,233,0.2)]"
                >
                  <Download className="w-4 h-4" />
                  <span>Download File (.txt)</span>
                </button>

                <button
                  onClick={() => {
                    const text = result.contentIdeas
                      .map((i) => `Ide #${i.id}: ${i.title}\nPilar: ${i.pillar} | Angle: ${i.angle}\nHook 2s: "${i.quickHook}"\nSummary: ${i.summary}`)
                      .join("\n\n");
                    copyToClipboard(text, "ideas");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSection === "ideas" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Salin Ringkasan</span>
                </button>
              </div>
            </div>

            {/* Search and Filter bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari kata kunci ide, misal 'unboxing', 'kesalahan', 'skincare'..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
              </div>

              <select
                value={selectedPillarFilter}
                onChange={(e) => setSelectedPillarFilter(e.target.value)}
                className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
              >
                <option value="all">Semua Pilar Konten</option>
                {uniquePillars.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIdeas.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400 text-xs">
                  Tidak ada ide konten yang cocok dengan pencarianmu.
                </div>
              ) : (
                filteredIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    onClick={() => setSelectedIdea(idea)}
                    className="bg-slate-950 border border-slate-800 hover:border-sky-500/50 rounded-xl p-4.5 transition-all duration-200 hover:bg-slate-850/90 cursor-pointer flex flex-col justify-between group shadow-lg hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 font-bold text-xs flex items-center justify-center flex-shrink-0">
                          #{idea.id}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          {idea.formulaUsed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {idea.formulaUsed}
                            </span>
                          )}
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 truncate max-w-[120px]">
                            {idea.pillar}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2 mb-3">
                        {idea.title}
                      </h4>

                      {/* Hook 2s Preview Box */}
                      <div className="bg-sky-500/10 p-2.5 rounded-lg border border-sky-500/20 mb-3 space-y-1">
                        <p className="text-[10px] font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1">
                          <Volume2 className="w-3 h-3 text-sky-400" /> Hook 2 Detik:
                        </p>
                        <p className="text-xs font-semibold text-white italic line-clamp-2">
                          "{idea.quickHook}"
                        </p>
                        {idea.visualHook && (
                          <p className="text-[10px] text-slate-300 line-clamp-1">
                            🎬 {idea.visualHook}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                        {idea.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-3 border-t border-slate-900">
                      <span className="font-semibold text-slate-400 flex items-center gap-1">
                        <Film className="w-3.5 h-3.5 text-sky-400" />
                        {idea.videoScript && idea.videoScript.length > 0 ? `${idea.videoScript.length} Scene Skrip` : "Skrip Video Ready"}
                      </span>
                      <span className="text-sky-400 font-bold group-hover:underline flex items-center gap-1">
                        Buka Skrip →
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB: KONTEN PILAR ==================== */}
        {activeTab === "pillars" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-sky-400" />
                  Konten Pilar Strategis ({result.contentPillars.length} Pilar Utama)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Distribusi topik postingan agar akun affiliate tetap profesional, variatif, dan disukai algoritma.
                </p>
              </div>

              <button
                onClick={() => {
                  const text = result.contentPillars
                    .map((p) => `📌 ${p.title} (${p.percentage}):\n${p.description}\nContoh: ${p.examples.join(", ")}`)
                    .join("\n\n");
                  copyToClipboard(text, "pillars");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {copiedSection === "pillars" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Salin Pilar Konten</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.contentPillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-sky-500/40 transition-all flex flex-col justify-between shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-base font-bold text-sky-300">
                        {idx + 1}. {pillar.title}
                      </h4>
                      <span className="px-2.5 py-1 bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-extrabold rounded-full">
                        {pillar.percentage}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Contoh Tema Video:</p>
                    <ul className="space-y-1.5">
                      {pillar.examples.map((ex, exIdx) => (
                        <li key={exIdx} className="text-xs text-slate-300 flex items-start gap-2">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: HOOK 2 DETIK UTAMA ==================== */}
        {activeTab === "hooks" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-sky-400" />
                  Rekomendasi Hook 2 Detik Pertama Utama
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kombinasi aksi visual cepat dan kalimat pertama untuk menahan jari penonton agar tidak menggeser video.
                </p>
              </div>

              <button
                onClick={() => {
                  const text = result.hooks
                    .map((h) => `[${h.type}]\n- Visual: ${h.visualAction}\n- Voiceover: "${h.verbalHook}"\n- Mengapa Efektif: ${h.whyItWorks}`)
                    .join("\n\n");
                  copyToClipboard(text, "hooks");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {copiedSection === "hooks" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Salin Semua Hook</span>
              </button>
            </div>

            <div className="space-y-4">
              {result.hooks.map((hook, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-sky-500/40 transition-all shadow-md"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-500/30">
                      Variasi #{idx + 1}: {hook.type}
                    </span>
                    <button
                      onClick={() => {
                        copyToClipboard(`Aksi Visual: ${hook.visualAction}\nKalimat Voiceover: "${hook.verbalHook}"`, `hook-${idx}`);
                      }}
                      className="text-xs text-slate-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Salin Hook Ini</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                    <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">🎬 Aksi Visual (Kamera Detik 0-2)</p>
                      <p className="text-xs font-medium text-slate-200 leading-relaxed">
                        {hook.visualAction}
                      </p>
                    </div>

                    <div className="bg-sky-500/10 p-3.5 rounded-lg border border-sky-500/30">
                      <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">🗣️ Voiceover / Ucapan Pertama</p>
                      <p className="text-sm font-bold text-white italic">
                        "{hook.verbalHook}"
                      </p>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 flex items-center gap-2">
                    <span className="font-bold text-sky-400">Keunggulan Psikologis:</span>
                    <span>{hook.whyItWorks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: SKRIPT HERO ==================== */}
        {activeTab === "script" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-sky-400" />
                  Skript Alur Cerita Video Hero Utama ({result.videoScript.duration})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Panduan adegan demi adegan utama (timestamp, B-roll visual, voiceover audio, & teks layar).
                </p>
              </div>

              <button
                onClick={() => {
                  const text = `SKRIPT VIDEO AFFILIATE (${result.videoScript.duration})
Konsep: ${result.videoScript.conceptSummary}

${result.videoScript.scenes
  .map(
    (s) =>
      `[Scene ${s.sceneNumber} | ${s.timeFrame}]
Visual: ${s.visual}
Voiceover: "${s.audio}"
Teks Layar: "${s.overlayText}"`
  )
  .join("\n\n")}`;
                  copyToClipboard(text, "script");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {copiedSection === "script" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Salin Seluruh Skrip</span>
              </button>
            </div>

            {/* Concept summary & Formula */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 flex-shrink-0">
                    <Video className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-white">Ringkasan Konsep Cerita Video Hero</p>
                </div>
                <div className="flex items-center gap-2">
                  {result.videoScript.formulaUsed && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Formula: {result.videoScript.formulaUsed}
                    </span>
                  )}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    Total {result.videoScript.scenes.length} Scene
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-1">
                {result.videoScript.conceptSummary}
              </p>
            </div>

            {/* Scenes Timeline */}
            <div className="space-y-4">
              {result.videoScript.scenes.map((scene) => (
                <div
                  key={scene.sceneNumber}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all shadow-md"
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-extrabold text-xs border border-sky-500/30">
                        Adegan #{scene.sceneNumber}
                      </span>
                      {scene.formulaStage && (
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                          {scene.formulaStage}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" /> {scene.timeFrame}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        copyToClipboard(
                          `Adegan ${scene.sceneNumber} (${scene.timeFrame}):\nVisual: ${scene.visual}\nAudio: "${scene.audio}"\nOverlay: "${scene.overlayText}"`,
                          `scene-${scene.sceneNumber}`
                        );
                      }}
                      className="text-[11px] text-slate-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedSection === `scene-${scene.sceneNumber}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>Salin Adegan</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Visual */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">📹 Visual / Aksi Kamera</p>
                      <p className="text-xs text-slate-200 leading-relaxed">{scene.visual}</p>
                    </div>

                    {/* Audio / Voiceover */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wider mb-1">🎙️ Voiceover / Ucapan</p>
                      <p className="text-xs font-semibold text-white leading-relaxed italic">
                        "{scene.audio}"
                      </p>
                    </div>

                    {/* Overlay Text */}
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                      <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1">💬 Teks On-Screen</p>
                      <p className="text-xs font-bold text-emerald-300 leading-relaxed bg-emerald-500/10 p-2 rounded border border-emerald-500/20">
                        {scene.overlayText}
                      </p>
                    </div>
                  </div>

                  {scene.tips && (
                    <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-900 italic">
                      💡 Note: {scene.tips}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: CAPTION & CTA ==================== */}
        {activeTab === "caption" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-400" />
                  Caption, Call To Action (CTA) & Hashtag Affiliate
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Teks caption siap copas lengkap dengan dorongan klik keranjang kuning dan hashtag terpopuler.
                </p>
              </div>

              <button
                onClick={() => copyToClipboard(result.captionData.fullText, "caption-full")}
                className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 w-fit shadow-[0_0_15px_rgba(14,165,233,0.3)] cursor-pointer"
              >
                {copiedSection === "caption-full" ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    <span>Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Caption Lengkap</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Main Full Caption Box */}
              <div className="md:col-span-2 bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                    Teks Caption Siap Salin
                  </span>
                  <span className="text-[11px] text-slate-400">Siap Tempel di TikTok / IG Reels</span>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-line select-all">
                  {result.captionData.fullText}
                </div>
              </div>

              {/* Individual Breakdown Sidebar */}
              <div className="space-y-4">
                {/* CTA Box */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md">
                  <p className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Call To Action (CTA)
                  </p>
                  <p className="text-xs font-semibold text-white bg-sky-500/10 p-3 rounded-lg border border-sky-500/20">
                    "{result.captionData.cta}"
                  </p>
                </div>

                {/* Hashtag List */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md">
                  <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Hashtag Affiliate Terpopuler ({result.captionData.hashtags.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.captionData.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-slate-800 text-sky-300 border border-slate-700"
                      >
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: TEKS OVERLAY ==================== */}
        {activeTab === "overlays" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Type className="w-5 h-5 text-sky-400" />
                  Rekomendasi 3-5 Teks Overlay Layar Video
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Teks besar dan mencolok di layar untuk meningkatkan retention rate penonton yang mematikan suara HP.
                </p>
              </div>

              <button
                onClick={() => {
                  const text = result.textOverlays
                    .map((t) => `Scene ${t.sceneNumber} (${t.timeFrame}): "${t.text}" - ${t.styleTip}`)
                    .join("\n");
                  copyToClipboard(text, "overlays");
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 w-fit cursor-pointer"
              >
                {copiedSection === "overlays" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>Salin Teks Overlay</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {result.textOverlays.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-sky-500/40 transition-all shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold text-xs border border-sky-500/30">
                        Overlay #{idx + 1} (Scene {item.sceneNumber})
                      </span>
                      <span className="text-xs text-slate-400 font-medium">⏱️ {item.timeFrame}</span>
                    </div>

                    {/* Phone Screen Mockup Preview */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 my-3 text-center min-h-[100px] flex items-center justify-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                      <p className="text-sm font-extrabold text-sky-300 uppercase tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] z-10 px-3 bg-slate-950/80 py-1.5 rounded border border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                        "{item.text}"
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 mt-2">
                      <strong className="text-slate-400">Tips Tampilan:</strong> {item.styleTip}
                    </p>
                  </div>

                  <button
                    onClick={() => copyToClipboard(item.text, `overlay-${idx}`)}
                    className="mt-4 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    {copiedSection === `overlay-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Salin Teks Ini</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      {selectedIdea && (
        <IdeaDetailModal
          idea={selectedIdea}
          onClose={() => setSelectedIdea(null)}
          result={result}
        />
      )}
    </div>
  );
};
