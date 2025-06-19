import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// Variable global para trackear el índice actual (se reinicia con cada deploy)
let currentIndex = 0

export async function GET() {
  try {
    console.log('📖 GET - Obteniendo rutina diaria actual...')
    
    const supabase = await createClient()
    
    // Obtener todas las rutinas
    const { data: allRoutines, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error obteniendo rutinas:', error)
      return NextResponse.json({ error: 'Error fetching routines' }, { status: 500 })
    }

    if (!allRoutines || allRoutines.length === 0) {
      return NextResponse.json({ error: 'No routines available' }, { status: 404 })
    }

    // Asegurar que el índice esté dentro del rango
    if (currentIndex >= allRoutines.length) {
      currentIndex = 0
    }

    const currentRoutine = allRoutines[currentIndex]
    
    console.log(`📊 Rutina actual: ${currentRoutine.title} (${currentIndex + 1}/${allRoutines.length})`)
    
    return NextResponse.json({
      routine: currentRoutine,
      currentIndex: currentIndex,
      totalRoutines: allRoutines.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST() {
  try {
    console.log('🔄 POST - Cambiando a siguiente rutina...')
    
    const supabase = await createClient()
    
    // Obtener todas las rutinas
    const { data: allRoutines, error } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error obteniendo rutinas:', error)
      return NextResponse.json({ error: 'Error fetching routines' }, { status: 500 })
    }

    if (!allRoutines || allRoutines.length === 0) {
      return NextResponse.json({ error: 'No routines available' }, { status: 404 })
    }

    const previousIndex = currentIndex
    const previousRoutine = allRoutines[previousIndex]
    
    // Cambiar a la siguiente rutina (con wrap-around)
    currentIndex = (currentIndex + 1) % allRoutines.length
    
    const newRoutine = allRoutines[currentIndex]
    
    console.log(`🔄 Cambiado de "${previousRoutine.title}" a "${newRoutine.title}"`)
    console.log(`📊 Índice: ${previousIndex} → ${currentIndex} (${currentIndex + 1}/${allRoutines.length})`)
    
    return NextResponse.json({
      success: true,
      message: 'Routine changed successfully',
      previousRoutine: {
        id: previousRoutine.id,
        title: previousRoutine.title,
        episode: previousRoutine.episode,
        index: previousIndex
      },
      newRoutine: {
        id: newRoutine.id,
        title: newRoutine.title,
        episode: newRoutine.episode,
        index: currentIndex
      },
      totalRoutines: allRoutines.length,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error en POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}