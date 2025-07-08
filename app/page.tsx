'use client'
import { useState, useEffect } from 'react';
import Navbar from '@/components/UI/Navbar/navbar';
import MainPlayRoutine from '@/components/MainPlayRoutine/main-play-routine';
import WeekVideoSlider from '@/components/WeekVideoSlider/week-video-slider';
import MeditationsComponent from '@/components/MeditationsComponent/meditations-component';
import { checkUserTrialStatusClient } from "@/utils/trial-check-client";
import { useRouter } from 'next/navigation'
import Footer from '@/components/UI/Footer/footer';
import ExploreVideoSlider from "@/components/ExploreVideos/explore-videos"
import TrialBanner from '@/components/TrialBanner/trial-banner'
import { useI18n } from '@/contexts/I18nContext';
import type { User } from '@supabase/supabase-js'

interface TrialStatus {
  isValid: boolean
  daysRemaining?: number
  user: User | null
  redirect?: string
}

export default function Home() {
  const { t } = useI18n();
  const [trialStatus, setTrialStatus] = useState<TrialStatus | null>(null);
  const router = useRouter();

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

  if (!trialStatus) {
    return (
      <section className="bg-gray-700 min-h-screen flex items-center justify-center">
        <div className="text-white text-lg">{t('common.loading')}</div>
      </section>
    )
  }

  if (!trialStatus.isValid) {
    router.push(trialStatus.redirect || '/login')
    return null
  }

  const user = trialStatus.user
  console.log('Trial status:', {
    user: user?.email,
    daysRemaining: trialStatus.daysRemaining
  })


  return (
    <section>
    <TrialBanner daysRemaining={trialStatus.daysRemaining} />
    <Navbar />
    <main className='bg-gray-700 to-99% '>
      
      {user ? (
        <>
          <div className='md:pt-6 md:px-6'>
          <MainPlayRoutine />
          <div className={`max-w-full relative md:text-start text-start`}>
      <h1 className='mt-12 mb-6 md:px-0 px-4 text-white font-light text-2xl md:text-3xl md:text-start text-center'>{t('common.featuringThisWeek')}</h1>

      </div>
          </div>
          
          <div className='md:pb-16 md:px-6 px-4'>
          <WeekVideoSlider />
          </div>
          
          {/* Meditaciones Section */}
          <div className="md:px-6 px-4 py-8">
            <MeditationsComponent />
          </div>
          
          <div>
            <ExploreVideoSlider/>
          </div>
        </>
      ) : null}
    </main>
    <Footer/>
    </section>

  );
}


