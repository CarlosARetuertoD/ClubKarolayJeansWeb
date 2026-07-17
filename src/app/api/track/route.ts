import { NextRequest, NextResponse } from 'next/server'
import { erpSend } from '@/lib/erp'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    await erpSend('POST', 'track/', body)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error tracking' }, { status: 500 })
  }
}
