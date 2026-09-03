import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Truck,
  ShieldCheck,
  Sparkles,
  Boxes,
  Network,
} from 'lucide-react'
import type { RealTradeCorridor } from '@/types/dispatch-extended'

interface RouteComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  activeCorridor: RealTradeCorridor
  payloadTons: number
  language: 'en' | 'ar'
  isRTL: boolean
}

interface ModalityBenchmark {
  id: string
  nameEn: string
  nameAr: string
  icon: typeof Truck
  transitTimeHours: number
  transitDisplayEn: string
  transitDisplayAr: string
  costUsd: number
  co2SavedKg: number
  reliabilityPercent: number
  recommendedForEn: string
  recommendedForAr: string
  prosEn: string[]
  prosAr: string[]
  isBestValue?: boolean
  isFastest?: boolean
  isGreenest?: boolean
}

export function RouteComparisonModal({
  isOpen,
  onClose,
  activeCorridor,
  payloadTons,
  language,
  isRTL,
}: RouteComparisonModalProps) {
  const isArabic = language === 'ar'
  const dist = activeCorridor.distanceKm

  const ftlHours = Number((dist / 85).toFixed(1))
  const ltlHours = Number((dist / 72).toFixed(1))
  const platoonHours = Number((dist / 95).toFixed(1))

  const formatHours = (h: number) => {
    if (h > 24) {
      const d = Math.floor(h / 24)
      const rem = Math.round(h % 24)
      return isArabic ? `${d} أيام و ${rem} ساعة` : `${d}d ${rem}h`
    }
    return isArabic ? `${h} ساعة` : `${h}h`
  }

  const benchmarks: ModalityBenchmark[] = [
    {
      id: 'heavy-haul-ftl',
      nameEn: 'Autonomous Heavy Haulage (FTL Dedicated)',
      nameAr: 'نقل الحمولات الكاملة المستقل (FTL)',
      icon: Truck,
      transitTimeHours: ftlHours,
      transitDisplayEn: formatHours(ftlHours),
      transitDisplayAr: formatHours(ftlHours),
      costUsd: Math.round(dist * payloadTons * 0.14 * 1.1),
      co2SavedKg: Math.max(450, Math.round(dist * payloadTons * 0.145)),
      reliabilityPercent: 99.8,
      recommendedForEn: 'Dedicated point-to-point industrial cargo, high-security sealed containers, direct dock deliveries',
      recommendedForAr: 'الشحنات الصناعية المباشرة، الحاويات المشفرة عالية الأمان، والتوصيل من الرصيف للرصيف',
      prosEn: ['Direct arterial corridor transit', 'Zero intermediate touchpoints', 'Biometric electronic tamper seals'],
      prosAr: ['نقل شرياني مباشر', 'بدون محطات وسيطة', 'أختام إلكترونية بيومترية'],
      isFastest: true,
    },
    {
      id: 'smart-ltl-crossdock',
      nameEn: 'Intelligent Dynamic LTL & Cross-Dock Hubs',
      nameAr: 'الحمولات المجزأة الذكية وأرصفة الفرز (LTL)',
      icon: Boxes,
      transitTimeHours: ltlHours,
      transitDisplayEn: formatHours(ltlHours),
      transitDisplayAr: formatHours(ltlHours),
      costUsd: Math.round(dist * payloadTons * 0.09 * 1.05),
      co2SavedKg: Math.max(380, Math.round(dist * payloadTons * 0.138)),
      reliabilityPercent: 99.2,
      recommendedForEn: 'Consolidated commercial batches, regional retail fulfillment, dynamic pallet distribution',
      recommendedForAr: 'تجميع الشحنات التجارية، توزيع التجزئة الإقليمي، والفرز الآلي بالمنصات',
      prosEn: ['Optimized payload utilization', 'High-speed robotic AMR sortation', 'Lowest cost per ton-km'],
      prosAr: ['استغلال أمثل للحمولة', 'فرز روبوتي سريع بالأرصفة', 'أقل تكلفة للطن-كم'],
      isBestValue: true,
    },
    {
      id: 'electric-platoon',
      nameEn: 'Electric Highway Platoon (Connected V2X)',
      nameAr: 'قوافل الشاحنات الكهربائية المتصلة (V2X)',
      icon: Network,
      transitTimeHours: platoonHours,
      transitDisplayEn: formatHours(platoonHours),
      transitDisplayAr: formatHours(platoonHours),
      costUsd: Math.round(dist * payloadTons * 0.12 * 1.02),
      co2SavedKg: Math.max(850, Math.round(dist * payloadTons * 0.155)),
      reliabilityPercent: 99.6,
      recommendedForEn: 'High-density inter-city freight, zero-emission supply chains, long-haul highway platoons',
      recommendedForAr: 'الشحن عالي الكثافة بين المدن، سلاسل التوريد منعدمة الانبعاثات، والقوافل السريعة',
      prosEn: ['Aerodynamic draft efficiency (-42% CO2)', 'Coordinated V2X braking & safety', 'Continuous waypoint telemetry'],
      prosAr: ['ديناميكية هوائية موفرة للطاقة', 'فرملة ذكية متزامنة عبر V2X', 'تتبع آني للمسار'],
      isGreenest: true,
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-2xl overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 20 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            dir={isRTL ? 'rtl' : 'ltr'}
            className="relative max-w-4xl w-full rounded-3xl p-6 sm:p-8 border border-white/15 bg-slate-900/95 shadow-[0_0_80px_rgba(6,182,212,0.35)] text-white my-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 text-cyan-300">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="font-mono text-xs uppercase tracking-widest text-[#D3EE22] font-bold">
                    {isArabic ? 'مقارنة أنماط الشحن البري' : 'TERRESTRIAL LOGISTICS MODALITY BENCHMARK'}
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  {isArabic ? 'تحليل ومقارنة مسار الشحن البري' : 'Corridor Modality Benchmark & Trade-off Matrix'}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {activeCorridor.originCity[language]} → {activeCorridor.destinationCity[language]} ({activeCorridor.distanceKm} km · {payloadTons} Tons)
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Benchmarks Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
              {benchmarks.map((b) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.id}
                    className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all backdrop-blur-xl ${
                      b.isFastest
                        ? 'border-cyan-500/50 bg-cyan-950/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                        : b.isGreenest
                        ? 'border-emerald-500/50 bg-emerald-950/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                        : 'border-blue-500/50 bg-blue-950/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="p-2 rounded-xl bg-white/10 text-white">
                          <Icon className="w-5 h-5" />
                        </div>
                        {b.isFastest && (
                          <span className="px-2 py-0.5 rounded-full font-mono text-[9.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                            {isArabic ? 'الأسرع وصولاً' : 'DIRECT FTL'}
                          </span>
                        )}
                        {b.isGreenest && (
                          <span className="px-2 py-0.5 rounded-full font-mono text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                            {isArabic ? 'الأعلى استدامة' : 'MAX ESG V2X'}
                          </span>
                        )}
                        {b.isBestValue && (
                          <span className="px-2 py-0.5 rounded-full font-mono text-[9.5px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/40">
                            {isArabic ? 'الأكثر توفيراً' : 'SMART LTL'}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-tight">
                        {isArabic ? b.nameAr : b.nameEn}
                      </h3>

                      {/* Key Metric Numbers */}
                      <div className="grid grid-cols-2 gap-2 my-4 p-3 rounded-xl bg-black/40 border border-white/10 font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{isArabic ? 'زمن الوصول' : 'Transit Time'}</span>
                          <span className="text-base font-bold text-cyan-300">{isArabic ? b.transitDisplayAr : b.transitDisplayEn}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">{isArabic ? 'التكلفة التقديرية' : 'Est. Cost'}</span>
                          <span className="text-base font-bold text-white">${b.costUsd.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">{isArabic ? 'خفض الكربون' : 'CO2 Saved'}</span>
                          <span className="text-xs font-bold text-emerald-400">-{b.co2SavedKg} kg</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">{isArabic ? 'الاعتمادية' : 'SLA Target'}</span>
                          <span className="text-xs font-bold text-cyan-400">{b.reliabilityPercent}%</span>
                        </div>
                      </div>

                      {/* Best suited for */}
                      <div className="mb-4">
                        <span className="text-[11px] font-mono text-slate-400 uppercase font-bold block mb-1">
                          {isArabic ? 'موصى به لـ:' : 'Recommended For:'}
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {isArabic ? b.recommendedForAr : b.recommendedForEn}
                        </p>
                      </div>

                      {/* Pros Checklist */}
                      <ul className="space-y-1.5 mb-2">
                        {(isArabic ? b.prosAr : b.prosEn).map((pro, pIdx) => (
                          <li key={pIdx} className="flex items-center gap-1.5 text-[11px] text-slate-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                )
              })}
            </div>

            {/* Bottom Footer Information */}
            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
              <span>YASLOGIST ARTERIAL INTELLIGENCE MATRIX</span>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all"
              >
                {isArabic ? 'إغلاق المقارنة' : 'Close Comparison'}
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
