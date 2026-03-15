'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { trackClick } from '@/lib/tracking'
import { BUSINESS } from '@/lib/constants'

type Step = 'form' | 'loading' | 'success' | 'error'

export default function RegistroForm() {
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    celular: '',
    email: '',
    password: '',
  })

  const handleGoogleLogin = async () => {
    trackClick('registro', 'google_login', '/registro')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/registro?auth=success`,
      },
    })
    if (error) {
      setError('Error al conectar con Google. Intenta de nuevo.')
      setStep('error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading')
    setError('')

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      })

      if (authError) throw new Error(authError.message)

      // 2. Save client data
      const { error: dbError } = await supabase.from('web_clientes').insert({
        nombre: form.nombre,
        celular: form.celular,
        email: form.email,
        auth_provider: 'email',
        auth_uid: authData.user?.id || null,
      })

      if (dbError) throw new Error(dbError.message)

      // 3. Save client ID for tracking
      if (authData.user?.id) {
        localStorage.setItem('ckj_cliente_id', authData.user.id)
      }

      trackClick('registro', 'email_registro_ok', '/registro')
      setStep('success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error inesperado'
      setError(message)
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
          <h1 className="font-heading text-2xl font-bold text-white">Únete al Club</h1>
          <p className="text-white/60 text-sm mt-2">
            Regístrate y accede a descuentos exclusivos, promos y novedades antes que nadie.
          </p>
        </header>

        {step === 'success' ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-heading font-bold text-white mb-2">¡Bienvenido al Club!</h2>
            <p className="text-white/60 text-sm mb-6">
              Ya eres miembro de Club Karolay Jeans. Muestra tu tarjeta digital en tienda para tus descuentos.
            </p>
            <Link
              href="/bio"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-mocha-500 text-white rounded-full font-heading font-semibold hover:scale-105 transition-transform"
            >
              Ver mi tarjeta digital
            </Link>
          </div>
        ) : (
          <>
            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white rounded-xl text-mocha-950 font-medium hover:bg-gray-100 transition-colors mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Registrarse con Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-white/40 text-xs uppercase tracking-wider">o con tu correo</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Nombre completo</label>
                <input
                  type="text"
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Celular</label>
                <input
                  type="tel"
                  required
                  value={form.celular}
                  onChange={(e) => setForm({ ...form, celular: e.target.value })}
                  placeholder="940 824 283"
                  className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                />
              </div>
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
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Mínimo 6 caracteres"
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
                {step === 'loading' ? 'Registrando...' : 'Crear mi cuenta'}
              </button>
            </form>

            <p className="text-center mt-5 text-white/50 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link href="/login" className="text-mocha-500 hover:text-mocha-400 font-semibold transition-colors">
                Iniciar Sesión
              </Link>
            </p>
            <p className="text-white/40 text-xs text-center mt-3">
              Al registrarte aceptas recibir novedades y promos de Club Karolay Jeans.
            </p>
          </>
        )}
      </section>
    </main>
  )
}
