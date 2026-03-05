import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  const baseUrl = "https://app.theringsmethod.com";

  if (error) {
    console.error("[AUTH CALLBACK] OAuth error:", error, errorDescription);
    return NextResponse.redirect(`${baseUrl}/login?error=auth_error`);
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      console.error("[AUTH CALLBACK] Code exchange error:", exchangeError.message);
      return NextResponse.redirect(`${baseUrl}/login?error=auth_error`);
    }

    // Successful login - redirect to home
    return NextResponse.redirect(`${baseUrl}/`);
  }

  // No code and no error - redirect to login
  return NextResponse.redirect(`${baseUrl}/login`);
}
