'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS, WHATSAPP_URL, PROMOS_DATA } from '@/lib/constants'
import { trackClick } from '@/lib/tracking'

export default function PromoContent({ slug }: { slug: string }) {
  const promo = PROMOS_DATA.find((p) => p.slug === slug)

  useEffect(() => {
    trackClick('promo', `view_${slug}`, `/promo/${slug}`)
  }, [slug])

  if (!promo) {
    return (
      <main className="bg-dark-radial min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-heading font-bold text-white mb-4">Promoción no encontrada</h1>
          <Link href="/#promociones" className="text-mocha-500 hover:underline">
            Ver todas las promociones
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-dark min-h-screen">
      {/* ── Hero fullscreen ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden">
        {/* BG image */}
        <Image
          src={promo.imagen}
          alt={promo.titulo}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Nav floating */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={44} height={44} className="h-10 w-auto" />
            <span className="text-white font-heading text-xs sm:text-sm font-semibold tracking-wider uppercase hidden sm:inline">
              {BUSINESS.name}
            </span>
          </Link>
          <Link
            href="/#promociones"
            className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Todas las promos</span>
            <span className="sm:hidden">Volver</span>
          </Link>
        </div>

        {/* Content over hero */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-20 pt-32">
          <span
            className="inline-block px-3 py-1.5 rounded-full text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-[2px] mb-4 sm:mb-6 promo-badge"
            style={{
              background: `${promo.color}20`,
              color: promo.color,
              border: `1px solid ${promo.color}50`,
            }}
          >
            {promo.badge}
          </span>

          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white leading-[0.9] mb-2">
            {promo.titulo}
          </h1>
          <p className="text-xl sm:text-3xl md:text-4xl font-heading font-light text-white/50 mb-6 sm:mb-8">
            {promo.subtitulo}
          </p>
          <p className="text-white/40 text-sm sm:text-base max-w-md leading-relaxed mb-8 sm:mb-10">
            {promo.descripcion}
          </p>

          {/* Scroll indicator */}
          <div className="hidden sm:flex items-center gap-2 text-white/30 text-xs uppercase tracking-[3px] font-heading">
            <div className="w-8 h-px bg-white/20" />
            Más info abajo
            <svg className="w-3 h-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
            </svg>
          </div>
        </div>
      </section>

      {/* ── Detalle ── */}
      <section className="py-16 sm:py-24 bg-mocha-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16">
            {/* Left — text */}
            <div className="md:col-span-3">
              <span className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-[4px]">
                Detalles
              </span>
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mt-4 mb-6">
                {promo.titulo} — {promo.subtitulo}
              </h2>
              <p className="text-white/60 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {promo.detalle}
              </p>
            </div>

            {/* Right — CTA card */}
            <div className="md:col-span-2">
              <div className="bg-card-radial rounded-2xl p-6 border border-white/6 sticky top-8">
                <p className="text-white/40 text-xs font-heading uppercase tracking-[3px] mb-4">
                  ¿Te interesa?
                </p>

                <a
                  href={`${WHATSAPP_URL}?text=Hola%2C%20vi%20la%20promo%3A%20${encodeURIComponent(promo.titulo)}%20y%20quiero%20m%C3%A1s%20info`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('whatsapp', `promo_detail_${slug}`, `/promo/${slug}`)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#25d366] text-white rounded-xl font-heading font-semibold hover:scale-[1.02] transition-transform text-sm mb-3"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654z"/>
                  </svg>
                  {promo.cta}
                </a>

                <Link
                  href="/registro"
                  className="w-full flex items-center justify-center gap-2 py-3.5 border border-gold/40 text-gold rounded-xl font-heading font-semibold hover:bg-gold/10 transition-colors text-sm"
                >
                  Unirme al Club VIP
                </Link>

                <div className="mt-5 pt-5 border-t border-white/6 space-y-3">
                  <InfoRow icon="pin" text={`${BUSINESS.address}, ${BUSINESS.city}`} />
                  <InfoRow icon="phone" text={BUSINESS.phone} />
                  <InfoRow icon="clock" text="Lun - Sáb, horario de centro comercial" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Other promos ── */}
      {PROMOS_DATA.filter((p) => p.slug !== slug).length > 0 && (
        <section className="py-16 bg-dark border-t border-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <p className="text-white/30 text-xs font-heading uppercase tracking-[4px] mb-8">
              Más promociones
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PROMOS_DATA.filter((p) => p.slug !== slug).map((other) => (
                <Link
                  key={other.slug}
                  href={`/promo/${other.slug}`}
                  onClick={() => trackClick('promo', other.slug, `/promo/${slug}`)}
                  className="group relative rounded-2xl overflow-hidden aspect-video border border-white/6 category-card"
                >
                  <Image src={other.imagen} alt={other.titulo} fill className="object-cover opacity-40 group-hover:opacity-60 transition-opacity" sizes="(max-width: 640px) 100vw, 50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <p className="text-lg font-heading font-bold text-white">{other.titulo}</p>
                    <p className="text-white/50 text-sm">{other.subtitulo}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

function InfoRow({ icon, text }: { icon: string; text: string }) {
  const icons: Record<string, React.ReactNode> = {
    pin: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    phone: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    clock: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
  }

  return (
    <div className="flex items-start gap-2.5">
      <span className="text-mocha-500 mt-0.5 flex-shrink-0">{icons[icon]}</span>
      <p className="text-white/50 text-xs leading-relaxed">{text}</p>
    </div>
  )
}
