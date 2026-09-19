import type { Metadata } from 'next'
import CanjearContent from './CanjearContent'

export const metadata: Metadata = {
  title: 'Canjear Código',
  description: 'Verificación y canje de código promocional de Club Karolay Jeans.',
  robots: { index: false, follow: false },
}

export default async function CanjearPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <CanjearContent token={token} />
}
