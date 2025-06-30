import { createClient } from '@/utils/supabase/server';
import { checkRateLimit } from '@/utils/rate-limiter';

// Circuit breaker simple para evitar bucles infinitos
const circuitBreaker = new Map<string, { count: number, lastReset: number }>();
const MAX_CALLS_PER_MINUTE = 50; // Aumentado de 10 a 50 para múltiples componentes
const RESET_INTERVAL = 60000; // 1 minuto

function checkCircuitBreaker(userId: string): boolean {
  const now = Date.now();
  const userState = circuitBreaker.get(userId);
  
  if (!userState) {
    circuitBreaker.set(userId, { count: 1, lastReset: now });
    return true;
  }
  
  // Reset contador si ha pasado el intervalo
  if (now - userState.lastReset > RESET_INTERVAL) {
    circuitBreaker.set(userId, { count: 1, lastReset: now });
    return true;
  }
  
  // Incrementar contador
  userState.count++;
  
  if (userState.count > MAX_CALLS_PER_MINUTE) {
    console.log(`🚨 Circuit breaker triggered for user ${userId}: ${userState.count} calls in last minute`);
    return false;
  }
  
  return true;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Circuit breaker check
    if (!checkCircuitBreaker(user.id)) {
      return new Response(JSON.stringify({ error: 'Circuit breaker: Too many rapid requests' }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Obtener el progreso completo del usuario
    const { data: progress, error: progressError } = await supabase
      .from('user_progress')
      .select('routine_day, completed_at, unlocked_at')
      .eq('user_id', user.id)
      .order('routine_day', { ascending: true });

    if (progressError) {
      console.error('Error fetching user progress:', progressError);
      return new Response(JSON.stringify({ error: 'Error fetching progress' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Si no hay progreso, crear entrada para día 1
    if (!progress || progress.length === 0) {
      console.log(`Creating initial progress for user ${user.id}`);
      
      const { error: insertError } = await supabase
        .from('user_progress')
        .insert({
          user_id: user.id,
          routine_day: 1,
          unlocked_at: new Date().toISOString(),
          completed_at: null
        });

      if (insertError) {
        console.error('Error creating initial progress:', insertError);
        return new Response(JSON.stringify({ error: 'Error creating progress' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Retornar progreso inicial
      return new Response(JSON.stringify({
        maxUnlockedDay: 1,
        currentDay: 1,
        totalRoutines: 24,
        progress: [{
          routine_day: 1,
          completed_at: null,
          unlocked_at: new Date().toISOString()
        }],
        isCompleted: false,
        completionPercentage: 0
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Calcular el día máximo desbloqueado basado en el progreso temporal
    const now = new Date();
    let maxUnlockedDay = 1;

    // Solo debug logging en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 DEBUG: Current time: ${now.toISOString()}`);
      console.log(`🔍 DEBUG: Progress entries: ${progress.length}`);
    }

    for (const entry of progress) {
      if (entry.unlocked_at) {
        const unlockedDate = new Date(entry.unlocked_at);
        const isUnlocked = unlockedDate <= now;
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`🔍 DEBUG: Day ${entry.routine_day} - unlocks at ${unlockedDate.toISOString()} - available: ${isUnlocked}`);
        }
        
        if (isUnlocked) {
          maxUnlockedDay = Math.max(maxUnlockedDay, entry.routine_day);
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 DEBUG: Calculated maxUnlockedDay: ${maxUnlockedDay}`);
    }

    // Determinar el día actual (el día más bajo no completado o el siguiente día si todos están completos)
    const incompleteEntry = progress.find(p => p.completed_at === null);
    const currentDay = incompleteEntry ? incompleteEntry.routine_day : Math.min(progress.length + 1, 24);

    // Calcular estadísticas
    const completedCount = progress.filter(p => p.completed_at !== null).length;
    const isCompleted = completedCount >= 24;
    const completionPercentage = Math.round((completedCount / 24) * 100);

    return new Response(JSON.stringify({
      maxUnlockedDay: Math.min(maxUnlockedDay, 24),
      currentDay: Math.min(currentDay, 24),
      totalRoutines: 24,
      progress: progress || [],
      isCompleted,
      completionPercentage
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in GET /api/user/progress:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { routineDay, action } = await request.json();

    if (!routineDay || !action) {
      return new Response(JSON.stringify({ error: 'Missing routineDay or action' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'complete') {
      // Verificar que el usuario tenga acceso a esta rutina
      const { data: currentProgress } = await supabase
        .from('user_progress')
        .select('routine_day, completed_at, unlocked_at')
        .eq('user_id', user.id)
        .eq('routine_day', routineDay)
        .single();

      if (!currentProgress || !currentProgress.unlocked_at) {
        return new Response(JSON.stringify({ error: 'Routine not unlocked' }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const now = new Date();
      const unlockedDate = new Date(currentProgress.unlocked_at);
      
      if (unlockedDate > now) {
        return new Response(JSON.stringify({ error: 'Routine not yet available' }), { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Verificar si ya está completada
      if (currentProgress.completed_at) {
        return new Response(JSON.stringify({
          success: true,
          message: `Routine ${routineDay} was already completed`,
          alreadyCompleted: true
        }), { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Marcar rutina como completada
      const { error: updateError } = await supabase
        .from('user_progress')
        .update({ completed_at: now.toISOString() })
        .eq('user_id', user.id)
        .eq('routine_day', routineDay);

      if (updateError) {
        console.error('Error updating routine completion:', updateError);
        return new Response(JSON.stringify({ error: 'Error marking routine as completed' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Desbloquear la siguiente rutina (24 horas después)
      const nextDay = routineDay + 1;
      let nextUnlockTime = null;
      
      if (nextDay <= 24) {
        const unlockTime = new Date(now);
        unlockTime.setHours(unlockTime.getHours() + 24); // 24 horas después
        nextUnlockTime = unlockTime.toISOString();

        // Verificar si ya existe entrada para el siguiente día
        const { data: nextDayProgress } = await supabase
          .from('user_progress')
          .select('routine_day')
          .eq('user_id', user.id)
          .eq('routine_day', nextDay)
          .single();

        if (!nextDayProgress) {
          // Crear entrada para el siguiente día
          const { error: insertError } = await supabase
            .from('user_progress')
            .insert({
              user_id: user.id,
              routine_day: nextDay,
              unlocked_at: nextUnlockTime,
              completed_at: null
            });

          if (insertError) {
            console.error('Error creating next day progress:', insertError);
            // No es crítico, la rutina se completó exitosamente
          }
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: `Routine ${routineDay} completed successfully`,
        nextDay: nextDay <= 24 ? nextDay : null,
        nextDayUnlocksAt: nextUnlockTime,
        challengeCompleted: nextDay > 24
      }), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in POST /api/user/progress:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
