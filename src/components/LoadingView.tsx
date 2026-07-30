import React, { useState, useEffect } from "react";
import { Sparkles, Bot, CheckCircle2, Film, FileText, Lightbulb, MessageSquare } from "lucide-react";

export const LoadingView: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: "Menganalisis Foto & Fitur Produk", desc: "Mendeteksi elemen visual, kemasan, & unique selling point produk...", icon: Bot },
    { title: "Merumuskan Konten Pilar Strategis", desc: "Membuat 3-4 pilar edukasi, soft sell, dan review produk...", icon: FileText },
    { title: "Menyusun 30 Ide Konten Affiliate", desc: "Merancang 30 ide kreatif dari angle komparasi, POV, & problem-solving...", icon: Lightbulb },
    { title: "Membuat Hook 2 Detik & Skrip Video", desc: "Menulis instruksi visual B-roll, voiceover, dan timestamps...", icon: Film },
    { title: "Menyiapkan Caption, CTA & Teks Overlay", desc: "Meracik caption persuasif, hashtag trending, dan teks on-screen...", icon: MessageSquare }
  ];

  const affiliateTips = [
    "💡 Tip: Hook 2 detik pertama menyumbang lebih dari 70% keberhasilan watch-time video TikTok & Reels!",
    "💡 Tip: Gunakan teks overlay warna kontras (kuning/putih) agar penonton tanpa suara tetap bertahan.",
    "💡 Tip: Sisipkan Call To Action tegas untuk mengarahkan penonton ke Keranjang Kuning atau Bio Link.",
    "💡 Tip: Variasikan pilar kontenmu, jangan 100% hard sell agar akun tidak sepi atau kena pembatasan jangkauan."
  ];

  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 2800);

    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % affiliateTips.length);
    }, 4000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div id="loading-view" className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center max-w-2xl mx-auto my-8 shadow-2xl">
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 animate-spin opacity-40 blur-md"></div>
        <div className="relative w-full h-full rounded-2xl bg-slate-950 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
          <Sparkles className="w-10 h-10 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
        AI Sedang Menghasilkan Konten Affiliate...
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-md mx-auto">
        Harap tunggu sebentar, Gemini AI sedang menganalisis gambar dan detail produkmu untuk membuat paket konten lengkap.
      </p>

      {/* Progress Steps */}
      <div className="space-y-3 text-left max-w-md mx-auto mb-8 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        {steps.map((step, idx) => {
          const IconComponent = step.icon;
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;

          return (
            <div
              key={step.title}
              className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                isCurrent
                  ? "bg-amber-500/10 border border-amber-500/30 text-amber-300"
                  : isDone
                  ? "text-slate-400 opacity-80"
                  : "text-slate-600"
              }`}
            >
              <div className="mt-0.5">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <IconComponent className={`w-4 h-4 ${isCurrent ? "text-amber-400 animate-bounce" : ""}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold">{step.title}</p>
                <p className="text-[11px] text-slate-500 truncate">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotating Affiliate Tip */}
      <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl text-xs text-amber-300 font-medium inline-block max-w-lg">
        {affiliateTips[tipIndex]}
      </div>
    </div>
  );
};
