'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { trackPageView } from '@/lib/tracking'
import { Suspense } from 'react'

function TrackingInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    trackPageView(pathname)
  }, [pathname, searchParams])

  return null
}

export default function TrackingProvider() {
  return (
    <Suspense fallback={null}>
      <TrackingInner />
    </Suspense>
  )
}
