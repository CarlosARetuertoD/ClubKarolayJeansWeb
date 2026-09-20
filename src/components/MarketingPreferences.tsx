'use client'

import { useEffect, useState } from 'react'
import { clubFetch } from '@/lib/session'
import { BUSINESS } from '@/lib/constants'
import { MARKETING_TEXT } from '@/lib/legal'

export default function MarketingPreferences() {
  const [channels, setChannels] = useState<{ whatsapp: boolean; email: boolean } | null>(null)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)
  useEffect(() => {
    clubFetch('/api/cuenta').then(async res => {
      const data = await res.json()
      if (!res.ok || !data.cliente?.marketing) throw new Error()
      setChannels(data.cliente.marketing)
    }).catch(() => setMessage('No se pudieron cargar tus preferencias.'))
  }, [])
  async function save(next: { whatsapp: boolean; email: boolean }) {
    setSaving(true); setMessage('')
    try {
      const res = await clubFetch('/api/cuenta', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ marketing: next }) })
      const data = await res.json()
      if (!res.ok || !data.cliente?.marketing) throw new Error()
      setChannels(data.cliente.marketing)
      setMessage('Preferencias guardadas.')
    } catch { setMessage('No se pudo guardar. Intenta nuevamente o solicita la baja por correo.') }
    finally { setSaving(false) }
  }
  return <section className="bg-card-radial rounded-2xl border border-white/10 p-5 space-y-4 mb-6">
    <h2 className="font-heading font-semibold">Mis comunicaciones</h2>
    <p className="text-sm text-white/60">{MARKETING_TEXT}</p>
    {channels && <>
      <div className="flex gap-5 text-sm">
        <label className="flex gap-2"><input type="checkbox" disabled={saving} checked={channels.whatsapp} onChange={e => setChannels({ ...channels, whatsapp: e.target.checked })} />WhatsApp</label>
        <label className="flex gap-2"><input type="checkbox" disabled={saving} checked={channels.email} onChange={e => setChannels({ ...channels, email: e.target.checked })} />Correo</label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button disabled={saving} onClick={() => save(channels)} className="px-4 py-2 rounded-xl bg-mocha-500 disabled:opacity-50">Guardar preferencias</button>
        <button disabled={saving} onClick={() => save({ whatsapp: false, email: false })} className="px-4 py-2 rounded-xl border border-white/20 disabled:opacity-50">Dar de baja toda la publicidad</button>
      </div>
    </>}
    <p role="status" className="text-sm text-white/70">{message}</p>
    <p className="text-xs text-white/50">También puedes solicitar la baja gratuitamente a <a href={`mailto:${BUSINESS.email}?subject=Baja%20de%20publicidad`} className="underline">{BUSINESS.email}</a>. Tu cuenta y beneficios seguirán activos.</p>
  </section>
}
