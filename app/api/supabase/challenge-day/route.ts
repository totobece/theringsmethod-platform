import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log('📖 GET - Obteniendo estado actual del challenge...')
    
    const supabase = await createClient()
    
    // Obtener el estado actual del challenge
    const { data: challengeState, error } = await supabase
      .from('challenge_state')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (error) {
      console.error('❌ Error obteniendo estado del challenge:', error)
      return NextResponse.json({ error: 'Error fetching challenge state' }, { status: 500 })
    }

    if (!challengeState) {
      return NextResponse.json({ error: 'No active challenge found' }, { status: 404 })
    }

    // Obtener la rutina del día actual si existe
    const { data: currentRoutine, error: routineError } = await supabase
      .from('posts')
      .select('*')
      .ilike('day', `%Day ${challengeState.challenge_day}%`)
      .single()

    if (routineError && routineError.code !== 'PGRST116') {
      console.error('❌ Error obteniendo rutina actual:', routineError)
    }

    console.log(`📊 Challenge Day: ${challengeState.challenge_day}, Calendar Day: ${challengeState.calendar_day}`)
    
    return NextResponse.json({
      success: true,
      challengeState: {
        challengeDay: challengeState.challenge_day,
        calendarDay: challengeState.calendar_day,
        weekDay: challengeState.week_day,
        isActive: challengeState.is_active,
        lastUpdated: challengeState.last_updated
      },
      currentRoutine: currentRoutine || null,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('🔄 POST - Avanzando día del challenge...')
    
    // Verificar autorización (solo GitHub Actions o testing manual)
    const userAgent = request.headers.get('User-Agent')
    const isFromCron = userAgent === 'GitHub-Actions-Cron'
    const isManualAdvance = userAgent === 'Manual-Advance'
    
    if (!isFromCron && !isManualAdvance) {
      const isNgrokUrl = request.url.includes('ngrok-free.app')
      const isDevelopment = process.env.NODE_ENV === 'development'
      
      if (!isDevelopment && !isNgrokUrl) {
        return NextResponse.json({ 
          error: "Unauthorized: This endpoint is only accessible from scheduled jobs or testing" 
        }, { status: 401 })
      }
    }

    const supabase = await createClient()
    
    // Obtener estado actual
    const { data: currentState, error: fetchError } = await supabase
      .from('challenge_state')
      .select('*')
      .eq('is_active', true)
      .single()
    
    if (fetchError || !currentState) {
      console.error('❌ Error obteniendo estado actual:', fetchError)
      return NextResponse.json({ error: 'Error fetching current state' }, { status: 500 })
    }

    let newChallengeDay = currentState.challenge_day
    let newCalendarDay = currentState.calendar_day + 1
    let newWeekDay = (currentState.week_day % 7) + 1

    // Si es domingo (día 7), saltarlo
    if (newWeekDay === 7) {
      console.log('📅 Saltando domingo...')
      newCalendarDay += 1 // Saltar domingo
      newWeekDay = 1 // Lunes
    } else {
      // Solo avanzar el challenge_day si no es domingo
      newChallengeDay += 1
    }

    // Verificar si el challenge ha terminado (24 rutinas completadas)
    if (newChallengeDay > 24) {
      console.log('🏁 Challenge completado! Reseteando...')
      newChallengeDay = 1
      newCalendarDay = 1
      newWeekDay = 1
    }

    // Verificar si hemos pasado los 30 días calendario
    if (newCalendarDay > 30) {
      console.log('📅 30 días completados! Reseteando...')
      newChallengeDay = 1
      newCalendarDay = 1
      newWeekDay = 1
    }

    // Actualizar el estado
    const { error: updateError } = await supabase
      .from('challenge_state')
      .update({
        challenge_day: newChallengeDay,
        calendar_day: newCalendarDay,
        week_day: newWeekDay,
        last_updated: new Date().toISOString()
      })
      .eq('id', currentState.id)

    if (updateError) {
      console.error('❌ Error actualizando estado:', updateError)
      return NextResponse.json({ error: 'Error updating challenge state' }, { status: 500 })
    }

    // Obtener la nueva rutina del día
    const { data: newRoutine, error: routineError } = await supabase
      .from('posts')
      .select('*')
      .ilike('day', `%Day ${newChallengeDay}%`)
      .single()

    if (routineError && routineError.code !== 'PGRST116') {
      console.error('❌ Error obteniendo nueva rutina:', routineError)
    }

    const dayName = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][newWeekDay]

    console.log(`🔄 Avanzado de Día ${currentState.challenge_day} a Día ${newChallengeDay}`)
    console.log(`📅 Día calendario: ${currentState.calendar_day} → ${newCalendarDay} (${dayName})`)
    
    return NextResponse.json({
      success: true,
      message: `Challenge advanced to day ${newChallengeDay}`,
      previousState: {
        challengeDay: currentState.challenge_day,
        calendarDay: currentState.calendar_day,
        weekDay: currentState.week_day
      },
      newState: {
        challengeDay: newChallengeDay,
        calendarDay: newCalendarDay,
        weekDay: newWeekDay,
        dayName: dayName
      },
      newRoutine: newRoutine || null,
      skippedSunday: newWeekDay === 1 && currentState.week_day === 6,
      challengeCompleted: newChallengeDay === 1 && currentState.challenge_day === 24,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
