import { NextRequest, NextResponse } from 'next/server'
import { erpGet, erpSend, ErpError } from '@/lib/erp'

// POST: Generar token temporal de canje (cliente autenticado)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await erpSend<{ token: string; expires_at: string }>('POST', 'canje/', body)
    return NextResponse.json(data)
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      return NextResponse.json(err.body ?? { error: err.message }, { status: err.status })
    }
    const message = err instanceof Error ? err.message : 'Error al generar token'
    return NextResponse.json({ error: message }, { status: 500 })
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
