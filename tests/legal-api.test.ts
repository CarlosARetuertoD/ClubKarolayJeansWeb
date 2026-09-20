import test from 'node:test'
import assert from 'node:assert/strict'
import { NextRequest } from 'next/server'
import { POST as track } from '../src/app/api/track/route'
import { POST as complaint } from '../src/app/api/reclamaciones/route'
import { POST as register } from '../src/app/api/registro/route'

process.env.CLUB_SESSION_SECRET = 'legal-tests-only-secret-long-enough-123'
const origin = 'https://club.example'
function request(path: string, body: unknown, cookie = '') {
  return new NextRequest(origin + path, { method: 'POST', headers: { origin, cookie, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
}

test('no analytics upstream without opt-in; sensitive pages and identity excluded', async () => {
  const original = global.fetch
  const sent: Record<string, unknown>[] = []
  global.fetch = async (_url, init) => { sent.push(JSON.parse(String(init?.body))); return Response.json({ ok: true }) }
  try {
    const body = { type: 'click', data: { pagina: '/', cliente_id: 'private-id', metadata: { dni: 'private' }, etiqueta: 'catalogo' } }
    assert.equal((await track(request('/api/track', body))).status, 204)
    assert.equal(sent.length, 0)
    assert.equal((await track(request('/api/track', body, 'ckj_analytics=rejected-v1'))).status, 204)
    assert.equal((await track(request('/api/track', { ...body, data: { pagina: '/canjear/private-token' } }, 'ckj_analytics=accepted-v1'))).status, 204)
    assert.equal(sent.length, 0)
    assert.equal((await track(request('/api/track', body, 'ckj_analytics=accepted-v1'))).status, 200)
    assert.deepEqual(sent[0], { type: 'click', data: { etiqueta: 'catalogo', pagina: '/', cliente_id: null } })
  } finally { global.fetch = original }
})

test('complaints require upgraded ERP, forward complete request and return real receipt', async () => {
  const original = global.fetch
  const sent: unknown[] = []
  const body = { solicitud_id: 'test-id', descripcion_bien: 'Jean', monto: '90.00', representante: 'Test', detalle: 'Defecto', pedido: 'Cambio' }
  const receipt = { ok: true, id: 'id', numero: 'WEB-B77-00000001', fecha: '2026-09-19T12:00:00Z', contenido: body }
  try {
    global.fetch = async () => Response.json({})
    assert.equal((await complaint(request('/api/reclamaciones', body))).status, 503)
    global.fetch = async (_url, init) => {
      if (!init?.method) return Response.json({ legal_version: '2026-09-19' })
      sent.push(JSON.parse(String(init.body)))
      return Response.json(receipt)
    }
    const response = await complaint(request('/api/reclamaciones', body))
    assert.equal(response.status, 201)
    assert.deepEqual(sent, [body])
    assert.deepEqual(await response.json(), receipt)
    assert.equal(response.headers.get('cache-control'), 'no-store')
  } finally { global.fetch = original }
})

test('registration rejects missing acceptance without creating account', async () => {
  const original = global.fetch
  let calls = 0
  global.fetch = async () => { calls++; return Response.json({}) }
  try {
    assert.equal((await register(request('/api/registro', { nombre: 'Test' }))).status, 400)
    assert.equal(calls, 0)
    const body = { legal: { version: '2026-09-19', terminos: true, email: false, whatsapp: false } }
    assert.equal((await register(request('/api/registro', body))).status, 503)
    assert.equal(calls, 1)
  } finally { global.fetch = original }
})
