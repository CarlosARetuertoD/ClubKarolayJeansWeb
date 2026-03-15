import type { Metadata } from 'next'
import LibroReclamacionesForm from './LibroReclamacionesForm'

export const metadata: Metadata = {
  title: 'Libro de Reclamaciones',
  description: 'Libro de Reclamaciones virtual de Club Karolay Jeans conforme a la normativa peruana (Ley N.° 29571).',
}

export default function LibroReclamacionesPage() {
  return <LibroReclamacionesForm />
}
