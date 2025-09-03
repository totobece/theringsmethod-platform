import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  console.log("🔵 Auth reset-password endpoint called");
  console.log("🔵 Request URL:", request.url);

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  console.log("🔵 Token hash:", token_hash ? "Present" : "Missing");
  console.log("🔵 Type:", type);

  // Determinar la URL base para redirección
  const host = request.headers.get("host") || "";
  const forwardedHost = request.headers.get("x-forwarded-host") || "";

  let baseUrl = "https://app.theringsmethod.com";
  if (host.includes("theringsmethod.com")) {
    baseUrl = `https://${host}`;
  } else if (forwardedHost.includes("theringsmethod.com")) {
    baseUrl = `https://${forwardedHost}`;
  } else if (host.includes("localhost") || host.includes("127.0.0.1")) {
    baseUrl = `http://${host}`;
  }

  console.log("🔵 Base URL determined:", baseUrl);

  // Función para crear respuesta HTML de redirección
  const createRedirectResponse = (
    targetUrl: string,
    message: string = "Redirecting...",
  ) => {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - The Rings Method</title>
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
    <h1>🔐 Password Reset</h1>
    <p>${message}</p>
    <p>You will be redirected automatically...</p>
    <a href="${targetUrl}" class="button">Click here if not redirected</a>
  </div>
</body>
</html>`;

    return new Response(html, {
      status: 200,
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-cache, no-store, must-revalidate",
        pragma: "no-cache",
        expires: "0",
      },
    });
  };

  if (!token_hash || !type) {
    console.error("❌ Missing token_hash or type parameter");
    return createRedirectResponse(
      `${baseUrl}/reset-password?error=invalid_link`,
      "Invalid reset link - missing parameters",
    );
  }

  if (type !== "recovery") {
    console.error("❌ Invalid type parameter:", type);
    return createRedirectResponse(
      `${baseUrl}/reset-password?error=invalid_link`,
      "Invalid reset link type",
    );
  }

  try {
    console.log("🔵 Creating Supabase client...");
    const supabase = await createClient();

    console.log("🔵 Verifying recovery token...");
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "recovery",
    });

    console.log("🔵 Token verification result:");
    console.log("🔵 Data:", data ? "Present" : "Null");
    console.log("🔵 Error:", error ? error.message : "None");
    console.log("🔵 Error code:", error?.code);

    if (error) {
      console.error("❌ Token verification error:", error);

      if (error.code === "otp_expired") {
        console.log("🔵 Token expired, redirecting to request new reset");
        return createRedirectResponse(
          `${baseUrl}/reset-password?error=link_expired`,
          "Reset link has expired. Please request a new one.",
        );
      } else if (
        error.code === "otp_invalid" ||
        error.code === "invalid_token"
      ) {
        console.log("🔵 Invalid token, redirecting to request reset");
        return createRedirectResponse(
          `${baseUrl}/reset-password?error=invalid_link`,
          "Invalid reset link. Please request a new one.",
        );
      } else {
        console.log(
          "🔵 Other verification error, redirecting to request reset",
        );
        return createRedirectResponse(
          `${baseUrl}/reset-password?error=auth_error`,
          "Authentication error occurred. Please try again.",
        );
      }
    }

    if (data.session) {
      console.log(
        "✅ Token verification successful, redirecting to reset form",
      );
      return createRedirectResponse(
        `${baseUrl}/reset-password?verified=true`,
        "Reset link verified! Redirecting to password reset form...",
      );
    } else {
      console.log("⚠️ Token verified but no session created");
      return createRedirectResponse(
        `${baseUrl}/reset-password?error=session_error`,
        "Session error occurred. Please try the reset process again.",
      );
    }
  } catch (error) {
    console.error("❌ Unexpected error in reset-password auth:", error);
    return createRedirectResponse(
      `${baseUrl}/reset-password?error=server_error`,
      "Server error occurred. Please try again later.",
    );
  }
}
