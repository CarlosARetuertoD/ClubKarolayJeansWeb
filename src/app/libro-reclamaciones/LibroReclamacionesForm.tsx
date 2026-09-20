'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { BUSINESS } from '@/lib/constants'
import type { ComplaintForm, ComplaintReceipt } from '@/lib/legal'

const initial: ComplaintForm = {
  nombre: '', tipo_documento: 'DNI', dni: '', celular: '', email: '', direccion: '',
  respuesta: 'email', menor: false, representante: '', tipo_bien: 'producto',
  descripcion_bien: '', monto: '', moneda: 'PEN', comprobante: '', tipo: 'reclamo', detalle: '', pedido: '',
}
const fieldClass = 'w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none'
const buttonClass = 'px-6 py-3 bg-mocha-500 rounded-xl text-white font-semibold disabled:opacity-50'

export default function LibroReclamacionesForm() {
  const [form, setForm] = useState<ComplaintForm>(initial)
  const [receipt, setReceipt] = useState<ComplaintReceipt | null>(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const submission = useRef<Record<string, unknown> | null>(null)
  const [attempted, setAttempted] = useState(false)
  function update(key: keyof ComplaintForm, value: string | boolean) {
    setForm(previous => ({ ...previous, [key]: value }))
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (sending) return
    // Reuse the exact request after a network failure: the server returns the same receipt.
    if (!submission.current) submission.current = {
      ...form, monto: form.monto === '' ? null : form.monto,
      representante: form.menor ? form.representante : '',
      solicitud_id: crypto.randomUUID(),
    }
    setAttempted(true)
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/reclamaciones', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submission.current),
      })
      const data = await response.json()
      if (!response.ok) {
        // Only validation failures are known not to have persisted the request.
        if (response.status === 400) { submission.current = null; setAttempted(false) }
        throw new Error(data.error || 'No se pudo confirmar el registro.')
      }
      if (!data.numero || !data.fecha || !data.contenido) throw new Error('No se recibió una constancia. Reintenta para confirmar tu registro.')
      setReceipt(data)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo conectar. Reintenta sin cerrar esta página.')
    } finally { setSending(false) }
  }
  const textField = (key: keyof ComplaintForm, title: string, required = false, type = 'text', maxLength = 200) => (
    <label className="block space-y-1.5" htmlFor={key}>
      <span className="text-sm text-white/70">{title}{required ? ' *' : ' (opcional)'}</span>
      <input id={key} type={type} required={required} maxLength={maxLength} value={String(form[key] ?? '')}
        onChange={e => update(key, e.target.value)} className={fieldClass}
        {...(type === 'number' ? { min: '0', step: '0.01' } : {})} />
    </label>
  )
  const selectField = (key: keyof ComplaintForm, title: string, options: [string, string][]) => (
    <label className="block space-y-1.5" htmlFor={key}>
      <span className="text-sm text-white/70">{title}</span>
      <select id={key} value={String(form[key])} onChange={e => update(key, e.target.value)} className={fieldClass}>
        {options.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
      </select>
    </label>
  )
  return (
    <main className="bg-dark-radial min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between print:hidden">
        <Link href="/"><Image src="/images/logo/logoKarolay.png" alt={BUSINESS.name} width={40} height={40} /></Link>
        <Link href="/" className="text-white/60 text-sm">Volver al inicio</Link>
      </div>
      <article className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <div className="bg-card-radial rounded-2xl p-6 sm:p-10 border border-white/10">
          <h1 className="text-2xl font-heading font-bold mb-3">Libro de Reclamaciones</h1>
          <p className="text-white/60 text-sm mb-5">Ley N.° 29571 · D.S. N.° 011-2011-PCM y modificatorias. Libro del establecimiento B-77, canal web.</p>
          <div className="glass rounded-xl p-4 mb-6 text-sm text-white/70">
            <p>{BUSINESS.legalName} · RUC {BUSINESS.ruc}</p>
            <p>{BUSINESS.address}, {BUSINESS.city}</p>
            <p>{BUSINESS.email} · {BUSINESS.phone}</p>
          </div>
          {receipt ? (
            <div className="complaint-receipt">
              <h2 className="text-xl font-semibold mb-4">Hoja de Reclamación N.° {receipt.numero}</h2>
              <p>Fecha de registro: {new Intl.DateTimeFormat('es-PE', { timeZone: 'America/Lima', dateStyle: 'long', timeStyle: 'short' }).format(new Date(receipt.fecha))}</p>
              <p className="text-white/60 text-sm mb-5">Copia del consumidor. Conserva esta constancia para el seguimiento.</p>
              <dl className="space-y-3 text-sm">
                {[
                  ['Consumidor', receipt.contenido.nombre], ['Documento', receipt.contenido.tipo_documento + ' ' + receipt.contenido.dni],
                  ['Domicilio', receipt.contenido.direccion], ['Teléfono', receipt.contenido.celular || 'No indicado'],
                  ['Correo', receipt.contenido.email || 'No indicado'], ['Medio de respuesta', receipt.contenido.respuesta],
                  ['Representante del menor', receipt.contenido.menor ? receipt.contenido.representante : 'No aplica'],
                  ['Bien', receipt.contenido.tipo_bien + ': ' + receipt.contenido.descripcion_bien],
                  ['Monto', receipt.contenido.monto === null ? 'No determinado / no aplica' : receipt.contenido.moneda + ' ' + receipt.contenido.monto],
                  ['Comprobante', receipt.contenido.comprobante || 'No indicado'],
                  ['Tipo', receipt.contenido.tipo], ['Detalle', receipt.contenido.detalle], ['Pedido', receipt.contenido.pedido],
                  ['Observaciones y acciones del proveedor', 'Pendiente de atención. La respuesta se comunicará por el medio elegido.'],
                ].map(([label, value]) => <div key={label}><dt className="font-semibold">{label}</dt><dd className="text-white/70 whitespace-pre-wrap break-words">{value}</dd></div>)}
              </dl>
              <button type="button" onClick={() => window.print()} className={buttonClass + ' mt-6 print:hidden'}>Imprimir o guardar PDF</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <p className="text-sm text-white/70">No necesitas una cuenta, un comprobante ni citar normas para presentar tu reclamo o queja. Completa los campos con *.</p>
              <fieldset disabled={sending || attempted} className="space-y-4 disabled:opacity-70">
                <legend className="font-heading font-semibold text-mocha-400 mb-4">1. Identificación del consumidor</legend>
                {textField('nombre', 'Nombre completo', true)}
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectField('tipo_documento', 'Tipo de documento', [['DNI', 'DNI'], ['CE', 'Carné de extranjería'], ['Pasaporte', 'Pasaporte']])}
                  {textField('dni', 'Número de documento', true, 'text', 15)}
                </div>
                {textField('direccion', 'Domicilio completo: dirección, distrito, provincia y departamento', true, 'text', 1000)}
                {textField('celular', 'Teléfono', false, 'tel', 20)}
                {selectField('respuesta', 'Deseo recibir la respuesta por', [['email', 'Correo electrónico'], ['domicilio', 'Carta a mi domicilio']])}
                {textField('email', 'Correo electrónico', form.respuesta === 'email', 'email', 254)}
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.menor} onChange={e => update('menor', e.target.checked)} />El consumidor es menor de edad</label>
                {form.menor && textField('representante', 'Nombre, documento, domicilio y contacto del padre, madre o representante', true, 'text', 1000)}
              </fieldset>
              <fieldset disabled={sending || attempted} className="space-y-4 disabled:opacity-70">
                <legend className="font-heading font-semibold text-mocha-400 mb-4">2. Bien y motivo de la reclamación</legend>
                {selectField('tipo_bien', 'Bien relacionado', [['producto', 'Producto'], ['servicio', 'Servicio / atención']])}
                {textField('descripcion_bien', 'Descripción del producto o servicio', true, 'text', 3000)}
                <div className="grid sm:grid-cols-2 gap-4">
                  {selectField('moneda', 'Moneda', [['PEN', 'Soles'], ['USD', 'Dólares']])}
                  {textField('monto', 'Monto reclamado, si corresponde', false, 'number')}
                </div>
                <p className="text-xs text-white/50">Si el monto no puede determinarse o no aplica a tu queja, déjalo vacío.</p>
                {textField('comprobante', 'Número de comprobante', false, 'text', 100)}
                {selectField('tipo', 'Tipo de presentación', [['reclamo', 'Reclamo: disconformidad con el producto o servicio'], ['queja', 'Queja: disconformidad con la atención']])}
                {(['detalle', 'pedido'] as const).map(key => <label key={key} htmlFor={key} className="block space-y-1.5">
                  <span className="text-sm text-white/70">{key === 'detalle' ? 'Describe lo sucedido' : 'Indica qué solución solicitas'} *</span>
                  <textarea id={key} required rows={4} maxLength={key === 'detalle' ? 10000 : 5000} value={form[key]} onChange={e => update(key, e.target.value)} className={fieldClass} />
                </label>)}
              </fieldset>
              <p className="text-white/60 text-xs leading-relaxed">Tratamos tus datos para registrar, atender y conservar esta reclamación por obligación legal. No se utilizarán para publicidad. Consulta la <Link href="/privacidad" className="text-mocha-400 underline" target="_blank" rel="noopener noreferrer">Política de Privacidad</Link>. Presentar el reclamo no exige aceptar condiciones comerciales.</p>
              {error && <p role="alert" className="text-red-300 text-sm">{error} Si el libro virtual no está disponible, solicita el libro físico en {BUSINESS.address}.</p>}
              {attempted && !sending && <p className="text-xs text-white/60">El envío no se ha confirmado. Reintenta con los mismos datos para evitar registrar una hoja duplicada.</p>}
              <button type="submit" disabled={sending} className={buttonClass}>{sending ? 'Registrando…' : attempted ? 'Reintentar y obtener constancia' : 'Registrar y obtener constancia'}</button>
            </form>
          )}
          <p className="text-white/60 text-xs leading-relaxed mt-8">Responderemos en un máximo de 15 días hábiles improrrogables. La presentación no impide acudir a otras vías ni es requisito previo para denunciar ante Indecopi.</p>
        </div>
      </article>
      <style>{'@media print { body, main, article, article * { background: white !important; color: black !important; box-shadow: none !important; } article { max-width: none !important; padding: 0 !important; } .complaint-receipt dl > div { break-inside: avoid; } }'}</style>
    </main>
  )
}
