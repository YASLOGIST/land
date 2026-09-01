'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
} from 'lucide-react'
import { WORLD_LAND_SVG_PATH, WORLD_BORDERS_SVG_PATH } from '@/data/world-land-110m'
import { INLAND_LOGISTICS_HUBS } from '@/data/landCorridors'
import { projectGeo } from '@/utils/gis-projection'
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
  transform: { x: number; y: number; scale: number }
  isDragging: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement | SVGSVGElement>) => void
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement | SVGSVGElement>) => void
  handleMouseUp: () => void
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement | SVGSVGElement>) => void
  handleTouchMove: (e: React.TouchEvent<HTMLDivElement | SVGSVGElement>) => void
  handleTouchEnd: () => void
  handleWheel: (e: React.WheelEvent<HTMLDivElement | SVGSVGElement>) => void
  zoomIn: () => void
  zoomOut: () => void
  resetView: () => void
  centerOnPoint: (x: number, y: number, targetScale?: number) => void
  meshNodePingMs?: number
}

// 6G LEO Satellites Constellation Simulation Coordinates
const LEO_SATELLITES = [
  { id: 'leo-alpha-1', name: '6G-LEO-01 (GEO-SYNC)', lat: 34.0, lon: 45.0, alt: '540 KM', band: 'THz LEO' },
  { id: 'leo-alpha-2', name: '6G-LEO-02 (POLAR-APEX)', lat: 58.0, lon: -20.0, alt: '560 KM', band: 'Optical Mesh' },
  { id: 'leo-alpha-3', name: '6G-LEO-03 (PACIFIC-RELAY)', lat: 18.0, lon: 140.0, alt: '530 KM', band: 'THz LEO' },
  { id: 'leo-alpha-4', name: '6G-LEO-04 (INDIAN-OCEAN)', lat: -5.0, lon: 75.0, alt: '550 KM', band: 'Laser ISL' },
]

export function HighQualityRealMap({
  activeCorridor,
  selectedModeId,
  trafficLightState,
  showHeatmap,
  setShowHeatmap,
  isFullscreen,
  setIsFullscreen,
  language,
  isRTL,
  selectedWaypointNode,
  setSelectedWaypointNode,
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
  meshNodePingMs = 0.4,
}: HighQualityRealMapProps) {
  // Map Layer Engine state
  const [mapLayerMode, setMapLayerMode] = useState<MapLayerMode>('satellite')
  const [showHighways, setShowHighways] = useState<boolean>(true)
  const [showSatellites, setShowSatellites] = useState<boolean>(true)
  const [showHubs, setShowHubs] = useState<boolean>(true)

  // Simulation Controls & Fleet Tracker state
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [fleetProgress, setFleetProgress] = useState<number>(0.35) // 0 to 1 along the path
  const [selectedHub, setSelectedHub] = useState<GlobalHubPin | null>(null)

  // Track path element for real-time SVG coordinate projection
  const pathRef = useRef<SVGPathElement | null>(null)

  // Animation Loop for Moving Vehicle
  useEffect(() => {
    let animationFrameId: number
    let lastTime = performance.now()

    const animate = (time: number) => {
      const delta = (time - lastTime) / 1000
      lastTime = time

      if (isPlaying) {
        setFleetProgress((prev) => {
          const speedFactor = 0.04 * playbackSpeed * delta
          let next = prev + speedFactor
          if (next > 1) next = 0
          return next
        })
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [isPlaying, playbackSpeed])

  // Compute vehicle position directly from fleetProgress and activeCorridor coordinates
  const vehiclePos = useMemo(() => {
    const start = projectGeo(activeCorridor.originGps)
    const end = projectGeo(activeCorridor.destinationGps)
    const currX = start[0] + (end[0] - start[0]) * fleetProgress
    const currY = start[1] + (end[1] - start[1]) * fleetProgress
    const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) * (180 / Math.PI)
    return { x: currX, y: currY, angle }
  }, [fleetProgress, activeCorridor])

  // Trajectory Path based on land modality
  const activeTrajectoryPath = useMemo(() => {
    return activeCorridor.realLandPath || activeCorridor.landBurntOrangeHighwayPath || activeCorridor.landForestGreenRailPath || activeCorridor.predictivePath
  }, [activeCorridor])

  const originPixels = useMemo(() => projectGeo(activeCorridor.originGps), [activeCorridor])
  const destPixels = useMemo(() => projectGeo(activeCorridor.destinationGps), [activeCorridor])
  const chokepointPixels = useMemo(() => projectGeo(activeCorridor.chokepointGps), [activeCorridor])

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden backdrop-blur-3xl border transition-all duration-500 shadow-2xl flex flex-col ${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none p-4 sm:p-8 bg-slate-950/98 backdrop-blur-3xl'
          : 'border-cyan-500/30 bg-slate-950/95 min-h-[580px]'
      }`}
    >
      {/* Top Professional Mission Control HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 sm:p-4 bg-slate-900/90 border-b border-white/10 rounded-t-2xl z-20">
        
        {/* Left: Map Mode Badges & Corridor Identifier */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-semibold tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            </span>
            <span>6G LAND DIGITAL TWIN // {activeCorridor.code}</span>
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
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">6G CYBER VECTOR</span>
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
        <div className="flex items-center gap-1.5">
          {/* Highway Artery Grid Toggle */}
          <button
            onClick={() => setShowHighways(!showHighways)}
            title="Toggle Arterial Highway Corridors"
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
            title="Toggle 6G LEO Satellites"
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
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showHubs
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
          </button>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            title="Toggle 6G Density Heatmap"
            className={`p-2 rounded-xl text-xs font-mono border transition-all flex items-center gap-1 ${
              showHeatmap
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-2 rounded-xl text-xs font-mono border bg-white/5 text-slate-300 border-white/10 hover:text-white hover:bg-white/10 transition-all"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Main Interactive Geographic Canvas Wrapper */}
      <div
        className={`relative flex-1 w-full h-full min-h-[480px] bg-slate-950 overflow-hidden select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* Real Dynamic SVG Cartographic & Satellite Map Engine */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full object-contain pointer-events-auto"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Real Photorealistic Satellite Ocean Gradient */}
            <radialGradient id="satellite-ocean-grad" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#0c2238" />
              <stop offset="45%" stopColor="#071728" />
              <stop offset="85%" stopColor="#030b14" />
              <stop offset="100%" stopColor="#01050a" />
            </radialGradient>

            {/* Glowing Effects */}
            <filter id="hq-glow-cyan" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hq-glow-emerald" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="hq-glow-gold" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Dynamic Active Corridor Gradient */}
            <linearGradient id="active-pulse-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Tactical Grid Pattern */}
            <pattern id="tactical-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.07)" strokeWidth="0.8" />
              <circle cx="20" cy="20" r="0.8" fill="rgba(6,182,212,0.2)" />
            </pattern>

            {/* Satellite Terrain Shading Texture Gradient */}
            <radialGradient id="sat-land-relief" cx="55%" cy="30%" r="65%">
              <stop offset="0%" stopColor="#1a3628" />
              <stop offset="40%" stopColor="#12271e" />
              <stop offset="85%" stopColor="#091813" />
              <stop offset="100%" stopColor="#040e0b" />
            </radialGradient>

            {/* Night-Lights Illuminations Filter */}
            <radialGradient id="city-night-light" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(253, 224, 71, 0.9)" />
              <stop offset="40%" stopColor="rgba(251, 191, 36, 0.4)" />
              <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
            </radialGradient>

            {/* Heatmap Gradients */}
            <radialGradient id="hq-heatmap-hot" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(239,68,68,0.45)" />
              <stop offset="70%" stopColor="rgba(245,158,11,0.18)" />
              <stop offset="100%" stopColor="rgba(239,68,68,0)" />
            </radialGradient>
            <radialGradient id="hq-heatmap-cold" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.4)" />
              <stop offset="70%" stopColor="rgba(59,130,246,0.15)" />
              <stop offset="100%" stopColor="rgba(59,130,246,0)" />
            </radialGradient>
          </defs>

          {/* Transform Matrix Group with Smooth Pan and Inertial Zoom */}
          <g
            transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
            style={{ transformOrigin: '500px 250px', willChange: 'transform' }}
          >
            {/* 1. Base Ocean & Relief Layer */}
            <rect width="1000" height="500" fill="url(#satellite-ocean-grad)" />

            {/* Tactical Grid Overlay */}
            {mapLayerMode === 'vector-arterial' && (
              <rect width="1000" height="500" fill="url(#tactical-grid-pattern)" />
            )}

            {/* 2. Geographic Graticules */}
            <g stroke={mapLayerMode === 'satellite' ? 'rgba(56,189,248,0.12)' : 'rgba(6,182,212,0.15)'} strokeWidth="0.75" strokeDasharray="4 6">
              <line x1="0" y1="65.3" x2="1000" y2="65.3" />
              <line x1="0" y1="184.7" x2="1000" y2="184.7" />
              <line x1="0" y1="250.0" x2="1000" y2="250.0" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeDasharray="none" />
              <line x1="0" y1="315.3" x2="1000" y2="315.3" />
              <line x1="166.7" y1="0" x2="166.7" y2="500" />
              <line x1="333.3" y1="0" x2="333.3" y2="500" />
              <line x1="500.0" y1="0" x2="500.0" y2="500" stroke="rgba(56,189,248,0.3)" strokeWidth="1.2" strokeDasharray="none" />
              <line x1="666.7" y1="0" x2="666.7" y2="500" />
              <line x1="833.3" y1="0" x2="833.3" y2="500" />
            </g>

            {/* 3. Real High-Resolution Continents & Topography Geometry */}
            <path
              d={WORLD_LAND_SVG_PATH}
              fill={
                mapLayerMode === 'satellite'
                  ? 'url(#sat-land-relief)'
                  : mapLayerMode === 'vector-arterial'
                    ? '#071628'
                    : 'rgba(6,182,212,0.07)'
              }
              stroke={
                mapLayerMode === 'satellite'
                  ? 'rgba(52,211,153,0.5)'
                  : mapLayerMode === 'vector-arterial'
                    ? 'rgba(245,158,11,0.6)'
                    : 'rgba(6,182,212,0.5)'
              }
              strokeWidth="1.2"
              className="transition-colors duration-500 pointer-events-none"
            />

            {/* World Country Borders */}
            <path
              d={WORLD_BORDERS_SVG_PATH}
              fill="none"
              stroke={mapLayerMode === 'satellite' ? 'rgba(255,255,255,0.15)' : 'rgba(6,182,212,0.22)'}
              strokeWidth="0.7"
              strokeDasharray="2 3"
              className="pointer-events-none"
            />

            {/* 4. Satellite Night-Light Clusters (Industrial & Inland Logistics Belts) */}
            {mapLayerMode === 'satellite' && (
              <g className="pointer-events-none opacity-85">
                <circle cx="653.6" cy="180.0" r="14" fill="url(#city-night-light)" />
                <circle cx="512.4" cy="105.8" r="16" fill="url(#city-night-light)" />
                <circle cx="527.5" cy="101.2" r="12" fill="url(#city-night-light)" />
                <circle cx="837.4" cy="163.3" r="18" fill="url(#city-night-light)" />
                <circle cx="788.4" cy="246.3" r="14" fill="url(#city-night-light)" />
                <circle cx="295.0" cy="137.0" r="18" fill="url(#city-night-light)" />
              </g>
            )}

            {/* 5. Arterial Highway Corridors & Heavy Road Freight Mesh */}
            {showHighways && (
              <g className="pointer-events-none opacity-50">
                {/* Trans-Eurasian Highway Link */}
                <path d="M 512 106 L 565 110 L 610 135 L 653 180 L 720 190 L 837 163" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* North American Interstates I-80/I-90 corridor */}
                <path d="M 175 140 L 230 135 L 295 137" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 4" />
                {/* Middle East GCC Highway Grid */}
                <path d="M 629 181 L 653 180 L 664 185" fill="none" stroke="#10b981" strokeWidth="1.8" strokeDasharray="3 3" />
              </g>
            )}

            {/* 6. Quantitative 6G Data Heatmap Overlay */}
            {showHeatmap && (
              <g className="pointer-events-none transition-opacity duration-500">
                <circle cx="653.6" cy="180.0" r="65" fill="url(#hq-heatmap-hot)" />
                <circle cx="512.4" cy="105.8" r="60" fill="url(#hq-heatmap-hot)" />
                <circle cx="837.4" cy="163.3" r="70" fill="url(#hq-heatmap-cold)" />
                <circle cx="788.4" cy="246.3" r="55" fill="url(#hq-heatmap-cold)" />
                <circle cx="590.4" cy="166.9" r="50" fill="url(#hq-heatmap-hot)" />
              </g>
            )}

            {/* 7. Active Terrestrial Highway Trajectory Vector Paths */}
            {/* Secondary Alternative Highway */}
            <path
              d={activeCorridor.landOliveRuralPath || activeCorridor.predictivePath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.2"
              strokeDasharray="6 6"
              className="opacity-60 pointer-events-none"
            />

            {/* Primary Main Active Highway Route Track with Reference for Live Vehicle Animation */}
            <path
              ref={pathRef}
              d={activeTrajectoryPath}
              fill="none"
              stroke="url(#active-pulse-gradient)"
              strokeWidth={selectedModeId === 'electric-platoon' ? '4.8' : '4.2'}
              filter="url(#hq-glow-cyan)"
              className="pointer-events-none"
            />

            {/* Animated Laser Pulse along trajectory */}
            <motion.path
              d={activeTrajectoryPath}
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeDasharray="14 120"
              initial={{ strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: -260 }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
              className="pointer-events-none"
            />

            {/* Highway Crossing Chokepoints & Smart Customs Gateways */}
            <g
              onClick={(e) => {
                e.stopPropagation()
                centerOnPoint(chokepointPixels[0], chokepointPixels[1], 3.2)
              }}
              className="cursor-pointer"
            >
              <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="12" fill="rgba(245,158,11,0.3)" filter="url(#hq-glow-gold)" />
              <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="5" fill="#f59e0b" />
              <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="1.8" fill="#000000" />
            </g>

            {/* 8. Inland Logistics Hubs, Cross-Dock Centers, and Dry Ports */}
            {showHubs &&
              INLAND_LOGISTICS_HUBS.map((hub) => {
                const [hx, hy] = projectGeo(hub.gps)
                const isSelected = selectedHub?.id === hub.id
                return (
                  <g
                    key={hub.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedHub(hub)
                      centerOnPoint(hx, hy, 2.8)
                    }}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={hx}
                      cy={hy}
                      r={isSelected ? '12' : '7'}
                      fill={isSelected ? 'rgba(52,211,153,0.5)' : 'rgba(56,189,248,0.25)'}
                      filter="url(#hq-glow-emerald)"
                      className="transition-all duration-300"
                    />
                    <circle
                      cx={hx}
                      cy={hy}
                      r={isSelected ? '5.5' : '3.8'}
                      fill={isSelected ? '#34d399' : '#38bdf8'}
                      className="transition-all duration-300"
                    />
                    <circle cx={hx} cy={hy} r="1.5" fill="#020617" />
                    {/* Tooltip text on zoom */}
                    {transform.scale > 1.8 && (
                      <text
                        x={hx + 8}
                        y={hy + 3}
                        fill="#e2e8f0"
                        fontSize="7"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                      >
                        {hub.name[language]}
                      </text>
                    )}
                  </g>
                )
              })}

            {/* 9. 6G LEO Satellites Constellation */}
            {showSatellites &&
              LEO_SATELLITES.map((sat) => {
                const [sx, sy] = projectGeo([sat.lon, sat.lat])
                return (
                  <g key={sat.id} className="pointer-events-none">
                    <line
                      x1={sx}
                      y1={sy}
                      x2={sx}
                      y2={sy + 35}
                      stroke="rgba(168,85,247,0.35)"
                      strokeWidth="1.2"
                      strokeDasharray="2 3"
                    />
                    <circle cx={sx} cy={sy} r="9" fill="rgba(168,85,247,0.2)" />
                    <circle cx={sx} cy={sy} r="3" fill="#c084fc" />
                    <circle cx={sx} cy={sy} r="1" fill="#ffffff" />
                    <line x1={sx - 7} y1={sy} x2={sx - 3} y2={sy} stroke="#c084fc" strokeWidth="1.5" />
                    <line x1={sx + 3} y1={sy} x2={sx + 7} y2={sy} stroke="#c084fc" strokeWidth="1.5" />
                    {transform.scale > 1.5 && (
                      <text
                        x={sx + 10}
                        y={sy + 2}
                        fill="#d8b4fe"
                        fontSize="6.5"
                        fontFamily="monospace"
                        fontWeight="bold"
                        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                      >
                        {sat.name}
                      </text>
                    )}
                  </g>
                )
              })}

            {/* 10. Origin & Destination Strategic Inland Logistics Gateways */}
            {/* Origin Node */}
            <g
              onClick={(e) => {
                e.stopPropagation()
                if (activeCorridor.detailedWaypoints && activeCorridor.detailedWaypoints[0]) {
                  setSelectedWaypointNode(activeCorridor.detailedWaypoints[0])
                }
                centerOnPoint(originPixels[0], originPixels[1], 3.0)
              }}
              className="cursor-pointer"
            >
              <circle cx={originPixels[0]} cy={originPixels[1]} r="16" fill="rgba(6,182,212,0.3)" filter="url(#hq-glow-cyan)" />
              <circle cx={originPixels[0]} cy={originPixels[1]} r="6" fill="#06b6d4" />
              <circle cx={originPixels[0]} cy={originPixels[1]} r="2.5" fill="#ffffff" />
              <text
                x={originPixels[0] + 10}
                y={originPixels[1] - 8}
                fill="#ffffff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="800"
                className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
              >
                ORIGIN // {activeCorridor.originHub}
              </text>
            </g>

            {/* Destination Node */}
            <g
              onClick={(e) => {
                e.stopPropagation()
                if (activeCorridor.detailedWaypoints && activeCorridor.detailedWaypoints.length > 0) {
                  const last = activeCorridor.detailedWaypoints[activeCorridor.detailedWaypoints.length - 1]
                  setSelectedWaypointNode(last)
                }
                centerOnPoint(destPixels[0], destPixels[1], 3.0)
              }}
              className="cursor-pointer"
            >
              <circle cx={destPixels[0]} cy={destPixels[1]} r="16" fill="rgba(16,185,129,0.3)" filter="url(#hq-glow-emerald)" />
              <circle cx={destPixels[0]} cy={destPixels[1]} r="6" fill="#10b981" />
              <circle cx={destPixels[0]} cy={destPixels[1]} r="2.5" fill="#ffffff" />
              <text
                x={destPixels[0] + 10}
                y={destPixels[1] - 8}
                fill="#ffffff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="800"
                className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]"
              >
                DEST // {activeCorridor.destinationHub}
              </text>
            </g>

            {/* 11. Real-Time Moving Fleet Asset (Autonomous Heavy Truck & Connected Platoon) */}
            <g
              transform={`translate(${vehiclePos.x}, ${vehiclePos.y}) rotate(${vehiclePos.angle})`}
              className="pointer-events-none"
            >
              {/* Radar Detection Field Ring */}
              <circle cx="0" cy="0" r="22" fill="rgba(6,182,212,0.15)" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(56,189,248,0.4)" strokeWidth="0.8" />
              
              {/* Heavy Electric Freight Truck Asset */}
              <g filter="url(#hq-glow-cyan)">
                {/* Forward LiDAR Sensor Beam Cone */}
                <polygon points="14,0 32,-11 32,11" fill="rgba(6,182,212,0.18)" />
                {/* Aerodynamic Trailer */}
                <rect x="-18" y="-5" width="20" height="10" rx="1.5" fill="#0284c7" stroke="#ffffff" strokeWidth="1.2" />
                {/* Cab */}
                <polygon points="13,0 10,-4.5 2,-4.5 2,4.5 10,4.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" />
                {/* Windshield */}
                <rect x="5" y="-2.5" width="3" height="5" fill="#082f49" />
                {/* LED Headlight Beams */}
                <circle cx="13" cy="-2.5" r="1.5" fill="#ffffff" />
                <circle cx="13" cy="2.5" r="1.5" fill="#ffffff" />
              </g>

              {/* Core Center Pulse */}
              <circle cx="0" cy="0" r="2" fill="#ffffff" />
            </g>
          </g>
        </svg>

        {/* Live Simulation Floating Playback & Telemetry Controller */}
        <div
          className={`absolute bottom-4 ${isRTL ? 'right-4' : 'left-4'} z-20 flex flex-col gap-2 pointer-events-auto`}
        >
          {/* Real-Time Vehicle Status Floating Card */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-white/10 backdrop-blur-xl shadow-2xl flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
              <Navigation className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div className="font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">AUTONOMOUS DISPATCH</span>
                <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  LIVE
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                PROG: <span className="text-cyan-300 font-bold">{Math.round(fleetProgress * 100)}%</span> | SPEED:{' '}
                <span className="text-white font-bold">
                  {selectedModeId === 'electric-platoon' ? '95 KM/H (V2X PLATOON)' : '85 KM/H'}
                </span>
              </div>
            </div>

            {/* Playback & Speed Controls */}
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause Simulation' : 'Play Simulation'}
                className="p-1.5 rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  if (playbackSpeed === 1) setPlaybackSpeed(2)
                  else if (playbackSpeed === 2) setPlaybackSpeed(5)
                  else setPlaybackSpeed(1)
                }}
                className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-cyan-300 hover:bg-white/10 transition-colors flex items-center gap-1"
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
            onClick={zoomIn}
            title="Zoom In"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            title="Zoom Out"
            className="p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            title="Reset Map View"
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
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30 max-w-xs w-full p-4 rounded-2xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-2xl shadow-2xl text-white font-mono text-xs`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] text-cyan-400 font-bold uppercase">{selectedHub.country[language]}</span>
                  <h4 className="font-bold text-sm text-white">{selectedHub.name[language]}</h4>
                </div>
                <button
                  onClick={() => setSelectedHub(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">STATUS:</span>
                  <span className="text-emerald-400 font-bold">ONLINE (6G SYNC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">THROUGHPUT:</span>
                  <span className="text-white font-bold">{selectedHub.throughput}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CLEARANCE:</span>
                  <span className="text-cyan-300 font-bold">{selectedHub.clearanceTime}</span>
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
              className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-30 max-w-xs w-full p-4 rounded-2xl bg-slate-900/95 border border-emerald-500/40 backdrop-blur-2xl shadow-2xl text-white font-mono text-xs`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] text-emerald-400 font-bold uppercase">{selectedWaypointNode.status}</span>
                  <h4 className="font-bold text-sm text-white">{selectedWaypointNode.name}</h4>
                </div>
                <button
                  onClick={() => setSelectedWaypointNode(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300 border-t border-white/10 pt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">WEATHER:</span>
                  <span className="text-cyan-300 font-bold">{selectedWaypointNode.weather[language]}</span>
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
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span>AXLE LOAD: <strong className="text-white">{activeCorridor.axleLoadLimitT} TONS MAX</strong></span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>CLEARANCE: <strong className="text-cyan-300">{activeCorridor.clearanceHeightM}M HEIGHT</strong></span>
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
