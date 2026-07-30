import React, { useState, useEffect } from "react";
import { Lock, Key, ShieldAlert, Check, Copy, ArrowRight, Sparkles, LogOut } from "lucide-react";

interface AccessGateProps {
  children: React.ReactNode;
}

export const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
  // Master key set via env variable VITE_ACCESS_KEY or fallback default
  const masterKey = import.meta.env.VITE_ACCESS_KEY || "AFFILIATE2026";

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [inputKey, setInputKey] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    // 1. Check URL query params for ?access_key=... or ?key=...
    const urlParams = new URLSearchParams(window.location.search);
    const queryKey = urlParams.get("access_key") || urlParams.get("key");

    if (queryKey) {
      if (queryKey === masterKey) {
        localStorage.setItem("affiliate_access_token", queryKey);
        setIsAuthorized(true);
        // Clean URL query param for aesthetics
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        return;
      }
    }

    // 2. Check localStorage
    const savedToken = localStorage.getItem("affiliate_access_token");
    if (savedToken === masterKey) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [masterKey]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim() === masterKey) {
      localStorage.setItem("affiliate_access_token", masterKey);
      setIsAuthorized(true);
      setErrorMsg(null);
    } else {
      setErrorMsg("Kode akses salah. Silakan minta kode / link resmi dari Owner.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("affiliate_access_token");
    setIsAuthorized(false);
  };

  const handleCopyOwnerLink = () => {
    const shareableUrl = `${window.location.origin}${window.location.pathname}?access_key=${masterKey}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex items-center gap-2">
          <Lock className="w-5 h-5 text-sky-400 animate-spin" />
          <span>Memeriksa Izin Akses...</span>
        </div>
      </div>
    );
  }

  // Authorized: render main app + optional owner bar header
  if (isAuthorized) {
    return (
      <div className="relative">
        {/* Top Private Access Bar */}
        <div className="bg-slate-900 border-b border-slate-800/80 text-xs py-1.5 px-4 text-slate-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-medium">Status: Private App Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyOwnerLink}
              className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Salin Link Akses Otomatis untuk Dibagikan ke Klien/User"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Link Akses Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin Private Share Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Keluar / Kunci Kembali"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {children}
      </div>
    );
  }

  // Not authorized: render Access Gate Screen
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-2 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Aplikasi Terbatas (Private)</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hanya pengguna yang memiliki kode PIN resmi atau link khusus dari Owner yang dapat mengakses tool ini.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-sky-400" />
              <span>Masukkan Kode Akses PIN:</span>
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Ketik Kode PIN..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all placeholder-slate-600 tracking-widest text-center font-mono"
              autoFocus
            />
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(14,165,233,0.3)] cursor-pointer"
          >
            <span>Buka Akses Aplikasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Belum punya akses? Minta link akses private langsung kepada pemilik website.
          </p>
        </div>
      </div>
    </div>
  );
};
