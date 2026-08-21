'use client'

/**
 * CapabilitiesSection — YASLOGIST Next-Gen Platform Capabilities
 *
 * Directive 2: Zero-Color Optical Glassmorphism
 * - Strips all opaque/solid color backgrounds
 * - Applies true physical clear diamond / optical glass aesthetic
 * - (backdrop-filter: blur(24px), subtle sub-pixel metallic borders, specular top highlight reflection line)
 *
 * Directive 3: Dynamic Physics-Based Number Counters
 * - Seamless integration of <DynamicCounter /> across capability specs
 *
 * Directive 5: High-Fidelity Micro-Interactions
 * - Upgraded, physics-based interactive micro-visuals for all 6 capability cards
 */

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Brain,
  Radio,
  ShieldCheck,
  Zap,
  Globe2,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lock,
  Boxes,
  Compass,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import DynamicCounter from '@/components/DynamicCounter'
import type { CapabilityCardItem } from '@/types/land-logistics'

const t = (en: string, ar: string) => ({ en, ar })

/* ========================================================================== */
/*  6 Upgraded Interactive Micro-Visual Components                            */
/* ========================================================================== */

// 1. AI Dynamic Route Micro-Visual (Card 1)
function RouteMicroVisual({ mode, isRtl }: { mode: 'dark' | 'light'; isRtl: boolean }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden p-2.5 flex items-center justify-between transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <svg className="w-full h-full" viewBox="0 0 220 44" fill="none">
        <path
          d="M 12 22 Q 60 4, 110 22 T 208 22"
          stroke={mode === 'dark' ? 'rgba(6,182,212,0.2)' : 'rgba(8,145,178,0.25)'}
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <motion.path
          d="M 12 22 Q 60 4, 110 22 T 208 22"
          stroke="url(#route-glow-grad)"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="route-glow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0891b2" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
        <circle cx="12" cy="22" r="3.5" fill="#0891b2" />
        <circle cx="110" cy="22" r="3" fill="#22d3ee" />
        <circle cx="208" cy="22" r="3.5" fill="#0284c7" />
      </svg>
      <div
        className={`absolute top-1.5 ${isRtl ? 'left-2.5' : 'right-2.5'} text-[9px] font-mono font-bold ${
          mode === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
        }`}
      >
        AI REROUTE: &lt;50ms
      </div>
    </div>
  )
}

// 2. IoT Telemetry Radar Micro-Visual (Card 2)
function RadarMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <div className="relative w-9 h-9 flex items-center justify-center">
        <div
          className={`absolute inset-0 rounded-full border ${
            mode === 'dark' ? 'border-cyan-500/30' : 'border-cyan-600/30'
          }`}
        />
        <div
          className={`absolute inset-2 rounded-full border ${
            mode === 'dark' ? 'border-cyan-400/20' : 'border-cyan-500/20'
          }`}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className={`absolute inset-0 origin-center rounded-full ${
            mode === 'dark'
              ? 'bg-gradient-to-tr from-cyan-400/40 via-transparent to-transparent'
              : 'bg-gradient-to-tr from-cyan-600/35 via-transparent to-transparent'
          }`}
        />
        <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,1)]" />
      </div>
      <div className="flex items-center gap-2.5">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span
          className={`text-[10px] font-mono font-bold ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          MESH PING:{' '}
          <span className={mode === 'dark' ? 'text-cyan-400' : 'text-cyan-800'}>0.4ms</span>
        </span>
      </div>
    </div>
  )
}

// 3. Zero-Trust Security Micro-Visual (Card 3)
function SecurityMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`p-1.5 rounded-lg ${
            mode === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-800'
          }`}
        >
          <Lock className="w-4 h-4" />
        </div>
        <span
          className={`text-[10px] font-mono font-bold tracking-wider ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          ZERO-LOSS PROTOCOL
        </span>
      </div>
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-cyan-400/25 to-transparent pointer-events-none"
      />
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,1)]" />
        <span className="text-[9px] font-mono font-bold text-emerald-400">ENCRYPTED</span>
      </div>
    </div>
  )
}

// 4. Warehouse Robotics Micro-Visual (Card 4)
function RoboticsMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`p-1.5 rounded-lg ${
            mode === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-800'
          }`}
        >
          <Boxes className="w-4 h-4" />
        </div>
        <span
          className={`text-[10px] font-mono font-bold ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          AMR SWARM // 48 UNITS
        </span>
      </div>
      <div className="flex gap-1">
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          className="w-2 h-2 rounded-full bg-cyan-400"
        />
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.3 }}
          className="w-2 h-2 rounded-full bg-blue-400"
        />
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: 0.6 }}
          className="w-2 h-2 rounded-full bg-emerald-400"
        />
      </div>
    </div>
  )
}

// 5. Tri-Modal Logistics Grid Micro-Visual (Card 5)
function GlobeMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <div className="flex items-center gap-2">
        <Compass
          className={`w-5 h-5 animate-spin ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-800'}`}
          style={{ animationDuration: '8s' }}
        />
        <span
          className={`text-[10px] font-mono font-bold ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          TRI-MODAL: AIR · LAND · SEA
        </span>
      </div>
      <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
        SYNCED
      </span>
    </div>
  )
}

// 6. Predictive ML Capacity Micro-Visual (Card 6)
function PredictiveMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden p-2 flex items-center justify-between transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <svg className="w-full h-full" viewBox="0 0 200 40" fill="none">
        <path
          d="M 5 32 L 40 28 L 75 18 L 110 24 L 145 10 L 195 5"
          stroke={mode === 'dark' ? 'rgba(6,182,212,0.3)' : 'rgba(8,145,178,0.3)'}
          strokeWidth="2"
        />
        <motion.path
          d="M 5 32 L 40 28 L 75 18 L 110 24 L 145 10 L 195 5"
          stroke={mode === 'dark' ? '#22d3ee' : '#0891b2'}
          strokeWidth="2.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <circle cx="195" cy="5" r="3" fill="#10b981" />
      </svg>
      <div
        className={`absolute bottom-1.5 right-2.5 text-[9px] font-mono font-bold ${
          mode === 'dark' ? 'text-emerald-400' : 'text-emerald-700'
        }`}
      >
        FORECAST: 99.2% ACCURACY
      </div>
    </div>
  )
}

/* ========================================================================== */
/*  6 Capability Cards Data Models                                            */
/* ========================================================================== */

const CAPABILITY_CARDS: CapabilityCardItem[] = [
  {
    id: 'ai-routing',
    indexNumber: '01',
    icon: Brain,
    kicker: t('Intelligent Pathfinding', 'توجيه المسارات الذكي'),
    title: t('Autonomous Route Intelligence', 'ذكاء المسارات المستقل'),
    tagline: t('Sub-second dynamic transit re-optimization', 'إعادة تحسين لحظية لمسارات النقل'),
    description: t(
      'Proprietary machine learning models calculate real-time environmental variables, traffic flows, and customs queues to dynamically reroute multimodal freight with zero human friction.',
      'خوارزميات تعلم آلي متقدمة تحلل المتغيرات البيئية وحركة المرور وطوابير الجمارك لإعادة توجيه الشحنات متعددة الوسائط فورياً وبدون تدخل بشري.',
    ),
    specs: [
      { label: t('Reroute Latency', 'زمن استجابة المسار'), value: '< 50ms', numValue: 50, prefix: '< ', suffix: 'ms' },
      { label: t('Fuel Saved', 'توفير استهلاك الوقود'), value: '+18.4%', numValue: 18.4, decimals: 1, prefix: '+', suffix: '%' },
    ],
    interactiveType: 'route',
  },
  {
    id: 'fleet-telemetry',
    indexNumber: '02',
    icon: Radio,
    kicker: t('Fleet Telemetry', 'القياس عن بُعد للأسطول'),
    title: t('Omnipresent Fleet Telemetry', 'مستشعرات الأسطول الشاملة'),
    tagline: t('Continuous sub-meter GPS & sensor mesh', 'تتبع دقيق وشبكة مستشعرات لحظية'),
    description: t(
      'Direct satellite and 5G IoT links stream temperature, humidity, shock metrics, and fuel consumption across 10,000+ autonomous trucks and smart containers simultaneously.',
      'روابط مباشرة عبر الأقمار الصناعية وشبكات 5G تبث درجات الحرارة والرطوبة والاهتزازات ومعدلات الوقود لأكثر من 10,000 شاحنة وحاوية ذكية في آن واحد.',
    ),
    specs: [
      { label: t('Mesh Sync Ping', 'زمن استجابة الشبكة'), value: '0.4ms', numValue: 0.4, decimals: 1, suffix: 'ms' },
      { label: t('Global Uptime', 'جاهزية المنظومة العالمية'), value: '99.99%', numValue: 99.99, decimals: 2, suffix: '%' },
    ],
    interactiveType: 'radar',
  },
  {
    id: 'zero-loss',
    indexNumber: '03',
    icon: ShieldCheck,
    kicker: t('Cryptographic Compliance', 'الأمان والامتثال الرقمي'),
    title: t('Zero-Trust Security & Compliance', 'أمان وانعدام الفقدان (Zero-Trust)'),
    tagline: t('Hardware-sealed cryptographic chain of custody', 'سلسلة حيازة مشفرة ومحكمة العتاد'),
    description: t(
      'Automated smart locks and biometric seals generate immutable cryptographic verification tokens at every handover checkpoint, eliminating asset tampering and cargo shrinkage completely.',
      'أقفال ذكية وأختام بيومترية تنشئ رموز تحقق مشفرة غير قابلة للتغيير عند كل نقطة تسليم، مما يمنع التلاعب بالشحنات وفقدان الأصول نهائياً.',
    ),
    specs: [
      { label: t('Loss Rate SLA', 'معدل ضمان الفقدان'), value: '0.00%', numValue: 0, decimals: 2, suffix: '%' },
      { label: t('Digital Pre-clearance', 'تخليص جمركي مسبق'), value: '100%', numValue: 100, suffix: '%' },
    ],
    interactiveType: 'security',
  },
  {
    id: 'robotics',
    indexNumber: '04',
    icon: Zap,
    kicker: t('Warehouse Robotics', 'روبوتات المستودعات الذكية'),
    title: t('Autonomous Warehouse Robotics', 'أسراب الروبوتات الذاتية (AMR)'),
    tagline: t('High-density AMR swarm automation', 'أتمتة فائقة الكثافة بأسراب الروبوتات'),
    description: t(
      'Autonomous Mobile Robots (AMRs) seamlessly orchestrate high-density palletizing, picking, batch sorting, and automated dock loading without bottlenecks or operational downtime.',
      'روبوتات متنقلة ذاتية القيادة تنسق ترتيب المنصات، الفرز السريع، والتعبئة الآلية على الأرصفة بكفاءة تشغيلية مستمرة دون توقف.',
    ),
    specs: [
      { label: t('Pick Precision', 'دقة فرز الشحنات'), value: '99.98%', numValue: 99.98, decimals: 2, suffix: '%' },
      { label: t('Cycle Speed Boost', 'تسريع دورة التحميل'), value: '3.4x', numValue: 3.4, decimals: 1, suffix: 'x' },
    ],
    interactiveType: 'robotics',
  },
  {
    id: 'tri-modal',
    indexNumber: '05',
    icon: Globe2,
    kicker: t('Multimodal Infrastructure', 'البنية التحتية متعددة الوسائط'),
    title: t('Tri-Modal Logistics Grid', 'شبكة الخدمات الثلاثية (بر · جو · بحر)'),
    tagline: t('Integrated Air, Land, and Oceanic execution', 'تكامل تشغيلي بين البر والجو والمحيطات'),
    description: t(
      'Unified logistics orchestration spanning supersonic air cargo, long-haul highway platoons, and zero-emission container ships for end-to-end global supply chain velocity.',
      'منظومة موحدة تربط الشحن الجوي السريع، قوافل الشاحنات البرية ذاتية القيادة، وسفن الحاويات منعدمة الانبعاثات لتحقيق أقصى سرعة توريد عالمية.',
    ),
    specs: [
      { label: t('Active Corridors', 'الممرات اللوجستية النشطة'), value: '140+', numValue: 140, suffix: '+' },
      { label: t('Carbon Offset', 'خفض الانبعاثات الكربونية'), value: '-38%', numValue: 38, prefix: '-', suffix: '%' },
    ],
    interactiveType: 'globe',
  },
  {
    id: 'predictive-ml',
    indexNumber: '06',
    icon: TrendingUp,
    kicker: t('Predictive Analytics', 'التحليلات التنبؤية المتقدمة'),
    title: t('Predictive Capacity & Demand Engine', 'محرك التنبؤ بالطاقة الاستيعابية'),
    tagline: t('Forward-looking capacity forecasting', 'استشراف مسبق للطلب وحجم الشحنات'),
    description: t(
      'Neural demand forecasting anticipates regional seasonal surges, warehouse capacity shortfalls, and fleet distribution needs 14 days in advance with unmatched precision.',
      'شبكات عصبية اصطناعية تتنبأ بالتقلبات الموسمية، وسعة المستودعات، واحتياجات توزيع الأسطول مسبقاً بـ 14 يوماً وبدقة استشرافية لا تضاهى.',
    ),
    specs: [
      { label: t('Forecast Accuracy', 'دقة التنبؤ المسبق'), value: '99.2%', numValue: 99.2, decimals: 1, suffix: '%' },
      { label: t('Advance Notice Window', 'نافذة الاستشراف المسبق'), value: '14 DAYS', numValue: 14, suffix: ' DAYS' },
    ],
    interactiveType: 'predictive',
  },
]

/* ========================================================================== */
/*  Main Component                                                            */
/* ========================================================================== */

export default function CapabilitiesSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const isRtl = direction === 'rtl'
  const isAr = language === 'ar'
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: i * 0.08,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  }

  const renderMicroVisual = (type: CapabilityCardItem['interactiveType']) => {
    switch (type) {
      case 'route':
        return <RouteMicroVisual mode={mode} isRtl={isRtl} />
      case 'radar':
        return <RadarMicroVisual mode={mode} />
      case 'security':
        return <SecurityMicroVisual mode={mode} />
      case 'robotics':
        return <RoboticsMicroVisual mode={mode} />
      case 'globe':
        return <GlobeMicroVisual mode={mode} />
      case 'predictive':
        return <PredictiveMicroVisual mode={mode} />
      default:
        return null
    }
  }

  return (
    <section
      id="capabilities"
      dir={direction}
      className={`relative py-32 overflow-hidden transition-colors duration-500 ${
        mode === 'dark' ? 'bg-slate-950 border-t border-white/[0.08]' : 'bg-slate-100/60 border-t border-slate-200'
      }`}
    >
      {/* Dynamic Ambient Background Aura */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(6,182,212,0.06),transparent)]'
            : 'bg-[radial-gradient(ellipse_80%_50%_at_50%_15%,rgba(6,182,212,0.1),transparent)]'
        }`}
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl ${
              mode === 'dark'
                ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-800 shadow-sm'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
            <span
              className={`font-bold ${
                isAr ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'
              }`}
            >
              {t('PLATFORM ARCHITECTURE & CAPABILITIES', 'بنية المنصة والقدرات التشغيلية الذكية')[language]}
            </span>
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {t('Engineered for Autonomous Scale', 'مُهندسة للتوسع والتشغيل المستقل')[language]}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {
              t(
                'Six purpose-built intelligence pillars powering end-to-end supply chain orchestration with unprecedented precision, zero data lag, and verified physical execution.',
                'ست ركائز تقنية ذكية متخصصة تقود سلاسل التوريد المتكاملة بأقصى درجات الدقة، بدون تأخير بيانات، مع تنفيذ ميداني موثوق.',
              )[language]
            }
          </p>
        </div>

        {/* 6-Card Zero-Color Optical Diamond Glassmorphism Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CAPABILITY_CARDS.map((card, i) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={cardVariants}
                whileHover={{ y: -6, scale: 1.012 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`group relative rounded-3xl p-7 flex flex-col justify-between overflow-hidden transition-all duration-400 ${
                  mode === 'dark'
                    ? 'border border-white/10 hover:border-cyan-400/50 bg-white/[0.025] backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.1)]'
                    : 'border border-slate-300/80 hover:border-cyan-500/60 bg-white/75 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9)]'
                }`}
              >
                {/* Specular Top Reflection Line */}
                <div
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 dark:via-cyan-400/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${
                        mode === 'dark'
                          ? 'bg-white/[0.04] text-cyan-300 border border-white/15 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-cyan-50 text-cyan-800 border border-cyan-200/80 shadow-xs'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`font-mono text-xs font-extrabold px-3 py-1 rounded-full border ${
                        mode === 'dark'
                          ? 'bg-white/[0.03] border-white/10 text-cyan-400'
                          : 'bg-slate-100 border-slate-200 text-cyan-900'
                      }`}
                    >
                      {card.indexNumber}
                    </span>
                  </div>

                  {/* Eyebrow / Kicker */}
                  <span
                    className={`block font-bold mb-1.5 uppercase ${
                      isAr ? 'text-xs tracking-normal' : 'text-xs tracking-wider'
                    } ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-800'}`}
                  >
                    {card.kicker[language]}
                  </span>

                  {/* Title */}
                  <h3
                    className={`text-xl font-bold mb-2 tracking-tight ${
                      mode === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {card.title[language]}
                  </h3>

                  {/* Tagline */}
                  <p
                    className={`text-xs font-semibold mb-3 ${
                      mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                    }`}
                  >
                    {card.tagline[language]}
                  </p>

                  {/* Body Description */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                      mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    {card.description[language]}
                  </p>
                </div>

                {/* Micro-Visual Interactive HUD & Specs Matrix */}
                <div className="space-y-4 pt-4 border-t border-white/[0.08] dark:border-white/[0.08]">
                  {/* Interactive Visual Graphic */}
                  {renderMicroVisual(card.interactiveType)}

                  {/* Specification Chips with Physics Rolling Numbers */}
                  <div className="grid grid-cols-2 gap-2.5">
                    {card.specs.map((spec, specIdx) => (
                      <div
                        key={specIdx}
                        className={`p-2.5 rounded-xl border backdrop-blur-xl ${
                          mode === 'dark'
                            ? 'bg-white/[0.02] border-white/10'
                            : 'bg-white/60 border-slate-200'
                        }`}
                      >
                        <span
                          className={`block text-[10px] font-semibold uppercase mb-0.5 ${
                            mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {spec.label[language]}
                        </span>
                        <div
                          dir="ltr"
                          className={`font-mono text-xs font-extrabold ${
                            mode === 'dark' ? 'text-cyan-300' : 'text-cyan-900'
                          }`}
                        >
                          {typeof spec.numValue === 'number' ? (
                            <DynamicCounter
                              value={spec.numValue}
                              decimals={spec.decimals}
                              prefix={spec.prefix}
                              suffix={spec.suffix}
                            />
                          ) : (
                            spec.value
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Link */}
                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        mode === 'dark'
                          ? 'text-slate-400 group-hover:text-cyan-300'
                          : 'text-slate-600 group-hover:text-cyan-800'
                      }`}
                    >
                      {t('Explore Capability Architecture', 'استكشف البنية التقنية')[language]}
                      <ArrowIcon className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
