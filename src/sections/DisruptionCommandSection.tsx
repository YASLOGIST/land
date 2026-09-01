'use client'

/**
 * DisruptionCommandSection — YASLOGIST 6G Interactive AI Crisis Disruption Engine
 *
 * Directives:
 * 1. Immersive Fullscreen Mode (The "Crisis Command View"):
 *    - Maximize/Minimize toggle in the HUD header.
 *    - Fixed 100vw/100vh viewport transition with backdrop-blur-3xl and Escape listener.
 * 2. Interactive Pan, Zoom & Center-on-Click Physics:
 *    - Fluid drag-to-pan, inertia-based wheel zooming (1.0x to 6.0x), and on-screen zoom HUD.
 *    - On-Click Spatial Navigation: Clicking any incident chokepoint smoothly animates
 *      and centers the viewport directly onto that coordinate's bounding box.
 * 3. Contextual Data HUDs (Incident Telemetry on Click):
 *    - Interactive glassmorphic tooltip linked to the active incident coordinate displaying
 *      localized crisis severity, meteorology, holding hours, and bypass readiness.
 * 4. True Cartographic GIS Engine (1000x500 WGS-84 Equirectangular Natural Earth Dataset).
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  AlertTriangle,
  Zap,
  ShieldCheck,
  Truck,
  RotateCw,
  ArrowRight,
  ArrowLeft,
  X,
  Copy,
  CheckCircle2,
  Terminal,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RotateCcw,
  Boxes,
  Network,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import type { BilingualText } from '@/types/land-logistics'
import type {
  DisruptionScenarioOption,
  StrategyModeId,
  DisruptionSimulationResult,
} from '@/types/disruption'
import { WORLD_LAND_SVG_PATH, WORLD_BORDERS_SVG_PATH } from '@/data/world-land-110m'
import { projectGeo } from '@/utils/gis-projection'
import { useGisPanZoom } from '@/hooks/useGisPanZoom'

const t = (en: string, ar: string): BilingualText => ({ en, ar })

/* ========================================================================== */
/*  Disruption Scenarios & AI Contingency Strategies Data Matrix              */
/* ========================================================================== */

interface RealDisruptionScenario extends DisruptionScenarioOption {
  gisCoordinates: string
  blockedPathLabel: BilingualText
  bypassPathLabel: BilingualText
  originGps: [number, number]
  destinationGps: [number, number]
  chokepointGps: [number, number]
  realBlockedSvgPath: string
  realBypassSvgPath: string
  localizedMeteorology: BilingualText
  liveHoldingDelay: string
}

const DISRUPTION_SCENARIOS: RealDisruptionScenario[] = [
  {
    id: 'trans-eurasian-blizzard',
    code: 'INCIDENT-ALPINE-PASS-09',
    title: t('Alpine Mountain Pass Snowstorm & Icing', 'عاصفة ثلجية وتجمد بالممرات الجبلية السريعة'),
    location: t('Trans-Eurasian High-Altitude Highway Pass', 'ممر طريق الألب البري فائق الارتفاع'),
    gisCoordinates: '46°30\'N 08°34\'E // ALPINE ARTERY 09',
    affectedCorridor: 'CORR-FRA-DXB // LAND FREIGHT',
    severity: 'CRITICAL',
    impactDescription: t(
      'Heavy blizzard conditions and mountain highway ice causing hazardous traction conditions for standard heavy trucks, resulting in 48+ hour holding times.',
      'عاصفة ثلجية حادة وتجمد على الطرق الجبلية يسببان صعوبة في تماسك الشاحنات التقليدية وتأخيراً يتجاوز 48 ساعة.',
    ),
    baseDelayHours: 48,
    potentialLossRisk: '$380,000 / FLEET',
    originGps: [8.57, 50.03],
    destinationGps: [55.3, 25.2],
    chokepointGps: [8.34, 46.5],
    radarCoordinates: [52.38, 12.0],
    blockedPathLabel: t('PASS CLOSED // +48H DELAY', 'الممر مغلق // تأخير +48 ساعة'),
    bypassPathLabel: t('HEATED ARTERIAL TUNNEL BYPASS // -42H', 'تحويل عبر النفق البري الذكي // توفير 42 ساعة'),
    realBlockedSvgPath: 'M 523.8 111.0 L 523.1 120.8',
    realBypassSvgPath: 'M 523.8 111.0 Q 560.0 140.0 653.6 180.0',
    localizedMeteorology: t('Blizzard -12°C // Black Ice & 60km/h Gusts', 'عاصفة ثلجية -12°م // جليد ورياح 60 كم/س'),
    liveHoldingDelay: '48.0 HOURS PASS CLOSURE',
    strategies: [
      {
        id: 'speed',
        icon: Truck,
        name: t('Autonomous Heated Lower-Valley Artery', 'تحويل المسار إلى الطريق السفلي الساخن الذكي'),
        tagline: t('Geothermally Heated Arterial Highway Grid', 'شبكة طرق برية مسخنة حرارياً ذاتية التشغيل'),
        delayMitigationHours: 42,
        costVariancePercent: 3.8,
        co2OffsetKg: 3400,
        confidenceScore: 99.7,
        rerouteProtocol: t('PROTOCOL-ALPINE-BYPASS-01', 'بروتوكول-التحويل-الجبلي-01'),
      },
      {
        id: 'cost-esg',
        icon: Network,
        name: t('Connected V2X Electric Platoon Convoy', 'قوافل الشاحنات الكهربائية المتصلة (V2X)'),
        tagline: t('Dynamic Torque & Traction Synchronized Fleet', 'تحكم متزامن في عزم وتماسك الإطارات'),
        delayMitigationHours: 36,
        costVariancePercent: -7.2,
        co2OffsetKg: 4900,
        confidenceScore: 99.1,
        rerouteProtocol: t('PROTOCOL-PLATOON-TRACTION-04', 'بروتوكول-القوافل-المتزامنة-04'),
      },
      {
        id: 'zero-loss-cryo',
        icon: ShieldCheck,
        name: t('Auxiliary Thermal Battery Cabin Lock', 'تأمين فوري لبطاريات التدفئة وغرف الشحن'),
        tagline: t('Active Anti-Freeze Cargo Envelope', 'غلاف عازل نشط مانع لتجمد الشحنات الحساسة'),
        delayMitigationHours: 40,
        costVariancePercent: 4.5,
        co2OffsetKg: 1800,
        confidenceScore: 99.9,
        rerouteProtocol: t('PROTOCOL-THERMO-SHIELD-09', 'بروتوكول-العزل-الحراري-09'),
      },
    ],
  },
  {
    id: 'crossdock-automation-dwell',
    code: 'INCIDENT-CROSSDOCK-04',
    title: t('Mega-Hub Pallet Sorter High-Density Surge', 'ذروة تدفق وازدحام مصفوفة الفرز بمركز التوزيع'),
    location: t('Central Inland Cross-Dock Logistics Park', 'مجمع الفرز والعبور اللوجستي المركزي'),
    gisCoordinates: '24°42\'N 46°40\'E // CENTRAL CROSSDOCK 04',
    affectedCorridor: 'CORR-RUH-JED // INLAND FREIGHT',
    severity: 'HIGH',
    impactDescription: t(
      'Automated high-bay pallet conveyor peak surge causing unpredicted dwell times and staging area backlog.',
      'تكدس غير متوقع في مصفوفات الفرز الآلي يسبب تأخيراً في تحميل وتفريغ الحاويات على الأرصفة.',
    ),
    baseDelayHours: 32,
    potentialLossRisk: '$240,000 / CYCLE',
    originGps: [46.67, 24.71],
    destinationGps: [39.19, 21.54],
    chokepointGps: [44.0, 23.5],
    radarCoordinates: [62.96, 36.11],
    blockedPathLabel: t('CROSS-DOCK DWELL // +32H', 'تكدس رصيف الفرز // تأخير +32 ساعة'),
    bypassPathLabel: t('DYNAMIC LTL SATELLITE HUB // -28H', 'تحويل للمركز الفرعي الذكي // توفير 28 ساعة'),
    realBlockedSvgPath: 'M 629.6 181.4 L 620.0 185.0',
    realBypassSvgPath: 'M 629.6 181.4 Q 615.0 188.0 608.8 190.1',
    localizedMeteorology: t('Clear 34°C // Bay Utilization 98.4%', 'صافٍ 34°م // نسبة إشغال الأرصفة 98.4%'),
    liveHoldingDelay: '32.0 HOURS DWELL QUEUE',
    strategies: [
      {
        id: 'speed',
        icon: Boxes,
        name: t('Autonomous Satellite Cross-Dock Re-route', 'إعادة توجيه فورية للمستودع الفرعي الآلي'),
        tagline: t('AMR Autonomous Pallet Hand-Off', 'مناولة روبوتية سريعة بالروبوتات المتنقلة الذاتية'),
        delayMitigationHours: 28,
        costVariancePercent: 1.8,
        co2OffsetKg: 2100,
        confidenceScore: 99.8,
        rerouteProtocol: t('PROTOCOL-AMR-SATELLITE-02', 'بروتوكول-الفرز-الروبوتي-02'),
      },
      {
        id: 'cost-esg',
        icon: Truck,
        name: t('Dynamic Micro-Fulfillment Staging', 'توزيع مسبق عبر مراكز الإنجاز المصغرة'),
        tagline: t('Decentralized Urban Micro-Hub Grid', 'شبكة مراكز لوجستية حضرية لامركزية'),
        delayMitigationHours: 24,
        costVariancePercent: -5.4,
        co2OffsetKg: 3100,
        confidenceScore: 98.9,
        rerouteProtocol: t('PROTOCOL-MICRO-STAGE-07', 'بروتوكول-المراكز-المصغرة-07'),
      },
      {
        id: 'zero-loss-cryo',
        icon: ShieldCheck,
        name: t('Priority Cold-Chain Bay Insertion', 'حجز فوري لرصيف التبريد فائق الأولوية'),
        tagline: t('Zero-Dwell Direct Reefer Transfer', 'نقل مباشر بين الشاحنات المبردة دون توقف'),
        delayMitigationHours: 26,
        costVariancePercent: 2.9,
        co2OffsetKg: 1400,
        confidenceScore: 99.9,
        rerouteProtocol: t('PROTOCOL-REEFER-BAY-11', 'بروتوكول-أرصفة-التبريد-11'),
      },
    ],
  },
  {
    id: 'customs-surge',
    code: 'INCIDENT-BORDER-08',
    title: t('International Land Border Clearance Peak Surge', 'ذروة تدفق وازدحام المنفذ الجمركي البري'),
    location: t('Sovereign International Land Border Gateway', 'البوابة الجمركية البرية الدولية السيادية'),
    gisCoordinates: '24°15\'N 51°35\'E // BORDER GATEWAY 08',
    affectedCorridor: 'CORR-RUH-DXB // LAND HIGHWAY',
    severity: 'HIGH',
    impactDescription: t(
      'Physical paper inspection queues leading to multi-day vehicle dwell times at traditional border inspection gates.',
      'طوابير التفتيش الورقي التقليدي تؤدي لتعطل الشاحنات لأيام عند بوابات التفتيش الحدودية.',
    ),
    baseDelayHours: 48,
    potentialLossRisk: '$195,000 / CORRIDOR',
    originGps: [46.67, 24.71],
    destinationGps: [55.3, 25.2],
    chokepointGps: [50.0, 24.5],
    radarCoordinates: [63.89, 36.38],
    blockedPathLabel: t('MANUAL CUSTOMS QUEUE // +48H', 'تفتيش يدوي معطل // تأخير +48 ساعة'),
    bypassPathLabel: t('ZERO-TRUST DIGITAL GREEN LANE // -46H', 'المسار الأخضر الرقمي المشفر // توفير 46 ساعة'),
    realBlockedSvgPath: 'M 629.6 181.4 L 640.0 181.0',
    realBypassSvgPath: 'M 629.6 181.4 Q 642.0 175.0 653.6 180.0',
    localizedMeteorology: t('Clear 32°C // Dwell Queue 120 Vehicles', 'صافٍ 32°م // طابور انتظار 120 شاحنة'),
    liveHoldingDelay: '48.0 HOURS MANUAL QUEUE',
    strategies: [
      {
        id: 'speed',
        icon: ShieldCheck,
        name: t('Zero-Trust Cryptographic Green Lane', 'المسار الأخضر الرقمي المشفر والمؤتمت'),
        tagline: t('Instant Pre-Clearance Electronic Manifest', 'بيان جمركي مسبق فوري معتمد عبر البلوكشين'),
        delayMitigationHours: 46,
        costVariancePercent: -1.2,
        co2OffsetKg: 2900,
        confidenceScore: 99.9,
        rerouteProtocol: t('PROTOCOL-ZERO-TRUST-GREEN-01', 'بروتوكول-المسار-الأخضر-المشفر-01'),
      },
      {
        id: 'cost-esg',
        icon: Truck,
        name: t('Secondary Automated Dry Port Clearance', 'تخليص عبر الميناء الجاف التبادلي المؤتمت'),
        tagline: t('AMR Guided Autonomous Inland Dry Port', 'إرساء ومناولة آلية بالموانئ الجافة الذكية'),
        delayMitigationHours: 38,
        costVariancePercent: -6.0,
        co2OffsetKg: 3400,
        confidenceScore: 98.5,
        rerouteProtocol: t('PROTOCOL-INLAND-PORT-03', 'بروتوكول-الميناء-الجاف-03'),
      },
      {
        id: 'zero-loss-cryo',
        icon: Zap,
        name: t('High-Priority Express Escort', 'مرافقة إلكترونية فائقة السرعة والأمان'),
        tagline: t('Continuous RFID IoT Geofence Stream', 'تتبع حي بموجات الراديو ومستشعرات النطاق الجغرافي'),
        delayMitigationHours: 44,
        costVariancePercent: 5.0,
        co2OffsetKg: 1800,
        confidenceScore: 99.7,
        rerouteProtocol: t('PROTOCOL-EXPRESS-ESCORT-05', 'بروتوكول-المرافقة-السريعة-05'),
      },
    ],
  },
  {
    id: 'cryo-surge',
    code: 'INCIDENT-THERMAL-12',
    title: t('Ambient Desert Heatwave & Cold-Chain Alert', 'موجة حرارة صحراوية وإنذار سلسلة التبريد'),
    location: t('Gulf & Desert Overland Highway Segments', 'طرق النقل البري السريعة الصحراوية'),
    gisCoordinates: '26°30\'N 50°10\'E // HIGHWAY DESERT CORRIDOR',
    affectedCorridor: 'CORR-DXB-RUH // OVERLAND FREIGHT',
    severity: 'CRITICAL',
    impactDescription: t(
      'External ambient temperatures exceeding +48°C triggering predictive risk for ultra-sensitive cold-chain cargo trailers.',
      'تجاوز درجات الحرارة الخارجية +48°م مما يهدد استقرار مقطورات التبريد والشحنات الحساسة.',
    ),
    baseDelayHours: 24,
    potentialLossRisk: '$850,000 / CONSIGNMENT',
    originGps: [55.3, 25.2],
    destinationGps: [46.67, 24.71],
    chokepointGps: [50.5, 25.0],
    radarCoordinates: [64.0, 36.2],
    blockedPathLabel: t('DAYTIME HEAT SURGE // +24H', 'خطر حراري نهاري // تأخير +24 ساعة'),
    bypassPathLabel: t('AUXILIARY CRYO NIGHT DISPATCH // -22H', 'نقل ليلي بتبريد ذكي // توفير 22 ساعة'),
    realBlockedSvgPath: 'M 653.6 180.0 L 642.0 180.5',
    realBypassSvgPath: 'M 653.6 180.0 Q 640.0 170.0 629.6 181.4',
    localizedMeteorology: t('Extreme Heatwave +49°C // High Sun Radiation', 'حرارة شديدة +49°م // إشعاع شمسي مكثف'),
    liveHoldingDelay: '24.0 HOURS HIGHWAY DWELL',
    strategies: [
      {
        id: 'zero-loss-cryo',
        icon: ShieldCheck,
        name: t('Auxiliary IoT Cryo-Boost & Night Transit', 'تفعيل التبريد الاحتياطي الذكي والانطلاق الليلي'),
        tagline: t('Sub-Second Direct Thermal Stabilization', 'موازنة وتبريد لحظي مدعوم ببطاريات الأسطول المستقلة'),
        delayMitigationHours: 22,
        costVariancePercent: 1.5,
        co2OffsetKg: 950,
        confidenceScore: 99.9,
        rerouteProtocol: t('PROTOCOL-CRYO-BOOST-08', 'بروتوكول-التبريد-الاحتياطي-08'),
      },
      {
        id: 'speed',
        icon: Truck,
        name: t('Immediate Night-Transit Highway Staging', 'جدولة النقل الليلي فائق التبريد'),
        tagline: t('Nighttime Low-Temp Dynamic Dispatch', 'انطلاق ليلي في درجات الحرارة المنخفضة'),
        delayMitigationHours: 18,
        costVariancePercent: -2.5,
        co2OffsetKg: 2100,
        confidenceScore: 99.2,
        rerouteProtocol: t('PROTOCOL-NIGHT-DISPATCH-06', 'بروتوكول-النقل-الليلي-06'),
      },
      {
        id: 'cost-esg',
        icon: Boxes,
        name: t('Underground Shaded Facility Docking', 'إرساء فوري في المستودعات المعزولة تحت الأرض'),
        tagline: t('Geothermal Automated High-Density Storage', 'تخزين آلي في مستودعات تبريد جوفية مستدامة'),
        delayMitigationHours: 16,
        costVariancePercent: -5.0,
        co2OffsetKg: 2800,
        confidenceScore: 98.6,
        rerouteProtocol: t('PROTOCOL-SHADED-DOCK-02', 'بروتوكول-الإرساء-المعزول-02'),
      },
    ],
  },
]

/* ========================================================================== */
/*  Component                                                                  */
/* ========================================================================== */

export default function DisruptionCommandSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const isRTL = direction === 'rtl'
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('trans-eurasian-blizzard')
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyModeId>('speed')
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [copiedToken, setCopiedToken] = useState<boolean>(false)
  const [selectedIncidentHud, setSelectedIncidentHud] = useState<boolean>(false)

  // Interactive Pan-Zoom Physics Hook
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
  } = useGisPanZoom({ minScale: 1.0, maxScale: 6.0, viewBoxWidth: 1000, viewBoxHeight: 500 })

  const activeScenario = useMemo(
    () => DISRUPTION_SCENARIOS.find((s) => s.id === selectedScenarioId) || DISRUPTION_SCENARIOS[0],
    [selectedScenarioId],
  )

  const activeStrategy = useMemo(
    () =>
      activeScenario.strategies.find((st) => st.id === selectedStrategyId) ||
      activeScenario.strategies[0],
    [activeScenario, selectedStrategyId],
  )

  // Keyboard Escape Handler for Fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
        setSelectedIncidentHud(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Pure Zero-Trust Immutable Simulation Engine
  const simulation: DisruptionSimulationResult = useMemo(() => {
    const netDelay = Math.max(0.5, activeScenario.baseDelayHours - activeStrategy.delayMitigationHours)
    const hoursSaved = activeStrategy.delayMitigationHours
    const efficiencyGain = Number((22.4 + activeStrategy.confidenceScore * 0.05).toFixed(1))

    const rawSeed = `AUTH-REROUTE-${activeScenario.code}-${activeStrategy.id}-2026-6G-GIS`
    let hash = 0
    for (let i = 0; i < rawSeed.length; i++) {
      hash = (hash << 5) - hash + rawSeed.charCodeAt(i)
      hash |= 0
    }
    const token = `0x${Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()}8B4E17C2`

    return {
      activeScenario,
      selectedStrategy: activeStrategy,
      netDelayHours: Number(netDelay.toFixed(1)),
      hoursSaved,
      fuelEfficiencyGain: efficiencyGain,
      lossPreventionRate: '100% ZERO-LOSS',
      authChecksumToken: token,
    }
  }, [activeScenario, activeStrategy])

  const handleCopyToken = useCallback(() => {
    navigator.clipboard?.writeText(simulation.authChecksumToken)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }, [simulation.authChecksumToken])

  const originPixels = useMemo(() => projectGeo(activeScenario.originGps), [activeScenario])
  const destinationPixels = useMemo(() => projectGeo(activeScenario.destinationGps), [activeScenario])
  const chokepointPixels = useMemo(() => projectGeo(activeScenario.chokepointGps), [activeScenario])

  const handleIncidentEpicenterClick = useCallback(() => {
    setSelectedIncidentHud(true)
    centerOnPoint(chokepointPixels[0], chokepointPixels[1], 3.2)
  }, [centerOnPoint, chokepointPixels])

  const ui = {
    kicker: t('6G AUTONOMOUS DISRUPTION COMMAND CENTER', 'مركز القيادة والتحكم الذاتي لمعالجة الاختناقات 6G'),
    title: t('AI-Powered Global Incident Resolution', 'معالجة فورية لأزمات سلاسل التوريد بالذكاء الاصطناعي'),
    subtitle: t(
      'Live trade bottleneck detection with predictive autonomous rerouting, instant carrier dispatch, and zero-loss SLA assurance.',
      'رصد فوري للاختناقات اللوجستية العالمية مع إعادة توجيه ذكية فورية، وإرسال مستقل للأسطول، وضمان كامل لسلامة الشحنات.',
    ),
    activeAlertsTitle: t('Live Global Supply Chain Disruptions', 'الإنذارات اللوجستية العالمية النشطة'),
    mitigationTitle: t('Select AI Autonomous Contingency Protocol', 'اختر بروتوكول التدخل الذكي المناسب'),
    authorizeBtn: t('Authorize Autonomous AI Reroute', 'اعتماد وتفعيل خطة المسار الذكية'),
    savedLabel: t('Transit Time Recovered', 'الوقت المسترد والموفر'),
    afterLabel: t('Net Delay With AI Reroute', 'مدة التأخير بعد المعالجة'),
    lossRiskLabel: t('Asset Risk Mitigation', 'حماية وسلامة الأصول'),
    modalTitle: t('Autonomous Reroute Authorization Token', 'رمز اعتماد وتفويض المسار الذاتي المشفر'),
    copy: t('Copy Authorization Token', 'نسخ رمز التفويض'),
    copied: t('Token Copied', 'تم نسخ الرمز'),
    close: t('Close', 'إغلاق'),
    fullscreen: t('Crisis World View', 'عرض أزمات العالم الكامل للشاشة'),
    exitFullscreen: t('Exit Fullscreen', 'إنهاء وضع ملء الشاشة'),
    zoomIn: t('Zoom In', 'تكبير'),
    zoomOut: t('Zoom Out', 'تصغير'),
    resetView: t('Reset View', 'إعادة ضبط الخريطة'),
  }

  return (
    <section
      id="disruption-command"
      dir={direction}
      className={`relative py-32 overflow-hidden transition-colors duration-500 ${
        mode === 'dark' ? 'bg-slate-950 border-t border-white/[0.08]' : 'bg-slate-100/70 border-t border-slate-200'
      }`}
    >
      {/* Ambient Pulsing Emergency Glow */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_75%_45%_at_50%_15%,rgba(244,63,94,0.06),transparent)]'
            : 'bg-[radial-gradient(ellipse_75%_45%_at_50%_15%,rgba(244,63,94,0.09),transparent)]'
        }`}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl ${
              mode === 'dark'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                : 'bg-rose-500/15 border-rose-500/40 text-rose-900 shadow-sm'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${mode === 'dark' ? 'text-rose-400' : 'text-rose-700'}`} />
            <span className={`font-bold ${isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}>
              {ui.kicker[language]}
            </span>
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight ${
              mode === 'dark' ? 'text-white' : 'text-slate-950'
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

        {/* Incident Command Dual-Console Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Active Disruptions & Scenario Selector (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <span className={`font-bold text-xs ${mode === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>
                {ui.activeAlertsTitle[language]}
              </span>
              <span className="font-mono text-[10px] font-extrabold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/30">
                4 CRITICAL NODES
              </span>
            </div>

            {/* 4 Interactive Disruption Cards */}
            {DISRUPTION_SCENARIOS.map((scenario) => {
              const isSelected = scenario.id === selectedScenarioId
              return (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenarioId(scenario.id)
                    setSelectedStrategyId('speed')
                    setSelectedIncidentHud(false)
                    resetView()
                  }}
                  className={`p-5 rounded-3xl text-start transition-all duration-300 border backdrop-blur-3xl flex flex-col justify-between ${
                    isSelected
                      ? mode === 'dark'
                        ? 'bg-rose-500/10 border-rose-400 text-white shadow-[0_0_25px_rgba(244,63,94,0.3)]'
                        : 'bg-rose-50 border-rose-500 text-slate-950 shadow-md'
                      : mode === 'dark'
                        ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
                        : 'bg-white/90 border-slate-300 text-slate-700 hover:border-slate-400 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                      </span>
                      <span className="font-mono font-bold text-[10px] text-rose-400">{scenario.code}</span>
                    </div>
                    <span
                      className={`font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-md ${
                        scenario.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {scenario.severity}
                    </span>
                  </div>

                  <h3 className={`text-base font-extrabold leading-snug mb-1.5 ${isSelected ? (mode === 'dark' ? 'text-white' : 'text-slate-950') : ''}`}>
                    {scenario.title[language]}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-400 mb-3">
                    {scenario.impactDescription[language]}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-[11px] font-mono">
                    <span className="text-slate-400">{scenario.affectedCorridor}</span>
                    <span className="text-rose-400 font-bold">+{scenario.baseDelayHours}h DELAY</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Right Column: Cartographic GIS Crisis Map & AI Resolution Console (7 Columns) */}
          <div
            className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl border border-rose-500/30 shadow-[0_16px_50px_rgba(244,63,94,0.15)] transition-all duration-300 flex flex-col justify-between ${
              isFullscreen
                ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none p-6 sm:p-10 bg-slate-950/98 backdrop-blur-3xl flex flex-col justify-between overflow-hidden'
                : mode === 'dark' ? 'bg-slate-950/85' : 'bg-white/95'
            }`}
          >
            {/* Top Incident Status Header with Fullscreen Trigger */}
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-[10px] text-emerald-400 block leading-tight tracking-wider">
                      6G INCIDENT INTERVENTION
                    </span>
                    <span className={`text-sm font-extrabold ${mode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                      {activeScenario.location[language]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>CONFIDENCE: {activeStrategy.confidenceScore}%</span>
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? ui.exitFullscreen[language] : ui.fullscreen[language]}
                    className="p-1.5 rounded-xl border border-white/10 bg-slate-800/70 hover:bg-slate-700 text-rose-300 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* High-Resolution Interactive Cartographic GIS Crisis Vector Map Canvas (1000x500 WGS-84) */}
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
                className={`relative w-full rounded-2xl overflow-hidden bg-[#030712] border border-rose-500/25 p-4 mb-5 flex items-center justify-center select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                } ${isFullscreen ? 'h-[500px]' : 'h-64 sm:h-72'}`}
              >
                {/* SVG Real World Cartographic Map with Natural Earth TopoJSON & Multi-Stage Optical Neon */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 500"
                  preserveAspectRatio="xMidYMid meet"
                  shapeRendering="geometricPrecision"
                  textRendering="geometricPrecision"
                >
                  <defs>
                    {/* Genuine Multi-Stage Optical Neon Filter for Rose/Red */}
                    <filter id="crisis-real-red" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Genuine Multi-Stage Optical Neon Filter for Cyber Emerald */}
                    <filter id="crisis-real-emerald" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Luminous Bypass Gradient */}
                    <linearGradient id="crisis-real-bypass-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>

                  {/* Transform Matrix Group for Smooth 60fps Pan and Zoom */}
                  <g
                    transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
                    style={{ transformOrigin: '500px 250px', willChange: 'transform' }}
                  >
                    {/* 1. Cartographic Lat/Long Graticule Grid */}
                    <g stroke="rgba(244,63,94,0.12)" strokeWidth="0.8" strokeDasharray="4 6">
                      <line x1="0" y1="65.3" x2="1000" y2="65.3" />
                      <line x1="0" y1="184.7" x2="1000" y2="184.7" />
                      <line x1="0" y1="250.0" x2="1000" y2="250.0" stroke="rgba(244,63,94,0.25)" strokeWidth="1.2" strokeDasharray="none" />
                      <line x1="0" y1="315.3" x2="1000" y2="315.3" />
                      <line x1="166.7" y1="0" x2="166.7" y2="500" />
                      <line x1="333.3" y1="0" x2="333.3" y2="500" />
                      <line x1="500.0" y1="0" x2="500.0" y2="500" stroke="rgba(244,63,94,0.25)" strokeWidth="1.2" strokeDasharray="none" />
                      <line x1="666.7" y1="0" x2="666.7" y2="500" />
                      <line x1="833.3" y1="0" x2="833.3" y2="500" />
                    </g>

                    {/* 2. Real Cartographic World Continents & Coastlines (Natural Earth Dataset) */}
                    <path
                      d={WORLD_LAND_SVG_PATH}
                      fill="rgba(244,63,94,0.04)"
                      stroke="rgba(244,63,94,0.4)"
                      strokeWidth="1.2"
                      className="pointer-events-none"
                    />
                    <path
                      d={WORLD_BORDERS_SVG_PATH}
                      fill="none"
                      stroke="rgba(244,63,94,0.18)"
                      strokeWidth="0.75"
                      className="pointer-events-none"
                    />

                    {/* Crisis Geofence Exclusion Zone Ring */}
                    <g className="pointer-events-none">
                      <circle
                        cx={chokepointPixels[0]}
                        cy={chokepointPixels[1]}
                        r="32"
                        fill="rgba(244,63,94,0.08)"
                        stroke="rgba(244,63,94,0.5)"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx={chokepointPixels[0]}
                        cy={chokepointPixels[1]}
                        r="48"
                        fill="none"
                        stroke="rgba(244,63,94,0.25)"
                        strokeWidth="0.8"
                        strokeDasharray="2 3"
                      />
                    </g>

                    {/* Tactical Radar Sweep Beam around Epicenter */}
                    <g className="pointer-events-none" transform={`translate(${chokepointPixels[0]}, ${chokepointPixels[1]})`}>
                      <motion.circle
                        r="42"
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="1"
                        initial={{ opacity: 0.8, scale: 0.2 }}
                        animate={{ opacity: 0, scale: 1.2 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    </g>

                    {/* Stalled / Queued Freight Particles (AIS Stoppage Cluster) */}
                    <g className="pointer-events-none opacity-85">
                      <circle cx={chokepointPixels[0] - 14} cy={chokepointPixels[1] + 8} r="2.5" fill="#f43f5e" />
                      <circle cx={chokepointPixels[0] - 22} cy={chokepointPixels[1] + 16} r="2.2" fill="#fb7185" />
                      <circle cx={chokepointPixels[0] - 10} cy={chokepointPixels[1] + 20} r="2.2" fill="#f43f5e" />
                      <circle cx={chokepointPixels[0] - 28} cy={chokepointPixels[1] + 24} r="1.8" fill="#fda4af" />
                    </g>

                    {/* 3. Luminous Red Disrupted Track (Terminating at blocked chokepoint) */}
                    <path
                      d={activeScenario.realBlockedSvgPath}
                      fill="none"
                      stroke="rgba(244,63,94,0.95)"
                      strokeWidth="6"
                      strokeDasharray="8 6"
                      filter="url(#crisis-real-red)"
                      className="pointer-events-none"
                    />

                    {/* 4. Luminous Cyber Emerald AI Blockchain Bypass Trajectory */}
                    <motion.path
                      d={activeScenario.realBypassSvgPath}
                      fill="none"
                      stroke="url(#crisis-real-bypass-gradient)"
                      strokeWidth="7"
                      strokeDasharray="12 6"
                      filter="url(#crisis-real-emerald)"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -60 }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                      className="pointer-events-none"
                    />

                    {/* 5. Origin & Destination Strategic Nodes */}
                    <g className="pointer-events-none">
                      <circle cx={originPixels[0]} cy={originPixels[1]} r="9" fill="rgba(34,211,238,0.3)" filter="url(#crisis-real-emerald)" />
                      <circle cx={originPixels[0]} cy={originPixels[1]} r="5" fill="#22d3ee" />
                      <circle cx={originPixels[0]} cy={originPixels[1]} r="2" fill="#ffffff" />
                      
                      <circle cx={destinationPixels[0]} cy={destinationPixels[1]} r="10" fill="rgba(16,185,129,0.3)" filter="url(#crisis-real-emerald)" />
                      <circle cx={destinationPixels[0]} cy={destinationPixels[1]} r="6" fill="#10b981" />
                      <circle cx={destinationPixels[0]} cy={destinationPixels[1]} r="2.5" fill="#ffffff" />
                    </g>

                    {/* 6. Disrupted Chokepoint Emergency Node with Interactive Center-on-Click */}
                    <g
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIncidentEpicenterClick()
                      }}
                      className="cursor-pointer"
                    >
                      <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="18" fill="rgba(244,63,94,0.45)" filter="url(#crisis-real-red)" />
                      <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="8" fill="#f43f5e" />
                      <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="3" fill="#ffffff" />
                    </g>
                  </g>
                </svg>

                {/* On-Screen Zoom & View Control HUD */}
                <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 bg-slate-950/85 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
                  <button
                    onClick={zoomIn}
                    title={ui.zoomIn[language]}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={zoomOut}
                    title={ui.zoomOut[language]}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetView}
                    title={ui.resetView[language]}
                    className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition-colors border-t border-white/10"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Top Corner GIS Coordinates Readout */}
                <div className="absolute top-2 left-3 text-[8px] font-mono text-rose-400/90 pointer-events-none">
                  {activeScenario.gisCoordinates}
                </div>

                {/* Pulsing Disruption Epicenter Marker (Luminous Neon Red) */}
                <div
                  style={{
                    left: `${(chokepointPixels[0] / 10).toFixed(1)}%`,
                    top: `${(chokepointPixels[1] / 5).toFixed(1)}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                >
                  <span className="relative flex h-7 w-7">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-80" />
                    <span className="relative inline-flex rounded-full h-7 w-7 bg-rose-600 items-center justify-center text-[11px] font-extrabold text-white shadow-[0_0_20px_rgba(244,63,94,1)]">
                      !
                    </span>
                  </span>
                </div>

                {/* Contextual Incident Telemetry HUD Tooltip on Click */}
                <AnimatePresence>
                  {selectedIncidentHud && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className={`absolute bottom-4 ${
                        isRTL ? 'right-4' : 'left-4'
                      } z-40 max-w-sm w-full p-4 rounded-2xl border border-rose-500/50 bg-slate-900/95 backdrop-blur-2xl shadow-[0_0_35px_rgba(244,63,94,0.35)] text-white font-mono`}
                    >
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                          <span className="font-bold text-xs text-rose-300 truncate">
                            {activeScenario.code}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedIncidentHud(false)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">SEVERITY:</span>
                          <span className="text-rose-400 font-bold">{activeScenario.severity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">METEOROLOGY:</span>
                          <span className="text-amber-300 font-semibold">{activeScenario.localizedMeteorology[language]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">HOLDING TIME:</span>
                          <span className="text-rose-400 font-bold">{activeScenario.liveHoldingDelay}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">BYPASS PROTOCOL:</span>
                          <span className="text-emerald-400 font-bold">{activeStrategy.name[language]}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active Protocol Badge (Bottom) */}
                <div className={`absolute bottom-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'} z-20`}>
                  <span className="font-mono text-[9px] font-extrabold px-3 py-1 rounded-xl bg-slate-950/95 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.35)] backdrop-blur-md">
                    ✓ {activeScenario.bypassPathLabel[language]}
                  </span>
                </div>
              </div>

              {/* Contingency Strategy Selector */}
              <div className="mb-5">
                <label
                  className={`block font-bold mb-2.5 ${
                    isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                  } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}
                >
                  {ui.mitigationTitle[language]}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeScenario.strategies.map((strategy) => {
                    const Icon = strategy.icon
                    const isSelected = strategy.id === selectedStrategyId
                    return (
                      <button
                        key={strategy.id}
                        onClick={() => setSelectedStrategyId(strategy.id)}
                        className={`p-3 rounded-2xl text-start border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? mode === 'dark'
                              ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-[0_0_18px_rgba(16,185,129,0.35)]'
                              : 'bg-emerald-50 border-emerald-600 text-slate-950 shadow-sm'
                            : mode === 'dark'
                              ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <span className="font-mono text-[9px] font-bold text-emerald-400">
                            -{strategy.delayMitigationHours}h
                          </span>
                        </div>
                        <div className="font-bold text-xs leading-snug mb-0.5">{strategy.name[language]}</div>
                        <div className="text-[9.5px] text-slate-400 leading-tight">{strategy.tagline[language]}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Before vs. After Comparative Telemetry Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
                {/* Metric 1: Hours Recovered */}
                <div
                  className={`p-3 rounded-2xl border backdrop-blur-xl ${
                    mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-[9.5px] font-bold text-slate-400 block uppercase mb-0.5">
                    {ui.savedLabel[language]}
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">
                    -{simulation.hoursSaved} hrs
                  </div>
                  <span className="text-[9px] font-mono text-cyan-400 font-semibold mt-0.5 block">
                    AI OPTIMIZED
                  </span>
                </div>

                {/* Metric 2: Net Delay */}
                <div
                  className={`p-3 rounded-2xl border backdrop-blur-xl ${
                    mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-[9.5px] font-bold text-slate-400 block uppercase mb-0.5">
                    {ui.afterLabel[language]}
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-cyan-300">
                    {simulation.netDelayHours} hrs
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 line-through mt-0.5 block">
                    was {activeScenario.baseDelayHours} hrs
                  </span>
                </div>

                {/* Metric 3: Carbon Offset */}
                <div
                  className={`p-3 rounded-2xl border backdrop-blur-xl ${
                    mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-[9.5px] font-bold text-slate-400 block uppercase mb-0.5">
                    ESG OFFSET
                  </span>
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-blue-400">
                    -{activeStrategy.co2OffsetKg} kg
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold mt-0.5 block">
                    +{simulation.fuelEfficiencyGain}% GAIN
                  </span>
                </div>

                {/* Metric 4: Asset Loss Prevention */}
                <div
                  className={`p-3 rounded-2xl border backdrop-blur-xl ${
                    mode === 'dark' ? 'bg-white/[0.025] border-white/10' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <span className="text-[9.5px] font-bold text-slate-400 block uppercase mb-0.5">
                    {ui.lossRiskLabel[language]}
                  </span>
                  <div className="font-mono text-sm sm:text-base font-extrabold text-emerald-400 mt-0.5">
                    {simulation.lossPreventionRate}
                  </div>
                  <span className="text-[8.5px] font-mono text-slate-400 block mt-0.5">
                    SAVED: {activeScenario.potentialLossRisk}
                  </span>
                </div>
              </div>
            </div>

            {/* Authorize AI Reroute Trigger */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className={`w-full group py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-xl ${
                mode === 'dark'
                  ? 'bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-slate-950 hover:from-emerald-400 hover:to-blue-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                  : 'bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-700 text-white hover:from-emerald-500 hover:to-blue-600 shadow-lg'
              }`}
            >
              <RotateCw className="w-4 h-4 text-slate-950 dark:text-slate-950 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{ui.authorizeBtn[language]}</span>
              <ArrowIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

        </div>
      </div>

      {/* Reroute Authorization Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthModalOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as const }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full rounded-3xl p-6 sm:p-8 border border-emerald-500/30 bg-slate-900/95 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setAuthModalOpen(false)}
                aria-label={ui.close[language]}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold tracking-tight">{ui.modalTitle[language]}</h3>
                  <p className="text-xs text-emerald-400 font-mono">STATUS: AUTONOMOUSLY EXECUTING</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="space-y-2.5 mb-6 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between">
                  <span className="text-slate-400">INCIDENT ID:</span>
                  <span className="text-rose-400 font-bold">{activeScenario.code}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between">
                  <span className="text-slate-400">CONTINGENCY MANDATE:</span>
                  <span className="text-white font-bold">{activeStrategy.name[language]}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/10 flex justify-between">
                  <span className="text-slate-400">RECOVERED TRANSIT TIME:</span>
                  <span className="text-emerald-400 font-bold">-{simulation.hoursSaved} HOURS</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-emerald-500/30 flex flex-col gap-1.5">
                  <span className="text-[10px] text-emerald-400 font-bold">CRYPTOGRAPHIC AUTHORIZATION CHECKSUM:</span>
                  <div className="text-xs font-bold text-white break-all bg-slate-900 p-2 rounded-lg border border-white/5">
                    {simulation.authChecksumToken}
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCopyToken}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  {copiedToken ? (
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
                  onClick={() => setAuthModalOpen(false)}
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
