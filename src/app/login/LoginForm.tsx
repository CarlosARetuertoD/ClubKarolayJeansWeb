'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { setSession, type ClubSession } from '@/lib/session'
import { BUSINESS } from '@/lib/constants'

type Step = 'form' | 'loading' | 'error'

export default function LoginForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  const getRedirect = () => {
    if (typeof window === 'undefined') return '/bio'
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect') || '/bio'
    return redirect.startsWith('/') ? redirect : '/bio'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading')
    setError('')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Correo o contraseña incorrectos.')
        setStep('error')
        return
      }

      setSession(data.cliente as ClubSession)
      router.push(getRedirect())
    } catch {
      setError('Error de conexión. Intenta de nuevo.')
      setStep('error')
    }
  }

  return (
    <main className="bg-dark-radial min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-card-radial rounded-3xl p-6 shadow-2xl shadow-black/70 border border-white/[0.04]">
        {/* Header */}
        <header className="text-center mb-6">
          <Link href="/">
            <Image
              src="/images/logo/logoKarolay.png"
              alt={BUSINESS.name}
              width={80}
              height={80}
              className="mx-auto h-16 w-auto mb-3"
            />
          </Link>
          <h1 className="font-heading text-2xl font-bold text-white">Iniciar Sesión</h1>
          <p className="text-white/60 text-sm mt-2">
            Accede a tu tarjeta digital y descuentos exclusivos.
          </p>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/70 text-sm mb-1.5">Correo electrónico</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1.5">Contraseña</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Tu contraseña"
              className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
            />
          </div>

          {step === 'error' && (
            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={step === 'loading'}
            className="w-full py-3.5 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {step === 'loading' ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="text-center mt-5 text-white/50 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/registro" className="text-mocha-500 hover:text-mocha-400 font-semibold transition-colors">
            Regístrate gratis
          </Link>
        </p>
      </section>
    </main>
  )
}
