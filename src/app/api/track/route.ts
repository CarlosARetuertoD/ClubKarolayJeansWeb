import { NextRequest, NextResponse } from 'next/server'
import { erpSend } from '@/lib/erp'
import { ANALYTICS_COOKIE } from '@/lib/analyticsConsent'
import { requireSameOrigin, sessionErrorResponse } from '@/lib/serverSession'

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    if (request.cookies.get(ANALYTICS_COOKIE)?.value !== 'accepted-v1') return new NextResponse(null, { status: 204 })
    const body = await request.json()
    if (!['click', 'pageview'].includes(body?.type) || typeof body?.data?.pagina !== 'string') return new NextResponse(null, { status: 400 })
    const pagina = body.data.pagina.split(/[?#]/)[0]
    if (/^\/(cuenta|registro|login|libro-reclamaciones|mis-codigos|canjear)(\/|$)/.test(pagina)) return new NextResponse(null, { status: 204 })
    const allowed = body.type === 'click' ? ['tipo', 'etiqueta'] : ['dispositivo', 'navegador', 'utm_source', 'utm_medium', 'utm_campaign']
    const data = Object.fromEntries(allowed.filter(k => typeof body.data[k] === 'string').map(k => [k, body.data[k].slice(0, 200)]))
    await erpSend('POST', 'track/', { type: body.type, data: { ...data, pagina, cliente_id: null } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const denied = sessionErrorResponse(error)
    if (denied) return denied
    return NextResponse.json({ error: 'Error tracking' }, { status: 500 })
  }
}
