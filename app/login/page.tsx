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
  const [isSignUpMode, setIsSignUpMode] = useState(false)
  const [acceptsTerms, setAcceptsTerms] = useState(false)
  const [acceptsPrivacy, setAcceptsPrivacy] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { t } = useI18n()
  const searchParams = useSearchParams()

  // Manejar errores de URL
  useEffect(() => {
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    
    if (error === 'link_expired') {
      setErrorMessage(t('auth.linkExpired'))
    } else if (error === 'auth_error') {
      setErrorMessage(t('auth.authError'))
    } else if (error === 'invalid_credentials') {
      setErrorMessage(t('auth.invalidCredentials'))
    } else if (error === 'invalid_data') {
      setErrorMessage(t('auth.invalidData'))
    } else if (error === 'password_too_short') {
      setErrorMessage(t('auth.passwordTooShort'))
    } else if (error === 'user_exists') {
      setErrorMessage(t('auth.userExists'))
    } else if (error === 'signup_failed') {
      setErrorMessage(t('auth.signupFailed'))
    } else if (success === 'signup_complete') {
      setErrorMessage(t('auth.signupComplete'))
    }
  }, [searchParams, t])

  const handleCheckboxChange = (setter: (v: boolean) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.checked)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    const formData = new FormData(formRef.current)
    
    // Validar que si es modo registro, se acepten los términos
    if (isSignUpMode && (!acceptsTerms || !acceptsPrivacy)) {
      setErrorMessage(t('auth.mustAcceptTerms'))
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    try {
      if (isSignUpMode) {
        await signup(formData)
      } else {
        await login(formData)
      }
    } catch (error) {
      console.error('Error during authentication:', error)
      setErrorMessage(t('auth.authError'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="bg-cream min-h-screen w-full flex animate-slidein full-height">
      {/* Language Selector - positioned absolutely in top right */}
      <div className="absolute top-4 right-4 z-20">
        <LanguageSelector />
      </div>
      
      <div className="w-full max-w-xl m-auto px-2 pt-6 pb-12">
        <div className="w-full space-y-10 p-8 rounded-2xl bg-cream border-2 border-gray-600">
          <div>
            <h1 className="text-black w-full font-medium text-3xl lg:text-5xl">
              {isSignUpMode ? t('auth.createAccount') : t('auth.welcomeTitle').split('\\n').map((line, index) => (
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
            onSubmit={handleSubmit}
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
                minLength={isSignUpMode ? 6 : undefined}
                className="block w-full my-4 px-16 py-3 bg-white border-white rounded-2xl text-xl shadow-sm text-gray-700 focus:border-white focus:ring focus:ring-white"
              />
            </div>
            
            <div className="cursor-pointer hover:underline py-6 flex justify-center" onClick={() => setShowPassword(!showPassword)}>
              <p className="text-md text-black">{showPassword ? t('auth.hidePassword') : t('auth.showPassword')}</p>
            </div>

            {isSignUpMode && (
              <div className="flex flex-col space-y-4 mb-6 px-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={acceptsTerms}
                    onChange={handleCheckboxChange(setAcceptsTerms)}
                    className="mr-2 mt-1"
                  />
                  <span className="text-sm">
                    {t('auth.acceptTerms')} <a href='/account/terms' target='_blank' className='px-1 hover:underline text-blue-600'>{t('auth.termsAndConditions')}</a>
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={acceptsPrivacy}
                    onChange={handleCheckboxChange(setAcceptsPrivacy)}
                    className="mr-2 mt-1"
                  />
                  <span className="text-sm">
                    {t('auth.acceptTerms')} <a href="/privacy-policy" target='_blank' className='hover:underline px-1 text-blue-600'>{t('auth.privacyPolicy')}</a>
                  </span>
                </label>
              </div>
            )}
            
            <div className="justify-center flex w-full space-x-4 px-4">
              <button
                type="submit"
                disabled={isLoading || (isSignUpMode && (!acceptsTerms || !acceptsPrivacy))}
                className="relative bg-gray-600 transition px-6 text-xl inline-flex h-12 animate-shimmer items-center justify-center rounded-[40px] font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('auth.loading') : (isSignUpMode ? t('auth.signUp') : t('auth.login'))}
              </button>
            </div>
          </form>

          {/* Toggle between login and signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode)
                setErrorMessage('')
                setAcceptsTerms(false)
                setAcceptsPrivacy(false)
              }}
              className="text-gray-600 hover:text-gray-800 underline"
            >
              {isSignUpMode ? t('auth.alreadyHaveAccount') : t('auth.dontHaveAccount')}
            </button>
          </div>
          
          <div className="flex justify-between">
            <div />
            <div className="flex flex-col md:w-auto mt-2">
              <Image
                src={LogoDuo}
                alt='theringsmethod-logo'
                width={120}
                height={150}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}