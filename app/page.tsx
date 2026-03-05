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
      <section className="bg-trm-bg min-h-screen flex items-center justify-center font-montserrat">
        <div className="text-white text-lg">{t('common.loading')}</div>
      </section>
    )
  }

  if (!trialStatus.isValid) {
    router.push(trialStatus.redirect || '/login')
    return null
  }

  const user = trialStatus.user

  return (
    <section className="font-montserrat">
      <TrialBanner daysRemaining={trialStatus.daysRemaining} />
      <Navbar />
      <main className="bg-trm-black min-h-screen pt-16">
        {user ? (
          <>
            {/* Featured Workout Hero */}
            <div className="max-w-[1400px] mx-auto px-5 md:px-6 pt-10">
              <MainPlayRoutine />
            </div>

            {/* Week Section with Slider */}
            <div className="max-w-[1400px] mx-auto px-5 md:px-6 mt-16 mb-10">
              <WeekVideoSlider />
            </div>

            {/* Meditations Section */}
            <div className="max-w-[1400px] mx-auto px-5 md:px-6 py-8">
              <MeditationsComponent />
            </div>

            {/* Explore Section */}
            <div>
              <ExploreVideoSlider />
            </div>
          </>
        ) : null}
      </main>
      <Footer />
    </section>
  );
}
