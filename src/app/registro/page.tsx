import type { Metadata } from 'next'
import RegistroForm from './RegistroForm'

export const metadata: Metadata = {
  title: 'Únete al Club',
  description: 'Regístrate en Club Karolay Jeans y accede a descuentos exclusivos, promociones y novedades antes que nadie.',
}

export default function RegistroPage() {
  return <RegistroForm />
}
