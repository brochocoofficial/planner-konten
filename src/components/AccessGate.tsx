import React, { useState, useEffect } from "react";
import { Lock, Key, ShieldAlert, Check, Copy, ArrowRight, LogOut, Crown, UserCheck } from "lucide-react";

interface AccessGateProps {
  children: React.ReactNode;
}

type UserRole = "owner" | "user" | null;

export const AccessGate: React.FC<AccessGateProps> = ({ children }) => {
  // Passcode keys set via Environment Variables or fallback defaults
  const ownerKey = import.meta.env.VITE_OWNER_KEY || "OWNER2026";
  const userKey = import.meta.env.VITE_USER_KEY || import.meta.env.VITE_ACCESS_KEY || "AFFILIATE2026";

  const [role, setRole] = useState<UserRole>(null);
  const [inputKey, setInputKey] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Check URL query params for ?access_key=... or ?key=...
    const urlParams = new URLSearchParams(window.location.search);
    const queryKey = urlParams.get("access_key") || urlParams.get("key");

    if (queryKey) {
      if (queryKey === ownerKey) {
        localStorage.setItem("affiliate_access_token", ownerKey);
        localStorage.setItem("affiliate_user_role", "owner");
        setRole("owner");
        cleanUrl();
        setIsChecking(false);
        return;
      } else if (queryKey === userKey) {
        localStorage.setItem("affiliate_access_token", userKey);
        localStorage.setItem("affiliate_user_role", "user");
        setRole("user");
        cleanUrl();
        setIsChecking(false);
        return;
      }
    }

    // 2. Check localStorage
    const savedToken = localStorage.getItem("affiliate_access_token");
    if (savedToken === ownerKey) {
      setRole("owner");
    } else if (savedToken === userKey) {
      setRole("user");
    } else {
      setRole(null);
    }

    setIsChecking(false);
  }, [ownerKey, userKey]);

  const cleanUrl = () => {
    const cleanPath = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, cleanPath);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputKey.trim();

    if (trimmed === ownerKey) {
      localStorage.setItem("affiliate_access_token", ownerKey);
      localStorage.setItem("affiliate_user_role", "owner");
      setRole("owner");
      setErrorMsg(null);
    } else if (trimmed === userKey) {
      localStorage.setItem("affiliate_access_token", userKey);
      localStorage.setItem("affiliate_user_role", "user");
      setRole("user");
      setErrorMsg(null);
    } else {
      setErrorMsg("Kode PIN salah. Silakan minta PIN / link resmi dari Owner.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("affiliate_access_token");
    localStorage.removeItem("affiliate_user_role");
    setRole(null);
    setInputKey("");
  };

  const handleCopyUserShareLink = () => {
    // Generates share link containing ONLY the User Key so shared users can't see/use owner privileges
    const shareableUrl = `${window.location.origin}${window.location.pathname}?access_key=${userKey}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Loading state during initial token check
  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="animate-pulse flex items-center gap-2">
          <Lock className="w-5 h-5 text-sky-400 animate-spin" />
          <span>Memeriksa Izin Akses...</span>
        </div>
      </div>
    );
  }

  // Authorized view: Render main application + Top Private Header Bar
  if (role === "owner" || role === "user") {
    return (
      <div className="relative">
        {/* Top Private Access Bar */}
        <div className="bg-slate-900 border-b border-slate-800/80 text-xs py-1.5 px-4 text-slate-400 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {role === "owner" ? (
              <span className="text-amber-300 font-semibold flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Owner Mode</span>
              </span>
            ) : (
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Private App Active</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* ONLY Owner can see and copy the user share link */}
            {role === "owner" && (
              <button
                onClick={handleCopyUserShareLink}
                className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border border-sky-500/30 flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                title="Salin Link Akses Khusus User untuk Dibagikan ke Klien/Tim"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Link User Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Link Akses User</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 text-xs cursor-pointer"
              title="Keluar / Kunci Kembali"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {children}
      </div>
    );
  }

  // Not authorized: Render Login Screen
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
            Hanya pengguna yang memiliki PIN resmi atau link khusus dari Owner yang dapat mengakses tool ini.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-sky-400" />
              <span>Masukkan Kode PIN Akses:</span>
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="Masukkan PIN..."
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
            Belum punya akses? Minta link atau PIN akses langsung kepada pemilik aplikasi.
          </p>
        </div>
      </div>
    </div>
  );
};
