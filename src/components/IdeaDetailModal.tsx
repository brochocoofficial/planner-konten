import React, { useState } from "react";
import { X, Copy, Check, Sparkles, Download, Video, Film, Clock, Eye, Volume2, Type } from "lucide-react";
import { ContentIdea, GeneratedContentResult } from "../types";

interface IdeaDetailModalProps {
  idea: ContentIdea | null;
  onClose: () => void;
  result: GeneratedContentResult;
}

export const IdeaDetailModal: React.FC<IdeaDetailModalProps> = ({ idea, onClose, result }) => {
  const [copied, setCopied] = useState(false);

  if (!idea) return null;

  const getFullScriptText = () => {
    let scriptContent = "";
    if (idea.videoScript && idea.videoScript.length > 0) {
      scriptContent = idea.videoScript
        .map(
          (s) =>
            `[Scene ${s.sceneNumber} | ${s.timeFrame}]\n• Visual/Kamera: ${s.visual}\n• Voiceover: "${s.audio}"\n• Teks Layar: "${s.overlayText}"`
        )
        .join("\n\n");
    } else {
      scriptContent = `Konsep Video:\n${idea.summary}`;
    }

    return `=== IDE KONTEN #${idea.id}: ${idea.title} ===
PRODUK: ${result.productInfo.productName}
DURASI: ${result.productInfo.duration}
PILAR: ${idea.pillar}
FORMAT: ${idea.format} | ANGLE: ${idea.angle}

--- HOOK 2 DETIK PERTAMA ---
🗣️ Voiceover: "${idea.quickHook}"
🎬 Visual Kamera: ${idea.visualHook || "Aksi cepat memperlihatkan produk"}

--- RINGKASAN KONSEP ---
${idea.summary}

--- SKRIP VIDEO ADEGAN DEMI ADEGAN ---
${scriptContent}
`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullScriptText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const element = document.createElement("a");
    const file = new Blob([getFullScriptText()], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = `Skrip-Ide-${idea.id}-${result.productInfo.productName.replace(/[^a-zA-Z0-9]/g, "-")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-[0_0_30px_rgba(14,165,233,0.15)] relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header tags */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center gap-1 shadow-[0_0_15px_rgba(14,165,233,0.2)]">
            <Sparkles className="w-3.5 h-3.5" /> Ide Konten #{idea.id} dari 30
          </span>
          {idea.formulaUsed && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Formula: {idea.formulaUsed}
            </span>
          )}
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {idea.pillar}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800/80 text-sky-300 border border-slate-700">
            ⏱️ {result.productInfo.duration}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white mb-4 pr-8">
          {idea.title}
        </h3>

        <div className="space-y-4 mb-6">
          {/* Format & Angle */}
          <div className="grid grid-cols-2 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Format Konten</p>
              <p className="text-xs font-medium text-slate-200 mt-0.5">{idea.format}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Angle Pendekatan</p>
              <p className="text-xs font-semibold text-sky-400 mt-0.5">{idea.angle}</p>
            </div>
          </div>

          {/* 2-Second Hook Box */}
          <div className="bg-sky-500/10 border border-sky-500/30 p-4 rounded-xl shadow-[0_0_20px_rgba(14,165,233,0.1)]">
            <p className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-sky-400" /> Hook 2 Detik Pertama (Scroll-Stopper)
            </p>
            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/80 p-3 rounded-lg border border-sky-500/20">
                <span className="text-[10px] font-bold text-sky-400 uppercase block mb-1 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5" /> 🗣️ Voiceover / Ucapan Pertama:
                </span>
                <p className="text-sm font-bold text-white italic">
                  "{idea.quickHook}"
                </p>
              </div>

              {idea.visualHook && (
                <div className="bg-slate-950/80 p-3 rounded-lg border border-sky-500/20">
                  <span className="text-[10px] font-bold text-sky-400 uppercase block mb-1 flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> 🎬 Visual & Aksi Kamera (Detik 0-2):
                  </span>
                  <p className="text-xs font-medium text-slate-200">
                    {idea.visualHook}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Concept Summary */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-300 mb-1">
              💡 Ringkasan Alur Konsep:
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              {idea.summary}
            </p>
          </div>

          {/* Scene Breakdown / Video Script for this Idea */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <p className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <Film className="w-4 h-4 text-sky-400" /> Skrip Video Adegan Demi Adegan
              </p>
              {idea.videoScript && idea.videoScript.length > 0 && (
                <span className="text-[11px] font-semibold text-sky-300 bg-sky-500/10 px-2.5 py-0.5 rounded-full border border-sky-500/20">
                  Total {idea.videoScript.length} Scene
                </span>
              )}
            </div>

            {idea.videoScript && idea.videoScript.length > 0 ? (
              <div className="space-y-3">
                {idea.videoScript.map((scene) => (
                  <div key={scene.sceneNumber} className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-extrabold text-[11px] border border-sky-500/30">
                          Scene {scene.sceneNumber}
                        </span>
                        {scene.formulaStage && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px] border border-amber-500/30">
                            {scene.formulaStage}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-sky-400" /> {scene.timeFrame}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Visual</span>
                        <p className="text-slate-300 text-[11px]">{scene.visual}</p>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-sky-400 font-bold uppercase block mb-0.5">Voiceover</span>
                        <p className="text-white text-[11px] font-medium italic">"{scene.audio}"</p>
                      </div>
                      <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block mb-0.5">Teks Layar</span>
                        <p className="text-emerald-300 text-[11px] font-semibold">{scene.overlayText}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Skrip video otomatis disesuaikan dengan konsep ringkasan di atas.
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCopy}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Skrip Tersalin!" : "Salin Skrip & Hook Ini"}</span>
          </button>

          <button
            onClick={handleDownloadScript}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-sky-400" />
            <span>Download TXT</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
