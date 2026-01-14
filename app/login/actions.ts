'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

// Timeout wrapper para evitar requests colgados
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 10000,
  errorMessage: string = 'Request timeout'
): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
  )
  return Promise.race([promise, timeout])
}

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Debugging logs temporales para trazar problemas de login
  try {
    const maybeEmail = formData.get('email')
    if (maybeEmail) console.log('🔵 [LOGIN] Inicio de login para:', maybeEmail)
  } catch (err) {
    console.log('🔵 [LOGIN] Inicio de login (no email disponible)', err)
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate input
  if (!data.email || !data.password) {
    redirect('/login?error=invalid_credentials')
  }

  try {
    // Aplicar timeout de 10 segundos al login
    console.log('🔵 [LOGIN] Llamando a supabase.auth.signInWithPassword')
    const { error } = await withTimeout(
      supabase.auth.signInWithPassword(data),
      10000,
      'Login timeout - please try again'
    )
    console.log('🔵 [LOGIN] Resultado de signInWithPassword recibido')

    if (error) {
      console.error('Login error:', error)
      redirect('/login?error=invalid_credentials')
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    // NEXT_REDIRECT es el comportamiento esperado, no un error
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error('Login timeout or error:', error)
    // Si es timeout, redirigir con mensaje específico
    if (error instanceof Error && error.message?.includes('timeout')) {
      redirect('/login?error=timeout')
    }
    redirect('/login?error=invalid_credentials')
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate input
  if (!data.email || !data.password) {
    redirect('/login?error=invalid_data')
  }

  if (data.password.length < 6) {
    redirect('/login?error=password_too_short')
  }

  try {
    // Aplicar timeout de 15 segundos al signup
    const { error, data: signUpData } = await withTimeout(
      supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: undefined, // No email confirmation
        }
      }),
      15000,
      'Signup timeout - please try again'
    )

    if (error) {
      console.error('Signup error:', error)
      if (error.message.includes('already registered')) {
        redirect('/login?error=user_exists')
      }
      redirect('/login?error=signup_failed')
    }

    // If signup was successful, try to sign them in immediately
    if (signUpData.user && !signUpData.session) {
      const { error: signInError } = await withTimeout(
        supabase.auth.signInWithPassword(data),
        10000,
        'Auto sign-in timeout'
      )
      
      if (signInError) {
        console.error('Auto sign-in after signup failed:', signInError)
        redirect('/login?success=signup_complete')
      }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    // NEXT_REDIRECT es el comportamiento esperado, no un error
    if (error && typeof error === 'object' && 'digest' in error && 
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error('Signup timeout or error:', error)
    if (error instanceof Error && error.message?.includes('timeout')) {
      redirect('/login?error=timeout')
    }
    redirect('/login?error=signup_failed')
  }
}