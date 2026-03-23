import type { Metadata } from 'next'
import LoginForm from './LoginForm'

export const metadata: Metadata = {
  title: 'Iniciar Sesión',
  description: 'Inicia sesión en tu cuenta de Club Karolay Jeans para acceder a tu tarjeta digital, promociones y descuentos exclusivos en jeans y moda denim.',
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return <LoginForm />
}
