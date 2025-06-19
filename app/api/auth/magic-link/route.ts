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
    const sendMagicLink = () => supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: 'https://d596-2800-810-495-599a-1cb2-f1aa-b11-b17d.ngrok-free.app/create-password',
        data: {
          source: 'gohighlevel_30day_challenge',
          challenge_type: '30_day_challenge',
          created_via: 'magic_link'
        }
      }
    })
    // primer intento
    let { data, error } = await sendMagicLink()
    if (error?.message?.includes('User not found')) {
      // crear usuario para luego usar plantilla de Magic Link
      await supabase.auth.signUp({ 
        email, 
        password: crypto.randomUUID() // temporary password that won't be used
      })
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
