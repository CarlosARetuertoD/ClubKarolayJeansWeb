import { NextRequest, NextResponse } from 'next/server'
import { erpSend, ErpError } from '@/lib/erp'
import { attachSession, requireSameOrigin, sessionErrorResponse } from '@/lib/serverSession'
import {
  estadoBloqueo, registrarFallo, registrarExito, formatearRestante,
  MAX_INTENTOS_USUARIO, MAX_INTENTOS_IP,
} from '@/lib/loginRateLimit'

function bloqueadoResponse(restanteMs: number) {
  return NextResponse.json(
    { error: `Demasiados intentos. Vuelve a intentar en ${formatearRestante(restanteMs)}.`, restante_ms: restanteMs },
    { status: 429, headers: { 'Retry-After': String(Math.ceil(restanteMs / 1000)) } }
  )
}

export async function POST(request: NextRequest) {
  let email = ''
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'ip-desconocida'
  try {
    requireSameOrigin(request)
    const body = await request.json()
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    if (!email || typeof body?.password !== 'string' || !body.password) {
      return NextResponse.json({ error: 'Ingresa tu correo y contraseña.' }, { status: 400 })
    }
    const keyUser = `club:user:${email}`
    const keyIp = `club:ip:${ip}`

    // Anti fuerza bruta (patrón estándar Redel — lockout progresivo)
    const estUser = estadoBloqueo(keyUser, MAX_INTENTOS_USUARIO)
    if (estUser.bloqueado) return bloqueadoResponse(estUser.restanteMs)
    const estIp = estadoBloqueo(keyIp, MAX_INTENTOS_IP)
    if (estIp.bloqueado) return bloqueadoResponse(estIp.restanteMs)

    const data = await erpSend<{ ok: boolean; cliente: { id: string } }>('POST', 'login/', { email, password: body.password })
    if (!data.ok || !data.cliente?.id) throw new Error('Respuesta de login inválida')
    registrarExito(keyUser, keyIp)
    return attachSession(NextResponse.json({ ok: true, cliente: data.cliente }), data.cliente.id)
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof SyntaxError) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
    if (err instanceof ErpError) {
      // Solo credenciales inválidas (4xx) cuentan como intento fallido
      if (err.status === 401) {
        const rUser = registrarFallo(`club:user:${email}`, MAX_INTENTOS_USUARIO)
        registrarFallo(`club:ip:${ip}`, MAX_INTENTOS_IP)
        if (rUser.bloqueado) return bloqueadoResponse(rUser.restanteMs)
      }
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
