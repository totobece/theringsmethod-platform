'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

interface TrialBannerProps {
  daysRemaining?: number
}

export default function TrialBanner({ daysRemaining }: TrialBannerProps) {
  const [days, setDays] = useState<number | null>(null)
  const [isVisible, setIsVisible] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const checkTrial = async () => {
      if (daysRemaining !== undefined) {
        setDays(daysRemaining)
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user?.user_metadata?.trial_end_date) {
          const trialEndDate = new Date(user.user_metadata.trial_end_date)
          const now = new Date()
          const remaining = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          setDays(remaining > 0 ? remaining : 0)
        }
      } catch (error) {
        console.error('Error checking trial:', error)
      }
    }

    checkTrial()
  }, [daysRemaining, supabase])

  if (!isVisible || days === null || days > 30) {
    return null
  }

  const getBannerColor = () => {
    if (days <= 3) return 'bg-red-500'
    if (days <= 7) return 'bg-orange-500'
    if (days <= 30) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getTextColor = () => {
    if (days <= 7) return 'text-white'
    return 'text-black'
  }

  return (
    <div className={`${getBannerColor()} ${getTextColor()} p-3 text-center relative`}>
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center">
          <span className="font-medium">
            {days === 0 ? (
              'Your trial expires today!'
            ) : days === 1 ? (
              'Your trial expires tomorrow!'
            ) : (
              `Your trial expires in ${days} days`
            )}
          </span>
          {days > 0 && (
            <span className="ml-2">
              <a href="/account/support" className="underline hover:no-underline">
                Contact us to extend
              </a>
            </span>
          )}
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 text-lg font-bold hover:opacity-70"
          aria-label="Close banner"
        >
          ×
        </button>
      </div>
    </div>
  )
}
