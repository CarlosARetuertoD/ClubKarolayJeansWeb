'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { setSession, type ClubSession } from '@/lib/session'
import { trackClick } from '@/lib/tracking'
import { BUSINESS } from '@/lib/constants'
import { LEGAL_VERSION } from '@/lib/legal'

type Step = 'form' | 'loading' | 'success' | 'error'

function maxBirthDateFor18() {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().slice(0, 10)
}

export default function RegistroForm() {
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [legal, setLegal] = useState({ version: LEGAL_VERSION, terminos: false, whatsapp: false, email: false })
  const [form, setForm] = useState({
    nombre: '',
    celular: '',
    dni: '',
    fecha_nacimiento: '',
    genero: '' as '' | 'dama' | 'varon',
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading')
    setError('')

    try {
      // Crea la cuenta en RedelERP (cliente + contraseña + código de bienvenida)
      const regRes = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          celular: form.celular,
          dni: form.dni || null,
          fecha_nacimiento: form.fecha_nacimiento || null,
          genero: form.genero || null,
          email: form.email,
          password: form.password,
          legal,
        }),
      })
      const regData = await regRes.json()
      if (!regRes.ok) throw new Error(regData.error || 'Error al guardar datos')

      // Sesión iniciada de inmediato
      if (regData.cliente) setSession(regData.cliente as ClubSession)

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
            Regístrate y accede a descuentos exclusivos y beneficios del Club.
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
            <p className="text-white/60 text-sm mb-2">
              Tu cuenta ha sido creada exitosamente y ya iniciaste sesión.
            </p>
            <p className="text-white/40 text-xs mb-6">
              Revisa &quot;Mis códigos&quot; — te regalamos un código de bienvenida con descuento para tu primera compra.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/bio"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-mocha-500 text-white rounded-full font-heading font-semibold hover:scale-105 transition-transform"
              >
                Ver mi tarjeta digital
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 border border-white/15 text-white/60 rounded-full font-heading font-medium text-sm hover:bg-white/5 transition-all"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>
        ) : (
          <>
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
                  placeholder="993 084 496"
                  className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">DNI <span className="text-white/30">(opcional)</span></label>
                <input
                  type="text"
                  maxLength={8}
                  value={form.dni}
                  onChange={(e) => setForm({ ...form, dni: e.target.value.replace(/\D/g, '') })}
                  placeholder="12345678"
                  className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Fecha de nacimiento</label>
                  <input
                    type="date"
                    required
                    max={maxBirthDateFor18()}
                    value={form.fecha_nacimiento}
                    onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                    title="El registro autónomo es para mayores de 18 años."
                    className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Género <span className="text-white/30">(opcional)</span></label>
                  <select
                    value={form.genero}
                    onChange={(e) => setForm({ ...form, genero: e.target.value as '' | 'dama' | 'varon' })}
                    className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                  >
                    <option value="">Seleccionar</option>
                    <option value="dama">Dama</option>
                    <option value="varon">Varón</option>
                  </select>
                </div>
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

              <label className="flex items-start gap-2.5 text-white/55 text-xs leading-relaxed cursor-pointer">
                <input type="checkbox" required checked={legal.terminos} onChange={e => setLegal({ ...legal, terminos: e.target.checked })} className="mt-0.5 accent-[#9b6d53]" />
                <span>
                  He leído y acepto los <Link href="/terminos" className="text-mocha-500 hover:underline">Términos y Condiciones</Link> y declaro haber sido informado sobre la <Link href="/privacidad" className="text-mocha-500 hover:underline">Política de Privacidad</Link>.
                </span>
              </label>

              <label className="flex items-start gap-2.5 text-white/55 text-xs leading-relaxed cursor-pointer">
                <input type="checkbox" checked={legal.whatsapp} onChange={e => setLegal({ ...legal, whatsapp: e.target.checked, email: false })} className="mt-0.5 accent-[#9b6d53]" />
                <span>Quiero recibir promociones del Club por WhatsApp (opcional). Puedo retirar mi autorización gratuitamente desde Mi cuenta.</span>
              </label>

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
          </>
        )}
      </section>
    </main>
  )
}
