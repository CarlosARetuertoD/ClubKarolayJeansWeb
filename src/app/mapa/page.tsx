import type { Metadata } from 'next'
import MapaContent from './MapaContent'

export const metadata: Metadata = {
  title: '¿Dónde estamos?',
  description: 'Encuentra Club Karolay Jeans en el C.C. Don Ramón - Siglo XX, Arequipa. Mapa del centro comercial.',
}

export default function MapaPage() {
  return <MapaContent />
}
