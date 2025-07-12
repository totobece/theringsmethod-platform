'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate input
  if (!data.email || !data.password) {
    redirect('/login?error=invalid_credentials')
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.error('Login error:', error)
    redirect('/login?error=invalid_credentials')
  }

  revalidatePath('/', 'layout')
  redirect('/')
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

  // Use signUp without email confirmation for direct access
  const { error, data: signUpData } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: undefined, // No email confirmation
    }
  })

  if (error) {
    console.error('Signup error:', error)
    if (error.message.includes('already registered')) {
      redirect('/login?error=user_exists')
    }
    redirect('/login?error=signup_failed')
  }

  // If signup was successful, try to sign them in immediately
  if (signUpData.user && !signUpData.session) {
    const { error: signInError } = await supabase.auth.signInWithPassword(data)
    if (signInError) {
      console.error('Auto sign-in after signup failed:', signInError)
      redirect('/login?success=signup_complete')
    }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}