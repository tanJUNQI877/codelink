"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  LANGUAGES,
  t,
  type LangCode,
} from "@/lib/i18n/translations";

type PlanTier = "free" | "hacker" | "pro";

interface Profile {
  plan: PlanTier;
  credits_remaining: number;
  lifespan_max_minutes?: number;
  max_pages?: number;
  max_storage_mb?: number;
}

function GithubLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function generatePassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const all = upper + lower + digits + special;
  let pw = "";
  pw += upper[Math.floor(Math.random() * upper.length)];
  pw += lower[Math.floor(Math.random() * lower.length)];
  pw += digits[Math.floor(Math.random() * digits.length)];
  pw += special[Math.floor(Math.random() * special.length)];
  for (let i = 0; i < 12; i++) {
    pw += all[Math.floor(Math.random() * all.length)];
  }
  return pw.split("").sort(() => Math.random() - 0.5).join("");
}

function passwordStrength(pw: string): "none" | "weak" | "strong" {
  if (!pw) return "none";
  if (pw.length < 8) return "weak";
  const hasUpper = /[A-Z]/.test(pw);
  const hasLower = /[a-z]/.test(pw);
  const hasDigit = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const types = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
  return types >= 3 ? "strong" : "weak";
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function LoginModal({
  open,
  onClose,
  lang,
}: {
  open: boolean;
  onClose: () => void;
  lang: LangCode;
}) {
  const [supabase] = useState(createClient);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setMode("login");
    setEmail("");
    setPassword("");
    setName("");
    setConfirmPassword("");
    setShowPassword(false);
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleOAuth = useCallback(
    async (provider: "github" | "google") => {
      const client = supabase ?? createClient();
      if (!client) return;
      setError("");
      await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback` },
      });
    },
    [supabase]
  );

  const handleGeneratePassword = () => {
    const pw = generatePassword();
    setPassword(pw);
    setConfirmPassword(pw);
    setShowPassword(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isValidEmail(email)) {
      setError(t("error.invalidEmail", lang));
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError(t("error.nameRequired", lang));
        return;
      }
      if (password.length < 6) {
        setError(t("error.passwordTooShort", lang));
        return;
      }
      if (password !== confirmPassword) {
        setError(t("error.passwordsDoNotMatch", lang));
        return;
      }
    } else {
      if (password.length < 6) {
        setError(t("error.passwordTooShort", lang));
        return;
      }
    }

    const client = supabase ?? createClient();
    if (!client) return;

    setLoading(true);

    if (mode === "register") {
      const { data, error: authError } = await client.auth.signUp({
        email,
        password,
        options: { data: { user_name: name.trim(), display_name: name.trim() } },
      });
      if (authError) {
        if (authError.message?.includes("already")) {
          setError(t("error.emailInUse", lang));
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }
      if (data.user) {
        const { error: insertError } = await client.from("profiles").insert({
          id: data.user.id,
          plan: "free",
          credits_remaining: 15,
        });
        if (insertError) console.error("[register] profile insert:", insertError);
      }
      onClose();
    } else {
      const { error: authError } = await client.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError(t("error.authFailed", lang));
        setLoading(false);
        return;
      }
      onClose();
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 backdrop-blur-md">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-zinc-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-100">{mode === "login" ? t("modal.loginAction", lang) : t("modal.registerAction", lang)}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t("modal.subtitle", lang)}</p>
        </div>

        {error && (
          <div className="w-full rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400">&gt; {error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-4">
          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500">{t("modal.name", lang)}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500">{t("modal.email", lang)}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-zinc-500">{t("modal.password", lang)}</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 pr-24 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
                {mode === "register" && (
                  <button type="button" onClick={handleGeneratePassword} className="rounded px-1.5 py-1 text-[11px] text-zinc-500 transition-colors hover:text-emerald-400" title={t("modal.generatePassword", lang)}>
                    {t("modal.generatePassword", lang)}
                  </button>
                )}
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="rounded px-1.5 py-1 text-[11px] text-zinc-500 transition-colors hover:text-zinc-300">
                  {showPassword ? t("modal.hidePassword", lang) : t("modal.showPassword", lang)}
                </button>
              </div>
            </div>
            {mode === "register" && password && (
              <div className="flex items-center gap-2 mt-1">
                <div className={`h-1 flex-1 rounded-full ${passwordStrength(password) === "strong" ? "bg-emerald-500" : "bg-red-500"}`} />
                <span className={`text-[10px] ${passwordStrength(password) === "strong" ? "text-emerald-400" : "text-red-400"}`}>
                  {passwordStrength(password) === "strong" ? t("modal.strong", lang) : t("modal.weak", lang)}
                </span>
              </div>
            )}
          </div>

          {mode === "register" && (
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-500">{t("modal.confirmPassword", lang)}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_16px_#10b98140] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-3 w-3 animate-ping rounded-full bg-emerald-400" />
                {mode === "login" ? t("modal.loginAction", lang) : t("modal.registerAction", lang)}
              </span>
            ) : (
              mode === "login" ? t("modal.loginAction", lang) : t("modal.registerAction", lang)
            )}
          </button>
        </form>

        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-zinc-950/90 px-2 text-zinc-600">or</span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          <button onClick={() => handleOAuth("github")} className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500/50 hover:bg-zinc-800 hover:text-emerald-300 hover:shadow-[0_0_16px_#10b98120] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
            <GithubLogo />
            {t("modal.github", lang)}
          </button>
          <button onClick={() => handleOAuth("google")} className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition-all duration-200 hover:scale-[1.02] hover:border-emerald-500/50 hover:bg-zinc-800 hover:text-emerald-300 hover:shadow-[0_0_16px_#10b98120] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50">
            <GoogleLogo />
            {t("modal.google", lang)}
          </button>
        </div>

        <button
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}
          className="text-xs text-zinc-500 transition-colors hover:text-emerald-400"
        >
          {mode === "login" ? t("modal.switchToRegister", lang) : t("modal.switchToLogin", lang)}
        </button>
      </div>
    </div>
  );
}

function Navbar({
  user,
  profile,
  onLoginClick,
  onChooseServer,
  onExport,
  onSignOut,
  lang,
  onLangChange,
}: {
  user: User | null;
  profile: Profile | null;
  onLoginClick: () => void;
  onChooseServer: () => void;
  onExport: () => void;
  onSignOut: () => void;
  lang: LangCode;
  onLangChange: (l: LangCode) => void;
}) {
  const displayName = user?.user_metadata?.user_name
    ? `@${user.user_metadata.user_name}`
    : user?.email?.split("@")[0] ?? "hacker";
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/70 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="CodeLink" width={28} height={28} className="rounded" />
        <span className="text-lg font-semibold tracking-wider text-zinc-100">{t("nav.brand", lang)}</span>
      </div>

      <button onClick={user ? onChooseServer : onLoginClick} className="rounded-lg border border-emerald-500/50 px-5 py-1.5 text-sm text-emerald-400 transition-all hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_0_12px_#10b98140]">
        Free Server
      </button>

      <div className="flex items-center gap-4">
        <button onClick={onExport} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200">
          Export
        </button>

        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            {LANGUAGES.find((l) => l.code === lang)?.label ?? "English"}
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-lg border border-zinc-800 bg-zinc-950 py-1 shadow-xl">
                {LANGUAGES.map((l) => (
                  <button key={l.code} onClick={() => { onLangChange(l.code); setOpen(false); }} className={`w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-zinc-800 ${lang === l.code ? "text-emerald-400" : "text-zinc-400"}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {user ? (
          <>
            <span className="text-sm text-emerald-400 hidden md:inline">{displayName}</span>
            <button onClick={onSignOut} className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300">
              <LogOutIcon />
            </button>
          </>
        ) : (
          <button onClick={onLoginClick} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">{t("nav.login", lang)}</button>
        )}
      </div>
    </nav>
  );
}

function UpgradeModal({
  open,
  onClose,
  onChooseServer,
}: {
  open: boolean;
  onClose: () => void;
  onChooseServer: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 backdrop-blur-md text-center">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-zinc-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <div className="text-3xl mb-4">🔒</div>
        <h2 className="text-lg font-semibold text-zinc-100 mb-2">Upgrade to Export</h2>
        <p className="text-sm text-zinc-500 mb-6">Exporting source code requires a Hacker or Pro plan.</p>
        <button onClick={() => { onClose(); onChooseServer(); }} className="w-full rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20">
          View Plans
        </button>
      </div>
    </div>
  );
}

function ServerPlanModal({
  open,
  onClose,
  user,
  lang,
  onActivated,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
  lang: LangCode;
  onActivated: () => void;
}) {
  const [supabase] = useState(createClient);
  const [error, setError] = useState("");
  const [activating, setActivating] = useState(false);
  const [freeLifespan, setFreeLifespan] = useState(1);
  const [hackerDays, setHackerDays] = useState(1);
  const [proMonths, setProMonths] = useState(1);

  useEffect(() => {
    if (!open) return;
    setFreeLifespan(1);
    setHackerDays(1);
    setProMonths(1);
    setError("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const hackerPrice = (1 + (hackerDays - 1) * (7 / 29)).toFixed(0);
  const proPrice = (7 + (proMonths - 1) * (13 / 11)).toFixed(0);

  const handleActivate = async (tier: PlanTier, lifespanMax: number) => {
    setActivating(true);
    setError("");
    const client = supabase ?? createClient();
    if (!client || !user) { setError("Not logged in"); setActivating(false); return; }

    const maxPages = tier === "free" ? 10 : tier === "hacker" ? 18 : 28;
    const storageMB = tier === "free" ? 300 : tier === "hacker" ? 800 : 1024;

    const { error: insertError } = await client.from("profiles").upsert({
      id: user.id,
      plan: tier,
      credits_remaining: 999,
      lifespan_max_minutes: lifespanMax,
      max_pages: maxPages,
      max_storage_mb: storageMB,
    });

    if (insertError) {
      console.error("[ServerPlanModal] insert error:", insertError);
      setError(insertError.message);
      setActivating(false);
      return;
    }

    setActivating(false);
    onActivated();
  };

  if (!open) return null;

  const planCard = (tier: "free" | "hacker" | "pro") => {
    const isFree = tier === "free";
    const isHacker = tier === "hacker";
    const isPro = tier === "pro";

    const label = isFree ? "Free" : isHacker ? "Hacker" : "Pro";
    const storage = isFree ? "300 MB" : isHacker ? "800 MB" : "1 GB";
    const pages = isFree ? "10" : isHacker ? "18" : "28";
    const emoji = isFree ? "🪐" : isHacker ? "🐹" : "🚀";
    const accentColor = isFree
      ? "border-zinc-700 hover:border-zinc-500"
      : isHacker
        ? "border-emerald-500/40 shadow-[0_0_16px_#10b98120]"
        : "border-zinc-600 bg-gradient-to-b from-zinc-800/50 to-zinc-900/50";

    return (
      <div className={`relative flex flex-col rounded-2xl border p-6 transition-all ${accentColor}`}>
        <div className="mb-4 text-2xl">{emoji}</div>
        <h3 className="text-lg font-semibold text-zinc-100">{label}</h3>

        <div className="my-4 space-y-1 text-xs text-zinc-500">
          <p>Storage: <span className="text-zinc-300">{storage}</span></p>
          <p>Max pages: <span className="text-zinc-300">{pages}</span></p>
        </div>

        {isFree && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Lifespan</span>
              <span className="text-emerald-400 text-sm tabular-nums">
                {freeLifespan}h
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={24}
              value={freeLifespan}
              onChange={(e) => setFreeLifespan(Number(e.target.value))}
              className="w-full cursor-pointer appearance-none rounded-full bg-zinc-800 outline-none
                [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800
                [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_#10b98160]"
            />
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>1h</span>
              <span>24h</span>
            </div>
          </div>
        )}

        {isHacker && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Lifespan</span>
              <span className="text-emerald-400 text-sm tabular-nums">{hackerDays}d</span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={hackerDays}
              onChange={(e) => setHackerDays(Number(e.target.value))}
              className="w-full cursor-pointer appearance-none rounded-full bg-zinc-800 outline-none
                [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800
                [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_#10b98160]"
            />
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>1d</span>
              <span>30d</span>
            </div>
            <p className="text-center text-sm text-emerald-400">${hackerPrice}</p>
          </div>
        )}

        {isPro && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Lifespan</span>
              <span className="text-emerald-400 text-sm tabular-nums">{proMonths}m</span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={proMonths}
              onChange={(e) => setProMonths(Number(e.target.value))}
              className="w-full cursor-pointer appearance-none rounded-full bg-zinc-800 outline-none
                [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800
                [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_#10b98160]"
            />
            <div className="flex justify-between text-[10px] text-zinc-600">
              <span>1m</span>
              <span>12m</span>
            </div>
            <div className="flex items-center justify-center gap-3 mt-2">
              <span className="text-sm text-emerald-400">${proPrice}</span>
              <span className="text-xs text-zinc-600">|</span>
              <span className="text-sm text-purple-400 font-semibold">$49 Lifetime</span>
            </div>
          </div>
        )}

        <div className="mb-3 text-[10px] text-zinc-600 text-center border-t border-zinc-800/50 pt-3 mt-2">
          Free domain comes with server
        </div>

        {error && (
          <div className="mb-3 rounded border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs text-red-400">&gt; {error}</div>
        )}

        <div className="mt-auto flex flex-col gap-2">
          {isFree && (
            <button
              onClick={() => handleActivate("free", freeLifespan * 60)}
              disabled={activating}
              className="w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200 disabled:opacity-40"
            >
              {activating ? "Activating..." : "Activate Free"}
            </button>
          )}
          {isHacker && (
            <button
              onClick={() => handleActivate("hacker", hackerDays * 1440)}
              disabled={activating}
              className="w-full rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40"
            >
              {activating ? "Activating..." : `Pay $${hackerPrice}`}
            </button>
          )}
          {isPro && (
            <>
              <button
                onClick={() => handleActivate("pro", proMonths * 43200)}
                disabled={activating}
                className="w-full rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400 transition-all hover:bg-emerald-500/20 disabled:opacity-40"
              >
                {activating ? "Activating..." : `Pay $${proPrice}`}
              </button>
              <button
                onClick={() => handleActivate("pro", 525600)}
                disabled={activating}
                className="w-full rounded-lg border border-purple-500/50 bg-purple-500/10 px-4 py-2.5 text-sm text-purple-400 transition-all hover:bg-purple-500/20 disabled:opacity-40"
              >
                {activating ? "Activating..." : "$49 Lifetime"}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950/90 p-8 backdrop-blur-md">
        <button onClick={onClose} className="absolute right-4 top-4 text-zinc-500 transition-colors hover:text-zinc-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-xl font-semibold text-zinc-100">Choose Your Server</h2>
          <p className="mt-1 text-sm text-zinc-500">Select a plan that fits your needs</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {planCard("free")}
          {planCard("hacker")}
          {planCard("pro")}
        </div>
      </div>
    </div>
  );
}

function Footer({ lang }: { lang: LangCode }) {
  return (
    <footer className="border-t border-zinc-800/50 bg-zinc-950/80 px-6 py-10 backdrop-blur-sm md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="CodeLink" width={20} height={20} className="rounded" />
          <span className="text-sm font-medium tracking-wider text-zinc-400">{t("nav.brand", lang)}</span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-zinc-600">
          <a href="#" className="transition-colors hover:text-zinc-400">{t("footer.terms", lang)}</a>
          <a href="#" className="transition-colors hover:text-zinc-400">{t("footer.privacy", lang)}</a>
          <a href="#" className="transition-colors hover:text-zinc-400">{t("footer.cookie", lang)}</a>
          <a href="#" className="transition-colors hover:text-zinc-400">{t("footer.contact", lang)}</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[11px] text-zinc-700">{t("footer.copyright", lang)}</span>
        </div>
      </div>
    </footer>
  );
}

interface VFile {
  path: string;
  content: string;
}

function parseHtmlToFiles(html: string): VFile[] {
  const files: VFile[] = [{ path: "/index.html", content: html }];
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/);
  if (styleMatch) files.push({ path: "/styles.css", content: styleMatch[1] });
  const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
  if (scriptMatch) files.push({ path: "/script.js", content: scriptMatch[1] });
  return files;
}

function assemblePreview(files: VFile[]): string {
  const htmlFile = files.find((f) => f.path === "/index.html");
  if (!htmlFile)
    return `<html><body><div style="color:#52525b;font-family:monospace;padding:3rem;text-align:center;">&gt; Generate code to see preview</div></body></html>`;

  let html = htmlFile.content;
  const css = files
    .filter((f) => f.path.endsWith(".css"))
    .map((f) => f.content)
    .join("\n");
  if (css) html = html.replace("</head>", `<style>${css}</style></head>`);
  const js = files
    .filter((f) => f.path.endsWith(".js"))
    .map((f) => f.content)
    .join("\n");
  if (js) html = html.replace("</body>", `<script>${js}</script></body>`);
  return html;
}

function FileTree({
  files,
  selected,
  onSelect,
}: {
  files: VFile[];
  selected: string | null;
  onSelect: (path: string) => void;
}) {
  const dirs = new Set<string>();
  files.forEach((f) => {
    const parts = f.path.split("/").filter(Boolean);
    let p = "";
    for (let i = 0; i < parts.length - 1; i++) {
      p += "/" + parts[i];
      dirs.add(p);
    }
  });

  return (
    <div className="border-t border-zinc-800/50 bg-zinc-950/50 p-3 text-xs">
      <div className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600">Files</div>
      {files.length === 0 && <p className="text-zinc-700 italic">No files yet</p>}
      {files.map((f) => (
        <button
          key={f.path}
          onClick={() => onSelect(f.path)}
          className={`w-full flex items-center gap-2 rounded px-2 py-1 text-left transition-colors ${
            selected === f.path ? "bg-emerald-500/10 text-emerald-300" : "text-zinc-400 hover:bg-zinc-800/50"
          }`}
        >
          <span>📄</span>
          <span>{f.path}</span>
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const [supabase] = useState(createClient);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [serverPlanOpen, setServerPlanOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [lang, setLang] = useState<LangCode>("en");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [files, setFiles] = useState<VFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [previewTab, setPreviewTab] = useState<"ui" | "code">("ui");
  const [error, setError] = useState("");

  const fetchProfile = useCallback(async (userId: string) => {
    const client = supabase ?? createClient();
    if (!client) return;
    const { data } = await client.from("profiles").select("*").eq("id", userId).single();
    if (data) setProfile(data as Profile);
    else setProfile(null);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const handleSignOut = useCallback(async () => {
    const client = supabase ?? createClient();
    await client?.auth.signOut();
    setProfile(null);
  }, [supabase]);

  const handleChooseServer = () => {
    if (!user) { setModalOpen(true); return; }
    setServerPlanOpen(true);
  };

  const handleActivated = () => {
    setServerPlanOpen(false);
    setProfile((prev) => prev ? { ...prev, plan: "free" } : null);
  };

  const handleExport = () => {
    if (!user) { setModalOpen(true); return; }
    if (!profile || profile.plan === "free") { setUpgradeOpen(true); return; }
    const blob = new Blob([assemblePreview(files)], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codelink-export.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSpawn = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");
    setMessages((prev) => [...prev, { role: "user", text: prompt.trim() }]);

    const client = supabase ?? createClient();
    if (!client) { setError("Supabase not configured"); setGenerating(false); return; }
    const { data: { session } } = await client.auth.getSession();
    if (!session) { setError("Not logged in"); setGenerating(false); return; }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), lifespan_minutes: 60 }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Generation failed"); setGenerating(false); return; }
      setPrompt("");

      const newFiles = parseHtmlToFiles(data.html_code);
      setFiles(newFiles);
      setSelectedFile("/index.html");
      const lines = newFiles.map((f) => `${f.path} (${f.content.length}B)`).join(", ");
      setMessages((prev) => [...prev, { role: "ai", text: `Generated: ${lines}` }]);
      setPreviewTab("ui");
    } catch { setError("Network error"); }
    setGenerating(false);
  };

  const showExport = files.length > 0;

  return (
    <>
      <Navbar user={user} profile={profile} onLoginClick={() => setModalOpen(true)} onChooseServer={handleChooseServer} onExport={handleExport} onSignOut={handleSignOut} lang={lang} onLangChange={setLang} />
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} lang={lang} />
      <ServerPlanModal open={serverPlanOpen} onClose={() => setServerPlanOpen(false)} user={user} lang={lang} onActivated={handleActivated} />
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} onChooseServer={handleChooseServer} />

      <main className="flex h-screen w-full pt-16">
        <div className="flex w-1/2 flex-col border-r border-zinc-800/50">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-zinc-600">&gt; Describe the web app you want to build...</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`rounded-lg border px-4 py-3 text-sm ${m.role === "user" ? "border-zinc-800 bg-zinc-900/60 text-zinc-200" : "border-emerald-500/10 bg-emerald-500/[0.02] text-zinc-300"}`}>
                <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1">{m.role === "user" ? "You" : "CodeLink"}</div>
                <div className="whitespace-pre-wrap">{m.text}</div>
              </div>
            ))}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400">&gt; {error}</div>
            )}
          </div>

          <div className="border-t border-zinc-800/50 p-4 space-y-3">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the web app you want to build..."
              rows={3}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 p-3 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
            />
            <button
              onClick={handleSpawn}
              disabled={generating || !prompt.trim()}
              className="w-full rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_16px_#10b98140] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-3 w-3 animate-ping rounded-full bg-emerald-400" />
                  Generating...
                </span>
              ) : (
                "> SPAWN CODE"
              )}
            </button>
          </div>
        </div>

        <div className="flex w-1/2 flex-col">
          <div className="flex border-b border-zinc-800/50">
            <button
              onClick={() => setPreviewTab("ui")}
              className={`flex-1 px-4 py-2.5 text-xs tracking-wider transition-colors ${
                previewTab === "ui" ? "border-b-2 border-emerald-500 text-emerald-400" : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              UI Preview
            </button>
            <button
              onClick={() => setPreviewTab("code")}
              className={`flex-1 px-4 py-2.5 text-xs tracking-wider transition-colors ${
                previewTab === "code" ? "border-b-2 border-emerald-500 text-emerald-400" : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              Code
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
            {previewTab === "ui" ? (
              <iframe
                key={files.length}
                srcDoc={assemblePreview(files)}
                className="h-full w-full border-0 bg-white"
                title="Preview"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="h-full overflow-y-auto p-4">
                {selectedFile && files.find((f) => f.path === selectedFile) ? (
                  <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-mono">
                    {files.find((f) => f.path === selectedFile)?.content}
                  </pre>
                ) : (
                  <pre className="text-xs text-zinc-600 font-mono">
                    {files.map((f) => `// ── ${f.path} ──\n${f.content}\n`).join("\n")}
                  </pre>
                )}
              </div>
            )}
          </div>

          {showExport && (
            <FileTree files={files} selected={selectedFile} onSelect={setSelectedFile} />
          )}
        </div>
      </main>
    </>
  );
}
