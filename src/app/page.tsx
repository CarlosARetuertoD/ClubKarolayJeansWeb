'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import { BUSINESS, MARCAS, CATEGORIAS, TENDENCIAS, PROMOS_DATA, WHATSAPP_URL, WHATSAPP_DEFAULT_MSG } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { useScrollReveal } from '@/hooks/useScrollReveal'

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
        <CatalogoSection />
        <ClubVIPSection />
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
    <section id="inicio" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/hero/hero-lg.png" alt="" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p className="text-mocha-300 font-heading text-sm sm:text-base md:text-lg tracking-[4px] sm:tracking-[6px] uppercase mb-6 animate-fade-in-up font-medium">
          Tienda de jeans &bull; Arequipa
        </p>

        {/* CLUB / KAROLAY / JEANS — JEANS siempre termina donde termina KAROLAY */}
        <div className="animate-fade-in-up inline-block" style={{ animationDelay: '0.15s' }}>
          <p className="font-heading font-bold text-white text-3xl sm:text-4xl md:text-5xl tracking-[0.2em] uppercase">
            Club
          </p>
          <h1 className="font-heading font-extrabold text-mocha-500 text-[3.5rem] sm:text-7xl md:text-8xl lg:text-[8.5rem] tracking-tight leading-[0.85]">
            KAROLAY
          </h1>
          <p className="font-heading font-semibold text-white text-xl sm:text-2xl md:text-3xl tracking-[0.3em] uppercase text-right -mt-1 sm:-mt-2">
            Jeans
          </p>
        </div>

        <p className="text-white/50 text-sm sm:text-base md:text-lg mt-8 font-light max-w-md mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.3s' }}>
          Todas las marcas, todos los fits, un solo lugar. Encuentra el jean que te queda perfecto.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
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
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/>
            </svg>
            Escríbenos
          </a>
        </div>

        <Link
          href="/#ubicacion"
          className="mt-6 inline-flex items-center gap-1.5 text-mocha-400 text-sm font-heading font-medium hover:text-mocha-300 transition-colors animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
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
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="nosotros"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-white text-mocha-950 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-center">
          {/* Left — text */}
          <div className="lg:col-span-3">
            <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">
              Sobre nosotros
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-mocha-950 mt-4 mb-6 leading-tight">
              Tu tienda de jeans<br />
              <span className="font-bold">en Arequipa</span>
            </h2>
            <p className="text-mocha-800/70 leading-relaxed mb-4">
              <strong className="text-mocha-700">Club Karolay Jeans</strong> es tu destino
              para encontrar el jean perfecto. No somos una marca — somos una tienda que
              reúne las mejores marcas del mercado en un solo lugar para que tú elijas.
            </p>
            <p className="text-mocha-800/60 leading-relaxed mb-6">
              Trabajamos con Pionier, Tayssir, Lois, Filippo Alpi y más, porque entendemos que cada cuerpo
              es diferente. Slim, skinny, baggy, wide-leg, mom fit — aquí los pruebas todos
              y te llevas el que te queda perfecto.
            </p>
            <a
              href={`${WHATSAPP_URL}${WHATSAPP_DEFAULT_MSG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-mocha-500 font-heading font-semibold text-sm hover:text-mocha-700 transition-colors"
            >
              Visítanos en tienda
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>

          {/* Right — highlight card */}
          <div className="lg:col-span-2 relative">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-mocha-100">
              <Image
                src="/images/catalogo/jeans.svg"
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
    <section className="py-12 bg-white border-y border-mocha-100 overflow-hidden">
      <p className="text-center text-mocha-800/40 text-xs font-heading uppercase tracking-[4px] mb-8">
        Marcas que trabajamos
      </p>
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
      <Image src={promo.imagen} alt={promo.titulo} fill className="object-cover opacity-30" sizes="100vw" />
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
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
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
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="tendencias"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-[#faf6f1] text-mocha-950 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
          <div>
            <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">Tendencias</span>
            <h2 className="text-3xl md:text-5xl font-heading font-light text-mocha-950 mt-4">
              Lo que se <span className="font-bold">lleva ahora</span>
            </h2>
          </div>
          <p className="text-mocha-800/50 text-sm max-w-xs">Las tendencias que dominan las calles — y las tenemos en tienda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TENDENCIAS.map((trend) => (
            <div key={trend.slug} className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <Image src={trend.imagen} alt={trend.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <a href={`${WHATSAPP_URL}?text=Hola%2C%20me%20interesa%20el%20estilo%20${encodeURIComponent(trend.nombre)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackClick('whatsapp', `tendencia_${trend.slug}`, '/')} className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/90 text-mocha-950 rounded-xl text-sm font-semibold hover:bg-white transition-colors">
                    <svg className="w-4 h-4 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/></svg>
                    Lo quiero
                  </a>
                </div>
              </div>
              <h3 className="text-lg font-heading font-bold text-mocha-950">{trend.nombre}</h3>
              <p className="text-mocha-800/50 text-sm mt-1">{trend.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════
   CATÁLOGO
   ═══════════════════════════════════════════ */
function CatalogoSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="catalogo"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-24 bg-mocha-950 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">Catálogo</span>
          <h2 className="text-3xl md:text-5xl font-heading font-light text-white mt-4">Encuentra tu <span className="font-bold">fit</span></h2>
          <p className="text-white/40 mt-4 max-w-md mx-auto text-sm">¿Te gusta algo? Escríbenos por WhatsApp y te ayudamos con tallas, colores y disponibilidad.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIAS.map((cat) => (
            <Link key={cat.slug} href={`/catalogo#${cat.slug}`} onClick={() => trackClick('catalogo', cat.slug, '/')} className="category-card group relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/6 bg-dark-card aspect-[3/4]">
              <Image src={cat.imagen} alt={cat.nombre} fill className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" sizes="(max-width: 640px) 50vw, 25vw" />
              <span className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[0.55rem] sm:text-[0.65rem] font-bold bg-mocha-500/80 text-white uppercase tracking-wider">{cat.tag}</span>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h3 className="text-base sm:text-xl font-heading font-bold text-white">{cat.nombre}</h3>
                <p className="text-white/60 text-xs sm:text-sm mt-1 line-clamp-2 hidden sm:block">{cat.descripcion}</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link href="/catalogo" className="inline-flex items-center gap-2 px-8 py-3 border border-white/10 text-white/60 rounded-full hover:bg-white/5 hover:text-white transition-all font-heading font-medium text-sm tracking-wide">
            Ver catálogo completo
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
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

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`relative py-20 sm:py-28 overflow-hidden ${visible ? 'section-visible' : 'section-hidden'}`}
      style={{ background: 'linear-gradient(135deg, #1a1510 0%, #201e1e 40%, #1a1510 100%)' }}
    >
      {/* Decorative gold corners */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute top-6 left-6 w-12 h-12 border-t border-l border-gold/15 rounded-tl-lg sm:w-20 sm:h-20 sm:top-10 sm:left-10" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t border-r border-gold/15 rounded-tr-lg sm:w-20 sm:h-20 sm:top-10 sm:right-10" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b border-l border-gold/15 rounded-bl-lg sm:w-20 sm:h-20 sm:bottom-10 sm:left-10" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b border-r border-gold/15 rounded-br-lg sm:w-20 sm:h-20 sm:bottom-10 sm:right-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #ddb153 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-20 h-20 mx-auto mb-8 rounded-full border-2 border-gold/30 flex items-center justify-center bg-gold/5">
          <svg className="w-9 h-9 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <p className="text-gold/50 text-xs font-heading uppercase tracking-[6px] mb-4">Exclusivo para miembros</p>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-white leading-[0.95] mb-3">
          Descuento<br /><span className="text-gold">Exclusivo</span>
        </h2>
        <p className="text-white/40 text-sm sm:text-base leading-relaxed mt-4 mb-8 max-w-lg mx-auto">
          Los miembros del Club tienen precios especiales en cada visita. Muestra tu tarjeta digital en tienda y el descuento se aplica automáticamente — sin códigos, sin complicaciones.
        </p>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { title: 'Descuento directo', desc: 'En cada compra en tienda' },
            { title: 'Promos anticipadas', desc: 'Entérate antes que nadie' },
            { title: 'Tarjeta digital', desc: 'Siempre en tu celular' },
          ].map((b) => (
            <div key={b.title} className="glass rounded-xl p-4 sm:p-5">
              <p className="text-gold font-heading font-semibold text-sm">{b.title}</p>
              <p className="text-white/40 text-xs mt-1">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/registro"
            onClick={() => trackClick('promo', 'club_vip_cta', '/')}
            className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-gold to-gold-dark text-mocha-950 font-heading font-bold rounded-full hover:scale-105 transition-transform text-sm shadow-lg shadow-gold/20"
          >
            Unirme al Club gratis
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link
            href="/bio"
            className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold/30 text-gold/80 font-heading font-semibold rounded-full hover:bg-gold/10 transition-all text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" /></svg>
            Ver mi tarjeta digital
          </Link>
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
      className={`py-20 sm:py-24 bg-mocha-950 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
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
              <p className="text-mocha-500 text-sm mt-1">Tienda B-77 — Segundo piso</p>
            </div>
          </div>

          {/* Contacto */}
          <div className="glass rounded-2xl p-6 sm:p-8">
            <h3 className="font-heading font-bold text-white text-lg mb-4">Contacto</h3>
            <div className="space-y-3">
              <InfoRow icon="pin" text={`${BUSINESS.address}`} sub={BUSINESS.city} />
              <InfoRow icon="phone" text={BUSINESS.phone} sub="WhatsApp y llamadas" />
              <InfoRow icon="clock" text="Lun - Sáb, 9:00 am - 8:00 pm" sub="Horario del C.C. Don Ramón" />
            </div>
          </div>
        </div>

        {/* Mapa del CC — todo el ancho, protagonista */}
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
      </div>
    </section>
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
        <p className="text-white text-sm font-medium">{text}</p>
        {sub && <p className="text-white/40 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
