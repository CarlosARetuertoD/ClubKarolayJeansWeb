import { NextRequest, NextResponse } from 'next/server'
import { erpGet, erpSend, ErpError } from '@/lib/erp'
import { requireSession, requireSameOrigin, sessionErrorResponse } from '@/lib/serverSession'

// POST: Generar token temporal de canje (cliente autenticado)
export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const clienteId = requireSession(request)
    const body = await request.json()
    if (typeof body?.codigo_promo_id !== 'string') return NextResponse.json({ error: 'Código requerido.' }, { status: 400 })
    const available = await erpGet<{ codigos: { id: string; cliente_id: string | null; fecha_inicio: string | null }[] }>(`mis-codigos/?cliente_id=${encodeURIComponent(clienteId)}`)
    const codigo = available.codigos.find(c => c.id === body.codigo_promo_id && (!c.cliente_id || c.cliente_id === clienteId))
    if (!codigo) return NextResponse.json({ error: 'Este código no está disponible para tu cuenta.' }, { status: 403 })
    const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima' }).format(new Date())
    if (codigo.fecha_inicio && codigo.fecha_inicio > today) return NextResponse.json({ error: 'La promoción todavía no comienza.' }, { status: 400 })
    const data = await erpSend<{ token: string; expires_at: string }>('POST', 'canje/', { codigo_promo_id: codigo.id, cliente_id: clienteId })
    return NextResponse.json(data)
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof ErpError) {
      return NextResponse.json(err.body ?? { error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'No se pudo generar el QR.' }, { status: 500 })
  }
}

// GET: Validar y canjear token (vendedor escanea)
export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')
    if (!token) {
      return NextResponse.json({ error: 'Token requerido.' }, { status: 400 })
    }
    const data = await erpGet(`canje/?token=${encodeURIComponent(token)}`)
    return NextResponse.json(data)
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      return NextResponse.json(err.body ?? { error: err.message }, { status: err.status })
    }
    const message = err instanceof Error ? err.message : 'Error al validar token'
    return NextResponse.json({ error: message, status: 'error' }, { status: 500 })
  }
}
