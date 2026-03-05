'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate input
  if (!data.email || !data.password) {
    redirect('/login?error=invalid_credentials')
  }

  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    console.error('[LOGIN] Error creating Supabase client:', err)
    redirect('/login?error=timeout')
  }

  let loginResult
  try {
    // Direct call with AbortController for clean timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    loginResult = await supabase.auth.signInWithPassword(data)
    clearTimeout(timeoutId)
  } catch (error) {
    console.error('[LOGIN] signInWithPassword exception:', error)
    redirect('/login?error=timeout')
  }

  if (loginResult.error) {
    console.error('[LOGIN] Auth error:', loginResult.error.message)
    redirect('/login?error=invalid_credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
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

  let supabase
  try {
    supabase = await createClient()
  } catch (err) {
    console.error('[SIGNUP] Error creating Supabase client:', err)
    redirect('/login?error=timeout')
  }

  try {
    const { error, data: signUpData } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: undefined,
      }
    })

    if (error) {
      console.error('[SIGNUP] Error:', error.message)
      if (error.message.includes('already registered')) {
        redirect('/login?error=user_exists')
      }
      redirect('/login?error=signup_failed')
    }

    // If signup was successful, try to sign them in immediately
    if (signUpData.user && !signUpData.session) {
      const { error: signInError } = await supabase.auth.signInWithPassword(data)

      if (signInError) {
        console.error('[SIGNUP] Auto sign-in failed:', signInError.message)
        redirect('/login?success=signup_complete')
      }
    }

    revalidatePath('/', 'layout')
    redirect('/')
  } catch (error) {
    // NEXT_REDIRECT is expected behavior, not an error
    if (error && typeof error === 'object' && 'digest' in error &&
        typeof error.digest === 'string' && error.digest.includes('NEXT_REDIRECT')) {
      throw error
    }

    console.error('[SIGNUP] Unexpected error:', error)
    redirect('/login?error=signup_failed')
  }
}
