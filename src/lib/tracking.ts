import { analyticsAllowed } from './analyticsConsent'

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 768) return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

function getBrowser(): string | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome'
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Firefox')) return 'Firefox'
  if (ua.includes('Edg')) return 'Edge'
  return 'Otro'
}

function getUTMParams(): Record<string, string | null> {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }
}

async function send(type: 'pageview' | 'click', data: Record<string, unknown>) {
  if (!analyticsAllowed()) return
  if (typeof location !== 'undefined' && /^\/(cuenta|registro|login|libro-reclamaciones|mis-codigos|canjear)(\/|$)/.test(location.pathname)) return
  try {
    await fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
      keepalive: true,
    })
  } catch (e) {
    console.error('Error tracking:', e)
  }
}

export async function trackPageView(pagina: string) {
  const utm = getUTMParams()
  await send('pageview', {
    pagina,
    referrer: null,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    dispositivo: getDevice(),
    navegador: getBrowser(),
  })
}

export async function trackClick(
  tipo: string,
  etiqueta: string,
  pagina: string,
  metadata?: Record<string, unknown>
) {
  await send('click', {
    tipo,
    etiqueta,
    pagina,
    cliente_id: null,
  })
}
