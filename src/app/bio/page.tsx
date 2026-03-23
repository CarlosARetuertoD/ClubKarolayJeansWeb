import type { Metadata } from 'next'
import { Suspense } from 'react'
import BioCard from './BioCard'

export const metadata: Metadata = {
  title: 'Tarjeta Digital del Club VIP',
  description:
    'Tarjeta digital de Club Karolay Jeans. Muestra tu QR en tienda para obtener descuentos exclusivos en jeans y moda denim en Arequipa. Accede a catálogo, promos y WhatsApp.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/bio' },
  openGraph: {
    title: 'Tarjeta Digital | Club Karolay Jeans',
    description: 'Tu tarjeta de fidelización digital. Muestra tu QR en tienda para descuentos exclusivos en jeans y moda denim.',
    url: 'https://www.clubkarolayjeans.com/bio',
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
