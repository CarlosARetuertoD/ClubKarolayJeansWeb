'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BUSINESS } from '@/lib/constants'

type Step = 'form' | 'loading' | 'success' | 'error'

const DEPARTAMENTOS = [
  'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
  'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
  'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
  'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
  'Tumbes', 'Ucayali',
]

const TIPO_DOC = ['DNI', 'Carné de Extranjería', 'Pasaporte', 'RUC']

export default function LibroReclamacionesForm() {
  const [step, setStep] = useState<Step>('form')
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false)
  const [aceptaVeracidad, setAceptaVeracidad] = useState(false)
  const [form, setForm] = useState({
    // Paso 1 — Datos personales
    tipoDocumento: 'DNI',
    dni: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    celular: '',
    telefonoFijo: '',
    email: '',
    // Paso 2 — Domicilio
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    referencia: '',
    codigoPostal: '',
    // Paso 3 — Datos del bien contratado
    tipoBien: 'producto' as 'producto' | 'servicio',
    descripcionBien: '',
    montoReclamado: '',
    moneda: 'PEN' as 'PEN' | 'USD',
    fechaCompra: '',
    horaCompra: '',
    nroComprobante: '',
    tipoComprobante: '',
    modalidadContratacion: 'tienda_fisica' as 'tienda_fisica' | 'comercio_electronico' | 'telefono' | 'catalogo',
    // Paso 4 — Reclamo o queja
    tipo: 'reclamo' as 'reclamo' | 'queja',
    detalle: '',
    pedido: '',
    fechaIncidente: '',
    lugarIncidente: '',
    // Paso 5 — Documentación adicional
    nroPedido: '',
    nombreVendedor: '',
    circunstancias: '',
    accionesRealizadas: '',
    fundamentoLegal: '',
    testigosPresentes: '',
    horaIncidente: '',
    medioPago: '',
    observaciones: '',
  })

  const update = (field: string, value: string) => setForm({ ...form, [field]: value })

  const totalPages = 5

  const validatePage = (page: number): string | null => {
    switch (page) {
      case 1:
        if (!form.tipoDocumento) return 'Seleccione un tipo de documento'
        if (!form.dni.trim()) return 'El número de documento es obligatorio'
        if (form.tipoDocumento === 'DNI' && form.dni.length !== 8) return 'El DNI debe tener exactamente 8 dígitos'
        if (!form.nombre.trim()) return 'El nombre es obligatorio'
        if (!form.apellidoPaterno.trim()) return 'El apellido paterno es obligatorio'
        if (!form.apellidoMaterno.trim()) return 'El apellido materno es obligatorio'
        if (!form.celular.trim()) return 'El celular es obligatorio'
        if (form.celular.length !== 9) return 'El celular debe tener 9 dígitos'
        if (!form.email.trim()) return 'El correo electrónico es obligatorio'
        return null
      case 2:
        if (!form.departamento) return 'Seleccione un departamento'
        if (!form.provincia.trim()) return 'La provincia es obligatoria'
        if (!form.distrito.trim()) return 'El distrito es obligatorio'
        if (!form.direccion.trim()) return 'La dirección es obligatoria'
        if (!form.codigoPostal.trim()) return 'El código postal es obligatorio'
        return null
      case 3:
        if (!form.descripcionBien.trim()) return 'La descripción del bien es obligatoria'
        if (!form.montoReclamado.trim()) return 'El monto reclamado es obligatorio'
        if (!form.fechaCompra) return 'La fecha de compra/contratación es obligatoria'
        if (!form.nroComprobante.trim()) return 'El número de comprobante es obligatorio'
        if (!form.tipoComprobante) return 'Seleccione el tipo de comprobante'
        return null
      case 4:
        if (!form.detalle.trim()) return 'La descripción del reclamo/queja es obligatoria'
        if (form.detalle.trim().length < 100) return 'La descripción debe tener al menos 100 caracteres para poder evaluar su caso correctamente'
        if (!form.pedido.trim()) return 'Debe indicar la solución esperada'
        if (form.pedido.trim().length < 50) return 'La solución esperada debe tener al menos 50 caracteres. Sea específico en lo que solicita'
        if (!form.fechaIncidente) return 'La fecha del incidente es obligatoria'
        if (!form.lugarIncidente.trim()) return 'El lugar del incidente es obligatorio'
        if (!form.nombreVendedor.trim()) return 'Debe indicar el nombre de la persona que lo atendió'
        if (!form.circunstancias.trim()) return 'Debe detallar las circunstancias del incidente'
        if (form.circunstancias.trim().length < 50) return 'Las circunstancias deben tener al menos 50 caracteres'
        if (!form.accionesRealizadas.trim()) return 'Debe indicar qué acciones previas ha realizado'
        if (!form.fundamentoLegal.trim()) return 'Debe indicar el fundamento de su reclamo'
        return null
      case 5:
        if (!aceptaTerminos) return 'Debe aceptar los términos y condiciones'
        if (!aceptaPrivacidad) return 'Debe aceptar la política de privacidad'
        if (!aceptaVeracidad) return 'Debe declarar la veracidad de la información'
        return null
      default:
        return null
    }
  }

  const nextPage = () => {
    const err = validatePage(currentPage)
    if (err) {
      setError(err)
      return
    }
    setError('')
    setCurrentPage((p) => Math.min(p + 1, totalPages))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prevPage = () => {
    setError('')
    setCurrentPage((p) => Math.max(p - 1, 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const err = validatePage(currentPage)
    if (err) {
      setError(err)
      return
    }
    setStep('loading')
    setError('')

    try {
      const { error: dbError } = await supabase.from('web_reclamaciones').insert({
        nombre: `${form.nombre} ${form.apellidoPaterno} ${form.apellidoMaterno}`,
        dni: form.dni,
        celular: form.celular,
        email: form.email,
        direccion: `${form.direccion}, ${form.distrito}, ${form.provincia}, ${form.departamento}`,
        tipo: form.tipo,
        detalle: form.detalle,
        pedido: form.pedido,
        estado: 'pendiente',
      })

      if (dbError) throw new Error(dbError.message)
      setStep('success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al enviar'
      setError(message)
      setStep('error')
    }
  }

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

      <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
        <div className="bg-card-radial rounded-2xl p-6 sm:p-10 border border-white/6">
          {/* Header */}
          <div className="flex items-start gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">Libro de Reclamaciones</h1>
              <p className="text-white/50 text-sm mt-1">
                Conforme al Código de Protección y Defensa del Consumidor (Ley N.° 29571) y su Reglamento aprobado por D.S. N.° 011-2011-PCM
              </p>
            </div>
          </div>

          {/* Provider info */}
          <div className="glass rounded-xl p-4 mb-6 text-sm text-white/70 space-y-1">
            <p><strong className="text-white/90">Razón Social:</strong> Negocios e Inversiones Karolay</p>
            <p><strong className="text-white/90">RUC:</strong> —</p>
            <p><strong className="text-white/90">Dirección:</strong> {BUSINESS.address}, {BUSINESS.city}</p>
            <p><strong className="text-white/90">Teléfono:</strong> {BUSINESS.phone}</p>
          </div>

          {/* Progress bar */}
          {step !== 'success' && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/40 text-xs font-heading uppercase tracking-wider">Paso {currentPage} de {totalPages}</p>
                <p className="text-white/40 text-xs">{Math.round((currentPage / totalPages) * 100)}%</p>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-mocha-500 to-mocha-600 rounded-full transition-all duration-500"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                {['Datos personales', 'Domicilio', 'Bien contratado', 'Reclamo/Queja', 'Confirmación'].map((label, i) => (
                  <p key={label} className={`text-[0.6rem] sm:text-xs ${i + 1 <= currentPage ? 'text-mocha-500' : 'text-white/20'}`}>
                    {label}
                  </p>
                ))}
              </div>
            </div>
          )}

          {step === 'success' ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-heading font-bold text-white mb-2">Reclamación registrada</h2>
              <p className="text-white/60 text-sm mb-2">
                Tu {form.tipo} ha sido registrado correctamente. Nos comprometemos a responder
                en un plazo máximo de 30 días calendario.
              </p>
              <p className="text-white/40 text-xs">
                Si necesitas seguimiento, comunícate al {BUSINESS.phone}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* ═══ PASO 1: Datos personales ═══ */}
              {currentPage === 1 && (
                <fieldset className="space-y-4">
                  <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-4">
                    1. Identificación del consumidor
                  </legend>
                  <p className="text-white/40 text-xs mb-4">
                    Complete todos los campos marcados con (*). La información debe coincidir con su documento de identidad vigente.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">Tipo de documento *</label>
                      <select
                        required
                        value={form.tipoDocumento}
                        onChange={(e) => update('tipoDocumento', e.target.value)}
                        className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                      >
                        {TIPO_DOC.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <Input label="Número de documento *" value={form.dni} onChange={(v) => update('dni', v)} required maxLength={form.tipoDocumento === 'DNI' ? 8 : 20} placeholder={form.tipoDocumento === 'DNI' ? '8 dígitos' : 'Ingrese su número'} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input label="Nombres *" value={form.nombre} onChange={(v) => update('nombre', v)} required placeholder="Como figura en su documento" />
                    <Input label="Apellido paterno *" value={form.apellidoPaterno} onChange={(v) => update('apellidoPaterno', v)} required placeholder="Apellido paterno" />
                    <Input label="Apellido materno *" value={form.apellidoMaterno} onChange={(v) => update('apellidoMaterno', v)} required placeholder="Apellido materno" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Celular *" type="tel" value={form.celular} onChange={(v) => update('celular', v)} required maxLength={9} placeholder="9 dígitos sin espacios" />
                    <Input label="Teléfono fijo (opcional)" type="tel" value={form.telefonoFijo} onChange={(v) => update('telefonoFijo', v)} placeholder="Incluya código de ciudad" />
                  </div>

                  <Input label="Correo electrónico *" type="email" value={form.email} onChange={(v) => update('email', v)} required placeholder="ejemplo@correo.com" />
                </fieldset>
              )}

              {/* ═══ PASO 2: Domicilio ═══ */}
              {currentPage === 2 && (
                <fieldset className="space-y-4">
                  <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-4">
                    2. Domicilio del consumidor
                  </legend>
                  <p className="text-white/40 text-xs mb-4">
                    Indique su domicilio actual para efectos de notificación. Esta dirección será utilizada para el envío de la respuesta formal.
                  </p>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Departamento *</label>
                    <select
                      required
                      value={form.departamento}
                      onChange={(e) => update('departamento', e.target.value)}
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                    >
                      <option value="">Seleccione un departamento</option>
                      {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Provincia *" value={form.provincia} onChange={(v) => update('provincia', v)} required placeholder="Ingrese la provincia" />
                    <Input label="Distrito *" value={form.distrito} onChange={(v) => update('distrito', v)} required placeholder="Ingrese el distrito" />
                  </div>

                  <Input label="Dirección completa *" value={form.direccion} onChange={(v) => update('direccion', v)} required placeholder="Calle, número, interior, urbanización, etc." />
                  <Input label="Referencia" value={form.referencia} onChange={(v) => update('referencia', v)} placeholder="Cerca de..., frente a..., al costado de..." />
                  <Input label="Código postal *" value={form.codigoPostal} onChange={(v) => update('codigoPostal', v)} required placeholder="Ej: 04001" maxLength={5} />
                </fieldset>
              )}

              {/* ═══ PASO 3: Bien contratado ═══ */}
              {currentPage === 3 && (
                <fieldset className="space-y-4">
                  <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-4">
                    3. Identificación del bien contratado
                  </legend>
                  <p className="text-white/40 text-xs mb-4">
                    Detalle la información del producto adquirido o servicio contratado que motiva la presente reclamación.
                  </p>

                  {/* Tipo de bien */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Tipo de bien *</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 cursor-pointer rounded-xl p-4 border transition-all text-center ${
                        form.tipoBien === 'producto'
                          ? 'border-mocha-500 bg-mocha-500/10 text-white'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      }`}>
                        <input type="radio" name="tipoBien" value="producto" checked={form.tipoBien === 'producto'} onChange={() => update('tipoBien', 'producto')} className="sr-only" />
                        <p className="font-semibold text-sm">Producto</p>
                      </label>
                      <label className={`flex-1 cursor-pointer rounded-xl p-4 border transition-all text-center ${
                        form.tipoBien === 'servicio'
                          ? 'border-mocha-500 bg-mocha-500/10 text-white'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      }`}>
                        <input type="radio" name="tipoBien" value="servicio" checked={form.tipoBien === 'servicio'} onChange={() => update('tipoBien', 'servicio')} className="sr-only" />
                        <p className="font-semibold text-sm">Servicio</p>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Descripción del {form.tipoBien} *</label>
                    <textarea
                      required
                      rows={3}
                      value={form.descripcionBien}
                      onChange={(e) => update('descripcionBien', e.target.value)}
                      placeholder={`Describa detalladamente el ${form.tipoBien}: marca, modelo, talla, color, características, etc.`}
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">Monto reclamado *</label>
                      <div className="flex gap-2">
                        <select
                          value={form.moneda}
                          onChange={(e) => update('moneda', e.target.value)}
                          className="px-3 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors w-24"
                        >
                          <option value="PEN">S/.</option>
                          <option value="USD">US$</option>
                        </select>
                        <input
                          type="number"
                          required
                          step="0.01"
                          min="0"
                          value={form.montoReclamado}
                          onChange={(e) => update('montoReclamado', e.target.value)}
                          placeholder="0.00"
                          className="flex-1 px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                        />
                      </div>
                    </div>
                    <Input label="Fecha de compra/contratación *" type="date" value={form.fechaCompra} onChange={(v) => update('fechaCompra', v)} required />
                  </div>

                  <Input label="Hora aproximada de compra" type="time" value={form.horaCompra} onChange={(v) => update('horaCompra', v)} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/70 text-sm mb-1.5">Tipo de comprobante *</label>
                      <select
                        required
                        value={form.tipoComprobante}
                        onChange={(e) => update('tipoComprobante', e.target.value)}
                        className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                      >
                        <option value="">Seleccione</option>
                        <option value="boleta">Boleta de venta</option>
                        <option value="factura">Factura</option>
                        <option value="ticket">Ticket</option>
                        <option value="nota_venta">Nota de venta</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>
                    <Input label="Número de comprobante *" value={form.nroComprobante} onChange={(v) => update('nroComprobante', v)} required placeholder="Ej: B001-00012345" />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Modalidad de contratación *</label>
                    <select
                      required
                      value={form.modalidadContratacion}
                      onChange={(e) => update('modalidadContratacion', e.target.value)}
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                    >
                      <option value="tienda_fisica">Tienda física</option>
                      <option value="comercio_electronico">Comercio electrónico</option>
                      <option value="telefono">Venta por teléfono</option>
                      <option value="catalogo">Venta por catálogo</option>
                    </select>
                  </div>
                </fieldset>
              )}

              {/* ═══ PASO 4: Detalle del reclamo ═══ */}
              {currentPage === 4 && (
                <fieldset className="space-y-4">
                  <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-4">
                    4. Detalle de la reclamación
                  </legend>
                  <p className="text-white/40 text-xs mb-4">
                    Conforme al artículo 24.1 del D.S. N.° 011-2011-PCM, describa con la mayor precisión posible los hechos que sustentan su reclamación. Todos los campos marcados con (*) son obligatorios y deben cumplir con la extensión mínima indicada para garantizar la correcta evaluación de su caso.
                  </p>

                  {/* Tipo */}
                  <div>
                    <label className="block text-white/70 text-sm mb-2">Tipo de reclamación (según clasificación del Art. 150 de la Ley N.° 29571) *</label>
                    <div className="flex gap-4">
                      <label className={`flex-1 cursor-pointer rounded-xl p-4 border transition-all text-center ${
                        form.tipo === 'reclamo'
                          ? 'border-mocha-500 bg-mocha-500/10 text-white'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      }`}>
                        <input type="radio" name="tipo" value="reclamo" checked={form.tipo === 'reclamo'} onChange={() => update('tipo', 'reclamo')} className="sr-only" />
                        <p className="font-semibold text-sm">Reclamo</p>
                        <p className="text-xs mt-1 opacity-70">Disconformidad relacionada a los productos o servicios adquiridos</p>
                      </label>
                      <label className={`flex-1 cursor-pointer rounded-xl p-4 border transition-all text-center ${
                        form.tipo === 'queja'
                          ? 'border-mocha-500 bg-mocha-500/10 text-white'
                          : 'border-white/10 text-white/50 hover:border-white/20'
                      }`}>
                        <input type="radio" name="tipo" value="queja" checked={form.tipo === 'queja'} onChange={() => update('tipo', 'queja')} className="sr-only" />
                        <p className="font-semibold text-sm">Queja</p>
                        <p className="text-xs mt-1 opacity-70">Malestar o descontento respecto a la atención al público, no relacionado directamente con el producto</p>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input label="Fecha del incidente *" type="date" value={form.fechaIncidente} onChange={(v) => update('fechaIncidente', v)} required />
                    <Input label="Hora aproximada del incidente" type="time" value={form.horaIncidente} onChange={(v) => update('horaIncidente', v)} />
                    <Input label="Lugar exacto del incidente *" value={form.lugarIncidente} onChange={(v) => update('lugarIncidente', v)} required placeholder="Stand, piso, pasadizo, etc." />
                  </div>

                  <Input label="Nombre completo del vendedor o persona que lo atendió *" value={form.nombreVendedor} onChange={(v) => update('nombreVendedor', v)} required placeholder="Nombre y apellido de quien lo atendió" />

                  <Input label="Testigos presentes durante el incidente (nombres completos)" value={form.testigosPresentes} onChange={(v) => update('testigosPresentes', v)} placeholder="Nombre completo de cada testigo, separados por coma" />

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Medio de pago utilizado *</label>
                    <select
                      required
                      value={form.medioPago}
                      onChange={(e) => update('medioPago', e.target.value)}
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                    >
                      <option value="">Seleccione el medio de pago</option>
                      <option value="efectivo">Efectivo</option>
                      <option value="tarjeta_debito">Tarjeta de débito</option>
                      <option value="tarjeta_credito">Tarjeta de crédito</option>
                      <option value="yape">Yape</option>
                      <option value="plin">Plin</option>
                      <option value="transferencia">Transferencia bancaria</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <Input label="Número de pedido o código de referencia (si aplica)" value={form.nroPedido} onChange={(v) => update('nroPedido', v)} placeholder="Código o número de pedido, orden de compra, etc." />

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">
                      Descripción cronológica y detallada del {form.tipo} * <span className="text-white/30">(mínimo 100 caracteres)</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      minLength={100}
                      value={form.detalle}
                      onChange={(e) => update('detalle', e.target.value)}
                      placeholder={`Narre de forma cronológica y detallada su ${form.tipo}:\n1. ¿Qué producto/servicio adquirió?\n2. ¿Qué sucedió exactamente?\n3. ¿Cuándo se percató del problema?\n4. ¿Quién lo atendió y qué le dijeron?\n5. ¿Se le ofreció alguna solución? ¿Cuál?`}
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                    <p className={`text-xs mt-1 text-right ${form.detalle.length >= 100 ? 'text-green-400/50' : 'text-red-400/50'}`}>{form.detalle.length} / 100 caracteres mínimo</p>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">
                      Circunstancias en las que se produjo el incidente * <span className="text-white/30">(mínimo 50 caracteres)</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      minLength={50}
                      value={form.circunstancias}
                      onChange={(e) => update('circunstancias', e.target.value)}
                      placeholder="Describa las circunstancias: ¿estaba solo o acompañado?, ¿era su primera visita?, ¿había alguna promoción vigente?, ¿el local estaba lleno?, etc."
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                    <p className={`text-xs mt-1 text-right ${form.circunstancias.length >= 50 ? 'text-green-400/50' : 'text-red-400/50'}`}>{form.circunstancias.length} / 50 caracteres mínimo</p>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">
                      Acciones previas realizadas por el consumidor * <span className="text-white/30">(obligatorio)</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.accionesRealizadas}
                      onChange={(e) => update('accionesRealizadas', e.target.value)}
                      placeholder="Indique qué acciones ha tomado antes de presentar este reclamo: ¿habló con el vendedor?, ¿llamó por teléfono?, ¿envió un correo?, ¿visitó la tienda nuevamente?"
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">
                      Fundamento del reclamo * <span className="text-white/30">(obligatorio)</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.fundamentoLegal}
                      onChange={(e) => update('fundamentoLegal', e.target.value)}
                      placeholder="Explique por qué considera que tiene derecho a reclamar. Puede hacer referencia a: garantía del producto, información proporcionada al momento de la compra, condiciones pactadas, publicidad, etc."
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">
                      Pedido / Solución esperada * <span className="text-white/30">(mínimo 50 caracteres)</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      minLength={50}
                      value={form.pedido}
                      onChange={(e) => update('pedido', e.target.value)}
                      placeholder="Indique de manera clara, precisa y detallada qué solución espera recibir por parte de la empresa. Especifique: tipo de compensación, plazo esperado, forma de entrega o devolución, etc."
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                    <p className={`text-xs mt-1 text-right ${form.pedido.length >= 50 ? 'text-green-400/50' : 'text-red-400/50'}`}>{form.pedido.length} / 50 caracteres mínimo</p>
                  </div>
                </fieldset>
              )}

              {/* ═══ PASO 5: Confirmación ═══ */}
              {currentPage === 5 && (
                <fieldset className="space-y-4">
                  <legend className="text-sm font-heading font-semibold text-mocha-500 uppercase tracking-wider mb-4">
                    5. Observaciones y confirmación
                  </legend>

                  <div>
                    <label className="block text-white/70 text-sm mb-1.5">Observaciones adicionales</label>
                    <textarea
                      rows={3}
                      value={form.observaciones}
                      onChange={(e) => update('observaciones', e.target.value)}
                      placeholder="Cualquier información adicional que considere relevante para la evaluación de su caso..."
                      className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30 resize-none"
                    />
                  </div>

                  {/* Resumen */}
                  <div className="glass rounded-xl p-4 text-sm space-y-2">
                    <p className="text-mocha-500 font-heading font-semibold text-xs uppercase tracking-wider mb-3">Resumen de su reclamación</p>
                    <p className="text-white/70"><strong className="text-white/90">Reclamante:</strong> {form.nombre} {form.apellidoPaterno} {form.apellidoMaterno}</p>
                    <p className="text-white/70"><strong className="text-white/90">Documento:</strong> {form.tipoDocumento} {form.dni}</p>
                    <p className="text-white/70"><strong className="text-white/90">Contacto:</strong> {form.celular} | {form.email}</p>
                    <p className="text-white/70"><strong className="text-white/90">Domicilio:</strong> {form.direccion}, {form.distrito}, {form.provincia}, {form.departamento}</p>
                    <p className="text-white/70"><strong className="text-white/90">Tipo:</strong> {form.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}</p>
                    <p className="text-white/70"><strong className="text-white/90">Monto:</strong> {form.moneda === 'PEN' ? 'S/.' : 'US$'} {form.montoReclamado}</p>
                    <p className="text-white/70"><strong className="text-white/90">Fecha del incidente:</strong> {form.fechaIncidente}</p>
                  </div>

                  {/* Checkboxes obligatorios */}
                  <div className="space-y-3 mt-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={aceptaTerminos}
                        onChange={(e) => setAceptaTerminos(e.target.checked)}
                        className="mt-1 accent-mocha-500"
                      />
                      <span className="text-white/60 text-xs leading-relaxed group-hover:text-white/80 transition-colors">
                        He leído y acepto los <Link href="/privacidad" className="text-mocha-500 underline" target="_blank">Términos y Condiciones</Link> del servicio, incluyendo las disposiciones sobre la resolución de controversias establecidas en el Código de Protección y Defensa del Consumidor. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={aceptaPrivacidad}
                        onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                        className="mt-1 accent-mocha-500"
                      />
                      <span className="text-white/60 text-xs leading-relaxed group-hover:text-white/80 transition-colors">
                        Autorizo el tratamiento de mis datos personales conforme a la <Link href="/privacidad" className="text-mocha-500 underline" target="_blank">Política de Privacidad</Link> y la Ley N.° 29733, Ley de Protección de Datos Personales, para los fines exclusivos de la atención de esta reclamación. *
                      </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={aceptaVeracidad}
                        onChange={(e) => setAceptaVeracidad(e.target.checked)}
                        className="mt-1 accent-mocha-500"
                      />
                      <span className="text-white/60 text-xs leading-relaxed group-hover:text-white/80 transition-colors">
                        Declaro bajo juramento que toda la información proporcionada en este formulario es verdadera, completa y exacta. Entiendo que proporcionar información falsa puede acarrear responsabilidad civil y/o penal conforme a la legislación vigente. *
                      </span>
                    </label>
                  </div>
                </fieldset>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl mt-4">{error}</p>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 gap-4">
                {currentPage > 1 ? (
                  <button
                    type="button"
                    onClick={prevPage}
                    className="px-6 py-3 border border-white/10 text-white/60 font-heading font-semibold rounded-xl hover:bg-white/5 transition-colors text-sm"
                  >
                    Anterior
                  </button>
                ) : <div />}

                {currentPage < totalPages ? (
                  <button
                    type="button"
                    onClick={nextPage}
                    className="px-8 py-3 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity text-sm"
                  >
                    Siguiente
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={step === 'loading'}
                    className="px-8 py-3.5 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 text-sm"
                  >
                    {step === 'loading' ? 'Enviando...' : `Enviar ${form.tipo}`}
                  </button>
                )}
              </div>

              <p className="text-white/40 text-xs text-center mt-6">
                La empresa se compromete a dar respuesta en un plazo no mayor a 30 días calendario,
                conforme al artículo 24.1 del Código de Protección y Defensa del Consumidor.
                La formulación del reclamo no impide acudir a otras vías de solución de controversias
                ni es requisito previo para interponer una denuncia ante el INDECOPI.
              </p>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

function Input({
  label, type = 'text', value, onChange, required, placeholder, maxLength,
}: {
  label: string; type?: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; maxLength?: number
}) {
  return (
    <div>
      <label className="block text-white/70 text-sm mb-1.5">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
      />
    </div>
  )
}
