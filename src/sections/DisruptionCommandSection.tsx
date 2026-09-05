'use client'

/**
 * DisruptionCommandSection — YASLOGIST interactive corridor exception engine
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
  Boxes,
  Network,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import type {
  StrategyModeId,
  DisruptionSimulationResult,
} from '@/types/disruption'
import { computeEta, type EtaInput } from '@/lib/eta'
import { LAND_TRADE_CORRIDORS } from '@/data/landCorridors'
import { IncidentRealMap, type RealDisruptionScenarioData } from '@/components/dispatch/IncidentRealMap'

/** Declared line-haul speed for scenario ETA arithmetic (MODELLED). */
const SCENARIO_LINEHAUL_KMH = 80

import { t } from '@/lib/i18n'

/* ========================================================================== */
/*  Disruption Scenarios & AI Contingency Strategies Data Matrix              */
/* ========================================================================== */

type RealDisruptionScenario = RealDisruptionScenarioData

const DISRUPTION_SCENARIOS: RealDisruptionScenario[] = [
  {
    id: 'desert-road-fog',
    code: 'INCIDENT-FOG-DESERT-01',
    title: t(
      'Seasonal Morning Fog, Cairo–Alexandria Desert Road',
      'شبورة صباحية موسمية على الطريق الصحراوي القاهرة–الإسكندرية',
    ),
    location: t(
      'Cairo–Alexandria Desert Road, km 45–85',
      'الطريق الصحراوي القاهرة–الإسكندرية، كم 45–85',
    ),
    gisCoordinates: '30°24\'N 30°29\'E // DESERT ROAD KM 45-85',
    affectedCorridor: 'CORR-DEKHEILA-10RAM // ROAD FREIGHT',
    severity: 'HIGH',
    impactDescription: t(
      'Visibility drops below 100 m between roughly 04:00 and 09:00 in the autumn and winter fog season. Traffic authorities impose speed restrictions or close the stretch outright, weighbridge queues back up behind the closure, and inbound trucks miss their booked yard slot at the dry port.',
      'تنخفض الرؤية إلى أقل من 100 متر بين الساعة 04:00 و09:00 تقريباً في موسم الشبورة خريفاً وشتاءً. تفرض إدارة المرور تخفيضاً للسرعات أو غلقاً كاملاً للمقطع، فتتكدس طوابير الموازين خلف نقطة الغلق، وتفوت الشاحنات القادمة موعد دخولها المحجوز بالميناء الجاف.',
    ),
    baseDelayHours: 5,
    potentialLossRisk: 'EGP ~180K DEMURRAGE EXPOSURE (MODELLED)',
    originGps: [30.98, 29.97],
    destinationGps: [29.82, 31.14],
    chokepointGps: [30.40, 30.48],
    blockedCoordinates: [
      [30.98, 29.97],
      [30.82, 30.15],
      [30.60, 30.32],
      [30.40, 30.48],
    ],
    bypassCoordinates: [
      [30.98, 29.97],
      [31.18, 30.22],
      [30.95, 30.55],
      [30.52, 30.78],
      [30.08, 30.98],
      [29.82, 31.14],
    ],
    exclusionRadiusKm: 15,
    radarCoordinates: [58.47, 33.11],
    blockedPathLabel: t('DESERT ROAD RESTRICTED // +5H', 'الطريق الصحراوي مقيّد // تأخير +5 ساعات'),
    bypassPathLabel: t('REGIONAL RING ROAD REROUTE // -3.5H', 'تحويل عبر الطريق الدائري الإقليمي // توفير 3.5 ساعة'),
    realBlockedSvgPath: 'M 584.4 165.4 L 584.9 165.7',
    realBypassSvgPath: 'M 582.8 163.5 Q 586.4 164.6 585.9 166.8',
    localizedMeteorology: t(
      'Fog, visibility 80 m // 14°C // dew point 13°C',
      'شبورة، مدى الرؤية 80 متراً // 14°م // نقطة الندى 13°م',
    ),
    liveHoldingDelay: '5.0 HOURS SPEED RESTRICTION',
    strategies: [
      {
        id: 'speed',
        icon: Truck,
        name: t(
          'Regional Ring Road reroute to 6th of October Dry Port',
          'تحويل المسار عبر الطريق الدائري الإقليمي إلى الميناء الجاف بالسادس من أكتوبر',
        ),
        tagline: t(
          'Leaves the fog band before km 45, rebooks the dry port slot',
          'الخروج من نطاق الشبورة قبل الكيلو 45 مع إعادة حجز موعد الميناء الجاف',
        ),
        delayMitigationHours: 3.5,
        costVariancePercent: 4.2,
        co2OffsetKg: 210,
        confidenceScore: 88.5,
        rerouteProtocol: t('PROTOCOL-RING-ROAD-REROUTE-01', 'بروتوكول-التحويل-للطريق-الدائري-01'),
      },
      {
        id: 'cost-esg',
        icon: Network,
        name: t(
          'Hold at Wadi El Natrun staging until visibility clears',
          'الانتظار بساحة وادي النطرون حتى تتحسن الرؤية',
        ),
        tagline: t(
          'Driver rest counted against hours, weighbridge queue cleared first',
          'احتساب فترة الانتظار ضمن راحة السائق مع تصريف طابور الميزان أولاً',
        ),
        delayMitigationHours: 2,
        costVariancePercent: -3.6,
        co2OffsetKg: 340,
        confidenceScore: 91.2,
        rerouteProtocol: t('PROTOCOL-NATRUN-HOLD-02', 'بروتوكول-الانتظار-بوادي-النطرون-02'),
      },
      {
        id: 'cold-chain-reefer',
        icon: ShieldCheck,
        name: t(
          'Reefer units on genset for the duration of the hold',
          'تشغيل وحدات التبريد على المولد طوال فترة التوقف',
        ),
        tagline: t(
          'Temperature logged every 5 minutes, driver alerted on excursion',
          'تسجيل درجة الحرارة كل 5 دقائق مع تنبيه السائق عند أي انحراف',
        ),
        delayMitigationHours: 2.5,
        costVariancePercent: 2.8,
        co2OffsetKg: 120,
        confidenceScore: 86.4,
        rerouteProtocol: t('PROTOCOL-REEFER-GENSET-03', 'بروتوكول-تبريد-بالمولد-03'),
      },
    ],
  },
  {
    id: 'october-gate-dwell',
    code: 'INCIDENT-GATE-6OCT-02',
    title: t(
      'Gate Dwell Congestion, 6th of October Dry Port',
      'تكدس بوابة الميناء الجاف بالسادس من أكتوبر',
    ),
    location: t(
      '6th of October Dry Port, inbound gate and staging yard',
      'الميناء الجاف بالسادس من أكتوبر، بوابة الدخول وساحة الانتظار',
    ),
    gisCoordinates: '29°58\'N 30°59\'E // 6TH OF OCTOBER DRY PORT',
    affectedCorridor: 'CORR-SOKHNA-6OCT // ROAD FREIGHT',
    severity: 'HIGH',
    impactDescription: t(
      'Several vessels discharge at Ain Sokhna inside the same window, so the trucks they generate all reach the dry port gate on the same afternoon. The staging yard fills, the queue spills onto the approach road, and drivers who arrived on their booked slot wait behind trucks that did not.',
      'تفرغ عدة سفن في العين السخنة خلال نفس النافذة الزمنية، فتصل الشاحنات الناتجة عنها إلى بوابة الميناء الجاف في فترة ما بعد الظهر ذاتها. تمتلئ ساحة الانتظار ويمتد الطابور إلى الطريق المؤدي للبوابة، فينتظر السائقون الملتزمون بمواعيدهم خلف شاحنات غير ملتزمة.',
    ),
    baseDelayHours: 7,
    potentialLossRisk: 'EGP ~240K DETENTION EXPOSURE (MODELLED)',
    originGps: [32.34, 29.66],
    destinationGps: [30.98, 29.97],
    chokepointGps: [30.99, 29.96],
    blockedCoordinates: [
      [32.34, 29.66],
      [31.95, 29.82],
      [31.45, 29.92],
      [30.99, 29.96],
    ],
    bypassCoordinates: [
      [32.34, 29.66],
      [31.98, 29.98],
      [31.72, 30.14],
      [31.35, 30.08],
      [30.98, 29.97],
    ],
    exclusionRadiusKm: 12,
    radarCoordinates: [58.61, 33.35],
    blockedPathLabel: t('GATE QUEUE // +7H', 'طابور البوابة // تأخير +7 ساعات'),
    bypassPathLabel: t('BADR CITY STAGING // -4H', 'انتظار بمدينة بدر // توفير 4 ساعات'),
    realBlockedSvgPath: 'M 586.7 166.8 L 585.9 166.8',
    realBypassSvgPath: 'M 586.7 166.8 Q 587.6 166.0 588.1 166.3',
    localizedMeteorology: t(
      'Clear 33°C // yard occupancy 94%',
      'صافٍ 33°م // نسبة إشغال الساحة 94%',
    ),
    liveHoldingDelay: '7.0 HOURS GATE QUEUE',
    strategies: [
      {
        id: 'speed',
        icon: Boxes,
        name: t(
          'Divert to Badr City staging, re-present at the booked slot',
          'التحويل إلى ساحة مدينة بدر والعودة في الموعد المحجوز',
        ),
        tagline: t(
          'Truck waits off the approach road instead of in the queue',
          'انتظار الشاحنة خارج طريق البوابة بدلاً من الوقوف في الطابور',
        ),
        delayMitigationHours: 4,
        costVariancePercent: 5.1,
        co2OffsetKg: 180,
        confidenceScore: 84.7,
        rerouteProtocol: t('PROTOCOL-BADR-STAGING-04', 'بروتوكول-الانتظار-ببدر-04'),
      },
      {
        id: 'cost-esg',
        icon: Truck,
        name: t(
          'Shift the arrival to the night gate window',
          'نقل موعد الوصول إلى نافذة البوابة الليلية',
        ),
        tagline: t(
          'Trades same-day delivery for a queue that has drained',
          'مقايضة التسليم في نفس اليوم بطابور انتهى تصريفه',
        ),
        delayMitigationHours: 5,
        costVariancePercent: -6.8,
        co2OffsetKg: 260,
        confidenceScore: 89.3,
        rerouteProtocol: t('PROTOCOL-NIGHT-GATE-05', 'بروتوكول-البوابة-الليلية-05'),
      },
      {
        id: 'cold-chain-reefer',
        icon: ShieldCheck,
        name: t(
          'Priority gate lane for temperature-controlled loads',
          'مسار أولوية بالبوابة للشحنات المتحكم في حرارتها',
        ),
        tagline: t(
          'Reefers jump the queue by agreement with the yard operator',
          'أولوية دخول الشاحنات المبردة بالاتفاق مع مشغل الساحة',
        ),
        delayMitigationHours: 5.5,
        costVariancePercent: 3.4,
        co2OffsetKg: 90,
        confidenceScore: 81.5,
        rerouteProtocol: t('PROTOCOL-REEFER-PRIORITY-06', 'بروتوكول-أولوية-المبردات-06'),
      },
    ],
  },
  {
    id: 'suez-road-heat',
    code: 'INCIDENT-HEAT-SUEZ-03',
    title: t(
      'Midday Heat Alert, Suez–Cairo Desert Corridor',
      'إنذار حرارة الظهيرة على ممر السويس–القاهرة الصحراوي',
    ),
    location: t(
      'Suez–Cairo Desert Road, open desert section',
      'طريق السويس–القاهرة الصحراوي، المقطع الصحراوي المكشوف',
    ),
    gisCoordinates: '29°48\'N 31°48\'E // SUEZ DESERT SECTION',
    affectedCorridor: 'CORR-SOKHNA-6OCT // COLD CHAIN',
    severity: 'HIGH',
    impactDescription: t(
      'Ambient temperature passes 45°C through the early afternoon in high summer. Reefer units on the open desert section run at full duty cycle to hold set point, fuel burn climbs, and any unit already down on refrigerant starts drifting out of range.',
      'تتجاوز درجة الحرارة المحيطة 45°م خلال فترة ما بعد الظهر في ذروة الصيف. تعمل وحدات التبريد على المقطع الصحراوي المكشوف بأقصى دورة تشغيل للحفاظ على درجة الحرارة المضبوطة، فيرتفع استهلاك الوقود، وتبدأ أي وحدة يقل بها غاز التبريد في الخروج عن النطاق المطلوب.',
    ),
    baseDelayHours: 6,
    potentialLossRisk: 'EGP ~600K CONSIGNMENT VALUE AT RISK (MODELLED)',
    originGps: [32.34, 29.66],
    destinationGps: [30.98, 29.97],
    chokepointGps: [31.80, 29.80],
    blockedCoordinates: [
      [32.34, 29.66],
      [32.08, 29.74],
      [31.80, 29.80],
    ],
    bypassCoordinates: [
      [32.34, 29.66],
      [32.12, 29.90],
      [31.68, 30.05],
      [31.28, 29.98],
      [30.98, 29.97],
    ],
    exclusionRadiusKm: 18,
    radarCoordinates: [58.83, 33.44],
    blockedPathLabel: t('MIDDAY HEAT WINDOW // +6H', 'نافذة حرارة الظهيرة // تأخير +6 ساعات'),
    bypassPathLabel: t('NIGHT RUN // -4.5H', 'التشغيل الليلي // توفير 4.5 ساعة'),
    realBlockedSvgPath: 'M 589.8 167.6 L 588.3 167.2',
    realBypassSvgPath: 'M 589.8 167.6 Q 587.8 166.4 585.9 166.8',
    localizedMeteorology: t(
      'Clear 46°C // road surface 61°C // reefer duty cycle 100%',
      'صافٍ 46°م // حرارة سطح الطريق 61°م // دورة تشغيل التبريد 100%',
    ),
    liveHoldingDelay: '6.0 HOURS HEAT WINDOW',
    strategies: [
      {
        id: 'cold-chain-reefer',
        icon: ShieldCheck,
        name: t(
          'Pre-cool the box and pull the run into the night window',
          'تبريد الصندوق مسبقاً ونقل الرحلة إلى النافذة الليلية',
        ),
        tagline: t(
          'Set point reached before loading, temperature logged every 5 minutes',
          'الوصول لدرجة الحرارة المطلوبة قبل التحميل مع تسجيلها كل 5 دقائق',
        ),
        delayMitigationHours: 4.5,
        costVariancePercent: 2.2,
        co2OffsetKg: 140,
        confidenceScore: 90.1,
        rerouteProtocol: t('PROTOCOL-PRECOOL-NIGHT-07', 'بروتوكول-التبريد-المسبق-الليلي-07'),
      },
      {
        id: 'speed',
        icon: Truck,
        name: t(
          'Run straight through with a fuel stop at the ring road',
          'الاستمرار في الرحلة مع توقف للتزود بالوقود عند الطريق الدائري',
        ),
        tagline: t(
          'Shortest elapsed time, highest genset load on the trailer',
          'أقصر زمن رحلة مقابل أعلى حمل على مولد المقطورة',
        ),
        delayMitigationHours: 3,
        costVariancePercent: 6.5,
        co2OffsetKg: -320,
        confidenceScore: 78.9,
        rerouteProtocol: t('PROTOCOL-THROUGH-RUN-08', 'بروتوكول-الرحلة-المتصلة-08'),
      },
      {
        id: 'cost-esg',
        icon: Boxes,
        name: t(
          'Hold in bonded cold storage until the heat window passes',
          'التخزين المبرد تحت الإشراف الجمركي حتى تنتهي فترة الحرارة',
        ),
        tagline: t(
          'Cheapest per hour, adds a handling movement to the shipment',
          'الأقل تكلفة بالساعة مع إضافة عملية مناولة إلى الشحنة',
        ),
        delayMitigationHours: 3.5,
        costVariancePercent: -4.1,
        co2OffsetKg: 210,
        confidenceScore: 85.6,
        rerouteProtocol: t('PROTOCOL-BONDED-COLD-09', 'بروتوكول-التخزين-المبرد-09'),
      },
    ],
  },
  {
    id: 'nuweiba-ferry-dwell',
    code: 'INCIDENT-FERRY-NUWEIBA-04',
    title: t(
      'Marine Weather Delay, Nuweiba Ro-Ro Crossing',
      'تأخير بسبب حالة البحر بمعبر نويبع للعبّارات',
    ),
    location: t(
      'Nuweiba Port, Ro-Ro berth and truck marshalling yard',
      'ميناء نويبع، رصيف العبّارات وساحة تجميع الشاحنات',
    ),
    gisCoordinates: '29°02\'N 34°40\'E // NUWEIBA RO-RO BERTH',
    affectedCorridor: 'CORR-CAI-RUH // EXPORT ROUTE',
    severity: 'CRITICAL',
    impactDescription: t(
      'Northerly winds in the Gulf of Aqaba suspend Ro-Ro sailings. Trucks already through Egyptian exit formalities hold in the marshalling yard, the next available sailing is oversubscribed, and reefer loads burn fuel on the quay while they wait.',
      'توقف الرياح الشمالية في خليج العقبة رحلات العبّارات. تنتظر الشاحنات التي أنهت إجراءات الخروج المصرية في ساحة التجميع، بينما تكون الرحلة التالية المتاحة محجوزة بالكامل، وتستهلك الشاحنات المبردة الوقود على الرصيف أثناء الانتظار.',
    ),
    baseDelayHours: 26,
    potentialLossRisk: 'EGP ~430K DEMURRAGE AND FUEL (MODELLED)',
    originGps: [31.74, 30.30],
    destinationGps: [46.67, 24.71],
    chokepointGps: [34.67, 29.03],
    blockedCoordinates: [
      [31.74, 30.30],
      [32.55, 29.96],
      [33.75, 29.45],
      [34.67, 29.03],
    ],
    bypassCoordinates: [
      [31.74, 30.30],
      [32.55, 29.96],
      [34.67, 29.03],
      [35.69, 27.35],
      [36.57, 28.38],
      [41.68, 27.52],
      [46.67, 24.71],
    ],
    exclusionRadiusKm: 25,
    radarCoordinates: [59.63, 33.87],
    blockedPathLabel: t('SAILINGS SUSPENDED // +26H', 'توقف الرحلات // تأخير +26 ساعة'),
    bypassPathLabel: t('REBOOKED SAILING // -16H', 'إعادة حجز رحلة // توفير 16 ساعة'),
    realBlockedSvgPath: 'M 588.2 165.8 L 596.3 169.4',
    realBypassSvgPath: 'M 596.3 169.4 Q 610.0 174.0 629.6 181.4',
    localizedMeteorology: t(
      'N wind 32 kt // swell 2.4 m // sailings suspended',
      'رياح شمالية 32 عقدة // ارتفاع الموج 2.4 م // الرحلات متوقفة',
    ),
    liveHoldingDelay: '26.0 HOURS BERTH DWELL',
    strategies: [
      {
        id: 'speed',
        icon: Truck,
        name: t(
          'Rebook onto the first sailing after the window closes',
          'إعادة الحجز على أول رحلة بعد انتهاء فترة التوقف',
        ),
        tagline: t(
          'Position at the head of the yard before the berth reopens',
          'التمركز في مقدمة الساحة قبل إعادة فتح الرصيف',
        ),
        delayMitigationHours: 16,
        costVariancePercent: 4.8,
        co2OffsetKg: 0,
        confidenceScore: 79.4,
        rerouteProtocol: t('PROTOCOL-REBOOK-SAILING-10', 'بروتوكول-إعادة-حجز-الرحلة-10'),
      },
      {
        id: 'cost-esg',
        icon: Network,
        name: t(
          'Hold the load at 10th of Ramadan until a berth is confirmed',
          'إبقاء الشحنة بالعاشر من رمضان حتى تأكيد الرصيف',
        ),
        tagline: t(
          'No fuel burnt on the quay, departure moves by a day',
          'دون استهلاك وقود على الرصيف مع تأجيل الانطلاق يوماً',
        ),
        delayMitigationHours: 11,
        costVariancePercent: -9.2,
        co2OffsetKg: 780,
        confidenceScore: 88.2,
        rerouteProtocol: t('PROTOCOL-ORIGIN-HOLD-11', 'بروتوكول-الاحتجاز-بالمنشأ-11'),
      },
      {
        id: 'cold-chain-reefer',
        icon: ShieldCheck,
        name: t(
          'Shore power for reefers in the marshalling yard',
          'توصيل الشاحنات المبردة بالكهرباء الأرضية في ساحة التجميع',
        ),
        tagline: t(
          'Holds set point without running the genset through the wait',
          'الحفاظ على درجة الحرارة دون تشغيل المولد طوال فترة الانتظار',
        ),
        delayMitigationHours: 13,
        costVariancePercent: -2.6,
        co2OffsetKg: 540,
        confidenceScore: 83.8,
        rerouteProtocol: t('PROTOCOL-SHORE-POWER-12', 'بروتوكول-الكهرباء-الأرضية-12'),
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

  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(DISRUPTION_SCENARIOS[0].id)
  const [selectedStrategyId, setSelectedStrategyId] = useState<StrategyModeId>('speed')
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false)
  const [copiedToken, setCopiedToken] = useState<boolean>(false)
  const [selectedIncidentHud, setSelectedIncidentHud] = useState<boolean>(false)

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

  // Immutable Simulation Engine — every ETA is recomputed by computeEta
  // from the affected corridor's declared segment figures, so selecting a
  // strategy re-runs the arithmetic instead of reading its mitigation claim.
  const simulation: DisruptionSimulationResult = useMemo(() => {
    const corridor =
      LAND_TRADE_CORRIDORS.find(
        (c) => c.code === activeScenario.affectedCorridor.split(' // ')[0].trim(),
      ) || LAND_TRADE_CORRIDORS[0]

    const etaBaseInput: EtaInput = {
      distanceKm: corridor.distanceKm,
      avgSpeedKmh: SCENARIO_LINEHAUL_KMH,
      gateQueueMin: corridor.etaModel.gateQueueMin,
      gateQueueBandMin: corridor.etaModel.gateQueueBandMin,
      weighbridgeMin: corridor.etaModel.weighbridgeMin,
      restBreakMin: corridor.etaModel.restBreakMin,
      borderHrs: corridor.etaModel.borderHrs,
      borderBandHrs: corridor.etaModel.borderBandHrs,
    }

    const formatMinutes = (totalMinutes: number) => {
      const rounded = Math.round(totalMinutes)
      const days = Math.floor(rounded / (24 * 60))
      const h = Math.floor((rounded % (24 * 60)) / 60)
      const m = rounded % 60
      if (days > 0) return `${days}d ${h}h ${m}m`
      if (h > 0) return `${h}h ${m}m`
      return `${m}m`
    }

    const etaFor = (incidentHoldMin: number) =>
      computeEta({ ...etaBaseInput, incidentHoldMin })

    const planned = etaFor(0)
    const disrupted = etaFor(activeScenario.baseDelayHours * 60)
    const mitigated = etaFor(Math.max(0.5, activeScenario.baseDelayHours - activeStrategy.delayMitigationHours) * 60)

    const hoursSaved = (disrupted.totalMinutes - mitigated.totalMinutes) / 60
    const netDelay = (mitigated.totalMinutes - planned.totalMinutes) / 60
    const efficiencyGain = Number((22.4 + activeStrategy.confidenceScore * 0.05).toFixed(1))

    const rawSeed = `AUTH-REROUTE-${activeScenario.code}-${activeStrategy.id}-2026-GIS`
    let hash = 0
    for (let i = 0; i < rawSeed.length; i++) {
      hash = (hash << 5) - hash + rawSeed.charCodeAt(i)
      hash |= 0
    }
    const token = `0x${Math.abs(hash).toString(16).padStart(8, '0').toUpperCase()}8B4E17C2`

    const strategySavingsHours: Record<string, number> = {}
    for (const strategy of activeScenario.strategies) {
      const mitigatedFor = etaFor(
        Math.max(0.5, activeScenario.baseDelayHours - strategy.delayMitigationHours) * 60,
      )
      strategySavingsHours[strategy.id] = Number(
        ((disrupted.totalMinutes - mitigatedFor.totalMinutes) / 60).toFixed(1),
      )
    }

    return {
      activeScenario,
      selectedStrategy: activeStrategy,
      netDelayHours: Number(netDelay.toFixed(1)),
      hoursSaved: Number(hoursSaved.toFixed(1)),
      fuelEfficiencyGain: efficiencyGain,
      lossPreventionRate: `${activeStrategy.confidenceScore.toFixed(1)}% MITIGATED (MODELLED)`,
      authChecksumToken: token,
      etaPlannedFormatted: formatMinutes(planned.totalMinutes),
      etaDisruptedFormatted: formatMinutes(disrupted.totalMinutes),
      etaMitigatedFormatted: formatMinutes(mitigated.totalMinutes),
      etaBandMin: Math.round(mitigated.confidenceBandMin),
      strategySavingsHours,
    }
  }, [activeScenario, activeStrategy])

  const handleCopyToken = useCallback(() => {
    navigator.clipboard?.writeText(simulation.authChecksumToken)
    setCopiedToken(true)
    setTimeout(() => setCopiedToken(false), 2000)
  }, [simulation.authChecksumToken])

  const ui = {
    kicker: t('CORRIDOR EXCEPTION COMMAND CENTRE', 'مركز إدارة استثناءات الممرات'),
    title: t('Corridor Incident Resolution', 'معالجة حوادث الممرات البرية'),
    subtitle: t(
      'Bottleneck detection across the modelled corridor set, with reroute options costed against transit time, road charges and cargo condition.',
      'رصد الاختناقات على الممرات المشمولة بالنموذج، مع خيارات تحويل محاكاة مُقيّمة مقابل زمن الرحلة ورسوم الطريق وحالة البضاعة.',
    ),
    activeAlertsTitle: t('Active Corridor Disruptions', 'الاضطرابات النشطة على الممرات'),
    mitigationTitle: t('Select AI Autonomous Contingency Protocol', 'اختر بروتوكول التدخل الذكي المناسب'),
    authorizeBtn: t('Authorize Autonomous AI Reroute', 'اعتماد وتفعيل خطة المسار الذكية'),
    savedLabel: t('Transit Time Recovered', 'الوقت المسترد والموفر'),
    afterLabel: t('Net Delay With AI Reroute', 'مدة التأخير بعد المعالجة'),
    lossRiskLabel: t('Asset Risk Mitigation', 'حماية وسلامة الأصول'),
    modalTitle: t('Autonomous Reroute Authorization Token', 'رمز اعتماد وتفويض المسار الذاتي المشفر'),
    copy: t('Copy Authorization Token', 'نسخ رمز التفويض'),
    copied: t('Token Copied', 'تم نسخ الرمز'),
    close: t('Close', 'إغلاق'),
    etaCompareTitle: t(
      'ETA — PLANNED VS MITIGATED, RECOMPUTED PER STRATEGY',
      'زمن الوصول — المخطط مقابل ما بعد الخطة، يُعاد احتسابه لكل استراتيجية',
    ),
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
            className={`lg:col-span-7 rounded-3xl p-6 sm:p-8 border border-rose-500/30 shadow-[0_16px_50px_rgba(244,63,94,0.15)] transition-all duration-300 flex flex-col justify-between ${
              isFullscreen
                ? 'static'
                : mode === 'dark'
                ? 'bg-slate-950/85 backdrop-blur-3xl'
                : 'bg-white/95 backdrop-blur-3xl'
            }`}
          >
            {/* Top Incident Status Header */}
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-[10px] text-emerald-400 block leading-tight tracking-wider">
                      CORRIDOR INTERVENTION
                    </span>
                    <span className={`text-sm font-extrabold ${mode === 'dark' ? 'text-white' : 'text-slate-950'}`}>
                      {activeScenario.location[language]}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5 font-mono text-[9.5px] font-bold text-slate-400">
                    <Terminal className="w-3.5 h-3.5 text-gold-400" />
                    <span>CONFIDENCE: {activeStrategy.confidenceScore}%</span>
                  </div>
                </div>
              </div>

              {/* High-Resolution Interactive MapLibre GL Real Crisis Vector & Satellite Map */}
              <div className="mb-5">
                <IncidentRealMap
                  activeScenario={activeScenario}
                  activeStrategy={activeStrategy}
                  language={language}
                  isRTL={isRTL}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                  selectedIncidentHud={selectedIncidentHud}
                  setSelectedIncidentHud={setSelectedIncidentHud}
                />
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
                            -{simulation.strategySavingsHours[strategy.id] ?? 0}h
                          </span>
                        </div>
                        <div className="font-bold text-xs leading-snug mb-0.5">{strategy.name[language]}</div>
                        <div className="text-[9.5px] text-slate-400 leading-tight">{strategy.tagline[language]}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ETA strip — computeEta output for the active strategy */}
              <div className="mb-2.5 p-3 rounded-2xl border border-gold-500/15 bg-black/25 backdrop-blur-xl font-mono">
                <span className="text-[9px] font-bold text-amber-300/90 uppercase tracking-wider block mb-1.5">
                  {ui.etaCompareTitle[language]}
                </span>
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10.5px] text-slate-300">
                  <span>
                    PLANNED (NO INCIDENT) <b className="text-white">{simulation.etaPlannedFormatted}</b>
                  </span>
                  <span>
                    MITIGATED{' '}
                    <b className="text-emerald-400">{simulation.etaMitigatedFormatted}</b>
                  </span>
                  <span className="text-slate-400">
                    {simulation.etaBandMin > 0
                      ? `±${simulation.etaBandMin} MIN BAND`
                      : 'NO DECLARED SPREAD'}
                  </span>
                  <span className="text-amber-300/80 font-bold">(MODELLED)</span>
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
                  <span className="text-[9px] font-mono text-gold-400 font-semibold mt-0.5 block">
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
                  <div className="font-mono text-xl sm:text-2xl font-extrabold text-gold-300">
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
                  ? 'bg-gradient-to-r from-emerald-500 via-gold-500 to-amber-600 text-slate-950 hover:from-emerald-400 hover:to-amber-500 shadow-[0_0_25px_rgba(16,185,129,0.35)]'
                  : 'bg-gradient-to-r from-emerald-600 via-gold-600 to-amber-700 text-white hover:from-emerald-500 hover:to-amber-600 shadow-lg'
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
