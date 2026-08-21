'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function StatsSection() {
  const { resolvedTheme } = useTheme()
  const { language, direction } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRtl = direction === 'rtl'

  const t = (en: string, ar: string) => ({ en, ar })

  const kicker = t('SYSTEM TELEMETRY & PERFORMANCE', 'القياس عن بعد والأداء التشغيلي')
  const title = t('Operational Excellence in Numbers', 'التميز التشغيلي بالأرقام والبيانات')
  const subtitle = t(
    'Real-time aggregated telemetry validating system-wide accuracy, speed, and cross-border scale.',
    'بيانات قياس موثوقة في الوقت الفعلي تؤكد دقة النظام وسرعته ونطاقه العالمي.',
  )

  const stats = [
    {
      value: '99.9%',
      unit: 'ACCURACY',
      icon: ShieldCheck,
      status: t('SORT PRECISION', 'دقة التصنيف والفرز'),
      label: t('AMR Sort & Staging Precision', 'دقة فرز وتجهيز الروبوتات'),
      description: t('Zero sorting discrepancies across high-density facilities', 'انعدام أخطاء الفرز في المستودعات عالية الكثافة'),
    },
    {
      value: '12ms',
      unit: 'LATENCY',
      icon: Zap,
      status: t('MESH SYNCHRONIZED', 'مزامنة فورية للشبكة'),
      label: t('AMR Swarm Mesh Sync Latency', 'زمن استجابة شبكة أسراب الروبوتات'),
      description: t('Ultra-low latency hardware communications protocol', 'بروتوكول اتصالات فائق السرعة منخفض الاستجابة'),
    },
    {
      value: '40+',
      unit: 'HUBS',
      icon: Globe,
      status: t('GLOBAL COMMAND', 'قيادة لوجستية عالمية'),
      label: t('International Trade Corridors', 'الممرات اللوجستية الدولية'),
      description: t('Unified multimodal air, ocean, and overland hubs', 'مراكز موحدة متعددة الوسائط جوياً وبحرياً وبرياً'),
    },
    {
      value: '< 1.2min',
      unit: 'VARIANCE',
      icon: Activity,
      status: t('DYNAMIC ETA', 'تنبؤ لحظي بالوصول'),
      label: t('Long-Haul Freight ETA Variance', 'هامش انحراف وقت وصول الشحنات'),
      description: t('Machine learning traffic and waypoint prediction', 'تنبؤ دقيق بالمسارات وحركة المرور بالذكاء الاصطناعي'),
    },
  ]

  return (
    <section
      id="telemetry"
      className={`relative py-28 overflow-hidden transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950 border-t border-white/[0.08]'
          : 'bg-white border-t border-slate-200'
      }`}
      dir={direction}
    >
      {/* Dynamic Background Glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(6,182,212,0.06),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className={`text-cyan-400 font-bold mb-3 ${isRtl ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}>
            {kicker[language]}
          </p>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title[language]}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              mode === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {subtitle[language]}
          </p>
        </motion.div>

        {/* 4 Upgraded Numerical Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`group relative flex flex-col justify-between rounded-3xl p-7 transition-all duration-300 backdrop-blur-2xl ${
                  mode === 'dark'
                    ? 'bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-cyan-400/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-50/80 hover:bg-white border border-slate-200/90 hover:border-cyan-400/60 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Top Status Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                      <span className={`font-mono font-bold text-cyan-400 ${isRtl ? 'text-xs tracking-normal' : 'text-[10px] uppercase tracking-widest'}`}>
                        {stat.status[language]}
                      </span>
                    </div>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                  </div>

                  {/* Upgraded Glowing Metric Value */}
                  <div
                    dir="ltr"
                    className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(6,182,212,0.35)] mb-3"
                  >
                    {stat.value}
                  </div>

                  {/* Metric Label */}
                  <h3
                    className={`text-base font-bold mb-2 leading-snug ${
                      mode === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {stat.label[language]}
                  </h3>
                </div>

                {/* Sub-description */}
                <p
                  className={`text-xs leading-relaxed mt-4 pt-4 border-t border-white/[0.06] ${
                    mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {stat.description[language]}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
