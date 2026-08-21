'use client'

/**
 * CorridorDispatchSection — YASLOGIST 6G Interactive Logistics Digital Twin
 *
 * Directives:
 * 1. Immersive Fullscreen Mode (The "World View"):
 *    - Maximize/Minimize toggle in the HUD header.
 *    - Fixed 100vw/100vh viewport transition with backdrop-blur-3xl and Escape listener.
 * 2. Interactive Pan, Zoom & Center-on-Click Physics:
 *    - Fluid drag-to-pan, inertia-based wheel zooming (1.0x to 6.0x), and on-screen zoom HUD.
 *    - On-Click Spatial Navigation: Clicking any waypoint or chokepoint smoothly animates
 *      and centers the viewport directly onto that coordinate's bounding box.
 * 3. Contextual Data HUDs (Telemetry on Click):
 *    - Interactive glassmorphic tooltip linked to the active clicked coordinate displaying
 *      localized weather, sea state, latency, and throughput index.
 * 4. True Cartographic GIS Engine (1000x500 WGS-84 Equirectangular Natural Earth Dataset).
 */

import { useState, useMemo, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Truck,
  Plane,
  Ship,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ArrowLeft,
  Lock,
  Cpu,
  Layers,
  Copy,
  CheckCircle2,
  X,
  Radio,
  Flame,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  RotateCcw,
  Navigation,
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
import { WORLD_LAND_SVG_PATH, WORLD_BORDERS_SVG_PATH } from '@/data/world-land-110m'
import { projectGeo } from '@/utils/gis-projection'
import { useGisPanZoom } from '@/hooks/useGisPanZoom'

const t = (en: string, ar: string): BilingualText => ({ en, ar })

type TrafficLightState = 'green' | 'yellow' | 'red'

interface WaypointDetail {
  name: string
  coordinates: [number, number]
  gps: [number, number]
  status: string
  weather: BilingualText
  throughputIndex: string
  avgClearanceTime: string
}

interface RealTradeCorridor extends TradeCorridorOption {
  gisOrigin: string
  gisDestination: string
  originGps: [number, number]
  destinationGps: [number, number]
  chokepointName: BilingualText
  chokepointGps: [number, number]
  catTurbulenceGps: [number, number]
  piracyZoneGps: [number, number]
  flightLevel: string
  headwindKts: number
  bathymetryDepthM: number
  axleLoadLimitT: number
  realAirPath: string
  realOceanPath: string
  realLandPath: string
  predictivePath: string
  goldBypassPath: string
  detailedWaypoints: WaypointDetail[]
}

const TRADE_CORRIDORS: RealTradeCorridor[] = [
  {
    id: 'dwc-rtm',
    code: 'CORR-DXB-RTM',
    originCity: t('Dubai World Central', 'دبي ورلد سنترال'),
    originHub: 'DWC-HUB-01',
    gisOrigin: '25°15\'N 55°18\'E',
    originGps: [55.3, 25.2],
    destinationCity: t('Rotterdam Gateway', 'بوابة روتردام'),
    destinationHub: 'RTM-GATE-04',
    gisDestination: '51°55\'N 4°29\'E',
    destinationGps: [4.48, 51.92],
    distanceKm: 5850,
    supportedModes: ['supersonic-air', 'ocean-vessel', 'electric-truck'],
    riskScore: 'LOW // 0.02%',
    flightLevel: 'FL380 // 11,580M',
    headwindKts: 42,
    bathymetryDepthM: 32,
    axleLoadLimitT: 44,
    chokepointName: t('Suez Maritime Gateway', 'ممر السويس الملاحي'),
    chokepointGps: [32.55, 29.93],
    catTurbulenceGps: [38.0, 36.0],
    piracyZoneGps: [48.0, 13.0],
    customsManifestType: t('Automated GCC-EU Green Manifest', 'بيان جمركي أخضر مؤتمت للخليج وأوروبا'),
    realAirPath: 'M 653.6 180.0 Q 585.0 125.0 512.4 105.8',
    realOceanPath: 'M 653.6 180.0 L 657.0 176.4 L 664.0 185.0 L 620.8 215.0 L 606.0 194.0 L 590.4 166.9 L 540.3 149.4 L 484.4 150.0 L 475.0 128.0 L 498.6 111.1 L 512.4 105.8',
    realLandPath: 'M 653.6 180.0 L 629.6 181.4 L 599.7 161.4 L 580.6 136.1 L 538.9 116.7 L 512.4 105.8',
    predictivePath: 'M 590.4 166.9 Q 565.0 152.0 540.3 149.4',
    goldBypassPath: 'M 653.6 180.0 Q 560.0 90.0 512.4 105.8',
    waypoints: [
      { name: 'DWC (25°N, 55°E)', coordinates: projectGeo([55.3, 25.2]), status: 'synced' },
      { name: 'BAB-EL-MANDEB', coordinates: projectGeo([43.5, 12.6]), status: 'active' },
      { name: 'SUEZ (30°N, 32°E)', coordinates: projectGeo([32.55, 29.93]), status: 'active' },
      { name: 'GIBRALTAR (36°N)', coordinates: projectGeo([-5.6, 36.0]), status: 'active' },
      { name: 'RTM (52°N, 4°E)', coordinates: projectGeo([4.48, 51.92]), status: 'synced' },
    ],
    detailedWaypoints: [
      {
        name: 'Dubai World Central (DWC)',
        coordinates: projectGeo([55.3, 25.2]),
        gps: [55.3, 25.2],
        status: 'ORIGIN_HUB',
        weather: t('Clear 32°C // Calm 8kts', 'صحو 32°م // رياح هادئة 8 عقد'),
        throughputIndex: '14,200 TEU/DAY',
        avgClearanceTime: '0.4 MIN (AI FAST-TRACK)',
      },
      {
        name: 'Bab-el-Mandeb Strait',
        coordinates: projectGeo([43.5, 12.6]),
        gps: [43.5, 12.6],
        status: 'CHOKEPOINT_MONITORED',
        weather: t('Moderate 28°C // Waves 1.2m', 'معتدل 28°م // أمواج 1.2م'),
        throughputIndex: '48 VESSELS/DAY',
        avgClearanceTime: 'REAL-TIME AIS SYNC',
      },
      {
        name: 'Suez Maritime Passage',
        coordinates: projectGeo([32.55, 29.93]),
        gps: [32.55, 29.93],
        status: 'TRANSIT_GATEWAY',
        weather: t('Breezy 24°C // N 14kts', 'رياح شمالية 24°م // 14 عقدة'),
        throughputIndex: '82 CONVOYS/DAY',
        avgClearanceTime: 'ZERO-DWELL TRANSIT',
      },
      {
        name: 'Strait of Gibraltar',
        coordinates: projectGeo([-5.6, 36.0]),
        gps: [-5.6, 36.0],
        status: 'OCEANIC_CHANNEL',
        weather: t('Overcast 19°C // W 18kts', 'غائم 19°م // رياح غربية 18 عقدة'),
        throughputIndex: '310 SHIPS/DAY',
        avgClearanceTime: 'SECURE GREEN FAIRWAY',
      },
      {
        name: 'Rotterdam Port Gateway (RTM)',
        coordinates: projectGeo([4.48, 51.92]),
        gps: [4.48, 51.92],
        status: 'DESTINATION_PORT',
        weather: t('Cool 14°C // Light Rain', 'بارد 14°م // أمطار خفيفة'),
        throughputIndex: '28,900 TEU/DAY',
        avgClearanceTime: 'AUTOMATED AMR DOCKING',
      },
    ],
  },
  {
    id: 'ruh-sin',
    code: 'CORR-RUH-SIN',
    originCity: t('Riyadh Logistics Zone', 'المنطقة اللوجستية بالرياض'),
    originHub: 'RUH-AIR-03',
    gisOrigin: '24°42\'N 46°43\'E',
    originGps: [46.67, 24.71],
    destinationCity: t('Singapore Jurong Hub', 'مركز سنغافورة جورونغ'),
    destinationHub: 'SIN-SEA-09',
    gisDestination: '1°18\'N 103°51\'E',
    destinationGps: [103.82, 1.35],
    distanceKm: 6720,
    supportedModes: ['supersonic-air', 'ocean-vessel'],
    riskScore: 'OPTIMAL // 0.01%',
    flightLevel: 'FL410 // 12,500M',
    headwindKts: 28,
    bathymetryDepthM: 65,
    axleLoadLimitT: 40,
    chokepointName: t('Strait of Malacca', 'مضيق ملقا البحري'),
    chokepointGps: [100.0, 4.0],
    catTurbulenceGps: [82.0, 10.0],
    piracyZoneGps: [98.0, 4.5],
    customsManifestType: t('Direct APAC Corridor Protocol', 'بروتوكول ممر آسيا والمحيط الهادئ المباشر'),
    realAirPath: 'M 629.6 181.4 Q 710.0 200.0 788.4 246.3',
    realOceanPath: 'M 629.6 181.4 L 664.0 185.0 L 680.6 208.3 L 723.9 233.6 L 777.8 238.9 L 788.4 246.3',
    realLandPath: 'M 629.6 181.4 L 680.0 175.0 L 730.0 190.0 L 788.4 246.3',
    predictivePath: 'M 723.9 233.6 Q 755.0 236.0 788.4 246.3',
    goldBypassPath: 'M 629.6 181.4 Q 720.0 170.0 788.4 246.3',
    waypoints: [
      { name: 'RUH (24°N, 46°E)', coordinates: projectGeo([46.67, 24.71]), status: 'synced' },
      { name: 'ARABIAN SEA', coordinates: projectGeo([65.0, 15.0]), status: 'active' },
      { name: 'SRI LANKA (6°N)', coordinates: projectGeo([80.6, 5.9]), status: 'active' },
      { name: 'MALACCA (4°N)', coordinates: projectGeo([100.0, 4.0]), status: 'active' },
      { name: 'SIN (1°N, 103°E)', coordinates: projectGeo([103.82, 1.35]), status: 'synced' },
    ],
    detailedWaypoints: [
      {
        name: 'Riyadh Logistics Zone (RUH)',
        coordinates: projectGeo([46.67, 24.71]),
        gps: [46.67, 24.71],
        status: 'ORIGIN_HUB',
        weather: t('Dry 30°C // NW 6kts', 'جاف 30°م // شمالية غربية 6 عقد'),
        throughputIndex: '9,800 TONS/DAY',
        avgClearanceTime: 'INSTANT PRE-CLEAR',
      },
      {
        name: 'Strait of Malacca Fairway',
        coordinates: projectGeo([100.0, 4.0]),
        gps: [100.0, 4.0],
        status: 'HIGH_DENSITY_CHANNEL',
        weather: t('Tropical 29°C // Calm Currents', 'استوائي 29°م // تيارات هادئة'),
        throughputIndex: '240 VESSELS/DAY',
        avgClearanceTime: 'GEOFENCED AUTO-DISPATCH',
      },
      {
        name: 'Singapore Jurong Mega-Port (SIN)',
        coordinates: projectGeo([103.82, 1.35]),
        gps: [103.82, 1.35],
        status: 'DESTINATION_HUB',
        weather: t('Humid 28°C // Light Breeze', 'رطب 28°م // نسيم لطيف'),
        throughputIndex: '36,500 TEU/DAY',
        avgClearanceTime: '0.2 MIN ROBOTIC DOCK',
      },
    ],
  },
  {
    id: 'fra-ord',
    code: 'CORR-FRA-ORD',
    originCity: t('Frankfurt Cargo City', 'فرانكفورت كارجو سيتي'),
    originHub: 'FRA-HUB-02',
    gisOrigin: '50°02\'N 8°34\'E',
    originGps: [8.57, 50.03],
    destinationCity: t('Chicago O’Hare Logistics', 'شيكاغو أوهير اللوجستية'),
    destinationHub: 'ORD-AIR-08',
    gisDestination: '41°58\'N 87°54\'W',
    destinationGps: [-87.90, 41.98],
    distanceKm: 6980,
    supportedModes: ['supersonic-air', 'ocean-vessel'],
    riskScore: 'ZERO-LOSS // 0.00%',
    flightLevel: 'FL360 // 10,970M',
    headwindKts: 68,
    bathymetryDepthM: 3800,
    axleLoadLimitT: 44,
    chokepointName: t('North Atlantic Jetstream Front', 'التيار النفاث لشمال الأطلسي'),
    chokepointGps: [-35.0, 56.0],
    catTurbulenceGps: [-35.0, 56.0],
    piracyZoneGps: [-45.0, 40.0],
    customsManifestType: t('Transatlantic Zero-Trust Transit', 'عبور رقمي آمن عبر الأطلسي'),
    realAirPath: 'M 523.8 111.0 Q 402.8 70.0 255.8 133.4',
    realOceanPath: 'M 523.8 111.0 L 498.6 111.1 L 460.0 120.0 L 402.8 135.0 L 323.6 126.1 L 275.0 130.0 L 255.8 133.4',
    realLandPath: 'M 523.8 111.0 L 480.0 115.0 L 323.6 126.1 L 255.8 133.4',
    predictivePath: 'M 402.8 88.9 Q 340.0 105.0 255.8 133.4',
    goldBypassPath: 'M 523.8 111.0 Q 380.0 40.0 255.8 133.4',
    waypoints: [
      { name: 'FRA (50°N, 8°E)', coordinates: projectGeo([8.57, 50.03]), status: 'synced' },
      { name: 'NORTH ATLANTIC', coordinates: projectGeo([-35.0, 58.0]), status: 'active' },
      { name: 'HALIFAX (44°N)', coordinates: projectGeo([-63.5, 44.6]), status: 'active' },
      { name: 'ORD (42°N, 87°W)', coordinates: projectGeo([-87.90, 41.98]), status: 'synced' },
    ],
    detailedWaypoints: [
      {
        name: 'Frankfurt Cargo City (FRA)',
        coordinates: projectGeo([8.57, 50.03]),
        gps: [8.57, 50.03],
        status: 'ORIGIN_AIRPORT',
        weather: t('Mild 16°C // SW 12kts', 'معتدل 16°م // جنوبية غربية 12 عقدة'),
        throughputIndex: '6,200 TONS/DAY',
        avgClearanceTime: 'CRYOGENIC AIR SEALED',
      },
      {
        name: 'North Atlantic Polar Apex',
        coordinates: projectGeo([-35.0, 58.0]),
        gps: [-35.0, 58.0],
        status: 'POLAR_FLIGHT_APEX',
        weather: t('OAT -54°C // Headwind 68kts', 'حرارة جوية -54°م // رياح 68 عقدة'),
        throughputIndex: 'FL410 SUPERSONIC VECTOR',
        avgClearanceTime: 'OPTIMIZED JETSTREAM',
      },
      {
        name: 'Chicago O’Hare Cargo (ORD)',
        coordinates: projectGeo([-87.90, 41.98]),
        gps: [-87.90, 41.98],
        status: 'DESTINATION_HUB',
        weather: t('Clear 21°C // W 10kts', 'صافٍ 21°م // غربية 10 عقد'),
        throughputIndex: '18,400 TONS/DAY',
        avgClearanceTime: 'DIRECT HIGHWAY DISPATCH',
      },
    ],
  },
  {
    id: 'sha-lax',
    code: 'CORR-SHA-LAX',
    originCity: t('Shanghai Deepwater Port', 'ميناء شنغهاي للمياه العميقة'),
    originHub: 'SHA-PORT-07',
    gisOrigin: '31°13\'N 121°28\'E',
    originGps: [121.47, 31.23],
    destinationCity: t('Los Angeles Long Beach', 'لوس أنجلوس لونغ بيتش'),
    destinationHub: 'LAX-SEA-01',
    gisDestination: '33°45\'N 118°11\'W',
    destinationGps: [-118.41, 33.94],
    distanceKm: 10450,
    supportedModes: ['ocean-vessel', 'supersonic-air'],
    riskScore: 'MONITORED // 0.04%',
    flightLevel: 'FL390 // 11,890M',
    headwindKts: 54,
    bathymetryDepthM: 5200,
    axleLoadLimitT: 42,
    chokepointName: t('Mid-Pacific International Date Line', 'خط التاريخ الدولي وسط الهادئ'),
    chokepointGps: [-175.0, 28.0],
    catTurbulenceGps: [150.0, 35.0],
    piracyZoneGps: [130.0, 20.0],
    customsManifestType: t('Trans-Pacific Digital Clearing', 'تخليص رقمي فوري عبر المحيط الهادئ'),
    realAirPath: 'M 837.4 163.3 Q 950.0 120.0 1000.0 135.0 M 0.0 135.0 Q 80.0 135.0 171.1 155.7',
    realOceanPath: 'M 837.4 163.3 L 888.1 150.8 L 980.0 170.0 L 1000.0 175.0 M 0.0 175.0 L 61.7 190.8 L 171.1 155.7',
    realLandPath: 'M 837.4 163.3 L 888.1 150.8 L 171.1 155.7',
    predictivePath: 'M 0.0 175.0 Q 80.0 180.0 171.1 155.7',
    goldBypassPath: 'M 837.4 163.3 Q 950.0 100.0 1000.0 120.0 M 0.0 120.0 Q 80.0 120.0 171.1 155.7',
    waypoints: [
      { name: 'SHA (31°N, 121°E)', coordinates: projectGeo([121.47, 31.23]), status: 'synced' },
      { name: 'PACIFIC DEEP', coordinates: projectGeo([160.0, 32.0]), status: 'active' },
      { name: 'HAWAII (21°N)', coordinates: projectGeo([-157.8, 21.3]), status: 'active' },
      { name: 'LAX (34°N, 118°W)', coordinates: projectGeo([-118.41, 33.94]), status: 'synced' },
    ],
    detailedWaypoints: [
      {
        name: 'Shanghai Yangshan Port (SHA)',
        coordinates: projectGeo([121.47, 31.23]),
        gps: [121.47, 31.23],
        status: 'ORIGIN_DEEPWATER_PORT',
        weather: t('Warm 26°C // SE 10kts', 'دافئ 26°م // جنوبية شرقية 10 عقد'),
        throughputIndex: '47,000 TEU/DAY',
        avgClearanceTime: 'ZERO-PAPERWORK AI MANIFEST',
      },
      {
        name: 'Hawaii Oceanic Relay',
        coordinates: projectGeo([-157.8, 21.3]),
        gps: [-157.8, 21.3],
        status: 'PACIFIC_WAYPOINT',
        weather: t('Tropical 27°C // NE Trade Winds', 'استوائي 27°م // رياح تجارية'),
        throughputIndex: 'TRANS-PACIFIC SECURED',
        avgClearanceTime: 'AUTONOMOUS BUOY MESH',
      },
      {
        name: 'Los Angeles Long Beach (LAX)',
        coordinates: projectGeo([-118.41, 33.94]),
        gps: [-118.41, 33.94],
        status: 'DESTINATION_GATEWAY',
        weather: t('Sunny 24°C // W 8kts', 'مشمس 24°م // غربية 8 عقد'),
        throughputIndex: '26,000 TEU/DAY',
        avgClearanceTime: 'AUTOMATED SMART TRUCK PICKUP',
      },
    ],
  },
]

const TRANSPORT_MODES: TransportModeOption[] = [
  {
    id: 'electric-truck',
    icon: Truck,
    name: t('Autonomous Highway Fleet', 'شاحنات كهربائية ذاتية القيادة'),
    speedDescriptor: t('Multi-Lane Highway Vector', 'مسار سريع متعدد المسارات'),
    efficiencyRating: '94.8% ESG',
    baseCostPerTonKm: 0.14,
    baseSpeedKmh: 85,
    emissionsFactor: 0.015,
  },
  {
    id: 'supersonic-air',
    icon: Plane,
    name: t('AI-Routed Air Cargo', 'الشحن الجوي الذكي'),
    speedDescriptor: t('High-Altitude Parabolic Curve', 'منحنى جوي فائق الارتفاع'),
    efficiencyRating: '99.9% Uptime',
    baseCostPerTonKm: 0.88,
    baseSpeedKmh: 820,
    emissionsFactor: 0.12,
  },
  {
    id: 'ocean-vessel',
    icon: Ship,
    name: t('Zero-Emission Container Fleet', 'سفن الحاويات منعدمة الانبعاثات'),
    speedDescriptor: t('Maritime Nautical Fairway', 'ممر ملاحي بحري مخصص'),
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
  const [trafficLightState, setTrafficLightState] = useState<TrafficLightState>('green')
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [manifestModalOpen, setManifestModalOpen] = useState<boolean>(false)
  const [copiedHash, setCopiedHash] = useState<boolean>(false)
  const [selectedWaypointNode, setSelectedWaypointNode] = useState<WaypointDetail | null>(null)

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

  // Keyboard Escape Handler to exit Fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false)
        setSelectedWaypointNode(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Mathematical Calculation
  const calculation: DispatchSimulationOutput = useMemo(() => {
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

    const rawSeed = `${activeCorridor.code}-${activeMode.id}-${activeCargo.id}-${safePayload}T-6G-INTERACTIVE`
    let pseudoHash = 0
    for (let i = 0; i < rawSeed.length; i++) {
      pseudoHash = (pseudoHash << 5) - pseudoHash + rawSeed.charCodeAt(i)
      pseudoHash |= 0
    }
    const hexHash = `0x${Math.abs(pseudoHash).toString(16).padStart(8, '0').toUpperCase()}6G9F2E7C4B18`

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
    if (selectedModeId === 'ocean-vessel') {
      return {
        cardBorder: 'border-teal-500/40',
        glow: 'shadow-[0_0_50px_rgba(20,184,166,0.18)]',
        accentText: 'text-teal-300',
        accentBg: 'bg-teal-500/10',
      }
    }
    if (selectedModeId === 'electric-truck') {
      return {
        cardBorder: 'border-emerald-500/40',
        glow: 'shadow-[0_0_50px_rgba(16,185,129,0.18)]',
        accentText: 'text-emerald-300',
        accentBg: 'bg-emerald-500/10',
      }
    }
    return {
      cardBorder: 'border-cyan-500/40',
      glow: 'shadow-[0_0_50px_rgba(6,182,212,0.2)]',
      accentText: 'text-cyan-300',
      accentBg: 'bg-cyan-500/10',
    }
  }, [trafficLightState, selectedModeId])

  // Active Geographic Trajectory Path based on modality
  const activeTrajectoryPath = useMemo(() => {
    if (selectedModeId === 'supersonic-air') {
      return activeCorridor.realAirPath
    } else if (selectedModeId === 'ocean-vessel') {
      return activeCorridor.realOceanPath
    } else {
      return activeCorridor.realLandPath
    }
  }, [activeCorridor, selectedModeId])

  const chokepointPixels = useMemo(() => projectGeo(activeCorridor.chokepointGps), [activeCorridor])
  const catPixels = useMemo(() => projectGeo(activeCorridor.catTurbulenceGps), [activeCorridor])
  const piracyPixels = useMemo(() => projectGeo(activeCorridor.piracyZoneGps), [activeCorridor])

  // Handle Node Center-on-Click
  const handleNodeClick = useCallback(
    (wp: WaypointDetail) => {
      setSelectedWaypointNode(wp)
      centerOnPoint(wp.coordinates[0], wp.coordinates[1], 2.8)
    },
    [centerOnPoint],
  )

  // i18n Matrix
  const ui = {
    kicker: t('6G PREDICTIVE LOGISTICS DIGITAL TWIN', 'التوأم الرقمي اللوجستي التنبؤي بتقنية 6G'),
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
    fuelLabel: t('Fleet Energy Efficiency', 'كفاءة الطاقة والوقود'),
    co2Label: t('Carbon Offset Reduction', 'خفض الانبعاثات الكربونية'),
    costLabel: t('Dynamic Cost Estimate', 'تقدير التكلفة التشغيلية'),
    generateBtn: t('Generate Cryptographic Manifest', 'إنشاء البيان الرقمي المشفر'),
    manifestTitle: t('Cryptographic Consignment Manifest', 'البيان الجمركي الرقمي المشفر'),
    close: t('Close', 'إغلاق'),
    copied: t('Copied to clipboard', 'تم النسخ للحافظة'),
    copy: t('Copy Hash Token', 'نسخ الرمز المشفر'),
    trafficStateGreen: t('GREEN: OPTIMAL // 99.9% SLA', 'أخضر: مثالي // امتثال 99.9%'),
    trafficStateYellow: t('YELLOW: RESILIENCE SHORTCUTS', 'أصفر: مسارات المرونة السريعة'),
    trafficStateRed: t('RED: EMERGENCY RESILIENT BYPASS', 'أحمر: مسار الطوارئ الذهبي المشفر'),
    fullscreen: t('World View Fullscreen', 'عرض الخريطة الكامل للشاشة'),
    exitFullscreen: t('Exit Fullscreen', 'إنهاء وضع ملء الشاشة'),
    zoomIn: t('Zoom In', 'تكبير'),
    zoomOut: t('Zoom Out', 'تصغير'),
    resetView: t('Reset View', 'إعادة ضبط الخريطة'),
    nodeTelemetry: t('Localized Node Telemetry', 'بيانات القياس الموضعية للموقع'),
  }

  return (
    <section
      id="dispatch-optimizer"
      dir={direction}
      className={`relative py-32 overflow-hidden transition-colors duration-500 ${
        mode === 'dark' ? 'bg-slate-950 border-t border-white/[0.08]' : 'bg-slate-50 border-t border-slate-200'
      }`}
    >
      {/* Ambient Dynamic Glow Aura */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          trafficLightState === 'red'
            ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(244,63,94,0.12),transparent)]'
            : trafficLightState === 'yellow'
              ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(245,158,11,0.12),transparent)]'
              : mode === 'dark'
                ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(6,182,212,0.06),transparent)]'
                : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(6,182,212,0.1),transparent)]'
        }`}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl ${contextualAura.accentBg} ${contextualAura.cardBorder} ${contextualAura.accentText} ${contextualAura.glow}`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
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

        {/* Dual-Column Interactive Matrix & GIS Telemetry Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Interactive Parameters Console with Contextual Glassmorphic Tinting (5 Columns) */}
          <div
            className={`lg:col-span-5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl transition-all duration-500 border ${contextualAura.cardBorder} ${contextualAura.glow} ${
              mode === 'dark' ? 'bg-black/40' : 'bg-white/90'
            }`}
          >
            {/* 1. Corridor Selector */}
            <div className="mb-6">
              <label
                className={`block font-bold mb-3 ${
                  isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}
              >
                {ui.corridorLabel[language]}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {TRADE_CORRIDORS.map((corr) => {
                  const isSelected = corr.id === selectedCorridorId
                  return (
                    <button
                      key={corr.id}
                      onClick={() => {
                        setSelectedCorridorId(corr.id)
                        setSelectedWaypointNode(null)
                        resetView()
                      }}
                      className={`p-3 rounded-2xl text-start transition-all duration-200 border flex flex-col justify-between ${
                        isSelected
                          ? mode === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : 'bg-cyan-50 border-cyan-600 text-cyan-950 shadow-sm'
                          : mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
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

            {/* 2. Modality Switcher with 6G Descriptors */}
            <div className="mb-6">
              <label
                className={`block font-bold mb-3 ${
                  isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-wider'
                } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}
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
                      className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1.5 border transition-all duration-200 text-center ${
                        isSelected
                          ? mode === 'dark'
                            ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                            : 'bg-cyan-50 border-cyan-600 text-cyan-950 shadow-sm'
                          : mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span className="text-[11px] font-bold leading-tight">{tm.name[language]}</span>
                      <span className="font-mono text-[8.5px] text-cyan-400 font-semibold">{tm.efficiencyRating}</span>
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
                } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}
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
                            ? 'bg-cyan-500/15 border-cyan-400 text-white'
                            : 'bg-cyan-50 border-cyan-600 text-cyan-950'
                          : mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10 text-slate-400 hover:border-white/20'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
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
                  } ${mode === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}
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
              className={`w-full group py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 backdrop-blur-xl ${
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

          {/* Right Column: 6G Real Cartographic GIS Vector Map Canvas & Traffic Light HUD (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Dynamic Cartographic GIS Vector Canvas Card */}
            <div
              className={`relative rounded-3xl p-6 sm:p-7 overflow-hidden backdrop-blur-3xl border transition-all duration-500 ${
                isFullscreen
                  ? 'fixed inset-0 z-[100] w-screen h-screen rounded-none p-6 sm:p-10 bg-slate-950/98 backdrop-blur-3xl flex flex-col justify-between'
                  : `${contextualAura.cardBorder} ${contextualAura.glow} ${mode === 'dark' ? 'bg-slate-950/85' : 'bg-white/95'}`
              }`}
            >
              {/* Top HUD Header Status Bar with Layer Badges & Fullscreen Trigger */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08] dark:border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  </span>
                  <span className="font-mono font-extrabold text-[11px] text-cyan-400 tracking-wider">
                    6G_GIS_CARTOGRAPHY // {activeCorridor.code}
                  </span>
                </div>

                {/* Heatmap Toggle, Telemetry Latency & Fullscreen World View Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold border transition-colors flex items-center gap-1 ${
                      showHeatmap
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50'
                        : 'bg-slate-800/60 text-slate-400 border-white/10'
                    }`}
                  >
                    <Flame className="w-3 h-3 text-cyan-400" />
                    <span>HEATMAP {showHeatmap ? 'ON' : 'OFF'}</span>
                  </button>

                  <div className="hidden sm:flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="font-mono text-[9.5px] font-bold text-slate-400">
                      {calculation.meshNodePingMs}ms
                    </span>
                  </div>

                  {/* Directive 1: Fullscreen "World View" Mode Toggle */}
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    title={isFullscreen ? ui.exitFullscreen[language] : ui.fullscreen[language]}
                    className="p-1.5 rounded-xl border border-white/10 bg-slate-800/70 hover:bg-slate-700 text-cyan-300 hover:text-white transition-colors"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3-State Traffic Light Protocol HUD Bar */}
              <div className="mb-4 p-2.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">
                    TRAFFIC PROTOCOL:
                  </span>
                  <span className={`text-[10px] font-mono font-extrabold ${contextualAura.accentText}`}>
                    {trafficLightState === 'green'
                      ? ui.trafficStateGreen[language]
                      : trafficLightState === 'yellow'
                        ? ui.trafficStateYellow[language]
                        : ui.trafficStateRed[language]}
                  </span>
                </div>

                {/* 3 Interactive LED Switches */}
                <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-white/10">
                  <button
                    onClick={() => setTrafficLightState('green')}
                    title="Green: 99.9% On-Time Protocol"
                    className={`w-4 h-4 rounded-full transition-all ${
                      trafficLightState === 'green'
                        ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,1)] scale-110'
                        : 'bg-emerald-950 border border-emerald-800/60 opacity-40 hover:opacity-80'
                    }`}
                  />
                  <button
                    onClick={() => setTrafficLightState('yellow')}
                    title="Yellow: Resilience Shortcut Protocol"
                    className={`w-4 h-4 rounded-full transition-all ${
                      trafficLightState === 'yellow'
                        ? 'bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,1)] scale-110'
                        : 'bg-amber-950 border border-amber-800/60 opacity-40 hover:opacity-80'
                    }`}
                  />
                  <button
                    onClick={() => setTrafficLightState('red')}
                    title="Red: Emergency Monochrome Protocol"
                    className={`w-4 h-4 rounded-full transition-all ${
                      trafficLightState === 'red'
                        ? 'bg-rose-500 shadow-[0_0_14px_rgba(244,63,94,1)] scale-110'
                        : 'bg-rose-950 border border-rose-800/60 opacity-40 hover:opacity-80'
                    }`}
                  />
                </div>
              </div>

              {/* High-Resolution Interactive Cartographic GIS Vector Map Canvas */}
              <div
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onWheel={handleWheel}
                className={`relative w-full rounded-2xl overflow-hidden bg-[#030712] border border-cyan-500/20 p-4 flex items-center justify-center transition-all duration-700 select-none ${
                  isDragging ? 'cursor-grabbing' : 'cursor-grab'
                } ${isFullscreen ? 'flex-1 min-h-[550px]' : 'h-72 sm:h-80'} ${
                  trafficLightState === 'red' ? 'grayscale-[0.95] contrast-[1.2]' : ''
                }`}
              >
                {/* SVG Real World Cartographic Map with Natural Earth TopoJSON & Dynamic Transform Matrix */}
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 1000 500"
                  preserveAspectRatio="none"
                >
                  <defs>
                    {/* Genuine Multi-Stage Optical Neon Filters */}
                    <filter id="gis-real-cyan" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur1" />
                      <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur2" />
                      <feMerge>
                        <feMergeNode in="blur2" />
                        <feMergeNode in="blur1" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="gis-real-purple" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    <filter id="gis-real-gold" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>

                    {/* Gradient Beam for Active Route */}
                    <linearGradient id="gis-real-active-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>

                    {/* Heatmap Gradients */}
                    <radialGradient id="heatmap-real-cold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(59,130,246,0.35)" />
                      <stop offset="100%" stopColor="rgba(59,130,246,0)" />
                    </radialGradient>
                    <radialGradient id="heatmap-real-hot" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="rgba(239,68,68,0.4)" />
                      <stop offset="100%" stopColor="rgba(239,68,68,0)" />
                    </radialGradient>
                  </defs>

                  {/* Directive 2: Transform Matrix Group for Smooth 60fps Pan and Zoom */}
                  <g
                    transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
                    style={{ transformOrigin: '500px 250px', willChange: 'transform' }}
                  >
                    {/* 1. Geographic Graticule (Lat/Long Navigation Parallels & Meridians) */}
                    <g stroke="rgba(6,182,212,0.12)" strokeWidth="0.8" strokeDasharray="4 6">
                      <line x1="0" y1="65.3" x2="1000" y2="65.3" />
                      <line x1="0" y1="184.7" x2="1000" y2="184.7" />
                      <line x1="0" y1="250.0" x2="1000" y2="250.0" stroke="rgba(6,182,212,0.25)" strokeWidth="1.2" strokeDasharray="none" />
                      <line x1="0" y1="315.3" x2="1000" y2="315.3" />
                      <line x1="166.7" y1="0" x2="166.7" y2="500" />
                      <line x1="333.3" y1="0" x2="333.3" y2="500" />
                      <line x1="500.0" y1="0" x2="500.0" y2="500" stroke="rgba(6,182,212,0.25)" strokeWidth="1.2" strokeDasharray="none" />
                      <line x1="666.7" y1="0" x2="666.7" y2="500" />
                      <line x1="833.3" y1="0" x2="833.3" y2="500" />
                    </g>

                    {/* 2. Real Cartographic World Continents & Coastlines (Natural Earth Dataset) */}
                    <path
                      d={WORLD_LAND_SVG_PATH}
                      fill="rgba(6,182,212,0.06)"
                      stroke="rgba(6,182,212,0.45)"
                      strokeWidth="1.2"
                      className="transition-colors duration-500 pointer-events-none"
                    />
                    <path
                      d={WORLD_BORDERS_SVG_PATH}
                      fill="none"
                      stroke="rgba(6,182,212,0.18)"
                      strokeWidth="0.75"
                      className="pointer-events-none"
                    />

                    {/* 3. Quantitative Efficiency Heatmap Layer */}
                    {showHeatmap && (
                      <g className="pointer-events-none transition-opacity duration-500">
                        <circle cx="590.4" cy="166.9" r="60" fill="url(#heatmap-real-hot)" />
                        <circle cx="777.8" cy="238.9" r="55" fill="url(#heatmap-real-hot)" />
                        <circle cx="402.8" cy="94.4" r="70" fill="url(#heatmap-real-cold)" />
                        <circle cx="837.4" cy="163.3" r="55" fill="url(#heatmap-real-cold)" />
                      </g>
                    )}

                    {/* 4. AVIATION LAYER: Clear Air Turbulence (CAT) Zone */}
                    {selectedModeId === 'supersonic-air' && (
                      <g className="pointer-events-none">
                        <circle
                          cx={catPixels[0]}
                          cy={catPixels[1]}
                          r="35"
                          fill="rgba(244,63,94,0.18)"
                          stroke="rgba(244,63,94,0.5)"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                        />
                      </g>
                    )}

                    {/* 5. MARITIME LAYER: High-Risk Piracy IMB Zone */}
                    {selectedModeId === 'ocean-vessel' && (
                      <g className="pointer-events-none">
                        <circle
                          cx={piracyPixels[0]}
                          cy={piracyPixels[1]}
                          r="30"
                          fill="rgba(168,85,247,0.2)"
                          stroke="rgba(168,85,247,0.6)"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                        />
                      </g>
                    )}

                    {/* 6. Active Telemetry Guide Track */}
                    <path
                      d={activeTrajectoryPath}
                      fill="none"
                      stroke={
                        selectedModeId === 'supersonic-air'
                          ? 'rgba(6,182,212,0.3)'
                          : selectedModeId === 'ocean-vessel'
                            ? 'rgba(20,184,166,0.3)'
                            : 'rgba(234,88,12,0.3)'
                      }
                      strokeWidth={selectedModeId === 'electric-truck' ? '8' : '5'}
                      className="pointer-events-none"
                    />

                    {/* 7. Active 6G Telemetry Beam with Genuine Neon Filter */}
                    <motion.path
                      d={activeTrajectoryPath}
                      fill="none"
                      stroke="url(#gis-real-active-gradient)"
                      strokeWidth={selectedModeId === 'electric-truck' ? '4.5' : '3.2'}
                      strokeDasharray={selectedModeId === 'supersonic-air' ? '12 6' : '10 5'}
                      filter="url(#gis-real-cyan)"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: -60 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      className="pointer-events-none"
                    />

                    {/* 8. Directive 4: Predictive Purple Telemetry Vector (T+3.0H) */}
                    <path
                      d={activeCorridor.predictivePath}
                      fill="none"
                      stroke="#c084fc"
                      strokeWidth="3.5"
                      strokeDasharray="6 6"
                      filter="url(#gis-real-purple)"
                      className="opacity-85 pointer-events-none"
                    />

                    {/* 9. Yellow Resilience Shortcut Vector */}
                    {trafficLightState === 'yellow' && (
                      <motion.path
                        d={activeCorridor.goldBypassPath}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="3.5"
                        strokeDasharray="6 6"
                        initial={{ strokeDashoffset: 0 }}
                        animate={{ strokeDashoffset: -40 }}
                        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                        className="pointer-events-none"
                      />
                    )}

                    {/* 10. Red Emergency Singular Gold Resilient Bypass Vector */}
                    {trafficLightState === 'red' && (
                      <motion.path
                        d={activeCorridor.goldBypassPath}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="6"
                        filter="url(#gis-real-gold)"
                        strokeDasharray="14 7"
                        initial={{ strokeDashoffset: 0 }}
                        animate={{ strokeDashoffset: -70 }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        className="pointer-events-none"
                      />
                    )}

                    {/* Directive 2: Interactive Clickable Waypoint Nodes with Center-on-Click Physics */}
                    {activeCorridor.detailedWaypoints.map((wp, i) => {
                      const isNodeSelected = selectedWaypointNode?.name === wp.name
                      return (
                        <g
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleNodeClick(wp)
                          }}
                          className="cursor-pointer group"
                        >
                          <circle
                            cx={wp.coordinates[0]}
                            cy={wp.coordinates[1]}
                            r={isNodeSelected ? '14' : '9'}
                            fill={isNodeSelected ? 'rgba(6,182,212,0.5)' : 'rgba(6,182,212,0.3)'}
                            filter="url(#gis-real-cyan)"
                            className="transition-all duration-300"
                          />
                          <circle
                            cx={wp.coordinates[0]}
                            cy={wp.coordinates[1]}
                            r={isNodeSelected ? '6' : '4.5'}
                            fill={isNodeSelected ? '#ffffff' : '#22d3ee'}
                            className="transition-all duration-300"
                          />
                          <circle cx={wp.coordinates[0]} cy={wp.coordinates[1]} r="2" fill="#030712" />
                        </g>
                      )
                    })}

                    {/* Active Chokepoint Bottleneck Node Marker */}
                    <g
                      onClick={(e) => {
                        e.stopPropagation()
                        centerOnPoint(chokepointPixels[0], chokepointPixels[1], 3.0)
                      }}
                      className="cursor-pointer"
                    >
                      <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="13" fill="rgba(245,158,11,0.4)" filter="url(#gis-real-cyan)" />
                      <circle cx={chokepointPixels[0]} cy={chokepointPixels[1]} r="6" fill="#f59e0b" />
                    </g>
                  </g>
                </svg>

                {/* On-Screen Zoom & View Control HUD (Directive 2) */}
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

                {/* Directive 3: Contextual Data HUD (Telemetry on Click) */}
                <AnimatePresence>
                  {selectedWaypointNode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 10 }}
                      className={`absolute bottom-4 ${
                        isRTL ? 'right-4' : 'left-4'
                      } z-40 max-w-sm w-full p-4 rounded-2xl border border-cyan-500/40 bg-slate-900/95 backdrop-blur-2xl shadow-[0_0_35px_rgba(6,182,212,0.3)] text-white font-mono`}
                    >
                      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-bold text-xs text-cyan-300 truncate">
                            {selectedWaypointNode.name}
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedWaypointNode(null)}
                          className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2 text-[10.5px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">GPS COORDINATES:</span>
                          <span className="text-white font-bold">{selectedWaypointNode.gps[1]}°N, {selectedWaypointNode.gps[0]}°E</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">METEOROLOGICAL:</span>
                          <span className="text-emerald-400 font-semibold">{selectedWaypointNode.weather[language]}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">THROUGHPUT:</span>
                          <span className="text-cyan-300 font-bold">{selectedWaypointNode.throughputIndex}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">CLEARANCE:</span>
                          <span className="text-emerald-400 font-bold">{selectedWaypointNode.avgClearanceTime}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Customs Protocol Badge */}
                <div className={`absolute bottom-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'} z-20`}>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9.5px] font-mono font-bold bg-slate-950/95 text-emerald-400 border border-emerald-500/40 backdrop-blur-md shadow-md">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    {activeCorridor.customsManifestType[language]}
                  </span>
                </div>
              </div>

              {/* Mode-Specific Telemetry Strip (Aviation / Maritime / Land) */}
              <div className="mt-3.5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs">
                {selectedModeId === 'supersonic-air' && (
                  <div className="flex items-center gap-3 font-mono text-[10.5px]">
                    <span className="text-cyan-300 font-bold">{activeCorridor.flightLevel}</span>
                    <span className="text-slate-400">HEADWIND: {activeCorridor.headwindKts} KTS</span>
                    <span className="text-emerald-400 font-semibold">CAT: MINIMAL</span>
                  </div>
                )}
                {selectedModeId === 'ocean-vessel' && (
                  <div className="flex items-center gap-3 font-mono text-[10.5px]">
                    <span className="text-teal-300 font-bold">DEPTH: &gt;{activeCorridor.bathymetryDepthM}M</span>
                    <span className="text-slate-400">CURRENTS: 1.8 KTS NE</span>
                    <span className="text-emerald-400 font-semibold">FAIRWAY: SECURED</span>
                  </div>
                )}
                {selectedModeId === 'electric-truck' && (
                  <div className="flex items-center gap-3 font-mono text-[10.5px]">
                    <span className="text-emerald-300 font-bold">AXLE: {activeCorridor.axleLoadLimitT}T MAX</span>
                    <span className="text-slate-400">CLEARANCE: 4.5M</span>
                    <span className="text-cyan-400 font-semibold">SLOT: #84-A ACTIVE</span>
                  </div>
                )}
                <div className="font-mono font-bold text-emerald-400">
                  RISK: {activeCorridor.riskScore}
                </div>
              </div>
            </div>

            {/* Bottom 4 Calculated Metrics Cards Matrix */}
            {!isFullscreen && (
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
                    6G AUTONOMOUS
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
            )}

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
