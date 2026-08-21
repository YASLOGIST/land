'use client'

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
import type { CapabilityCardItem } from '@/types/land-logistics'

const t = (en: string, ar: string) => ({ en, ar })

/* ========================================================================== */
/*  6 Distinct Interactive Micro-Visual Components                            */
/* ========================================================================== */

// 1. AI Dynamic Route Micro-Visual
function RouteMicroVisual({ mode, isRtl }: { mode: 'dark' | 'light'; isRtl: boolean }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden p-2.5 flex items-center justify-between transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/40 border border-white/[0.08]'
          : 'bg-white/50 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
      }`}
    >
      <svg className="w-full h-full" viewBox="0 0 220 44" fill="none">
        <path
          d="M 12 22 Q 60 4, 110 22 T 208 22"
          stroke={mode === 'dark' ? 'rgba(6,182,212,0.25)' : 'rgba(8,145,178,0.35)'}
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
        <circle cx="12" cy="22" r="4" fill="#0891b2" />
        <circle cx="110" cy="22" r="3.5" fill="#22d3ee" />
        <circle cx="208" cy="22" r="4" fill="#0284c7" />
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

// 2. IoT Telemetry Radar Micro-Visual
function RadarMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/40 border border-white/[0.08]'
          : 'bg-white/50 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
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

// 3. Biometric & Laser Shield Micro-Visual
function SecurityMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/40 border border-white/[0.08]'
          : 'bg-white/50 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Lock className={`w-4 h-4 ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
        <span
          className={`text-[10px] font-mono uppercase font-bold ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          ZERO-LOSS PROTOCOL
        </span>
      </div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className={`px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold ${
          mode === 'dark'
            ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-300'
            : 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-900'
        }`}
      >
        ENCRYPTED
      </motion.div>
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute inset-y-0 w-12 bg-gradient-to-r from-transparent ${
          mode === 'dark' ? 'via-cyan-400/25' : 'via-cyan-500/30'
        } to-transparent pointer-events-none`}
      />
    </div>
  )
}

// 4. Autonomous Robotics & AMR Grid Micro-Visual
function RoboticsMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/40 border border-white/[0.08]'
          : 'bg-white/50 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Boxes className={`w-4 h-4 ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`} />
        <div className="flex flex-col">
          <span
            className={`text-[9px] font-mono ${
              mode === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            AMR SWARM COORDINATES
          </span>
          <span
            className={`text-[10px] font-mono font-bold ${
              mode === 'dark' ? 'text-cyan-300' : 'text-cyan-900'
            }`}
          >
            X: 14.2 // Y: 08.6 // Z: 02
          </span>
        </div>
      </div>
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,1)]"
      />
    </div>
  )
}

// 5. Orbital Multimodal Rings Micro-Visual
function GlobeMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/40 border border-white/[0.08]'
          : 'bg-white/50 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Compass
          className={`w-4 h-4 animate-spin ${mode === 'dark' ? 'text-cyan-400' : 'text-cyan-700'}`}
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
      <span
        className={`text-[10px] font-mono font-bold ${
          mode === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
        }`}
      >
        40+ HUBS
      </span>
    </div>
  )
}

// 6. Predictive Sparkline & ML Confidence Micro-Visual
function PredictiveMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/40 border border-white/[0.08]'
          : 'bg-white/50 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <TrendingUp
          className={`w-4 h-4 ${mode === 'dark' ? 'text-emerald-400' : 'text-emerald-600'}`}
        />
        <span
          className={`text-[10px] font-mono font-bold ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          PREDICTION ACCURACY
        </span>
      </div>
      <div
        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg ${
          mode === 'dark'
            ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
            : 'text-emerald-900 bg-emerald-500/15 border border-emerald-500/40'
        }`}
      >
        99.2% ML CONFIDENCE
      </div>
    </div>
  )
}

/* ========================================================================== */
/*  6 Structured Platform Capability Cards Data Matrix                        */
/* ========================================================================== */

const CAPABILITY_ITEMS: CapabilityCardItem[] = [
  {
    id: 'route-optimization',
    indexNumber: '01',
    icon: Brain,
    kicker: t('DYNAMIC ROUTING', 'توجيه المسارات الديناميكي'),
    title: t('Autonomous Route Intelligence', 'ذكاء المسارات المستقل'),
    tagline: t('Self-optimizing navigation engine', 'محرك الملاحة ذاتي التحسين'),
    description: t(
      'Multi-variable algorithmic pathfinding continuously calculating live road topology, traffic density, severe weather fronts, and electric fleet charging efficiency.',
      'تحديد خوارزمي متقدم للمسارات متعددة المتغيرات، يحسب باستمرار تضاريس الطرق وحركة المرور والطقس وكفاءة شحن الأسطول الكهربائي.',
    ),
    specs: [
      { label: t('Recalculation Latency', 'زمن إعادة الحساب'), value: '< 50ms' },
      { label: t('Fuel & Energy Reduction', 'توفير استهلاك الوقود'), value: '+18.4%' },
    ],
    interactiveType: 'route',
  },
  {
    id: 'iot-telemetry',
    indexNumber: '02',
    icon: Radio,
    kicker: t('SENSOR MESH', 'شبكة المستشعرات'),
    title: t('Omnipresent Fleet Telemetry', 'القياس اللحظي لأسطول إنترنت الأشياء'),
    tagline: t('Sub-second hardware synchronization', 'مزامنة أجهزة بأقل من ثانية'),
    description: t(
      '24/7 direct telemetry stream across all transport assets, tracking tire pressure, cold-chain temperature thresholds, brake wear, and dynamic vibration signatures.',
      'بث فوري للقياس عن بعد على مدار الساعة لجميع أصول النقل، يتتبع ضغط الإطارات ودرجات حرارة سلسلة التبريد وتآكل المكابح والاهتزازات.',
    ),
    specs: [
      { label: t('Transmission Interval', 'فاصل الإرسال اللحظي'), value: 'Sub-Second' },
      { label: t('Sensor Uptime', 'جاهزية المستشعرات'), value: '99.99%' },
    ],
    interactiveType: 'radar',
  },
  {
    id: 'security-compliance',
    indexNumber: '03',
    icon: ShieldCheck,
    kicker: t('ASSET INTEGRITY', 'سلامة الأصول والأمان'),
    title: t('Zero-Trust Security & Compliance', 'أمان الامتثال والتحقق الرقمي'),
    tagline: t('Automated tamper-proof verification', 'تحقق آلي مقاوم للتلاعب'),
    description: t(
      'End-to-end cryptographic consignment sealing, automated international border customs clearance manifests, and real-time electronic containment locking.',
      'إغلاق رقمي مشفر للشحنات، وبيانات جمركية مؤتمتة للمنافذ الحدودية الدولية، وقفل إلكتروني محكم في الوقت الفعلي.',
    ),
    specs: [
      { label: t('Border Manifest', 'البيان الجمركي'), value: '100% Automated' },
      { label: t('Loss Rate Target', 'معدل الفقدان'), value: 'Zero-Loss' },
    ],
    interactiveType: 'security',
  },
  {
    id: 'autonomous-robotics',
    indexNumber: '04',
    icon: Zap,
    kicker: t('ROBOTICS ECOSYSTEM', 'منظومة الروبوتات'),
    title: t('Autonomous Warehouse Robotics', 'الروبوتات المستقلة والمستودعات الذكية'),
    tagline: t('AMR swarm coordination & high-density staging', 'تنسيق أسراب الروبوتات والتجهيز المكثف'),
    description: t(
      'Orchestration of Autonomous Mobile Robots (AMRs) for automated cross-docking, automated vertical staging racks, and millimeter-accurate sorting workflows.',
      'توجيه الروبوتات المتنقلة المستقلة (AMRs) لإرساء الأرصفة الآلي، ورفوف التجهيز الرأسية، وعمليات الفرز الدقيقة بالملليمتر.',
    ),
    specs: [
      { label: t('Sort Precision', 'دقة الفرز والتصنيف'), value: '99.9%' },
      { label: t('AMR Mesh Latency', 'زمن استجابة الشبكة'), value: '12ms' },
    ],
    interactiveType: 'robotics',
  },
  {
    id: 'global-network',
    indexNumber: '05',
    icon: Globe2,
    kicker: t('GLOBAL INFRASTRUCTURE', 'البنية التحتية العالمية'),
    title: t('Multimodal Logistics Grid', 'الشبكة اللوجستية متعددة الوسائط'),
    tagline: t('Tri-modal air, land, and maritime unified command', 'قيادة موحدة جوية وبرية وبحرية'),
    description: t(
      'Synchronized cross-border logistics interconnecting air cargo fleets, container sea vessels, and electric highway trucks across 40+ strategic trade corridors.',
      'خدمات لوجستية متزامنة عابرة للحدود تربط أساطيل الشحن الجوي وسفن الحاويات البحرية وشاحنات الطرق عبر 40+ ممراً تجارياً.',
    ),
    specs: [
      { label: t('Connected Hubs', 'المراكز المتصلة'), value: '40+ Corridors' },
      { label: t('Visibility Status', 'مستوى الرؤية'), value: '100% Real-Time' },
    ],
    interactiveType: 'globe',
  },
  {
    id: 'predictive-analytics',
    indexNumber: '06',
    icon: TrendingUp,
    kicker: t('PREDICTIVE ML', 'التعلم الآلي التنبؤي'),
    title: t('Predictive Capacity & Demand Engine', 'محرك التنبؤ بالطلب والسعة'),
    tagline: t('Preemptive bottleneck & maintenance forecasting', 'التنبؤ الاستباقي بالاختناقات والصيانة'),
    description: t(
      'Machine learning models forecasting seasonal demand surges, fleet component stress cycles, and supply chain bottleneck prevention days in advance.',
      'نماذج تعلم آلي تتنبأ بزيادات الطلب الموسمية، ودورات إجهاد مكونات الأسطول، ومنع اختناقات سلسلة التوريد قبل أيام من حدوثها.',
    ),
    specs: [
      { label: t('Forecast Reliability', 'موثوقية التنبؤ'), value: '99.2%' },
      { label: t('Variance Margin', 'هامش الانحراف'), value: '< 1.2min' },
    ],
    interactiveType: 'predictive',
  },
]

export default function CapabilitiesSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRTL = direction === 'rtl'
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  const kicker = t('PLATFORM CAPABILITIES', 'قدرات المنصة')
  const title = t('Intelligent Logistics Infrastructure', 'البنية التحتية اللوجستية الذكية')
  const subtitle = t(
    'End-to-end supply chain visibility and autonomous command powered by real-time AI and sensor telemetry.',
    'رؤية شاملة لسلسلة التوريد وقيادة مستقلة مدعومة بالذكاء الاصطناعي الفوري ومستشعرات القياس عن بعد.',
  )
  const exploreLabel = t('Explore Architecture', 'استكشف البنية التقنية')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  }

  return (
    <section 
      id="capabilities" 
      dir={direction}
      className={`relative py-32 overflow-hidden transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950'
          : 'bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-100/90'
      }`}
    >
      {/* Background ambient lighting */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(6,182,212,0.06),transparent)]'
            : 'bg-[radial-gradient(ellipse_70%_50%_at_50%_20%,rgba(6,182,212,0.12),transparent)]'
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
            <span className={`font-bold ${isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}>
              {kicker[language]}
            </span>
          </div>
          <h2
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight mb-5 leading-tight ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title[language]}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {subtitle[language]}
          </p>
        </div>

        {/* 6 Transparent Crystal / Diamond Glass Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {CAPABILITY_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.id}
                variants={cardVariants}
                className={`group relative flex flex-col justify-between rounded-3xl p-7 sm:p-8 transition-all duration-400 backdrop-blur-2xl ${
                  mode === 'dark'
                    ? 'bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-cyan-400/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_0_rgba(6,182,212,0.18),inset_0_1px_2px_0_rgba(255,255,255,0.25)]'
                    : 'bg-white/40 hover:bg-white/60 border border-white/80 hover:border-cyan-500/50 shadow-[0_8px_32px_0_rgba(15,23,42,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_0_rgba(6,182,212,0.05)] hover:shadow-[0_16px_48px_0_rgba(6,182,212,0.14),inset_0_1px_2px_0_rgba(255,255,255,1)]'
                }`}
              >
                {/* Specular Shimmer Top Accent */}
                <div
                  className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent ${
                    mode === 'dark' ? 'via-cyan-400/40' : 'via-cyan-500/60'
                  } to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                <div>
                  {/* Top Row: Index Badge & Icon */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                        mode === 'dark'
                          ? 'bg-white/[0.04] border border-white/15 text-cyan-300 group-hover:border-cyan-400/50 group-hover:bg-cyan-500/10 group-hover:text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'bg-white/60 border border-white/90 text-cyan-700 shadow-sm group-hover:bg-cyan-50 group-hover:border-cyan-400/60 group-hover:text-cyan-800'
                      }`}
                    >
                      <Icon className="w-6 h-6" strokeWidth={1.8} />
                    </div>
                    
                    <span
                      className={`font-mono text-xs font-bold tracking-widest px-3 py-1 rounded-full ${
                        mode === 'dark'
                          ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                          : 'text-cyan-800 bg-cyan-500/15 border border-cyan-500/30'
                      }`}
                    >
                      {item.indexNumber}
                    </span>
                  </div>

                  {/* Kicker & Title */}
                  <p
                    className={`font-bold uppercase mb-1.5 ${
                      mode === 'dark' ? 'text-cyan-400' : 'text-cyan-800'
                    } ${isRTL ? 'text-xs tracking-normal' : 'text-[11px] tracking-[0.2em]'}`}
                  >
                    {item.kicker[language]}
                  </p>
                  <h3
                    className={`text-xl sm:text-2xl font-extrabold mb-3 leading-snug tracking-tight ${
                      mode === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.title[language]}
                  </h3>

                  {/* Detailed Description */}
                  <p
                    className={`text-xs sm:text-sm leading-relaxed mb-6 ${
                      mode === 'dark' ? 'text-slate-300' : 'text-slate-700 font-normal'
                    }`}
                  >
                    {item.description[language]}
                  </p>

                  {/* Dedicated Unique Interactive Micro-Visual */}
                  <div className="mb-6">
                    {item.interactiveType === 'route' && <RouteMicroVisual mode={mode} isRtl={isRTL} />}
                    {item.interactiveType === 'radar' && <RadarMicroVisual mode={mode} />}
                    {item.interactiveType === 'security' && <SecurityMicroVisual mode={mode} />}
                    {item.interactiveType === 'robotics' && <RoboticsMicroVisual mode={mode} />}
                    {item.interactiveType === 'globe' && <GlobeMicroVisual mode={mode} />}
                    {item.interactiveType === 'predictive' && <PredictiveMicroVisual mode={mode} />}
                  </div>

                  {/* Specifications & Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6">
                    {item.specs.map((spec, i) => (
                      <div
                        key={i}
                        className={`p-2.5 rounded-2xl transition-colors duration-300 ${
                          mode === 'dark'
                            ? 'bg-white/[0.02] border border-white/[0.06]'
                            : 'bg-white/50 border border-white/80 shadow-xs'
                        }`}
                      >
                        <span
                          className={`block font-semibold ${
                            isRTL ? 'text-[10px] tracking-normal' : 'text-[9px] uppercase tracking-wider'
                          } ${mode === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}
                        >
                          {spec.label[language]}
                        </span>
                        <span
                          className={`block font-mono text-xs font-bold tracking-wide mt-1 ${
                            mode === 'dark' ? 'text-cyan-300' : 'text-cyan-800'
                          }`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Link */}
                <div
                  className={`pt-4 border-t flex items-center justify-between ${
                    mode === 'dark' ? 'border-white/[0.08]' : 'border-slate-200/80'
                  }`}
                >
                  <a
                    href="#infrastructure"
                    className={`inline-flex items-center gap-2 text-xs font-bold tracking-wide transition-colors ${
                      mode === 'dark'
                        ? 'text-cyan-400 group-hover:text-cyan-300'
                        : 'text-cyan-800 group-hover:text-cyan-950'
                    }`}
                  >
                    <span>{exploreLabel[language]}</span>
                    <ArrowIcon
                      className={`w-4 h-4 transition-transform duration-300 ${
                        mode === 'dark' ? 'text-cyan-400' : 'text-cyan-700'
                      } ${isRTL ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'}`}
                    />
                  </a>
                  <span className="text-[10px] font-mono text-slate-500">LIVE</span>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
