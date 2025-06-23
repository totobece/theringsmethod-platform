'use server'

import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
  try {
    // Log inicial para confirmar que la API está siendo llamada
    console.log('🔵 Magic Link API - POST request recibido')
    console.log('🔵 Request URL:', request.url)
    console.log('🔵 Request method:', request.method)
    
    // Log de todos los headers
    console.log('🔵 Request headers:')
    request.headers.forEach((value, key) => {
      console.log(`   ${key}: ${value}`)
    })
    
    // Obtener el texto crudo del body primero
    const rawBody = await request.text()
    console.log('🔵 JSON RECIBIDO (raw):', rawBody)
    console.log('🔵 Tamaño del body:', rawBody.length, 'caracteres')
    
    // Intentar parsear el JSON
    let parsedBody
    try {
      parsedBody = JSON.parse(rawBody)
      console.log('🔵 JSON PARSEADO:', JSON.stringify(parsedBody, null, 2))
    } catch (parseError) {
      console.error('❌ Error parseando JSON:', parseError)
      return new Response(JSON.stringify({ 
        error: "Invalid JSON format",
        received: rawBody
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // Extraer email y redirectTo del JSON parseado
    const { email, redirectTo } = parsedBody
    console.log('🔵 Email extraído:', email)
    console.log('🔵 RedirectTo extraído:', redirectTo)
    
    if (!email) {
      console.error('❌ Email faltante en el request')
      return new Response(JSON.stringify({ 
        error: "Email is required",
        received: parsedBody
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    console.log('🔵 Enviando magic link a email:', email)
    
    const supabase = await createClient()
    
    // Intenta enviar magic link; si no existe usuario, primero registrarlo y reenviar
    const sendMagicLink = () => {
      console.log('🔵 Ejecutando sendMagicLink...')
      return supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'https://8a86-2802-8010-9545-a100-fb0d-e8e9-3d82-3922.ngrok-free.app/create-password',
          data: {
            source: 'gohighlevel_30day_challenge',
            challenge_type: '30_day_challenge',
            created_via: 'magic_link',
            trial_start_date: new Date().toISOString(),
            trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 días
          }
        }
      })
    }
    
    // primer intento
    console.log('🔵 Primer intento de envío...')
    let { data, error } = await sendMagicLink()
    
    if (error?.message?.includes('User not found') || error?.code === 'user_not_found') {
      console.log('🔵 Usuario no encontrado, creando nuevo usuario...')
      // crear usuario para luego usar plantilla de Magic Link
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ 
        email, 
        password: crypto.randomUUID(), // temporary password that won't be used
        options: {
          data: {
            source: 'gohighlevel_30day_challenge',
            challenge_type: '30_day_challenge',
            created_via: 'magic_link',
            trial_start_date: new Date().toISOString(),
            trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      })
      
      console.log('🔵 Resultado de signUp:', signUpData)
      console.log('🔵 Error de signUp:', signUpError)
      
      if (signUpError) {
        console.error('❌ Error creando usuario:', signUpError)
        return new Response(JSON.stringify({ 
          error: `Error creating user: ${signUpError.message}`,
          code: signUpError.code 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      
      // Esperar un poco antes del segundo intento
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('🔵 Segundo intento de envío...')
      ;({ data, error } = await sendMagicLink())
    }
    
    console.log('🔵 Resultado de Supabase signInWithOtp:')
    console.log('🔵 Data:', JSON.stringify(data, null, 2))
    console.log('🔵 Error:', error)

    if (error) {
      console.error('❌ Error enviando magic link:', error.message)
      return new Response(JSON.stringify({ 
        error: error.message,
        received: parsedBody 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    console.log('✅ Magic link enviado exitosamente a:', email)
    
    return new Response(JSON.stringify({ 
      success: true,
      message: "Magic link sent successfully",
      email: email,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error: unknown) {
    console.error('❌ Error inesperado en magic link API:', error)
    let message = "An unknown error occurred"
    if (error instanceof Error) {
      message = error.message
    }
    
    return new Response(JSON.stringify({ 
      error: message,
      details: error instanceof Error ? error.message : String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// GET endpoint para testing
export async function GET() {
  return new Response(JSON.stringify({ 
    message: "Magic Link API is working",
    endpoints: {
      POST: "Send magic link to user",
      required_fields: ["email"],
      optional_fields: ["redirectTo"]
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
