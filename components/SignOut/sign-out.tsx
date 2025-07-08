'use client'
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation";
import { useI18n } from '@/contexts/I18nContext';

export default function SignOut() {
  const { t } = useI18n();
  const router = useRouter();
  const supabase = createClient();
  
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/")
  }

  return (
    <button onClick={logout} className="relative font-light text-base md:text-xl bg-gray-600 transition px-4 md:px-6  inline-flex h-12 animate-shimmer items-center rounded-[40px] text-white">
      {t('auth.signOut')}
    </button>
  )
} 