import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { ProductForm } from "./components/ProductForm";
import { LoadingView } from "./components/LoadingView";
import { OutputView } from "./components/OutputView";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AccessGate } from "./components/AccessGate";
import { GenerationRequestInput, GeneratedContentResult } from "./types";
import { AlertTriangle, Sparkles, ShoppingBag, ShieldCheck, HelpCircle } from "lucide-react";

export default function App() {
  const [history, setHistory] = useState<GeneratedContentResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedContentResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("affiliate_gen_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history from localStorage:", e);
    }
  }, []);

  // Save history to localStorage
  const saveToHistory = (newResult: GeneratedContentResult) => {
    setHistory((prev) => {
      const updated = [newResult, ...prev.filter((item) => item.id !== newResult.id)];
      try {
        localStorage.setItem("affiliate_gen_history", JSON.stringify(updated.slice(0, 20)));
      } catch (e) {
        console.error("Failed to save history:", e);
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem("affiliate_gen_history");
    } catch (e) {
      console.error("Failed to clear history:", e);
    }
  };

  const handleDeleteHistoryResult = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("affiliate_gen_history", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to delete history item:", e);
      }
      return updated;
    });

    if (currentResult?.id === id) {
      setCurrentResult(null);
    }
  };

  const handleGenerateContent = async (input: GenerationRequestInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(input)
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || "Terjadi kesalahan saat memproses data.");
      }

      const generatedData = resData.data;

      const newResult: GeneratedContentResult = {
        id: `result-${Date.now()}`,
        timestamp: Date.now(),
        productInfo: {
          productName: input.productName,
          productDescription: input.productDescription,
          targetAudience: input.targetAudience,
          tone: input.tone,
          duration: input.duration,
          imagePreviewUrl: input.imageBase64
        },
        contentPillars: generatedData.contentPillars,
        contentIdeas: generatedData.contentIdeas,
        hooks: generatedData.hooks,
        videoScript: generatedData.videoScript,
        captionData: generatedData.captionData,
        textOverlays: generatedData.textOverlays
      };

      setCurrentResult(newResult);
      saveToHistory(newResult);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error: any) {
      console.error("Generation error:", error);
      setErrorMessage(
        error.message || "Gagal menghasilkan konten affiliate. Pastikan koneksi internet stabil dan coba lagi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AccessGate>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
        {/* Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        onReset={() => {
          setCurrentResult(null);
          setErrorMessage(null);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold">Terjadi Kendala saat Generasi AI</h4>
              <p className="text-xs text-rose-200 mt-1">{errorMessage}</p>
              <button
                onClick={() => setErrorMessage(null)}
                className="mt-2 text-xs font-semibold text-rose-400 hover:underline"
              >
                Tutup Peringatan
              </button>
            </div>
          </div>
        )}

        {isLoading ? (
          <LoadingView />
        ) : currentResult ? (
          <OutputView
            result={currentResult}
            onBackToForm={() => setCurrentResult(null)}
          />
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <ProductForm
              onSubmit={handleGenerateContent}
              isLoading={isLoading}
            />

            {/* How it works info cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800/60">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">1. Menganalisis Produk</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Unggah foto & isi deskripsi produk. AI secara cerdas mengekstrak keunggulan dan kemasan produk.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">2. Generasi Paket Konten</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    AI menghasilkan Konten Pilar, 30 Ide Konten, Hook 2 Detik, Skrip Video, Caption & Teks Overlay.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white mb-1">3. Langsung Eksekusi & Cuan</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Tinggal salin skrip & caption untuk langsung diposting di TikTok, Instagram Reels, atau YouTube Shorts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectResult={(item) => {
          setCurrentResult(item);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onClearHistory={handleClearHistory}
        onDeleteResult={handleDeleteHistoryResult}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 mt-12">
        <p>© 2026 Affiliate Content Generator AI • Pembantu Sukses Creator Affiliate Indonesia</p>
      </footer>
    </div>
  </AccessGate>
  );
}
