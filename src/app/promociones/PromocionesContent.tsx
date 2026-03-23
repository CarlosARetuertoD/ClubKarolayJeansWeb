'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import QRCode from 'qrcode'
import { BUSINESS, PROMOS_DATA, WHATSAPP_URL, SITE_URL } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { supabase } from '@/lib/supabase'

type CodigoPromo = {
  id: string
  codigo: string
  tipo: string
  descuento: string
  descripcion: string | null
  cliente_id: string | null
  activo: boolean
  fecha_fin: string | null
  ya_canjeado_por_mi: boolean
}

export default function PromocionesContent() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [clienteId, setClienteId] = useState<string | null>(null)
  const [codigos, setCodigos] = useState<CodigoPromo[]>([])
  const [qrData, setQrData] = useState<{ codigoId: string; qrUrl: string; expiresAt: string } | null>(null)
  const [generando, setGenerando] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const promo = PROMOS_DATA[0]

  useEffect(() => {
    let found = false

    async function load(userId: string) {
      if (found) return
      found = true
      setLoggedIn(true)

      const { data: cliente } = await supabase
        .from('web_clientes')
        .select('id')
        .eq('auth_uid', userId)
        .maybeSingle()

      if (cliente?.id) {
        setClienteId(cliente.id)
        const res = await fetch(`/api/mis-codigos?cliente_id=${cliente.id}`)
        const result = await res.json()
        if (result.codigos) setCodigos(result.codigos)
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        load(session.user.id)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        load(session.user.id)
      }
    })

    const timeout = setTimeout(() => {
      if (!found) setLoading(false)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  // QR countdown
  useEffect(() => {
    if (!qrData) return
    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.floor((new Date(qrData.expiresAt).getTime() - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) setQrData(null)
    }, 1000)
    return () => clearInterval(interval)
  }, [qrData])

  const handleCanjear = useCallback(async (codigoId: string) => {
    setGenerando(true)
    try {
      const res = await fetch('/api/canje', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_promo_id: codigoId, cliente_id: clienteId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const canjeUrl = `${SITE_URL}/canjear/${data.token}`
      const qrUrl = await QRCode.toDataURL(canjeUrl, {
        width: 280, margin: 2,
        color: { dark: '#1a1310', light: '#ffffff' },
      })
      setQrData({ codigoId, qrUrl, expiresAt: data.expires_at })
      setTimeLeft(Math.max(0, Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)))
    } catch {
      // silent
    }
    setGenerando(false)
  }, [clienteId])

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  const codigosDisponibles = codigos.filter(c => c.activo && !c.ya_canjeado_por_mi && (!c.fecha_fin || new Date(c.fecha_fin) >= new Date()))

  if (loading) {
    return (
      <main className="bg-mocha-950 min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-mocha-500/30 border-t-mocha-500 rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="bg-mocha-950 min-h-screen text-white">
      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-mocha-950/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={40} height={40} className="h-9 w-auto" />
            <span className="text-white/90 font-heading text-xs font-semibold tracking-wider uppercase hidden sm:inline">{BUSINESS.name}</span>
          </Link>
          <Link href="/" className="text-white/50 text-xs font-heading uppercase tracking-wider hover:text-white transition-colors">
            Volver al inicio
          </Link>
        </div>
      </nav>

      {/* ── QR Modal ── */}
      {qrData && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setQrData(null)}>
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
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
            <button onClick={() => setQrData(null)} className="mt-4 text-gray-400 text-sm hover:text-gray-600 transition-colors">Cerrar</button>
          </div>
        </div>
      )}

      {/* ── Hero — Promo principal ── */}
      <section className="relative min-h-screen flex items-center pt-16">
        <Image src={promo.imagen} alt={promo.titulo} fill className="object-cover opacity-20" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-mocha-950 via-mocha-950/60 to-mocha-950/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-mocha-950/90 via-transparent to-mocha-950/90" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 w-full text-center py-20">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-px bg-mocha-500/50" />
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[0.65rem] font-heading font-bold uppercase tracking-[3px] animate-pulse-glow"
              style={{ background: `${promo.color}15`, color: promo.color, border: `1px solid ${promo.color}40` }}
            >
              {promo.badge}
            </span>
            <div className="w-10 h-px bg-mocha-500/50" />
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading text-white leading-[0.85] mb-4">
            <span className="font-light">{promo.titulo}</span><br />
            <span className="font-extrabold text-mocha-500">{promo.subtitulo}</span>
          </h1>

          <div className="w-16 h-px bg-mocha-500/50 mx-auto my-8" />

          <p className="text-white/45 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-10">
            {promo.detalle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`${WHATSAPP_URL}?text=Hola%2C%20quiero%20ver%20la%20nueva%20temporada`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('whatsapp', `promo_page_${promo.slug}`, '/promociones')}
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm shadow-xl"
            >
              {promo.cta}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
            <Link
              href={`/promo/${promo.slug}`}
              onClick={() => trackClick('promo', promo.slug, '/promociones')}
              className="inline-flex items-center px-8 py-4 border border-white/15 text-white/60 font-heading font-medium rounded-full hover:bg-white/5 hover:text-white transition-all text-sm"
            >
              Ver detalle completo
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1.5s' }}>
          <span className="text-white/30 text-[0.6rem] font-heading uppercase tracking-[3px]">Más ofertas</span>
          <svg className="w-4 h-4 text-white/30 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </section>

      {/* ── Sección Club VIP — cambia según estado ── */}
      <section className="py-20 sm:py-28 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="relative rounded-3xl overflow-hidden border border-gold/10" style={{ background: 'linear-gradient(160deg, #1c1714 0%, #201e1e 50%, #1a1510 100%)' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #ddb153, transparent 70%)' }} />
            </div>

            <div className="relative z-10 p-8 sm:p-14 md:p-16">
              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full border border-gold/25 flex items-center justify-center bg-gold/5">
                    <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <span className="text-gold/40 text-xs font-heading uppercase tracking-[4px]">
                    {loggedIn ? 'Tus descuentos' : 'Exclusivo para miembros'}
                  </span>
                </div>

                {loggedIn ? (
                  <>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[0.9] mb-4">
                      Tus <span className="text-gold">Descuentos</span>
                    </h2>
                    <div className="w-12 h-px bg-gold/30 my-6" />

                    {codigosDisponibles.length > 0 ? (
                      <>
                        <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                          Tienes {codigosDisponibles.length} {codigosDisponibles.length === 1 ? 'código disponible' : 'códigos disponibles'}. Genera el QR y muéstralo al vendedor en tienda para que aplique tu descuento.
                        </p>
                        <div className="flex flex-col gap-3 mb-6">
                          {codigosDisponibles.map((c) => (
                            <div key={c.id} className="flex items-center justify-between rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(221,177,83,0.15)' }}>
                              <div>
                                <p className="text-gold font-heading font-bold text-lg">{c.descuento}</p>
                                {c.descripcion && <p className="text-white/40 text-sm mt-0.5">{c.descripcion}</p>}
                                <p className="text-white/20 text-xs mt-1 capitalize">
                                  {c.tipo === 'bienvenida' ? 'Bono de bienvenida' : c.tipo === 'cumpleanos' ? 'Cumpleaños' : 'Promoción'}
                                  {c.fecha_fin && ` · Válido hasta ${new Date(c.fecha_fin).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}`}
                                </p>
                              </div>
                              <button
                                onClick={() => handleCanjear(c.id)}
                                disabled={generando}
                                className="px-5 py-2.5 bg-gradient-to-r from-gold to-gold-dark text-mocha-950 font-heading font-bold rounded-full text-sm hover:scale-105 transition-transform disabled:opacity-50 whitespace-nowrap"
                              >
                                {generando ? 'Generando...' : 'Canjear en tienda'}
                              </button>
                            </div>
                          ))}
                        </div>
                        <Link href="/mis-codigos" className="inline-flex items-center gap-2 text-gold/50 text-sm font-heading hover:text-gold transition-colors">
                          Ver todos mis códigos
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                      </>
                    ) : (
                      <>
                        <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-8 max-w-lg">
                          No tienes códigos disponibles por el momento. Cuando haya nuevas promociones o descuentos, aparecerán aquí listos para canjear.
                        </p>
                        <Link href="/mis-codigos" className="inline-flex items-center gap-2 text-gold/50 text-sm font-heading hover:text-gold transition-colors">
                          Ver historial de códigos
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[0.9] mb-4">
                      Crea tu cuenta <span className="text-gold">gratis</span>
                    </h2>
                    <div className="w-12 h-px bg-gold/30 my-6" />
                    <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-4 max-w-lg">
                      Al crear tu cuenta en el Club Karolay Jeans recibes un <strong className="text-gold/80">bono de bienvenida con 10% OFF</strong> en tu primera compra. Además accedes a descuentos exclusivos y promos que solo los miembros del Club pueden ver.
                    </p>

                    <div className="flex flex-wrap gap-4 mb-10">
                      {['10% OFF de bienvenida', 'Descuentos exclusivos', 'Promociones anticipadas'].map((b) => (
                        <span key={b} className="flex items-center gap-2 text-gold/70 text-sm font-heading">
                          <svg className="w-4 h-4 text-gold/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                          </svg>
                          {b}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/registro"
                        onClick={() => trackClick('promo', 'registro-desde-promos', '/promociones')}
                        className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-gold to-gold-dark text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm shadow-lg shadow-gold/20"
                      >
                        Crear mi cuenta gratis
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </Link>
                      <Link
                        href="/login?redirect=/promociones"
                        className="inline-flex items-center justify-center px-8 py-4 border border-gold/20 text-gold/60 font-heading font-medium rounded-full hover:bg-gold/5 hover:text-gold transition-all text-sm"
                      >
                        Ya tengo cuenta
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <div className="mt-16 text-center">
            <p className="text-white/30 text-xs font-heading uppercase tracking-[4px] mb-4">¿Tienes alguna pregunta?</p>
            <a
              href={`${WHATSAPP_URL}?text=Hola%2C%20quiero%20saber%20las%20promos%20vigentes`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('whatsapp', 'promos_page_cta', '/promociones')}
              className="group inline-flex items-center gap-2 text-[#25d366] font-heading font-semibold text-sm hover:text-[#2be672] transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Escríbenos por WhatsApp
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
