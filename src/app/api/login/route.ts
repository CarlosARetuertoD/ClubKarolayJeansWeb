import { NextRequest, NextResponse } from 'next/server'
import { erpSend, ErpError } from '@/lib/erp'
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
  try {
    const body = await request.json()
    const email = String(body.email || '').trim().toLowerCase()
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'ip-desconocida'
    const keyUser = `club:user:${email}`
    const keyIp = `club:ip:${ip}`

    // Anti fuerza bruta (patrón estándar Redel — lockout progresivo)
    const estUser = estadoBloqueo(keyUser, MAX_INTENTOS_USUARIO)
    if (estUser.bloqueado) return bloqueadoResponse(estUser.restanteMs)
    const estIp = estadoBloqueo(keyIp, MAX_INTENTOS_IP)
    if (estIp.bloqueado) return bloqueadoResponse(estIp.restanteMs)

    const data = await erpSend<{ ok: boolean; cliente: unknown }>('POST', 'login/', body)
    registrarExito(keyUser, keyIp)
    return NextResponse.json({ ok: true, cliente: data.cliente })
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      // Solo credenciales inválidas (4xx) cuentan como intento fallido
      if (err.status >= 400 && err.status < 500) {
        const body2 = await request.clone().json().catch(() => ({}))
        const email = String(body2.email || '').trim().toLowerCase()
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'ip-desconocida'
        const rUser = registrarFallo(`club:user:${email}`, MAX_INTENTOS_USUARIO)
        registrarFallo(`club:ip:${ip}`, MAX_INTENTOS_IP)
        if (rUser.bloqueado) return bloqueadoResponse(rUser.restanteMs)
      }
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}
