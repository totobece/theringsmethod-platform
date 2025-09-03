"use client";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import Navbar from "@/components/UI/Navbar/navbar";
import Footer from "@/components/UI/Footer/footer";
import { useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/contexts/I18nContext";

export default function ResetPasswordPage() {
  const { t } = useI18n();
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Step 1: Request reset email
  const [step, setStep] = useState<"request" | "reset">("request");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  // Check if user came from reset email or has verified session
  useEffect(() => {
    const checkVerificationAndSession = async () => {
      const verified = searchParams.get("verified");
      const errorParam = searchParams.get("error");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      console.log("🔵 Reset password page loaded");
      console.log("🔵 Verified param:", verified);
      console.log("🔵 Error param:", errorParam);
      console.log("🔵 Token hash:", tokenHash ? "Present" : "None");
      console.log("🔵 Type:", type);

      // Handle error parameters
      if (errorParam) {
        if (errorParam === "link_expired") {
          setError(t("auth.linkExpired"));
        } else if (errorParam === "invalid_link") {
          setError("Invalid reset link. Please request a new one.");
        } else if (errorParam === "auth_error") {
          setError(t("auth.authError"));
        } else if (errorParam === "session_error") {
          setError("Session error. Please try the reset process again.");
        } else if (errorParam === "server_error") {
          setError("Server error. Please try again later.");
        }
        setStep("request");
        return;
      }

      // If user came directly with token parameters, verify them
      if (tokenHash && type === "recovery" && !verified) {
        console.log("🔵 Direct token access, verifying token...");
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: "recovery",
          });

          if (error) {
            console.error("❌ Direct token verification error:", error);
            if (error.code === "otp_expired") {
              setError(t("auth.linkExpired"));
            } else {
              setError(t("auth.authError"));
            }
            setStep("request");
            return;
          }

          if (data.session) {
            console.log("✅ Direct token verification successful");
            setStep("reset");
            return;
          } else {
            console.log("⚠️ Token verified but no session created");
            setError("Session error. Please request a new reset link.");
            setStep("request");
            return;
          }
        } catch (err) {
          console.error(
            "❌ Unexpected error during direct token verification:",
            err,
          );
          setError(t("auth.authError"));
          setStep("request");
          return;
        }
      }

      // If verified=true, user came from successful token verification
      if (verified === "true") {
        console.log("🔵 User verified via reset link, checking session...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          console.log("✅ Session found, switching to reset form");
          setStep("reset");
        } else {
          console.log("⚠️ No session found despite verification");
          setError("Session expired. Please request a new reset link.");
          setStep("request");
        }
      } else {
        // No verified param, check if user has an existing session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        console.log(
          "🔵 Checking existing session:",
          session ? "Present" : "None",
        );

        if (session) {
          setStep("reset");
        } else {
          setStep("request");
        }
      }
    };

    checkVerificationAndSession();
  }, [searchParams, supabase.auth, t]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!email) {
        setError(t("auth.invalidData"));
        return;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        },
      );

      if (resetError) {
        console.error("Reset password error:", resetError);
        setError(t("auth.authError"));
      } else {
        setEmailSent(true);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(t("auth.authError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        setError(t("auth.errorPasswordsNotMatch"));
        return;
      }

      // Validate password requirements
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        setError(t("auth.errorPasswordRequirements"));
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        setError(t("auth.errorOccurredUpdating"));
      } else {
        setResetSuccess(true);

        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login?success=password_reset");
        }, 3000);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError(t("auth.errorOccurredUpdating"));
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Request reset email
  if (step === "request") {
    return (
      <section className="bg-cream relative max-w-full min-h-screen flex flex-col">
        <Navbar />

        <div className="w-full max-w-3xl m-auto px-2 pt-4 pb-12">
          <div className="w-full space-y-8 p-8 rounded-2xl bg-cream border-2 border-gray-600">
            <div className="text-center">
              <h1 className="text-black text-center w-full font-medium text-3xl lg:text-5xl mb-4">
                {t("auth.requestPasswordReset")}
              </h1>
              <p className="text-gray-600 text-lg">
                {t("auth.enterEmailForReset")}
              </p>
            </div>

            {!emailSent ? (
              <>
                <form className="flex flex-col" onSubmit={handleRequestReset}>
                  {error && (
                    <div className="text-red-500 text-center p-3 bg-red-50 rounded">
                      {error}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <label
                      htmlFor="email"
                      className="text-black text-lg font-medium mb-2"
                    >
                      {t("auth.email")}
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="
                        block
                        w-full
                        my-4
                        px-6
                        py-3
                        bg-white
                        border-2
                        border-gray-300
                        rounded-2xl
                        text-xl
                        shadow-sm
                        text-black
                        focus:border-gray-500
                        focus:ring
                        focus:ring-gray-200"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div className="w-full items-center justify-center flex mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="relative w-[300px] bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 transition px-6 text-xl inline-flex h-12 items-center justify-center rounded-[40px] font-medium text-white disabled:cursor-not-allowed"
                    >
                      {isLoading ? t("auth.loading") : t("auth.sendResetLink")}
                    </button>
                  </div>
                </form>

                <div className="text-center">
                  <a
                    href="/login"
                    className="text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    {t("auth.returnToLogin")}
                  </a>
                </div>
              </>
            ) : (
              <div className="text-center space-y-6">
                <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">
                  <h3 className="text-xl font-semibold mb-2">
                    {t("auth.emailSentSuccess")}
                  </h3>
                  <p className="text-green-600">
                    {t("auth.emailSentSuccessDesc")} <strong>{email}</strong>
                  </p>
                </div>

                <div className="text-gray-600">
                  <p>{t("auth.checkEmailAndClick")}</p>
                  <p className="text-sm mt-2">{t("auth.dontSeeEmail")}</p>
                </div>

                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                      setError(null);
                    }}
                    className="text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    {t("auth.tryDifferentEmail")}
                  </button>

                  <a
                    href="/login"
                    className="text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    {t("auth.returnToLogin")}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </section>
    );
  }

  // Step 2: Reset password form (when user comes from email link)
  return (
    <section className="bg-cream relative max-w-full min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full max-w-3xl m-auto px-2 pt-4 pb-12">
        <div className="w-full space-y-8 p-8 rounded-2xl bg-cream border-2 border-gray-600">
          <div className="text-center">
            <h1 className="text-black text-center w-full font-medium text-3xl lg:text-5xl mb-4">
              {t("auth.setNewPassword")}
            </h1>
            <p className="text-gray-600 text-lg">
              {t("auth.enterNewPasswordBelow")}
            </p>
          </div>

          {!resetSuccess ? (
            <>
              <form className="flex flex-col" onSubmit={handlePasswordReset}>
                {error && (
                  <div className="text-red-500 text-center p-3 bg-red-50 rounded">
                    {error}
                  </div>
                )}

                <div className="flex flex-col">
                  <label
                    htmlFor="password"
                    className="text-black text-lg font-medium mb-2"
                  >
                    {t("auth.enterNewPassword")}
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="
                      block
                      w-full
                      my-4
                      px-6
                      py-3
                      bg-white
                      border-2
                      border-gray-300
                      rounded-2xl
                      text-xl
                      shadow-sm
                      text-black
                      focus:border-gray-500
                      focus:ring
                      focus:ring-gray-200"
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    htmlFor="confirmPassword"
                    className="text-black text-lg font-medium mb-2"
                  >
                    {t("auth.confirmPassword")}
                  </label>
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="
                      block
                      w-full
                      my-4
                      px-6
                      py-3
                      bg-white
                      border-2
                      border-gray-300
                      rounded-2xl
                      text-xl
                      shadow-sm
                      text-black
                      focus:border-gray-500
                      focus:ring
                      focus:ring-gray-200"
                  />
                </div>

                <div className="flex justify-end">
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <p className="text-sm text-gray-600">
                      {showPassword
                        ? t("auth.hidePassword")
                        : t("auth.showPassword")}
                    </p>
                  </div>
                </div>

                <div className="w-full items-center justify-center flex mt-6">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="relative w-[300px] bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 transition px-6 text-xl inline-flex h-12 items-center justify-center rounded-[40px] font-medium text-white disabled:cursor-not-allowed"
                  >
                    {isLoading ? t("auth.loading") : t("auth.updatePassword")}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="bg-green-100 text-green-700 px-6 py-4 rounded-xl">
                <h3 className="text-xl font-semibold mb-2">
                  {t("auth.successPasswordUpdated")}
                </h3>
                <p className="text-green-600">
                  {t("auth.passwordSuccessfullyUpdated")}
                </p>
              </div>

              <div className="text-gray-600">
                <p>{t("auth.redirectingToLogin")}</p>
              </div>

              <div className="flex justify-center">
                <a
                  href="/login"
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-full text-lg font-medium transition"
                >
                  {t("auth.returnToLogin")}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </section>
  );
}
