import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 [ADMIN API] Inicio de petición extend-trial')

    // Cliente normal para verificar el admin actual
    const supabase = await createClient()

    // 1. Verificar que el usuario que hace la petición es admin
    const { data: { user: adminUser }, error: adminError } = await supabase.auth.getUser()
    console.log('🔵 [ADMIN API] Usuario obtenido:', adminUser?.email)

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Verificar rol de admin
    if (adminUser.user_metadata?.role !== 'admin') {
      console.warn(`❌ Intento de acceso no autorizado al panel admin por: ${adminUser.email}`)
      return NextResponse.json(
        { error: 'No tienes permisos para realizar esta acción' },
        { status: 403 }
      )
    }

    // 2. Obtener datos del request
    const { email, additionalDays } = await request.json()
    console.log('🔵 [ADMIN API] Datos recibidos:', { email, additionalDays })

    // Validaciones
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    if (!additionalDays || typeof additionalDays !== 'number' || additionalDays < 1 || additionalDays > 365) {
      return NextResponse.json(
        { error: 'Días adicionales debe ser un número entre 1 y 365' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.trim().toLowerCase()
    console.log('🔵 [ADMIN API] Email normalizado:', normalizedEmail)

    // 3. Crear cliente admin con Service Role Key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    console.log('🔵 [ADMIN API] Service Key disponible:', !!supabaseServiceKey)

    if (!supabaseServiceKey) {
      console.error('❌ SUPABASE_SERVICE_ROLE_KEY no configurada')
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta' },
        { status: 500 }
      )
    }

    const adminClient = createAdminClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
    console.log('🔵 [ADMIN API] Cliente admin creado')

    // 4. Buscar al usuario por email usando GoTrue Admin API directamente
    console.log('🔵 [ADMIN API] Buscando usuario por email via GoTrue API...')

    const gotrueResponse = await fetch(
      `${supabaseUrl}/auth/v1/admin/users?page=1&per_page=1000`,
      {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
        },
      }
    )

    if (!gotrueResponse.ok) {
      console.error('❌ Error en GoTrue API:', gotrueResponse.status)
      return NextResponse.json(
        { error: 'Error al buscar usuario' },
        { status: 500 }
      )
    }

    const gotrueData = await gotrueResponse.json()
    const users = gotrueData.users || gotrueData

    const targetUser = Array.isArray(users)
      ? users.find((u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail)
      : null

    if (!targetUser) {
      // Fallback: paginate if user not found in first page
      let foundUser = null
      let page = 2
      const totalPages = Math.ceil((gotrueData.total || 0) / 1000)

      while (!foundUser && page <= totalPages) {
        const pageResponse = await fetch(
          `${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=1000`,
          {
            headers: {
              'Authorization': `Bearer ${supabaseServiceKey}`,
              'apikey': supabaseServiceKey,
            },
          }
        )
        if (!pageResponse.ok) break
        const pageData = await pageResponse.json()
        const pageUsers = pageData.users || pageData
        if (Array.isArray(pageUsers)) {
          foundUser = pageUsers.find((u: { email?: string }) => u.email?.toLowerCase() === normalizedEmail)
        }
        if (!pageUsers || pageUsers.length < 1000) break
        page++
      }

      if (!foundUser) {
        console.log('🔵 [ADMIN API] Usuario no encontrado.')
        return NextResponse.json(
          { error: `Usuario con email ${email} no encontrado` },
          { status: 404 }
        )
      }

      // Use the found user from pagination
      return await updateUserTrial(foundUser, adminClient, additionalDays, adminUser.email!)
    }

    console.log('🔵 [ADMIN API] Usuario encontrado:', targetUser.email)
    return await updateUserTrial(targetUser, adminClient, additionalDays, adminUser.email!)

  } catch (error) {
    console.error('Error en extend-trial API:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

async function updateUserTrial(
  targetUser: { id: string; email?: string; user_metadata?: Record<string, unknown> },
  adminClient: { auth: { admin: { updateUserById: (id: string, attrs: { user_metadata: Record<string, unknown> }) => Promise<{ error: Error | null }> } } },
  additionalDays: number,
  adminEmail: string
) {
  // 5. Calcular nueva fecha de trial
  const currentMetadata = targetUser.user_metadata || {}
  const currentTrialEndDate = currentMetadata.trial_end_date
    ? new Date(currentMetadata.trial_end_date as string)
    : new Date()

  // Si el trial ya expiró, usar fecha actual como base
  const baseDate = currentTrialEndDate > new Date() ? currentTrialEndDate : new Date()

  const newTrialEndDate = new Date(baseDate)
  newTrialEndDate.setDate(newTrialEndDate.getDate() + additionalDays)

  // 6. Actualizar user_metadata con cliente admin
  const { error: updateError } = await adminClient.auth.admin.updateUserById(
    targetUser.id,
    {
      user_metadata: {
        ...currentMetadata,
        trial_end_date: newTrialEndDate.toISOString(),
      }
    }
  )

  if (updateError) {
    console.error('Error actualizando usuario:', updateError)
    return NextResponse.json(
      { error: 'Error al actualizar trial del usuario' },
      { status: 500 }
    )
  }

  // 7. Log de la acción
  console.log(`✅ Trial extendido por admin ${adminEmail}:`)
  console.log(`   - Usuario: ${targetUser.email}`)
  console.log(`   - Días agregados: ${additionalDays}`)
  console.log(`   - Nueva fecha de expiración: ${newTrialEndDate.toISOString()}`)

  return NextResponse.json({
    success: true,
    message: 'Trial extendido exitosamente',
    user: targetUser.email,
    additionalDays,
    newTrialEndDate: newTrialEndDate.toISOString(),
    previousTrialEndDate: (currentMetadata.trial_end_date as string) || null,
  })
}
