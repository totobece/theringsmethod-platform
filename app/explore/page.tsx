'use client'
import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"
import MeditationsComponent from "@/components/MeditationsComponent/meditations-component"
import WarmupComponent from "@/components/WarmupComponent/warmup-component"
import Navbar from "@/components/UI/Navbar/navbar"
import Footer from "@/components/UI/Footer/footer"
import TrialBanner from '@/components/TrialBanner/trial-banner'
import { checkUserTrialStatusClient } from '@/utils/trial-check-client'
import { useI18n } from '@/contexts/I18nContext'
import type { User } from '@supabase/supabase-js'

interface TrialStatus {
  isValid: boolean
  daysRemaining?: number
  user: User | null
  redirect?: string
}

type FilterType = 'routines' | 'meditations' | 'warmups'

// Componente separado que usa useSearchParams
function ExploreContent() {
  const { t } = useI18n();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null)
  const [showLockedNotification, setShowLockedNotification] = useState(false)
  const [lockedRoutineInfo, setLockedRoutineInfo] = useState<{day: number, maxDay: number} | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterType>('routines')
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    async function checkTrialAndUser() {
      try {
        const status = await checkUserTrialStatusClient()
        setTrialStatus(status)
        
        if (!status.isValid) {
          router.push(status.redirect || '/login')
        }
      } catch (error) {
        console.error('Error checking trial status:', error)
        router.push('/login')
      }
    }

    checkTrialAndUser()
  }, [router])

  useEffect(() => {
    // Obtener el término de búsqueda de los searchParams del navbar
    const searchFromUrl = searchParams.get('search') || ''
    setSearchTerm(searchFromUrl)
  }, [searchParams])

  useEffect(() => {
    // Check if user was redirected from a locked routine
    const error = searchParams.get('error')
    const day = searchParams.get('day')
    const maxDay = searchParams.get('maxDay')

    if (error === 'routine-locked' && day && maxDay) {
      setShowLockedNotification(true)
      setLockedRoutineInfo({
        day: parseInt(day),
        maxDay: parseInt(maxDay)
      })

      // Clean up URL parameters
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('error')
      newUrl.searchParams.delete('day')
      newUrl.searchParams.delete('maxDay')
      window.history.replaceState({}, '', newUrl.pathname)
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setShowLockedNotification(false)
      }, 5000)
    }
  }, [searchParams])

  const calculateDaysUntilUnlock = (routineDay: number, maxDay: number): number => {
    return routineDay - maxDay
  }

  if (!trialStatus) {
    return (
      <main className="relative bg-trm-black min-h-screen flex items-center justify-center font-montserrat">
        <div className="text-white text-lg">{t('common.loading')}</div>
      </main>
    )
  }

  if (!trialStatus.isValid) {
    router.push(trialStatus.redirect || '/login')
    return null
  }

  return (
    <main className="relative bg-trm-black font-montserrat">
      {/* Locked Routine Notification */}
      {showLockedNotification && lockedRoutineInfo && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-pink text-white px-6 py-4 rounded-[20px] shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="font-semibold">{t('explore.routineLocked')}</p>
              <p className="text-sm">
                {t('explore.routineUnlocksIn', { 
                  day: lockedRoutineInfo.day, 
                  days: calculateDaysUntilUnlock(lockedRoutineInfo.day, lockedRoutineInfo.maxDay) 
                })}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowLockedNotification(false)}
            className="absolute top-2 right-2 text-white hover:text-white/70"
          >
            ×
          </button>
        </div>
      )}

      <TrialBanner daysRemaining={trialStatus.daysRemaining || 0} />
      <Navbar/>
      {trialStatus.user && (
        <>
          {/* Filter Section */}
          <div className="container mx-auto px-4 pt-24 pb-6">
            {/* Filter Tabs - Centrado */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-trm-black border border-pink rounded-full p-1 max-w-md">
                <button
                  onClick={() => setActiveFilter('routines')}
                  className={`px-6 py-3 rounded-full transition-all duration-200 flex-1 justify-center whitespace-nowrap ${
                    activeFilter === 'routines'
                      ? 'bg-gradient-to-r from-pink to-dark-red text-white shadow-lg'
                      : 'text-trm-muted hover:text-white'
                  }`}
                >
                  <span className="font-medium">{t('explore.routines')}</span>
                </button>
                <button
                  onClick={() => setActiveFilter('meditations')}
                  className={`px-6 py-3 rounded-full transition-all duration-200 flex-1 justify-center whitespace-nowrap ${
                    activeFilter === 'meditations'
                      ? 'bg-gradient-to-r from-pink to-dark-red text-white shadow-lg'
                      : 'text-trm-muted hover:text-white'
                  }`}
                >
                  <span className="font-medium">{t('explore.meditations')}</span>
                </button>
                <button
                  onClick={() => setActiveFilter('warmups')}
                  className={`px-6 py-3 rounded-full transition-all duration-200 flex-1 justify-center whitespace-nowrap ${
                    activeFilter === 'warmups'
                      ? 'bg-gradient-to-r from-pink to-dark-red text-white shadow-lg'
                      : 'text-trm-muted hover:text-white'
                  }`}
                >
                  <span className="font-medium">Warm Ups</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content based on active filter */}
          <div className="container mx-auto px-4 pb-8">
            {activeFilter === 'routines' ? (
              <ExploreVideoSlider searchTerm={searchTerm} />
            ) : activeFilter === 'meditations' ? (
              <MeditationsComponent searchTerm={searchTerm} />
            ) : (
              <WarmupComponent searchTerm={searchTerm} />
            )}
          </div>

          <Footer/>
        </>
      )}
    </main>
  )
}

// Componente principal que incluye el boundary de Suspense
export default function Explore() {
  return (
    <Suspense fallback={
      <main className="relative bg-trm-black min-h-screen flex items-center justify-center font-montserrat">
        <div className="text-white text-lg">Loading...</div>
      </main>
    }>
      <ExploreContent />
    </Suspense>
  )
}
