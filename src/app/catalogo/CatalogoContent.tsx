'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CATEGORIAS, TENDENCIAS, MARCAS, WHATSAPP_URL, BUSINESS } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const JEANS_DESTACADOS = [
  { nombre: 'Jean Slim Fit', desc: 'El calce favorito. Perfecto para el día a día y looks semi-formales.', imagen: '/images/catalogo/jean-slim.webp', marca: 'Pionier' },
  { nombre: 'Jean Baggy', desc: 'Corte suelto con actitud. La tendencia urbana del momento.', imagen: '/images/catalogo/jean-baggy.webp', marca: 'Tayssir' },
  { nombre: 'Jean Mom Fit', desc: 'Tiro alto y pierna cónica. Comodidad retro para ella.', imagen: '/images/catalogo/jean-mom.webp', marca: 'Denimlab' },
  { nombre: 'Jean Skinny', desc: 'Ajuste ceñido, tela stretch. Silueta definida y moderna.', imagen: '/images/catalogo/jean-skinny.webp', marca: 'Pionier' },
]

export default function CatalogoContent() {
  return (
    <main className="bg-dark min-h-screen">
      {/* ── Hero ── */}
      <section className="relative h-[60vh] sm:h-[70vh] min-h-[400px] flex items-end overflow-hidden">
        <picture>
          <source srcSet="/images/hero/promo-temporada.webp" type="image/webp" />
          <img src="/images/hero/promo-temporada.png" alt="Catálogo Club Karolay Jeans" className="absolute inset-0 w-full h-full object-cover" fetchPriority="high" />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-mocha-950 via-black/60 to-black/50" />

        {/* Nav */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={44} height={44} className="h-10 w-auto" />
            <span className="text-white font-heading text-xs sm:text-sm font-semibold tracking-wider uppercase hidden sm:inline">
              {BUSINESS.name}
            </span>
          </Link>
          <Link href="/bio" className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Mi tarjeta
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16 w-full">
          <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">
            Club Karolay Jeans
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading font-extrabold text-white mt-3 leading-[0.9]">
            Catálogo
          </h1>
          <p className="text-white/40 mt-4 max-w-md text-sm sm:text-base">
            Explora lo mejor en jeans y moda denim. ¿Te gusta algo?
            Toca WhatsApp y te ayudamos al instante.
          </p>
        </div>
      </section>

      {/* ── Categorías ── */}
      <CategoriesSection />

      {/* ── Modelos destacados ── */}
      <FeaturedSection />

      {/* ── Tendencias ── */}
      <TrendsSection />

      {/* ── Marcas ── */}
      <section className="py-16 bg-dark border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-white/25 text-xs font-heading uppercase tracking-[4px] mb-8">
            Trabajamos con las mejores marcas
          </p>
          <div className="flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
            {MARCAS.map((marca) => (
              <span key={marca} className="text-white/20 font-heading text-base sm:text-xl font-bold tracking-wider uppercase">
                {marca}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-16 bg-mocha-950 text-center border-t border-white/5">
        <div className="max-w-lg mx-auto px-4">
          <h2 className="text-xl sm:text-2xl font-heading font-bold text-white mb-3">
            ¿No encuentras lo que buscas?
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Tenemos más de 10,000 prendas en tienda. Escríbenos y te ayudamos a encontrar exactamente lo que necesitas.
          </p>
          <a
            href={`${WHATSAPP_URL}?text=Hola%2C%20busco%20algo%20espec%C3%ADfico%20en%20Club%20Karolay%20Jeans`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#25d366] text-white rounded-full font-heading font-semibold hover:scale-105 transition-transform text-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Pregúntanos por WhatsApp
          </a>
        </div>
      </section>
    </main>
  )
}

/* ── Categories grid ── */
function CategoriesSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="categorias"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-16 sm:py-24 bg-mocha-950 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10">
          <div>
            <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">
              Categorías
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-3">
              ¿Qué estás buscando?
            </h2>
          </div>
          <p className="text-white/30 text-xs sm:text-sm max-w-xs">
            Toca una categoría para explorar.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {CATEGORIAS.map((cat) => (
            <a
              key={cat.slug}
              href={`#${cat.slug}`}
              onClick={() => trackClick('catalogo', cat.slug, '/catalogo')}
              className="category-card group relative rounded-xl sm:rounded-2xl overflow-hidden border border-white/6 bg-dark-card aspect-[3/4]"
            >
              <Image
                src={cat.imagen}
                alt={cat.nombre}
                fill
                className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <span className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[0.55rem] sm:text-[0.65rem] font-bold bg-mocha-500/80 text-white uppercase tracking-wider">
                {cat.tag}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                <h3 className="text-base sm:text-xl font-heading font-bold text-white">{cat.nombre}</h3>
                <p className="text-white/50 text-xs sm:text-sm mt-1 line-clamp-2 hidden sm:block">{cat.descripcion}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Featured jeans ── */
function FeaturedSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      id="jeans"
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-16 sm:py-24 bg-dark border-t border-white/5 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">
            Los más pedidos
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading text-white mt-4">
            Modelos <span className="font-bold">destacados</span>
          </h2>
          <p className="text-white/30 text-sm mt-3 max-w-md mx-auto">
            Los fits favoritos de nuestros clientes esta temporada.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {JEANS_DESTACADOS.map((jean) => (
            <div key={jean.nombre} className="group">
              <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden bg-dark-card border border-white/6 mb-3 sm:mb-4">
                <Image
                  src={jean.imagen}
                  alt={jean.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {/* Hover overlay with CTA */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <a
                    href={`${WHATSAPP_URL}?text=Hola%2C%20me%20interesa%3A%20${encodeURIComponent(jean.nombre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('whatsapp', `catalogo_${jean.nombre}`, '/catalogo')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/90 text-mocha-950 rounded-xl text-xs sm:text-sm font-semibold hover:bg-white transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                    </svg>
                    Consultar
                  </a>
                </div>
                {/* Brand pill */}
                <span className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 py-0.5 rounded-full text-[0.55rem] sm:text-[0.6rem] font-semibold bg-black/50 text-white/70 border border-white/10 backdrop-blur-sm uppercase tracking-wider">
                  {jean.marca}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-heading font-semibold text-white">{jean.nombre}</h3>
              <p className="text-white/40 text-xs sm:text-sm mt-0.5 line-clamp-2">{jean.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Trends in catalog ── */
function TrendsSection() {
  const { ref, visible } = useScrollReveal()

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={`py-16 sm:py-24 bg-mocha-950 border-t border-white/5 ${visible ? 'section-visible' : 'section-hidden'}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-10 sm:mb-14">
          <div>
            <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">
              En tendencia
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading text-white mt-3">
              Lo que se <span className="font-bold">lleva ahora</span>
            </h2>
          </div>
          <p className="text-white/30 text-xs sm:text-sm max-w-xs">
            Las tendencias que dominan las calles — y las tenemos en tienda.
          </p>
        </div>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex gap-4 overflow-x-auto pb-4 sm:pb-0 sm:grid sm:grid-cols-3 sm:gap-6 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
          {TENDENCIAS.map((trend) => (
            <div
              key={trend.slug}
              className="flex-shrink-0 w-[75vw] sm:w-auto snap-center group"
            >
              <div className="relative aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-4">
                <Image
                  src={trend.imagen}
                  alt={trend.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 640px) 75vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <a
                    href={`${WHATSAPP_URL}?text=Hola%2C%20me%20interesa%20el%20estilo%20${encodeURIComponent(trend.nombre)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackClick('whatsapp', `trend_${trend.slug}`, '/catalogo')}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/90 text-mocha-950 rounded-xl text-sm font-semibold"
                  >
                    Lo quiero
                  </a>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-heading font-bold text-white">{trend.nombre}</h3>
              <p className="text-white/40 text-xs sm:text-sm mt-1">{trend.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
