"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "es";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface TranslationData {
  [key: string]: string | TranslationData;
}

// Traducciones de emergencia para evitar mostrar claves durante la carga
const fallbackTranslations: Record<Locale, TranslationData> = {
  en: {
    common: {
      loading: "Loading...",
      locked: "Locked",
      unlocked: "Unlocked",
      noPreview: "No preview",
      exploreRingsMethod: "Explore the Rings Method experience",
      couldntFind: "Couldn't find",
      trySearchAgain:
        "Try searching again using a different spelling or keyword",
    },
    dynamicContent: {
      unlocksIn: "Unlocks in {{count}} days",
      unlocksTomorrow: "Unlocks tomorrow",
    },
    auth: {
      login: "Login",
      signup: "Sign Up",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm your new password",
      enterNewPassword: "Enter your new password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      resetPassword: "Reset your password",
      setNewPassword: "Set a new password",
      forgotPassword: "Forgot your password?",
      requestPasswordReset: "Request Password Reset",
      enterEmailForReset: "Enter your email address",
      sendResetLink: "Send Reset Link",
      emailSentSuccess: "Check your email for reset instructions",
      returnToLogin: "Return to Login",
      updatePassword: "Update Password",
      successPasswordUpdated: "Success! Your password has been updated",
      loading: "Loading...",
      linkExpired:
        "The verification link has expired or was already used. Please request a new link.",
      authError: "An error occurred during authentication. Please try again.",
      invalidData: "Please provide a valid email and password.",
      errorPasswordsNotMatch: "Passwords do not match",
      errorPasswordRequirements:
        "Password must be at least 6 characters, contain at least one uppercase letter, and at least one digit.",
      errorOccurredUpdating: "An error occurred while updating the password",
      passwordResetSuccess:
        "Password reset successfully! You can now login with your new password.",
    },
  },
  es: {
    common: {
      loading: "Cargando...",
      locked: "Bloqueado",
      unlocked: "Desbloqueado",
      noPreview: "Sin vista previa",
      exploreRingsMethod: "Explora la experiencia del Método de Anillas",
      couldntFind: "No se pudo encontrar",
      trySearchAgain:
        "Intenta buscar de nuevo usando una ortografía o palabra clave diferente",
    },
    dynamicContent: {
      unlocksIn: "Se desbloquea en {{count}} días",
      unlocksTomorrow: "Se desbloquea mañana",
    },
    auth: {
      login: "Iniciar Sesión",
      signup: "Registrarse",
      email: "Correo Electrónico",
      password: "Contraseña",
      confirmPassword: "Confirmar tu nueva contraseña",
      enterNewPassword: "Ingresa tu nueva contraseña",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña",
      resetPassword: "Restablecer Contraseña",
      setNewPassword: "Establece una nueva contraseña",
      forgotPassword: "¿Olvidaste tu contraseña?",
      requestPasswordReset: "Solicitar Restablecimiento de Contraseña",
      enterEmailForReset: "Ingresa tu dirección de correo electrónico",
      sendResetLink: "Enviar Enlace de Restablecimiento",
      emailSentSuccess:
        "Revisa tu correo para las instrucciones de restablecimiento",
      returnToLogin: "Volver al Login",
      updatePassword: "Actualizar Contraseña",
      successPasswordUpdated: "¡Éxito! Tu contraseña ha sido actualizada",
      loading: "Cargando...",
      linkExpired:
        "El enlace de verificación ha expirado o ya fue usado. Por favor, solicita un nuevo enlace.",
      authError:
        "Ocurrió un error durante la autenticación. Por favor, intenta de nuevo.",
      invalidData: "Por favor proporciona un email y contraseña válidos.",
      errorPasswordsNotMatch: "Las contraseñas no coinciden",
      errorPasswordRequirements:
        "La contraseña debe tener al menos 6 caracteres, contener al menos una letra mayúscula y al menos un dígito.",
      errorOccurredUpdating: "Ocurrió un error al actualizar la contraseña",
      passwordResetSuccess:
        "¡Contraseña restablecida exitosamente! Ahora puedes iniciar sesión con tu nueva contraseña.",
    },
  },
};

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);

  // Cargar traducciones
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${locale}/common.json`);
        if (response.ok) {
          const data = await response.json();
          setTranslations(data);
        } else {
          console.warn(
            `Failed to load translations for ${locale}, using fallback`,
          );
          setTranslations(fallbackTranslations[locale]);
        }
      } catch (error) {
        console.error("Error loading translations:", error);
        setTranslations(fallbackTranslations[locale]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  // Sincronizar con localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocaleState(savedLocale);
    } else {
      setIsLoading(false); // Si no hay locale guardado, dejar de cargar
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  // Función de traducción mejorada
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".");
    let value: string | TranslationData | undefined = translations;

    // Si las traducciones aún están cargando, usar fallback
    if (isLoading || Object.keys(translations).length === 0) {
      let fallbackValue: string | TranslationData | undefined =
        fallbackTranslations[locale];
      for (const k of keys) {
        if (typeof fallbackValue === "object" && fallbackValue !== null) {
          fallbackValue = fallbackValue[k];
        } else {
          fallbackValue = undefined;
          break;
        }
      }
      if (typeof fallbackValue === "string") {
        if (params) {
          return fallbackValue.replace(
            /\{\{(\w+)\}\}/g,
            (match: string, paramKey: string) => {
              return params[paramKey]?.toString() || match;
            },
          );
        }
        return fallbackValue;
      }
    }

    // Buscar en las traducciones principales
    for (const k of keys) {
      if (typeof value === "object" && value !== null) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }

    if (typeof value !== "string") {
      // Si no se encuentra, intentar en fallback
      let fallbackValue: string | TranslationData | undefined =
        fallbackTranslations[locale];
      for (const k of keys) {
        if (typeof fallbackValue === "object" && fallbackValue !== null) {
          fallbackValue = fallbackValue[k];
        } else {
          fallbackValue = undefined;
          break;
        }
      }

      if (typeof fallbackValue === "string") {
        if (params) {
          return fallbackValue.replace(
            /\{\{(\w+)\}\}/g,
            (match: string, paramKey: string) => {
              return params[paramKey]?.toString() || match;
            },
          );
        }
        return fallbackValue;
      }

      // Durante el build, devolver una versión legible de la clave
      if (typeof window === "undefined") {
        return keys[keys.length - 1] || key;
      }

      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      // Devolver el último segmento de la clave en lugar de la clave completa
      return keys[keys.length - 1] || key;
    }

    // Reemplazar parámetros si existen
    if (params) {
      return value.replace(
        /\{\{(\w+)\}\}/g,
        (match: string, paramKey: string) => {
          return params[paramKey]?.toString() || match;
        },
      );
    }

    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isLoading }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export default I18nContext;
