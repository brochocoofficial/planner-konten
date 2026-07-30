import React from "react";
import { Sparkles, History, ShoppingBag, Zap } from "lucide-react";

interface HeaderProps {
  onOpenHistory: () => void;
  historyCount: number;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  historyCount,
  onReset
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={onReset}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(14,165,233,0.3)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                AffiliateCreator <span className="bg-sky-500/20 text-sky-400 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-sky-500/30 shadow-[0_0_10px_rgba(14,165,233,0.2)]">PRO AI</span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              30 Ide Konten, Hook 2s, Skrip Video Adegan & Caption Affiliate
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            id="btn-open-history"
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            title="Riwayat Generasi Konten"
          >
            <History className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Riwayat</span>
            {historyCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-sky-500 text-slate-950 rounded-full text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>

          <button
            id="btn-new-content"
            onClick={onReset}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.3)] transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Buat Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
