import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
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

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // Expected in some edge cases with cookies API
            }
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

    return NextResponse.json({ success: true });
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
