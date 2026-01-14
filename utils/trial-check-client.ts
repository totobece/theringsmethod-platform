import { createClient } from '@/utils/supabase/client'
import type { User } from '@supabase/supabase-js'

interface TrialStatus {
  isValid: boolean
  user: User | null
  daysRemaining?: number
  redirect?: string
  trialEndDate?: string
}

export async function checkUserTrialStatusClient(): Promise<TrialStatus> {
  const supabase = createClient()
  
  try {
    // Usar getUser() para obtener el usuario actual
    let { data: { user }, error } = await supabase.auth.getUser()
    
    // Si no hay usuario, reintentar una vez después de un pequeño delay
    // Esto maneja el caso donde la cookie de sesión aún no está sincronizada después del login
    if ((error || !user)) {
      await new Promise(resolve => setTimeout(resolve, 100))
      const retry = await supabase.auth.getUser()
      user = retry.data.user
      error = retry.error
    }
    
    if (error || !user) {
      return { isValid: false, user: null, redirect: '/login' }
    }

    const userData = user.user_metadata
    
    // Si no tiene trial_end_date, es un usuario legacy - darle acceso
    if (!userData.trial_end_date) {
      return { isValid: true, user, daysRemaining: 999 }
    }

    const trialEndDate = new Date(userData.trial_end_date)
    const now = new Date()

    // Verificar si el trial expiró
    if (now > trialEndDate) {
      return { 
        isValid: false, 
        redirect: '/trial-expired',
        user,
        daysRemaining: 0
      }
    }

    // Calcular días restantes
    const daysRemaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    return { 
      isValid: true, 
      user,
      daysRemaining,
      trialEndDate: userData.trial_end_date
    }
    
  } catch (error) {
    console.error('Error checking trial status:', error)
    return { isValid: false, user: null, redirect: '/error' }
  }
}
