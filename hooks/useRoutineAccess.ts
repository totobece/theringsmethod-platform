'use client';

import { useState, useEffect } from 'react';
import { ProgressData } from '@/utils/progress-logic';

interface UseRoutineAccessReturn {
  hasAccess: boolean;
  isLoading: boolean;
  progressData: ProgressData | null;
  error: string | null;
  refreshProgress: () => void;
}

export const useRoutineAccess = (routineDay?: number): UseRoutineAccessReturn => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = async () => {
    try {
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

      setProgressData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error fetching progress';
      setError(errorMessage);
      console.error('Error fetching user progress:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const hasAccess = routineDay ? 
    (progressData ? routineDay <= progressData.maxUnlockedDay : false) : 
    true;

  return {
    hasAccess,
    isLoading,
    progressData,
    error,
    refreshProgress: fetchProgress
  };
};

// Hook específico para verificar acceso a una rutina individual
export const useSpecificRoutineAccess = (routineDay: number) => {
  const { hasAccess, isLoading, progressData, error, refreshProgress } = useRoutineAccess(routineDay);

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
    progressData
  };
};
