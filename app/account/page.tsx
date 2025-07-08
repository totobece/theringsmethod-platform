'use client'
import { useState, useEffect } from 'react';
import SignOut from "@/components/SignOut/sign-out";
import { checkUserTrialStatusClient } from "@/utils/trial-check-client";
import Link from "next/link";
import Navbar from "@/components/UI/Navbar/navbar";
import Sidebar from "@/components/UI/Sidebar/sidebar";
import TrialBanner from '@/components/TrialBanner/trial-banner'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/contexts/I18nContext';
import type { User } from '@supabase/supabase-js'

interface TrialStatus {
  isValid: boolean
  daysRemaining?: number
  user: User | null
  redirect?: string
}

export default function AccountPage() {
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
      <section className="bg-cream min-h-screen flex items-center justify-center">
        <div className="text-black text-lg">{t('common.loading')}</div>
      </section>
    )
  }

  if (!trialStatus.isValid) {
    router.push(trialStatus.redirect || '/login')
    return null
  }

  const user = trialStatus.user

  return (
    
    <section className="bg-cream max-w-full h-full min-h-screen flex flex-col overflow-y-auto">
      <TrialBanner daysRemaining={trialStatus.daysRemaining} />
      <Navbar />

      <div className="flex flex-1"> 

          <Sidebar/>


        <div className="flex-1 md:ml-[12.5%] mx-auto pt-24 pb-12 px-8">
          <div className="space-y-14">
            <div>
              <h1 className="text-black text-2xl lg:text-4xl">{t('common.userName')}</h1>
            </div>
            <div>
              <p className="text-gray-700 text-xl font-light">{t('common.email')}: {user?.email ?? t('common.guest')}</p>
              <p className="text-gray-700 text-xl font-light mt-4">{t('common.joinedOn')}: {user?.created_at ?? t('common.guest')}</p>
              {trialStatus.daysRemaining && (
                <p className="text-gray-700 text-xl font-light mt-4">
                  {t('common.trialDaysRemaining')}: <span className="font-medium">{trialStatus.daysRemaining}</span>
                </p>
              )}
              <p className="text-gray-700 text-xl font-light mt-4">{t('common.accountStatus')}: {user?.aud ?? t('common.guest')}</p>
            </div>
            <div className="flex justify-start">
              <a href="/new-password" className="relative font-light text-base md:text-xl bg-gray-600 transition px-2 md:px-6  inline-flex h-12 animate-shimmer items-center rounded-[40px] text-white">
                {t('common.changePassword')}
              </a>
            </div>
            <div className="justify-start flex  text-sm">
              {user ? <SignOut /> : <Link href="/login">{t('auth.login')}</Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
