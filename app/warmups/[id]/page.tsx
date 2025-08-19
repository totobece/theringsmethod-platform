'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Navbar from '@/components/UI/Navbar/navbar'
import Footer from '@/components/UI/Footer/footer'
import TrialBanner from '@/components/TrialBanner/trial-banner'
import MoreVideosRecommendation from '@/components/MoreVideosRecommendation/more-videos-recommendation'
import WarmupComponent from '@/components/WarmupComponent/warmup-component'
import WarmupVideoSkeleton from '@/components/Skeletons/WarmupVideoSkeleton'
import { checkUserTrialStatusClient } from '@/utils/trial-check-client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

interface TrialStatus {
  isValid: boolean
  daysRemaining?: number
  user: User | null
  redirect?: string
}

interface WarmupData {
  id: number;
  name: string;
  exercise: string;
  pro_tip: string;
  rings_placement: string;
  areas: string;
  created_at: string;
}

interface WarmupVideoData {
  id: string;
  title: string;
  warmupNumber: number;
  url: string;
  fileName: string;
  size: number;
  lastModified: string;
  type: string;
}

export default function WarmupPage() {
  const params = useParams()
  const router = useRouter()
  const warmupId = params.id as string
  
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null)
  const [warmupData, setWarmupData] = useState<WarmupData | null>(null)
  const [warmupVideo, setWarmupVideo] = useState<WarmupVideoData | null>(null)
  const [otherWarmups, setOtherWarmups] = useState<WarmupVideoData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExerciseOpen, setIsExerciseOpen] = useState(false)
  const [isProTipOpen, setIsProTipOpen] = useState(false)

  // Función para formatear texto con párrafos separados
  const formatTextWithParagraphs = (text: string) => {
    if (!text) return []
    
    // Separar por dobles saltos de línea para crear párrafos
    const paragraphs = text.split('\n\n').filter(paragraph => paragraph.trim() !== '')
    
    return paragraphs.map((paragraph, index) => (
      <div key={index} className="mb-4">
        {paragraph.split('\n').map((line, lineIndex) => (
          <div key={lineIndex} className="mb-1">{line}</div>
        ))}
      </div>
    ))
  }

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
    const fetchWarmupData = async () => {
      if (!warmupId) return
      
      setIsLoading(true)
      try {
        // Fetch warmup data from table and videos from storage
        const [warmupDataRes, warmupVideosRes] = await Promise.all([
          fetch('/api/supabase/warmups'),
          fetch('/api/supabase/warmup-videos')
        ])

        const warmupDataResult = await warmupDataRes.json()
        const warmupVideosResult = await warmupVideosRes.json()

        if (!warmupDataRes.ok) {
          throw new Error(warmupDataResult.error || 'Error fetching warmup data')
        }
        
        if (!warmupVideosRes.ok) {
          throw new Error(warmupVideosResult.error || 'Error fetching warmup videos')
        }

        // Find the current warmup data by name (matching the warmup number)
        const currentWarmupData = warmupDataResult.warmups?.find(
          (warmup: WarmupData) => warmup.name === `#${warmupId} WarmUp`
        )
        
        // Find the current warmup video by number
        const currentWarmupVideo = warmupVideosResult.warmupVideos?.find(
          (video: WarmupVideoData) => video.warmupNumber === parseInt(warmupId)
        )
        
        // Get other warmups (excluding current one)
        const otherWarmupVideos = warmupVideosResult.warmupVideos?.filter(
          (video: WarmupVideoData) => video.warmupNumber !== parseInt(warmupId)
        ) || []

        if (!currentWarmupData || !currentWarmupVideo) {
          throw new Error('Warmup not found')
        }

        setWarmupData(currentWarmupData)
        setWarmupVideo(currentWarmupVideo)
        setOtherWarmups(otherWarmupVideos)
      } catch (error: unknown) {
        setError((error as Error).message || 'Error fetching data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWarmupData()
  }, [warmupId])

  if (!trialStatus?.isValid) {
    return <div>Loading...</div>
  }

  if (isLoading) {
    return (
      <section className='relative bg-gray-700'>
        <Navbar />
        <TrialBanner daysRemaining={trialStatus?.daysRemaining || 0} />
        
        {/* Hero Section with Video Skeleton */}
        <div className={`h-full bg-cover bg-top bg-[url('/images/bg.jpg')] bg-no-repeat`}>
          <section className='relative bg-gray-700 z-30 bg-none'>
            <div className="w-full flex flex-col items-center justify-center">
              <WarmupVideoSkeleton />
            </div>
          </section>
        </div>
        
        <Footer />
      </section>
    )
  }

  if (error || !warmupData || !warmupVideo) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="text-white text-xl">
            {error || 'Warmup not found'}
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <section className='relative bg-gray-700'>
      <Navbar />
      <TrialBanner daysRemaining={trialStatus.daysRemaining || 0} />
      
      {/* Hero Section with Video */}
      <div className={`h-full bg-cover bg-top bg-[url('/images/bg.jpg')] bg-no-repeat`}>
        <section className='relative bg-gray-700 z-30 bg-none'>
          <div className="w-full flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
              {/* Video Player */}
              <div className="mb-8">
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    controls
                    controlsList="nodownload"
                    className="w-full h-full"
                    src={warmupVideo.url}
                    poster="/images/video-placeholder.jpg"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Details Section */}
      <div className={`max-w-full mx-4 md:mx-16 sm:px-6 relative text-left place-content-center`}>
        <div className="max-w-full mx-auto flex relative">
          <div className="max-w-full container flex flex-col">
            <div className="">
              {warmupData && (
                <div>
                  {/* Nueva estructura con 4 columnas */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    
                    {/* Areas */}
                    <div className="space-y-4">
                      <h2 className="text-white text-xl font-semibold">Areas You&apos;ll Improve</h2>
                      <div className="text-white text-base font-light leading-relaxed">
                        {warmupData.areas?.split('\n').map((line, index) => (
                          <div key={index} className="mb-2">{line}</div>
                        ))}
                      </div>
                    </div>

                    {/* Rings Placement */}
                    <div className="space-y-4">
                      <h2 className="text-white text-xl font-semibold">Rings Height</h2>
                      <div className="text-white text-base font-light leading-relaxed">
                        {warmupData.rings_placement?.split('\n').map((line, index) => (
                          <div key={index} className="mb-2">{line}</div>
                        ))}
                      </div>
                    </div>

                    {/* Exercise (Toggle desplegable) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-white text-xl font-semibold">Exercises</h2>
                        <button 
                          onClick={() => setIsExerciseOpen(!isExerciseOpen)}
                          className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          aria-label="Toggle exercises"
                        >
                          <svg 
                            className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${isExerciseOpen ? 'rotate-180' : ''}`}
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </button>
                      </div>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExerciseOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="text-white text-base font-light leading-relaxed pt-2">
                          {formatTextWithParagraphs(warmupData.exercise || '')}
                        </div>
                      </div>
                    </div>

                    {/* Pro Tip (Toggle desplegable) */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-white text-xl font-semibold">Pro Tip</h2>
                        <button 
                          onClick={() => setIsProTipOpen(!isProTipOpen)}
                          className="bg-gray-600 hover:bg-gray-700 text-white rounded-full p-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                          aria-label="Toggle pro tip"
                        >
                          <svg 
                            className={`w-4 h-4 transform transition-transform duration-300 ease-in-out ${isProTipOpen ? 'rotate-180' : ''}`}
                            fill="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </button>
                      </div>
                      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isProTipOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <div className="text-white text-base font-light leading-relaxed pt-2">
                          {formatTextWithParagraphs(warmupData.pro_tip || '')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* More Routines Section */}
      <div className='justify-center items-center flex flex-col mt-16'>
        {/* Other Warmups */}
        {otherWarmups.length > 0 && (
          <div className="w-full max-w-7xl mx-auto px-4 mb-12">
            <WarmupComponent 
              showTitle={false}
              excludeId={warmupId}
            />
          </div>
        )}

        <h1 className='text-white mt-12 md:mt-20 text-pretty text-center px-12 lg:px-20 font-medium text-3xl md:text-5xl'>
          Discover more routines to try!
        </h1>
      </div>

      <MoreVideosRecommendation />
      <Footer />
    </section>
  )
}
