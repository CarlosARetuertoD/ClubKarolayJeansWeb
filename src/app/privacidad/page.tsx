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
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-mocha-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-mocha-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">Política de Privacidad</h1>
              <p className="text-white/40 text-sm mt-1">Última actualización: Marzo 2026</p>
            </div>
          </div>

          {/* Intro */}
          <div className="glass rounded-xl p-4 mb-8 text-sm text-white/60 leading-relaxed">
            <p>
              En <strong className="text-white/90">{BUSINESS.name}</strong>, operado por Negocios e Inversiones Karolay, nos comprometemos a proteger tu privacidad y tus datos personales en cumplimiento de la <strong className="text-white/80">Ley N.° 29733</strong>, Ley de Protección de Datos Personales del Perú, y su Reglamento aprobado por D.S. N.° 003-2013-JUS. Esta política describe cómo recopilamos, usamos, almacenamos y protegemos tu información.
            </p>
          </div>

          <div className="space-y-8 text-white/75 text-sm leading-relaxed">
            <Section title="1. Responsable del tratamiento" number="01">
              <div className="glass rounded-lg p-4 space-y-1 text-sm">
                <p><strong className="text-white/90">Razón social:</strong> Negocios e Inversiones Karolay</p>
                <p><strong className="text-white/90">Domicilio:</strong> {BUSINESS.address}, {BUSINESS.city}</p>
                <p><strong className="text-white/90">Teléfono:</strong> {BUSINESS.phone}</p>
                <p><strong className="text-white/90">Correo:</strong>{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="text-mocha-500 hover:underline">{BUSINESS.email}</a>
                </p>
              </div>
            </Section>

            <Section title="2. Datos personales que recopilamos" number="02">
              <p className="mb-3">Recopilamos información personal cuando te registras en nuestro Club de Clientes, realizas una compra, utilizas nuestro sitio web o te comunicas con nosotros:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DataCategory title="Datos de identificación" items={['Nombre completo', 'Documento de identidad (DNI / CE)', 'Fecha de nacimiento']} />
                <DataCategory title="Datos de contacto" items={['Número de celular', 'Correo electrónico', 'Dirección (si la proporcionas)']} />
                <DataCategory title="Datos de compra" items={['Historial de compras en tienda', 'Preferencias de productos', 'Tallas y estilos preferidos']} />
                <DataCategory title="Datos de navegación" items={['Páginas visitadas', 'Dispositivo y navegador', 'Interacciones con el sitio']} />
              </div>
            </Section>

            <Section title="3. Finalidad del tratamiento" number="03">
              <p className="mb-3">Tus datos personales serán utilizados para las siguientes finalidades:</p>
              <div className="space-y-2">
                <FinalidadItem title="Gestión del Club de Clientes" desc="Identificarte como miembro, gestionar tu tarjeta digital y aplicar descuentos exclusivos en tienda." />
                <FinalidadItem title="Comunicaciones comerciales" desc="Enviarte información sobre promociones, novedades, lanzamientos y campañas especiales a través de WhatsApp, correo electrónico u otros medios que hayas autorizado." />
                <FinalidadItem title="Mejora del servicio" desc="Analizar tus preferencias de compra para ofrecerte una experiencia personalizada y mejorar nuestro catálogo de productos." />
                <FinalidadItem title="Atención al cliente" desc="Gestionar consultas, reclamos y solicitudes que realices a través de nuestros canales de atención." />
                <FinalidadItem title="Análisis y estadísticas" desc="Realizar análisis internos de tráfico web y comportamiento de compra de forma agregada y anónima." />
              </div>
            </Section>

            <Section title="4. Base legal del tratamiento" number="04">
              <p>El tratamiento de tus datos se fundamenta en:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li><strong className="text-white/90">Consentimiento:</strong> Al registrarte en el Club o utilizar nuestro sitio web, otorgas tu consentimiento libre, expreso e informado para el tratamiento de tus datos.</li>
                <li><strong className="text-white/90">Ejecución contractual:</strong> El tratamiento es necesario para la gestión de tu membresía y la aplicación de beneficios.</li>
                <li><strong className="text-white/90">Interés legítimo:</strong> Para la mejora de nuestros servicios y la prevención de fraudes.</li>
              </ul>
            </Section>

            <Section title="5. Almacenamiento y seguridad" number="05">
              <p>
                Tus datos se almacenan en servidores seguros con cifrado en tránsito (TLS/SSL) y en reposo. Implementamos medidas técnicas y organizativas para proteger tu información contra acceso no autorizado, pérdida, alteración o destrucción, incluyendo:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Control de acceso restringido al personal autorizado</li>
                <li>Cifrado de datos sensibles</li>
                <li>Políticas internas de confidencialidad</li>
                <li>Revisión periódica de medidas de seguridad</li>
              </ul>
            </Section>

            <Section title="6. Compartición de datos con terceros" number="06">
              <p>
                <strong className="text-white/90">No vendemos, alquilamos ni comercializamos</strong> tus datos personales con terceros. Solo compartimos información en los siguientes casos:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li><strong className="text-white/90">Proveedores de servicios:</strong> Plataformas tecnológicas que nos ayudan a operar el sitio web y gestionar comunicaciones (hosting, mensajería), bajo acuerdos de confidencialidad.</li>
                <li><strong className="text-white/90">Obligación legal:</strong> Cuando sea requerido por autoridades judiciales o administrativas competentes conforme a la legislación peruana vigente.</li>
              </ul>
            </Section>

            <Section title="7. Cookies y tecnologías de seguimiento" number="07">
              <p>Nuestro sitio web utiliza tecnologías de seguimiento para:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1.5">
                <li>Registrar visitas a páginas y secciones del sitio</li>
                <li>Medir la efectividad de nuestras campañas promocionales</li>
                <li>Mejorar la experiencia de navegación</li>
              </ul>
              <p className="mt-2">
                Esta información se recopila de forma anónima y agregada. No utilizamos cookies de terceros con fines publicitarios. Puedes configurar tu navegador para rechazar cookies, aunque esto podría afectar la funcionalidad del sitio.
              </p>
            </Section>

            <Section title="8. Plazo de conservación" number="08">
              <p>
                Conservamos tus datos personales mientras mantengas tu membresía activa en el Club de Clientes y durante el plazo necesario para cumplir con las finalidades descritas. Una vez que solicites la eliminación de tus datos o te des de baja, procederemos a su supresión en un plazo máximo de <strong className="text-white/90">30 días hábiles</strong>, salvo que exista una obligación legal que requiera su conservación.
              </p>
            </Section>

            <Section title="9. Derechos del titular de datos personales" number="09">
              <p className="mb-3">
                De acuerdo con la Ley N.° 29733 y su Reglamento, como titular de tus datos personales tienes derecho a:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <DerechoItem letter="A" title="Acceso" desc="Conocer qué datos personales tuyos están siendo tratados." />
                <DerechoItem letter="R" title="Rectificación" desc="Solicitar la corrección de datos inexactos o incompletos." />
                <DerechoItem letter="C" title="Cancelación" desc="Solicitar la eliminación de tus datos cuando ya no sean necesarios." />
                <DerechoItem letter="O" title="Oposición" desc="Oponerte al tratamiento de tus datos para determinadas finalidades." />
              </div>
              <div className="glass rounded-lg p-4 mt-4">
                <p className="text-white/80 text-sm">
                  Para ejercer cualquiera de estos derechos (ARCO), envía tu solicitud a{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="text-mocha-500 hover:underline">{BUSINESS.email}</a>{' '}
                  indicando tu nombre completo, número de documento y el derecho que deseas ejercer. Atenderemos tu solicitud en un plazo máximo de <strong>10 días hábiles</strong>.
                </p>
              </div>
            </Section>

            <Section title="10. Menores de edad" number="10">
              <p>
                Nuestros servicios están dirigidos a personas mayores de 18 años. No recopilamos intencionalmente datos de menores de edad. Si detectamos que hemos recopilado información de un menor sin el consentimiento de sus padres o tutores, procederemos a eliminarla de inmediato.
              </p>
            </Section>

            <Section title="11. Modificaciones a esta política" number="11">
              <p>
                Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en esta página con la fecha de última actualización. Te recomendamos revisar esta política periódicamente.
              </p>
            </Section>

            <Section title="12. Contacto y consultas" number="12">
              <div className="glass rounded-lg p-4 space-y-1 text-sm">
                <p className="text-white/90 font-heading font-semibold mb-2">{BUSINESS.name}</p>
                <p><strong className="text-white/80">Dirección:</strong> {BUSINESS.address}, {BUSINESS.city}</p>
                <p><strong className="text-white/80">Teléfono:</strong> {BUSINESS.phone}</p>
                <p><strong className="text-white/80">Correo:</strong>{' '}
                  <a href={`mailto:${BUSINESS.email}`} className="text-mocha-500 hover:underline">{BUSINESS.email}</a>
                </p>
              </div>
              <p className="mt-3 text-white/40 text-xs">
                Si consideras que tus derechos no han sido debidamente atendidos, puedes presentar una reclamación ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos del Perú.
              </p>
            </Section>
          </div>
        </div>
      </article>
    </main>
  )
}

function Section({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-lg bg-mocha-500/15 flex items-center justify-center text-mocha-500 text-xs font-heading font-bold flex-shrink-0">
          {number}
        </span>
        <h2 className="text-base sm:text-lg font-heading font-semibold text-white">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function DataCategory({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="glass rounded-lg p-3">
      <p className="text-mocha-500 text-xs font-heading font-semibold uppercase tracking-wider mb-2">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="text-white/60 text-xs flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-mocha-500/50 flex-shrink-0" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function FinalidadItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-2">
      <svg className="w-4 h-4 text-mocha-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
      </svg>
      <p className="text-white/70 text-sm">
        <strong className="text-white/90">{title}:</strong> {desc}
      </p>
    </div>
  )
}

function DerechoItem({ letter, title, desc }: { letter: string; title: string; desc: string }) {
  return (
    <div className="glass rounded-lg p-3 flex items-start gap-3">
      <span className="w-8 h-8 rounded-full bg-mocha-500/20 flex items-center justify-center text-mocha-500 font-heading font-bold text-sm flex-shrink-0">
        {letter}
      </span>
      <div>
        <p className="text-white/90 text-sm font-semibold">{title}</p>
        <p className="text-white/50 text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  )
}
