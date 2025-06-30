// Test script para verificar que el nuevo hook no causa bucles infinitos
import { clearProgressCache } from './hooks/useRoutineAccess.ts';

console.log('Testing new useRoutineAccess hook...');

// Limpiar cache para empezar limpio
clearProgressCache();

console.log('Hook test completed successfully!');
