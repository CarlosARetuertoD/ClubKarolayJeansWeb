'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BUSINESS } from '@/lib/constants'

type Step = 'form' | 'loading' | 'success' | 'error'

export default function LibroReclamacionesForm() {
  const [step, setStep] = useState<Step>('form')
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    celular: '',
    email: '',
    direccion: '',
    tipo: 'reclamo' as 'reclamo' | 'queja',
    detalle: '',
    pedido: '',
  })

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('loading')
    setError('')

    try {
      const { error: dbError } = await supabase.from('web_reclamaciones').insert({
        nombre: form.nombre,
        dni: form.dni,
        celular: form.celular,
        email: form.email || null,
        direccion: form.direccion || null,
        tipo: form.tipo,
        detalle: form.detalle,
        pedido: form.pedido,
        estado: 'pendiente',
      })

      if (dbError) throw new Error(dbError.message)
      setStep('success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al enviar'
      setError(message)
      setStep('error')
    }
  }

  return (
    <main className="bg-dark-radial min-h-screen">
      {/* Top bar */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={40} height={40} className="h-9 w-auto" />
          <span className="text-white font-heading text-sm font-semibold tracking-wider uppercase hidden sm:inline">
            {BUSINESS.name}
          </span>
        </Link>
        <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <div className="bg-card-radial rounded-2xl p-6 sm:p-10 border border-white/6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">Libro de Reclamaciones</h1>
              <p className="text-white/50 text-sm mt-1">
                Conforme al Código de Protección y Defensa del Consumidor (Ley N.° 29571)
              </p>
            </div>
          </div>

          {/* Provider info */}
          <div className="glass rounded-xl p-4 mb-6 text-sm text-white/70 space-y-1">
            <p><strong className="text-white/90">Razón Social:</strong> Negocios e Inversiones Karolay</p>
            <p><strong className="text-white/90">Dirección:</strong> {BUSINESS.address}, {BUSINESS.city}</p>
            <p><strong className="text-white/90">Teléfono:</strong> {BUSINESS.phone}</p>
          </div>

          {step === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-heading font-bold text-white mb-2">Reclamación registrada</h2>
              <p className="text-white/60 text-sm mb-2">
                Tu {form.tipo} ha sido registrado correctamente. Nos comprometemos a responder
                en un plazo máximo de 30 días calendario.
              </p>
              <p className="text-white/40 text-xs">
                Si necesitas seguimiento, comunícate al {BUSINESS.phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identification */}
              <fieldset>
                <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-3">
                  Datos del consumidor
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Nombre completo *" value={form.nombre} onChange={(v) => update('nombre', v)} required />
                  <Input label="DNI / CE *" value={form.dni} onChange={(v) => update('dni', v)} required />
                  <Input label="Celular *" type="tel" value={form.celular} onChange={(v) => update('celular', v)} required />
                  <Input label="Correo electrónico" type="email" value={form.email} onChange={(v) => update('email', v)} />
                </div>
                <div className="mt-4">
                  <Input label="Dirección" value={form.direccion} onChange={(v) => update('direccion', v)} />
                </div>
              </fieldset>

              {/* Type */}
              <fieldset>
                <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-3">
                  Tipo
                </legend>
                <div className="flex gap-4">
                  <label className={`flex-1 cursor-pointer rounded-xl p-4 border transition-all text-center ${
                    form.tipo === 'reclamo'
                      ? 'border-mocha-500 bg-mocha-500/10 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/20'
                  }`}>
                    <input
                      type="radio"
                      name="tipo"
                      value="reclamo"
                      checked={form.tipo === 'reclamo'}
                      onChange={() => update('tipo', 'reclamo')}
                      className="sr-only"
                    />
                    <p className="font-semibold text-sm">Reclamo</p>
                    <p className="text-xs mt-1 opacity-70">Disconformidad con el producto o servicio</p>
                  </label>
                  <label className={`flex-1 cursor-pointer rounded-xl p-4 border transition-all text-center ${
                    form.tipo === 'queja'
                      ? 'border-mocha-500 bg-mocha-500/10 text-white'
                      : 'border-white/10 text-white/50 hover:border-white/20'
                  }`}>
                    <input
                      type="radio"
                      name="tipo"
                      value="queja"
                      checked={form.tipo === 'queja'}
                      onChange={() => update('tipo', 'queja')}
                      className="sr-only"
                    />
                    <p className="font-semibold text-sm">Queja</p>
                    <p className="text-xs mt-1 opacity-70">Malestar respecto a la atención</p>
                  </label>
                </div>
              </fieldset>

              {/* Detail */}
              <fieldset>
                <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-3">
                  Detalle
                </legend>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Descripción del {form.tipo} *</label>
                    <textarea
                      required
                      rows={4}
                      value={form.detalle}
                      onChange={(e) => update('detalle', e.target.value)}
                      placeholder={`Describe tu ${form.tipo} con el mayor detalle posible...`}
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Pedido / solución esperada *</label>
                    <textarea
                      required
                      rows={2}
                      value={form.pedido}
                      onChange={(e) => update('pedido', e.target.value)}
                      placeholder="¿Qué solución esperas?"
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>
                </div>
              </fieldset>

              {step === 'error' && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">{error}</p>
              )}

              <button
                type="submit"
                disabled={step === 'loading'}
                className="w-full py-3.5 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {step === 'loading' ? 'Enviando...' : `Enviar ${form.tipo}`}
              </button>

              <p className="text-white/40 text-xs text-center">
                La empresa se compromete a dar respuesta en un plazo no mayor a 30 días calendario,
                conforme al artículo 24.1 del Código de Protección y Defensa del Consumidor.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

function Input({
  label, type = 'text', value, onChange, required,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean
}) {
  return (
    <div>
      <label className="block text-white/70 text-sm mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
      />
    </div>
  )
}
