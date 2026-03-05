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
              console.error("[LOGIN API] Error setting session cookies:", error);
            }
          },
        },
      }
    );

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

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
