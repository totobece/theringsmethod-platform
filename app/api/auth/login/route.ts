import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 400 }
      );
    }

    // Build response manually to set cookies via headers (avoids Next.js cookies() API issues)
    const response = NextResponse.json({ success: true });
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    // Add timeout to prevent hanging if Supabase is slow
    const authPromise = supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Auth timeout")), 10000)
    );

    const { error } = await Promise.race([authPromise, timeoutPromise]);

    if (error) {
      console.error("[LOGIN API] Auth error:", error.message);
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 401 }
      );
    }

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "Auth timeout") {
      console.error("[LOGIN API] Supabase auth timed out");
      return NextResponse.json({ error: "timeout" }, { status: 504 });
    }
    console.error("[LOGIN API] Unexpected error:", message);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
