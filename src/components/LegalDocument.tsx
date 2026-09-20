import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS } from '@/lib/constants'

export function LegalDocument({
  title,
  updated,
  intro,
  children,
}: {
  title: string
  updated: string
  intro: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <main className="bg-dark-radial min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={40} height={40} className="h-9 w-auto" />
          <span className="text-white font-heading text-sm font-semibold tracking-wider uppercase hidden sm:inline">{BUSINESS.name}</span>
        </Link>
        <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al inicio
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <div className="bg-card-radial rounded-2xl p-6 sm:p-10 border border-white/6">
          <header className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-mocha-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-mocha-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-white">{title}</h1>
              <p className="text-white/40 text-sm mt-1">Última actualización: {updated}</p>
            </div>
          </header>

          <div className="glass rounded-xl p-4 mb-8 text-sm text-white/60 leading-relaxed">{intro}</div>
          <div className="space-y-8 text-white/75 text-sm leading-relaxed">{children}</div>
        </div>
      </article>
    </main>
  )
}

export function LegalSection({ title, number, children }: { title: string; number: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <span className="w-8 h-8 rounded-lg bg-mocha-500/15 flex items-center justify-center text-mocha-500 text-xs font-heading font-bold flex-shrink-0">{number}</span>
        <h2 className="text-base sm:text-lg font-heading font-semibold text-white">{title}</h2>
      </div>
      {children}
    </section>
  )
}

export function LegalBox({ children }: { children: React.ReactNode }) {
  return <div className="glass rounded-lg p-4 space-y-1 text-sm">{children}</div>
}

export const legalListClass = 'list-disc pl-5 mt-2 space-y-1.5'
