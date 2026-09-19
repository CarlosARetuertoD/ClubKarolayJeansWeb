import { createHmac, timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'

export const SESSION_COOKIE = 'ckj_auth'
export const SESSION_SECONDS = 60 * 60

function secret() {
  const key = process.env.CLUB_SESSION_SECRET || process.env.WEB_API_KEY
  if (!key || key.length < 32) throw new Error('Configura CLUB_SESSION_SECRET (32 caracteres mínimo).')
  // Separación de propósito: nunca se firma con la clave de integración directamente.
  return createHmac('sha256', key).update('club-karolay:web-session:v1').digest()
}

export function createSessionToken(id: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(now / 1000) + SESSION_SECONDS })).toString('base64url')
  return `${payload}.${createHmac('sha256', secret()).update(payload).digest('base64url')}`
}

export function verifySessionToken(token: string | undefined, now = Date.now()): string | null {
  if (!token || token.length > 2048) return null
  const parts = token.split('.')
  if (parts.length !== 2) return null
  const [payload, signature] = parts
  const expected = createHmac('sha256', secret()).update(payload).digest('base64url')
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  try {
    const value = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
    return typeof value.sub === 'string' && value.sub.length > 0 && Number.isInteger(value.exp) && value.exp > now / 1000
      ? value.sub : null
  } catch { return null }
}

export class SessionError extends Error {
  constructor(public status = 401, message = 'Tu sesión venció. Inicia sesión nuevamente.') { super(message) }
}

export function requireSession(request: NextRequest) {
  const id = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)
  if (!id) throw new SessionError()
  return id
}

export function requireSameOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')
  if (request.headers.get('sec-fetch-site') === 'cross-site' || !origin || origin !== request.nextUrl.origin) {
    throw new SessionError(403, 'Solicitud no permitida.')
  }
}

export function attachSession(response: NextResponse, id: string) {
  response.cookies.set(SESSION_COOKIE, createSessionToken(id), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_SECONDS,
  })
  response.headers.set('Cache-Control', 'private, no-store')
  return response
}

export function sessionErrorResponse(error: unknown) {
  if (error instanceof SessionError) return NextResponse.json({ error: error.message }, { status: error.status })
  return null
}
