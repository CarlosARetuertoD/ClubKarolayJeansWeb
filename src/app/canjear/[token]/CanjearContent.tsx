'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type CanjeResult = {
  status: 'success' | 'used' | 'expired' | 'invalid' | 'error' | 'loading'
  codigo?: string
  descuento?: string
  descripcion?: string
  tipo?: string
  cliente?: string
  error?: string
}

export default function CanjearContent({ token }: { token: string }) {
  const [result, setResult] = useState<CanjeResult>({ status: 'loading' })

  useEffect(() => {
    async function validarToken() {
      try {
        const res = await fetch(`/api/canje?token=${token}`)
        const data = await res.json()

        if (res.ok) {
          setResult({
            status: 'success',
            codigo: data.codigo,
            descuento: data.descuento,
            descripcion: data.descripcion,
            tipo: data.tipo,
            cliente: data.cliente,
          })
        } else {
          setResult({
            status: data.status || 'error',
            error: data.error,
          })
        }
      } catch {
        setResult({ status: 'error', error: 'Error de conexión.' })
      }
    }

    validarToken()
  }, [token])

  return (
    <main className="min-h-screen flex items-center justify-center p-4" style={{
      background: result.status === 'success'
        ? 'linear-gradient(135deg, #1a4d2e 0%, #0f2b1a 100%)'
        : 'radial-gradient(circle at top, rgba(32,30,30,0.9) 0, rgba(11,9,8,0.98) 100%)',
    }}>
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <Image
          src="/images/logo/logoKarolay.png"
          alt="Club Karolay Jeans"
          width={60}
          height={60}
          className="mx-auto h-12 w-auto mb-6 opacity-60"
        />

        {result.status === 'loading' && (
          <div>
            <div className="w-12 h-12 mx-auto border-2 border-white/20 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white/60">Verificando código...</p>
          </div>
        )}

        {result.status === 'success' && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-green-500/20">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-3xl font-heading font-bold text-white mb-2">Código canjeado</h1>

            <div className="bg-white/10 rounded-2xl p-5 my-5">
              <p className="text-green-300 font-heading font-bold text-2xl mb-1">{result.descuento}</p>
              {result.descripcion && (
                <p className="text-white/60 text-sm">{result.descripcion}</p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/50">
                <span>Cliente</span>
                <span className="text-white font-medium">{result.cliente}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Código</span>
                <span className="text-white/70 font-mono text-xs">{result.codigo}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Tipo</span>
                <span className="text-white/70 capitalize">{result.tipo === 'cumpleanos' ? 'Cumpleaños' : result.tipo}</span>
              </div>
              <div className="flex justify-between text-white/50">
                <span>Fecha</span>
                <span className="text-white/70">{new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <p className="text-green-400/50 text-xs mt-6">Aplicar el descuento correspondiente a esta compra.</p>
          </div>
        )}

        {result.status === 'expired' && (
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="w-20 h-20 mx-auto rounded-full bg-yellow-500/10 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-yellow-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">QR expirado</h1>
            <p className="text-white/50 text-sm">{result.error}</p>
          </div>
        )}

        {result.status === 'used' && (
          <div className="bg-white/5 rounded-3xl p-8 border border-white/10">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Código ya usado</h1>
            <p className="text-white/50 text-sm">{result.error}</p>
          </div>
        )}

        {(result.status === 'invalid' || result.status === 'error') && (
          <div className="bg-white/5 rounded-3xl p-8 border border-red-500/10">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-5">
              <svg className="w-10 h-10 text-red-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-heading font-bold text-white mb-2">Código inválido</h1>
            <p className="text-white/50 text-sm">{result.error || 'Este QR no es válido.'}</p>
          </div>
        )}
      </div>
    </main>
  )
}
