import type { Metadata } from 'next'
import RegistroForm from './RegistroForm'

export const metadata: Metadata = {
  title: 'Únete al Club VIP — Descuentos Exclusivos en Jeans',
  description: 'Regístrate gratis en Club Karolay Jeans y accede a descuentos exclusivos, promociones y novedades en jeans y moda denim en Arequipa. Recibe tu tarjeta digital al instante.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/registro' },
  openGraph: {
    title: 'Únete al Club VIP | Club Karolay Jeans',
    description: 'Registro gratuito. Descuentos exclusivos y tarjeta digital al instante.',
    url: 'https://www.clubkarolayjeans.com/registro',
  },
}

export default function RegistroPage() {
  return <RegistroForm />
}
