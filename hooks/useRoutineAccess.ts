'use client';

import { useState, useEffect, useRef } from 'react';
import { ProgressData } from '@/utils/progress-logic';

interface UseRoutineAccessReturn {
  hasAccess: boolean;
  isLoading: boolean;
  progressData: ProgressData | null;
  error: string | null;
  refreshProgress: () => void;
}

// Cache global para evitar requests múltiples
let globalProgressCache: ProgressData | null = null;
let globalCacheTimestamp: number = 0;
const CACHE_DURATION = 10000; // Reducir a 10 segundos para debugging

// Función para limpiar el cache manualmente (útil para debugging)
export const clearProgressCache = () => {
  globalProgressCache = null;
  globalCacheTimestamp = 0;
  console.log('🗑️ Progress cache cleared');
};

export const useRoutineAccess = (routineDay?: number): UseRoutineAccessReturn => {
  const [progressData, setProgressData] = useState<ProgressData | null>(globalProgressCache);
  const [isLoading, setIsLoading] = useState(!globalProgressCache);
  const [error, setError] = useState<string | null>(null);
  const fetchingRef = useRef(false);

  const fetchProgress = async () => {
    // Evitar requests múltiples simultáneos
    if (fetchingRef.current) {
      return;
    }

    // Usar cache si es reciente (menos de 30 segundos)
    const now = Date.now();
    if (globalProgressCache && (now - globalCacheTimestamp) < CACHE_DURATION) {
      setProgressData(globalProgressCache);
      setIsLoading(false);
      return;
    }

    try {
      fetchingRef.current = true;
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user/progress', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Actualizar cache global
      globalProgressCache = data;
      globalCacheTimestamp = now;
      setProgressData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching progress';
      setError(errorMessage);
      console.error('Error fetching user progress:', err);
    } finally {
      setIsLoading(false);
      fetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const hasAccess = routineDay ? 
    (progressData ? routineDay <= progressData.maxUnlockedDay : false) : 
    true;

  // Debug adicional para casos problemáticos
  if (routineDay && progressData) {
    console.log(`🔍🔍 DETAILED ACCESS CHECK for day ${routineDay}:`, {
      routineDay,
      maxUnlockedDay: progressData.maxUnlockedDay,
      hasAccess,
      calculation: `${routineDay} <= ${progressData.maxUnlockedDay} = ${routineDay <= progressData.maxUnlockedDay}`,
      progressDataTimestamp: new Date().toISOString(),
      cacheAge: globalCacheTimestamp ? `${Date.now() - globalCacheTimestamp}ms` : 'no cache'
    });
  }

  const refreshProgress = () => {
    // Limpiar cache para forzar refresh
    globalProgressCache = null;
    globalCacheTimestamp = 0;
    console.log('🔄 Force refreshing progress - cache cleared');
    fetchProgress();
  };

  return {
    hasAccess,
    isLoading,
    progressData,
    error,
    refreshProgress
  };
};

// Hook específico para verificar acceso a una rutina individual
export const useSpecificRoutineAccess = (routineDay: number) => {
  const { hasAccess, isLoading, progressData, error, refreshProgress } = useRoutineAccess(routineDay);

  // Debug: log the state when it changes
  useEffect(() => {
    console.log(`🔍 useSpecificRoutineAccess(${routineDay}) Debug:`, {
      routineDay,
      hasAccess,
      isLoading,
      maxUnlockedDay: progressData?.maxUnlockedDay,
      progressDataExists: !!progressData,
      cacheAge: globalCacheTimestamp ? Date.now() - globalCacheTimestamp : 'no cache',
      progressSample: progressData?.progress?.slice(0, 5)?.map(p => ({
        day: p.routine_day,
        unlocked_at: p.unlocked_at,
        completed_at: p.completed_at
      })),
      timestamp: new Date().toISOString()
    });
  }, [routineDay, hasAccess, isLoading, progressData]);

  const markAsCompleted = async () => {
    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routineDay,
          action: 'complete'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark routine as completed');
      }

      // Refresh progress after marking as completed
      refreshProgress();
    } catch (err) {
      console.error('Error marking routine as completed:', err);
      throw err;
    }
  };

  const isCompleted = progressData?.progress.find(p => p.routine_day === routineDay)?.completed_at !== null;

  return {
    hasAccess,
    isLoading,
    error,
    markAsCompleted,
    isCompleted,
    progressData,
    refreshProgress
  };
};
