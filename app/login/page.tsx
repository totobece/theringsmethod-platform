"use client";
import Image from "next/image";
import LogoDuo from "@/public/logo-blanco-trm.png";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSelector from "@/components/UI/LanguageSelector/language-selector";
import { useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useI18n();
  const searchParams = useSearchParams();

  // Manejar errores de URL
  useEffect(() => {
    const error = searchParams.get("error");
    const success = searchParams.get("success");

    if (error === "link_expired") {
      setErrorMessage(t("auth.linkExpired"));
    } else if (error === "auth_error") {
      setErrorMessage(t("auth.authError"));
    } else if (error === "invalid_credentials") {
      setErrorMessage(t("auth.invalidCredentials"));
    } else if (error === "invalid_data") {
      setErrorMessage(t("auth.invalidData"));
    } else if (error === "password_too_short") {
      setErrorMessage(t("auth.passwordTooShort"));
    } else if (error === "user_exists") {
      setErrorMessage(t("auth.userExists"));
    } else if (error === "signup_failed") {
      setErrorMessage(t("auth.signupFailed"));
    } else if (error === "timeout") {
      setErrorMessage("La conexión ha tardado demasiado. Por favor, intenta de nuevo.");
    } else if (success === "signup_complete") {
      setErrorMessage(t("auth.signupComplete"));
    } else if (success === "password_reset") {
      setErrorMessage(t("auth.passwordResetSuccess"));
    }
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        signal: AbortSignal.timeout(12000),
      });

      if (response.ok) {
        window.location.href = "/";
        return;
      } else {
        const data = await response.json().catch(() => ({}));
        if (data.error === "invalid_credentials") {
          setErrorMessage(t("auth.invalidCredentials"));
        } else {
          setErrorMessage(t("auth.authError"));
        }
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "TimeoutError") {
        setErrorMessage("La conexión está tardando demasiado. Por favor, intenta de nuevo.");
      } else {
        console.error("Error during authentication:", error);
        setErrorMessage(t("auth.authError"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setErrorMessage("");

    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "https://app.theringsmethod.com/auth/callback",
        },
      });

      if (error) {
        console.error("Google login error:", error);
        setErrorMessage(t("auth.authError"));
        setIsGoogleLoading(false);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setErrorMessage(t("auth.authError"));
      setIsGoogleLoading(false);
    }
  };

  return (
    <section className="bg-darkgrad min-h-screen w-full flex animate-slidein full-height">
      {/* Language Selector - positioned absolutely in top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>

      <div className="w-full max-w-xl m-auto px-2 pt-6 pb-12">
        <div className="w-full space-y-10 p-8 rounded-2xl bg-darkgrad border-2 border-gray-600">
          <div>
            <h1 className="text-white w-full font-medium text-3xl lg:text-5xl">
              {(t("auth.welcomeTitle") || "¡Bienvenido a\\nThe Rings Method!")
                .split("\\n")
                .map((line, index) => (
                  <span key={index}>
                    {line}
                    {index === 0 && <br />}
                  </span>
                ))}
            </h1>
            {errorMessage && (
              <div
                className={`mt-4 p-3 border rounded ${
                  searchParams.get("success")
                    ? "bg-green-100 border-green-400 text-green-700"
                    : "bg-red-100 border-red-400 text-red-700"
                }`}
              >
                {errorMessage}
              </div>
            )}
          </div>

          <form
            className="flex flex-col"
            autoComplete="off"
            ref={formRef}
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label className="text-white text-xl font-medium" htmlFor="email">
                {t("auth.email")}:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full my-4 px-16 py-3 bg-gray-600 border-gray-700 rounded-2xl text-xl shadow-sm text-white focus:border-gray-700 focus:ring focus:ring-gray-700"
              />
            </div>

            <div className="flex flex-col">
              <label
                className="text-white text-xl font-medium"
                htmlFor="password"
              >
                {t("auth.password")}:
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="block w-full my-4 px-16 py-3 bg-gray-600 border-white rounded-2xl text-xl shadow-sm text-white focus:border-white focus:ring focus:ring-white"
              />
            </div>

            <div className="flex justify-between items-center">
              <a
                href="/reset-password"
                className="text-sm text-gray-300 hover:text-white hover:underline"
              >
                {t("auth.forgotPassword")}
              </a>
              <div
                className="cursor-pointer hover:underline"
                onClick={() => setShowPassword(!showPassword)}
              >
                <p className="text-md text-white">
                  {showPassword
                    ? t("auth.hidePassword")
                    : t("auth.showPassword")}
                </p>
              </div>
            </div>

            <div className="justify-center flex w-full space-x-4 px-4 py-8">
              <button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="relative bg-gray-300 transition px-6 text-xl inline-flex h-12 animate-shimmer items-center justify-center rounded-[40px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("auth.loading") : t("auth.login")}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-600"></div>
            <span className="text-gray-400 text-sm">{t("auth.orContinueWith")}</span>
            <div className="flex-1 h-px bg-gray-600"></div>
          </div>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="flex items-center justify-center gap-3 w-full max-w-sm px-6 py-3 bg-white hover:bg-gray-100 text-gray-800 font-medium text-lg rounded-[40px] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                t("auth.loading")
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {t("auth.loginWithGoogle")}
                </>
              )}
            </button>
          </div>

          {/* Logo centrado y texto de términos */}
          <div className="flex flex-col items-center space-y-4 mt-4">
            <Image
              src={LogoDuo}
              alt="theringsmethod-logo"
              width={130}
              height={130}
            />
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {t("auth.continueAccepting")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
