import { createClient } from '@/utils/supabase/server'

export async function checkUserTrialStatus() {
  const supabase = await createClient()
  
  try {
    // Usar getUser() en lugar de getSession() para mayor seguridad
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return { isValid: false, redirect: '/login' }
    }

    console.log('Trial status:', {
      user: user.email,
      metadata: user.user_metadata,
      trialEndDate: user.user_metadata?.trial_end_date,
      daysRemaining: user.user_metadata?.trial_end_date ? 
        Math.ceil((new Date(user.user_metadata.trial_end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 
        undefined
    })

    const userData = user.user_metadata
    
    // Si no tiene trial_end_date, es un usuario legacy - darle acceso
    if (!userData.trial_end_date) {
      return { isValid: true, user }
    }

    const trialEndDate = new Date(userData.trial_end_date)
    const now = new Date()

    // Verificar si el trial expiró
    if (now > trialEndDate) {
      // Actualizar status a expired
      await supabase.auth.updateUser({
        data: {
          ...userData,
          account_status: 'expired'
        }
      })
      
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
    return { isValid: false, redirect: '/error' }
  }
}
