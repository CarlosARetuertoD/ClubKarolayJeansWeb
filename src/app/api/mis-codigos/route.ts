import { NextRequest, NextResponse } from 'next/server'
import { erpGet, ErpError } from '@/lib/erp'
import { requireSession, sessionErrorResponse } from '@/lib/serverSession'

export async function GET(request: NextRequest) {
  try {
    const clienteId = requireSession(request)
    const data = await erpGet<{ codigos: unknown[] }>(`mis-codigos/?cliente_id=${encodeURIComponent(clienteId)}`)
    return NextResponse.json(data, { headers: { 'Cache-Control': 'private, no-store' } })
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'No se pudieron cargar tus códigos.' }, { status: 500 })
  }
}
