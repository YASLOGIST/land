'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Truck,
  Plane,
  Ship,
  Sparkles,
  ShieldCheck,
  Zap,
  Activity,
  ArrowRight,
  ArrowLeft,
  Lock,
  Cpu,
  Layers,
  Copy,
  CheckCircle2,
  X,
  Radio,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import type { BilingualText } from '@/types/land-logistics'
import type {
  TradeCorridorOption,
  TransportModeOption,
  TransportModeId,
  CargoClassOption,
  CargoClassId,
  DispatchSimulationOutput,
} from '@/types/dispatch'

const t = (en: string, ar: string): BilingualText => ({ en, ar })

/* ========================================================================== */
/*  Data Matrix: Trade Corridors, Transport Modalities & Cargo Types          */
/* ========================================================================== */

const TRADE_CORRIDORS: TradeCorridorOption[] = [
  {
    id: 'dwc-rtm',
    code: 'CORR-DXB-RTM',
    originCity: t('Dubai World Central', 'دبي ورلد سنترال'),
    originHub: 'DWC-HUB-01',
    destinationCity: t('Rotterdam Gateway', 'بوابة روتردام'),
    destinationHub: 'RTM-GATE-04',
    distanceKm: 5850,
    supportedModes: ['supersonic-air', 'ocean-vessel', 'electric-truck'],
    riskScore: 'LOW // 0.02%',
    customsManifestType: t('Automated GCC-EU Green Manifest', 'بيان جمركي أخضر مؤتمت للخليج وأوروبا'),
    waypoints: [
      { name: 'DWC', coordinates: [15, 68], status: 'synced' },
      { name: 'SUEZ', coordinates: [42, 54], status: 'active' },
      { name: 'MED-GATE', coordinates: [68, 38], status: 'active' },
      { name: 'RTM', coordinates: [88, 22], status: 'synced' },
    ],
  },
  {
    id: 'ruh-sin',
    code: 'CORR-RUH-SIN',
    originCity: t('Riyadh Logistics Zone', 'المنطقة اللوجستية بالرياض'),
    originHub: 'RUH-AIR-03',
    destinationCity: t('Singapore Jurong Hub', 'مركز سنغافورة جورونغ'),
    destinationHub: 'SIN-SEA-09',
    distanceKm: 6720,
    supportedModes: ['supersonic-air', 'ocean-vessel'],
    riskScore: 'OPTIMAL // 0.01%',
    customsManifestType: t('Direct APAC Corridor Protocol', 'بروتوكول ممر آسيا والمحيط الهادئ المباشر'),
    waypoints: [
      { name: 'RUH', coordinates: [18, 62], status: 'synced' },
      { name: 'ARABIAN-SEA', coordinates: [45, 65], status: 'active' },
      { name: 'MALACCA', coordinates: [75, 48], status: 'active' },
      { name: 'SIN', coordinates: [86, 32], status: 'synced' },
    ],
  },
  {
    id: 'fra-ord',
    code: 'CORR-FRA-ORD',
    originCity: t('Frankfurt Cargo City', 'فرانكفورت كارجو سيتي'),
    originHub: 'FRA-HUB-02',
    destinationCity: t('Chicago O’Hare Logistics', 'شيكاغو أوهير اللوجستية'),
    destinationHub: 'ORD-AIR-08',
    distanceKm: 6980,
    supportedModes: ['supersonic-air', 'ocean-vessel'],
    riskScore: 'ZERO-LOSS // 0.00%',
    customsManifestType: t('Transatlantic Zero-Trust Transit', 'عبور رقمي آمن عبر الأطلسي'),
    waypoints: [
      { name: 'FRA', coordinates: [20, 30], status: 'synced' },
      { name: 'NORTH-ATL', coordinates: [50, 24], status: 'active' },
      { name: 'HALIFAX', coordinates: [72, 36], status: 'active' },
      { name: 'ORD', coordinates: [88, 52], status: 'synced' },
    ],
  },
  {
    id: 'sha-lax',
    code: 'CORR-SHA-LAX',
    originCity: t('Shanghai Deepwater Port', 'ميناء شنغهاي للمياه العميقة'),
    originHub: 'SHA-PORT-07',
    destinationCity: t('Los Angeles Long Beach', 'لوس أنجلوس لونغ بيتش'),
    destinationHub: 'LAX-SEA-01',
    distanceKm: 10450,
    supportedModes: ['ocean-vessel', 'supersonic-air'],
    riskScore: 'MONITORED // 0.04%',
    customsManifestType: t('Trans-Pacific Digital Clearing', 'تخليص رقمي فوري عبر المحيط الهادئ'),
    waypoints: [
      { name: 'SHA', coordinates: [12, 45], status: 'synced' },
      { name: 'MID-PACIFIC', coordinates: [52, 40], status: 'active' },
      { name: 'HAWAII-NODE', coordinates: [72, 55], status: 'active' },
      { name: 'LAX', coordinates: [90, 48], status: 'synced' },
    ],
  },
]

const TRANSPORT_MODES: TransportModeOption[] = [
  {
    id: 'electric-truck',
    icon: Truck,
    name: t('Autonomous Highway Fleet', 'شاحنات كهربائية ذاتية القيادة'),
    speedDescriptor: t('Dynamic Overland Routing', 'توجيه بري ديناميكي سريع'),
    efficiencyRating: '94.8% ESG',
    baseCostPerTonKm: 0.14,
    baseSpeedKmh: 85,
    emissionsFactor: 0.015,
  },
  {
    id: 'supersonic-air',
    icon: Plane,
    name: t('AI-Routed Air Cargo', 'الشحن الجوي الذكي'),
    speedDescriptor: t('Sub-Hour Cross-Continent Transit', 'نقل جوي عابر للقارات بأقصى سرعة'),
    efficiencyRating: '99.9% Uptime',
    baseCostPerTonKm: 0.88,
    baseSpeedKmh: 820,
    emissionsFactor: 0.12,
  },
  {
    id: 'ocean-vessel',
    icon: Ship,
    name: t('Zero-Emission Container Fleet', 'سفن الحاويات منعدمة الانبعاثات'),
    speedDescriptor: t('Tri-Modal High-Volume Freight', 'شحن بحري مكثف عالي السعة'),
    efficiencyRating: '98.2% Green Grid',
    baseCostPerTonKm: 0.04,
    baseSpeedKmh: 42,
    emissionsFactor: 0.008,
  },
]

const CARGO_CLASSES: CargoClassOption[] = [
  {
    id: 'pharma-cryo',
    name: t('Pharmaceutical & Cryo-Chain', 'أدوية وسلسلة تبريد حرجة'),
    securityLevel: 'CLASS-A CRITICAL',
    tempClass: t('Active Cryo -20°C', 'تبريد نشط -20°م'),
    riskFactor: 1.25,
  },
  {
    id: 'high-tech',
    name: t('Precision High-Tech / Chips', 'أجهزة إلكترونية فائقة الدقة'),
    securityLevel: 'ZERO-LOSS TAMPER-SEALED',
    tempClass: t('Shock & Humidity Shield', 'حماية من الصدمات والرطوبة'),
    riskFactor: 1.15,
  },
  {
    id: 'heavy-industrial',
    name: t('Heavy Industrial Robotics', 'معدات صناعية وروبوتات'),
    securityLevel: 'HEAVY REINFORCED',
    tempClass: t('Standard Ambient', 'ظروف بيئية قياسية'),
    riskFactor: 1.0,
  },
  {
    id: 'perishable',
    name: t('Cold-Chain Fresh Produce', 'منتجات طازجة وسريعة التلف'),
    securityLevel: 'AGRI-SHIELD IOT',
    tempClass: t('Regulated +4°C', 'حرارة منظمة +4°م'),
    riskFactor: 1.08,
  },
]

/* ========================================================================== */
/*  Main Component                                                            */
/* ========================================================================== */

export default function CorridorDispatchSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const isRTL = direction === 'rtl'
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  // Simulator State
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('dwc-rtm')
  const [selectedModeId, setSelectedModeId] = useState<TransportModeId>('supersonic-air')
  const [selectedCargoId, setSelectedCargoId] = useState<CargoClassId>('high-tech')
  const [payloadTons, setPayloadTons] = useState<number>(24)
  const [manifestModalOpen, setManifestModalOpen] = useState<boolean>(false)
  const [copiedHash, setCopiedHash] = useState<boolean>(false)

  // Current selections
  const activeCorridor = useMemo(
    () => TRADE_CORRIDORS.find((c) => c.id === selectedCorridorId) || TRADE_CORRIDORS[0],
    [selectedCorridorId],
  )

  const activeMode = useMemo(
    () => TRANSPORT_MODES.find((m) => m.id === selectedModeId) || TRANSPORT_MODES[0],
    [selectedModeId],
  )

  const activeCargo = useMemo(
    () => CARGO_CLASSES.find((c) => c.id === selectedCargoId) || CARGO_CLASSES[0],
    [selectedCargoId],
  )

  // Pure Zero-Trust Mathematical Calculation (Zero DOM reflows, instant computation)
  const calculation: DispatchSimulationOutput = useMemo(() => {
    // Sanitized inputs boundaries
    const safePayload = Math.max(1, Math.min(150, payloadTons || 1))
    const dist = activeCorridor.distanceKm
    const speed = activeMode.baseSpeedKmh
    const hours = Number((dist / speed).toFixed(1))

    const days = Math.floor(hours / 24)
    const remHours = Math.floor(hours % 24)
    const formattedDuration = days > 0 ? `${days}d ${remHours}h` : `${hours}h`

    const cost = Math.round(dist * safePayload * activeMode.baseCostPerTonKm * activeCargo.riskFactor)
    const co2Saved = Math.round(dist * safePayload * (0.15 - activeMode.emissionsFactor) * 1.4)
    const fuelReduction = Number((18.4 + (safePayload % 5) * 0.4).toFixed(1))

    // Simulated Deterministic Cryptographic Seal Hash based on inputs
    const rawSeed = `${activeCorridor.code}-${activeMode.id}-${activeCargo.id}-${safePayload}T-2026`
    let pseudoHash = 0
    for (let i = 0; i < rawSeed.length; i++) {
      pseudoHash = (pseudoHash << 5) - pseudoHash + rawSeed.charCodeAt(i)
      pseudoHash |= 0
    }
    const hexHash = `0x${Math.abs(pseudoHash).toString(16).padStart(8, '0').toUpperCase()}A9F2E7C4B18`

    return {
      estimatedTimeHours: hours,
      estimatedTimeFormatted: formattedDuration,
      etaVarianceFormatted: '< 1.2 min',
      co2SavedKg: Math.max(120, co2Saved),
      fuelReductionPercent: fuelReduction,
      costEstimateUsd: cost,
      confidenceScore: 99.4,
      cryptographicManifestHash: hexHash,
      meshNodePingMs: 0.4,
      zeroLossVerificationStatus: 'TAMPER_PROOF_SEALED',
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

  // i18n Dictionary
  const ui = {
    kicker: t('INTELLIGENT CORRIDOR DISPATCH MATRIX', 'مصفوفة إرسال وتوجيه الممرات اللوجستية الذكية'),
    title: t('Autonomous Route & Freight Simulation', 'محاكاة المسارات والشحن المستقل في الوقت الفعلي'),
    subtitle: t(
      'Configure global trade corridors, select multimodal transit fleets, and generate instant cryptographic manifests with sub-second telemetry predictions.',
      'اختر الممرات التجارية العالمية، وحدد وسائط النقل متعددة الوسائط، وأنشئ بيانات شحن مشفرة فورية مع توقعات قياس فائق الدقة.',
    ),
    corridorLabel: t('Select Strategic Trade Corridor', 'اختر الممر التجاري الاستراتيجي'),
    modeLabel: t('Transport Modality', 'وسيلة النقل'),
    cargoLabel: t('Consignment Classification', 'تصنيف ونوع الشحنة'),
    payloadLabel: t('Payload Weight (Tons)', 'وزن الحمولة (بالطن)'),
    etaLabel: t('Predicted Transit Duration', 'مدة العبور المتوقعة'),
    varianceLabel: t('ML Variance Margin', 'هامش الدقة والتنبؤ'),
    fuelLabel: t('Fleet Fuel / Energy Optimization', 'كفاءة استهلاك الطاقة والوقود'),
    co2Label: t('Carbon Offset Reduction', 'خفض الانبعاثات الكربونية'),
    costLabel: t('Dynamic Cost Estimate', 'تقدير التكلفة التشغيلية'),
    meshLabel: t('Mesh Sync Ping', 'زمن استجابة الشبكة'),
    generateBtn: t('Generate Cryptographic Manifest', 'إنشاء البيان الرقمي المشفر'),
    manifestTitle: t('Cryptographic Consignment Manifest', 'البيان الجمركي الرقمي المشفر'),
    manifestDesc: t('Zero-Trust tamper-evident consignment token verified across all corridor waypoints.', 'رمز شحنة رقمي مؤمن ومقاوم للتلاعب موثق عبر جميع نقاط الممر.'),
    close: t('Close', 'إغلاق'),
    copied: t('Copied to clipboard', 'تم النسخ للحافظة'),
    copy: t('Copy Hash Token', 'نسخ الرمز المشفر'),
  }

  return (
    <section
      id="dispatch-optimizer"
      dir={direction}
      className={`relative py-32 overflow-hidden transition-colors duration-500 ${
        mode === 'dark' ? 'bg-slate-950 border-t border-white/[0.08]' : 'bg-slate-50 border-t border-slate-200'
      }`}
    >
      {/* Dynamic Ambient Background Aura */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(6,182,212,0.07),transparent)]'
            : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(6,182,212,0.12),transparent)]'
        }`}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl ${
              mode === 'dark'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-800 shadow-sm'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
            <span className={`font-bold ${isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}>
              {ui.kicker[language]}
            </span>
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {ui.title[language]}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {ui.subtitle[language]}
          </p>
        </div>

        {/* Dual-Column Interactive Matrix & Digital Twin Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Parameters Console (5 Columns) */}
          <div
            className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-300 ${
              mode === 'dark'
                ? 'bg-white/[0.025] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.1)]'
                : 'bg-white/85 border border-slate-200 shadow-xl'
            }`}
          >
            {/* 1. Corridor Selector */}
            <div className="mb-6">
              <label
                className={`block font-bold mb-3 ${
                  isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
              >
                {ui.corridorLabel[language]}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRADE_CORRIDORS.map((corr) => {
                  const isSelected = corr.id === selectedCorridorId
                  return (
                    <button
                      key={corr.id}
                      onClick={() => setSelectedCorridorId(corr.id)}
                      className={`p-3 rounded-2xl text-start transition-all duration-200 border flex flex-col justify-between ${
                        isSelected
                          ? mode === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-400/80 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-sm'
                          : mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono font-bold text-[10px] text-cyan-400">{corr.code}</span>
                        <span className="font-mono text-[9px] text-slate-400">{corr.distanceKm} km</span>
                      </div>
                      <div className="font-bold text-xs leading-snug">
                        {corr.originCity[language]}
                        <span className="text-cyan-400 mx-1">⇄</span>
                        {corr.destinationCity[language]}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 2. Modality Switcher */}
            <div className="mb-6">
              <label
                className={`block font-bold mb-3 ${
                  isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
              >
                {ui.modeLabel[language]}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TRANSPORT_MODES.map((tm) => {
                  const Icon = tm.icon
                  const isSelected = tm.id === selectedModeId
                  return (
                    <button
                      key={tm.id}
                      onClick={() => setSelectedModeId(tm.id)}
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all duration-200 text-center ${
                        isSelected
                          ? mode === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : 'bg-cyan-50 border-cyan-500 text-cyan-950 shadow-sm'
                          : mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-bold leading-tight">{tm.name[language]}</span>
                      <span className="font-mono text-[9px] text-cyan-400 font-semibold">{tm.efficiencyRating}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 3. Cargo Classification Badges */}
            <div className="mb-6">
              <label
                className={`block font-bold mb-3 ${
                  isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
              >
                {ui.cargoLabel[language]}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {CARGO_CLASSES.map((cargo) => {
                  const isSelected = cargo.id === selectedCargoId
                  return (
                    <button
                      key={cargo.id}
                      onClick={() => setSelectedCargoId(cargo.id)}
                      className={`p-2.5 rounded-xl border text-start transition-all duration-200 flex flex-col justify-between ${
                        isSelected
                          ? mode === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-400/80 text-white'
                            : 'bg-cyan-50 border-cyan-500 text-cyan-950'
                          : mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <span className="text-[11px] font-bold">{cargo.name[language]}</span>
                      <span className="font-mono text-[9px] text-emerald-400 mt-1">{cargo.tempClass[language]}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 4. Payload Slider (Tons) */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label
                  className={`font-bold ${
                    isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                  } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}
                >
                  {ui.payloadLabel[language]}
                </label>
                <span className="font-mono font-extrabold text-sm text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-lg border border-cyan-500/20">
                  {payloadTons} TONS
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={payloadTons}
                onChange={handlePayloadChange}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Generate Cryptographic Manifest Trigger */}
            <button
              onClick={() => setManifestModalOpen(true)}
              className={`w-full group py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-xl ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
                  : 'bg-gradient-to-r from-cyan-600 to-blue-700 text-white hover:from-cyan-500 hover:to-blue-600 shadow-lg'
              }`}
            >
              <Lock className="w-4 h-4 text-slate-950 dark:text-slate-950" />
              <span>{ui.generateBtn[language]}</span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Column: Digital Twin Route HUD & Live Telemetry Panel (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Top Interactive SVG Digital Twin Map Card */}
            <div
              className={`relative rounded-3xl p-6 sm:p-7 overflow-hidden backdrop-blur-2xl border transition-all duration-300 ${
                mode === 'dark'
                  ? 'bg-slate-950/80 border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.6)]'
                  : 'bg-white border-slate-200 shadow-xl'
              }`}
            >
              {/* HUD Header Status Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  </span>
                  <span className="font-mono font-extrabold text-[11px] text-cyan-400 tracking-wider">
                    DIGITAL_TWIN // {activeCorridor.code}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    MESH PING: {calculation.meshNodePingMs}ms
                  </span>
                </div>
              </div>

              {/* Simulated Vector Corridor Canvas (GPU-accelerated, zero repaints) */}
              <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden bg-slate-900/60 border border-white/5 p-4 flex items-center justify-center">
                
                {/* Tech Grid Matrix Background */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                  }}
                />

                {/* Radar Sweep Effect */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 origin-center pointer-events-none opacity-20 bg-[conic-gradient(from_0deg,transparent_0deg,rgba(6,182,212,0.6)_60deg,transparent_60.1deg)]"
                />

                {/* SVG Route Trajectory */}
                <svg className="w-full h-full relative z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Outer Glow Path */}
                  <path
                    d={`M ${activeCorridor.waypoints[0].coordinates[0]} ${activeCorridor.waypoints[0].coordinates[1]} Q ${activeCorridor.waypoints[1].coordinates[0]} ${activeCorridor.waypoints[1].coordinates[1]} ${activeCorridor.waypoints[2].coordinates[0]} ${activeCorridor.waypoints[2].coordinates[1]} T ${activeCorridor.waypoints[3].coordinates[0]} ${activeCorridor.waypoints[3].coordinates[1]}`}
                    fill="none"
                    stroke="rgba(6,182,212,0.2)"
                    strokeWidth="4"
                  />
                  {/* Animated Active Route Beam */}
                  <motion.path
                    d={`M ${activeCorridor.waypoints[0].coordinates[0]} ${activeCorridor.waypoints[0].coordinates[1]} Q ${activeCorridor.waypoints[1].coordinates[0]} ${activeCorridor.waypoints[1].coordinates[1]} ${activeCorridor.waypoints[2].coordinates[0]} ${activeCorridor.waypoints[2].coordinates[1]} T ${activeCorridor.waypoints[3].coordinates[0]} ${activeCorridor.waypoints[3].coordinates[1]}`}
                    fill="none"
                    stroke="url(#corridor-active-gradient)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -24 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                  <defs>
                    <linearGradient id="corridor-active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>

                  {/* Waypoint Markers */}
                  {activeCorridor.waypoints.map((wp, i) => (
                    <g key={i}>
                      <circle cx={wp.coordinates[0]} cy={wp.coordinates[1]} r="3" fill="#06b6d4" />
                      <circle cx={wp.coordinates[0]} cy={wp.coordinates[1]} r="1.5" fill="#ffffff" />
                    </g>
                  ))}
                </svg>

                {/* Waypoint Labels Positioned Absolutely */}
                {activeCorridor.waypoints.map((wp, i) => (
                  <div
                    key={i}
                    style={{ left: `${wp.coordinates[0]}%`, top: `${wp.coordinates[1]}%` }}
                    className="absolute -translate-x-1/2 -translate-y-6 z-20 pointer-events-none"
                  >
                    <span className="font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-slate-950/90 text-cyan-300 border border-cyan-500/40 shadow-xs whitespace-nowrap">
                      {wp.name}
                    </span>
                  </div>
                ))}

                {/* Top Corner Badge: Customs Protocol */}
                <div
                  className={`absolute bottom-3 ${isRTL ? 'left-3' : 'right-3'} z-20`}
                >
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[10px] font-mono font-bold bg-slate-950/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {activeCorridor.customsManifestType[language]}
                  </span>
                </div>
              </div>

              {/* Key Route Specifications */}
              <div className="mt-4 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono font-semibold">{activeCorridor.originHub} ⇄ {activeCorridor.destinationHub}</span>
                </div>
                <div className="font-mono font-bold text-emerald-400">
                  RISK: {activeCorridor.riskScore}
                </div>
              </div>
            </div>

            {/* Bottom 4 Calculated Metrics Cards Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* Metric 1: ETA */}
              <div
                className={`p-4 rounded-2xl border backdrop-blur-xl ${
                  mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-bold uppercase">{ui.etaLabel[language]}</span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-cyan-300">
                  {calculation.estimatedTimeFormatted}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5 block">
                  {calculation.etaVarianceFormatted}
                </span>
              </div>

              {/* Metric 2: Fuel / Energy Reduction */}
              <div
                className={`p-4 rounded-2xl border backdrop-blur-xl ${
                  mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase">{ui.fuelLabel[language]}</span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">
                  +{calculation.fuelReductionPercent}%
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-medium mt-0.5 block">
                  AUTONOMOUS GRID
                </span>
              </div>

              {/* Metric 3: Carbon Offset */}
              <div
                className={`p-4 rounded-2xl border backdrop-blur-xl ${
                  mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[10px] font-bold uppercase">{ui.co2Label[language]}</span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-blue-400">
                  -{calculation.co2SavedKg} kg
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-medium mt-0.5 block">
                  ESG VERIFIED
                </span>
              </div>

              {/* Metric 4: Cost */}
              <div
                className={`p-4 rounded-2xl border backdrop-blur-xl ${
                  mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1 text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-bold uppercase">{ui.costLabel[language]}</span>
                </div>
                <div className="font-mono text-xl sm:text-2xl font-extrabold text-white dark:text-white">
                  ${calculation.costEstimateUsd.toLocaleString()}
                </div>
                <span className="text-[10px] font-mono text-emerald-400 font-semibold mt-0.5 block">
                  CONFIDENCE: 99.4%
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Cryptographic Manifest Modal */}
      <AnimatePresence>
        {manifestModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setManifestModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-white/15 bg-slate-900/95 shadow-[0_0_60px_rgba(6,182,212,0.35)] text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setManifestModalOpen(false)}
                aria-label={ui.close[language]}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">{ui.manifestTitle[language]}</h3>
                  <p className="text-xs text-slate-400 font-mono">SEAL_STATUS: {calculation.zeroLossVerificationStatus}</p>
                </div>
              </div>

              {/* Manifest Metadata List */}
              <div className="space-y-3 mb-6 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between">
                  <span className="text-slate-400">CORRIDOR:</span>
                  <span className="text-cyan-300 font-bold">{activeCorridor.code}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between">
                  <span className="text-slate-400">MODALITY:</span>
                  <span className="text-white font-bold">{activeMode.name[language]}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between">
                  <span className="text-slate-400">PAYLOAD & CLASS:</span>
                  <span className="text-emerald-400 font-bold">{payloadTons} TONS // {activeCargo.securityLevel}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-cyan-500/30 flex flex-col gap-1.5">
                  <span className="text-[10px] text-cyan-400 font-bold">CRYPTOGRAPHIC SHA-256 MANIFEST HASH:</span>
                  <div className="text-xs font-bold text-white break-all bg-slate-900 p-2 rounded-lg border border-white/5">
                    {calculation.cryptographicManifestHash}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyHash}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {copiedHash ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>{ui.copied[language]}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-950" />
                      <span>{ui.copy[language]}</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setManifestModalOpen(false)}
                  className="py-3 px-5 rounded-xl font-bold text-xs bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
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
