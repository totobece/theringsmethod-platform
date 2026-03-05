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
    <button onClick={logout} className="relative font-light text-base md:text-xl border border-pink/40 text-pink hover:bg-pink/10 transition px-4 md:px-6 inline-flex h-12 items-center rounded-full">
      {t('auth.signOut')}
    </button>
  )
} 
