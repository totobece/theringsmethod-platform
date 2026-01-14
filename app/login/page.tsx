"use client";
import { login } from "./actions";
import Image from "next/image";
import LogoDuo from "@/public/logo-blanco-trm.png";
import { useRef, useState, useEffect } from "react";
import { useI18n } from "@/contexts/I18nContext";
import LanguageSelector from "@/components/UI/LanguageSelector/language-selector";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);
    setErrorMessage("");

    // Timeout en el cliente también
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setErrorMessage("La conexión está tardando demasiado. Por favor, recarga la página e intenta de nuevo.");
    }, 15000); // 15 segundos

    try {
      await login(formData);
      clearTimeout(timeout);
    } catch (error) {
      clearTimeout(timeout);
      console.error("Error during authentication:", error);
      setErrorMessage(t("auth.authError"));
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
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
                disabled={isLoading}
                className="relative bg-gray-300 transition px-6 text-xl inline-flex h-12 animate-shimmer items-center justify-center rounded-[40px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t("auth.loading") : t("auth.login")}
              </button>
            </div>
          </form>

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
