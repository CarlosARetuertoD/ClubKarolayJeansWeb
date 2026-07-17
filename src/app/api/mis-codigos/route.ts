import { NextRequest, NextResponse } from 'next/server'
import { erpGet, ErpError } from '@/lib/erp'

export async function GET(request: NextRequest) {
  try {
    const clienteId = request.nextUrl.searchParams.get('cliente_id')
    if (!clienteId) {
      return NextResponse.json({ error: 'cliente_id requerido' }, { status: 400 })
    }
    const data = await erpGet<{ codigos: unknown[] }>(`mis-codigos/?cliente_id=${encodeURIComponent(clienteId)}`)
    return NextResponse.json(data)
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    const message = err instanceof Error ? err.message : 'Error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
