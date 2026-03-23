import type { Metadata } from 'next'
import MisCodigosContent from './MisCodigosContent'

export const metadata: Metadata = {
  title: 'Mis Códigos de Descuento',
  description: 'Tus códigos promocionales de Club Karolay Jeans. Canjea tus descuentos exclusivos en tienda.',
  robots: { index: false, follow: false },
}

export default function MisCodigosPage() {
  return <MisCodigosContent />
}
