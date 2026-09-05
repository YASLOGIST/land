'use client'

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
// GSAP + ScrollTrigger load lazily (first effect run), so the heavy GSAP
// bundle stays out of the initial paint path for this below-the-fold
// section. The type-only import keeps ref types at zero runtime cost.
import type { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Cpu,
  Forklift,
  Globe,
  ShieldCheck,
  Truck,
  Warehouse,
  ChevronDown,
  Radio,
  Terminal,
  Sparkles,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import type {
  BilingualText,
  LandLogisticsSectionProps,
  PhaseProps,
  TranslationProps,
} from '@/types/land-logistics'

type LoadedGsap = {
  gsap: typeof import('gsap')['gsap']
  ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger']
}

let gsapLoadPromise: Promise<LoadedGsap> | null = null

function loadGsap(): Promise<LoadedGsap> {
  gsapLoadPromise ||= import('gsap').then(async ({ gsap }) => {
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    return { gsap, ScrollTrigger }
  })
  return gsapLoadPromise
}

const EASE_CURVE: [number, number, number, number] = [0.22, 1, 0.36, 1]

import { t } from '@/lib/i18n'

const PHASES: (PhaseProps & {
  floatingProjection: BilingualText
  projectedStatus: string
})[] = [
  {
    index: 0,
    range: [0, 0.35] as const,
    icon: Warehouse,
    kicker: t('Phase 01 // Smart Warehousing', 'المرحلة 01 // المستودعات الذكية'),
    title: t(
      'Automated High-Bay Storage & AMR Staging Matrix',
      'المستودعات الذكية ومصفوفة الفرز الآلي AMRs',
    ),
    subtitle: t(
      'Autonomous mobile robots (AMRs) coordinate real-time high-density parcel sortation, dynamic pallet staging, and automated dock induction.',
      'توجيه أسراب الروبوتات المستقلة (AMRs) لتصنيف وتجميع وتجهيز الشحنات بدقة فائقة وتدفق مستمر على أرصفة التحميل.',
    ),
    floatingProjection: t('AMR Fleet Mesh // Active Node', 'شبكة أسراب الروبوتات // عقدة نشطة'),
    projectedStatus: 'AMR FLEET // STAGING ACTIVE',
    metrics: [
      { id: 'amr-sync', icon: Cpu, label: t('Robots On Task', 'الروبوتات قيد التشغيل'), value: '18 / 20' },
      { id: 'iot', icon: Activity, label: t('IoT Telemetry', 'مستشعرات IoT'), value: 'CALIBRATED' },
      { id: 'sort', icon: ShieldCheck, label: t('Sort Backlog', 'المتأخر من الفرز'), value: '2 PALLETS' },
    ],
  },
  {
    index: 1,
    range: [0.35, 0.7] as const,
    icon: Forklift,
    kicker: t('Phase 02 // Dock Operations', 'المرحلة 02 // عمليات الأرصفة'),
    title: t(
      'Automated Dock Loading & Sealing',
      'التحميل الآلي وختم الحاويات',
    ),
    subtitle: t(
      'Forklift movements and optical scans are logged against the seal number, so a seal broken between the dock and the gate is traceable to a shift and a bay.',
      'تُسجل حركات معدات التحميل وعمليات المسح الضوئي مقابل رقم الختم، بحيث يمكن تتبع أي ختم يُكسر بين الرصيف والبوابة إلى وردية ورصيف محددين.',
    ),
    floatingProjection: t('Robotic Retraction & Seal // Logged', 'تراجع آلي وختم // مُسجّل'),
    projectedStatus: 'TELEMETRY LOCKED // SECURED',
    metrics: [
      { id: 'load-cycle', icon: Forklift, label: t('Dock Cycle', 'دورة الرصيف'), value: '02:14 MIN' },
      { id: 'telemetry', icon: ShieldCheck, label: t('Crypto Lock', 'القفل المشفر'), value: 'SECURED' },
      { id: 'docking', icon: Warehouse, label: t('Bay Alignment', 'محاذاة الرصيف'), value: 'ALIGNED' },
    ],
  },
  {
    index: 2,
    range: [0.7, 1.0] as const,
    icon: Truck,
    kicker: t('Phase 03 // Arterial Haulage', 'المرحلة 03 // النقل الشرياني'),
    title: t(
      'Autonomous Heavy Freight & V2X Platooning',
      'النقل الثقيل المستقل وقوافل V2X السريعة',
    ),
    subtitle: t(
      'Routing advanced electric long-haul truck fleets with connected V2X highway platooning and continuous waypoint telemetry.',
      'توجيه أساطيل الشاحنات الكهربائية المستقلة عبر قوافل متصلة بنظام V2X ومراقبة آنية للمسار ونقاط التفتيش.',
    ),
    floatingProjection: t('Electric Highway Platoon // Highway V2X', 'شاحنات كهربائية مستقلة // V2X متصل'),
    projectedStatus: 'WAYPOINT SYNCED // LIVE',
    metrics: [
      { id: 'grid', icon: Cpu, label: t('Platoon V2X', 'شبكة V2X'), value: '99.4% ESG' },
      { id: 'gps', icon: Globe, label: t('Arterial GPS', 'مسار الشريان'), value: 'DYNAMIC' },
      { id: 'eta', icon: Activity, label: t('ETA Margin', 'هامش الوصول'), value: '< 1.2 MIN' },
    ],
  },
]

const DISCLAIMER: BilingualText = t(
  'High-fidelity telemetry simulation — a digital-twin model illustrating YASLOGIST road freight mechanics.',
  'نموذج محاكاة عالي الدقة للقياس عن بُعد — يوضح الآلية التشغيلية للشحن البري لمنظومة ياسلوجيست.',
)

type Mode = 'dark' | 'light'

export default function LandLogisticsSection({
  id = 'land-logistics',
}: LandLogisticsSectionProps) {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const sectionRef = useRef<HTMLElement | null>(null)
  const pinContainerRef = useRef<HTMLDivElement | null>(null)
  const dayVideoRef = useRef<HTMLVideoElement | null>(null)
  const nightVideoRef = useRef<HTMLVideoElement | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const telemetryTimeSpanRef = useRef<HTMLSpanElement | null>(null)

  const targetProgressRef = useRef<number>(0)
  const currentProgressRef = useRef<number>(0)
  const animFrameIdRef = useRef<number | null>(null)

  const [activePhase, setActivePhase] = useState<number>(0)
  const activePhaseRef = useRef<number>(0)

  const isRTL = direction === 'rtl'
  const isAr = language === 'ar'
  const mode: Mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isDark = mode === 'dark'

  const i18n: TranslationProps = useMemo<TranslationProps>(
    () => ({
      language,
      direction,
      phases: PHASES,
      disclaimer: DISCLAIMER[language],
      ui: {
        scrollHint: language === 'ar' ? 'مرّر للاستكشاف' : 'Scroll to explore',
        phaseCounter: language === 'ar' ? 'المرحلة' : 'Phase',
        simulationBadge: language === 'ar' ? 'محرك المحاكاة' : 'SIM ENGINE',
        themeToggle: language === 'ar' ? 'تبديل المظهر' : 'Toggle theme',
        languageToggle: language === 'ar' ? 'English' : 'العربية',
      },
    }),
    [language, direction],
  )

  const updatePhase = useCallback((next: number) => {
    activePhaseRef.current = next
    setActivePhase((prev) => (prev === next ? prev : next))
  }, [])

  // ── GSAP ScrollTrigger Pinning & Scroll-Driven Video Scrubbing ──
  useEffect(() => {
    const section = sectionRef.current
    const pinContainer = pinContainerRef.current
    const dayVideo = dayVideoRef.current
    const nightVideo = nightVideoRef.current
    if (!section || !pinContainer) return

    let disposed = false
    let innerCleanup: (() => void) | undefined

    // Dynamic import: GSAP arrives after first paint, cached for re-runs.
    void (async () => {
      const { ScrollTrigger } = await loadGsap()
      if (disposed) return

      if (dayVideo) {
        dayVideo.muted = true
        dayVideo.playsInline = true
        dayVideo.preload = 'auto'
        dayVideo.pause()
      }
      if (nightVideo) {
        nightVideo.muted = true
        nightVideo.playsInline = true
        nightVideo.preload = 'auto'
        nightVideo.pause()
      }

      let isRunning = true
      const isLoopingRef = { current: false }

    const renderLoop = () => {
      if (!isRunning) return

      const targetP = targetProgressRef.current
      const curP = currentProgressRef.current
      const diff = targetP - curP

      let continueLoop = false

      // Snappy & responsive lerp interpolation for forward & reverse scrolling
      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * 0.22 // Smoother, lighter lerping weight
        continueLoop = true
      } else {
        currentProgressRef.current = targetP
      }

      const p = Math.max(0, Math.min(1, currentProgressRef.current))

      // Keep both videos in precise lockstep so switching theme is 100% seamless
      const videos = [dayVideo, nightVideo].filter(Boolean) as HTMLVideoElement[]
      for (const v of videos) {
        const dur = v.duration && !isNaN(v.duration) && v.duration > 0 ? v.duration : 10.0
        const targetTime = Math.max(0, Math.min(p * dur, dur - 0.03))

        if (v.readyState >= 1 && Math.abs(v.currentTime - targetTime) > 0.015) {
          try {
            v.currentTime = targetTime
          } catch {
            // Ignore throttled seek exceptions
          }
        }
      }

      const totalSeconds = p * 60 + (activePhaseRef.current * 30)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = Math.floor(totalSeconds % 60)
      const millis = Math.floor((totalSeconds % 1) * 100)
      if (telemetryTimeSpanRef.current) {
        telemetryTimeSpanRef.current.textContent = `T+${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`
      }

      if (continueLoop) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop)
      } else {
        isLoopingRef.current = false
      }
    }

    const startLoop = () => {
      if (!isLoopingRef.current) {
        isLoopingRef.current = true
        animFrameIdRef.current = requestAnimationFrame(renderLoop)
      }
    }

    // Initial trigger
    startLoop()

    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: pinContainer,
      pinSpacing: true,
      anticipatePin: 1,
      start: 'top top',
      end: '+=3500',
      scrub: 0.5,
      onUpdate: (self) => {
        const p = self.progress
        targetProgressRef.current = p

        let idx = 0
        if (p >= 0.66) {
          idx = 2
        } else if (p >= 0.33) {
          idx = 1
        } else {
          idx = 0
        }
        updatePhase(idx)
        startLoop()
      },
    })
    scrollTriggerRef.current = trigger

    const onVideoReady = () => {
      ScrollTrigger.refresh()
      if (dayVideo && !dayVideo.paused) dayVideo.pause()
      if (nightVideo && !nightVideo.paused) nightVideo.pause()
    }

    if (dayVideo) {
      if (dayVideo.readyState >= 2) onVideoReady()
      else {
        dayVideo.addEventListener('loadedmetadata', onVideoReady, { once: true })
        dayVideo.addEventListener('canplay', onVideoReady, { once: true })
      }
    }

    if (nightVideo) {
      if (nightVideo.readyState >= 2) onVideoReady()
      else {
        nightVideo.addEventListener('loadedmetadata', onVideoReady, { once: true })
        nightVideo.addEventListener('canplay', onVideoReady, { once: true })
      }
    }

    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize, { passive: true })

    innerCleanup = () => {
      isRunning = false
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if (dayVideo) {
        dayVideo.removeEventListener('loadedmetadata', onVideoReady)
        dayVideo.removeEventListener('canplay', onVideoReady)
      }
      if (nightVideo) {
        nightVideo.removeEventListener('loadedmetadata', onVideoReady)
        nightVideo.removeEventListener('canplay', onVideoReady)
      }
      trigger.kill()
    }
    })() // end async scrub setup

    return () => {
      disposed = true
      innerCleanup?.()
    }
  }, [updatePhase])

  const phase = i18n.phases[activePhase]
  const PhaseIcon = phase.icon

  const simPhaseDetails = [
    {
      badge: t('PHASE 01: SMART WAREHOUSING', 'المرحلة 01: المستودعات الذكية'),
      sub: t('AMR Fleet Mesh & Staging', 'أسراب الروبوتات والتجهيز الذكي'),
      status: t('ACTIVE // 18 ROBOTS', 'نشط // 18 روبوت'),
    },
    {
      badge: t('PHASE 02: DOCK LOADING & SEAL', 'المرحلة 02: التحميل والختم'),
      sub: t('Robotic Retraction & Seal Logging', 'تراجع آلي وتسجيل الأختام'),
      status: t('CALIBRATED // SECURE', 'معاير // مؤمّن'),
    },
    {
      badge: t('PHASE 03: HEAVY FREIGHT ROUTING', 'المرحلة 03: النقل الثقيل'),
      sub: t('Electric Fleet Highway Telemetry', 'توجيه الشاحنات الكهربائية السريع'),
      status: t('HIGHWAY // LIVE', 'مسار سريع // مباشر'),
    },
  ]

  const currentSimDetail = simPhaseDetails[activePhase]

  return (
    <section
      ref={sectionRef}
      id={id}
      dir={direction}
      className="relative w-full bg-slate-950 text-white"
      aria-label={phase.title[language]}
    >
      {/* ─── PINNED VIEWPORT CONTAINER (GSAP PINNED) ─── */}
      <div
        ref={pinContainerRef}
        className="relative h-screen w-full overflow-hidden bg-slate-950"
      >

        {/* ─── DAYTIME SIMULATION VIDEO (OPACITY SMOOTH CROSSFADE) ─── */}
        <video
          ref={dayVideoRef}
          src="/videos/FINAL.mp4"
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="none"
          controls={false}
          autoPlay={false}
          loop={false}
          className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700 ease-in-out ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          <source src="/videos/FINAL.mp4" type="video/mp4" />
        </video>

        {/* ─── NOCTURNAL SIMULATION VIDEO (OPACITY SMOOTH CROSSFADE) ─── */}
        <video
          ref={nightVideoRef}
          src="/videos/FINALnight.mp4"
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="none"
          controls={false}
          autoPlay={false}
          loop={false}
          className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-700 ease-in-out ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        >
          <source src="/videos/FINALnight.mp4" type="video/mp4" />
        </video>

        {/* ─── BACKDROP TINT OVERLAY (Z-10, POINTER-EVENTS-NONE) ─── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-slate-950/60"
          aria-hidden="true"
        />

        {/* ─── LEFT PINNED STAGE CARD (Z-20, POINTER-EVENTS-AUTO) ─── */}
        <div
          className={`absolute top-24 md:top-1/2 md:-translate-y-1/2 left-4 sm:left-6 lg:left-8 z-20 w-[calc(100%-2rem)] sm:w-[350px] lg:w-[380px] pointer-events-auto ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        >
          {/* Phase Navigation Tabs with Smooth Auto-Scroll */}
          <div className={`flex items-center gap-2 mb-3 flex-wrap ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row'}`}>
            {PHASES.map((p) => {
              const isActive = p.index === activePhase
              return (
                <button
                  key={p.index}
                  onClick={() => {
                    const progressTargets = [0.08, 0.48, 0.85]
                    targetProgressRef.current = progressTargets[p.index]
                    currentProgressRef.current = progressTargets[p.index]
                    updatePhase(p.index)

                    if (scrollTriggerRef.current) {
                      const trigger = scrollTriggerRef.current
                      const targetScrollY = trigger.start + progressTargets[p.index] * (trigger.end - trigger.start)
                      window.scrollTo({
                        top: targetScrollY,
                        behavior: 'smooth',
                      })
                    }
                  }}
                  className={`min-h-[36px] flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gold-500/25 text-gold-300 border border-gold-400/80 shadow-[0_0_20px_rgba(232,179,23,0.4)] scale-105'
                      : 'bg-slate-950/80 text-slate-400 border border-white/10 hover:border-gold-400/40 hover:text-slate-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#E8B317] shadow-[0_0_8px_#E8B317] animate-pulse' : 'bg-slate-600'}`} />
                  <span>0{p.index + 1} // {language === 'ar' ? (p.index === 0 ? 'المستودعات' : p.index === 1 ? 'الأرصفة' : 'النقل الشرياني') : (p.index === 0 ? 'WAREHOUSING' : p.index === 1 ? 'DOCK' : 'HAULAGE')}</span>
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={`phase-${phase.index}`}
              initial={{ opacity: 0, x: -16, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: EASE_CURVE }}
              className="relative rounded-3xl p-5 sm:p-6 border border-gold-500/30 bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            >
              {/* Specular Top Reflection Line */}
              <div
                className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Header Kicker */}
              <div
                className={`mb-3 flex items-center gap-3 ${
                  isRTL ? 'flex-row-reverse justify-end' : 'flex-row'
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-300 border border-gold-400/30 shadow-[0_0_15px_rgba(232,179,23,0.25)]">
                  <PhaseIcon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#E8B317]">
                    {phase.kicker[language]}
                  </p>
                  <p className="text-[11px] font-semibold font-mono text-slate-400">
                    {i18n.ui.phaseCounter} {phase.index + 1} / {i18n.phases.length}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-extrabold leading-snug tracking-tight text-white mb-2">
                {phase.title[language]}
              </h2>

              {/* Subtitle */}
              <p className="text-xs leading-relaxed text-slate-300 mb-4">
                {phase.subtitle[language]}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2">
                {phase.metrics.map((metric, idx) => {
                  const MetricIcon = metric.icon
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.02 * idx, ease: EASE_CURVE }}
                      className="rounded-2xl p-2.5 bg-white/[0.04] border border-white/10 backdrop-blur-xl"
                    >
                      <div
                        className={`flex items-center gap-1.5 mb-1 ${
                          isRTL ? 'flex-row-reverse justify-end' : 'flex-row'
                        }`}
                      >
                        <MetricIcon className="h-3 w-3 shrink-0 text-gold-400" strokeWidth={2} />
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 truncate">
                          {metric.label[language]}
                        </span>
                      </div>
                      <p
                        dir="ltr"
                        className={`font-mono text-[10.5px] font-bold text-gold-300 ${
                          isAr ? 'text-right' : 'text-left'
                        }`}
                      >
                        {metric.value}
                      </p>
                    </motion.div>
                  )
                })}
              </div>
            </motion.article>
          </AnimatePresence>

          {/* Floating Projected Telemetry Badge */}
          <motion.div
            key={`proj-${activePhase}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-3 p-3 rounded-2xl border border-gold-500/30 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-between gap-2 shadow-[0_0_20px_rgba(232,179,23,0.15)]"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="font-mono text-[10px] font-bold text-slate-200">
                {PHASES[activePhase].floatingProjection[language]}
              </span>
            </div>
            {/* Dynamic Telemetry Ping with yellow/amber reservation */}
            <span className="font-mono text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-[#EAB308]/20 text-[#EAB308] border border-[#EAB308]/40 shadow-[0_0_8px_rgba(234,179,8,0.3)]">
              {PHASES[activePhase].projectedStatus}
            </span>
          </motion.div>
        </div>

        {/* Phase Progress Rail (Desktop Right) */}
        <div className="hidden md:flex absolute top-1/2 right-4 sm:right-6 lg:right-8 z-20 -translate-y-1/2 flex-col items-center gap-2">
          {i18n.phases.map((p) => (
            <div
              key={p.index}
              className={`w-1.5 rounded-full transition-all duration-400 ${
                p.index === activePhase
                  ? 'h-10 bg-gold-400 shadow-[0_0_15px_rgba(232,179,23,1)] scale-y-110'
                  : 'h-6 bg-slate-700/60'
              }`}
              role="presentation"
            />
          ))}
        </div>

        {/* Scroll Prompt Hint (Phase 1) */}
        <AnimatePresence>
          {activePhase === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 pointer-events-none"
            >
              <span className="font-mono text-[10px] font-semibold tracking-widest uppercase text-slate-400">
                {i18n.ui.scrollHint}
              </span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="h-4 w-4 text-[#E8B317]" />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom-Right SIM ENGINE HUD Widget */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden sm:block absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-20 w-[310px] sm:w-[360px] lg:w-[390px]"
          aria-label="Simulation Telemetry Monitoring Panel"
        >
          <div 
            className="rounded-3xl border border-gold-500/30 bg-slate-950/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
            style={{
              paddingRight: '9px',
              marginLeft: '1px',
              marginRight: '-15px',
              marginTop: '6px',
              marginBottom: '3px',
              paddingTop: '23px',
              paddingLeft: '19px',
              paddingBottom: '23px',
              height: '214px',
              width: '410px'
            }}
          >
            {/* Top Telemetry Status Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span className="font-mono font-extrabold text-[10px] tracking-wider text-gold-400">
                  {i18n.ui.simulationBadge}: ONLINE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-lg bg-gold-500/15 border border-gold-400/30 text-[9px] font-mono font-bold text-gold-300">
                  SCROLL SCRUB
                </span>

                <div className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-gold-400" />
                  <span ref={telemetryTimeSpanRef} className="font-mono text-[10px] font-bold text-slate-400">
                    T+00:00.00
                  </span>
                </div>
              </div>
            </div>

            {/* Dynamic Phase Status */}
            <div className={`mb-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <span className="font-bold font-mono text-[11px] text-gold-300 truncate">
                  {currentSimDetail.badge[language]}
                </span>
                <span className="px-2 py-0.5 rounded-full font-mono text-[9px] font-bold shrink-0 bg-gold-500/15 text-gold-300 border border-gold-500/30">
                  {currentSimDetail.status[language]}
                </span>
              </div>
              <p className="text-[11px] leading-tight text-slate-300">
                {currentSimDetail.sub[language]}
              </p>
            </div>

            {/* Signal Stream & Telemetry Waveform Bar */}
            <div className="p-2.5 rounded-2xl mb-2.5 flex items-center justify-between gap-2.5 bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">
                  STREAM: 99.8% FIDELITY
                </span>
              </div>
              <div className="flex items-end gap-1 h-3">
                <span className="w-0.5 bg-gold-400 rounded-xs animate-pulse h-1.5" />
                <span className="w-0.5 bg-gold-400 rounded-xs animate-pulse h-3 delay-75" />
                <span className="w-0.5 bg-gold-400 rounded-xs animate-pulse h-1 delay-150" />
                <span className="w-0.5 bg-gold-400 rounded-xs animate-pulse h-2.5 delay-100" />
              </div>
            </div>

            {/* Operational Clarification Notice */}
            <div className="pt-2 border-t border-white/10">
              <div className={`flex items-start gap-1.5 ${isAr ? 'text-right flex-row-reverse' : 'text-left'}`}>
                <Activity className="w-3 h-3 shrink-0 mt-0.5 text-gold-400" />
                <p className="text-[9.5px] leading-relaxed text-slate-400">
                  {i18n.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Mobile Bottom Floating Action Bar */}
        <div className="sm:hidden absolute bottom-4 inset-x-4 z-20 flex items-center justify-between p-2.5 rounded-2xl bg-slate-950/90 border border-gold-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] font-mono font-bold text-gold-300">
              0{activePhase + 1} // {PHASES[activePhase]?.kicker[language]?.split('//')[1] || ''}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-300">
            <ChevronDown className="w-3 h-3 text-[#D3EE22] animate-bounce" />
            <span>{language === 'ar' ? 'مرر للتحكم' : 'SCROLL TO SCRUB'}</span>
          </div>
        </div>

      </div>
    </section>
  )
}
