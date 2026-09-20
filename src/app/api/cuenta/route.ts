import { NextRequest, NextResponse } from 'next/server'
import { erpGet, erpSend, ErpError } from '@/lib/erp'
import { requireSession, requireSameOrigin, sessionErrorResponse } from '@/lib/serverSession'

export async function GET(request: NextRequest) {
  try {
    const clienteId = requireSession(request)
    const data = await erpGet<{ cliente: unknown }>(`cliente/?cliente_id=${encodeURIComponent(clienteId)}`)
    return NextResponse.json(data, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const clienteId = requireSession(request)
    const body = await request.json()
    if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
    const allowed = ['nombre', 'celular', 'dni', 'fecha_nacimiento', 'genero', 'password_actual', 'password_nueva', 'marketing']
    const fields = Object.fromEntries(allowed.filter(key => body && key in body).map(key => [key, body[key]]))
    const data = await erpSend('PATCH', 'cliente/', { ...fields, cliente_id: clienteId })
    return NextResponse.json(data)
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}
