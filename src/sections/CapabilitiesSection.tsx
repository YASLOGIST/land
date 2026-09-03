'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Brain,
  Radio,
  ShieldCheck,
  Zap,
  Truck,
  TrendingUp,
  Sparkles,
  Lock,
  Boxes,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import DynamicCounter from '@/components/DynamicCounter'
import ModelBadge from '@/components/ModelBadge'
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
          SEAL + GPS TRACKED
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

// 5. Bi-Modal Land Freight & Warehousing Grid Micro-Visual (Card 5)
function BiModalMicroVisual({ mode }: { mode: 'dark' | 'light' }) {
  return (
    <div
      className={`relative w-full h-16 rounded-2xl overflow-hidden flex items-center justify-between px-3.5 transition-colors duration-300 ${
        mode === 'dark'
          ? 'bg-white/[0.02] border border-white/[0.08]'
          : 'bg-white/40 border border-white/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${mode === 'dark' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-100 text-cyan-800'}`}>
          <Truck className="w-4 h-4" />
        </div>
        <span
          className={`text-[10px] font-mono font-bold ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          BI-MODAL: ROAD FREIGHT & WAREHOUSING
        </span>
      </div>
      <span className="text-[9px] font-mono font-extrabold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
        V2X SYNCED
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
    kicker: t('Intelligent Highway Pathfinding', 'توجيه المسارات السريعة الذكي'),
    title: t('Autonomous Route Intelligence', 'ذكاء المسارات البرية المستقل'),
    tagline: t('Sub-second dynamic transit re-optimization', 'إعادة تحسين لحظية لمسارات النقل البري'),
    description: t(
      'Proprietary machine learning models calculate real-time environmental variables, arterial traffic flows, and inland customs queues to dynamically reroute FTL and LTL freight with zero friction.',
      'خوارزميات تعلم آلي متقدمة تحلل المتغيرات البيئية وحركة المرور الشريانية وطوابير المنافذ الجافة لإعادة توجيه شحنات FTL و LTL فورياً وبدون أي تأخير.',
    ),
    specs: [
      { label: t('Reroute Latency', 'زمن استجابة المسار'), value: '< 50ms', numValue: 50, prefix: '< ', suffix: 'ms' },
      { label: t('Fuel Saved', 'توفير استهلاك الوقود'), value: '+22.4%', numValue: 22.4, decimals: 1, prefix: '+', suffix: '%' },
    ],
    interactiveType: 'route',
  },
  {
    id: 'fleet-telemetry',
    indexNumber: '02',
    icon: Radio,
    kicker: t('Cold-Chain Precision', 'دقة سلسلة التبريد'),
    title: t('Cold-Chain Pharma & Perishables Precision', 'دقة سلسلة التبريد للأدوية والمنتجات سريعة التلف'),
    tagline: t('Continuous temperature & humidity telemetry', 'قياس مستمر للحرارة والرطوبة'),
    description: t(
      'Continuous temperature and humidity telemetry at ±0.2°C sensor precision, with an excursion alert raised the moment a reefer leaves its band — on the leg where no carrier system reports anything.',
      'قياس مستمر لدرجة الحرارة والرطوبة بدقة ±0.2°م، مع تنبيه فوري بمجرد خروج الشاحنة المبردة عن النطاق المحدد — في المرحلة التي لا يبلّغ عنها أي نظام ناقل.',
    ),
    specs: [
      { label: t('Sensor Precision', 'دقة المستشعر'), value: '±0.2°C', numValue: 0.2, decimals: 1, prefix: '±', suffix: '°C' },
      { label: t('Excursion Alert', 'زمن تنبيه الانحراف'), value: '60s', numValue: 60, suffix: 's' },
    ],
    interactiveType: 'radar',
  },
  {
    id: 'customs-acid',
    indexNumber: '03',
    icon: ShieldCheck,
    kicker: t('Customs Integration', 'التكامل الجمركي'),
    title: t('Digital Pre-Clearance & ACID Integration', 'التخليص المسبق والتكامل مع رقم ACID'),
    tagline: t('Nafeza single-window synchronisation', 'المزامنة مع منظومة نافذة'),
    description: t(
      'The ACID issued on the Nafeza single window is carried on the shipment record from booking onward, so a declaration still open when the truck reaches the gate is visible before the truck is dispatched, not after it queues.',
      'رقم ACID الصادر عن منظومة نافذة يُحمل على سجل الشحنة منذ الحجز، فيظهر أي إقرار جمركي ما زال مفتوحاً قبل إرسال الشاحنة إلى البوابة، لا بعد وقوفها في الطابور.',
    ),
    specs: [
      { label: t('Declaration Check', 'فحص الإقرار'), value: 'Pre-gate', numValue: 0, suffix: '' },
      { label: t('Reference Types Stitched', 'أنواع المراجع المرتبطة'), value: '7', numValue: 7, suffix: '' },
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
      'Autonomous mobile robots handle palletising, picking and dock induction in the high-bay area. Throughput is bounded by charging cycles and by how fast the dock can absorb what the robots stage.',
      'روبوتات متنقلة ذاتية القيادة تتولى ترتيب المنصات والانتقاء والتلقيم على الأرصفة داخل منطقة التخزين العالي. وتتحدد الطاقة الإنتاجية بدورات الشحن وبسرعة استيعاب الرصيف لما تجهزه الروبوتات.',
    ),
    specs: [
      { label: t('Mis-pick Rate', 'معدل الانتقاء الخاطئ'), value: '1 in 2,500', numValue: 2500, suffix: '' },
      { label: t('Robot Uptime', 'جاهزية الروبوتات'), value: '92%', numValue: 92, suffix: '%' },
    ],
    interactiveType: 'robotics',
  },
  {
    id: 'bi-modal',
    indexNumber: '05',
    icon: Truck,
    kicker: t('Bi-Modal Infrastructure', 'البنية التحتية الثنائية المتكاملة'),
    title: t('Bi-Modal: Road Freight & Automated Warehousing', 'الشبكة الثنائية: الشحن البري والمستودعات الذكية'),
    tagline: t('Seamless synchronization between highways and smart cross-docks', 'تكامل فوري بين الشاحنات وأرصفة التفريغ المؤتمتة'),
    description: t(
      'Line-haul trucks arrive against a booked cross-dock slot rather than a queue position, so the yard knows what is coming and the dwell it cannot avoid is at least planned for.',
      'تصل شاحنات النقل الرئيسي وفق موعد محجوز بمركز التفريغ المباشر بدلاً من ترتيب في طابور، فتعرف الساحة ما هو قادم إليها، ويصبح زمن الانتظار الذي لا يمكن تفاديه مخططاً له على الأقل.',
    ),
    specs: [
      { label: t('Active Corridors', 'الممرات النشطة'), value: '4', numValue: 4, suffix: '' },
      { label: t('Slot Adherence', 'الالتزام بالمواعيد'), value: '87%', numValue: 87, suffix: '%' },
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
        return <BiModalMicroVisual mode={mode} />
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
        mode === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(6,182,212,0.06),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className={`font-bold ${isAr ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}>
              {t('Autonomous Land Platform Architecture', 'بنية منصة النقل البري المستقلة')[language]}
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            {t('Engineered for Absolute Precision', 'هندسة فائقة الدقة والاعتمادية')[language]}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            {t(
              'A unified operating system combining real-time arterial highway routing, zero-trust telemetry, and robotic warehouse fulfillment into a continuous digital twin.',
              'نظام تشغيل لوجستي موحد يجمع التوجيه الشرياني الآني، مستشعرات الأمان المشفرة، والتجهيز الآلي للمستودعات في توأم رقمي مستمر.',
            )[language]}
          </p>

          {/* Every metric in the cards below (uptime, loss SLA, pick precision,
              fleet counts) is a benchmark model figure. */}
          <div className="flex justify-center mt-5">
            <ModelBadge />
          </div>
        </div>

        {/* 6 Capabilities Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CAPABILITY_CARDS.map((card, idx) => {
            const Icon = card.icon
            return (
              <motion.div
                key={card.id}
                custom={idx}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className={`group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border backdrop-blur-2xl ${
                  mode === 'dark'
                    ? 'bg-white/[0.025] border-white/10 hover:border-cyan-400/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                    : 'bg-white/80 border-slate-200 shadow-lg hover:border-cyan-500/40 hover:shadow-xl'
                }`}
              >
                {/* Specular Top Reflection */}
                <div
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                <div>
                  {/* Card Top: Number & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-2xl font-black text-cyan-400/40 group-hover:text-cyan-400 transition-colors duration-300">
                      {card.indexNumber}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Kicker & Title */}
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D3EE22] block mb-1">
                    {card.kicker[language]}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-white">
                    {card.title[language]}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-300/90 mb-3">
                    {card.tagline[language]}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                    {card.description[language]}
                  </p>
                </div>

                <div>
                  {/* Micro Visual */}
                  <div className="mb-6">
                    {renderMicroVisual(card.interactiveType)}
                  </div>

                  {/* Specs Counters Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
                    {card.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-400 mb-0.5">
                          {spec.label[language]}
                        </span>
                        <div className="text-base sm:text-lg font-mono font-black text-white">
                          <DynamicCounter
                            value={spec.numValue || 0}
                            decimals={spec.decimals || 0}
                            prefix={spec.prefix || ''}
                            suffix={spec.suffix || ''}
                          />
                        </div>
                      </div>
                    ))}
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
