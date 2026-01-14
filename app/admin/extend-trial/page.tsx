'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import Navbar from '@/components/UI/Navbar/navbar'

export default function ExtendTrialPage() {
  const [email, setEmail] = useState('')
  const [days, setDays] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [currentUser, setCurrentUser] = useState<string>('')
  const router = useRouter()

  useEffect(() => {
    async function verify() {
      await checkAdminAccess()
    }
    verify()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function checkAdminAccess() {
    const supabase = createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      router.push('/login')
      return
    }

    // Verificar si el usuario es admin
    const isUserAdmin = user.user_metadata?.role === 'admin'
    setIsAdmin(isUserAdmin)
    setCurrentUser(user.email || '')

    if (!isUserAdmin) {
      setMessage({ 
        type: 'error', 
        text: 'No tienes permisos para acceder a esta página.' 
      })
      setTimeout(() => router.push('/'), 3000)
    }
  }

  async function handleExtendTrial(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/extend-trial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          additionalDays: parseInt(days),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al extender el trial')
      }

      setMessage({
        type: 'success',
        text: `✅ Trial extendido exitosamente para ${email}. Nueva fecha: ${new Date(data.newTrialEndDate).toLocaleDateString('es-ES')}`
      })
      setEmail('')
      setDays('')
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Error desconocido'
      })
    } finally {
      setLoading(false)
    }
  }

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center">
        <div className="text-white text-xl">Verificando permisos...</div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-700 flex items-center justify-center">
        <div className="bg-red-900 border border-red-600 text-white px-8 py-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p>{message?.text}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-8 mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-400">
              Extender período de trial para usuarios
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Sesión iniciada como: <span className="text-purple-400 font-medium">{currentUser}</span>
            </p>
          </div>

          {/* Mensaje de estado */}
          {message && (
            <div
              className={`p-4 rounded-lg mb-6 ${
                message.type === 'success'
                  ? 'bg-green-900 border-2 border-green-600 text-green-100'
                  : 'bg-red-900 border-2 border-red-600 text-red-100'
              }`}
            >
              {message.text}
            </div>
          )}

          {/* Formulario */}
          <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-8">
            <form onSubmit={handleExtendTrial} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-xl font-medium text-white mb-2">
                  Email del Usuario
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full px-4 py-3 bg-gray-600 border-2 border-gray-500 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  placeholder="usuario@ejemplo.com"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Email exacto del usuario registrado en la plataforma
                </p>
              </div>

              <div>
                <label htmlFor="days" className="block text-xl font-medium text-white mb-2">
                  Días Adicionales
                </label>
                <input
                  type="number"
                  id="days"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  required
                  min="1"
                  max="365"
                  className="block w-full px-4 py-3 bg-gray-600 border-2 border-gray-500 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
                  placeholder="30"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Número de días que se agregarán al trial actual (máximo 365)
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-6 rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? 'Procesando...' : 'Extender Trial'}
                </button>
              </div>
            </form>
          </div>

          {/* Información adicional */}
          <div className="bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 mt-6">
            <h3 className="text-lg font-semibold text-white mb-3">ℹ️ Información Importante</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>• Los días se suman a la fecha de expiración actual del usuario</li>
              <li>• Si el trial ya expiró, se suma desde la fecha de hoy</li>
              <li>• El cambio es inmediato y el usuario verá el nuevo período activo</li>
              <li>• Esta acción queda registrada en los logs del servidor</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
}
