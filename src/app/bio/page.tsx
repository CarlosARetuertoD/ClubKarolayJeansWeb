import type { Metadata } from 'next'
import { Suspense } from 'react'
import BioCard from './BioCard'

export const metadata: Metadata = {
  title: 'Tarjeta Digital',
  description:
    'Tarjeta digital de Club Karolay Jeans. Accede al catálogo, promociones, WhatsApp y redes sociales desde tu QR.',
  openGraph: {
    title: 'Club Karolay Jeans | Tarjeta Digital',
    description: 'Tu tarjeta de fidelización digital. Muestra esta pantalla en tienda para descuentos especiales.',
    images: ['/images/logo/logoKarolay.png'],
  },
}

export default function BioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-dark" />}>
      <BioCard />
    </Suspense>
  )
}
