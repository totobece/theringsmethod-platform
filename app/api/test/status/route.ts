import { createClient } from '@/utils/supabase/server';

export async function GET() {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return new Response(JSON.stringify({ error: 'Only available in development' }), { 
      status: 403 
    });
  }

  try {
    const supabase = await createClient();
    
    // Ver el estado actual del usuario
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        message: 'No hay usuario autenticado',
        suggestion: 'Primero debes hacer login'
      }), { 
        status: 200 
      });
    }

    // Obtener progreso actual del usuario
    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('routine_day');

    // Calcular días desbloqueados basado en metadata
    const userMetadata = user.user_metadata;
    const startDate = new Date(userMetadata.trial_start_date || userMetadata.created_at || Date.now());
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const daysSinceStart = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const maxUnlockedDay = Math.max(1, Math.min(daysSinceStart + 1, 24));

    return new Response(JSON.stringify({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        metadata: userMetadata
      },
      progress: {
        daysInProgress: progress?.length || 0,
        progressRecords: progress || [],
        calculatedMaxUnlockedDay: maxUnlockedDay,
        daysSinceStart
      }
    }), { 
      status: 200 
    });

  } catch (error) {
    console.error('Error checking status:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { 
      status: 500 
    });
  }
}
