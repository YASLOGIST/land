'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useSpring, useInView } from 'framer-motion'

interface DynamicCounterProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  duration?: number
}

/**
 * DynamicCounter — Physics-based smooth scrolling numerical counter (Framer Motion springs)
 * Renders high-performance GPU-composited number rolling with zero unnecessary React tree repaints.
 */
export default function DynamicCounter({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: DynamicCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionVal = useMotionValue(0)
  const isInView = useInView(ref, { once: true, margin: '-40px' })

  const springVal = useSpring(motionVal, {
    stiffness: 85,
    damping: 18,
    mass: 0.8,
  })

  useEffect(() => {
    if (isInView) {
      motionVal.set(value)
    }
  }, [isInView, value, motionVal])

  useEffect(() => {
    const unsubscribe = springVal.on('change', (latest) => {
      if (ref.current) {
        const formatted = decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString()
        ref.current.textContent = `${prefix}${formatted}${suffix}`
      }
    })
    return () => unsubscribe()
  }, [springVal, decimals, prefix, suffix])

  return (
    <span
      ref={ref}
      dir="ltr"
      className={`inline-block font-mono-numbers tracking-tight tabular-nums ${className}`}
    >
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString()}
      {suffix}
    </span>
  )
}
