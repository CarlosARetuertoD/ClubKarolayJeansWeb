import type { Metadata } from 'next'
import LibroReclamacionesForm from './LibroReclamacionesForm'

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones Virtual',
  description: 'Libro de Reclamaciones virtual de Club Karolay Jeans conforme a la Ley N.° 29571 del Código de Protección y Defensa del Consumidor. Registra tu queja o reclamo.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/libro-reclamaciones' },
  robots: { index: true, follow: true },
}

export default function LibroReclamacionesPage() {
  return <LibroReclamacionesForm />
}
