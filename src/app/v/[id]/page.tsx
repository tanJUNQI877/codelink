import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { SandboxContent } from "./sandbox";

export default async function ViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("spawned_pages")
    .select("id, html_code, expires_at")
    .eq("id", id)
    .single();

  if (!page) notFound();

  const now = new Date();
  const expiresAt = new Date(page.expires_at);
  const expired = now > expiresAt;

  if (expired) {
    return <ExpiredView />;
  }

  return (
    <SandboxContent
      htmlCode={page.html_code}
      expiresAt={page.expires_at}
    />
  );
}

function ExpiredView() {
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
