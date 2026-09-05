'use client'

import { useReducedMotion as useFramerReducedMotion } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Sovereign Logistics Easing Curve
 * Fast entry with an ultra-smooth exponential deceleration curve.
 */
export const SOVEREIGN_EASE = [0.16, 1, 0.3, 1] as const

/**
 * Hook to detect and react to user's accessibility reduced-motion preference.
 */
export function useAccessibleMotion() {
  const framerReduced = useFramerReducedMotion()
  const [systemReduced, setSystemReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => {
      setSystemReduced(e.matches)
    }

    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  const shouldReduceMotion = Boolean(framerReduced || systemReduced)

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.6, ease: SOVEREIGN_EASE }

  return {
    shouldReduceMotion,
    prefersReducedMotion: shouldReduceMotion,
    transition,
    ease: SOVEREIGN_EASE,
  }
}

export default useAccessibleMotion
