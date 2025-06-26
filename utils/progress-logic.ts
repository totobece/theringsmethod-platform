export interface UserProgress {
  routine_day: number;
  completed_at: string | null;
  unlocked_at: string;
}

export interface ProgressData {
  maxUnlockedDay: number;
  currentDay: number;
  totalRoutines: number;
  progress: UserProgress[];
  isCompleted: boolean;
  completionPercentage: number;
}

export interface UserMetadata {
  challenge_type?: string;
  created_via?: string;
  trial_start_date?: string;
  created_at?: string;
  [key: string]: unknown;
}

export const calculateUnlockedRoutines = (userMetadata: UserMetadata): { maxUnlockedDay: number; totalDays: number; daysSinceStart: number } => {
  // Obtener fecha de inicio del trial
  const startDate = new Date(userMetadata.trial_start_date || userMetadata.created_at || Date.now());
  const currentDate = new Date();
  
  // Calcular días transcurridos desde el inicio
  const timeDiff = currentDate.getTime() - startDate.getTime();
  const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // El usuario puede acceder hasta el día que corresponde + día actual
  // Mínimo día 1, máximo día 24
  const maxUnlockedDay = Math.max(1, Math.min(daysSinceStart + 1, 24));
  
  return {
    maxUnlockedDay,
    totalDays: 24,
    daysSinceStart: Math.max(0, daysSinceStart)
  };
};

export const extractDayNumberFromString = (dayString: string): number => {
  // Extraer número del string "Day 1", "Day 10", etc.
  const match = dayString.match(/\d+/);
  return match ? parseInt(match[0], 10) : 1;
};

export const getDaysUntilUnlock = (routineDay: number, maxUnlockedDay: number): number => {
  return Math.max(0, routineDay - maxUnlockedDay);
};

export const isRoutineUnlocked = (routineDay: number, maxUnlockedDay: number): boolean => {
  return routineDay <= maxUnlockedDay;
};
