import type { Metadata } from 'next'
import './globals.css'
import TrackingProvider from '@/components/TrackingProvider'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.clubkarolayjeans.com'),
  title: {
    default: 'Club Karolay Jeans | Tienda de Jeans y Moda Denim en Arequipa',
    template: '%s | Club Karolay Jeans — Arequipa',
  },
  description:
    'Tienda especializada en jeans para dama y varón en Arequipa. Marcas como Pionier, Tayssir, Wrangler, Lee y más. Casacas, bermudas, faldas y outfits denim en C.C. Don Ramón, Siglo XX. Envíos a todo el Perú.',
  keywords: [
    'jeans Arequipa',
    'tienda de jeans Arequipa',
    'jeans para mujer Arequipa',
    'jeans para hombre Arequipa',
    'ropa de moda Arequipa',
    'jeans dama',
    'jeans varón',
    'bermudas denim',
    'casacas jean',
    'faldas jean',
    'Club Karolay Jeans',
    'moda urbana Perú',
    'tienda de jeans Perú',
    'baggy jeans Arequipa',
    'wide leg jeans',
    'jeans Pionier',
    'jeans Tayssir',
    'jeans Wrangler',
    'jeans Lee',
    'ropa denim Arequipa',
    'centro comercial Don Ramón',
    'Siglo XX Arequipa',
    'jeans slim fit',
    'jeans skinny',
    'jean clásico',
    'drill pantalón',
    'casacas corduroy',
    'moda denim Perú',
    'ofertas jeans Arequipa',
    'club de descuentos ropa',
  ],
  openGraph: {
    title: 'Club Karolay Jeans | Tienda de Jeans y Moda Denim en Arequipa',
    description:
      'Tu destino de moda denim en Arequipa. Jeans, casacas, bermudas y outfits con estilo para dama y varón. Marcas como Pionier, Wrangler, Lee y más en C.C. Don Ramón.',
    url: 'https://www.clubkarolayjeans.com',
    siteName: 'Club Karolay Jeans',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: '/images/hero/hero-lg.webp',
        width: 1200,
        height: 630,
        alt: 'Club Karolay Jeans - Tienda de jeans y moda denim en Arequipa, Perú',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Karolay Jeans | Jeans y Moda Denim en Arequipa',
    description: 'Jeans, casacas, bermudas y faldas de las mejores marcas. Visítanos en C.C. Don Ramón, Arequipa.',
    images: ['/images/hero/hero-lg.webp'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.clubkarolayjeans.com',
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/apple-touch-icon.png',
  },
  category: 'shopping',
  verification: {},
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ClothingStore',
              '@id': 'https://www.clubkarolayjeans.com/#store',
              name: 'Club Karolay Jeans',
              alternateName: 'Karolay Jeans',
              description: 'Tienda especializada en jeans y moda denim para dama y varón en Arequipa. Marcas como Pionier, Tayssir, Wrangler, Lee, Lois, Brooklyn, Element y más.',
              url: 'https://www.clubkarolayjeans.com',
              telephone: '+51940403984',
              email: 'ventas@clubkarolayjeans.com',
              logo: 'https://www.clubkarolayjeans.com/images/logo/logoKarolay.png',
              image: [
                'https://www.clubkarolayjeans.com/images/hero/hero-lg.webp',
                'https://www.clubkarolayjeans.com/images/logo/logoKarolay.png',
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Av. Siglo XX 209-213, C.C. Don Ramón, INT. B-77',
                addressLocality: 'Arequipa',
                addressRegion: 'Arequipa',
                postalCode: '04001',
                addressCountry: 'PE',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -16.3989,
                longitude: -71.5350,
              },
              areaServed: [
                {
                  '@type': 'City',
                  name: 'Arequipa',
                  '@id': 'https://www.wikidata.org/wiki/Q159273',
                },
                {
                  '@type': 'Country',
                  name: 'Perú',
                },
              ],
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                  opens: '09:00',
                  closes: '20:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: 'Sunday',
                  opens: '09:00',
                  closes: '19:00',
                },
              ],
              priceRange: '$$',
              currenciesAccepted: 'PEN',
              paymentAccepted: 'Efectivo, Yape, Plin, Tarjeta',
              brand: [
                { '@type': 'Brand', name: 'Pionier' },
                { '@type': 'Brand', name: 'Tayssir' },
                { '@type': 'Brand', name: 'Wrangler' },
                { '@type': 'Brand', name: 'Lee' },
                { '@type': 'Brand', name: 'Lois' },
                { '@type': 'Brand', name: 'Brooklyn' },
                { '@type': 'Brand', name: 'Element' },
                { '@type': 'Brand', name: 'Kansas' },
                { '@type': 'Brand', name: 'Norton' },
                { '@type': 'Brand', name: 'American Colt' },
                { '@type': 'Brand', name: 'Filippo Alpi' },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Catálogo de Club Karolay Jeans',
                itemListElement: [
                  { '@type': 'OfferCatalog', name: 'Jeans' },
                  { '@type': 'OfferCatalog', name: 'Casacas' },
                  { '@type': 'OfferCatalog', name: 'Bermudas' },
                  { '@type': 'OfferCatalog', name: 'Faldas & Outfits' },
                ],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              '@id': 'https://www.clubkarolayjeans.com/#website',
              url: 'https://www.clubkarolayjeans.com',
              name: 'Club Karolay Jeans',
              description: 'Tienda de jeans y moda denim en Arequipa',
              publisher: { '@id': 'https://www.clubkarolayjeans.com/#store' },
              inLanguage: 'es-PE',
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased bg-dark text-white">
        <TrackingProvider />
        <SmoothScroll />
        {children}
      </body>
    </html>
  )
}
