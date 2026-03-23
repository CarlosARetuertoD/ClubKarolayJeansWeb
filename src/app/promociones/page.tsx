import type { Metadata } from 'next'
import PromocionesContent from './PromocionesContent'

export const metadata: Metadata = {
  title: 'Promociones y Ofertas en Jeans — Descuentos Exclusivos',
  description: 'Aprovecha las promociones y ofertas exclusivas de Club Karolay Jeans en Arequipa. Descuentos en jeans, casacas y bermudas solo para miembros del Club VIP.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/promociones' },
  openGraph: {
    title: 'Promociones | Club Karolay Jeans',
    description: 'Ofertas exclusivas en jeans y moda denim para miembros del Club.',
    url: 'https://www.clubkarolayjeans.com/promociones',
  },
}

export default function PromocionesPage() {
  return <PromocionesContent />
}
