'use client';

import { useI18n } from '@/contexts/I18nContext';

export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();

  const languages = [
    { code: 'en', label: 'EN' },
    { code: 'es', label: 'ES' },
  ];

  return (
    <div className="flex bg-white/5 border border-white/10 rounded-[30px] p-[3px] gap-[2px]">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLocale(lang.code as 'en' | 'es')}
          className={`px-[11px] py-[5px] rounded-[25px] text-[10px] font-bold tracking-[0.5px] uppercase border-none transition-all duration-200 ${
            locale === lang.code
              ? 'bg-pink text-white shadow-[0_2px_10px_rgba(255,107,157,0.4)]'
              : 'bg-transparent text-trm-muted hover:text-white hover:bg-[rgba(255,107,157,0.15)]'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
