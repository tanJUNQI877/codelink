import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";

export async function POST(request: Request) {
  console.log("[API /api/generate] === START ===");

  // ── 1. Session check ──────────────────────────────────────────────
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.error("[API /api/generate] Auth error:", authError.message);
    return NextResponse.json({ error: `Auth error: ${authError.message}` }, { status: 401 });
  }

  if (!user) {
    console.error("[API /api/generate] No user in session");
    return NextResponse.json({ error: "Unauthorized — no session" }, { status: 401 });
  }

  console.log("[API /api/generate] Authenticated user:", user.id);

  // ── 2. Parse request body ─────────────────────────────────────────
  let prompt: string;
  let lifespan_minutes: number;

  try {
    const body = await request.json();
    prompt = body.prompt;
    lifespan_minutes = body.lifespan_minutes;
  } catch {
    console.error("[API /api/generate] Invalid JSON body");
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const lifespan = Math.max(3, Math.min(1440, Number(lifespan_minutes) || 3));
  console.log("[API /api/generate] Prompt length:", prompt.length, "| Lifespan:", lifespan, "min");

  // ── 3. Fetch profile & check credits ──────────────────────────────
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("plan, credits_remaining")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== "PGRST116") {
    console.error("[API /api/generate] Profile fetch error:", profileError);
    return NextResponse.json({ error: `Database error: ${profileError.message}` }, { status: 500 });
  }

  const plan = (profile?.plan as string) ?? "free";
  const credits = (profile?.credits_remaining as number) ?? 0;

  console.log("[API /api/generate] Plan:", plan, "| Credits:", credits);

  if (credits < 1) {
    console.error("[API /api/generate] Out of credits");
    return NextResponse.json(
      { error: "No credits remaining. Upgrade your plan." },
      { status: 403 }
    );
  }

  if (plan === "free" && lifespan > 3) {
    console.error("[API /api/generate] Free tier tried lifespan > 3");
    return NextResponse.json(
      { error: "Free tier limited to 3 minutes. Upgrade to Hacker/Pro." },
      { status: 403 }
    );
  }

  // ── 4. Call DeepSeek API ──────────────────────────────────────────
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    console.error("[API /api/generate] DEEPSEEK_API_KEY not set");
    return NextResponse.json(
      { error: "DeepSeek API key not configured on server" },
      { status: 500 }
    );
  }

  const systemPrompt = `You are a web development engine. Generate a single, complete, self-contained HTML page based on the user's description.
Rules:
- Output ONLY raw HTML. No markdown, no code fences, no explanations.
- Include Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
- All CSS and JS must be inline within the single HTML file.
- The page must be visually stunning with a dark theme, gradients, and modern UI.
- Make it fully functional and interactive where appropriate.
- Do NOT wrap the output in \`\`\`html or any other markers.`;

  console.log("[API /api/generate] Sending request to DeepSeek...");

  let deepseekResponse: Response;
  try {
    deepseekResponse = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        max_tokens: 8192,
        temperature: 0.7,
      }),
    });
  } catch (err) {
    console.error("[API /api/generate] Fetch threw:", err);
    return NextResponse.json(
      { error: "Failed to reach DeepSeek API — network error" },
      { status: 502 }
    );
  }

  if (!deepseekResponse.ok) {
    let detail = `DeepSeek returned HTTP ${deepseekResponse.status}`;
    try {
      const errBody = await deepseekResponse.json();
      detail += ` — ${JSON.stringify(errBody)}`;
    } catch {
      // ignore parse failure
    }
    console.error("[API /api/generate]", detail);
    return NextResponse.json({ error: detail }, { status: 502 });
  }

  const data = await deepseekResponse.json();
  const htmlCode: string = data.choices?.[0]?.message?.content ?? "";

  if (!htmlCode.trim()) {
    console.error("[API /api/generate] Empty content from DeepSeek");
    return NextResponse.json(
      { error: "Empty response from DeepSeek" },
      { status: 502 }
    );
  }

  console.log("[API /api/generate] DeepSeek OK — HTML length:", htmlCode.length);

  // ── 5. Save to spawned_pages ──────────────────────────────────────
  const now = new Date();
  const expiresAt = new Date(now.getTime() + lifespan * 60_000);

  const { data: page, error: insertError } = await supabase
    .from("spawned_pages")
    .insert({
      user_id: user.id,
      html_code: htmlCode,
      lifespan_minutes: lifespan,
      expires_at: expiresAt.toISOString(),
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[API /api/generate] DB insert error:", insertError);
    return NextResponse.json(
      { error: `Failed to save: ${insertError.message}` },
      { status: 500 }
    );
  }

  console.log("[API /api/generate] Saved page ID:", page.id);

  // ── 6. Deduct credit ──────────────────────────────────────────────
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits_remaining: credits - 1 })
    .eq("id", user.id);

  if (updateError) {
    console.error("[API /api/generate] Credit deduct error:", updateError);
    // non-fatal — page was already saved
  } else {
    console.log("[API /api/generate] Credit deducted:",
      credits, "→", credits - 1);
  }

  console.log("[API /api/generate] === SUCCESS ===");

  return NextResponse.json({
    id: page.id,
    expires_at: expiresAt.toISOString(),
  });
}
