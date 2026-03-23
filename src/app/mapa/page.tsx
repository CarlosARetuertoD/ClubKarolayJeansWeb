import type { Metadata } from 'next'
import MapaContent from './MapaContent'

export const metadata: Metadata = {
  title: 'Ubicación — C.C. Don Ramón, Av. Siglo XX, Arequipa',
  description: 'Encuentra Club Karolay Jeans en el Centro Comercial Don Ramón, Av. Siglo XX 209-213, INT. B-77, Cercado de Arequipa. Mapa interactivo y cómo llegar.',
  alternates: { canonical: 'https://www.clubkarolayjeans.com/mapa' },
  openGraph: {
    title: 'Ubicación | Club Karolay Jeans',
    description: 'C.C. Don Ramón, Av. Siglo XX 209-213, INT. B-77, Arequipa. Mapa y cómo llegar.',
    url: 'https://www.clubkarolayjeans.com/mapa',
  },
}

export default function MapaPage() {
  return <MapaContent />
}
