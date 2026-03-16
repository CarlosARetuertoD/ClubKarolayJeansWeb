import Link from 'next/link'
import { BUSINESS, WHATSAPP_URL, WHATSAPP_DEFAULT_MSG } from '@/lib/constants'

export default function Footer() {
  return (
    <footer id="contacto" className="bg-dark text-white pt-16 pb-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1 - About + Social */}
          <div>
            <h3 className="text-lg font-bold font-heading mb-4 tracking-wide">
              CLUB KAROLAY JEANS
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              {BUSINESS.description}
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-5">
              {[
                { href: `${WHATSAPP_URL}${WHATSAPP_DEFAULT_MSG}`, label: 'WhatsApp', icon: 'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z' },
                { href: BUSINESS.social.instagram, label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                { href: BUSINESS.social.tiktok, label: 'TikTok', icon: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.7a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.13z' },
                { href: BUSINESS.social.facebook, label: 'Facebook', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/8 flex items-center justify-center text-white/70 hover:bg-mocha-500 hover:text-white transition-all hover:-translate-y-0.5" aria-label={s.label}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={s.icon} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 - Links */}
          <div>
            <h4 className="text-base font-semibold font-heading mb-4 relative pb-2">
              Empresa
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-mocha-500" />
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/#nosotros', label: 'Sobre Nosotros' },
                { href: '/catalogo', label: 'Catálogo' },
                { href: '/promociones', label: 'Promociones' },
                { href: '/bio', label: 'Tarjeta Digital' },
                { href: '/registro', label: 'Club de Clientes' },
              ].map((l) => (
                <li key={l.href} className="group">
                  <Link
                    href={l.href}
                    className="text-white/70 text-sm hover:text-mocha-500 transition-all group-hover:translate-x-1 inline-flex items-center gap-2"
                  >
                    <span className="text-mocha-500 text-xs">&rsaquo;</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Categories */}
          <div>
            <h4 className="text-base font-semibold font-heading mb-4 relative pb-2">
              Categorias
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-mocha-500" />
            </h4>
            <ul className="space-y-2">
              {['Jeans', 'Casacas', 'Bermudas', 'Faldas', 'Tendencias'].map((cat) => (
                <li key={cat} className="group">
                  <Link
                    href="/catalogo"
                    className="text-white/70 text-sm hover:text-mocha-500 transition-all group-hover:translate-x-1 inline-flex items-center gap-2"
                  >
                    <span className="text-mocha-500 text-xs">&rsaquo;</span>
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Dirección + Maps + Social */}
          <div>
            <h4 className="text-base font-semibold font-heading mb-4 relative pb-2 underline underline-offset-4 decoration-mocha-500/50">
              Dirección
            </h4>
            <p className="text-white/70 text-sm leading-relaxed mb-1">
              {BUSINESS.address}
            </p>
            <p className="text-white/50 text-sm mb-3">
              {BUSINESS.city}
            </p>
            <p className="text-white/50 text-sm mb-1">{BUSINESS.phone}</p>
            <p className="text-white/40 text-xs mb-3">{BUSINESS.email}</p>

            {/* Abrir en Maps */}
            <a
              href="https://www.google.com/maps/place/Megacentro+DON+RAM%C3%93N/@-16.400515,-71.5287654,18z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-mocha-500 text-sm font-medium hover:text-mocha-400 transition-colors mb-3"
            >
              Abrir en Maps
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {/* Google Maps */}
            <div className="rounded-lg overflow-hidden border border-white/10 h-44">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d956.88!2d-71.5287654!3d-16.400515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91424a544ea4baff%3A0xa91a525ba62a7ebb!2sMegacentro%20DON%20RAM%C3%93N!5e0!3m2!1ses!2spe!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Club Karolay Jeans"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
            <p className="text-white/60 text-sm">
              &copy; {new Date().getFullYear()} <strong>Club Karolay Jeans</strong>. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacidad" className="text-white/50 text-xs hover:text-mocha-500 transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
          <p className="text-white/40 text-xs text-center sm:text-right">
            Desarrollado por {BUSINESS.developer}
          </p>
        </div>
      </div>
    </footer>
  )
}