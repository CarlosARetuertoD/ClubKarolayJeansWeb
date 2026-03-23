import type { Metadata } from 'next'
import CatalogoContent from './CatalogoContent'

export const metadata: Metadata = {
  title: 'Catálogo de Jeans, Casacas, Bermudas y Faldas',
  description: 'Explora el catálogo de Club Karolay Jeans en Arequipa: jeans slim, skinny, baggy y wide-leg, casacas, bermudas y faldas denim. Marcas Pionier, Tayssir, Wrangler, Lee y más para dama y varón.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/catalogo' },
  openGraph: {
    title: 'Catálogo | Club Karolay Jeans',
    description: 'Jeans, casacas, bermudas y faldas de las mejores marcas denim. Todos los fits y lavados en un solo lugar.',
    url: 'https://www.clubkarolayjeans.com/catalogo',
  },
}

export default function CatalogoPage() {
  return <CatalogoContent />
}
