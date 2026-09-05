'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
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
  Globe,
  Truck,
  AlertTriangle,
  Crosshair,
  X,
  Radio,
  CheckCircle2,
} from 'lucide-react'
import { useAccessibleMotion } from '@/hooks/use-reduced-motion'
import type { BilingualText, Language } from '@/types/land-logistics'
import type { ContingencyStrategyOption, DisruptionScenarioOption } from '@/types/disruption'

export type IncidentMapLayerMode = 'vector-dark' | 'satellite' | 'vector-arterial'

export interface GeoPolygonGeometry {
  type: 'Polygon'
  coordinates: [number, number][][]
}

export interface GeoLineGeometry {
  type: 'LineString'
  coordinates: [number, number][]
}

export interface GeoJsonFeature<G> {
  type: 'Feature'
  properties: Record<string, unknown>
  geometry: G
}

export interface RealDisruptionScenarioData extends DisruptionScenarioOption {
  gisCoordinates: string
  blockedPathLabel: BilingualText
  bypassPathLabel: BilingualText
  originGps: [number, number]
  destinationGps: [number, number]
  chokepointGps: [number, number]
  blockedCoordinates?: [number, number][]
  bypassCoordinates?: [number, number][]
  exclusionRadiusKm?: number
  radarCoordinates?: [number, number]
  realBlockedSvgPath?: string
  realBypassSvgPath?: string
  localizedMeteorology: BilingualText
  liveHoldingDelay: string
}

export interface IncidentRealMapProps {
  activeScenario: RealDisruptionScenarioData
  activeStrategy: ContingencyStrategyOption
  language: Language
  isRTL: boolean
  isFullscreen: boolean
  setIsFullscreen: (val: boolean) => void
  selectedIncidentHud: boolean
  setSelectedIncidentHud: (val: boolean) => void
}

/* ── Tile Sources Configuration for MapLibre ───────────────────────── */
function getMapLibreStyle(mode: IncidentMapLayerMode): maplibregl.StyleSpecification {
  const tileUrls: Record<IncidentMapLayerMode, string[]> = {
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
      'incident-raster-tiles': {
        type: 'raster',
        tiles: tileUrls[mode],
        tileSize: 256,
        attribution: '© CartoDB, © OpenStreetMap, © Esri',
      },
    },
    layers: [
      {
        id: 'incident-raster-layer',
        type: 'raster',
        source: 'incident-raster-tiles',
        minzoom: 0,
        maxzoom: 19,
      },
    ],
  }
}

/** Generate a geodesic circle polygon around an epicenter [lng, lat]. */
function createGeoCircle(center: [number, number], radiusKm: number, points = 40): GeoPolygonGeometry {
  const [lng, lat] = center
  const coords: [number, number][] = []
  const distanceX = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  const distanceY = radiusKm / 110.574

  for (let i = 0; i <= points; i++) {
    const theta = (i / points) * (2 * Math.PI)
    const x = distanceX * Math.cos(theta)
    const y = distanceY * Math.sin(theta)
    coords.push([lng + x, lat + y])
  }
  return {
    type: 'Polygon',
    coordinates: [coords],
  }
}

export function IncidentRealMap({
  activeScenario,
  activeStrategy,
  language,
  isRTL,
  isFullscreen,
  setIsFullscreen,
  selectedIncidentHud,
  setSelectedIncidentHud,
}: IncidentRealMapProps) {
  const { prefersReducedMotion } = useAccessibleMotion()
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const [mapLayerMode, setMapLayerMode] = useState<IncidentMapLayerMode>('vector-dark')
  const [mapLoaded, setMapLoaded] = useState<boolean>(false)

  // Fallback / standard corridor waypoints if not explicitly passed
  const blockedCoords: [number, number][] = useMemo(() => {
    if (activeScenario.blockedCoordinates && activeScenario.blockedCoordinates.length >= 2) {
      return activeScenario.blockedCoordinates
    }
    return [
      activeScenario.originGps,
      [
        (activeScenario.originGps[0] + activeScenario.chokepointGps[0]) / 2,
        (activeScenario.originGps[1] + activeScenario.chokepointGps[1]) / 2,
      ],
      activeScenario.chokepointGps,
    ]
  }, [activeScenario])

  const bypassCoords: [number, number][] = useMemo(() => {
    if (activeScenario.bypassCoordinates && activeScenario.bypassCoordinates.length >= 2) {
      return activeScenario.bypassCoordinates
    }
    // Generate curved offset around chokepoint
    const [ox, oy] = activeScenario.originGps
    const [dx, dy] = activeScenario.destinationGps
    const [cx, cy] = activeScenario.chokepointGps
    const midX = (ox + dx) / 2 + (cy - oy) * 0.4
    const midY = (oy + dy) / 2 - (cx - ox) * 0.4
    return [activeScenario.originGps, [midX, midY], activeScenario.destinationGps]
  }, [activeScenario])

  const exclusionRadiusKm = activeScenario.exclusionRadiusKm || 18

  // ── Initialize MapLibre GL Map ────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return

    const initialCenter = activeScenario.chokepointGps
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapLibreStyle(mapLayerMode),
      center: initialCenter,
      zoom: 7.5,
      pitch: 35,
      bearing: -5,
      attributionControl: false,
      dragRotate: true,
      touchPitch: false,
    })

    mapRef.current = map

    map.on('load', () => {
      setMapLoaded(true)
    })

    return () => {
      markersRef.current.forEach((m) => m.remove())
      markersRef.current = []
      map.remove()
      mapRef.current = null
      setMapLoaded(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Update Style on Layer Switch ──────────────────────────────────
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setStyle(getMapLibreStyle(mapLayerMode))
  }, [mapLayerMode])

  // ── Update Layers & Markers on Map Load or Scenario Change ─────────
  const updateMapLayersAndCamera = useCallback(() => {
    const map = mapRef.current
    if (!map || !map.isStyleLoaded()) return

    // 1. Clear existing HTML markers
    markersRef.current.forEach((m) => m.remove())
    markersRef.current = []

    // 2. Data Geometries
    const blockedGeoJson: GeoJsonFeature<GeoLineGeometry> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: blockedCoords,
      },
    }

    const bypassGeoJson: GeoJsonFeature<GeoLineGeometry> = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: bypassCoords,
      },
    }

    const circleGeoJson: GeoJsonFeature<GeoPolygonGeometry> = {
      type: 'Feature',
      properties: {},
      geometry: createGeoCircle(activeScenario.chokepointGps, exclusionRadiusKm),
    }

    // 3. Upsert Exclusion Zone Geofence Layer
    if (map.getSource('incident-geofence')) {
      ;(map.getSource('incident-geofence') as maplibregl.GeoJSONSource).setData(circleGeoJson)
    } else {
      map.addSource('incident-geofence', {
        type: 'geojson',
        data: circleGeoJson,
      })

      map.addLayer({
        id: 'incident-geofence-fill',
        type: 'fill',
        source: 'incident-geofence',
        paint: {
          'fill-color': '#f43f5e',
          'fill-opacity': 0.14,
        },
      })

      map.addLayer({
        id: 'incident-geofence-line',
        type: 'line',
        source: 'incident-geofence',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 1.8,
          'line-dasharray': [3, 2],
        },
      })
    }

    // 4. Upsert Blocked Corridor Layer
    if (map.getSource('incident-blocked')) {
      ;(map.getSource('incident-blocked') as maplibregl.GeoJSONSource).setData(blockedGeoJson)
    } else {
      map.addSource('incident-blocked', {
        type: 'geojson',
        data: blockedGeoJson,
      })

      map.addLayer({
        id: 'incident-blocked-glow',
        type: 'line',
        source: 'incident-blocked',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 8,
          'line-opacity': 0.35,
          'line-blur': 4,
        },
      })

      map.addLayer({
        id: 'incident-blocked-core',
        type: 'line',
        source: 'incident-blocked',
        paint: {
          'line-color': '#f43f5e',
          'line-width': 3.5,
          'line-dasharray': [4, 2],
        },
      })
    }

    // 5. Upsert AI Bypass Reroute Layer
    if (map.getSource('incident-bypass')) {
      ;(map.getSource('incident-bypass') as maplibregl.GeoJSONSource).setData(bypassGeoJson)
    } else {
      map.addSource('incident-bypass', {
        type: 'geojson',
        data: bypassGeoJson,
      })

      map.addLayer({
        id: 'incident-bypass-glow',
        type: 'line',
        source: 'incident-bypass',
        paint: {
          'line-color': '#10b981',
          'line-width': 9,
          'line-opacity': 0.3,
          'line-blur': 4,
        },
      })

      map.addLayer({
        id: 'incident-bypass-core',
        type: 'line',
        source: 'incident-bypass',
        paint: {
          'line-color': '#34d399',
          'line-width': 3.5,
        },
      })
    }

    // 6. Create Interactive HTML Markers
    // Origin Node (Signal Gold)
    const originEl = document.createElement('div')
    originEl.className = 'group cursor-pointer'
    originEl.innerHTML = `
      <div class="flex flex-col items-center pointer-events-auto">
        <span class="px-2 py-0.5 rounded-md bg-slate-950/90 text-gold-300 border border-gold-500/50 font-mono text-[9px] font-bold shadow-lg mb-1 whitespace-nowrap">
          ORIGIN
        </span>
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-gold-500/20 border-2 border-gold-400 shadow-[0_0_15px_rgba(232,179,23,0.8)]">
          <div class="w-2 h-2 rounded-full bg-gold-400"></div>
        </div>
      </div>
    `
    const originMarker = new maplibregl.Marker({ element: originEl })
      .setLngLat(activeScenario.originGps)
      .addTo(map)
    markersRef.current.push(originMarker)

    // Destination Node (Cyber Emerald)
    const destEl = document.createElement('div')
    destEl.className = 'group cursor-pointer'
    destEl.innerHTML = `
      <div class="flex flex-col items-center pointer-events-auto">
        <span class="px-2 py-0.5 rounded-md bg-slate-950/90 text-emerald-300 border border-emerald-500/50 font-mono text-[9px] font-bold shadow-lg mb-1 whitespace-nowrap">
          DESTINATION
        </span>
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.8)]">
          <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
        </div>
      </div>
    `
    const destMarker = new maplibregl.Marker({ element: destEl })
      .setLngLat(activeScenario.destinationGps)
      .addTo(map)
    markersRef.current.push(destMarker)

    // Incident Epicenter Marker (Pulsing Rose Beacon)
    const chokepointEl = document.createElement('div')
    chokepointEl.className = 'group cursor-pointer pointer-events-auto select-none'
    chokepointEl.innerHTML = `
      <div class="relative flex items-center justify-center -translate-y-2">
        <span class="animate-ping absolute inline-flex h-9 w-9 rounded-full bg-rose-500 opacity-75"></span>
        <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-[0_0_25px_rgba(244,63,94,1)] text-white font-mono font-black text-xs">
          !
        </div>
      </div>
    `
    chokepointEl.addEventListener('click', (e) => {
      e.stopPropagation()
      setSelectedIncidentHud(true)
      map.flyTo({
        center: activeScenario.chokepointGps,
        zoom: Math.max(map.getZoom(), 11),
        duration: prefersReducedMotion ? 0 : 800,
      })
    })

    const chokepointMarker = new maplibregl.Marker({ element: chokepointEl })
      .setLngLat(activeScenario.chokepointGps)
      .addTo(map)
    markersRef.current.push(chokepointMarker)

    // 7. Auto-fit camera bounding box to frame the incident corridor
    const bounds = new maplibregl.LngLatBounds()
    bounds.extend(activeScenario.originGps)
    bounds.extend(activeScenario.destinationGps)
    bounds.extend(activeScenario.chokepointGps)
    blockedCoords.forEach((pt) => bounds.extend(pt))
    bypassCoords.forEach((pt) => bounds.extend(pt))

    map.fitBounds(bounds, {
      padding: { top: 60, bottom: 60, left: 60, right: 60 },
      maxZoom: 11,
      duration: prefersReducedMotion ? 0 : 1200,
    })
  }, [activeScenario, blockedCoords, bypassCoords, exclusionRadiusKm, prefersReducedMotion, setSelectedIncidentHud])

  // Re-run when map loads or when activeScenario changes
  useEffect(() => {
    if (!mapLoaded) return
    const map = mapRef.current
    if (!map) return

    if (map.isStyleLoaded()) {
      updateMapLayersAndCamera()
    } else {
      map.once('styledata', updateMapLayersAndCamera)
    }
  }, [mapLoaded, activeScenario, updateMapLayersAndCamera])

  // ── Navigation Control Handlers ──────────────────────────────────
  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 })
  }

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 })
  }

  const handleResetView = () => {
    const map = mapRef.current
    if (!map) return
    const bounds = new maplibregl.LngLatBounds()
    bounds.extend(activeScenario.originGps)
    bounds.extend(activeScenario.destinationGps)
    bounds.extend(activeScenario.chokepointGps)
    map.fitBounds(bounds, {
      padding: { top: 60, bottom: 60, left: 60, right: 60 },
      maxZoom: 11,
      duration: prefersReducedMotion ? 0 : 800,
    })
  }

  const handleCenterOnEpicenter = () => {
    mapRef.current?.flyTo({
      center: activeScenario.chokepointGps,
      zoom: 11.5,
      pitch: 45,
      duration: prefersReducedMotion ? 0 : 900,
    })
    setSelectedIncidentHud(true)
  }

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-rose-500/30 transition-all duration-500 shadow-2xl flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none p-4 sm:p-8 bg-slate-950/98 backdrop-blur-3xl'
          : 'h-[360px] sm:h-[420px] lg:h-[450px]'
      }`}
    >
      {/* Top Incident Mission Control HUD Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 sm:p-3.5 bg-slate-900/90 border-b border-white/10 z-20">
        {/* Left: Incident Code & Affected Route */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-[10px] sm:text-[11px] font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
            </span>
            <span>CRISIS TWIN // {activeScenario.code}</span>
          </div>

          <span
            className={`hidden sm:inline-flex px-2 py-0.5 rounded text-[9px] font-mono font-extrabold ${
              activeScenario.severity === 'CRITICAL'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {activeScenario.severity}
          </span>
        </div>

        {/* Center: Real Layer Switcher Tabs */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-xl bg-black/50 border border-white/10">
          <button
            onClick={() => setMapLayerMode('vector-dark')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1 ${
              mapLayerMode === 'vector-dark'
                ? 'bg-rose-500 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span className="hidden sm:inline">CYBER VECTOR</span>
            <span className="sm:hidden">VECTOR</span>
          </button>

          <button
            onClick={() => setMapLayerMode('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1 ${
              mapLayerMode === 'satellite'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span className="hidden sm:inline">TERRAIN SATELLITE</span>
            <span className="sm:hidden">SAT</span>
          </button>

          <button
            onClick={() => setMapLayerMode('vector-arterial')}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold transition-all flex items-center gap-1 ${
              mapLayerMode === 'vector-arterial'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Truck className="w-3 h-3" />
            <span className="hidden sm:inline">HIGHWAYS</span>
            <span className="sm:hidden">HWY</span>
          </button>
        </div>

        {/* Right: Fullscreen Trigger */}
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          className="p-1.5 sm:p-2 rounded-xl text-xs font-mono border bg-white/5 text-slate-300 border-white/10 hover:text-white hover:bg-white/10 transition-all"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main MapLibre WebGL Canvas Container */}
      <div className="relative flex-1 w-full h-full min-h-[260px] bg-slate-950 overflow-hidden">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Top-Left Geographic Coordinates HUD Overlay */}
        <div
          className={`absolute top-3 ${
            isRTL ? 'right-3' : 'left-3'
          } z-20 pointer-events-none px-2.5 py-1 rounded-lg bg-slate-950/85 border border-white/10 text-[9px] font-mono text-rose-300/90 backdrop-blur-md flex items-center gap-1.5`}
        >
          <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
          <span>{activeScenario.gisCoordinates}</span>
        </div>

        {/* Floating Pan/Zoom & Focus HUD Navigation Controls */}
        <div
          className={`absolute bottom-3.5 ${
            isRTL ? 'left-3.5' : 'right-3.5'
          } z-20 flex flex-col gap-1 p-1 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl`}
        >
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCenterOnEpicenter}
            title="Focus Epicenter"
            aria-label="Focus Epicenter"
            className="p-2 rounded-xl text-rose-400 hover:text-rose-200 hover:bg-white/10 transition-colors"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetView}
            title="Reset Route View"
            aria-label="Reset Route View"
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors border-t border-white/10"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Floating Active Bypass Protocol Status Strip */}
        <div
          className={`absolute bottom-3.5 ${
            isRTL ? 'right-3.5' : 'left-3.5'
          } z-20 max-w-[calc(100%-4.5rem)] pointer-events-auto`}
        >
          <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-slate-900/90 border border-emerald-500/40 backdrop-blur-xl shadow-2xl text-[10px] font-mono text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="font-bold truncate">{activeScenario.bypassPathLabel[language]}</span>
          </div>
        </div>

        {/* Interactive Incident Contextual Telemetry Popover on Click */}
        <AnimatePresence>
          {selectedIncidentHud && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              className={`absolute top-12 ${
                isRTL ? 'left-3.5' : 'right-3.5'
              } z-30 max-w-[calc(100%-2rem)] sm:max-w-sm w-full p-4 rounded-2xl border border-rose-500/50 bg-slate-900/95 backdrop-blur-2xl shadow-[0_0_35px_rgba(244,63,94,0.35)] text-white font-mono text-xs`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span className="font-bold text-xs text-rose-300 truncate">
                    {activeScenario.code}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedIncidentHud(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  aria-label="Close Incident Details"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">SEVERITY:</span>
                  <span className="text-rose-400 font-bold">{activeScenario.severity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">METEOROLOGY:</span>
                  <span className="text-amber-300 font-semibold">{activeScenario.localizedMeteorology[language]}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">HOLDING DELAY:</span>
                  <span className="text-rose-400 font-bold">{activeScenario.liveHoldingDelay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">BYPASS PROTOCOL:</span>
                  <span className="text-emerald-400 font-bold truncate max-w-[170px]">{activeStrategy.name[language]}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default IncidentRealMap
