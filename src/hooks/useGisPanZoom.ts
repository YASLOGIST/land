import { useState, useRef, useCallback, useEffect } from 'react'

export interface PanZoomState {
  x: number
  y: number
  scale: number
}

interface UseGisPanZoomOptions {
  minScale?: number
  maxScale?: number
  viewBoxWidth?: number
  viewBoxHeight?: number
}

export function useGisPanZoom({
  minScale = 1.0,
  maxScale = 6.0,
  viewBoxWidth = 1000,
  viewBoxHeight = 500,
}: UseGisPanZoomOptions = {}) {
  const [transform, setTransform] = useState<PanZoomState>({
    x: 0,
    y: 0,
    scale: 1.0,
  })

  const [isDragging, setIsDragging] = useState<boolean>(false)
  const isDraggingRef = useRef<boolean>(false)
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const animFrameRef = useRef<number | null>(null)

  // Clamp pan so the map does not drift too far outside the visible viewport
  const clampTransform = useCallback(
    (nextTransform: PanZoomState): PanZoomState => {
      const { scale, x, y } = nextTransform
      const clampedScale = Math.max(minScale, Math.min(maxScale, scale))

      // When scale is 1, keep center
      if (clampedScale <= 1.0) {
        return { scale: 1.0, x: 0, y: 0 }
      }

      const maxPanX = (viewBoxWidth * (clampedScale - 1)) / 2 + 150
      const minPanX = -((viewBoxWidth * (clampedScale - 1)) / 2 + 150)
      const maxPanY = (viewBoxHeight * (clampedScale - 1)) / 2 + 100
      const minPanY = -((viewBoxHeight * (clampedScale - 1)) / 2 + 100)

      return {
        scale: clampedScale,
        x: Math.max(minPanX, Math.min(maxPanX, x)),
        y: Math.max(minPanY, Math.min(maxPanY, y)),
      }
    },
    [minScale, maxScale, viewBoxWidth, viewBoxHeight],
  )

  // Mouse Drag Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
    // Only drag on primary mouse button
    if (e.button !== 0) return
    setIsDragging(true)
    isDraggingRef.current = true
    lastMousePosRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement | HTMLDivElement>) => {
      if (!isDraggingRef.current) return

      const dx = e.clientX - lastMousePosRef.current.x
      const dy = e.clientY - lastMousePosRef.current.y
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }

      setTransform((prev) => {
        // Sensitivity scaled by current zoom level
        const factor = 1.0
        return clampTransform({
          scale: prev.scale,
          x: prev.x + dx * factor,
          y: prev.y + dy * factor,
        })
      })
    },
    [clampTransform],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
  }, [])

  // Touch Handlers for Mobile / Trackpad
  const handleTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement | HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true)
      isDraggingRef.current = true
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement | HTMLDivElement>) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return

      const dx = e.touches[0].clientX - lastMousePosRef.current.x
      const dy = e.touches[0].clientY - lastMousePosRef.current.y
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }

      setTransform((prev) =>
        clampTransform({
          scale: prev.scale,
          x: prev.x + dx,
          y: prev.y + dy,
        }),
      )
    },
    [clampTransform],
  )

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
  }, [])

  // Wheel Zoom Listener
  const handleWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement | HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87

      setTransform((prev) => {
        const nextScale = prev.scale * zoomFactor
        return clampTransform({
          scale: nextScale,
          x: prev.x,
          y: prev.y,
        })
      })
    },
    [clampTransform],
  )

  // Zoom Button Controls
  const zoomIn = useCallback(() => {
    setTransform((prev) =>
      clampTransform({
        scale: prev.scale * 1.35,
        x: prev.x,
        y: prev.y,
      }),
    )
  }, [clampTransform])

  const zoomOut = useCallback(() => {
    setTransform((prev) =>
      clampTransform({
        scale: prev.scale / 1.35,
        x: prev.x,
        y: prev.y,
      }),
    )
  }, [clampTransform])

  const resetView = useCallback(() => {
    setTransform({
      scale: 1.0,
      x: 0,
      y: 0,
    })
  }, [])

  // Smooth Center on Coordinate (Spatial Navigation)
  const centerOnPoint = useCallback(
    (targetSvgX: number, targetSvgY: number, targetScale = 2.4) => {
      const centerX = viewBoxWidth / 2
      const centerY = viewBoxHeight / 2

      // Calculate target pan to position the target point right in the center of the viewport
      const targetPanX = (centerX - targetSvgX) * targetScale
      const targetPanY = (centerY - targetSvgY) * targetScale

      const startTransform = { ...transform }
      const finalTransform = clampTransform({
        scale: targetScale,
        x: targetPanX,
        y: targetPanY,
      })

      const startTime = performance.now()
      const duration = 650 // ms

      const animateStep = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(1, elapsed / duration)
        // Cubic ease out
        const ease = 1 - Math.pow(1 - progress, 3)

        setTransform({
          scale: startTransform.scale + (finalTransform.scale - startTransform.scale) * ease,
          x: startTransform.x + (finalTransform.x - startTransform.x) * ease,
          y: startTransform.y + (finalTransform.y - startTransform.y) * ease,
        })

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateStep)
        }
      }

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = requestAnimationFrame(animateStep)
    },
    [transform, viewBoxWidth, viewBoxHeight, clampTransform],
  )

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [])

  return {
    transform,
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    centerOnPoint,
    setTransform,
  }
}
