'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_URL, BUSINESS } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { supabase } from '@/lib/supabase'

type ClienteData = { nombre: string; email: string; created_at: string } | null

export default function BioCard() {
  const searchParams = useSearchParams()
  const [cliente, setCliente] = useState<ClienteData>(null)
  const [loading, setLoading] = useState(true)

  // Track QR ref source
  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) {
      trackClick('qr_scan', ref, '/bio', { ref })
    }
  }, [searchParams])

  // Check if user is logged in
  useEffect(() => {
    let found = false

    async function loadCliente(session: { user: { id: string; email?: string; user_metadata?: Record<string, unknown>; created_at?: string } }) {
      if (found) return
      found = true
      const user = session.user
      localStorage.setItem('ckj_cliente_id', user.id)

      // Try to get full profile from web_clientes
      const { data } = await supabase
        .from('web_clientes')
        .select('nombre, email, created_at')
        .eq('auth_uid', user.id)
        .maybeSingle()

      if (data) {
        setCliente(data)
      } else {
        // RLS blocks the query — fall back to auth session data
        const nombre = (user.user_metadata?.nombre as string)
          || (user.user_metadata?.full_name as string)
          || (user.user_metadata?.name as string)
          || user.email?.split('@')[0]
          || 'Miembro'
        setCliente({
          nombre,
          email: user.email || '',
          created_at: user.created_at || '',
        })
      }
      setLoading(false)
    }

    // Try existing session first
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadCliente(session)
      }
    })

    // Listen for session restore
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadCliente(session)
      } else if (event === 'SIGNED_OUT') {
        setCliente(null)
        setLoading(false)
      }
    })

    // Safety timeout
    const timeout = setTimeout(() => {
      if (!found) setLoading(false)
    }, 5000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const handleClick = (action: string, href: string, external: boolean) => {
    trackClick('bio_btn', action, '/bio')
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer')
    } else {
      window.location.href = href
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6" style={{
      background: 'radial-gradient(circle at top, rgba(32,30,30,0.9) 0, rgba(25,22,20,0.96) 55%, rgba(11,9,8,0.98) 100%)',
    }}>
      <section className="w-full max-w-[430px] rounded-3xl p-5 sm:p-6" style={{
        background: 'radial-gradient(circle at top left, #201e1e, #252626 55%, #181515)',
        boxShadow: '0 18px 45px rgba(0,0,0,0.7)',
        border: '1px solid rgba(255,255,255,0.04)',
      }}>

        {/* ── Header ── */}
        <header className="text-center mb-5">
          <div className="w-[120px] h-[120px] mx-auto mb-3 flex items-center justify-center">
            <Image
              src="/images/logo/logoKarolay.png"
              alt={BUSINESS.name}
              width={120}
              height={120}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
          <h1 className="font-heading text-[1.5rem] font-bold tracking-[0.06em] uppercase text-white leading-tight">
            Club Karolay Jeans
          </h1>
          <p className="text-white/80 text-[0.9rem] mt-1">Tu tarjeta digital de fidelización</p>
        </header>

        {/* ── Personalized greeting or VIP badge ── */}
        <div className="relative rounded-[14px] px-3 py-2.5 mb-[18px]" style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          <span className="absolute -top-3 right-3 px-2.5 py-1 rounded-full text-[0.68rem] font-semibold uppercase tracking-[0.08em]" style={{
            background: 'linear-gradient(135deg, #ddb153, #9b6d53)',
          }}>
            {cliente ? 'Miembro VIP' : 'Club VIP'}
          </span>

          {!loading && cliente ? (
            <div>
              <p className="text-gold font-heading font-bold text-base mb-0.5">
                Hola, {cliente.nombre.split(' ')[0]}
              </p>
              <p className="text-[0.82rem] leading-[1.5] text-white">
                Muestra esta pantalla en tienda y accede a tus{' '}
                <strong className="text-[#9b6d53] font-semibold">descuentos de miembro</strong>.
              </p>
              {cliente.created_at && (
                <p className="text-[0.72rem] text-white/40 mt-1">
                  Miembro desde {new Date(cliente.created_at).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          ) : (
            <p className="text-[0.82rem] leading-[1.5] text-white">
              Muestra esta pantalla en tienda y accede a{' '}
              <strong className="text-[#9b6d53] font-semibold">descuentos especiales en tus compras</strong>.
            </p>
          )}
        </div>

        {/* ── Menu buttons ── */}
        <nav className="flex flex-col gap-[10px] mb-[18px]">

          {/* Catálogo - primary */}
          <button
            onClick={() => handleClick('catalogo', '/catalogo', false)}
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 text-white transition-all duration-150 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'linear-gradient(135deg, #9b6d53, #7a5240)', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.6)' }}
          >
            <span className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] bg-transparent flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[0.95rem] font-semibold">Ver catálogo y novedades</span>
              <span className="block text-[0.78rem] opacity-85 mt-0.5">Modelos actuales y nuevas colecciones</span>
            </span>
            <Chevron />
          </button>

          {/* Promos - accent */}
          <button
            onClick={() => handleClick('promos', '/promociones', false)}
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 text-white transition-all duration-200 hover:-translate-y-px active:translate-y-0 overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(221,177,83,0.1), rgba(155,109,83,0.06))',
              border: '1px solid rgba(221,177,83,0.4)',
              boxShadow: '0 10px 22px rgba(0,0,0,0.6), inset 0 1px 0 rgba(221,177,83,0.12)',
            }}
          >
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, rgba(221,177,83,0.06), transparent)' }} />
            <span className="relative w-[38px] h-[38px] rounded-[12px] flex items-center justify-center mr-[10px] flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ddb153, #9b6d53)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </span>
            <span className="relative flex-1 text-left">
              <span className="flex items-center gap-2">
                <span className="block text-[0.95rem] font-semibold" style={{ color: '#f0ddb8' }}>Promociones del mes</span>
                <span className="px-1.5 py-[2px] rounded text-[0.6rem] font-bold uppercase tracking-wider" style={{ background: 'linear-gradient(135deg, #ddb153, #b8863a)', color: '#1a1310' }}>Promo</span>
              </span>
              <span className="block text-[0.78rem] text-white/65 mt-0.5">Descuentos especiales para miembros del Club</span>
            </span>
            <Chevron />
          </button>

          {/* Mis códigos — solo si logueado */}
          {!loading && cliente && (
            <button
              onClick={() => handleClick('mis_codigos', '/mis-codigos', false)}
              className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 text-white transition-all duration-150 hover:-translate-y-px active:translate-y-0"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] bg-black/20 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
              </span>
              <span className="flex-1 text-left">
                <span className="block text-[0.95rem] font-semibold">Mis códigos de descuento</span>
                <span className="block text-[0.78rem] opacity-85 mt-0.5">Canjea tus promos en tienda</span>
              </span>
              <Chevron />
            </button>
          )}

          {/* WhatsApp */}
          <button
            onClick={() => handleClick('whatsapp', `${WHATSAPP_URL}?text=Hola%20Club%20Karolay%20Jeans%2C%20vengo%20desde%20su%20tarjeta%20digital%20QR.%20Quiero%20m%C3%A1s%20informaci%C3%B3n`, true)}
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 transition-all duration-150 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.4)', color: '#e9fff3' }}
          >
            <span className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] flex-shrink-0" style={{ background: 'rgba(37,211,102,0.16)' }}>
              <svg className="w-5 h-5 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[0.95rem] font-semibold">Escríbenos por WhatsApp</span>
              <span className="block text-[0.78rem] opacity-85 mt-0.5">Consultas, tallas y reservas rápidas</span>
            </span>
            <ExternalArrow className="text-[#e9fff3]/90" />
          </button>

          {/* Redes */}
          <button
            onClick={() => handleClick('redes', BUSINESS.social.instagram, true)}
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 text-white transition-all duration-150 hover:-translate-y-px active:translate-y-0 bg-transparent"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] bg-black/20 flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[0.95rem] font-semibold">Síguenos en redes</span>
              <span className="block text-[0.78rem] opacity-85 mt-0.5">Instagram, TikTok y Facebook</span>
            </span>
            <ExternalArrow />
          </button>

          {/* Ubicación */}
          <button
            onClick={() => handleClick('ubicacion', '/mapa', false)}
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 text-white transition-all duration-150 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <span className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] bg-black/20 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </span>
            <span className="flex-1 text-left">
              <span className="block text-[0.95rem] font-semibold">¿Dónde estamos?</span>
              <span className="block text-[0.78rem] opacity-85 mt-0.5">Ver mapa del centro comercial</span>
            </span>
            <ExternalArrow />
          </button>
        </nav>

        {/* ── Login/Register CTA (if not logged in) ── */}
        {!loading && !cliente && (
          <div className="flex flex-col gap-2 mb-4">
            <Link
              href="/login?redirect=/bio"
              className="block text-center py-3 rounded-2xl text-sm font-heading font-semibold transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #ddb153, #9b6d53)', color: '#fff' }}
            >
              Iniciar Sesión — Accede a tus descuentos
            </Link>
            <Link
              href="/registro"
              className="block text-center py-2.5 rounded-2xl text-xs font-heading font-medium text-white/50 transition-all hover:text-white/70"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            >
              ¿No tienes cuenta? Regístrate gratis
            </Link>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="text-center text-[0.78rem] text-white/80 pt-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="font-semibold mb-1">Tarjeta del Club Karolay Jeans</p>
          <p className="opacity-80">Guarda este enlace o QR para tus próximas visitas.</p>
          {!loading && cliente && (
            <button
              onClick={async () => {
                await supabase.auth.signOut()
                localStorage.removeItem('ckj_cliente_id')
                setCliente(null)
              }}
              className="mt-3 text-white/25 text-[0.7rem] hover:text-white/50 transition-colors"
            >
              Cerrar sesión
            </button>
          )}
        </footer>
      </section>
    </main>
  )
}

function Chevron() {
  return (
    <span className="ml-2 text-white/70 flex items-center">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
    </span>
  )
}

function ExternalArrow({ className = 'text-white/70' }: { className?: string }) {
  return (
    <span className={`ml-2 flex items-center ${className}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" /></svg>
    </span>
  )
}
