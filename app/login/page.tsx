'use client'
import { login, signup } from './actions'
import Image from 'next/image'
import LogoDuo from '@/public/logo-blanco-trm.png'
import { useRef, useState, useEffect } from 'react'
import { useI18n } from '@/contexts/I18nContext'
import LanguageSelector from '@/components/UI/LanguageSelector/language-selector'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [acceptsTerms, setAcceptsTerms] = useState(false)
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useI18n()
  const searchParams = useSearchParams()

  // Manejar errores de URL
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'link_expired') {
      setErrorMessage(t('auth.linkExpired'))
    } else if (error === 'auth_error') {
      setErrorMessage(t('auth.authError'))
    }
  }, [searchParams, t])

  const handleCheckboxChange = (setter: (v: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.checked)
  }

  const closeModal = () => setIsModalOpen(false)

  // Envía el formulario con la acción de signup
  const handleSignupFromModal = () => {
    if (acceptsTerms && acceptsPrivacy && formRef.current) {
      // Cambia el formAction antes de enviar
      formRef.current.setAttribute('action', '/login') // Next.js ignora action, pero lo dejamos por claridad
      formRef.current.setAttribute('data-signup', 'true')
      // Crea un input oculto para distinguir el submit
      let hidden = formRef.current.querySelector('input[name="signup_intent"]') as HTMLInputElement | null
      if (!hidden) {
        hidden = document.createElement('input')
        hidden.type = 'hidden'
        hidden.name = 'signup_intent'
        hidden.value = '1'
        formRef.current.appendChild(hidden)
      }
      // Envía el formulario usando la acción de signup
      const formData = new FormData(formRef.current);
      signup(formData);
      setIsModalOpen(false)
    }
    // Si no acepta, puedes mostrar un error
  }

  return (
    <section className="bg-cream min-h-screen w-full flex animate-slidein full-height">
      {/* Language Selector - positioned absolutely in top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      
      <div className={`w-full max-w-xl m-auto px-2 pt-6 pb-12 ${isModalOpen ? 'blur-md' : ''}`}>
        <div className="w-full space-y-10 p-8 rounded-2xl bg-cream border-2 border-gray-600 ">
          <div>
            <h1 className="text-black w/full font-medium text-3xl lg:text-5xl">
              {t('auth.welcomeTitle').split('\\n').map((line, index) => (
                <span key={index}>
                  {line}
                  {index === 0 && <br />}
                </span>
              ))}
            </h1>
            {errorMessage && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {errorMessage}
              </div>
            )}
          </div>
          <form
            className="flex flex-col"
            autoComplete="off"
            ref={formRef}
          >
            <div className="flex flex-col">
              <label className="text-gray-600 text-xl font-medium" htmlFor="email">{t('auth.email')}:</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full my-4 px-16 py-3 bg-white border-white rounded-2xl text-xl shadow-sm text-gray-700 focus:border-white focus:ring focus:ring-white"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600 text-xl font-medium" htmlFor="password">{t('auth.password')}:</label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full my-4 px-16 py-3 bg-white border-white rounded-2xl text-xl shadow-sm text-gray-700 focus:border-white focus:ring focus:ring-white"
              />
            </div>
            <div className="cursor-pointer hover:underline py-6 flex justify-center" onClick={() => setShowPassword(!showPassword)}>
              <p className="text-md text-black">{showPassword ? t('auth.hidePassword') : t('auth.showPassword')}</p>
            </div>
            <div className="justify-center flex w/full space-x-4 px-4">
              <button
                formAction={login}
                className="relative bg-gray-600 transition px-6 text-xl inline-flex h-12 animate-shimmer items-center justify-center rounded-[40px] font-medium text-white"
              >
                {t('auth.login')}
              </button>
             
            </div>
          </form>
          <div className="flex justify-between">
            <div />
            <div className="flex flex-col md:w-auto mt-2">
              <Image
                src={LogoDuo}
                alt='saucotec-logo'
                width={120}
                height={150}
              />
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="w-[350px] h-[350px] bg-cream rounded-2xl p-6 text-black relative">
            <button className="absolute top-4 right-0 p-2 text-3xl" onClick={closeModal}>
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-14">{t('auth.termsAndConditions')}</h2>
            <div className="flex flex-col space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptsTerms}
                  onChange={handleCheckboxChange(setAcceptsTerms)}
                  className="mr-2"
                />
                {t('auth.acceptTerms')} <a href='/account/terms' className='px-1 hover:underline'>{t('auth.termsAndConditions')}</a>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={acceptsPrivacy}
                  onChange={handleCheckboxChange(setAcceptsPrivacy)}
                  className="mr-2"
                />
                {t('auth.acceptTerms')} <a href="/privacypolicie" className='hover:underline px-1'>{t('auth.privacyPolicy')}</a>
              </label>
            </div>
            <div className="absolute inset-x-28 bottom-4">
              <button
                type="button"
                onClick={handleSignupFromModal}
                className="relative bg-gray-600 transition px-6 text-xl inline-flex h-12 animate-shimmer items-center justify-center rounded-[40px] font-medium text-white"
                disabled={!(acceptsTerms && acceptsPrivacy)}
              >
                {t('auth.signUp')}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}