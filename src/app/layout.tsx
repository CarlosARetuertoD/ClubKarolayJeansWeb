import type { Metadata } from 'next'
import './globals.css'
import TrackingProvider from '@/components/TrackingProvider'

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
      <body className="font-sans antialiased bg-dark text-white">
        <TrackingProvider />
        {children}
      </body>
    </html>
  )
}
