'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { BUSINESS } from '@/lib/constants'

type ClienteData = {
  nombre: string
  celular: string
  dni: string | null
  fecha_nacimiento: string | null
  genero: string | null
  email: string
  auth_provider: string
  created_at: string
}

export default function CuentaContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [cliente, setCliente] = useState<ClienteData | null>(null)
  const [form, setForm] = useState({ nombre: '', celular: '', dni: '', fecha_nacimiento: '', genero: '' as '' | 'dama' | 'varon' })
  const [passwordForm, setPasswordForm] = useState({ current: '', nueva: '', confirmar: '' })
  const [changingPassword, setChangingPassword] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    let found = false

    async function loadProfile(userId: string, email?: string) {
      if (found) return
      found = true

      const { data } = await supabase
        .from('web_clientes')
        .select('nombre, celular, dni, fecha_nacimiento, genero, email, auth_provider, created_at')
        .eq('auth_uid', userId)
        .maybeSingle()

      if (data) {
        setCliente(data)
        setForm({
          nombre: data.nombre || '',
          celular: data.celular || '',
          dni: data.dni || '',
          fecha_nacimiento: data.fecha_nacimiento || '',
          genero: (data.genero as '' | 'dama' | 'varon') || '',
        })
      } else if (email) {
        // Fallback si RLS bloquea
        setCliente({ nombre: '', celular: '', dni: null, fecha_nacimiento: null, genero: null, email, auth_provider: 'email', created_at: '' })
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email)
      } else {
        router.replace('/login?redirect=/cuenta')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        loadProfile(session.user.id, session.user.email)
      } else if (event === 'SIGNED_OUT') {
        router.replace('/login?redirect=/cuenta')
      }
    })

    const timeout = setTimeout(() => {
      if (!found) router.replace('/login?redirect=/cuenta')
    }, 3000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const { error: dbError } = await supabase
      .from('web_clientes')
      .update({
        nombre: form.nombre,
        celular: form.celular,
        dni: form.dni || null,
        fecha_nacimiento: form.fecha_nacimiento || null,
        genero: form.genero || null,
      })
      .eq('auth_uid', session.user.id)

    if (dbError) {
      setError('Error al guardar los cambios.')
    } else {
      setSaved(true)
      if (cliente) setCliente({ ...cliente, nombre: form.nombre, celular: form.celular })
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  const handleChangePassword = async () => {
    setError('')
    setSuccessMsg('')

    if (passwordForm.nueva.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (passwordForm.nueva !== passwordForm.confirmar) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setChangingPassword(true)

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user?.email) {
      setError('No se pudo verificar tu sesión.')
      setChangingPassword(false)
      return
    }

    // Verify current password without replacing session
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: session.user.email,
      password: passwordForm.current,
    })

    if (verifyError) {
      setError('La contraseña actual es incorrecta.')
      setChangingPassword(false)
      return
    }

    // Update password (session is already refreshed by signIn above)
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.nueva,
    })

    if (updateError) {
      setError('Error al cambiar la contraseña. Intenta de nuevo.')
    } else {
      // Re-authenticate with new password to ensure session is clean
      await supabase.auth.signInWithPassword({
        email: session.user.email,
        password: passwordForm.nueva,
      })
      setSuccessMsg('Contraseña actualizada correctamente.')
      setPasswordForm({ current: '', nueva: '', confirmar: '' })
      setShowPasswordForm(false)
      setTimeout(() => setSuccessMsg(''), 4000)
    }
    setChangingPassword(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('ckj_cliente_id')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="bg-dark-radial min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-mocha-500/30 border-t-mocha-500 rounded-full animate-spin" />
      </main>
    )
  }

  return (
    <main className="bg-dark-radial min-h-screen">
      {/* Nav */}
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

      <div className="max-w-2xl mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-mocha-500/20 border border-mocha-500/30 flex items-center justify-center">
            <span className="text-mocha-500 font-heading font-bold text-xl">
              {cliente?.nombre?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">{cliente?.nombre || 'Mi cuenta'}</h1>
            <p className="text-white/50 text-sm">{cliente?.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-white/30 text-xs capitalize">
                {cliente?.auth_provider === 'google' ? 'Google' : 'Correo y contraseña'}
              </span>
              {cliente?.created_at && (
                <>
                  <span className="text-white/15">·</span>
                  <span className="text-white/30 text-xs">
                    Miembro desde {new Date(cliente.created_at).toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <Link
            href="/bio"
            className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/[0.08] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2v-9a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Mi tarjeta</p>
              <p className="text-white/40 text-xs">Tarjeta digital</p>
            </div>
          </Link>
          <Link
            href="/mis-codigos"
            className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/[0.08] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Mis códigos</p>
              <p className="text-white/40 text-xs">Descuentos</p>
            </div>
          </Link>
          <Link
            href="/promociones"
            className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/[0.08] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded-full bg-mocha-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-mocha-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
              </svg>
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Promos</p>
              <p className="text-white/40 text-xs">Ofertas</p>
            </div>
          </Link>
        </div>

        {/* Editar datos */}
        <div className="bg-card-radial rounded-2xl p-6 sm:p-8 border border-white/6 mb-4">
          <h2 className="text-lg font-heading font-bold text-white mb-5">Datos personales</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Nombre completo</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">Celular</label>
              <input
                type="tel"
                value={form.celular}
                onChange={(e) => setForm({ ...form, celular: e.target.value })}
                className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-1.5">DNI</label>
              <input
                type="text"
                maxLength={8}
                value={form.dni}
                onChange={(e) => setForm({ ...form, dni: e.target.value.replace(/\D/g, '') })}
                placeholder="12345678"
                className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Fecha de nacimiento</label>
                <input
                  type="date"
                  value={form.fecha_nacimiento}
                  onChange={(e) => setForm({ ...form, fecha_nacimiento: e.target.value })}
                  className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1.5">Género</label>
                <select
                  value={form.genero}
                  onChange={(e) => setForm({ ...form, genero: e.target.value as '' | 'dama' | 'varon' })}
                  className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors"
                >
                  <option value="">Seleccionar</option>
                  <option value="dama">Dama</option>
                  <option value="varon">Varón</option>
                </select>
              </div>
            </div>
          </div>

          {error && !showPasswordForm && (
            <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl mt-4">{error}</p>
          )}
          {saved && (
            <p className="text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-xl mt-4">Cambios guardados correctamente.</p>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full py-3 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        {/* Cambiar contraseña — solo para usuarios email */}
        {cliente?.auth_provider !== 'google' && (
          <div className="bg-card-radial rounded-2xl p-6 sm:p-8 border border-white/6 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-heading font-bold text-white">Contraseña</h2>
              {!showPasswordForm && (
                <button
                  onClick={() => { setShowPasswordForm(true); setError(''); setSuccessMsg('') }}
                  className="text-mocha-500 text-sm font-medium hover:text-mocha-400 transition-colors"
                >
                  Cambiar
                </button>
              )}
            </div>

            {successMsg && (
              <p className="text-green-400 text-sm bg-green-400/10 px-4 py-2 rounded-xl mt-4">{successMsg}</p>
            )}

            {showPasswordForm && (
              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Contraseña actual</label>
                  <input
                    type="password"
                    value={passwordForm.current}
                    onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                    placeholder="Tu contraseña actual"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Nueva contraseña</label>
                  <input
                    type="password"
                    value={passwordForm.nueva}
                    onChange={(e) => setPasswordForm({ ...passwordForm, nueva: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1.5">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={passwordForm.confirmar}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmar: e.target.value })}
                    className="w-full px-4 py-3 bg-dark-surface rounded-xl text-white border border-white/10 focus:border-mocha-500 focus:outline-none transition-colors placeholder:text-white/30"
                    placeholder="Repite la nueva contraseña"
                  />
                </div>

                {error && showPasswordForm && (
                  <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl">{error}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="flex-1 py-3 bg-gradient-to-r from-mocha-500 to-mocha-700 text-white font-heading font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {changingPassword ? 'Cambiando...' : 'Actualizar contraseña'}
                  </button>
                  <button
                    onClick={() => { setShowPasswordForm(false); setError(''); setPasswordForm({ current: '', nueva: '', confirmar: '' }) }}
                    className="px-5 py-3 border border-white/10 text-white/50 rounded-xl hover:text-white/70 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cerrar sesión */}
        <button
          onClick={handleLogout}
          className="w-full py-3 border border-red-500/20 text-red-400/70 rounded-xl font-heading font-medium text-sm hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}
