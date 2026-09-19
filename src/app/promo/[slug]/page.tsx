import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PROMOS_DATA, SITE_URL, SPRING_CAMPAIGN } from '@/lib/constants'
import PromoContent from './PromoContent'
import SpringContent from './SpringContent'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const promo = PROMOS_DATA.find(p => p.slug === slug)
  if (!promo) return { title: 'Promoción no encontrada', robots: { index: false } }
  const title = slug === SPRING_CAMPAIGN.slug ? 'Primavera a tu estilo · Colección y ofertas 2026' : `${promo.titulo} · ${promo.subtitulo}`

  return {
    title,
    description: promo.descripcion,
    alternates: { canonical: `${SITE_URL}/promo/${slug}` },
    openGraph: {
      title: `${title} | Club Karolay Jeans`,
      description: promo.descripcion,
      url: `${SITE_URL}/promo/${slug}`,
      images: [{ url: promo.imagen }],
    },
  }
}

export default async function PromoPage({ params }: Props) {
  const { slug } = await params
  if (!PROMOS_DATA.some(p => p.slug === slug)) notFound()
  return slug === SPRING_CAMPAIGN.slug ? <SpringContent /> : <PromoContent slug={slug} />
}
