'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { BUSINESS, MARCAS, TENDENCIAS, CLASICOS, PROMOS_DATA, WHATSAPP_URL, WHATSAPP_DEFAULT_MSG } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <NosotrosSection />
        <MarcasCarousel />
        <PromoTemporada />
        <TendenciasSection />
        <ClubVIPSection />
        <ClasicosSection />
        <UbicacionSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */
function HeroSection() {
  return (
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden pt-28 sm:pt-32">
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 640px)" srcSet="/images/hero/hero-sm.webp" type="image/webp" />
          <source media="(max-width: 1024px)" srcSet="/images/hero/hero-md.webp" type="image/webp" />
          <source srcSet="/images/hero/hero-lg.webp" type="image/webp" />
          <img src="/images/hero/hero-lg.png" alt="Club Karolay Jeans — Tienda de jeans y moda denim para dama y varón en Arequipa" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" decoding="async" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-mocha-300 font-heading text-sm sm:text-base md:text-lg tracking-[4px] sm:tracking-[6px] uppercase mb-6 animate-fade-in-down font-medium" style={{ animationDelay: '0.1s' }}>
          Tienda de jeans &bull; Arequipa
        </p>

        {/* CLUB / KAROLAY / JEANS — staggered entrance */}
        <div className="inline-block">
          <p className="font-heading font-bold text-white text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            Club
          </p>
          <h1 className="font-heading font-extrabold text-mocha-500 text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[8.5rem] tracking-tight leading-[0.85] animate-scale-in" style={{ animationDelay: '0.4s' }}>
            KAROLAY
            <span className="sr-only"> — Tienda de jeans y moda denim en Arequipa, Perú</span>
          </h1>
          <p className="font-heading font-semibold text-white text-xl sm:text-2xl md:text-3xl tracking-[0.3em] uppercase text-right -mt-1 sm:-mt-2 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            Jeans
          </p>
        </div>

        <p className="text-white/50 text-sm sm:text-base md:text-lg mt-8 font-light max-w-md mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.8s' }}>
          Las mejores marcas y estilos reunidos en un solo lugar. Encuentra la ropa perfecta para ti.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
          <Link
            href="/catalogo"
            className="group px-8 py-3.5 bg-mocha-500 text-white font-heading font-semibold rounded-full hover:bg-mocha-600 transition-all tracking-wide flex items-center gap-2"
          >
            Catálogo 2026
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <a
            href={`${WHATSAPP_URL}${WHATSAPP_DEFAULT_MSG}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('whatsapp', 'hero_cta', '/')}
            className="group px-8 py-3.5 border border-[#25d366]/50 text-[#25d366] font-heading font-semibold rounded-full hover:border-[#25d366] hover:shadow-[0_0_20px_rgba(37,211,102,0.15)] transition-all duration-300 tracking-wide flex items-center gap-2"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Escríbenos
          </a>
        </div>

        <Link
          href="/#ubicacion"
          className="mt-6 inline-flex items-center gap-1.5 text-mocha-400 text-sm font-heading font-medium hover:text-mocha-300 transition-colors animate-fade-in-up"
          style={{ animationDelay: '1.15s' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Encuéntranos
        </Link>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   NOSOTROS — sin stats, con imagen lateral
   ═══════════════════════════════════════════ */
function NosotrosSection() {
  return (
    <section
      id="nosotros"
      className="pt-24 pb-10 bg-[#faf6f1] text-mocha-950"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-mocha-500" />
              <span className="text-mocha-500 text-sm sm:text-base font-heading font-medium uppercase tracking-[5px]">Sobre nosotros</span>
              <div className="w-8 h-px bg-mocha-500" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-mocha-950 leading-[0.95] mb-6">
              <span className="font-light">Tu tienda favorita de jeans</span><br />
              <span className="font-extrabold text-mocha-500">en Arequipa</span>
            </h2>
            <p className="text-mocha-800/70 leading-relaxed mb-4">
              <strong className="text-mocha-700">Club Karolay Jeans</strong> es el punto de encuentro de las mejores marcas del mercado. Aquí no te adaptas a la ropa, tú eliges la que mejor se siente contigo. Nos especializamos en denim para dama y varón con una sola meta: que encuentres tu jean ideal.
            </p>

            <p className="text-mocha-800/60 leading-relaxed mb-6">
              En nuestro club encuentras todo en un solo lugar: desde los clásicos de toda la vida que nunca fallan, hasta las últimas tendencias que están marcando el momento.
            </p>
            <Link
              href="/#ubicacion"
              className="inline-flex items-center gap-2 text-mocha-500 font-heading font-semibold text-sm hover:text-mocha-700 transition-colors"
            >
              Visítanos en nuestra tienda física
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          {/* Right — highlight card */}
          <div className="lg:col-span-2 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-mocha-100">
              <Image
                src="/images/fotos/jeans-perchero.webp"
                alt="Club Karolay Jeans"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mocha-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-gold font-heading font-extrabold text-4xl sm:text-5xl">+25</p>
                <p className="text-white font-heading font-semibold text-base sm:text-lg mt-1 leading-tight">
                  Años llevando la<br />moda a tu vida
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   MARCAS — carrusel infinito, fondo blanco
   ═══════════════════════════════════════════ */
function MarcasCarousel() {
  const doubled = [...MARCAS, ...MARCAS]

  return (
    <section className="pt-6 pb-14 sm:pb-16 bg-[#faf6f1] overflow-hidden">
      <div className="text-center mb-10 px-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 h-px bg-mocha-500" />
          <span className="text-mocha-500 text-sm sm:text-base font-heading font-medium uppercase tracking-[5px]">Algunas de las marcas con las que trabajamos</span>
          <div className="w-8 h-px bg-mocha-500" />
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-mocha-950 leading-[0.95]">
          <span className="font-light">Calidad que se nota</span><br />
          <span className="font-extrabold text-mocha-500">en cada prenda</span>
        </h2>
      </div>
      {/* Infinite scroll carousel */}
      <div className="relative">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((marca, i) => (
            <span
              key={`${marca}-${i}`}
              className="mx-6 sm:mx-10 text-mocha-800/20 font-heading text-lg sm:text-2xl font-bold tracking-wider uppercase flex-shrink-0 hover:text-mocha-500/50 transition-colors cursor-default"
            >
              {marca}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   PROMO TEMPORADA — editorial landing
   ═══════════════════════════════════════════ */
function PromoTemporada() {
  const promo = PROMOS_DATA[0]
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="promociones"
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative min-h-[85vh] flex items-center overflow-hidden bg-dark ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <picture>
        <img src="/images/fotos/chica-sentada.webp" alt={promo.titulo} className="absolute inset-0 w-full h-full object-cover opacity-30" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="max-w-lg">
          <span className="inline-block px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-[2px] mb-6 promo-badge" style={{ background: '#9b6d5320', color: '#9b6d53', border: '1px solid #9b6d5350' }}>
            {promo.badge}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[0.95] mb-2">
            {promo.titulo}
          </h2>
          <p className="text-2xl sm:text-3xl font-heading font-light text-white/60 mb-6">{promo.subtitulo}</p>
          <p className="text-white/50 text-sm sm:text-base leading-relaxed mb-8 max-w-md">{promo.descripcion}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={`/promo/${promo.slug}`} onClick={() => trackClick('promo', promo.slug, '/')} className="group inline-flex items-center gap-2 px-7 py-3.5 bg-white text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm">
              {promo.cta}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <a href={`${WHATSAPP_URL}?text=Hola%2C%20vi%20la%20promo%3A%20${encodeURIComponent(promo.titulo)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackClick('whatsapp', `promo_wa_${promo.slug}`, '/')} className="group inline-flex items-center gap-2 px-7 py-3.5 border border-[#25d366]/50 text-[#25d366] font-heading font-semibold rounded-full hover:border-[#25d366] hover:shadow-[0_0_15px_rgba(37,211,102,0.12)] transition-all duration-300 text-sm">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   TENDENCIAS
   ═══════════════════════════════════════════ */
function TendenciasSection() {
  return (
    <section
      id="tendencias"
      className="py-20 sm:py-24 bg-[#faf6f1] text-mocha-950"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-mocha-500" />
            <span className="text-mocha-500 text-sm sm:text-base font-heading font-medium uppercase tracking-[5px]">Tendencias 2026</span>
            <div className="w-8 h-px bg-mocha-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-mocha-950 leading-[0.95]">
            <span className="font-light">Lo más buscado</span><br />
            <span className="font-extrabold text-mocha-500">de la temporada</span>
          </h2>
        </div>

        {/* First trend — featured large */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <a
            href={`${WHATSAPP_URL}?text=Hola%2C%20me%20interesa%20el%20estilo%20${encodeURIComponent(TENDENCIAS[0].nombre)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackClick('whatsapp', `tendencia_${TENDENCIAS[0].slug}`, '/')}
            className="group relative rounded-2xl overflow-hidden aspect-[4/5] md:aspect-auto md:row-span-2"
          >
            <Image src={TENDENCIAS[0].imagen} alt={TENDENCIAS[0].nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <span className="inline-block px-4 py-1.5 rounded-full text-[0.65rem] font-heading font-bold uppercase tracking-[2px] bg-mocha-500 text-white mb-4 shadow-lg shadow-mocha-500/30 animate-pulse-glow">Trending</span>
              <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">{TENDENCIAS[0].nombre}</h3>
              <p className="text-white/60 text-sm mt-2 max-w-xs">{TENDENCIAS[0].descripcion}</p>
              <span className="inline-flex items-center gap-2 mt-4 text-white/80 text-sm font-heading font-semibold group-hover:text-white transition-colors">
                Lo quiero
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </span>
            </div>
          </a>

          {/* Remaining trends — stacked */}
          <div className="flex flex-col gap-6">
            {TENDENCIAS.slice(1).map((trend) => (
              <a
                key={trend.slug}
                href={`${WHATSAPP_URL}?text=Hola%2C%20me%20interesa%20el%20estilo%20${encodeURIComponent(trend.nombre)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackClick('whatsapp', `tendencia_${trend.slug}`, '/')}
                className="group relative rounded-2xl overflow-hidden aspect-[16/9] flex-1"
              >
                <Image src={trend.imagen} alt={trend.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-white">{trend.nombre}</h3>
                  <p className="text-white/50 text-xs sm:text-sm mt-1">{trend.descripcion}</p>
                  <span className="inline-flex items-center gap-1.5 mt-2 text-white/70 text-xs font-heading font-semibold group-hover:text-white transition-colors">
                    Lo quiero
                    <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CLUB VIP + UNIRSE — fusionados
   ═══════════════════════════════════════════ */
function ClubVIPSection() {
  const { ref, visible } = useScrollReveal()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setLoggedIn(true)
    })
  }, [])

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative py-16 sm:py-20 overflow-hidden ${visible ? 'section-visible' : 'section-hidden'}`}
      style={{ background: 'linear-gradient(135deg, #1a1510 0%, #201e1e 40%, #1a1510 100%)' }}
    >
      {/* Decorative lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #ddb153 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-14">

          {/* Left — Card preview (desktop only) */}
          <div className="hidden md:block w-full max-w-[340px] flex-shrink-0">
            <ClubCard />
          </div>

          {/* Right — text + CTAs */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-gold/50 text-xs font-heading uppercase tracking-[4px] mb-3">Club VIP de clientes</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-white leading-[0.95] mb-4">
              Descuentos <span className="text-gold">Exclusivos</span>
            </h2>
            <p className="text-white/45 text-sm sm:text-base leading-relaxed max-w-lg mx-auto md:mx-0 mb-6">
              {loggedIn
                ? 'Ya eres parte del Club. Revisa tus descuentos disponibles y canjéalos en tu próxima visita a tienda.'
                : 'Crea tu cuenta gratis y recibe un 10% OFF de bienvenida. Además accede a descuentos exclusivos en cada visita — solo muestra tu tarjeta digital en tienda.'}
            </p>

            {/* Card preview (mobile only) */}
            <div className="md:hidden w-full max-w-[300px] mx-auto mb-6">
              <ClubCard />
            </div>

            {/* CTAs — cambia según auth */}
            <div className="flex flex-col sm:flex-row items-center md:items-start gap-3">
              {loggedIn ? (
                <>
                  <Link
                    href="/mis-codigos"
                    onClick={() => trackClick('promo', 'club_vip_mis_codigos', '/')}
                    className="group inline-flex items-center gap-2 px-9 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm shadow-lg shadow-gold/20"
                  >
                    Ver mis descuentos
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                  <Link
                    href="/bio"
                    className="inline-flex items-center gap-2 px-7 py-3 border border-gold/25 text-gold/70 font-heading font-semibold rounded-full hover:bg-gold/10 transition-all text-sm"
                  >
                    Ver mi tarjeta
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/registro"
                    onClick={() => trackClick('promo', 'club_vip_cta', '/')}
                    className="group inline-flex items-center gap-2 px-9 py-3.5 bg-gradient-to-r from-gold to-gold-dark text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm shadow-lg shadow-gold/20"
                  >
                    Unirme al Club gratis
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </Link>
                  <Link
                    href="/bio"
                    className="inline-flex items-center gap-2 px-7 py-3 border border-gold/25 text-gold/70 font-heading font-semibold rounded-full hover:bg-gold/10 transition-all text-sm"
                  >
                    Ver mi tarjeta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CLÁSICOS — los de toda la vida
   ═══════════════════════════════════════════ */
function ClasicosSection() {
  return (
    <section
      id="clasicos"
      className="py-20 sm:py-24 bg-[#faf6f1] text-mocha-950"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-px bg-mocha-500" />
            <span className="text-mocha-500 text-sm sm:text-base font-heading font-medium uppercase tracking-[5px]">Clásicos</span>
            <div className="w-8 h-px bg-mocha-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading text-mocha-950 leading-[0.95]">
            <span className="font-light">Estilos que no</span><br />
            <span className="font-extrabold text-mocha-500">pasan de moda</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CLASICOS.map((item) => (
            <a
              key={item.slug}
              href={`${WHATSAPP_URL}?text=Hola%2C%20me%20interesa%20${encodeURIComponent(item.nombre)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick('whatsapp', `clasico_${item.slug}`, '/')}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4]"
            >
              <Image src={item.imagen} alt={item.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-white">{item.nombre}</h3>
                <p className="text-white/60 text-sm mt-1">{item.descripcion}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-white/70 text-xs font-heading font-semibold group-hover:text-white transition-colors">
                  Consultar
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   UBICACIÓN — mapa + cómo llegar
   ═══════════════════════════════════════════ */
function UbicacionSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="ubicacion"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-14 sm:py-16 bg-mocha-950 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">Contacto</span>
          <h2 className="text-3xl md:text-4xl font-heading font-light text-white mt-4">
            <span className="font-bold">Encuéntranos</span>
          </h2>
        </div>

        {/* Fila superior: Preguntar por + Contacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Preguntar por */}
          <div className="glass rounded-2xl p-6 sm:p-8 flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-mocha-500/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-mocha-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white/40 text-xs font-heading uppercase tracking-[3px] mb-1">Al llegar, preguntar por</p>
              <p className="text-white font-heading font-bold text-2xl sm:text-3xl">Giovanna Delgado</p>
              <p className="text-mocha-500 text-sm mt-1">Stand B-77 — Segundo Pasadizo</p>
            </div>
          </div>

          {/* Informacion de contacto */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h3 className="font-heading font-bold text-white text-lg mb-4">Información de contacto</h3>
            <div className="space-y-3">
              <InfoRow icon="pin" text={`${BUSINESS.address}`} sub={BUSINESS.city} />
              <InfoRow icon="phone" text={BUSINESS.phone} sub="WhatsApp y llamadas" />
              <InfoRow icon="clock" text={"Lun - Sáb, 9:00 am - 8:00 pm\nDom, 9:00 am - 7:00 pm"} sub="Sujeto a horario del C.C. Don Ramón" />
            </div>
          </div>
        </div>

        {/* TODO: Mapa del CC — descomentar cuando esté terminado
        <div className="glass rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-white text-lg">Mapa interior del centro comercial</h3>
            <Link href="/mapa" className="text-mocha-500 text-xs font-heading hover:text-mocha-400 transition-colors flex items-center gap-1">
              Ampliar
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </Link>
          </div>
          <div className="rounded-xl overflow-hidden border border-white/6">
            <Image
              src="/images/mapa/mapa-centro-comercial.svg"
              alt="Mapa del centro comercial"
              width={1200}
              height={600}
              className="w-full h-auto"
            />
          </div>
          <p className="text-white/30 text-xs mt-3 text-center">
            Busca el puesto B-77 marcado en café
          </p>
        </div>
        */}
      </div>
    </section>
  )
}

function ClubCard() {
  return (
    <div className="relative aspect-[1.586/1] rounded-2xl overflow-hidden shadow-2xl shadow-black/40"
      style={{ background: 'linear-gradient(135deg, #1c1714 0%, #2a2320 40%, #1a1510 100%)' }}
    >
      <div className="absolute inset-0 rounded-2xl border border-gold/20" />
      <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full opacity-[0.06]" style={{ background: 'radial-gradient(circle, #ddb153, transparent 70%)' }} />
      <div className="absolute -left-6 -bottom-6 w-28 h-28 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #ddb153, transparent 70%)' }} />
      {/* Jeans silhouette */}
      <div className="absolute top-4 left-5 text-gold/20">
        <svg className="w-10 h-14" viewBox="0 0 40 56" fill="currentColor">
          {/* Waistband */}
          <rect x="6" y="0" width="28" height="4" rx="1.5" opacity="0.5" />
          {/* Body — hip to crotch to legs */}
          <path d="M6 4 L5 22 L4 52 Q4 54 6 54 L14 54 Q16 54 16 52 L18 28 L20 26 L22 28 L24 52 Q24 54 26 54 L34 54 Q36 54 36 52 L35 22 L34 4 Z" opacity="0.7" />
          {/* Fly seam */}
          <line x1="20" y1="6" x2="20" y2="26" stroke="currentColor" strokeWidth="0.7" opacity="0.3" />
          {/* Left pocket arc */}
          <path d="M9 6 Q7 12 10 14 L16 12 Q17 10 16 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          {/* Right pocket arc */}
          <path d="M31 6 Q33 12 30 14 L24 12 Q23 10 24 8" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
          {/* Button */}
          <circle cx="20" cy="2" r="1.5" opacity="0.6" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
        <p className="text-gold/60 text-[0.65rem] font-heading uppercase tracking-[3px] mb-1">Miembro del Club</p>
        <p className="text-white font-heading font-bold text-xl sm:text-2xl tracking-wide">Club Karolay Jeans</p>
        <div className="flex items-center justify-between mt-3">
          <p className="text-white/30 text-[0.65rem] font-heading tracking-wider">Únete y obtén descuentos exclusivos</p>
          <svg className="w-9 h-9 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, text, sub }: { icon: string; text: string; sub?: string }) {
  const icons: Record<string, React.ReactNode> = {
    pin: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    phone: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
    clock: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>,
    user: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  }
  return (
    <div className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-full bg-mocha-500/15 flex items-center justify-center text-mocha-500 flex-shrink-0 mt-0.5">{icons[icon]}</span>
      <div>
        <p className="text-white text-sm font-medium whitespace-pre-line">{text}</p>
        {sub && <p className="text-white/40 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
