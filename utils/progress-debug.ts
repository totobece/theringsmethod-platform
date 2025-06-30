// Script para resetear rate limit y cache desde la consola del navegador
// Ejecutar: window.resetProgressSystem()

import { clearProgressCache, resetRateLimit } from '@/hooks/useRoutineAccess';

declare global {
  interface Window {
    clearProgressCache: () => void;
    resetRateLimit: () => void;
    resetProgressSystem: () => void;
  }
}

if (typeof window !== 'undefined') {
  window.clearProgressCache = clearProgressCache;
  window.resetRateLimit = resetRateLimit;
  window.resetProgressSystem = () => {
    clearProgressCache();
    resetRateLimit();
    console.log('✅ Progress system reset completed');
  };
}

console.log('🔧 Progress system utilities loaded. Available commands:');
console.log('- window.clearProgressCache() - Clear cache');
console.log('- window.resetRateLimit() - Reset rate limit');
console.log('- window.resetProgressSystem() - Reset everything');
