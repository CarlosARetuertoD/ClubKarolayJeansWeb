import { supabase } from './supabase'

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

export async function trackPageView(pagina: string) {
  try {
    const utm = getUTMParams()
    await supabase.from('web_visitas').insert({
      pagina,
      referrer: typeof document !== 'undefined' ? document.referrer || null : null,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
      dispositivo: getDevice(),
      navegador: getBrowser(),
    })
  } catch (e) {
    console.error('Error tracking page view:', e)
  }
}

export async function trackClick(
  tipo: string,
  etiqueta: string,
  pagina: string,
  metadata?: Record<string, unknown>
) {
  try {
    const clienteId = typeof localStorage !== 'undefined'
      ? localStorage.getItem('ckj_cliente_id')
      : null

    await supabase.from('web_clicks').insert({
      tipo,
      etiqueta,
      pagina,
      cliente_id: clienteId,
      metadata: metadata || null,
    })
  } catch (e) {
    console.error('Error tracking click:', e)
  }
}
