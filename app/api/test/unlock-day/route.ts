import { createClient } from '@/utils/supabase/server';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
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

    const { day } = await request.json();

    if (!day || day < 1 || day > 24) {
      return new Response(JSON.stringify({ error: 'Día inválido (1-24)' }), { 
        status: 400 
      });
    }

    // Desbloquear hasta el día especificado
    const unlockPromises = [];
    for (let i = 1; i <= day; i++) {
      unlockPromises.push(
        supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            routine_day: i,
            unlocked_at: new Date().toISOString()
          })
      );
    }

    await Promise.all(unlockPromises);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `Días 1-${day} desbloqueados para testing` 
    }), { 
      status: 200 
    });

  } catch (error) {
    console.error('Error unlocking days:', error);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { 
      status: 500 
    });
  }
}
