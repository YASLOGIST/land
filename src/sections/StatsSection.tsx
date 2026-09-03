'use client'

/**
 * StatsSection — four headline figures for the land network, carried by
 * rolling <DynamicCounter /> tiles under a shared ModelBadge.
 *
 * Each figure has to be one an operator could be asked to produce a report
 * for. That rules out anything ending in a run of nines, and it rules out
 * any count larger than what LAND_TRADE_CORRIDORS and INLAND_LOGISTICS_HUBS
 * actually hold.
 */

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import type { BilingualText } from '@/types/land-logistics'
import { INLAND_LOGISTICS_HUBS, LAND_TRADE_CORRIDORS } from '@/data/landCorridors'
import DynamicCounter from '@/components/DynamicCounter'
import ModelBadge from '@/components/ModelBadge'

interface StatTile {
  /** Target the counter rolls to. */
  numValue: number
  decimals: number
  /** Rendered ahead of the number, e.g. the tolerance sign on ETA variance. */
  prefix?: string
  suffix: string
  icon: LucideIcon
  status: BilingualText
  label: BilingualText
  description: BilingualText
}

/* Counted from the data rather than typed in, so a fifth corridor cannot
   ship while the tile still says four. */
const NODE_COUNT = INLAND_LOGISTICS_HUBS.length
const CORRIDOR_COUNT = LAND_TRADE_CORRIDORS.length

export default function StatsSection() {
  const { resolvedTheme } = useTheme()
  const { language, direction } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRtl = direction === 'rtl'

  const t = (en: string, ar: string) => ({ en, ar })

  const kicker = t('SYSTEM TELEMETRY & PERFORMANCE', 'القياس عن بعد والأداء التشغيلي')
  const title = t('Operational Excellence in Numbers', 'التميز التشغيلي بالأرقام والبيانات')
  const subtitle = t(
    `Modelled figures for the ${CORRIDOR_COUNT} active corridors and the yards along them, at the intervals a standard telematics unit and a monthly cycle count actually report.`,
    `أرقام محاكاة لعدد ${CORRIDOR_COUNT} ممرات نشطة والساحات الواقعة عليها، بالفترات التي يبلّغ بها فعلياً جهاز التتبع القياسي والجرد الدوري الشهري.`,
  )

  const stats: StatTile[] = [
    {
      numValue: 99.4,
      decimals: 1,
      suffix: '%',
      icon: ShieldCheck,
      status: t('INVENTORY MATCH', 'مطابقة المخزون'),
      label: t('Cycle-Count Inventory Match Rate', 'معدل مطابقة المخزون بالجرد الدوري'),
      description: t(
        'System record against physical count, reconciled monthly. The gap is where a pallet moved without a scan.',
        'مطابقة سجل النظام بالجرد الفعلي شهرياً. والفارق هو المكان الذي تحركت فيه منصة دون تسجيل مسح.',
      ),
    },
    {
      numValue: 30,
      decimals: 0,
      suffix: 's',
      icon: Zap,
      status: t('TELEMETRY SYNC', 'مزامنة التتبع'),
      label: t('Fleet Telematics Ping Interval', 'تردد إشارة تتبع الأسطول'),
      description: t(
        'Position, speed and reefer temperature reported every 30 seconds over the mobile network, with gaps buffered on the unit.',
        'يُبلّغ عن الموقع والسرعة ودرجة حرارة التبريد كل 30 ثانية عبر شبكة المحمول، مع تخزين البيانات على الجهاز عند انقطاع التغطية.',
      ),
    },
    {
      numValue: NODE_COUNT,
      decimals: 0,
      suffix: '',
      icon: Globe,
      status: t('NETWORK NODES', 'عقد الشبكة'),
      label: t('Dry Ports, Port Gates & Border Crossings', 'الموانئ الجافة وبوابات الموانئ والمعابر الحدودية'),
      description: t(
        `${NODE_COUNT} nodes across ${CORRIDOR_COUNT} corridors. YASLOGIST books capacity at them; the facilities belong to their port and zone authorities.`,
        `${NODE_COUNT} عقد على ${CORRIDOR_COUNT} ممرات. تحجز ياسلوجيست طاقة تشغيلية بها، والمنشآت مملوكة لهيئات الموانئ والمناطق التابعة لها.`,
      ),
    },
    {
      numValue: 25,
      decimals: 0,
      prefix: '± ',
      suffix: 'min',
      icon: Activity,
      status: t('ETA VARIANCE', 'انحراف زمن الوصول'),
      label: t('Line-Haul ETA Variance', 'هامش انحراف زمن وصول النقل الرئيسي'),
      description: t(
        'Typical spread on a same-day corridor run. Gate queues and checkpoint holds are the two terms the model cannot pin down.',
        'المدى المعتاد على رحلة ممر في نفس اليوم. وطوابير البوابات وتوقفات نقاط التفتيش هما العنصران اللذان يتعذر على النموذج تحديدهما بدقة.',
      ),
    },
  ]

  return (
    <section
      id="telemetry"
      className={`relative py-28 overflow-hidden transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950 border-t border-white/[0.08]'
          : 'bg-slate-50 border-t border-slate-200'
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

          {/* The four tiles below read as measured production telemetry. They
              are model outputs; the label travels with them. */}
          <div className="flex justify-center mt-5">
            <ModelBadge />
          </div>
        </motion.div>

        {/* 4 Numerical Stat Optical Glass Cards */}
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
                    ? 'bg-white/[0.025] hover:bg-white/[0.045] border border-white/10 hover:border-cyan-400/40 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                    : 'bg-white/80 hover:bg-white border border-slate-200/90 hover:border-cyan-400/60 shadow-md hover:shadow-xl'
                }`}
              >
                {/* Specular Top Reflection Line */}
                <div
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 dark:via-cyan-400/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Top Status Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" />
                      <span className={`font-mono font-bold text-cyan-400 ${isRtl ? 'text-xs tracking-normal' : 'text-[10px] uppercase tracking-widest'}`}>
                        {stat.status[language]}
                      </span>
                    </div>
                    <Icon 
                      className="w-4 h-4 transition-colors" 
                      style={{ color: ['#e7ca00', '#53fffc', '#2ee46a', '#0054d0'][index] }}
                    />
                  </div>

                  {/* Physics-Based Rolling Metric Counter */}
                  <div
                    dir="ltr"
                    className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight bg-gradient-to-r from-cyan-400 via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(6,182,212,0.35)] mb-3"
                  >
                    <DynamicCounter
                      value={stat.numValue}
                      decimals={stat.decimals}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
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
