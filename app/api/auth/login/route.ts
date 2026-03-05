import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    console.log("[LOGIN API] 1. Request received");
    const body = await request.json();
    console.log("[LOGIN API] 2. Body parsed:", body?.email);
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 400 }
      );
    }

    console.log("[LOGIN API] 3. Creating Supabase client...");
    const cookieStore = await cookies();
    console.log("[LOGIN API] 4. Got cookie store");
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
              console.error("[LOGIN API] Error setting session cookies:", error);
            }
          },
        },
      }
    );
    console.log("[LOGIN API] 5. Supabase client created, calling signInWithPassword...");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    console.log("[LOGIN API] 6. signInWithPassword returned", error ? `error: ${error.message}` : "success");

    if (error) {
      console.error("[LOGIN API] Auth error:", error.message);
      return NextResponse.json(
        { error: "invalid_credentials" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[LOGIN API] Unexpected error:", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
