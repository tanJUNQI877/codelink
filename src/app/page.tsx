"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  LANGUAGES,
  t,
  formatLifespanI18n,
  type LangCode,
} from "@/lib/i18n/translations";

type PlanTier = "free" | "hacker" | "pro";

interface Profile {
  plan: PlanTier;
  credits_remaining: number;
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

  const handleOAuth = useCallback(
    async (provider: "github" | "google") => {
      const client = supabase ?? createClient();
      if (!client) return;
      await client.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/auth/callback` },
      });
    },
    [supabase]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

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
          <h2 className="text-lg font-semibold text-zinc-100">{t("modal.heading", lang)}</h2>
          <p className="mt-1 text-sm text-zinc-500">{t("modal.subtitle", lang)}</p>
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
      </div>
    </div>
  );
}

function Navbar({
  user,
  onLoginClick,
  onSignOut,
  lang,
  onLangChange,
}: {
  user: User | null;
  onLoginClick: () => void;
  onSignOut: () => void;
  lang: LangCode;
  onLangChange: (l: LangCode) => void;
}) {
  const displayName = user?.user_metadata?.user_name
    ? `@${user.user_metadata.user_name}`
    : user?.email?.split("@")[0] ?? "hacker";
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/50 bg-zinc-950/70 px-6 backdrop-blur-md md:px-12">
      <div className="flex items-center gap-3">
        <Image src="/logo.png" alt="CodeLink" width={28} height={28} className="rounded" />
        <span className="text-lg font-semibold tracking-wider text-zinc-100">{t("nav.brand", lang)}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="hidden sm:block">
          <div className="relative">
            <button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition-all hover:border-zinc-600 hover:text-zinc-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {LANGUAGES.find((l) => l.code === lang)?.label ?? "English"}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
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
        </div>
        {user ? (
          <>
            <span className="text-sm text-emerald-400">{displayName}</span>
            <button onClick={onSignOut} className="flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300">
              <LogOutIcon />
              <span className="hidden sm:inline">{t("nav.signout", lang)}</span>
            </button>
          </>
        ) : (
          <>
            <button onClick={onLoginClick} className="text-sm text-zinc-400 transition-colors hover:text-zinc-100">{t("nav.login", lang)}</button>
            <button onClick={onLoginClick} className="rounded-lg border border-emerald-500/50 px-4 py-1.5 text-sm text-emerald-400 transition-all hover:border-emerald-400 hover:text-emerald-300 hover:shadow-[0_0_12px_#10b98140]">{t("nav.signup", lang)}</button>
          </>
        )}
      </div>
    </nav>
  );
}

interface Plan {
  emoji: string;
  titleKey: string;
  featuresKeys: string[];
  priceKey: string | null;
  buttonKey: string;
  variant: "outline" | "glow" | "premium";
  action: "auth" | "checkout";
  tier: PlanTier;
}

const plans: Plan[] = [
  {
    emoji: "🪐",
    titleKey: "plan.free.title",
    featuresKeys: ["plan.free.feature1", "plan.free.feature2", "plan.free.feature3"],
    priceKey: null,
    buttonKey: "plan.free.button",
    variant: "outline",
    action: "auth",
    tier: "free",
  },
  {
    emoji: "🐹",
    titleKey: "plan.hacker.title",
    featuresKeys: ["plan.hacker.feature1", "plan.hacker.feature2", "plan.hacker.feature3"],
    priceKey: "plan.hacker.price",
    buttonKey: "plan.hacker.button",
    variant: "glow",
    action: "checkout",
    tier: "hacker",
  },
  {
    emoji: "🚀",
    titleKey: "plan.pro.title",
    featuresKeys: ["plan.pro.feature1", "plan.pro.feature2", "plan.pro.feature3", "plan.pro.feature4"],
    priceKey: "plan.pro.price",
    buttonKey: "plan.pro.button",
    variant: "premium",
    action: "checkout",
    tier: "pro",
  },
];

function PlanCard({
  plan,
  index,
  user,
  lang,
  onActivate,
  onRequireAuth,
}: {
  plan: Plan;
  index: number;
  user: User | null;
  lang: LangCode;
  onActivate: (tier: PlanTier) => void;
  onRequireAuth: () => void;
}) {
  const router = useRouter();
  const isMiddle = index === 1;

  const handleClick = () => {
    if (plan.action === "auth") {
      if (!user) { onRequireAuth(); return; }
      onActivate(plan.tier);
      return;
    }
    console.log(`Redirect to checkout: ${plan.titleKey}`);
    router.push("/checkout");
  };

  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 md:p-8 ${isMiddle ? "border-emerald-500/40 bg-zinc-900/80 shadow-[0_0_24px_#10b98120] hover:shadow-[0_0_32px_#10b98130]" : "border-zinc-800/60 bg-zinc-900/60 hover:border-zinc-700/80 hover:shadow-[0_0_16px_#10b98110]"}`}>
      {isMiddle && <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500/10 px-3 py-0.5 text-[11px] font-medium uppercase tracking-widest text-emerald-400 border border-emerald-500/30">{t("pricing.badge", lang)}</div>}
      <div className="mb-4 text-2xl">{plan.emoji}</div>
      <h3 className="text-lg font-semibold text-zinc-100">{t(plan.titleKey, lang)}</h3>
      <ul className="my-6 flex flex-col gap-2.5">
        {plan.featuresKeys.map((fk) => (
          <li key={fk} className="flex items-start gap-2 text-sm text-zinc-400">
            <span className="mt-0.5 text-emerald-500">▸</span>
            {t(fk, lang)}
          </li>
        ))}
      </ul>
      {plan.priceKey && <p className="mb-6 text-xs tracking-wider text-zinc-500">{t(plan.priceKey, lang)}</p>}
      <div className="mt-auto">
        {plan.variant === "outline" && (
          <button onClick={handleClick} className="w-full rounded-lg border border-zinc-700 px-4 py-2.5 text-sm text-zinc-400 transition-all hover:border-zinc-500 hover:text-zinc-200">{t(plan.buttonKey, lang)}</button>
        )}
        {plan.variant === "glow" && (
          <button onClick={handleClick} className="w-full rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-400 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_20px_#10b98140]">{t(plan.buttonKey, lang)}</button>
        )}
        {plan.variant === "premium" && (
          <button onClick={handleClick} className="w-full rounded-lg border border-zinc-600 bg-gradient-to-b from-zinc-700 to-zinc-800 px-4 py-2.5 text-sm text-zinc-200 transition-all hover:from-zinc-600 hover:to-zinc-700 hover:shadow-[0_0_16px_#a855f720]">{t(plan.buttonKey, lang)}</button>
        )}
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

function Workspace({
  profile,
  lang,
  onProfileChange,
}: {
  profile: Profile;
  lang: LangCode;
  onProfileChange: (p: Profile) => void;
}) {
  const [supabase] = useState(createClient);
  const [prompt, setPrompt] = useState("");
  const [lifespan, setLifespan] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const isFree = profile.plan === "free";
  const maxLifespan = isFree ? 3 : 1440;

  const handleSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (isFree && val > 3) { setLifespan(3); return; }
    setLifespan(val);
  };

  const handleSpawn = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setError("");

    const client = supabase ?? createClient();
    if (!client) { setError(t("error.notConfigured", lang)); setGenerating(false); return; }

    const { data: { session } } = await client.auth.getSession();
    if (!session) { setError(t("error.notAuthenticated", lang)); setGenerating(false); return; }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), lifespan_minutes: lifespan }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Generation failed"); setGenerating(false); return; }
      onProfileChange({ ...profile, credits_remaining: profile.credits_remaining - 1 });
      router.push(`/v/${data.id}`);
    } catch { setError(t("error.network", lang)); setGenerating(false); }
  };

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">
            {t("ws.heading", lang)}
            <span className="ml-2 text-xs font-normal text-zinc-600">_</span>
          </h2>
          <p className="mt-1 text-xs text-zinc-600">
            {t("ws.plan", lang)} <span className="text-emerald-400">{profile.plan.toUpperCase()}</span>
            {" · "}
            {t("ws.credits", lang)} <span className="text-emerald-400">{profile.credits_remaining}</span>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-zinc-500">{t("ws.promptLabel", lang)}</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("ws.promptPlaceholder", lang)}
          rows={5}
          className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-200 placeholder-zinc-600 transition-colors focus:border-emerald-500/40 focus:outline-none focus:ring-1 focus:ring-emerald-500/20"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs text-zinc-500">{t("ws.lifespanLabel", lang)}</label>
          <span className="text-sm tabular-nums tracking-wider text-emerald-400">
            {formatLifespanI18n(lifespan, lang)}
          </span>
        </div>
        <input
          type="range"
          min={3}
          max={maxLifespan}
          value={lifespan}
          onChange={handleSlider}
          className="w-full cursor-pointer appearance-none rounded-full bg-zinc-800 outline-none
            [&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-zinc-800
            [&::-webkit-slider-thumb]:mt-[-4px] [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_#10b98160] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125
            [&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-zinc-800
            [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400 [&::-moz-range-thumb]:shadow-[0_0_8px_#10b98160] [&::-moz-range-thumb]:border-0"
        />
        <div className="flex items-center justify-between text-[11px] text-zinc-600">
          <span>{t("ws.minLabel", lang)}</span>
          <span>{t("ws.maxLabel", lang)}</span>
        </div>
        {isFree && <p className="text-xs text-amber-500/80">⚠ {t("ws.upgradeWarning", lang)}</p>}
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400">&gt; {error}</div>
      )}

      <button
        onClick={handleSpawn}
        disabled={generating || !prompt.trim()}
        className="w-full rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20 hover:shadow-[0_0_24px_#10b98140] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block h-3 w-3 animate-ping rounded-full bg-emerald-400" />
            {t("ws.generating", lang)}
          </span>
        ) : (
          t("ws.spawnButton", lang)
        )}
      </button>
    </div>
  );
}

export default function Home() {
  const [supabase] = useState(createClient);
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileError, setProfileError] = useState("");
  const [lang, setLang] = useState<LangCode>("zh-CN");

  const fetchProfile = useCallback(
    async (userId: string) => {
      const client = supabase ?? createClient();
      if (!client) return;
      const { data, error } = await client
        .from("profiles")
        .select("plan, credits_remaining")
        .eq("id", userId)
        .single();
      if (error && error.code !== "PGRST116") {
        console.error("[fetchProfile] DB error:", error);
      }
      if (data) {
        setProfile(data as Profile);
        setProfileError("");
      } else {
        setProfile(null);
      }
    },
    [supabase]
  );

  useEffect(() => {
    if (!supabase) { console.warn("[Home] supabase client is null — check .env.local"); return; }
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("[Home] getSession:", session?.user?.email ?? "none");
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("[Home] onAuthStateChange event:", event, "user:", session?.user?.email ?? "none");
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
    setProfileError("");
  }, [supabase]);

  const handleActivatePlan = useCallback(
    async (tier: PlanTier) => {
      const client = supabase ?? createClient();
      if (!client || !user) return;
      setProfileError("");

      if (tier === "free") {
        console.log("[handleActivatePlan] inserting free profile for", user.id);
        const { error } = await client.from("profiles").insert({
          id: user.id,
          plan: "free",
          credits_remaining: 15,
        });
        if (error) {
          console.error("[handleActivatePlan] insert error:", error);
          setProfileError(t("error.profileInsertFailed", lang));
        } else {
          console.log("[handleActivatePlan] profile created successfully");
          setProfile({ plan: "free", credits_remaining: 15 });
        }
      } else {
        console.log(`Redirect to checkout for ${tier}`);
      }
    },
    [supabase, user, lang]
  );

  const showPricing = !user || !profile;
  const showWorkspace = user && profile;

  return (
    <>
      <Navbar user={user} onLoginClick={() => setModalOpen(true)} onSignOut={handleSignOut} lang={lang} onLangChange={setLang} />
      <LoginModal open={modalOpen} onClose={() => setModalOpen(false)} lang={lang} />
      <main className="flex min-h-screen flex-col items-center px-4 pt-16">
        {showPricing && (
          <section className="w-full max-w-6xl py-16 md:py-24">
            <div className="mb-12 text-center md:mb-16">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100 md:text-4xl">
                {t("pricing.heading", lang)} <span className="text-emerald-400">Arsenal</span>
              </h1>
              <p className="mt-3 text-sm text-zinc-500 md:text-base">{t("pricing.subtitle", lang)}</p>
            </div>
            {profileError && (
              <div className="mb-6 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2 text-xs text-red-400 text-center">&gt; {profileError}</div>
            )}
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              {plans.map((plan, i) => (
                <PlanCard key={plan.titleKey} plan={plan} index={i} user={user} lang={lang} onActivate={handleActivatePlan} onRequireAuth={() => setModalOpen(true)} />
              ))}
            </div>
          </section>
        )}
        {showWorkspace && (
          <section className="w-full max-w-4xl py-8 md:py-16">
            <Workspace profile={profile} lang={lang} onProfileChange={setProfile} />
          </section>
        )}
      </main>
      <Footer lang={lang} />
    </>
  );
}
