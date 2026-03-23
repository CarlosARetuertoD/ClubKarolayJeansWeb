'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'
import { supabase } from '@/lib/supabase'
import { BUSINESS, SITE_URL } from '@/lib/constants'

type CodigoPromo = {
  id: string
  codigo: string
  tipo: string
  descuento: string
  descripcion: string | null
  cliente_id: string | null
  activo: boolean
  fecha_fin: string | null
  canjeado: boolean
  fecha_canje: string | null
  // added by frontend
  ya_canjeado_por_mi: boolean
}

export default function MisCodigosContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [codigos, setCodigos] = useState<CodigoPromo[]>([])
  const [qrData, setQrData] = useState<{ codigoId: string; qrUrl: string; expiresAt: string } | null>(null)
  const [generando, setGenerando] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    let found = false

    async function loadCodigos(userId: string) {
      if (found) return
      found = true

      // Try to get client ID from web_clientes
      const { data: cliente } = await supabase
        .from('web_clientes')
        .select('id')
        .eq('auth_uid', userId)
        .maybeSingle()

      const clienteId = cliente?.id
      if (!clienteId) {
        setLoading(false)
        return
      }

      // Fetch codes via API (bypasses RLS, handles global + personal)
      const res = await fetch(`/api/mis-codigos?cliente_id=${clienteId}`)
      const result = await res.json()

      if (result.codigos) setCodigos(result.codigos)
      setLoading(false)
    }

    // Try existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadCodigos(session.user.id)
      }
    })

    // Listen for session restore
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadCodigos(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login?redirect=/mis-codigos')
      }
    })

    // Timeout — if no session after 5s, redirect to login
    const timeout = setTimeout(() => {
      if (!found) router.replace('/login?redirect=/mis-codigos')
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  // Countdown timer for QR
  useEffect(() => {
    if (!qrData) return
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(qrData.expiresAt).getTime() - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) {
        setQrData(null)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [qrData])

  const handleCanjear = useCallback(async (codigoId: string) => {
    setGenerando(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const { data: cliente } = await supabase
        .from('web_clientes')
        .select('id')
        .eq('auth_uid', session?.user?.id || '')
        .maybeSingle()

      const res = await fetch('/api/canje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_promo_id: codigoId, cliente_id: cliente?.id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Generate QR
      const canjeUrl = `${SITE_URL}/canjear/${data.token}`
      const qrUrl = await QRCode.toDataURL(canjeUrl, {
        width: 280,
        margin: 2,
        color: { dark: '#1a1310', light: '#ffffff' },
      })

      setQrData({ codigoId, qrUrl, expiresAt: data.expires_at })
      setTimeLeft(Math.max(0, Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al generar QR')
    }
    setGenerando(false)
  }, [])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const isVigente = (c: CodigoPromo) => c.activo && !c.ya_canjeado_por_mi && (!c.fecha_fin || new Date(c.fecha_fin) >= new Date())
  const isVencido = (c: CodigoPromo) => !c.ya_canjeado_por_mi && c.fecha_fin && new Date(c.fecha_fin) < new Date()

  if (loading) {
    return (
      <main className="bg-dark-radial min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-mocha-500/30 border-t-mocha-500 rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="bg-dark-radial min-h-screen">
      {/* Nav */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={40} height={40} className="h-9 w-auto" />
        </Link>
        <Link href="/bio" className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        <h1 className="text-2xl font-heading font-bold text-white mb-2">Mis códigos</h1>
        <p className="text-white/50 text-sm mb-8">Tus descuentos exclusivos como miembro del Club.</p>

        {/* QR Modal overlay */}
        {qrData && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setQrData(null)}>
            <div
              className="bg-white rounded-3xl p-6 max-w-sm w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-mocha-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-mocha-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>

              <p className="text-mocha-950 font-heading font-bold text-lg mb-1">Muestra este QR al vendedor</p>
              <p className="text-gray-500 text-sm mb-4">El vendedor escaneará este código para aplicar tu descuento.</p>

              <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                <img src={qrData.qrUrl} alt="QR de canje" className="mx-auto" />
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                timeLeft > 60 ? 'bg-green-50 text-green-700' : timeLeft > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {timeLeft > 0 ? `Expira en ${formatTime(timeLeft)}` : 'QR expirado'}
              </div>

              <p className="text-gray-400 text-xs">No compartas este QR. Es de un solo uso.</p>

              <button
                onClick={() => setQrData(null)}
                className="mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl mb-4">{error}</p>
        )}

        {codigos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
              </svg>
            </div>
            <p className="text-white/40 text-sm">Aún no tienes códigos de descuento.</p>
            <p className="text-white/25 text-xs mt-1">Cuando recibas uno, aparecerá aquí.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {codigos.map((codigo) => (
              <div
                key={codigo.id}
                className="bg-card-radial rounded-2xl p-5 border border-white/6"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-heading font-bold text-lg">{codigo.descuento}</p>
                    {codigo.descripcion && (
                      <p className="text-white/50 text-sm mt-0.5">{codigo.descripcion}</p>
                    )}
                  </div>
                  {codigo.ya_canjeado_por_mi ? (
                    <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold bg-white/5 text-white/30">
                      Canjeado
                    </span>
                  ) : isVencido(codigo) ? (
                    <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold bg-red-500/10 text-red-400/70">
                      Vencido
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[0.68rem] font-semibold uppercase tracking-wider" style={{ background: 'linear-gradient(135deg, #ddb153, #9b6d53)', color: '#1a1310' }}>
                      Disponible
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 text-white/30 text-xs mb-4">
                  <span className="capitalize">{codigo.tipo === 'cumpleanos' ? 'Cumpleaños' : codigo.tipo === 'bienvenida' ? 'Bienvenida' : 'Campaña'}</span>
                  {codigo.fecha_fin && (
                    <>
                      <span>·</span>
                      <span>Válido hasta {new Date(codigo.fecha_fin).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </>
                  )}
                </div>

                {isVigente(codigo) && (
                  <button
                    onClick={() => handleCanjear(codigo.id)}
                    disabled={generando}
                    className="w-full py-3 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {generando ? 'Generando QR...' : 'Canjear en tienda'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
