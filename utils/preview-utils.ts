import { extractDayNumberFromString } from './progress-logic';

export interface PreviewData {
  name: string;
  url: string;
  day: number;
}

// Cache de previews para evitar múltiples requests
let previewsCache: PreviewData[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60000; // 1 minuto

/**
 * Obtiene la URL de preview para un día específico
 */
export async function getPreviewForDay(day: number): Promise<string | null> {
  try {
    // Intentar usar cache primero
    if (previewsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      const preview = previewsCache.find(p => p.day === day);
      return preview?.url || null;
    }

    // Hacer request directo para el día específico
    const response = await fetch(`/api/supabase/previews?day=${day}`);
    if (!response.ok) {
      console.warn(`No se pudo obtener preview para día ${day}`);
      return null;
    }

    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error(`Error obteniendo preview para día ${day}:`, error);
    return null;
  }
}

/**
 * Obtiene la URL de preview para una rutina basada en su propiedad 'day'
 */
export async function getPreviewForRoutine(routine: { day: string }): Promise<string | null> {
  const dayNumber = extractDayNumberFromString(routine.day);
  return getPreviewForDay(dayNumber);
}

/**
 * Obtiene todas las previews y las guarda en cache
 */
export async function getAllPreviews(): Promise<PreviewData[]> {
  try {
    // Usar cache si está disponible y fresco
    if (previewsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      return previewsCache;
    }

    const response = await fetch('/api/supabase/previews');
    if (!response.ok) {
      throw new Error('Error fetching previews');
    }

    const data = await response.json();
    previewsCache = Array.isArray(data) ? data : [];
    cacheTimestamp = Date.now();
    
    return previewsCache;
  } catch (error) {
    console.error('Error obteniendo todas las previews:', error);
    return [];
  }
}

/**
 * Limpia el cache de previews
 */
export function clearPreviewsCache() {
  previewsCache = null;
  cacheTimestamp = 0;
}

/**
 * Busca una preview en un array de previews basado en el día de la rutina
 */
export function findPreviewForRoutine(previews: PreviewData[], routine: { day: string }): PreviewData | null {
  const dayNumber = extractDayNumberFromString(routine.day);
  return previews.find(p => p.day === dayNumber) || null;
}
