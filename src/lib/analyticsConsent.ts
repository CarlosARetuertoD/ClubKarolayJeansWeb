export const ANALYTICS_COOKIE = 'ckj_analytics'
export function analyticsAllowed() {
  return typeof document !== 'undefined' && document.cookie.split(';').some(c => c.trim() === `${ANALYTICS_COOKIE}=accepted-v1`)
}
export function analyticsDecided() {
  return typeof document !== 'undefined' && document.cookie.split(';').some(c => [`${ANALYTICS_COOKIE}=accepted-v1`, `${ANALYTICS_COOKIE}=rejected-v1`].includes(c.trim()))
}
export function setAnalyticsConsent(accept: boolean) {
  document.cookie = `${ANALYTICS_COOKIE}=${accept ? 'accepted-v1' : 'rejected-v1'}; Path=/; Max-Age=15552000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  window.dispatchEvent(new Event('analytics-consent-changed'))
}
