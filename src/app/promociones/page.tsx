import type { Metadata } from 'next'
import PromocionesContent from './PromocionesContent'

export const metadata: Metadata = {
  title: 'Promociones',
  description: 'Descubre las promociones y ofertas especiales de Club Karolay Jeans. Descuentos exclusivos para miembros del Club.',
}

export default function PromocionesPage() {
  return <PromocionesContent />
}
