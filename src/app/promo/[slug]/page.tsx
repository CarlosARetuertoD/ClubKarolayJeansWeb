import type { Metadata } from 'next'
import PromoContent from './PromoContent'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    title: `Promo: ${title}`,
    description: `Promoción especial de Club Karolay Jeans: ${title}. Descubre los detalles y aprovecha esta oferta exclusiva.`,
  }
}

export default function PromoPage({ params }: { params: { slug: string } }) {
  return <PromoContent slug={params.slug} />
}
