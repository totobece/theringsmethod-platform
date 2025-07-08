'use client'
import { useI18n } from '@/contexts/I18nContext';

export default function ErrorPage() {
  const { t } = useI18n();
  
  return (
    <section className='bg-cream relative max-w-full h-[850px] flex flex-col'>
      <div className="w-full max-w-3xl m-auto px-2 pt-4 pb-12">
        <div className="w-full space-y-10 p-8 rounded-2xl bg-cream border-2 border-gray-600">
          <div className="">
            <h1 className="text-black text-center w-full font-medium text-3xl lg:text-5xl ">
              {t('errors.somethingWentWrong')} <br />{t('errors.tryAgainLater')}
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}