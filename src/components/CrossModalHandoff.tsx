'use client'

/* ── Cross-modal handoff ──────────────────────────────────────────────────
   Where the road leg meets the other two modes. Two cards rather than ocean's
   one, because land is the middle of the chain: cargo arrives from a vessel
   and leaves for an aircraft, and the page should point both ways.

   Both cards are live. The Air card was inert at launch because the surface
   did not exist; `air/` now ships its own app on port 3200, so the card links
   out like the Ocean one. Its live state is read from `@/lib/suite`, not
   hard-coded here, so the two cannot disagree.
────────────────────────────────────────────────────────────────────────── */

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Ship, Plane, ArrowRight, ArrowLeft } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import ModelBadge from '@/components/ModelBadge'
import { SURFACES, type SurfaceId } from '@/lib/suite'

const t = (en: string, ar: string) => ({ en, ar })

const COPY = {
  tag: t('Intermodal handoff', 'تسليم متعدد الوسائط'),
  head: t(
    'Connecting highways to seaports & air corridors',
    'ربط شبكة الطرق بالموانئ البحرية وقرية البضائع الجوية',
  ),
  sub: t(
    'A road leg is rarely the whole journey. The same shipment record follows the cargo into the terminal it is heading for, so the handover does not start with a phone call.',
    'المرحلة البرية نادراً ما تكون الرحلة كاملة. سجل الشحنة نفسه يتبع البضاعة إلى المنفذ المتجه إليه، فلا يبدأ التسليم بمكالمة هاتفية.',
  ),
  soon: t('In preparation', 'قيد الإعداد'),
}

const CARDS: {
  id: Extract<SurfaceId, 'ocean' | 'air'>
  icon: typeof Ship
  title: { en: string; ar: string }
  desc: { en: string; ar: string }
  cta: { en: string; ar: string }
}[] = [
  {
    id: 'ocean',
    icon: Ship,
    title: t('Ocean Gateway', 'البوابة البحرية'),
    desc: t(
      'Deep-sea export booking & port telemetry.',
      'حجز التصدير البحري وتتبّع الموانئ.',
    ),
    cta: t('Open YASLOGIST Ocean', 'افتح YASLOGIST البحري'),
  },
  {
    id: 'air',
    icon: Plane,
    title: t('Air Freight', 'الشحن الجوي'),
    desc: t(
      'Time-critical & cold-chain pharma expedited transfer through Cairo Cargo Village.',
      'شحنات حرجة زمنياً وسلسلة تبريد دوائية بنقل مُعجّل عبر قرية البضائع بالقاهرة.',
    ),
    cta: t('Open YASLOGIST Air', 'افتح YASLOGIST الجوي'),
  },
]

export default function CrossModalHandoff() {
  const { resolvedTheme } = useTheme()
  const { language, direction } = useLanguage()
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRtl = direction === 'rtl'
  const Arrow = isRtl ? ArrowLeft : ArrowRight

  return (
    <section
      aria-label={COPY.tag[language]}
      dir={direction}
      className={`relative py-24 px-6 sm:px-10 lg:px-16 transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950 border-t border-white/[0.08]'
          : 'bg-slate-50 border-t border-slate-200'
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(232,179,23,0.05),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-12"
        >
          <p className={`text-gold-500 font-bold mb-3 ${
            isRtl ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'
          }`}>
            {COPY.tag[language]}
          </p>
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 ${
            mode === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            {COPY.head[language]}
          </h2>
          <p className={`text-base sm:text-lg leading-relaxed ${
            mode === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {COPY.sub[language]}
          </p>
          <div className="mt-5">
            <ModelBadge short />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CARDS.map((card, i) => {
            const surface = SURFACES.find((s) => s.id === card.id)!
            const Icon = card.icon
            const live = surface.live

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`group relative flex flex-col justify-between rounded-3xl p-8 backdrop-blur-2xl border transition-all duration-300 ${
                  mode === 'dark'
                    ? 'bg-white/[0.025] border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]'
                    : 'bg-white/80 border-slate-200/90 shadow-md'
                } ${live ? 'hover:shadow-xl' : 'opacity-70'}`}
                style={live ? { borderTopColor: surface.accent, borderTopWidth: 3 } : { borderTopWidth: 3 }}
              >
                <div>
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border"
                    style={{
                      color: surface.accent,
                      borderColor: `${surface.accent}55`,
                      background: `${surface.accent}12`,
                    }}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>

                  <h3 className={`mt-5 text-xl font-extrabold ${
                    mode === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {card.title[language]}
                  </h3>

                  <p className={`mt-2 text-sm leading-relaxed ${
                    mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {card.desc[language]}
                  </p>
                </div>

                <div className="mt-7">
                  {live ? (
                    <a
                      href={surface.href}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gold-400"
                      style={{
                        background: surface.accent,
                        color: '#020617',
                        boxShadow: `0 0 18px ${surface.glow}`,
                      }}
                    >
                      {card.cta[language]}
                      <Arrow className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold cursor-not-allowed ${
                        mode === 'dark'
                          ? 'border-white/10 text-slate-500'
                          : 'border-slate-200 text-slate-400'
                      }`}
                    >
                      {COPY.soon[language]}
                    </span>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
