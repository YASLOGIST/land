'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Truck,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Lock,
  Boxes,
  Network,
  Copy,
  CheckCircle2,
  X,
  Scale,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import ModelBadge from '@/components/ModelBadge'
import type {
  TransportModeOption,
  TransportModeId,
  CargoClassOption,
  CargoClassId,
  DispatchSimulationOutput,
} from '@/types/dispatch'
import type { WaypointDetail, RealTradeCorridor } from '@/types/dispatch-extended'
import { computeEta, type EtaSegmentId } from '@/lib/eta'
import { LAND_TRADE_CORRIDORS } from '@/data/landCorridors'
import { useGisPanZoom } from '@/hooks/useGisPanZoom'
import { HighQualityRealMap } from '@/components/dispatch/HighQualityRealMap'
import { RouteComparisonModal } from '@/components/dispatch/RouteComparisonModal'

import { t } from '@/lib/i18n'

type TrafficLightState = 'green' | 'yellow' | 'red'

/** Arabic labels for computeEta breakdown segments (telemetry labels stay
 *  English in the mono HUD, matching the corridor throughput strings). */
const SEGMENT_LABEL_AR: Record<EtaSegmentId, string> = {
  drive: 'قيادة الخط الرئيسي',
  'origin-gate-queue': 'طابور بوابة / ساحة المنشأ',
  weighbridge: 'فحص محطة الوزن',
  'driver-rest': 'راحات السائق المجدولة',
  'border-clearance': 'تخليص الحدود أو العبّارة',
  'incident-hold': 'توقف اضطراري معلن',
}

function formatSegmentMinutes(minutes: number): string {
  const rounded = Math.round(minutes)
  const h = Math.floor(rounded / 60)
  const m = rounded % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

const TRANSPORT_MODES: TransportModeOption[] = [
  {
    id: 'heavy-haul-ftl',
    icon: Truck,
    name: t('Autonomous Heavy Haulage (FTL Dedicated)', 'شحن الحمولات الكاملة المستقل (FTL)'),
    speedDescriptor: t('Direct Trunk Highway Corridor', 'ممر طريق سريع رئيسي مباشر'),
    efficiencyRating: '99.8% Uptime',
    baseCostPerTonKm: 0.14,
    baseSpeedKmh: 85,
    emissionsFactor: 0.018,
  },
  {
    id: 'ltl-crossdock',
    icon: Boxes,
    name: t('Intelligent Dynamic LTL & Cross-Dock Hubs', 'حمولات مجزأة ذكية ومراكز فرز (LTL)'),
    speedDescriptor: t('Consolidated Cross-Dock Routing', 'توجيه مجمع عبر أرصفة التفريغ المباشر'),
    efficiencyRating: '99.2% Fill Rate',
    baseCostPerTonKm: 0.09,
    baseSpeedKmh: 72,
    emissionsFactor: 0.014,
  },
  {
    id: 'electric-platoon',
    icon: Network,
    name: t('Connected V2X Electric Highway Platoon', 'قوافل الشاحنات الكهربائية المتصلة (V2X)'),
    speedDescriptor: t('Synchronized Aerodynamic Convoy', 'قافلة متزامنة ذات كفاءة هوائية عالية'),
    efficiencyRating: '94.8% ESG Score',
    baseCostPerTonKm: 0.12,
    baseSpeedKmh: 95,
    emissionsFactor: 0.009,
  },
  {
    id: 'electric-truck',
    icon: Zap,
    name: t('Autonomous Urban & Regional EV Fleet', 'أسطول الشاحنات الكهربائية الإقليمي'),
    speedDescriptor: t('Zero-Emission Regional Grid', 'شبكة إقليمية منعدمة الانبعاثات'),
    efficiencyRating: '97.5% Efficiency',
    baseCostPerTonKm: 0.11,
    baseSpeedKmh: 80,
    emissionsFactor: 0.005,
  },
]

const CARGO_CLASSES: CargoClassOption[] = [
  {
    id: 'pharma-coldchain',
    name: t('Temperature-Controlled Cold-Chain (Food & Pharma)', 'سلسلة تبريد متحكم بها (أغذية وأدوية)'),
    securityLevel: 'CLASS-A CRITICAL TEMP',
    tempClass: t('Active Cryo & Chilled (-20°C to +4°C)', 'تبريد نشط ومجمد (-20°م إلى +4°م)'),
    riskFactor: 1.2,
  },
  {
    id: 'high-tech-sealed',
    name: t('High-Value Sealed Electronic & Automotive Cargo', 'شحنات إلكترونية وقطع غيار مشفرة عالية القيمة'),
    securityLevel: 'TAMPER-EVIDENT SEAL + GPS',
    tempClass: t('Shock & Humidity Monitored', 'مراقبة الصدمات والرطوبة'),
    riskFactor: 1.15,
  },
  {
    id: 'fast-fmcg',
    name: t('Standard Palletized FMCG & Retail Goods', 'بضائع استهلاكية ومنصات قياسية (FMCG)'),
    securityLevel: 'STANDARD SMART TRACK',
    tempClass: t('Ambient Protected', 'حماية قياسية للبيئة المحيطة'),
    riskFactor: 0.95,
  },
  {
    id: 'heavy-industrial',
    name: t('Oversized Industrial & Construction Machinery', 'معدات صناعية وإنشائية ثقيلة وفائقة الأبعاد'),
    securityLevel: 'HEAVY AXLE CLEARANCE',
    tempClass: t('Heavy Cargo Tie-Down', 'تثبيت أحمال ثقيلة معتمد'),
    riskFactor: 1.3,
  },
  {
    id: 'hazardous-hazmat',
    name: t('Regulated Industrial Chemicals (HAZMAT Class 3/8)', 'مواد كيميائية صناعية خاضعة للرقابة (HAZMAT)'),
    securityLevel: 'HAZMAT REGULATORY COMPLIANT',
    tempClass: t('Vented / Thermal Shield', 'عزل حراري وتهوية أمان'),
    riskFactor: 1.4,
  },
]

export function CorridorDispatchSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme || 'dark'
  const isRTL = direction === 'rtl'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  // Core Simulation States
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>(LAND_TRADE_CORRIDORS[0].id)
  const [selectedModeId, setSelectedModeId] = useState<TransportModeId>('heavy-haul-ftl')
  const [selectedCargoId, setSelectedCargoId] = useState<CargoClassId>('pharma-coldchain')
  const [payloadTons, setPayloadTons] = useState<number>(24)
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false)
  const [manifestModalOpen, setManifestModalOpen] = useState<boolean>(false)
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false)
  const [copiedHash, setCopiedHash] = useState<boolean>(false)
  const [selectedWaypointNode, setSelectedWaypointNode] = useState<WaypointDetail | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)

  // Selected Active Data Objects
  const activeCorridor = useMemo(() => {
    return LAND_TRADE_CORRIDORS.find((c: RealTradeCorridor) => c.id === selectedCorridorId) || LAND_TRADE_CORRIDORS[0]
  }, [selectedCorridorId])

  const activeMode = useMemo(() => {
    return TRANSPORT_MODES.find((m) => m.id === selectedModeId) || TRANSPORT_MODES[0]
  }, [selectedModeId])

  const activeCargo = useMemo(() => {
    return CARGO_CLASSES.find((c) => c.id === selectedCargoId) || CARGO_CLASSES[0]
  }, [selectedCargoId])

  const trafficLightState: TrafficLightState = useMemo(() => {
    if (activeCorridor.riskScore.includes('RED') || activeCorridor.riskScore.includes('HIGH')) return 'red'
    if (activeCorridor.riskScore.includes('MONITORED') || activeCorridor.riskScore.includes('YELLOW')) return 'yellow'
    return 'green'
  }, [activeCorridor])

  // Directives Pan & Zoom State Hook
  const {
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
  } = useGisPanZoom({ minScale: 1.0, maxScale: 6.0 })

  // Calculation Engine — ETA comes from the pure computeEta module; the
  // corridor's declared segment figures (etaModel) feed it, so the total is
  // drive time + declared holds, and the band is the declared gate/border
  // spread. Departure = next half-hour boundary, model-side.
  const calculation = useMemo<DispatchSimulationOutput>(() => {
    const dist = activeCorridor.distanceKm
    const speed = activeMode.baseSpeedKmh

    const now = new Date()
    const departureMs = Math.ceil((now.getTime() + 2 * 3600_000) / (30 * 60_000)) * 30 * 60_000
    const eta = computeEta({
      distanceKm: dist,
      avgSpeedKmh: speed,
      gateQueueMin: activeCorridor.etaModel.gateQueueMin,
      gateQueueBandMin: activeCorridor.etaModel.gateQueueBandMin,
      weighbridgeMin: activeCorridor.etaModel.weighbridgeMin,
      restBreakMin: activeCorridor.etaModel.restBreakMin,
      borderHrs: activeCorridor.etaModel.borderHrs,
      borderBandHrs: activeCorridor.etaModel.borderBandHrs,
      departureTime: new Date(departureMs).toISOString(),
    })

    const totalRounded = Math.round(eta.totalMinutes)
    const days = Math.floor(totalRounded / (24 * 60))
    const hours = Math.floor((totalRounded % (24 * 60)) / 60)
    const minutes = totalRounded % 60
    let formattedDuration = ''
    if (days > 0) formattedDuration = `${days}d ${hours}h ${minutes}m`
    else if (hours > 0) formattedDuration = `${hours}h ${minutes}m`
    else formattedDuration = `${minutes}m`

    const baselineCo2 = dist * payloadTons * 0.16
    const actualCo2 = dist * payloadTons * activeMode.emissionsFactor
    const co2Saved = Math.max(0, Math.round(baselineCo2 - actualCo2))

    let fuelReduction = 28
    if (activeMode.id === 'electric-platoon') fuelReduction = 42
    if (activeMode.id === 'electric-truck') fuelReduction = 55
    if (activeMode.id === 'ltl-crossdock') fuelReduction = 34

    const cost = Math.round(dist * payloadTons * activeMode.baseCostPerTonKm * activeCargo.riskFactor)

    const rawSeed = `${activeCorridor.code}-${activeMode.id}-${activeCargo.id}-${payloadTons}`
    let hashNum = 0
    for (let i = 0; i < rawSeed.length; i++) {
      hashNum = (hashNum << 5) - hashNum + rawSeed.charCodeAt(i)
      hashNum |= 0
    }
    const hexHash = `0x9F8B${Math.abs(hashNum).toString(16).toUpperCase().padStart(12, 'E')}74C`

    const arrivalTimeFormatted = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(eta.etaIso))

    return {
      estimatedTimeFormatted: formattedDuration,
      etaVarianceFormatted:
        eta.confidenceBandMin > 0
          ? `±${eta.confidenceBandMin} MIN (MODELLED)`
          : 'NO DECLARED SPREAD (MODELLED)',
      arrivalTimeFormatted,
      co2SavedKg: Math.max(120, co2Saved),
      fuelReductionPercent: fuelReduction,
      costEstimateUsd: cost,
      cryptographicManifestHash: hexHash,
      meshNodePingMs: 0.4,
      eta,
    }
  }, [activeCorridor, activeMode, activeCargo, payloadTons])

  const handlePayloadChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    if (!isNaN(val)) {
      setPayloadTons(Math.max(1, Math.min(100, val)))
    }
  }, [])

  const handleCopyHash = useCallback(() => {
    navigator.clipboard?.writeText(calculation.cryptographicManifestHash)
    setCopiedHash(true)
    setTimeout(() => setCopiedHash(false), 2000)
  }, [calculation.cryptographicManifestHash])

  // Contextual Glassmorphic Tinting
  const contextualAura = useMemo(() => {
    if (trafficLightState === 'red') {
      return {
        cardBorder: 'border-rose-500/50',
        glow: 'shadow-[0_0_50px_rgba(244,63,94,0.25)]',
        accentText: 'text-rose-400',
        accentBg: 'bg-rose-500/10',
      }
    }
    if (trafficLightState === 'yellow') {
      return {
        cardBorder: 'border-amber-500/50',
        glow: 'shadow-[0_0_50px_rgba(245,158,11,0.25)]',
        accentText: 'text-amber-400',
        accentBg: 'bg-amber-500/10',
      }
    }
    if (selectedModeId === 'electric-platoon') {
      return {
        cardBorder: 'border-emerald-500/40',
        glow: 'shadow-[0_0_50px_rgba(16,185,129,0.18)]',
        accentText: 'text-emerald-300',
        accentBg: 'bg-emerald-500/10',
      }
    }
    return {
      cardBorder: 'border-gold-500/40',
      glow: 'shadow-[0_0_50px_rgba(232,179,23,0.2)]',
      accentText: 'text-gold-300',
      accentBg: 'bg-gold-500/10',
    }
  }, [trafficLightState, selectedModeId])

  // i18n Matrix
  const ui = {
    kicker: t('PREDICTIVE LAND LOGISTICS DIGITAL TWIN', 'التوأم الرقمي اللوجستي التنبؤي للنقل البري'),
    title: t('Autonomous Route & Highway Corridor Simulation', 'محاكاة مسارات الطرق السريعة والشحن البري في الوقت الفعلي'),
    subtitle: t(
      'Configure terrestrial trade corridors, monitor autonomous heavy haulage and electric platooning, and inspect cross-dock facilities with sub-second telemetry precision.',
      'اختر ممرات النقل البري الاستراتيجية، وتابع أساطيل الشاحنات الثقيلة والقوافل الكهربائية الذاتية، وافحص مراكز الفرز بدقة قياس آنية.',
    ),
    corridorLabel: t('Active Terrestrial Corridor', 'الممر البري النشط'),
    modeLabel: t('Transport Mode', 'نمط النقل البري'),
    cargoLabel: t('Cargo Specification', 'مواصفات ونوع الشحنة'),
    payloadLabel: t('Payload Weight', 'وزن الحمولة الإجمالي'),
    tonUnit: t('Tons', 'طن'),
    estTime: t('Est. Transit Time', 'زمن الوصول التقديري'),
    arrivalTime: t('Est. Arrival (Local Time)', 'الوصول المتوقع (بالتوقيت المحلي)'),
    etaVariance: t('ETA Variance', 'معدل التباين'),
    etaSegmentsTitle: t('ETA SEGMENTS — WHERE THE HOURS GO', 'بنود زمن الوصول — أين تذهب الساعات'),
    etaSegmentsHint: t(
      'Deterministic arithmetic from declared corridor figures. Drive + declared holds = total.',
      'حساب جبري محدد من أرقام الممر المعلنة. القيادة + التوقفات المعلنة = الإجمالي.',
    ),
    co2Saved: t('CO₂ Emissions Saved', 'انبعاثات الكربون المتفادية'),
    fuelSaved: t('Fleet Fuel Optimization', 'تحسين استهلاك الوقود'),
    estCost: t('Estimated Operational Cost', 'التكلفة التشغيلية التقديرية'),
    manifestHash: t('SHA-256 Shipment Manifest', 'بوليصة الشحن المشفرة SHA-256'),
    genManifestBtn: t('Generate Cryptographic Manifest', 'إصدار مانيفست شحن رقمي مشفر'),
    compareBtn: t('Compare Route Modalities', 'مقارنة أنماط الشحن البري'),
    close: t('Close', 'إغلاق'),
  }

  return (
    <section
      id="corridor-dispatch"
      dir={direction}
      className={`relative py-28 transition-colors duration-300 overflow-hidden ${
        mode === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'
      }`}
    >
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-tr from-gold-600/10 via-amber-600/10 to-transparent blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-300 font-mono text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(232,179,23,0.15)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{ui.kicker[language]}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-6">
            {ui.title[language]}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-sans">
            {ui.subtitle[language]}
          </p>

          {/* Dispatch outputs, ETAs and the manifest hash are computed from the
              controls on this page — a digital twin, not a live corridor. */}
          <div className="mt-5">
            <ModelBadge />
          </div>
        </div>

        {/* Main Dashboard Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Dispatch Control Panel (5 Columns) */}
          <div
            className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl bg-slate-900/80 border transition-all duration-500 shadow-2xl flex flex-col gap-6 ${contextualAura.cardBorder} ${contextualAura.glow}`}
          >
            {/* Control Header & Live Status */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-300">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wide">
                    {ui.corridorLabel[language]}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {activeCorridor.code} · {activeCorridor.distanceKm} KM
                  </span>
                </div>
              </div>

              <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${contextualAura.accentBg} ${contextualAura.accentText} border border-current`}>
                {activeCorridor.riskScore}
              </span>
            </div>

            {/* 1. Corridor Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase">
                {ui.corridorLabel[language]}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {LAND_TRADE_CORRIDORS.map((corridor: RealTradeCorridor) => (
                  <button
                    key={corridor.id}
                    onClick={() => setSelectedCorridorId(corridor.id)}
                    className={`w-full text-left p-3 rounded-2xl font-mono text-xs transition-all flex items-center justify-between border ${
                      selectedCorridorId === corridor.id
                        ? 'bg-gold-500/20 border-gold-400 text-white shadow-[0_0_20px_rgba(232,179,23,0.2)]'
                        : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-white">
                        {corridor.originCity[language]} → {corridor.destinationCity[language]}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {corridor.code} · {corridor.distanceKm} km · {corridor.axleLoadLimitT}T Axle
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-gold-300">
                      {corridor.railSlotTime.split('//')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Transport Mode Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase">
                {ui.modeLabel[language]}
              </label>
              <div className="grid grid-cols-1 gap-2">
                {TRANSPORT_MODES.map((modeItem) => {
                  const Icon = modeItem.icon
                  const isSelected = selectedModeId === modeItem.id
                  return (
                    <button
                      key={modeItem.id}
                      onClick={() => setSelectedModeId(modeItem.id)}
                      className={`p-3 rounded-2xl font-mono text-xs transition-all border flex items-center justify-between text-left ${
                        isSelected
                          ? 'bg-gradient-to-r from-gold-950/60 to-amber-950/60 border-gold-400 text-white shadow-[0_0_20px_rgba(232,179,23,0.2)]'
                          : 'bg-black/30 border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-gold-500 text-slate-950' : 'bg-white/5 text-slate-400'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-bold block text-white text-xs leading-tight">
                            {modeItem.name[language]}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {modeItem.speedDescriptor[language]} · {modeItem.baseSpeedKmh} KM/H
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {modeItem.efficiencyRating}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Cargo Class Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300 font-bold uppercase">
                {ui.cargoLabel[language]}
              </label>
              <select
                value={selectedCargoId}
                onChange={(e) => setSelectedCargoId(e.target.value as CargoClassId)}
                aria-label={ui.cargoLabel[language]}
                className="w-full p-3 rounded-2xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-gold-400 transition-colors"
              >
                {CARGO_CLASSES.map((cargo) => (
                  <option key={cargo.id} value={cargo.id} className="bg-slate-900 text-white">
                    {cargo.name[language]} ({cargo.securityLevel})
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Payload Weight Range Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 font-bold uppercase">{ui.payloadLabel[language]}</span>
                <span className="text-gold-300 font-bold text-sm">
                  {payloadTons} {ui.tonUnit[language]}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={payloadTons}
                onChange={handlePayloadChange}
                aria-label={ui.payloadLabel[language]}
                className="w-full h-2 bg-black/50 rounded-lg appearance-none cursor-pointer accent-gold-400"
              />
            </div>

            {/* 5. Calculated Outputs Strip — ETA from computeEta (MODELLED) */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/40 border border-white/10 font-mono text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">{ui.estTime[language]}</span>
                <span className="text-lg font-black text-gold-300">{calculation.estimatedTimeFormatted}</span>
                <span className="text-[9px] text-emerald-400 block">
                  {ui.arrivalTime[language]} {calculation.arrivalTimeFormatted} (MODELLED)
                </span>
                <span className="text-[9px] text-slate-400 block">{calculation.etaVarianceFormatted}</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">{ui.estCost[language]}</span>
                <span className="text-lg font-black text-white">${calculation.costEstimateUsd.toLocaleString()}</span>
                <span className="text-[9px] text-slate-400 block">EST. OPERATIONAL RATE</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">{ui.co2Saved[language]}</span>
                <span className="text-sm font-bold text-emerald-400">-{calculation.co2SavedKg} KG</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 block">{ui.fuelSaved[language]}</span>
                <span className="text-sm font-bold text-gold-300">+{calculation.fuelReductionPercent}% ESG GAIN</span>
              </div>
            </div>

            {/* 5b. ETA breakdown — where the hours go (MODELLED) */}
            <div className="p-4 rounded-2xl bg-black/40 border border-gold-500/15 font-mono text-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold text-gold-300 uppercase tracking-wider">
                  {ui.etaSegmentsTitle[language]}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/30 text-amber-200/90 text-[8px] font-bold">
                  MODELLED
                </span>
              </div>
              <p className="text-[9px] text-slate-500 mb-2">{ui.etaSegmentsHint[language]}</p>
              <div className="space-y-1">
                {calculation.eta.breakdown.map((segment) => (
                  <div
                    key={segment.id}
                    className="flex items-center justify-between gap-2 border-b border-white/[0.04] pb-1 last:border-0"
                  >
                    <span className="text-[10px] text-slate-300">
                      {segment.label}
                      <span className="block text-[8px] text-slate-500">
                        {SEGMENT_LABEL_AR[segment.id]}
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-white whitespace-nowrap">
                      {formatSegmentMinutes(segment.minutes)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2 pt-1.5">
                  <span className="text-[10px] font-bold text-gold-300">TOTAL (MODELLED)</span>
                  <span className="text-[12px] font-black text-gold-300">
                    {formatSegmentMinutes(calculation.eta.totalMinutes)}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Cryptographic Manifest Hash Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-gold-500/20 flex items-center justify-between gap-2 font-mono text-xs">
              <div className="overflow-hidden">
                <span className="text-[9px] text-slate-400 uppercase block">{ui.manifestHash[language]}</span>
                <span className="text-[11px] text-gold-300 font-bold truncate block">
                  {calculation.cryptographicManifestHash}
                </span>
              </div>
              <button
                onClick={handleCopyHash}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Copy SHA-256 Seal"
                aria-label="Copy SHA-256 Manifest Hash"
              >
                {copiedHash ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => setManifestModalOpen(true)}
                className="w-full py-3.5 px-6 rounded-2xl font-mono text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-gold-500 to-amber-600 text-slate-950 hover:from-gold-400 hover:to-amber-500 transition-all shadow-[0_0_25px_rgba(232,179,23,0.4)] flex items-center justify-center gap-2 group"
              >
                <Lock className="w-4 h-4" />
                <span>{ui.genManifestBtn[language]}</span>
                <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setCompareModalOpen(true)}
                className="w-full py-3 px-5 rounded-2xl font-mono text-xs font-bold border border-white/10 bg-slate-900/90 text-gold-300 hover:bg-slate-800 hover:border-gold-400/40 transition-all flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4 text-gold-400" />
                <span>{ui.compareBtn[language]}</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Quality Real Map & Live Simulation Telemetry (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Real Map Canvas */}
            <HighQualityRealMap
              activeCorridor={activeCorridor}
              selectedModeId={selectedModeId}
              trafficLightState={trafficLightState}
              showHeatmap={showHeatmap}
              setShowHeatmap={setShowHeatmap}
              isFullscreen={isFullscreen}
              setIsFullscreen={setIsFullscreen}
              language={language}
              isRTL={isRTL}
              selectedWaypointNode={selectedWaypointNode}
              setSelectedWaypointNode={setSelectedWaypointNode}
              transform={transform}
              isDragging={isDragging}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUp={handleMouseUp}
              handleTouchStart={handleTouchStart}
              handleTouchMove={handleTouchMove}
              handleTouchEnd={handleTouchEnd}
              handleWheel={handleWheel}
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              resetView={resetView}
              centerOnPoint={centerOnPoint}
              meshNodePingMs={calculation.meshNodePingMs}
              simSpeedKmh={activeMode.baseSpeedKmh}
            />

            {/* Strategic Waypoint Quick Selection Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeCorridor.detailedWaypoints?.slice(0, 4).map((wp: WaypointDetail, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedWaypointNode(wp)}
                  className={`p-3 rounded-2xl border text-left font-mono text-xs transition-all backdrop-blur-xl ${
                    selectedWaypointNode?.name === wp.name
                      ? 'bg-gold-500/20 border-gold-400 text-white shadow-lg'
                      : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="text-[9px] text-gold-400 font-bold block">{wp.status}</span>
                  <span className="font-bold text-white text-[11px] truncate block">{wp.name}</span>
                  <span className="text-[9px] text-slate-400 block truncate">{wp.throughputIndex}</span>
                </button>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Route Modality Benchmark Comparison Modal */}
      <RouteComparisonModal
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        activeCorridor={activeCorridor}
        payloadTons={payloadTons}
        language={language}
        isRTL={isRTL}
      />

      {/* Manifest Certificate Modal */}
      <AnimatePresence>
        {manifestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setManifestModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-gold-500/40 bg-slate-900/95 shadow-[0_0_80px_rgba(232,179,23,0.25)] text-white"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-black tracking-tight">YASLOGIST SHIPMENT MANIFEST HASH</h3>
                </div>
                <button
                  onClick={() => setManifestModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px]">CORRIDOR:</span>
                    <strong className="text-white">{activeCorridor.code}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ROUTING:</span>
                    <strong className="text-gold-300">{activeCorridor.originCity[language]} → {activeCorridor.destinationCity[language]}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">TRANSPORT MODE:</span>
                    <strong className="text-white">{activeMode.name[language]}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CARGO & PAYLOAD:</span>
                    <strong className="text-white">{payloadTons} TONS · {activeCargo.name[language]}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-gold-950/30 border border-gold-500/30">
                  <span className="text-[10px] text-gold-400 font-bold block mb-1">SHA-256 DIGITAL AUDIT SEAL:</span>
                  <p className="font-mono text-xs text-white break-all">{calculation.cryptographicManifestHash}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setManifestModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs hover:bg-gold-400 transition-colors"
                >
                  {ui.close[language]}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default CorridorDispatchSection
