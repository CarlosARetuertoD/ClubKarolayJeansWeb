import { NextRequest, NextResponse } from 'next/server'
import { erpGet, erpSend, ErpError } from '@/lib/erp'

export async function GET(request: NextRequest) {
  try {
    const clienteId = request.nextUrl.searchParams.get('cliente_id')
    if (!clienteId) return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })
    const data = await erpGet<{ cliente: unknown }>(`cliente/?cliente_id=${encodeURIComponent(clienteId)}`)
    return NextResponse.json(data)
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await erpSend('PATCH', 'cliente/', body)
    return NextResponse.json(data)
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }
}
