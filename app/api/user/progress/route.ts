import { createClient } from '@/utils/supabase/server';
import { calculateUnlockedRoutines } from '@/utils/progress-logic';

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

    // Obtener metadata del usuario
    const userMetadata = user.user_metadata || {};
    
    // Calcular rutinas desbloqueadas basado en la fecha de inicio
    const { maxUnlockedDay, totalDays, daysSinceStart } = calculateUnlockedRoutines(userMetadata);
    
    // Obtener progreso actual del usuario desde la base de datos
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

    return new Response(JSON.stringify({
      maxUnlockedDay,
      totalDays,
      daysSinceStart,
      progress: progress || [],
      userStatus: userMetadata.challenge_type || 'unknown',
      userId: user.id
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in progress API:', error);
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

    // Verificar que el usuario tenga acceso a esta rutina
    const userMetadata = user.user_metadata || {};
    const { maxUnlockedDay } = calculateUnlockedRoutines(userMetadata);

    if (routineDay > maxUnlockedDay) {
      return new Response(JSON.stringify({ error: 'Routine not unlocked yet' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'complete') {
      // Marcar rutina como completada
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          routine_day: routineDay,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,routine_day'
        });

      if (error) {
        console.error('Error completing routine:', error);
        return new Response(JSON.stringify({ error: 'Error completing routine' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ success: true, action: 'completed' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in progress POST:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
