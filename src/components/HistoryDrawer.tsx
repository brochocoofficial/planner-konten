import React from "react";
import { X, Trash2, Calendar, ShoppingBag, ChevronRight, Sparkles } from "lucide-react";
import { GeneratedContentResult } from "../types";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GeneratedContentResult[];
  onSelectResult: (result: GeneratedContentResult) => void;
  onClearHistory: () => void;
  onDeleteResult: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectResult,
  onClearHistory,
  onDeleteResult
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Riwayat Konten</h3>
                <p className="text-xs text-slate-400">{history.length} produk tersimpan</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {history.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-sm font-semibold text-slate-300">Belum ada riwayat konten</p>
                <p className="text-xs text-slate-500 mt-1">
                  Konten produk yang kamu generate akan otomatis tersimpan di sini.
                </p>
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-500/50 p-3.5 rounded-xl transition-all cursor-pointer"
                  onClick={() => {
                    onSelectResult(item);
                    onClose();
                  }}
                >
                  <div className="flex items-start gap-3">
                    {item.productInfo.imagePreviewUrl ? (
                      <img
                        src={item.productInfo.imagePreviewUrl}
                        alt={item.productInfo.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-100 truncate group-hover:text-amber-400 transition-colors">
                        {item.productInfo.productName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {item.productInfo.productDescription}
                      </p>

                      <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {new Date(item.timestamp).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                        <span>•</span>
                        <span className="text-amber-300/90 font-medium">
                          {item.productInfo.duration}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteResult(item.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                      title="Hapus dari riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {history.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-950">
              <button
                onClick={onClearHistory}
                className="w-full py-2 px-3 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Semua Riwayat</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
