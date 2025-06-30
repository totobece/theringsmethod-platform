'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProgressManager from '@/utils/progress-manager';
import { ProgressData } from '@/utils/progress-logic';
import { User } from '@supabase/supabase-js';

// Variable global para rastrear si ya se inicializó el manager
let isGloballyInitialized = false;

export function useRoutineAccess() {
  const [isLoading, setIsLoading] = useState(false);
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const mountedRef = useRef(true);
  const initializedRef = useRef(false);

  const progressManager = ProgressManager.getInstance();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    // PROTECCIÓN MEJORADA: Solo inicializar UNA VEZ por toda la aplicación
    if (initializedRef.current || isGloballyInitialized) {
      // Si ya está inicializado, solo suscribirse
      const unsubscribe = progressManager.subscribe((data) => {
        if (mountedRef.current) {
          setProgressData(data);
          setIsLoading(false);
        }
      });

      // Verificar si hay datos en cache
      const cachedData = progressManager.getCached();
      if (cachedData && mountedRef.current) {
        setProgressData(cachedData);
        setIsLoading(false);
      }

      return unsubscribe;
    }

    // PREVENIR MÚLTIPLES INICIALIZACIONES SIMULTÁNEAS
    if (isGloballyInitialized) {
      return;
    }

    initializedRef.current = true;
    isGloballyInitialized = true;

    console.log('🎯 useRoutineAccess: FIRST TIME INITIALIZATION');

    const initializeUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (mountedRef.current) {
          setUser(user);
        }
      } catch (error) {
        console.error('❌ useRoutineAccess: Error getting user:', error);
      }
    };

    const loadProgress = async () => {
      if (!mountedRef.current) return;
      
      // Verificar si hay datos en cache primero
      const cachedData = progressManager.getCached();
      if (cachedData) {
        console.log('📄 useRoutineAccess: Using cached data');
        setProgressData(cachedData);
        return;
      }

      // Solo hacer fetch si no hay cache
      setIsLoading(true);
      try {
        const data = await progressManager.getProgress();
        if (mountedRef.current) {
          setProgressData(data);
        }
      } catch (error) {
        console.error('❌ useRoutineAccess: Error loading progress:', error);
      } finally {
        if (mountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Suscribirse a cambios en el progress manager
    const unsubscribe = progressManager.subscribe((data) => {
      if (mountedRef.current) {
        console.log('📡 useRoutineAccess: Received progress update');
        setProgressData(data);
        setIsLoading(false);
      }
    });

    // Inicializar
    initializeUser();
    loadProgress();

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo debe ejecutarse una vez

  const isRoutineUnlocked = (day: number): boolean => {
    if (!progressData) return false;
    return day <= progressData.maxUnlockedDay;
  };

  const isRoutineCompleted = (day: number): boolean => {
    if (!progressData) return false;
    return progressData.progress.some(p => p.routine_day === day && p.completed_at);
  };

  const refreshProgress = async () => {
    console.log('� ProgressManager: Manual refresh requested');
    
    setIsLoading(true);
    try {
      const data = await progressManager.refresh();
      if (mountedRef.current) {
        setProgressData(data);
      }
    } catch (error) {
      console.error('❌ useRoutineAccess: Error refreshing progress:', error);
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Extraer días completados de la estructura de progreso
  const completedDays = progressData?.progress
    .filter(p => p.completed_at)
    .map(p => p.routine_day) || [];

  return {
    isLoading,
    progressData,
    user,
    isRoutineUnlocked,
    isRoutineCompleted,
    refreshProgress,
    maxUnlockedDay: progressData?.maxUnlockedDay || 0,
    completedDays,
  };
}

// Hook específico para páginas de rutina individual
export function useSpecificRoutineAccess(routineDay: number) {
  const baseHook = useRoutineAccess();
  
  // Calcular si tiene acceso a esta rutina específica
  const hasAccess = baseHook.progressData ? routineDay <= baseHook.progressData.maxUnlockedDay : false;
  
  // Verificar si esta rutina específica está completada
  const isCompleted = baseHook.progressData 
    ? baseHook.progressData.progress.some(p => p.routine_day === routineDay && p.completed_at)
    : false;
  
  // Función para marcar esta rutina como completada
  const markAsCompleted = async (): Promise<void> => {
    try {
      const response = await fetch('/api/user/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          routineDay: routineDay,
          action: 'complete'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error completing routine');
      }

      const result = await response.json();
      console.log('✅ Routine completed successfully:', result);
      
      // Refresh progress to reflect changes
      await baseHook.refreshProgress();
      
    } catch (error) {
      console.error('❌ Error marking routine as completed:', error);
      throw error;
    }
  };
  
  return {
    ...baseHook,
    hasAccess,
    routineDay,
    isCompleted,
    markAsCompleted,
  };
}

// Función helper para verificar si una rutina está desbloqueada
export function isRoutineUnlocked(day: number, maxUnlockedDay: number): boolean {
  return day <= maxUnlockedDay;
}

// Función helper para verificar si una rutina está completada
export function isRoutineCompleted(day: number, progressData: ProgressData | null): boolean {
  if (!progressData) return false;
  return progressData.progress.some(p => p.routine_day === day && p.completed_at);
}

// Funciones para limpiar cache (compatibilidad con scripts)
export function clearProgressCache() {
  const manager = ProgressManager.getInstance();
  manager.clearCache();
}

// Función para resetear rate limit (placeholder por compatibilidad)
export function resetRateLimit() {
  console.log('Rate limit reset - placeholder function');
}

// Export default para compatibilidad
export default useRoutineAccess;
