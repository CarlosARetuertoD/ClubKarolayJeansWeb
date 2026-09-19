import { NextRequest, NextResponse } from 'next/server'
import { erpSend, ErpError } from '@/lib/erp'
import { attachSession, requireSameOrigin, sessionErrorResponse, createSessionToken } from '@/lib/serverSession'

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    createSessionToken('configuration-check') // Validar la firma antes de crear la cuenta.
    const body = await request.json()
    const data = await erpSend<{ ok: boolean; cliente: { id: string } }>('POST', 'registro/', body)
    if (!data.ok || !data.cliente?.id) throw new Error('Registro inválido')
    return attachSession(NextResponse.json({ ok: true, cliente: data.cliente }), data.cliente.id)
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof SyntaxError) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'No se pudo completar el registro.' }, { status: 500 })
  }
}
