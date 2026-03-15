'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS, PROMOS_DATA, WHATSAPP_URL } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function PromocionesContent() {
  return (
    <main className="bg-dark min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-[50vh] sm:h-[60vh] min-h-[350px] flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-mocha-950 via-dark to-dark" />
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #ddb153 0%, transparent 70%)' }} />
        </div>

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={44} height={44} className="h-10 w-auto" />
            <span className="text-white font-heading text-xs sm:text-sm font-semibold tracking-wider uppercase hidden sm:inline">{BUSINESS.name}</span>
          </Link>
          <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Inicio
          </Link>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16 w-full text-center">
          <span className="text-gold/60 text-xs font-heading font-semibold uppercase tracking-[6px]">
            Ofertas especiales
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mt-4 leading-[0.9]">
            Promociones
          </h1>
          <p className="text-white/40 mt-4 max-w-md mx-auto text-sm sm:text-base">
            Descuentos, temporadas y ofertas exclusivas para ti.
          </p>
        </div>
      </section>

      {/* ── Promo cards — cada una con su propio estilo ── */}
      <PromoTemporada />
      <PromoClubVIP />

      {/* ── CTA final ── */}
      <section className="py-16 sm:py-20 bg-mocha-950 border-t border-white/5 text-center">
        <div className="max-w-lg mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
            ¿Buscas algo específico?
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Escríbenos y te contamos las promos vigentes, tallas disponibles y precios.
          </p>
          <a
            href={`${WHATSAPP_URL}?text=Hola%2C%20quiero%20saber%20las%20promos%20vigentes`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('whatsapp', 'promos_page_cta', '/promociones')}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25d366] text-white rounded-full font-heading font-semibold hover:scale-105 transition-transform text-sm shadow-lg shadow-green-900/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
            Pregúntanos por WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}

/* ── Promo Temporada: landing immersiva con modelo ── */
function PromoTemporada() {
  const promo = PROMOS_DATA[0]
  const { ref, visible } = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative min-h-[80vh] flex items-center overflow-hidden ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <Image src={promo.imagen} alt={promo.titulo} fill className="object-cover opacity-25" sizes="100vw" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Left — content */}
          <div>
            <span className="inline-block px-3 py-1.5 rounded-full text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[2px] mb-5 promo-badge" style={{ background: '#9b6d5320', color: '#9b6d53', border: '1px solid #9b6d5350' }}>
              {promo.badge}
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[0.95] mb-2">
              {promo.titulo}
            </h2>
            <p className="text-xl sm:text-2xl font-heading font-light text-white/50 mb-5">{promo.subtitulo}</p>
            <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-6 max-w-md">{promo.detalle}</p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`${WHATSAPP_URL}?text=Hola%2C%20quiero%20ver%20la%20nueva%20temporada`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('whatsapp', `promo_page_${promo.slug}`, '/promociones')}
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#25d366] text-white font-heading font-semibold rounded-full hover:scale-105 transition-transform text-sm shadow-lg shadow-green-900/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
                {promo.cta}
              </a>
              <Link href={`/promo/${promo.slug}`} onClick={() => trackClick('promo', promo.slug, '/promociones')} className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/15 text-white/70 font-heading font-medium rounded-full hover:bg-white/5 transition-all text-sm">
                Ver detalle completo
              </Link>
            </div>
          </div>

          {/* Right — feature highlights */}
          <div className="hidden md:block">
            <div className="space-y-4">
              {[
                { icon: '👖', title: 'Nuevos lavados', desc: 'Vintage, stone wash y tonos tierra de temporada' },
                { icon: '🧥', title: 'Casacas y abrigos', desc: 'Jean, corduroy y drill para el frío' },
                { icon: '✨', title: 'Cortes en tendencia', desc: 'Wide-leg, baggy y mom fit recién llegados' },
              ].map((item) => (
                <div key={item.title} className="glass rounded-xl p-4 flex items-start gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.title}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Promo Club VIP: diseño tipo invitación premium, centrado ── */
function PromoClubVIP() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative py-20 sm:py-28 overflow-hidden ${visible ? 'section-visible' : 'section-hidden'}`}
      style={{ background: 'linear-gradient(135deg, #1a1510 0%, #201e1e 40%, #1a1510 100%)' }}
    >
      {/* Decorative gold borders */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-gold/15 rounded-tl-lg sm:w-20 sm:h-20 sm:top-10 sm:left-10" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-gold/15 rounded-tr-lg sm:w-20 sm:h-20 sm:top-10 sm:right-10" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-gold/15 rounded-bl-lg sm:w-20 sm:h-20 sm:bottom-10 sm:left-10" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-gold/15 rounded-br-lg sm:w-20 sm:h-20 sm:bottom-10 sm:right-10" />
        {/* Gold glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ddb153 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        {/* Star icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5">
          <svg className="w-9 h-9 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>

        <p className="text-gold/50 text-xs font-heading uppercase tracking-[6px] mb-4">Exclusivo para miembros</p>

        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[0.95] mb-3">
          Descuento<br />
          <span className="text-gold">Exclusivo</span>
        </h2>
        <p className="text-white/40 text-sm sm:text-base leading-relaxed mt-4 mb-6 max-w-lg mx-auto">
          Solo para miembros del Club. Regístrate, recibe tu tarjeta digital y muestra tu pantalla
          en cada visita. Tu descuento se aplica automáticamente — sin códigos, sin complicaciones.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
          {[
            { title: 'Descuento directo', desc: 'En cada compra que hagas en tienda' },
            { title: 'Promos anticipadas', desc: 'Entérate antes que nadie de nuevas ofertas' },
            { title: 'Tarjeta digital', desc: 'Siempre en tu celular, lista para usar' },
          ].map((b) => (
            <div key={b.title} className="glass rounded-xl p-4 sm:p-5">
              <p className="text-gold font-heading font-semibold text-sm">{b.title}</p>
              <p className="text-white/40 text-xs mt-1">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/registro"
            onClick={() => trackClick('promo', 'descuento-club-page', '/promociones')}
            className="group px-8 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm flex items-center gap-2 shadow-lg shadow-gold/20"
          >
            Unirme al Club gratis
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link href="/promo/descuento-club" className="px-8 py-3.5 border border-gold/25 text-gold/70 font-heading font-medium rounded-full hover:bg-gold/5 transition-all text-sm">
            Más información
          </Link>
        </div>
      </div>
    </section>
  )
}
