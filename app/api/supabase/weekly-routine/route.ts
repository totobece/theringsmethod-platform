import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Variable global para trackear la semana actual (se reinicia con cada deploy)
let currentWeek = 1

export async function GET() {
  try {
    console.log('📖 GET - Obteniendo semana actual...')
    
    const supabase = await createClient()
    
    // Obtener todas las rutinas organizadas por semana
    const { data: allRoutines, error } = await supabase
      .from('posts')
      .select('*')
      .order('week', { ascending: true })
    
    if (error) {
      console.error('❌ Error obteniendo rutinas:', error)
      return NextResponse.json({ error: 'Error fetching routines' }, { status: 500 })
    }

    if (!allRoutines || allRoutines.length === 0) {
      return NextResponse.json({ error: 'No routines available' }, { status: 404 })
    }

    // Verificar que la semana actual esté en el rango válido (1-4)
    if (currentWeek < 1 || currentWeek > 4) {
      currentWeek = 1
    }

    // Obtener las rutinas de la semana actual
    const currentWeekRoutines = allRoutines.filter(routine => routine.week === currentWeek)
    
    console.log(`📊 Semana actual: ${currentWeek}, Rutinas: ${currentWeekRoutines.length}`)
    
    return NextResponse.json({
      success: true,
      currentWeek: currentWeek,
      routines: currentWeekRoutines,
      totalWeeks: 4,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en GET:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔄 POST - Cambiando a siguiente semana...')
    
    // Verificar autorización (opcional, como en daily-routine)
    const userAgent = request.headers.get('User-Agent')
    const isFromCron = userAgent === 'GitHub-Actions-Cron'
    const isManualRotation = userAgent === 'Manual-Rotation'
    
    console.log(`🔍 User-Agent: ${userAgent}`)
    console.log(`🤖 From Cron: ${isFromCron}, Manual: ${isManualRotation}`)
    
    const supabase = await createClient()
    
    // Obtener todas las rutinas para verificar las semanas disponibles
    const { data: allRoutines, error } = await supabase
      .from('posts')
      .select('*')
      .order('week', { ascending: true })
    
    if (error) {
      console.error('❌ Error obteniendo rutinas:', error)
      return NextResponse.json({ error: 'Error fetching routines' }, { status: 500 })
    }

    if (!allRoutines || allRoutines.length === 0) {
      return NextResponse.json({ error: 'No routines available' }, { status: 404 })
    }

    const previousWeek = currentWeek
    const previousWeekRoutines = allRoutines.filter(routine => routine.week === previousWeek)
    
    // Cambiar a la siguiente semana (1→2→3→4→1)
    currentWeek = currentWeek >= 4 ? 1 : currentWeek + 1
    
    const newWeekRoutines = allRoutines.filter(routine => routine.week === currentWeek)
    
    console.log(`🔄 Cambiado de Semana ${previousWeek} a Semana ${currentWeek}`)
    console.log(`📊 Rutinas anteriores: ${previousWeekRoutines.length}, Nuevas rutinas: ${newWeekRoutines.length}`)
    
    return NextResponse.json({
      success: true,
      message: `Weekly routine rotated successfully to week ${currentWeek}`,
      previousWeek: {
        week: previousWeek,
        routines: previousWeekRoutines.length,
        firstRoutine: previousWeekRoutines[0]?.title || 'N/A'
      },
      currentWeek: currentWeek,
      routines: newWeekRoutines,
      totalWeeks: 4,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en POST:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
