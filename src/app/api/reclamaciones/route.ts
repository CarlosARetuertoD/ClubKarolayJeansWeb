import { NextRequest, NextResponse } from 'next/server'
import { erpSend, ErpError } from '@/lib/erp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = await erpSend('POST', 'reclamaciones/', body)
    return NextResponse.json(data, { status: 201 })
  } catch (err: unknown) {
    if (err instanceof ErpError) {
      return NextResponse.json({ error: err.message }, { status: err.status })
    }
    return NextResponse.json({ error: 'Error al enviar' }, { status: 500 })
  }
}
