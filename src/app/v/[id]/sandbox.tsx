"use client";

import { useCallback, useEffect, useState } from "react";

function formatCountdown(ms: number) {
  if (ms <= 0) return { h: "00", m: "00", s: "00", done: true };
  const total = Math.floor(ms / 1000);
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return { h, m, s, done: false };
}

export function SandboxContent({
  htmlCode,
  expiresAt,
}: {
  htmlCode: string;
  expiresAt: string;
}) {
  const [remaining, setRemaining] = useState(() =>
    formatCountdown(new Date(expiresAt).getTime() - Date.now())
  );
  const [expired, setExpired] = useState(remaining.done);

  const tick = useCallback(() => {
    const ms = new Date(expiresAt).getTime() - Date.now();
    const fmt = formatCountdown(ms);
    setRemaining(fmt);
    if (fmt.done) setExpired(true);
  }, [expiresAt]);

  useEffect(() => {
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick]);

  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black font-mono">
        <div className="relative px-6 text-center">
          <div className="absolute inset-0 animate-pulse opacity-5">
            <div className="h-full w-full bg-gradient-to-b from-emerald-500/20 via-transparent to-transparent" />
          </div>
          <div className="relative space-y-4">
            <div className="inline-block text-5xl text-red-500/30 tracking-[0.3em]">
              ⚠ ACCESS DENIED
            </div>
            <div className="mx-auto h-px w-48 bg-red-500/20" />
            <p className="text-sm text-zinc-600">
              &gt; ACCESS EXPIRED. Code purged from Singapore cluster.
            </p>
            <p className="text-xs text-zinc-700">
              &gt; This page has self-destructed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col bg-black">
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 border-b border-emerald-500/20 bg-zinc-950/80 px-4 py-2 font-mono text-sm backdrop-blur-sm">
        <span className="text-zinc-500">LIFESPAN</span>
        <span className="tabular-nums tracking-wider text-emerald-400">
          {remaining.h}:{remaining.m}:{remaining.s}
        </span>
        <span className="text-zinc-600 text-xs">until auto-purge</span>
      </div>
      <iframe
        srcDoc={htmlCode}
        className="h-full w-full flex-1 border-0"
        title="Sandbox"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
