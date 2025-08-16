'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function BfCacheRefresh() {
  const router = useRouter()
  useEffect(() => {
    const handler = (e: PageTransitionEvent) => {
      // BFCache'ten dönüldüyse veriyi tazele
      // @ts-ignore
      if (e.persisted) router.refresh()
    }
    // @ts-ignore
    window.addEventListener('pageshow', handler)
    return () => {
      // @ts-ignore
      window.removeEventListener('pageshow', handler)
    }
  }, [router])
  return null
}

