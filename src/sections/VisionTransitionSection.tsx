'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'
import { Plane, Truck, Anchor, ArrowDown, Shield, Cpu, Globe2 } from 'lucide-react'

const t = (en: string, ar: string) => ({ en, ar })

const visionCopy = {
  kicker: t(
    'THE MONOCHROME ARCHITECTURE // MULTIMODAL HORIZON',
    'الهندسة الأحادية // أفق النقل متعدد الوسائط'
  ),
  headline: t(
    'Bridging Continents Through Sovereign Supply Chain Networks',
    'ربط القارات عبر شبكات إمداد سيادية ذكية فائقة الدقة'
  ),
  subheadline: t(
    'Unifying supersonic air corridors, deepwater maritime fairways, and autonomous electric highway fleets into one synchronized, zero-loss digital twin.',
    'توحيد الممرات الجوية فائقة السرعة، المسارات البحرية العميقة، والأساطيل البرية الكهربائية المستقلة في توأم رقمي متزامن وخالٍ من الفقدان.'
  ),
  pillars: [
    {
      icon: Plane,
      code: 'AIR-01',
      title: t('Skyward Velocity', 'السرعة الجوية'),
      desc: t('FL280–FL410 jetstream routing with real-time cryogenic cargo clearance.', 'توجيه نفاث عبر مستويات الطيران مع تخليص فوري للشحنات الحساسة.'),
    },
    {
      icon: Truck,
      code: 'LAND-02',
      title: t('Autonomous Ground Grid', 'الشبكة البرية الذكية'),
      desc: t('Platooned electric heavy freight with automated robotic dock synchronization.', 'قوافل نقل ثقيل كهربائية مع مزامنة روبوتية مؤتمتة على الأرصفة.'),
    },
    {
      icon: Anchor,
      code: 'SEA-03',
      title: t('Deepwater Mastery', 'الريادة البحرية'),
      desc: t('Bathymetry-optimized fairways bypassing global choke points with zero dwell.', 'مسارات بحرية محسنة تتجاوز الاختناقات الملاحية بزمن توقف صفري.'),
    },
  ],
  metricBadges: [
    { label: t('ZERO-LOSS SLA', 'صفر فقدان معتمد'), val: '99.99%', icon: Shield },
    { label: t('TELEMETRY MESH', 'شبكة القياس اللحظي'), val: '6G SYNC', icon: Cpu },
    { label: t('GLOBAL REACH', 'الانتشار العالمي'), val: '120+ HUBS', icon: Globe2 },
  ],
  scrollDown: t('Proceed to 3-Phase Operational Simulation', 'انتقل إلى محاكاة العمليات ثلاثية المراحل'),
}

export default function VisionTransitionSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'

  return (
    <section
      id="vision-transition"
      dir={direction}
      className={`relative w-full transition-colors duration-500 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-b ${
        mode === 'dark'
          ? 'bg-slate-950 text-white border-white/10'
          : 'bg-white text-slate-950 border-slate-200'
      }`}
    >
      {/* Subtle Monochrome Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(255,255,255,0.04),transparent)]'
            : 'bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(6,182,212,0.04),transparent)]'
        }`}
      />

      <div className="relative z-10 container mx-auto max-w-6xl flex flex-col items-center text-center">
        
        {/* Section Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3"
        >
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-[0.25em] uppercase border ${
              mode === 'dark'
                ? 'bg-white/[0.06] border-white/20 text-zinc-300'
                : 'bg-slate-100 border-slate-300 text-slate-700'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full animate-pulse ${
                mode === 'dark' ? 'bg-white' : 'bg-cyan-600'
              }`}
            />
            {visionCopy.kicker[language]}
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-tight max-w-4xl mb-4 leading-tight ${
            mode === 'dark' ? 'text-white' : 'text-slate-950'
          }`}
        >
          {visionCopy.headline[language]}
        </motion.h2>

        {/* Subheadline Copywriting */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.2 }}
          className={`text-sm sm:text-base md:text-lg font-normal max-w-3xl leading-relaxed mb-10 ${
            mode === 'dark' ? 'text-zinc-400' : 'text-slate-600'
          }`}
        >
          {visionCopy.subheadline[language]}
        </motion.p>

        {/* 3 Multimodal Transport Capability Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-5xl mb-10 text-start">
          {visionCopy.pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            return (
              <motion.div
                key={pillar.code}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.08 }}
                className={`relative rounded-3xl p-5 sm:p-6 border backdrop-blur-2xl transition-all duration-300 group flex flex-col justify-between ${
                  mode === 'dark'
                    ? 'bg-zinc-950/80 border-white/15 hover:border-white/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
                    : 'bg-slate-50 border-slate-200/90 hover:border-slate-300 shadow-sm'
                }`}
              >
                {/* Specular Top Reflection */}
                <div
                  className={`absolute inset-x-0 top-0 h-[1px] pointer-events-none ${
                    mode === 'dark'
                      ? 'bg-gradient-to-r from-transparent via-white/30 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-slate-300 to-transparent'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-colors duration-300 ${
                        mode === 'dark'
                          ? 'bg-white/10 border-white/20 text-white group-hover:bg-white group-hover:text-black'
                          : 'bg-slate-200/80 border-slate-300 text-slate-900 group-hover:bg-slate-900 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span
                      className={`font-mono text-xs font-bold tracking-widest ${
                        mode === 'dark' ? 'text-zinc-500' : 'text-slate-400'
                      }`}
                    >
                      {pillar.code}
                    </span>
                  </div>

                  <h3
                    className={`text-base font-bold mb-1.5 ${
                      mode === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {pillar.title[language]}
                  </h3>
                  <p
                    className={`text-xs leading-relaxed ${
                      mode === 'dark' ? 'text-zinc-400' : 'text-slate-600'
                    }`}
                  >
                    {pillar.desc[language]}
                  </p>
                </div>

                <div
                  className={`mt-4 pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${
                    mode === 'dark'
                      ? 'border-white/10 text-zinc-500'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <span>6G LINK ACTIVE</span>
                  <span className={`font-bold ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    100% READY
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Metric Badges Banner */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className={`flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-3.5 rounded-2xl border backdrop-blur-xl mb-8 ${
            mode === 'dark'
              ? 'bg-zinc-950/90 border-white/15'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          {visionCopy.metricBadges.map((badge, i) => {
            const BadgeIcon = badge.icon
            return (
              <div key={i} className="flex items-center gap-2.5 px-3 py-1">
                <BadgeIcon
                  className={`w-4 h-4 ${
                    mode === 'dark' ? 'text-zinc-400' : 'text-slate-500'
                  }`}
                />
                <div className="text-start font-mono">
                  <span
                    className={`text-[9.5px] block leading-tight ${
                      mode === 'dark' ? 'text-zinc-500' : 'text-slate-500'
                    }`}
                  >
                    {badge.label[language]}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-extrabold ${
                      mode === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {badge.val}
                  </span>
                </div>
              </div>
            )
          })}
        </motion.div>

        {/* Flowing Arrow Trigger into 3-Phase Operational Simulation */}
        <motion.a
          href="#land-logistics"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`group inline-flex items-center gap-2 text-xs font-mono font-bold transition-colors ${
            mode === 'dark'
              ? 'text-zinc-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{visionCopy.scrollDown[language]}</span>
          <ArrowDown
            className={`w-3.5 h-3.5 animate-bounce ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          />
        </motion.a>

      </div>
    </section>
  )
}

