'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { analyticsAllowed, analyticsDecided, setAnalyticsConsent } from '@/lib/analyticsConsent'

export default function PrivacyPreferences() {
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)
  useEffect(() => { setVisible(!analyticsDecided()); setReady(true) }, [])
  if (!ready) return null
  function choose(accept: boolean) { setAnalyticsConsent(accept); setVisible(false) }
  return <aside aria-label="Preferencias de privacidad" className="print:hidden">
    {visible ? <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-xl max-h-[85dvh] overflow-y-auto z-[100] bg-dark/95 backdrop-blur-xl border border-mocha-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_16px_64px_rgba(0,0,0,0.55)] text-center">
      <span className="inline-block mb-3 text-mocha-400 text-[10px] font-semibold uppercase tracking-[0.22em]">Tú eliges</span>
      <h2 className="font-heading text-2xl sm:text-3xl font-semibold mb-3">Tu privacidad importa</h2>
      <p className="text-white/70 text-sm leading-relaxed">Usamos cookies necesarias para la sesión. Solo si aceptas mediremos visitas y clics para mejorar la web. Puedes cambiar tu elección en cualquier momento.</p>
      <Link href="/privacidad" className="inline-block mt-3 text-mocha-400 underline underline-offset-4 text-sm hover:text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mocha-400">Ver Política de Privacidad</Link>
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-3 mt-6">
        <button onClick={() => choose(false)} className="border border-mocha-500/70 bg-mocha-500/10 rounded-xl px-4 py-3 text-sm font-medium hover:bg-mocha-500/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mocha-400 focus-visible:outline-offset-2">Solo necesarias</button>
        <button onClick={() => choose(true)} className="border border-mocha-500/70 bg-mocha-500/10 rounded-xl px-4 py-3 text-sm font-medium hover:bg-mocha-500/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-mocha-400 focus-visible:outline-offset-2">Aceptar medición</button>
      </div>
      {analyticsDecided() && <button onClick={() => setVisible(false)} className="text-xs underline mt-3">Cerrar sin cambiar</button>}
    </div> : <button onClick={() => setVisible(true)} aria-label={`Preferencias de privacidad. Medición ${analyticsAllowed() ? 'activada' : 'desactivada'}`} className="fixed bottom-2 left-2 z-40 bg-dark border border-white/20 px-3 py-2 rounded-full text-xs text-white/70">Privacidad</button>}
  </aside>
}
