// Script para resetear rate limit y limpiar cache
import { clearProgressCache } from './hooks/useRoutineAccess';

console.log('🔄 Resetting rate limit and clearing cache...');

// Limpiar cache del hook
clearProgressCache();

// Hacer una llamada simple para resetear rate limit
fetch('/api/test/reset-rate-limit', { method: 'POST' })
  .then(response => {
    console.log('✅ Rate limit reset response:', response.status);
  })
  .catch(error => {
    console.error('❌ Error resetting rate limit:', error);
  });

console.log('🏁 Reset completed!');
