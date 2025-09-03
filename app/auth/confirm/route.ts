import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

import { createClient } from "@/utils/supabase/server";

// Creating a handler to a GET request to route /auth/confirm
export async function GET(request: NextRequest) {
  console.log("🔵 Auth confirm endpoint called");
  console.log("🔵 Request URL:", request.url);
  console.log(
    "🔵 Request headers:",
    Object.fromEntries(request.headers.entries()),
  );

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  console.log("🔵 Token hash:", token_hash ? "Present" : "Missing");
  console.log("🔵 Type:", type);

  // Determinar la URL base para redirección
  const host = request.headers.get("host") || "";
  const forwardedHost = request.headers.get("x-forwarded-host") || "";
  const forwardedProto = request.headers.get("x-forwarded-proto") || "https";

  let baseUrl = "https://app.theringsmethod.com";
  if (host.includes("theringsmethod.com")) {
    // Always use HTTPS for theringsmethod.com in production
    baseUrl = `https://${host}`;
  } else if (forwardedHost.includes("theringsmethod.com")) {
    // Always use HTTPS for theringsmethod.com domains
    baseUrl = `https://${forwardedHost}`;
  } else if (host.includes("localhost") || host.includes("127.0.0.1")) {
    baseUrl = `http://${host}`;
  }

  const redirectUrl = `${baseUrl}/create-password`;

  console.log("🔵 Host:", host);
  console.log("🔵 Forwarded host:", forwardedHost);
  console.log("🔵 Base URL determined:", baseUrl);
  console.log("🔵 Redirect URL:", redirectUrl);

  // Respuesta HTML mínima para evitar headers grandes
  const createHtmlResponse = (
    targetUrl: string,
    message: string = "Redirecting...",
  ) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirming Account - The Rings Method</title>
  <style>
    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #1a1a1a; color: white; }
    .container { max-width: 500px; margin: 0 auto; }
    .button { display: inline-block; padding: 12px 24px; background: #ff6b9d; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
  </style>
  <script>
    setTimeout(function() {
      window.location.href = '${targetUrl}';
    }, 1000);
  </script>
</head>
<body>
  <div class="container">
    <h1>🚀 The Rings Method</h1>
    <p>${message}</p>
    <p>You will be redirected automatically...</p>
    <a href="${targetUrl}" class="button">Click here if not redirected</a>
  </div>
</body>
</html>`;

    // Usar Response básica con headers mínimos
    return new Response(html, {
      status: 200,
      headers: new Headers({
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache, no-store, must-revalidate",
        pragma: "no-cache",
        expires: "0",
      }),
    });
  };

  if (!token_hash || !type) {
    console.error("❌ Missing token_hash or type parameter");
    return createHtmlResponse(
      `${baseUrl}/login?error=invalid_link`,
      "Invalid confirmation link - missing parameters",
    );
  }

  try {
    console.log("🔵 Creating Supabase client...");
    const supabase = await createClient();

    console.log("🔵 Verifying OTP token...");
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    });

    console.log("🔵 OTP verification result:");
    console.log("🔵 Data:", data ? "Present" : "Null");
    console.log("🔵 Error:", error ? error.message : "None");
    console.log("🔵 Error code:", error?.code);

    if (error) {
      console.error("❌ OTP verification error:", error);

      if (error.code === "otp_expired") {
        console.log("🔵 Token expired, redirecting to login");
        return createHtmlResponse(
          `${baseUrl}/login?error=link_expired`,
          "Confirmation link has expired. Please request a new one.",
        );
      } else if (
        error.code === "otp_invalid" ||
        error.code === "invalid_token"
      ) {
        console.log("🔵 Invalid token, redirecting to login");
        return createHtmlResponse(
          `${baseUrl}/login?error=invalid_link`,
          "Invalid confirmation link. Please request a new one.",
        );
      } else {
        console.log("🔵 Other auth error, redirecting to login");
        return createHtmlResponse(
          `${baseUrl}/login?error=auth_error`,
          "Authentication error occurred. Please try again.",
        );
      }
    }

    console.log(
      "✅ OTP verification successful, redirecting to create password",
    );
    // Redirigir a create-password cuando la verificación es exitosa
    return createHtmlResponse(
      redirectUrl,
      "Account confirmed! Redirecting to create your password...",
    );
  } catch (error) {
    console.error("❌ Unexpected error in auth confirm:", error);
    return createHtmlResponse(
      `${baseUrl}/login?error=server_error`,
      "Server error occurred. Please try again later.",
    );
  }
}
