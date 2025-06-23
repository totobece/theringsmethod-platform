import { createClient } from '@/utils/supabase/server';

export async function POST() {
  // Solo permitir en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return new Response(JSON.stringify({ error: 'Only available in development' }), { 
      status: 403 
    });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Usuario no autenticado' }), { 
        status: 401 
      });
    }

    // Eliminar todo el progreso del usuario
    await supabase
      .from('user_progress')
      .delete()
      .eq('user_id', user.id);

    // Crear solo el día 1
    await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        routine_day: 1,
        unlocked_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Progreso reiniciado - Solo día 1 desbloqueado' 
    }), { 
      status: 200 
    });

  } catch (error) {
    console.error('Error resetting progress:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { 
      status: 500 
    });
  }
}
