import type { Metadata } from 'next'
import PromoContent from './PromoContent'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const title = params.slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    title: `${title} — Promoción Exclusiva en Jeans`,
    description: `Promoción ${title} en Club Karolay Jeans, Arequipa. Aprovecha esta oferta exclusiva en jeans y moda denim. Descuentos especiales para miembros del Club VIP.`,
    alternates: { canonical: `https://www.clubkarolayjeans.com/promo/${params.slug}` },
    openGraph: {
      title: `${title} | Club Karolay Jeans`,
      description: `Promoción exclusiva: ${title}. Ofertas en jeans y moda denim en Arequipa.`,
      url: `https://www.clubkarolayjeans.com/promo/${params.slug}`,
    },
  }
}

export default function PromoPage({ params }: { params: { slug: string } }) {
  return <PromoContent slug={params.slug} />
}
