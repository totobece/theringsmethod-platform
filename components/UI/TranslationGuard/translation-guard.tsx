'use client';

import { useI18n } from '@/contexts/I18nContext';

interface TranslationGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function TranslationGuard({ children, fallback }: TranslationGuardProps) {
  const { isLoading } = useI18n();

  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
