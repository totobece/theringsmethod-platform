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
      <section className="bg-trm-black min-h-screen flex items-center justify-center">
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
    
    <section className="bg-trm-black max-w-full h-full min-h-screen flex flex-col overflow-y-auto">
      <TrialBanner daysRemaining={trialStatus.daysRemaining} />
      <Navbar />

      <div className="flex flex-1"> 

          <Sidebar/>

        <div className="flex-1 md:ml-[12.5%] mx-auto pt-24 pb-12 px-8">
          <div className="space-y-14">
            <div>
              <h1 className="text-white text-2xl lg:text-4xl">{t('common.userName')}</h1>
            </div>
            <div>
              <p className="text-trm-muted text-xl font-light">{t('common.email')}: <span className="text-white">{user?.email ?? t('common.guest')}</span></p>
              <p className="text-trm-muted text-xl font-light mt-4">{t('common.joinedOn')}: <span className="text-white">{user?.created_at ?? t('common.guest')}</span></p>
              {trialStatus.daysRemaining && (
                <p className="text-trm-muted text-xl font-light mt-4">
                  {t('common.trialDaysRemaining')}: <span className="font-medium text-pink">{trialStatus.daysRemaining}</span>
                </p>
              )}
              <p className="text-trm-muted text-xl font-light mt-4">{t('common.accountStatus')}: <span className="text-white">{user?.aud ?? t('common.guest')}</span></p>
            </div>
            <div className="flex justify-start">
              <a href="/new-password" className="relative font-light text-base md:text-xl bg-gradient-to-r from-pink to-dark-red transition px-4 md:px-6 inline-flex h-12 items-center rounded-full text-white hover:opacity-80">
                {t('common.changePassword')}
              </a>
            </div>
            <div className="justify-start flex text-sm">
              {user ? <SignOut /> : <Link href="/login" className="text-pink hover:underline">{t('auth.login')}</Link>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
