'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Navbar from '@/components/UI/Navbar/navbar'
import Footer from '@/components/UI/Footer/footer'

export default function TrialExpiredPage() {
  const [userEmail, setUserEmail] = useState<string>('')
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) {
        setUserEmail(user.email)
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <section className="bg-cream min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center space-y-8 bg-white p-8 rounded-2xl shadow-lg">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-800">
              Your 90-Day Trial Has Expired
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for using The Rings Method Platform!
            </p>
          </div>

          <div className="space-y-4 text-gray-700">
            <p className="text-lg">
              Your 90-day trial period has ended for account: <strong>{userEmail}</strong>
            </p>
            <p>
              To continue accessing our premium content and features, please contact our support team or upgrade your account.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/account/support" 
                className="bg-gray-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-700 transition"
              >
                Contact Support
              </a>
              <button 
                onClick={handleSignOut}
                className="border border-gray-600 text-gray-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition"
              >
                Sign Out
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500 pt-4 border-t">
            <p>
              If you believe this is an error, please contact our support team at{' '}
              <a href="mailto:support@theringsmethod.com" className="text-gray-600 hover:underline">
                support@theringsmethod.com
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </section>
  )
}
