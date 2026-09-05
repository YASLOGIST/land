'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RotateCcw,
  Layers,
  Flame,
  Radio,
  Navigation,
  Globe,
  Satellite,
  Play,
  Pause,
  FastForward,
  Building2,
  Truck,
  ShieldCheck,
  Zap,
  X,
  Scale,
  Coffee,
  Landmark,
} from 'lucide-react'
import { INLAND_LOGISTICS_HUBS, LAND_TRADE_CORRIDORS } from '@/data/landCorridors'
import { useAccessibleMotion } from '@/hooks/use-reduced-motion'
import type { TransportModeId } from '@/types/dispatch'
import type { RealTradeCorridor, WaypointDetail, GlobalHubPin } from '@/types/dispatch-extended'

export type MapLayerMode = 'satellite' | 'vector-dark' | 'vector-arterial'

export interface HighQualityRealMapProps {
  activeCorridor: RealTradeCorridor
  selectedModeId: TransportModeId
  trafficLightState: 'green' | 'yellow' | 'red'
  showHeatmap: boolean
  setShowHeatmap: (val: boolean) => void
  isFullscreen: boolean
  setIsFullscreen: (val: boolean) => void
  language: 'en' | 'ar'
  isRTL: boolean
  selectedWaypointNode: WaypointDetail | null
  setSelectedWaypointNode: (wp: WaypointDetail | null) => void
  transform?: { x: number; y: number; scale: number }
  isDragging?: boolean
  handleMouseDown?: (e: React.MouseEvent<HTMLDivElement | SVGSVGElement>) => void
  handleMouseMove?: (e: React.MouseEvent<HTMLDivElement | SVGSVGElement>) => void
  handleMouseUp?: () => void
  handleTouchStart?: (e: React.TouchEvent<HTMLDivElement | SVGSVGElement>) => void
  handleTouchMove?: (e: React.TouchEvent<HTMLDivElement | SVGSVGElement>) => void
  handleTouchEnd?: () => void
  handleWheel?: (e: React.WheelEvent<HTMLDivElement | SVGSVGElement>) => void
  zoomIn?: () => void
  zoomOut?: () => void
  resetView?: () => void
  centerOnPoint?: (x: number, y: number, targetScale?: number) => void
  meshNodePingMs?: number
  /** Declared line-haul speed used by the simulated fleet layer (KM/H). */
  simSpeedKmh?: number
}

/* ── Egypt & Arabian Gulf Strategic Geographic Bounding Box ────────── */
const EGYPT_GULF_BOUNDS: [[number, number], [number, number]] = [
  [23.5, 14.0], // Southwest: Southern Egypt / Red Sea
  [56.5, 33.5], // Northeast: Arabian Gulf / Kuwait / Iraq border
]
const EGYPT_GULF_CENTER: [number, number] = [38.5, 25.0]

/* ── Tile Sources Configuration for MapLibre ───────────────────────── */
function getMapLibreStyle(mode: MapLayerMode): maplibregl.StyleSpecification {
  const tileUrls: Record<MapLayerMode, string[]> = {
    'vector-dark': [
      'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
      'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
    ],
    satellite: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    'vector-arterial': [
      'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      'https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
      'https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png',
    ],
  }

  return {
    version: 8,
    sources: {
      'base-raster-tiles': {
        type: 'raster',
        tiles: tileUrls[mode],
        tileSize: 256,
        attribution: '© CartoDB, © OpenStreetMap, © Esri',
      },
    },
    layers: [
      {
        id: 'base-raster-layer',
        type: 'raster',
        source: 'base-raster-tiles',
        minzoom: 0,
        maxzoom: 20,
      },
    ],
  }
}

/* ── Distance & Position Interpolator for Simulated Fleet ───────────── */
function getGeoDistance(c1: [number, number], c2: [number, number]) {
  const dx = (c2[0] - c1[0]) * Math.cos(((c1[1] + c2[1]) / 2) * (Math.PI / 180))
  const dy = c2[1] - c1[1]
  return Math.sqrt(dx * dx + dy * dy)
}

function interpolatePositionAndBearing(
  coords: [number, number][],
  progress: number
): { pos: [number, number]; bearing: number } {
  if (!coords || coords.length === 0) return { pos: EGYPT_GULF_CENTER, bearing: 0 }
  if (coords.length === 1) return { pos: coords[0], bearing: 0 }

  const segmentLengths: number[] = []
  let totalLength = 0
  for (let i = 0; i < coords.length - 1; i++) {
    const d = getGeoDistance(coords[i], coords[i + 1])
    segmentLengths.push(d)
    totalLength += d
  }

  if (totalLength === 0) return { pos: coords[0], bearing: 0 }

  const targetDist = ((progress % 1) + 1) % 1 * totalLength
  let accumulated = 0

  for (let i = 0; i < segmentLengths.length; i++) {
    const segLen = segmentLengths[i]
    if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
      const segT = segLen > 0 ? (targetDist - accumulated) / segLen : 0
      const clampedT = Math.max(0, Math.min(1, segT))
      const p1 = coords[i]
      const p2 = coords[i + 1]
      const lng = p1[0] + (p2[0] - p1[0]) * clampedT
      const lat = p1[1] + (p2[1] - p1[1]) * clampedT

      const dLng = p2[0] - p1[0]
      const dLat = p2[1] - p1[1]
      const rad = Math.atan2(dLng, dLat)
      const bearing = (rad * 180) / Math.PI

      return { pos: [lng, lat], bearing }
    }
    accumulated += segLen
  }

  return { pos: coords[coords.length - 1], bearing: 0 }
}

function fitToCorridor(
  map: maplibregl.Map,
  coords: [number, number][],
  reducedMotion: boolean
) {
  if (!coords || coords.length === 0) return

  let minLng = coords[0][0]
  let maxLng = coords[0][0]
  let minLat = coords[0][1]
  let maxLat = coords[0][1]

  coords.forEach(([lng, lat]) => {
    if (lng < minLng) minLng = lng
    if (lng > maxLng) maxLng = lng
    if (lat < minLat) minLat = lat
    if (lat > maxLat) maxLat = lat
  })

  map.fitBounds(
    [
      [minLng, minLat],
      [maxLng, maxLat],
    ],
    {
      padding: { top: 80, bottom: 80, left: 60, right: 60 },
      maxZoom: 8.5,
      duration: reducedMotion ? 0 : 850,
    }
  )
}

export function HighQualityRealMap({
  activeCorridor,
  trafficLightState,
  showHeatmap,
  setShowHeatmap,
  isFullscreen,
  setIsFullscreen,
  language,
  isRTL,
  selectedWaypointNode,
  setSelectedWaypointNode,
  meshNodePingMs = 0.4,
  simSpeedKmh = 72,
}: HighQualityRealMapProps) {
  const { prefersReducedMotion } = useAccessibleMotion()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const isLoadedRef = useRef<boolean>(false)

  // Map Modes & Overlay Toggles
  const [mapLayerMode, setMapLayerMode] = useState<MapLayerMode>('vector-dark')
  const [showHighways, setShowHighways] = useState<boolean>(true)
  const [showSatellites, setShowSatellites] = useState<boolean>(false)
  const [showHubs, setShowHubs] = useState<boolean>(true)
  const [showWeighStations, setShowWeighStations] = useState<boolean>(true)
  const [showRestStops, setShowRestStops] = useState<boolean>(true)
  const [showBorderGates, setShowBorderGates] = useState<boolean>(true)
  const [showSimulatedFleet, setShowSimulatedFleet] = useState<boolean>(true)

  // Interactive Hub Popover State
  const [selectedHub, setSelectedHub] = useState<GlobalHubPin | null>(null)

  // Fleet Simulation Animation State
  const [fleetProgress, setFleetProgress] = useState<number>(0.38)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)

  // Markers references for cleanup
  const hubMarkersRef = useRef<maplibregl.Marker[]>([])
  const waypointMarkersRef = useRef<maplibregl.Marker[]>([])
  const fleetMarkerRef = useRef<maplibregl.Marker | null>(null)
  const truckIconElRef = useRef<HTMLDivElement | null>(null)

  // Active corridor line coordinates: [origin, ...waypoints, destination]
  const activeCorridorCoords = useMemo<[number, number][]>(() => {
    const coords: [number, number][] = [activeCorridor.originGps]
    if (activeCorridor.detailedWaypoints && activeCorridor.detailedWaypoints.length > 0) {
      activeCorridor.detailedWaypoints.forEach((wp) => {
        coords.push(wp.gps)
      })
    }
    coords.push(activeCorridor.destinationGps)
    return coords
  }, [activeCorridor])

  /* ── 3. GeoJSON Sources & Layers Configuration ──────────────────── */
  const setupGeoJsonLayers = useCallback(
    (map: maplibregl.Map) => {
      // 1. All Network Corridors
      const networkGeoJson = {
        type: 'FeatureCollection' as const,
        features: LAND_TRADE_CORRIDORS.map((c) => {
          const coords: [number, number][] = [c.originGps]
          if (c.detailedWaypoints) {
            c.detailedWaypoints.forEach((w) => coords.push(w.gps))
          }
          coords.push(c.destinationGps)
          return {
            type: 'Feature' as const,
            properties: { id: c.id, code: c.code },
            geometry: {
              type: 'LineString' as const,
              coordinates: coords,
            },
          }
        }),
      }

      if (!map.getSource('corridors-network')) {
        map.addSource('corridors-network', {
          type: 'geojson',
          data: networkGeoJson,
        })

        map.addLayer({
          id: 'corridors-network-line',
          type: 'line',
          source: 'corridors-network',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
            visibility: showHighways ? 'visible' : 'none',
          },
          paint: {
            'line-color': '#E8B317',
            'line-width': 1.8,
            'line-opacity': 0.3,
            'line-dasharray': [3, 2],
          },
        })
      }

      // 2. Active Corridor Line
      const activeGeoJson = {
        type: 'FeatureCollection' as const,
        features: [
          {
            type: 'Feature' as const,
            properties: { id: activeCorridor.id },
            geometry: {
              type: 'LineString' as const,
              coordinates: activeCorridorCoords,
            },
          },
        ],
      }

      if (!map.getSource('active-corridor')) {
        map.addSource('active-corridor', {
          type: 'geojson',
          data: activeGeoJson,
        })

        // Glowing outer casing
        map.addLayer({
          id: 'active-corridor-glow',
          type: 'line',
          source: 'active-corridor',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#E8B317',
            'line-width': 9,
            'line-opacity': 0.35,
            'line-blur': 4,
          },
        })

        // Core line
        map.addLayer({
          id: 'active-corridor-core',
          type: 'line',
          source: 'active-corridor',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': '#E8B317',
            'line-width': 3.5,
            'line-opacity': 0.95,
          },
        })
      } else {
        const src = map.getSource('active-corridor') as maplibregl.GeoJSONSource
        src.setData(activeGeoJson)
      }

      // 3. Logistics Density Heatmap Source
      const heatmapPoints = {
        type: 'FeatureCollection' as const,
        features: INLAND_LOGISTICS_HUBS.map((hub) => ({
          type: 'Feature' as const,
          properties: { weight: 1.0 },
          geometry: { type: 'Point' as const, coordinates: hub.gps },
        })),
      }

      if (!map.getSource('corridor-density')) {
        map.addSource('corridor-density', {
          type: 'geojson',
          data: heatmapPoints,
        })

        map.addLayer({
          id: 'corridor-heatmap-layer',
          type: 'heatmap',
          source: 'corridor-density',
          layout: {
            visibility: showHeatmap ? 'visible' : 'none',
          },
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': 1.5,
            'heatmap-radius': 35,
            'heatmap-opacity': 0.75,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(232, 179, 23, 0)',
              0.2,
              'rgba(232, 179, 23, 0.25)',
              0.5,
              'rgba(245, 158, 11, 0.6)',
              0.8,
              'rgba(239, 68, 68, 0.8)',
              1,
              'rgba(239, 68, 68, 0.95)',
            ],
          },
        })
      }
    },
    [activeCorridor, activeCorridorCoords, showHighways, showHeatmap]
  )




  /* ── 1. Initialize MapLibre GL Instance ─────────────────────────── */
  useEffect(() => {
    if (!mapContainerRef.current) return

    const initialStyle = getMapLibreStyle(mapLayerMode)

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: EGYPT_GULF_CENTER,
      zoom: 5.0,
      minZoom: 3.5,
      maxZoom: 14,
      pitch: 20,
      attributionControl: false,
    })

    mapRef.current = map

    map.on('load', () => {
      isLoadedRef.current = true
      setupGeoJsonLayers(map)
      fitToCorridor(map, activeCorridorCoords, prefersReducedMotion)
    })

    return () => {
      isLoadedRef.current = false
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── 2. Handle Layer Mode Switch (Carto Dark / Satellite / Voyager) ─ */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const newStyle = getMapLibreStyle(mapLayerMode)
    map.setStyle(newStyle)

    map.once('style.load', () => {
      setupGeoJsonLayers(map)
    })
  }, [mapLayerMode]) // eslint-disable-line react-hooks/exhaustive-deps

  // Update active corridor GeoJSON and zoom when activeCorridor changes
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoadedRef.current) return

    const src = map.getSource('active-corridor') as maplibregl.GeoJSONSource | undefined
    if (src) {
      src.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { id: activeCorridor.id },
            geometry: {
              type: 'LineString',
              coordinates: activeCorridorCoords,
            },
          },
        ],
      })
    }

    fitToCorridor(map, activeCorridorCoords, prefersReducedMotion)
  }, [activeCorridor, activeCorridorCoords, prefersReducedMotion])

  // Update Heatmap visibility
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoadedRef.current) return
    if (map.getLayer('corridor-heatmap-layer')) {
      map.setLayoutProperty(
        'corridor-heatmap-layer',
        'visibility',
        showHeatmap ? 'visible' : 'none'
      )
    }
  }, [showHeatmap])

  // Update Highways visibility
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isLoadedRef.current) return
    if (map.getLayer('corridors-network-line')) {
      map.setLayoutProperty(
        'corridors-network-line',
        'visibility',
        showHighways ? 'visible' : 'none'
      )
    }
  }, [showHighways])

  /* ── 5. Render 14 Inland Logistics Hubs Markers ─────────────────── */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old hub markers
    hubMarkersRef.current.forEach((m) => m.remove())
    hubMarkersRef.current = []

    if (!showHubs) return

    INLAND_LOGISTICS_HUBS.forEach((hub) => {
      const el = document.createElement('div')
      el.className = 'group cursor-pointer transform -translate-x-1/2 -translate-y-1/2'
      el.setAttribute('role', 'button')
      el.setAttribute('tabindex', '0')
      el.setAttribute('aria-label', hub.name[language])

      // Icon & color styling based on hub type
      const isDryPort = hub.type === 'dry-port'
      const isBorder = hub.type === 'border-crossing'
      const borderColor = isDryPort ? 'border-gold-400' : isBorder ? 'border-rose-400' : 'border-emerald-400'
      const bgColor = isDryPort ? 'bg-gold-500/20' : isBorder ? 'bg-rose-500/20' : 'bg-emerald-500/20'
      const textColor = isDryPort ? 'text-gold-300' : isBorder ? 'text-rose-300' : 'text-emerald-300'

      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-7 w-7 rounded-full ${bgColor} opacity-60"></span>
          <div class="relative flex items-center gap-1.5 px-2 py-1 rounded-xl bg-slate-900/95 border ${borderColor} ${textColor} text-[10.5px] font-mono font-bold shadow-xl backdrop-blur-md transition-transform duration-200 group-hover:scale-110">
            <span class="w-1.5 h-1.5 rounded-full ${isDryPort ? 'bg-gold-400' : 'bg-emerald-400'}"></span>
            <span class="truncate max-w-[120px] sm:max-w-[160px]">${hub.name[language]}</span>
          </div>
        </div>
      `

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedHub(hub)
        map.flyTo({
          center: hub.gps,
          zoom: Math.max(map.getZoom(), 7.2),
          duration: prefersReducedMotion ? 0 : 700,
        })
      })

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(hub.gps)
        .addTo(map)

      hubMarkersRef.current.push(marker)
    })

    return () => {
      hubMarkersRef.current.forEach((m) => m.remove())
      hubMarkersRef.current = []
    }
  }, [showHubs, language, prefersReducedMotion])

  /* ── 6. Render Active Corridor Waypoints Markers ─────────────────── */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Clear old waypoint markers
    waypointMarkersRef.current.forEach((m) => m.remove())
    waypointMarkersRef.current = []

    if (!activeCorridor.detailedWaypoints) return

    activeCorridor.detailedWaypoints.forEach((wp, idx) => {
      const isOrigin = idx === 0
      const isDest = idx === (activeCorridor.detailedWaypoints?.length ?? 1) - 1

      const el = document.createElement('div')
      el.className = 'cursor-pointer transform -translate-x-1/2 -translate-y-1/2 z-10'
      el.setAttribute('role', 'button')
      el.setAttribute('tabindex', '0')
      el.setAttribute('aria-label', wp.name)

      if (isOrigin) {
        el.innerHTML = `
          <div class="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/95 border border-emerald-400 text-emerald-300 font-mono text-[10px] font-black shadow-lg">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>ORIGIN // ${wp.name}</span>
          </div>
        `
      } else if (isDest) {
        el.innerHTML = `
          <div class="flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-950/95 border border-gold-400 text-gold-300 font-mono text-[10px] font-black shadow-lg">
            <span class="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></span>
            <span>DEST // ${wp.name}</span>
          </div>
        `
      } else {
        const isSelected = selectedWaypointNode?.name === wp.name
        el.innerHTML = `
          <div class="flex items-center gap-1 px-1.5 py-0.5 rounded-lg ${
            isSelected ? 'bg-gold-500 text-slate-950 font-bold' : 'bg-slate-900/90 text-gold-400 border border-gold-500/30'
          } font-mono text-[9px] shadow-md transition-all hover:scale-105">
            <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-gold-400'}"></span>
            <span>${wp.name}</span>
          </div>
        `
      }

      el.addEventListener('click', (e) => {
        e.stopPropagation()
        setSelectedWaypointNode(wp)
        map.flyTo({
          center: wp.gps,
          zoom: Math.max(map.getZoom(), 8),
          duration: prefersReducedMotion ? 0 : 650,
        })
      })

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(wp.gps)
        .addTo(map)

      waypointMarkersRef.current.push(marker)
    })

    return () => {
      waypointMarkersRef.current.forEach((m) => m.remove())
      waypointMarkersRef.current = []
    }
  }, [activeCorridor, selectedWaypointNode, prefersReducedMotion, setSelectedWaypointNode])

  /* ── 7. Simulated Moving Fleet Truck Marker ───────────────────────── */
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (!showSimulatedFleet) {
      if (fleetMarkerRef.current) {
        fleetMarkerRef.current.remove()
        fleetMarkerRef.current = null
      }
      return
    }

    if (!fleetMarkerRef.current) {
      const el = document.createElement('div')
      el.className = 'transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none'
      el.innerHTML = `
        <div class="relative flex items-center justify-center">
          <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-gold-400/50"></span>
          <div class="truck-icon-wrapper p-2 rounded-xl bg-gold-500 text-slate-950 shadow-[0_0_20px_rgba(232,179,23,0.6)] border border-white/50 transition-transform">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
        </div>
      `
      truckIconElRef.current = el.querySelector('.truck-icon-wrapper')
      fleetMarkerRef.current = new maplibregl.Marker({ element: el })
        .setLngLat(activeCorridorCoords[0])
        .addTo(map)
    }

    const { pos, bearing } = interpolatePositionAndBearing(
      activeCorridorCoords,
      fleetProgress
    )

    fleetMarkerRef.current.setLngLat(pos)
    if (truckIconElRef.current) {
      truckIconElRef.current.style.transform = `rotate(${bearing}deg)`
    }
  }, [showSimulatedFleet, activeCorridorCoords, fleetProgress])

  /* ── 8. Playback Loop for Fleet Progress ─────────────────────────── */
  useEffect(() => {
    if (!isPlaying || !showSimulatedFleet || prefersReducedMotion) return

    let lastTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const dt = (now - lastTime) / 1000
      lastTime = now

      // Real distance line speed simulation:
      // total corridor distance / speed = hours to complete
      const totalKm = Math.max(50, activeCorridor.distanceKm)
      const hoursToComplete = totalKm / (simSpeedKmh * playbackSpeed)
      const deltaProgress = (dt / (hoursToComplete * 3600)) * 150 // time-compressed simulation

      setFleetProgress((prev) => (prev + deltaProgress) % 1)
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying, showSimulatedFleet, prefersReducedMotion, activeCorridor.distanceKm, simSpeedKmh, playbackSpeed])

  /* ── Camera Control Handlers ─────────────────────────────────────── */
  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: prefersReducedMotion ? 0 : 350 })
  }

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: prefersReducedMotion ? 0 : 350 })
  }

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.fitBounds(EGYPT_GULF_BOUNDS, {
        padding: 50,
        duration: prefersReducedMotion ? 0 : 800,
      })
    }
  }

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden backdrop-blur-3xl border transition-all duration-500 shadow-2xl flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none p-4 sm:p-8 bg-slate-950/98 backdrop-blur-3xl'
          : 'border-gold-500/30 bg-slate-950/95 min-h-[580px]'
      }`}
    >
      {/* Top Professional Mission Control HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-slate-900/90 border-b border-white/10 rounded-t-2xl z-20">
        {/* Left: Map Mode Badges & Corridor Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 font-mono text-[11px] font-semibold tracking-wider shadow-[0_0_15px_rgba(232,179,23,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-400 shadow-[0_0_8px_#E8B317]" />
            </span>
            <span>LAND DIGITAL TWIN // {activeCorridor.code}</span>
          </div>

          <span className="hidden md:inline-flex text-[11px] font-mono text-slate-400 items-center gap-1">
            <span>MESH NODE:</span>
            <strong className="text-emerald-400 font-bold">{meshNodePingMs}ms</strong>
          </span>
        </div>

        {/* Center: Real Map Layer Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            onClick={() => setMapLayerMode('satellite')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mapLayerMode === 'satellite'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TERRAIN SATELLITE</span>
            <span className="sm:hidden">SAT</span>
          </button>

          <button
            onClick={() => setMapLayerMode('vector-dark')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mapLayerMode === 'vector-dark'
                ? 'bg-gold-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CYBER VECTOR</span>
            <span className="sm:hidden">CYBER</span>
          </button>

          <button
            onClick={() => setMapLayerMode('vector-arterial')}
            className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
              mapLayerMode === 'vector-arterial'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ARTERIAL HIGHWAYS</span>
            <span className="sm:hidden">HWY</span>
          </button>
        </div>

        {/* Right: Layer Toggles & Fullscreen View */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5 no-scrollbar shrink-0">
          {/* Highway Artery Grid Toggle */}
          <button
            onClick={() => setShowHighways(!showHighways)}
            title="Toggle Arterial Highway Corridors"
            aria-label="Toggle Arterial Highway Corridors"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showHighways
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
          </button>

          {/* LEO Satellite Overlay Toggle */}
          <button
            onClick={() => setShowSatellites(!showSatellites)}
            title="Toggle LEO Satellites"
            aria-label="Toggle LEO Satellites"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showSatellites
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
          </button>

          {/* Inland Logistics Hubs Toggle */}
          <button
            onClick={() => setShowHubs(!showHubs)}
            title="Toggle Inland Logistics Hubs & Dry Ports"
            aria-label="Toggle Inland Logistics Hubs & Dry Ports"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showHubs
                ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
          </button>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            title="Toggle Density Heatmap"
            aria-label="Toggle Density Heatmap"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showHeatmap
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
          </button>

          {/* Weigh Station Layer Toggle */}
          <button
            onClick={() => setShowWeighStations(!showWeighStations)}
            title="Toggle Declared Weigh Stations"
            aria-label="Toggle Declared Weigh Stations"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showWeighStations
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          {/* Rest Stop Layer Toggle */}
          <button
            onClick={() => setShowRestStops(!showRestStops)}
            title="Toggle Rest & Driver-Hours Stops"
            aria-label="Toggle Rest & Driver-Hours Stops"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showRestStops
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
          </button>

          {/* Border Crossing Layer Toggle */}
          <button
            onClick={() => setShowBorderGates(!showBorderGates)}
            title="Toggle Border Crossings & Clearance Windows"
            aria-label="Toggle Border Crossings & Clearance Windows"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showBorderGates
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
          </button>

          {/* Simulated Fleet Layer Toggle */}
          <button
            onClick={() => setShowSimulatedFleet(!showSimulatedFleet)}
            title="Toggle Simulated Fleet (not a live feed)"
            aria-label="Toggle Simulated Fleet (not a live feed)"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showSimulatedFleet
                ? 'bg-gold-500/20 text-gold-300 border-gold-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-xl text-xs font-mono border bg-white/5 text-slate-300 border-white/10 hover:text-white hover:bg-white/10 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main MapLibre WebGL Canvas Container */}
      <div className="relative flex-1 w-full h-full min-h-[480px] bg-slate-950 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full min-h-[480px]" />

        {/* Live Simulation Floating Playback & Telemetry Controller */}
        <div
          className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} z-20 flex flex-col gap-2 pointer-events-auto max-w-[calc(100%-4.5rem)] sm:max-w-md`}
        >
          {/* Real-Time Vehicle Status Floating Card */}
          <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-300 shrink-0">
              <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="font-mono text-xs min-w-0 flex-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-bold text-white text-[10.5px] sm:text-xs truncate">AUTONOMOUS DISPATCH</span>
                <span
                  title="Simulation feed — no telematics backend"
                  className="px-1.5 py-0.2 text-[8.5px] sm:text-[9px] rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0"
                >
                  SIM
                </span>
              </div>
              <div className="text-[9px] sm:text-[10px] text-slate-400 truncate">
                PROG: <span className="text-gold-300 font-bold">{Math.round(fleetProgress * 100)}%</span> | SPEED:{' '}
                <span className="text-white font-bold">{Math.round(simSpeedKmh)} KM/H (MODELLED)</span>
              </div>
            </div>

            {/* Playback & Speed Controls */}
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2 shrink-0">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                className="p-1.5 rounded-lg bg-gold-500 text-slate-950 hover:bg-gold-400 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  if (playbackSpeed === 1) setPlaybackSpeed(2)
                  else if (playbackSpeed === 2) setPlaybackSpeed(5)
                  else setPlaybackSpeed(1)
                }}
                aria-label="Toggle Playback Speed"
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-gold-300 hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <FastForward className="w-3 h-3" />
                <span>{playbackSpeed}x</span>
              </button>
            </div>
          </div>
        </div>

        {/* Floating Pan/Zoom Micro-HUD Navigation Controls */}
        <div
          className={`absolute bottom-4 ${isRTL ? 'left-4' : 'right-4'} z-20 flex flex-col gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl`}
        >
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset Map View"
            aria-label="Reset Map View"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Hub Detail Popover Overlay */}
        <AnimatePresence>
          {selectedHub && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30 max-w-[calc(100%-2rem)] sm:max-w-xs w-full p-4 rounded-2xl bg-slate-900/95 border border-gold-500/40 backdrop-blur-2xl shadow-2xl text-white font-mono text-xs`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] text-gold-400 font-bold uppercase">{selectedHub.country[language]}</span>
                  <h4 className="font-bold text-sm text-white">{selectedHub.name[language]}</h4>
                </div>
                <button
                  onClick={() => setSelectedHub(null)}
                  aria-label="Close Hub Details"
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-emerald-400 font-bold">DECLARED · MODELLED</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">THROUGHPUT:</span>
                  <span className="text-white font-bold">{selectedHub.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CLEARANCE:</span>
                  <span className="text-gold-300 font-bold">{selectedHub.clearanceTime}</span>
                </div>
                <div className="text-[10px] text-slate-400 pt-1">
                  {selectedHub.stats}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected Waypoint Detail Popover */}
        <AnimatePresence>
          {selectedWaypointNode && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30 max-w-[calc(100%-2rem)] sm:max-w-xs w-full p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl text-white font-mono text-xs`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedWaypointNode.status}</span>
                  <h4 className="font-bold text-sm text-white">{selectedWaypointNode.name}</h4>
                </div>
                <button
                  onClick={() => setSelectedWaypointNode(null)}
                  aria-label="Close Waypoint Details"
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">WEATHER:</span>
                  <span className="text-gold-300 font-bold">{selectedWaypointNode.weather[language]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">THROUGHPUT:</span>
                  <span className="text-white font-bold">{selectedWaypointNode.throughputIndex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CLEARANCE:</span>
                  <span className="text-emerald-400 font-bold">{selectedWaypointNode.avgClearanceTime}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Telemetry HUD Status Strip */}
      <div className="p-3.5 sm:p-4 bg-slate-900/90 border-t border-white/10 rounded-b-2xl z-20 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-gold-400" />
            <span>AXLE LOAD: <strong className="text-white">{activeCorridor.axleLoadLimitT} TONS MAX</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>CLEARANCE: <strong className="text-gold-300">{activeCorridor.clearanceHeightM}M HEIGHT</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>CROSS-DOCK: <strong className="text-emerald-300">{activeCorridor.railSlotTime}</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">SAFETY RATING:</span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              trafficLightState === 'green'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : trafficLightState === 'yellow'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}
          >
            {activeCorridor.riskScore}
          </span>
        </div>
      </div>
    </div>
  )
}

export default HighQualityRealMap
