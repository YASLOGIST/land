'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'
import { Truck, Network, Warehouse, ArrowDown, ShieldCheck, Cpu, Building2 } from 'lucide-react'
import { NETWORK_SUMMARY } from '@/data/network-summary'

const t = (en: string, ar: string) => ({ en, ar })

const visionCopy = {
  kicker: t(
    'TERRESTRIAL ARCHITECTURE // ROAD FREIGHT & WAREHOUSING',
    'الهندسة الأرضية // الشحن البري والتخزين الذكي'
  ),
  headline: t(
    'Engineering Ground Logistics & Smart Fulfillment',
    'هندسة اللوجستيات البرية وحلول التخزين والتوزيع الذكية'
  ),
  subheadline: t(
    'Line-haul fleets, cross-dock yards and dry port slots held in one shipment record, so a delay at any of the three shows up against the same ETA.',
    'أساطيل النقل الرئيسية وساحات التفريغ ومواعيد الموانئ الجافة داخل سجل شحنة واحد، بحيث يظهر أي تأخير في أيٍّ منها على نفس زمن الوصول المتوقع.'
  ),
  pillars: [
    {
      icon: Truck,
      code: 'FLEET-01',
      title: t(
        'Autonomous Heavy Haulage (FTL & LTL Dedicated)',
        'النقل الثقيل الذكي والمستقل (شاحنات كاملة FTL ومجزأة LTL)'
      ),
      desc: t(
        'AI-orchestrated long-haul arterial convoys, dynamic capacity allocation, and connected V2X highway platoons.',
        'قوافل برية ذكية للمسافات الطويلة، تخصيص ديناميكي للحمولات، ومجموعات شاحنات متصلة بنظام V2X عبر الطرق السريعة.'
      ),
    },
    {
      icon: Network,
      code: 'GRID-02',
      title: t(
        'Autonomous Ground & Cross-Dock Mesh',
        'الشبكة البرية المستقلة ومصفوفة التفريغ المباشر Cross-Dock'
      ),
      desc: t(
        'Pallet sortation at the cross-dock, bypass routing when a chokepoint backs up, and pre-arrival filing — NAFEZA/ACID on Egyptian legs, Bayan via FASAH on Saudi legs — so clearance starts before the truck reaches the gate.',
        'فرز المنصات بمراكز التفريغ المباشر، وتوجيه بديل عند تكدس أي نقطة اختناق، وتقديم الإقرار المسبق — نافذة/ACID على المقطع المصري، وبيان «فسح» على المقطع السعودي — ليبدأ التخليص قبل وصول الشاحنة إلى البوابة.'
      ),
    },
    {
      icon: Warehouse,
      code: 'WH-03',
      title: t(
        'Smart Distribution Hubs & Cold-Chain Warehousing',
        'مراكز التوزيع الذكية ومستودعات التبريد الفائق Cold-Chain'
      ),
      desc: t(
        'Autonomous mobile robot (AMR) high-bay fulfillment, cryptographic seal tracking, and active cryogenic temperature locks.',
        'تخزين وتجهيز آلي بروبوتات AMR، أقفال مشفرة للحاويات، وتثبيت حراري متقدم لسلاسل التبريد الحساسة.'
      ),
    },
  ],
  /* Three claims we can actually stand behind: the corridor count is a
     build-generated summary of LAND_TRADE_CORRIDORS — checked against the
     array by npm run gate, and kept out of the entry bundle by living in
     its own module — the tracking interval is what a standard telematics
     unit reports, and the customs line names the systems we file through
     rather than promising a clearance time. */
  metricBadges: [
    { label: t('ACTIVE CORRIDORS', 'الممرات النشطة'), val: `${NETWORK_SUMMARY.corridorCount}`, icon: Building2 },
    { label: t('GPS PING INTERVAL', 'تردد إشارة التتبع'), val: '30 SEC', icon: Cpu },
    { label: t('CUSTOMS FILING', 'التخليص الجمركي'), val: 'NAFEZA · FASAH', icon: ShieldCheck },
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
      {/* Subtle Vignette */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(6,182,212,0.05),transparent)]'
            : 'bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(6,182,212,0.04),transparent)]'
        }`}
      />

      <div className="relative z-10 container mx-auto max-w-6xl flex flex-col items-center text-center">
        
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
            mode === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {visionCopy.subheadline[language]}
        </motion.p>

        {/* 3 Core Capability Pillars (Refactored Triad) */}
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
                    ? 'bg-slate-950/80 border-white/15 hover:border-gold-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(232,179,23,0.15)]'
                    : 'bg-slate-50 border-slate-200/90 hover:border-gold-500/40 shadow-sm'
                }`}
              >
                {/* Specular Top Reflection */}
                <div
                  className={`absolute inset-x-0 top-0 h-[1px] pointer-events-none ${
                    mode === 'dark'
                      ? 'bg-gradient-to-r from-transparent via-gold-400/30 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-gold-500/20 to-transparent'
                  }`}
                />

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div
                      className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                        mode === 'dark'
                          ? 'bg-gold-500/10 border-gold-500/30 text-gold-300 group-hover:bg-gold-500 group-hover:text-slate-950'
                          : 'bg-gold-50 border-gold-200 text-gold-800 group-hover:bg-gold-600 group-hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs font-bold tracking-widest text-[#D3EE22]">
                      {pillar.code}
                    </span>
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-bold mb-2 ${
                      mode === 'dark' ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {pillar.title[language]}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      mode === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {pillar.desc[language]}
                  </p>
                </div>

                <div
                  className={`mt-5 pt-3 border-t flex items-center justify-between text-[11px] font-mono ${
                    mode === 'dark'
                      ? 'border-white/10 text-slate-400'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  <span>TELEMETRY</span>
                  {/* Amber, matching ModelBadge, because this card reads from
                      the simulator and not from a truck. */}
                  <span className="font-bold text-amber-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-300" />
                    SIMULATED FEED
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
          className={`flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-3.5 sm:p-4 rounded-2xl border backdrop-blur-xl mb-8 ${
            mode === 'dark'
              ? 'bg-slate-900/90 border-white/15'
              : 'bg-slate-100 border-slate-200'
          }`}
        >
          {visionCopy.metricBadges.map((badge, i) => {
            const BadgeIcon = badge.icon
            return (
              <div key={i} className="flex items-center gap-2.5 px-3 py-1">
                <BadgeIcon
                  className={`w-4 h-4 ${
                    mode === 'dark' ? 'text-gold-400' : 'text-gold-700'
                  }`}
                />
                <div className="text-start font-mono">
                  <span
                    className={`text-[10px] block leading-tight ${
                      mode === 'dark' ? 'text-slate-400' : 'text-slate-500'
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
              ? 'text-slate-300 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>{visionCopy.scrollDown[language]}</span>
          <ArrowDown
            className={`w-3.5 h-3.5 animate-bounce ${
              mode === 'dark' ? 'text-[#E8B317]' : 'text-gold-700'
            }`}
          />
        </motion.a>

      </div>
    </section>
  )
}
