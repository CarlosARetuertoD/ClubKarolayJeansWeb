import { NextRequest, NextResponse } from 'next/server'
import { erpGet, erpSend, ErpError } from '@/lib/erp'
import { LEGAL_VERSION, type ComplaintReceipt } from '@/lib/legal'
import { requireSameOrigin, sessionErrorResponse } from '@/lib/serverSession'

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const body = await request.json()
    const capability = await erpGet<{ legal_version: string }>('reclamaciones/')
    if (capability.legal_version !== LEGAL_VERSION) return NextResponse.json({ error: 'El libro virtual se está actualizando. Puedes solicitar el libro físico en tienda.' }, { status: 503 })
    const data = await erpSend<ComplaintReceipt>('POST', 'reclamaciones/', body)
    if (!data.ok || !data.numero || !data.fecha || !data.contenido) throw new Error('Constancia incompleta')
    return NextResponse.json(data, { status: 201, headers: { 'Cache-Control': 'no-store' } })
  } catch (err: unknown) {
    const denied = sessionErrorResponse(err)
    if (denied) return denied
    if (err instanceof SyntaxError) return NextResponse.json({ error: 'Solicitud inválida.' }, { status: 400 })
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}
