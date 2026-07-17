// Endpoint /api/health — estándar Redel Monitor.
// Sin token responde {status}; con X-Monitor-Token (env MONITOR_TOKEN)
// devuelve el detalle (versión desplegada, timestamp).
import { timingSafeEqual } from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function autorizado(req: NextRequest): boolean {
  const token = req.headers.get('x-monitor-token') ?? '';
  const esperado = process.env.MONITOR_TOKEN ?? '';
  if (!esperado || !token || token.length !== esperado.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(esperado));
}

export async function GET(req: NextRequest) {
  const status = 'ok';
  if (!autorizado(req)) return NextResponse.json({ status });
  return NextResponse.json({
    app: 'club-karolay-jeans',
    status,
    timestamp: new Date().toISOString(),
    version: (process.env.VERCEL_GIT_COMMIT_SHA ?? 'dev').slice(0, 7),
    uptime_s: null, // serverless: sin uptime de proceso
    checks: {},
  });
}
