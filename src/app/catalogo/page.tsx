import type { Metadata } from 'next'
import CatalogoContent from './CatalogoContent'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Catálogo de Club Karolay Jeans: jeans, casacas, bermudas, faldas y outfits. Descubre nuestras categorías y tendencias en moda denim.',
}

export default function CatalogoPage() {
  return <CatalogoContent />
}
