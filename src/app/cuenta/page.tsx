import type { Metadata } from 'next'
import CuentaContent from './CuentaContent'

export const metadata: Metadata = {
  title: 'Mi Cuenta',
  description: 'Administra tu cuenta, edita tus datos y gestiona tu membresía de Club Karolay Jeans.',
  robots: { index: false, follow: false },
}

export default function CuentaPage() {
  return <CuentaContent />
}
