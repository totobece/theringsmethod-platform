import { extractDayNumberFromString } from './progress-logic';

export interface GifData {
  name: string;
  url: string;
  day: number;
}

// Cache de gifs para evitar múltiples requests
let gifsCache: GifData[] | null = null;
let gifsCacheTimestamp = 0;
const GIFS_CACHE_DURATION = 60000; // 1 minuto

/**
 * Obtiene la URL de gif para un día específico
 */
export async function getGifForDay(day: number): Promise<string | null> {
  try {
    // Intentar usar cache primero
    if (gifsCache && Date.now() - gifsCacheTimestamp < GIFS_CACHE_DURATION) {
      const gif = gifsCache.find(g => g.day === day);
      return gif?.url || null;
    }

    // Hacer request directo para el día específico
    const response = await fetch(`/api/supabase/gifs?day=${day}`);
    if (!response.ok) {
      console.warn(`No se pudo obtener gif para día ${day}`);
      return null;
    }

    const data = await response.json();
    return data.url || null;
  } catch (error) {
    console.error(`Error obteniendo gif para día ${day}:`, error);
    return null;
  }
}

/**
 * Obtiene la URL de gif para una rutina basada en su propiedad 'day'
 */
export async function getGifForRoutine(routine: { day: string }): Promise<string | null> {
  const dayNumber = extractDayNumberFromString(routine.day);
  return getGifForDay(dayNumber);
}

/**
 * Obtiene todos los gifs y los guarda en cache
 */
export async function getAllGifs(): Promise<GifData[]> {
  try {
    // Usar cache si está disponible y fresco
    if (gifsCache && Date.now() - gifsCacheTimestamp < GIFS_CACHE_DURATION) {
      return gifsCache;
    }

    const response = await fetch('/api/supabase/gifs');
    if (!response.ok) {
      throw new Error('Error fetching gifs');
    }

    const data = await response.json();
    gifsCache = Array.isArray(data) ? data : [];
    gifsCacheTimestamp = Date.now();
    
    return gifsCache;
  } catch (error) {
    console.error('Error obteniendo todos los gifs:', error);
    return [];
  }
}

/**
 * Limpia el cache de gifs
 */
export function clearGifsCache() {
  gifsCache = null;
  gifsCacheTimestamp = 0;
}

/**
 * Busca un gif en un array de gifs basado en el día de la rutina
 */
export function findGifForRoutine(gifs: GifData[], routine: { day: string }): GifData | null {
  const dayNumber = extractDayNumberFromString(routine.day);
  return gifs.find(g => g.day === dayNumber) || null;
}
