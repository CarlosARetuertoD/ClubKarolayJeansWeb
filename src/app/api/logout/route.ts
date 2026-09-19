import { NextRequest, NextResponse } from 'next/server'
import { requireSameOrigin, SESSION_COOKIE, sessionErrorResponse } from '@/lib/serverSession'

export async function POST(request: NextRequest) {
  try {
    requireSameOrigin(request)
    const response = NextResponse.json({ ok: true })
    response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 0 })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    return sessionErrorResponse(error) || NextResponse.json({ error: 'No se pudo cerrar sesión.' }, { status: 500 })
  }
}
