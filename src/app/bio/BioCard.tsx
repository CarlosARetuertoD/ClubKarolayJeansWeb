'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_URL, BUSINESS } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { supabase } from '@/lib/supabase'

type ClienteData = { nombre: string; email: string } | null

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
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const { data } = await supabase
          .from('web_clientes')
          .select('nombre, email')
          .eq('auth_uid', session.user.id)
          .single()
        if (data) {
          setCliente(data)
          localStorage.setItem('ckj_cliente_id', session.user.id)
        }
      }
      setLoading(false)
    }
    checkSession()
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
            {cliente ? 'Miembro VIP' : 'Miembro VIP'}
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
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 text-white transition-all duration-150 overflow-hidden"
            style={{ background: 'rgba(32,30,30,0.96)', border: '1px solid rgba(155,109,83,0.7)', boxShadow: '0 10px 22px rgba(0,0,0,0.6)' }}
          >
            <div className="absolute inset-0 left-0 w-[82px] rounded-l-2xl opacity-90 -z-0" style={{ background: 'linear-gradient(135deg, #ddb153, #9b6d53)' }} />
            <span className="absolute -top-2 right-10 px-2.5 py-1 rounded-full text-[0.66rem] font-bold tracking-[0.08em] uppercase text-white backdrop-blur-md promo-badge" style={{ background: 'rgba(17,10,6,0.55)', border: '1px solid rgba(221,177,83,0.55)' }}>
              PROMO DEL MES
            </span>
            <span className="relative w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] bg-transparent flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            </span>
            <span className="relative flex-1 text-left pl-0.5">
              <span className="block text-[0.95rem] font-semibold">Promociones del mes</span>
              <span className="block text-[0.78rem] opacity-85 mt-0.5">Descuentos especiales para el Club</span>
            </span>
            <span className="relative text-white/90"><Chevron /></span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => handleClick('whatsapp', `${WHATSAPP_URL}?text=Hola%20Club%20Karolay%20Jeans%2C%20vengo%20desde%20su%20tarjeta%20digital%20QR.%20Quiero%20m%C3%A1s%20informaci%C3%B3n`, true)}
            className="group relative flex items-center w-full rounded-2xl px-3 py-2.5 transition-all duration-150 hover:-translate-y-px active:translate-y-0"
            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.4)', color: '#e9fff3' }}
          >
            <span className="w-[38px] h-[38px] rounded-[14px] flex items-center justify-center mr-[10px] flex-shrink-0" style={{ background: 'rgba(37,211,102,0.16)' }}>
              <svg className="w-5 h-5 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
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
              <span className="block text-[0.78rem] opacity-85 mt-0.5">Ver ubicación en el mapa</span>
            </span>
            <ExternalArrow />
          </button>
        </nav>

        {/* ── Login/Register CTA (if not logged in) ── */}
        {!loading && !cliente && (
          <div className="flex flex-col gap-2 mb-4">
            <Link
              href="/login"
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
