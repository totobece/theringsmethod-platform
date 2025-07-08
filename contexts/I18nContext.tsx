'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Locale = 'en' | 'es';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface TranslationData {
  [key: string]: string | TranslationData;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [translations, setTranslations] = useState<TranslationData>({});

  // Cargar traducciones
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${locale}/common.json`);
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
      }
    };

    loadTranslations();
  }, [locale]);

  // Sincronizar con localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'es')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    
    // Recargar la página para aplicar el nuevo idioma
    // En el futuro podríamos implementar cambio sin recarga
    window.location.reload();
  };

  // Función de traducción
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: string | TranslationData | undefined = translations;
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null) {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
    
    if (typeof value !== 'string') {
      // Durante el build, simplemente devolvemos la clave sin warning
      if (typeof window === 'undefined') {
        return key;
      }
      console.warn(`Translation key "${key}" not found for locale "${locale}"`);
      return key;
    }
    
    // Reemplazar parámetros si existen
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }
    
    return value;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export default I18nContext;
