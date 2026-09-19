import { MetadataRoute } from 'next'
import { PROMOS_DATA } from '@/lib/constants'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.clubkarolayjeans.com'
  const now = new Date()

  return [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/catalogo`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/promociones`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/registro`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/bio`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    ...PROMOS_DATA.map(p => ({ url: `${baseUrl}/promo/${p.slug}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.7 })),
    { url: `${baseUrl}/mapa`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${baseUrl}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/libro-reclamaciones`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
