import test from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { attachSession, createSessionToken, requireSameOrigin, SESSION_COOKIE, SESSION_SECONDS, verifySessionToken } from '../src/lib/serverSession'
import { NextResponse } from 'next/server'

process.env.CLUB_SESSION_SECRET = 'test-only-secret-at-least-32-characters-long'

test('signed sessions reject forgery and expire on the server', () => {
  const now = 1800000000000
  const token = createSessionToken('customer-a', now)
  assert.equal(verifySessionToken(token, now), 'customer-a')
  assert.equal(verifySessionToken(token, now + SESSION_SECONDS * 1000), null)
  const forged = Buffer.from(JSON.stringify({ sub: 'customer-b', exp: 9999999999 })).toString('base64url')
  assert.equal(verifySessionToken(`${forged}.${token.split('.')[1]}`, now), null)
  assert.equal(verifySessionToken('customer-b'), null)
})

test('session cookie is HttpOnly and bounded; cross-site writes are rejected', () => {
  const response = attachSession(NextResponse.json({ ok: true }), 'customer-a')
  assert.equal(response.cookies.get(SESSION_COOKIE)?.httpOnly, true)
  assert.equal(response.cookies.get(SESSION_COOKIE)?.maxAge, SESSION_SECONDS)
  assert.throws(() => requireSameOrigin(new NextRequest('https://club.example/api/cuenta', { method: 'PATCH', headers: { origin: 'https://other.example' } })))
  assert.doesNotThrow(() => requireSameOrigin(new NextRequest('https://club.example/api/cuenta', { method: 'PATCH', headers: { origin: 'https://club.example' } })))
})

test('API derives identity from cookie and rejects another customer’s promo', async () => {
  const { GET, PATCH } = await import('../src/app/api/cuenta/route')
  const { POST: canje } = await import('../src/app/api/canje/route')
  const originalFetch = global.fetch
  const calls: { url: string; body?: Record<string, unknown> }[] = []
  global.fetch = async (input, init) => {
    calls.push({ url: String(input), body: init?.body ? JSON.parse(String(init.body)) : undefined })
    return Response.json(String(input).includes('mis-codigos') ? { codigos: [{ id: 'promo-b', cliente_id: 'customer-b' }] } : { cliente: { id: 'customer-a' } })
  }
  const headers = { cookie: `${SESSION_COOKIE}=${createSessionToken('customer-a')}`, origin: 'https://club.example', 'content-type': 'application/json' }
  try {
    const anonymous = await GET(new NextRequest('https://club.example/api/cuenta?cliente_id=customer-b'))
    assert.equal(anonymous.status, 401)
    assert.equal(calls.length, 0)
    assert.equal((await GET(new NextRequest('https://club.example/api/cuenta?cliente_id=customer-b', { headers }))).status, 200)
    assert.match(calls[0].url, /cliente_id=customer-a/)
    await PATCH(new NextRequest('https://club.example/api/cuenta', { method: 'PATCH', headers, body: JSON.stringify({ cliente_id: 'customer-b', nombre: 'Test', is_admin: true }) }))
    assert.equal(calls[1].body?.cliente_id, 'customer-a')
    assert.equal(calls[1].body?.is_admin, undefined)
    const result = await canje(new NextRequest('https://club.example/api/canje', { method: 'POST', headers, body: JSON.stringify({ codigo_promo_id: 'promo-b', cliente_id: 'customer-b' }) }))
    assert.equal(result.status, 403)
    assert.equal(calls.length, 3) // Consulta permisos, nunca genera un QR ajeno.
  } finally { global.fetch = originalFetch }
})

test('bad credentials return 401 and progressive lockout returns 429, without cloning consumed body', async () => {
  const { POST } = await import('../src/app/api/login/route')
  const originalFetch = global.fetch
  global.fetch = async () => Response.json({ error: 'Credenciales incorrectas' }, { status: 401 })
  try {
    const statuses = []
    for (let i = 0; i < 3; i++) {
      const response = await POST(new NextRequest('https://club.example/api/login', {
        method: 'POST', headers: { origin: 'https://club.example', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.50' },
        body: JSON.stringify({ email: 'test@example.invalid', password: 'wrong' }),
      }))
      statuses.push(response.status)
    }
    assert.deepEqual(statuses, [401, 401, 429])
  } finally { global.fetch = originalFetch }
})
