'use client'

import { useEffect } from 'react'

export default function SmoothScroll() {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href*="#"]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return
      const destination = new URL(href, window.location.href)
      if (destination.origin !== window.location.origin || destination.pathname !== window.location.pathname) return

      // Extract the hash part
      const hash = href.includes('#') ? '#' + href.split('#')[1] : null
      if (!hash || hash === '#') return

      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (!el) return

      e.preventDefault()

      // Update URL without scroll
      window.history.pushState(null, '', hash)

      // Smooth scroll with offset for fixed header
      const headerHeight = 100
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight

      window.scrollTo({
        top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return null
}
