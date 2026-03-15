'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS } from '@/lib/constants'

export default function MapaContent() {
  return (
    <main className="bg-dark-radial min-h-screen flex items-center justify-center p-6">
      <section className="w-full max-w-[430px] bg-card-radial rounded-3xl p-5 shadow-2xl shadow-black/70 border border-white/[0.06]">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={32} height={32} className="h-8 w-auto" />
            </Link>
            <span className="text-white font-heading text-sm font-semibold tracking-wider uppercase">
              {BUSINESS.name}
            </span>
          </div>
          <Link href="/bio" className="text-white/60 text-xs hover:text-white transition-colors flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver a mi tarjeta
          </Link>
        </header>

        {/* Title */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-heading font-bold text-white">¿Dónde estamos?</h1>
          <p className="text-white/70 text-sm mt-1">
            El bloque en color café muestra dónde se encuentra Club Karolay Jeans.
          </p>
        </div>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden border border-white/8 bg-dark-surface">
          <Image
            src="/images/mapa/mapa-centro-comercial.png"
            alt="Mapa del centro comercial"
            width={400}
            height={300}
            className="w-full h-auto"
          />
        </div>

        {/* Address */}
        <div className="mt-4 glass rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="w-8 h-8 rounded-full bg-mocha-500/20 flex items-center justify-center text-mocha-500 flex-shrink-0 mt-0.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </span>
            <div>
              <p className="text-white text-sm font-semibold">{BUSINESS.address}</p>
              <p className="text-white/60 text-sm">{BUSINESS.city}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-white/40 text-xs mt-4">
          Reemplaza la imagen del mapa en <code className="text-mocha-500/70">public/images/mapa/</code>
        </p>
      </section>
    </main>
  )
}
