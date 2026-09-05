'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'
import { Maximize2, X, Sparkles, Building2, Truck, Radio } from 'lucide-react'

const t = (en: string, ar: string) => ({ en, ar })

const showcaseItems = [
  {
    id: 'global-hub',
    videoSrc: '/videos/yaslogist.mp4',
    badge: t('Arterial Highways & Inland Hubs', 'الشحن الشرياني والمراكز الجافة'),
    icon: Building2,
    title: t(
      'Autonomous Land Logistics Command Center',
      'مركز التحكم والقيادة للشحن البري المستقل',
    ),
    description: t(
      'Unified terrestrial intelligence platform coordinating autonomous truck fleets, automated cross-dock terminals, and smart warehousing matrices across regional freight corridors.',
      'منظومة ذكاء لوجستي بري موحدة لتنسيق أساطيل الشاحنات المستقلة وأرصفة التفريغ المؤتمتة ومراكز التوزيع الذكية عبر ممرات الشحن الإقليمية.',
    ),
    tag: t('Command Hub // Live Stream', 'مركز التحكم // بث مباشر'),
    streamStatus: 'LIVE // 60 FPS 4K',
  },
  {
    id: 'smart-warehouse',
    videoSrc: '/videos/Robots_smart_warehouse.mp4',
    badge: t('Automation & Ground Fleet', 'الأتمتة والأسطول الأرضي'),
    icon: Truck,
    title: t(
      'Smart Warehouse & Staging Matrix',
      'مصفوفة المستودعات الذكية ومراكز التجهيز',
    ),
    description: t(
      'Autonomous mobile robots (AMRs) for precision sortation, robotic dock loading, and AI-routed long-haul electric transport.',
      'روبوتات ذاتية القيادة (AMRs) للفرز فائق الدقة، تحميل آلي على الأرصفة، ونقل كهربائي بعيد المدى بمسارات ذكية.',
    ),
    tag: t('Facility & Fleet // Swarm Sync', 'المنشآت والأسطول // مزامنة الأسراب'),
    streamStatus: 'TELEMETRY LOCKED // ACTIVE',
  },
]

export default function ShowcaseSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRTL = direction === 'rtl'

  const sectionHeader = {
    kicker: t('Field Deployments & Infrastructure', 'الانتشار الميداني والبنية التحتية'),
    title: t('Operational Architecture in Action', 'الهندسة التشغيلية في الميدان'),
    subtitle: t(
      'Visual overview of YASLOGIST intelligent fulfillment facilities, inland logistics hubs, and connected road assets.',
      'نظرة بصرية على منشآت ياسلوجيست الذكية ومراكز الربط والخدمات اللوجستية الجافة والأسطول البري المتصل.',
    ),
    viewFull: t('Expand Preview', 'عرض البث بالحجم الكامل'),
    close: t('Close', 'إغلاق'),
  }

  return (
    <section
      id="infrastructure"
      dir={direction}
      className={`relative py-28 px-6 sm:px-10 lg:px-16 transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950/90 border-t border-white/[0.08]'
          : 'bg-slate-50 border-t border-slate-200'
      }`}
    >
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,rgba(6,182,212,0.06),transparent)]"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-4 backdrop-blur-xl bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className={`font-bold ${isRTL ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}>
              {sectionHeader.kicker[language]}
            </span>
          </div>
          <h2
            className={`text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 ${
              mode === 'dark' ? 'text-white' : 'text-slate-900'
            }`}
          >
            {sectionHeader.title[language]}
          </h2>
          <p
            className={`text-base sm:text-lg leading-relaxed ${
              mode === 'dark' ? 'text-slate-300' : 'text-slate-600'
            }`}
          >
            {sectionHeader.subtitle[language]}
          </p>
        </div>

        {/* 2 Showcase Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {showcaseItems.map((item, idx) => {
            const ItemIcon = item.icon
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`group relative flex flex-col rounded-3xl overflow-hidden backdrop-blur-2xl transition-all duration-300 ${
                  mode === 'dark'
                    ? 'border border-white/10 bg-white/[0.025] hover:bg-white/[0.045] shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:border-cyan-400/40'
                    : 'border border-slate-200/90 bg-white hover:shadow-2xl hover:border-cyan-500/40'
                }`}
              >
                {/* Video Viewport Container with Dynamic Scale */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-950">
                  <video
                    src={item.videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    webkit-playsinline="true"
                    preload="auto"
                    disablePictureInPicture
                    disableRemotePlayback
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ transform: 'translateZ(0)' }}
                  />
                  {/* Subtle vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 pointer-events-none" />

                  {/* Badge */}
                  <div
                    className={`absolute top-3.5 z-10 ${
                      isRTL ? 'right-3.5' : 'left-3.5'
                    }`}
                  >
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold backdrop-blur-xl bg-slate-950/80 text-cyan-300 border border-white/15 shadow-md ${
                      isRTL ? 'text-xs tracking-normal' : 'text-[11px] uppercase tracking-wider'
                    }`}>
                      <ItemIcon className="w-3.5 h-3.5 text-cyan-400" />
                      {item.badge[language]}
                    </span>
                  </div>

                  {/* Live Telemetry Stream Indicator */}
                  <div
                    className={`absolute top-3.5 z-10 ${
                      isRTL ? 'left-3.5' : 'right-3.5'
                    }`}
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[9px] font-mono font-bold bg-slate-950/85 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                      <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                      <span>{item.streamStatus}</span>
                    </span>
                  </div>

                  {/* Expand button */}
                  <button
                    onClick={() => setSelectedVideo(item.videoSrc)}
                    aria-label={sectionHeader.viewFull[language]}
                    className={`absolute bottom-3.5 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-xl transition-all duration-200 ${
                      isRTL ? 'left-3.5' : 'right-3.5'
                    } ${
                      mode === 'dark'
                        ? 'bg-slate-900/80 text-slate-200 hover:bg-cyan-500 hover:text-slate-950 border border-white/10'
                        : 'bg-white/90 text-slate-800 hover:bg-cyan-600 hover:text-white border border-slate-200 shadow-sm'
                    }`}
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>{sectionHeader.viewFull[language]}</span>
                  </button>
                </div>

                {/* Card Body */}
                <div className="p-7 flex flex-col flex-grow justify-between">
                  <div>
                    <span className={`font-mono font-bold text-cyan-400 mb-2 block ${isRTL ? 'text-xs tracking-normal' : 'text-[10px] uppercase tracking-widest'}`}>
                      {item.tag[language]}
                    </span>
                    <h3
                      className={`text-xl font-bold mb-3 leading-snug ${
                        mode === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {item.title[language]}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        mode === 'dark' ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {item.description[language]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Lightbox / Modal for Expanded Video Preview */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full rounded-3xl overflow-hidden border border-white/15 bg-slate-900/90 shadow-[0_0_50px_rgba(6,182,212,0.3)]"
            >
              <button
                onClick={() => setSelectedVideo(null)}
                aria-label={sectionHeader.close[language]}
                className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} z-20 p-2.5 rounded-full bg-slate-950/80 text-white hover:bg-cyan-500 hover:text-slate-950 transition-colors border border-white/10 shadow-lg`}
              >
                <X className="w-5 h-5" />
              </button>
              <video
                src={selectedVideo}
                autoPlay
                muted
                loop
                playsInline
                webkit-playsinline="true"
                disablePictureInPicture
                disableRemotePlayback
                controls
                className="w-full h-auto max-h-[80vh] object-contain bg-slate-950"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

