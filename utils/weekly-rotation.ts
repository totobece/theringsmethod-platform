// Función para obtener la semana actual del servidor
export async function getCurrentWeek(): Promise<number> {
  try {
    const response = await fetch('/api/supabase/weekly-routine', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch current week: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.success && data.currentWeek) {
      return data.currentWeek;
    } else {
      console.warn('Failed to get current week from server, defaulting to week 1');
      return 1;
    }
  } catch (error) {
    console.error('Error fetching current week:', error);
    return 1; // Default fallback
  }
}

// Función para rotar manualmente la semana (solo para testing/admin)
export async function rotateWeek(): Promise<{
  success: boolean;
  currentWeek?: number;
  error?: string;
}> {
  try {
    const response = await fetch('/api/supabase/weekly-routine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Manual-Rotation', // Identificar que es una rotación manual
      },
    });

    const data = await response.json();
    
    return {
      success: data.success || false,
      currentWeek: data.currentWeek,
      error: data.error
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Función para obtener las rutinas de una semana específica
export async function getWeekRoutines(week: number) {
  try {
    const response = await fetch(`/api/supabase/posts?week=${week}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch week ${week} routines: ${response.status}`);
    }

    const data = await response.json();
    return data.posts || [];
  } catch (error) {
    console.error(`Error fetching week ${week} routines:`, error);
    return [];
  }
}

// Función para obtener el progreso de la semana (cuántas rutinas hay en cada semana)
export async function getWeeklyProgress(): Promise<{
  week1: number;
  week2: number;
  week3: number;
  week4: number;
  total: number;
}> {
  try {
    const [week1, week2, week3, week4] = await Promise.all([
      getWeekRoutines(1),
      getWeekRoutines(2),
      getWeekRoutines(3),
      getWeekRoutines(4)
    ]);

    return {
      week1: week1.length,
      week2: week2.length,
      week3: week3.length,
      week4: week4.length,
      total: week1.length + week2.length + week3.length + week4.length
    };
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    return {
      week1: 0,
      week2: 0,
      week3: 0,
      week4: 0,
      total: 0
    };
  }
}
