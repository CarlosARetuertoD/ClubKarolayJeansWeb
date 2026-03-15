import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { BUSINESS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: 'Política de privacidad y protección de datos personales de Club Karolay Jeans.',
}

export default function PrivacidadPage() {
  return (
    <main className="bg-dark-radial min-h-screen">
      {/* Top bar */}
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={40} height={40} className="h-9 w-auto" />
          <span className="text-white font-heading text-sm font-semibold tracking-wider uppercase hidden sm:inline">
            {BUSINESS.name}
          </span>
        </Link>
        <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <div className="bg-card-radial rounded-2xl p-6 sm:p-10 border border-white/6">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Política de Privacidad</h1>
          <p className="text-white/40 text-sm mb-8">Última actualización: Marzo 2026</p>

          <div className="space-y-6 text-white/75 text-sm leading-relaxed">
            <Section title="1. Información que recopilamos">
              <p>
                En <strong className="text-white">Club Karolay Jeans</strong> recopilamos la siguiente
                información cuando te registras en nuestro club de clientes o interactúas con nuestro sitio web:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Nombre completo</li>
                <li>Número de celular</li>
                <li>Correo electrónico</li>
                <li>Datos de navegación (páginas visitadas, dispositivo, navegador)</li>
                <li>Interacciones con promociones y catálogo</li>
              </ul>
            </Section>

            <Section title="2. Uso de la información">
              <p>Utilizamos tus datos personales para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Identificarte como miembro del Club Karolay Jeans y aplicar descuentos</li>
                <li>Enviarte información sobre promociones, novedades y campañas por WhatsApp</li>
                <li>Mejorar tu experiencia de compra en nuestras tiendas</li>
                <li>Analizar el tráfico y uso de nuestro sitio web para mejorar nuestros servicios</li>
              </ul>
            </Section>

            <Section title="3. Protección de datos">
              <p>
                Tus datos se almacenan en servidores seguros con cifrado y acceso restringido.
                No vendemos, alquilamos ni compartimos tu información personal con terceros
                para fines comerciales ajenos a Club Karolay Jeans.
              </p>
            </Section>

            <Section title="4. Cookies y tracking">
              <p>
                Nuestro sitio web utiliza tecnologías de seguimiento para registrar visitas a páginas
                y clicks en secciones de interés. Esta información es anónima y se usa exclusivamente
                para mejorar la experiencia del usuario y medir la efectividad de nuestras campañas.
              </p>
            </Section>

            <Section title="5. Derechos del usuario">
              <p>
                De acuerdo con la Ley N.° 29733, Ley de Protección de Datos Personales del Perú,
                tienes derecho a:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Acceder a tus datos personales</li>
                <li>Rectificar información inexacta</li>
                <li>Cancelar o solicitar la eliminación de tus datos</li>
                <li>Oponerte al tratamiento de tus datos</li>
              </ul>
              <p className="mt-2">
                Para ejercer estos derechos, escríbenos a{' '}
                <a href={`mailto:${BUSINESS.email}`} className="text-mocha-500 hover:underline">{BUSINESS.email}</a>{' '}
                o comunícate por WhatsApp al{' '}
                <span className="text-mocha-500">{BUSINESS.phone}</span>.
              </p>
            </Section>

            <Section title="6. Cambios en esta política">
              <p>
                Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento.
                Los cambios se publicarán en esta página con la fecha de última actualización.
              </p>
            </Section>

            <Section title="7. Contacto">
              <p>
                <strong className="text-white">{BUSINESS.name}</strong><br />
                {BUSINESS.address}<br />
                {BUSINESS.city}<br />
                {BUSINESS.phone}<br />
                {BUSINESS.email}
              </p>
            </Section>
          </div>
        </div>
      </article>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-heading font-semibold text-white mb-2">{title}</h2>
      {children}
    </div>
  )
}
