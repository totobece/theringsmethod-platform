'use client'
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"
import MeditationsComponent from "@/components/MeditationsComponent/meditations-component"
import Navbar from "@/components/UI/Navbar/navbar"
import Footer from "@/components/UI/Footer/footer"
import TrialBanner from '@/components/TrialBanner/trial-banner'
import { checkUserTrialStatusClient } from '@/utils/trial-check-client'
import type { User } from '@supabase/supabase-js'

interface TrialStatus {
  isValid: boolean
  daysRemaining?: number
  user: User | null
  redirect?: string
}

type FilterType = 'routines' | 'meditations'

export default function Explore() {
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
      <main className="relative bg-gray-700 min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">Cargando...</div>
      </main>
    )
  }

  if (!trialStatus.isValid) {
    router.push(trialStatus.redirect || '/login')
    return null
  }

  return (
    <main className="relative bg-gray-700">
      {/* Locked Routine Notification */}
      {showLockedNotification && lockedRoutineInfo && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="font-semibold">Rutina Bloqueada</p>
              <p className="text-sm">
                La rutina del día {lockedRoutineInfo.day} se desbloqueará en{' '}
                {calculateDaysUntilUnlock(lockedRoutineInfo.day, lockedRoutineInfo.maxDay)} día(s).
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowLockedNotification(false)}
            className="absolute top-2 right-2 text-white hover:text-gray-200"
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
          <div className="container mx-auto px-4 pt-8 pb-6">
            {/* Filter Tabs - Centrado */}
            <div className="flex justify-center mb-8">
              <div className="flex space-x-1 bg-gray-600 rounded-lg p-1 max-w-md">
                <button
                  onClick={() => setActiveFilter('routines')}
                  className={`px-6 py-3 rounded-md transition-all duration-200 flex-1 justify-center ${
                    activeFilter === 'routines'
                      ? 'bg-gray-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="font-medium">Rutinas</span>
                </button>
                <button
                  onClick={() => setActiveFilter('meditations')}
                  className={`px-6 py-3 rounded-md transition-all duration-200 flex-1 justify-center ${
                    activeFilter === 'meditations'
                      ? 'bg-gray-700 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <span className="font-medium">Meditaciones</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content based on active filter */}
          <div className="container mx-auto px-4 pb-8">
            {activeFilter === 'routines' ? (
              <ExploreVideoSlider searchTerm={searchTerm} />
            ) : (
              <MeditationsComponent searchTerm={searchTerm} />
            )}
          </div>

          <Footer/>
        </>
      )}
    </main>
  )
}