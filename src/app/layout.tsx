import type { Metadata } from 'next'
import './globals.css'
import TrackingProvider from '@/components/TrackingProvider'
import SmoothScroll from '@/components/SmoothScroll'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.clubkarolayjeans.com'),
  title: {
    default: 'Club Karolay Jeans | Moda Denim en Arequipa',
    template: '%s | Club Karolay Jeans',
  },
  description:
    'Jeans, casacas, bermudas y faldas para dama y varón. Moda urbana con estilo, calce perfecto y calidad premium. Visítanos en C.C. Don Ramón, Arequipa.',
  keywords: [
    'jeans Arequipa',
    'ropa de moda Arequipa',
    'jeans dama',
    'jeans varón',
    'bermudas',
    'casacas jean',
    'faldas jean',
    'Club Karolay Jeans',
    'moda urbana Perú',
    'tienda de jeans',
    'baggy jeans',
    'ropa denim',
  ],
  openGraph: {
    title: 'Club Karolay Jeans | Denim & Fashion',
    description:
      'Tu destino de moda denim en Arequipa. Jeans, casacas, bermudas y outfits con estilo para dama y varón.',
    url: 'https://www.clubkarolayjeans.com',
    siteName: 'Club Karolay Jeans',
    locale: 'es_PE',
    type: 'website',
    images: [
      {
        url: '/images/hero/hero-lg.png',
        width: 1200,
        height: 630,
        alt: 'Club Karolay Jeans - Moda Denim',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Club Karolay Jeans | Denim & Fashion',
    description: 'Jeans, casacas y bermudas con estilo en Arequipa.',
    images: ['/images/hero/hero-lg.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.clubkarolayjeans.com',
  },
  icons: {
    icon: '/images/favicon.png',
    apple: '/images/apple-touch-icon.png',
  },
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
              name: 'Club Karolay Jeans',
              description: 'Tienda especializada en jeans y moda denim para dama y varón en Arequipa.',
              url: 'https://www.clubkarolayjeans.com',
              telephone: '+51940403984',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Av. Siglo XX 209-213, C.C. Don Ramón, INT. B-77',
                addressLocality: 'Arequipa',
                addressRegion: 'Arequipa',
                postalCode: '04001',
                addressCountry: 'PE',
              },
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
              image: 'https://www.clubkarolayjeans.com/images/hero/hero-lg.webp',
              priceRange: '$$',
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
