'use client'

/**
 * LandLogisticsSection — YASLOGIST Land Operations Scrollytelling
 *
 * Synchronized Dual-Track Video Architecture:
 * - Light Mode: /videos/FINAL.mp4 (High-fidelity cinematic daytime)
 * - Dark Mode: /videos/FINALnight.mp4 (Authentic nocturnal logistics environment)
 * - Frame-accurate dual-track time synchronization via requestAnimationFrame + ScrollTrigger.
 * - GPU-accelerated cross-fading (opacity transition with will-change: opacity, transform).
 * - Zero synthetic overlays — pristine authentic lighting across both themes.
 * - Left-anchored spatial layout for 100% unobstructed visibility of AMRs, forklifts, and trucks in LTR & RTL.
 */

import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
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
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import type {
  BilingualText,
  LandLogisticsSectionProps,
  PhaseProps,
  TranslationProps,
} from '@/types/land-logistics'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

/* ========================================================================== */
/*  Constants & Content Matrix                                                */
/* ========================================================================== */

const EASE_CURVE: [number, number, number, number] = [0.22, 1, 0.36, 1]
const DEFAULT_SCROLL_LENGTH = 5

const t = (en: string, ar: string): BilingualText => ({ en, ar })

const PHASES: PhaseProps[] = [
  {
    index: 0,
    range: [0, 0.35] as const,
    icon: Warehouse,
    kicker: t('Infrastructure Management', 'إدارة البنية التحتية'),
    title: t(
      'Phase 1 — Smart Warehouses & Automation',
      'المرحلة الأولى — المستودعات الذكية والأتمتة',
    ),
    subtitle: t(
      'Infrastructure Management: Directing Autonomous Mobile Robots (AMRs) for high-precision sorting, batching, and preparation within distribution centers.',
      'إدارة البنية التحتية: توجيه الروبوتات المستقلة (AMRs) لتصنيف وتجميع وتجهيز الشحنات بدقة فائقة داخل مراكز التوزيع اللوجستية.',
    ),
    metrics: [
      { id: 'amr-sync', icon: Cpu, label: t('AMR Node Sync', 'مزامنة عقد الروبوتات'), value: '12ms LATENCY' },
      { id: 'iot', icon: Activity, label: t('IoT Sensors', 'مستشعرات إنترنت الأشياء'), value: 'CALIBRATED' },
      { id: 'sort', icon: ShieldCheck, label: t('Sort Efficiency', 'كفاءة التصنيف'), value: '99.9% OPTIMIZED' },
    ],
  },
  {
    index: 1,
    range: [0.35, 0.7] as const,
    icon: Forklift,
    kicker: t('Ground Operations', 'العمليات الأرضية'),
    title: t(
      'Phase 2 — Automated Loading & Asset Security',
      'المرحلة الثانية — التحميل الآلي وتأمين الأصول',
    ),
    subtitle: t(
      'Ground Operations: Synchronizing equipment movement and safe forklift retraction with container telemetry for secure sealing and security compliance (Zero-Loss).',
      'العمليات الأرضية: مزامنة حركة المعدات وتراجع الرافعة الآمن مع مستشعرات الحاويات لضمان الإغلاق المحكم والامتثال الأمني (Zero-Loss).',
    ),
    metrics: [
      { id: 'load-cycle', icon: Forklift, label: t('Load Cycle', 'دورة التحميل'), value: '02:14 MIN' },
      { id: 'telemetry', icon: ShieldCheck, label: t('Telemetry Link', 'رابط القياس عن بُعد'), value: 'SECURED' },
      { id: 'docking', icon: Warehouse, label: t('Docking Bay', 'رصيف الإرساء'), value: 'ALIGNED' },
    ],
  },
  {
    index: 2,
    range: [0.7, 1.0] as const,
    icon: Truck,
    kicker: t('Network Management', 'إدارة الشبكة'),
    title: t(
      'Phase 3 — Heavy Freight & Last Mile',
      'المرحلة الثالثة — النقل الثقيل والميل الأخير',
    ),
    subtitle: t(
      'Network Management: Routing advanced truck fleets via AI-driven dynamic paths with real-time trip status monitoring.',
      'إدارة الشبكة: توجيه أسطول الشاحنات المتقدمة عبر مسارات ديناميكية مدعومة بالذكاء الاصطناعي ومراقبة الحالة اللحظية للرحلة.',
    ),
    metrics: [
      { id: 'grid', icon: Cpu, label: t('Grid Power', 'طاقة الشبكة'), value: '94% EFFICIENT' },
      { id: 'gps', icon: Globe, label: t('GPS Route', 'مسار GPS'), value: 'DYNAMIC REAL-TIME' },
      { id: 'eta', icon: Activity, label: t('ETA Variance', 'انحراف وقت الوصول'), value: '< 1.2 MIN' },
    ],
  },
]

const DISCLAIMER: BilingualText = t(
  'High-Fidelity Telemetry Simulation — All telemetry values, sensor streams, and operational metrics represent simulated digital twin models illustrating YASLOGIST autonomous mechanics.',
  'نموذج محاكاة للقياس عن بُعد عالي الدقة — جميع قراءات القياس ومستشعرات البيانات المعروضة هي نماذج محاكاة رقمية توضح الآلية التشغيلية لمنظومة ياسلوجيست المستقلة.',
)

/* ========================================================================== */
/*  Zero-Color Optical Glass Styling Tokens                                   */
/* ========================================================================== */

const S = {
  card: {
    dark: 'border border-white/15 bg-white/[0.03] backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)]',
    light: 'border border-slate-300/80 bg-white/80 backdrop-blur-2xl shadow-[0_16px_40px_rgba(15,23,42,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]',
  },
  metric: {
    dark: 'border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:border-cyan-400/40 transition-colors',
    light: 'border border-slate-200/80 bg-white/70 backdrop-blur-xl shadow-xs hover:border-cyan-500/40 transition-colors',
  },
  icon: {
    dark: 'bg-white/[0.04] text-cyan-300 border border-white/15 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    light: 'bg-cyan-50 text-cyan-800 border border-cyan-200/80 shadow-xs',
  },
  railActive: 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] scale-y-110',
  railInactive: { dark: 'bg-slate-700/60', light: 'bg-slate-300' },
  text: {
    title: { dark: 'text-white', light: 'text-slate-900' },
    subtitle: { dark: 'text-slate-300', light: 'text-slate-700' },
    muted: { dark: 'text-slate-400', light: 'text-slate-500' },
    metric: { dark: 'text-cyan-300', light: 'text-cyan-800' },
  },
} as const

type Mode = 'dark' | 'light'

/* ========================================================================== */
/*  Component                                                                  */
/* ========================================================================== */

export default function LandLogisticsSection({
  id = 'land-logistics',
  scrollLength = DEFAULT_SCROLL_LENGTH,
}: LandLogisticsSectionProps) {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const sectionRef = useRef<HTMLElement | null>(null)
  const lightVideoRef = useRef<HTMLVideoElement | null>(null)
  const darkVideoRef = useRef<HTMLVideoElement | null>(null)

  const targetProgressRef = useRef<number>(0)
  const currentProgressRef = useRef<number>(0)
  const animFrameIdRef = useRef<number | null>(null)

  const [activePhase, setActivePhase] = useState<number>(0)
  const [telemetryTime, setTelemetryTime] = useState<string>('00:00:00')

  const isRTL = direction === 'rtl'
  const isAr = language === 'ar'

  const mode: Mode = resolvedTheme === 'light' ? 'light' : 'dark'

  /* ── i18n Matrix ── */
  const i18n: TranslationProps = useMemo<TranslationProps>(
    () => ({
      language,
      direction,
      phases: PHASES,
      disclaimer: DISCLAIMER[language],
      ui: {
        scrollHint: language === 'ar' ? 'مرّر لاستكشاف العمليات' : 'Scroll to explore operations',
        phaseCounter: language === 'ar' ? 'المرحلة' : 'Phase',
        simulationBadge: language === 'ar' ? 'لوحة القياس عن بعد للمحاكاة الذكية' : 'AI SIMULATION TELEMETRY',
        themeToggle: language === 'ar' ? 'تبديل المظهر' : 'Toggle theme',
        languageToggle: language === 'ar' ? 'English' : 'العربية',
      },
    }),
    [language, direction],
  )

  const updatePhase = useCallback((next: number) => {
    setActivePhase((prev) => (prev === next ? prev : next))
  }, [])

  /* ── Synchronized Dual-Track Video Scrubber (Light & Dark Lockstep) ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const lightVideo = lightVideoRef.current
    const darkVideo = darkVideoRef.current

    if (lightVideo) lightVideo.pause()
    if (darkVideo) darkVideo.pause()

    gsap.registerPlugin(ScrollTrigger)

    let isRunning = true

    const syncVideoTime = (videoEl: HTMLVideoElement | null, targetTime: number) => {
      if (!videoEl) return
      if (videoEl.duration && !isNaN(videoEl.duration) && videoEl.duration > 0) {
        const clampedTime = Math.max(0, Math.min(targetTime, videoEl.duration - 0.02))
        if (Math.abs(videoEl.currentTime - clampedTime) > 0.005) {
          videoEl.currentTime = clampedTime
        }
      }
    }

    const renderLoop = () => {
      if (!isRunning) return

      const targetP = targetProgressRef.current
      const curP = currentProgressRef.current
      const diff = targetP - curP

      if (Math.abs(diff) > 0.0001) {
        currentProgressRef.current += diff * 0.32
      } else {
        currentProgressRef.current = targetP
      }

      const p = currentProgressRef.current
      const activeVideo = mode === 'dark' ? darkVideoRef.current : lightVideoRef.current
      const dur = activeVideo?.duration && !isNaN(activeVideo.duration) && activeVideo.duration > 0
        ? activeVideo.duration
        : 5.0

      const targetTime = p * dur

      // Synchronize both Light and Dark tracks simultaneously in exact lockstep
      syncVideoTime(lightVideoRef.current, targetTime)
      syncVideoTime(darkVideoRef.current, targetTime)

      const totalSeconds = p * 60 + (activePhase * 30)
      const minutes = Math.floor(totalSeconds / 60)
      const seconds = Math.floor(totalSeconds % 60)
      const millis = Math.floor((totalSeconds % 1) * 100)
      setTelemetryTime(
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(2, '0')}`
      )

      animFrameIdRef.current = requestAnimationFrame(renderLoop)
    }

    animFrameIdRef.current = requestAnimationFrame(renderLoop)

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        targetProgressRef.current = p

        let idx = 0
        if (p >= 0.7) {
          idx = 2
        } else if (p >= 0.35) {
          idx = 1
        } else {
          idx = 0
        }
        updatePhase(idx)
      },
    })

    const onVideoReady = () => {
      ScrollTrigger.refresh()
    }

    if (lightVideo) {
      if (lightVideo.readyState >= 2) onVideoReady()
      else {
        lightVideo.addEventListener('loadedmetadata', onVideoReady, { once: true })
        lightVideo.addEventListener('canplay', onVideoReady, { once: true })
      }
    }

    if (darkVideo) {
      if (darkVideo.readyState >= 2) onVideoReady()
      else {
        darkVideo.addEventListener('loadedmetadata', onVideoReady, { once: true })
        darkVideo.addEventListener('canplay', onVideoReady, { once: true })
      }
    }

    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      isRunning = false
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      window.removeEventListener('resize', handleResize)
      if (lightVideo) {
        lightVideo.removeEventListener('loadedmetadata', onVideoReady)
        lightVideo.removeEventListener('canplay', onVideoReady)
      }
      if (darkVideo) {
        darkVideo.removeEventListener('loadedmetadata', onVideoReady)
        darkVideo.removeEventListener('canplay', onVideoReady)
      }
      trigger.kill()
    }
  }, [mode, activePhase, updatePhase])

  const phase = i18n.phases[activePhase]
  const PhaseIcon = phase.icon

  // Simulation Phase Telemetry Labels
  const simPhaseDetails = [
    {
      badge: t('PHASE 01: SMART WAREHOUSING', 'المرحلة 01: المستودعات الذكية'),
      sub: t('AMR Fleet Mesh & Dynamic Staging', 'شبكة أسراب الروبوتات والتجهيز الديناميكي'),
      status: t('ACTIVE DISPATCH // 12ms', 'إرسال نشط // 12ms'),
    },
    {
      badge: t('PHASE 02: DOCK LOADING & SEAL', 'المرحلة 02: التحميل والأمان'),
      sub: t('Robotic Retraction & Zero-Loss Lock', 'تراجع آلي وقفل أمني خالي من الفقدان'),
      status: t('CALIBRATED // SECURE', 'معاير // مؤمّن'),
    },
    {
      badge: t('PHASE 03: HEAVY FREIGHT ROUTING', 'المرحلة 03: النقل الثقيل'),
      sub: t('Electric Fleet Highway Telemetry', 'توجيه الشاحنات الكهربائية عبر الطرق السريعة'),
      status: t('HIGHWAY SYNC // LIVE', 'مزامنة المسار السريع // مباشر'),
    },
  ]

  const currentSimDetail = simPhaseDetails[activePhase]

  return (
    <section
      ref={sectionRef}
      id={id}
      dir={direction}
      className="relative w-full bg-slate-950"
      style={{ height: `${scrollLength * 100}vh` }}
      aria-label={phase.title[language]}
    >
      {/* ─── Sticky Viewport Container ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ─── DAYTIME VIDEO: Light Mode Source (/videos/FINAL.mp4) ─── */}
        <video
          ref={lightVideoRef}
          src="/videos/FINAL.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover scale-[1.08] origin-center transition-opacity duration-700 ease-in-out z-0 ${
            mode === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            willChange: 'opacity, transform',
          }}
          aria-hidden="true"
        />

        {/* ─── NIGHTTIME VIDEO: Dark Mode Source (/videos/FINALnight.mp4) ─── */}
        <video
          ref={darkVideoRef}
          src="/videos/FINALnight.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover scale-[1.08] origin-center transition-opacity duration-700 ease-in-out z-0 ${
            mode === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            willChange: 'opacity, transform',
          }}
          aria-hidden="true"
        />

        {/* ─── Protective Corner Vignette (Guarantees Zero Watermark Exposure & Text Contrast) ─── */}
        <div
          className={`pointer-events-none absolute bottom-0 right-0 w-80 h-56 z-10 ${
            mode === 'dark'
              ? 'bg-gradient-to-tl from-slate-950/95 via-slate-950/40 to-transparent'
              : 'bg-gradient-to-tl from-slate-900/25 via-slate-900/05 to-transparent'
          }`}
          aria-hidden="true"
        />

        {/* ─── RTL & Spatial Layout Optimization ─── */}
        {/* Fixed on the LEFT side of the screen in BOTH LTR and RTL so the AMRs/Trucks on the RIGHT are 100% visible */}
        <div className="relative z-10 flex h-full items-center px-4 sm:px-8 lg:px-16 max-w-7xl mx-auto pointer-events-none">
          <div
            className={`w-full max-w-xl lg:max-w-2xl pointer-events-auto ml-0 mr-auto ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.article
                key={`phase-${phase.index}`}
                initial={{ opacity: 0, y: 30, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.45, ease: EASE_CURVE }}
                className={`relative rounded-3xl p-6 sm:p-9 ${S.card[mode]}`}
              >
                {/* Specular Top Reflection Line */}
                <div
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                  aria-hidden="true"
                />

                {/* Header Kicker */}
                <div
                  className={`mb-4 flex items-center gap-3.5 ${
                    isRTL ? 'flex-row-reverse justify-end' : 'flex-row'
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${S.icon[mode]}`}
                  >
                    <PhaseIcon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <p
                      className={`font-bold uppercase text-cyan-400 ${
                        isAr ? 'text-xs tracking-normal' : 'text-[11px] tracking-[0.25em]'
                      }`}
                    >
                      {phase.kicker[language]}
                    </p>
                    <p
                      className={`font-semibold font-mono ${S.text.muted[mode]} ${
                        isAr ? 'text-xs tracking-normal' : 'text-xs tracking-widest'
                      }`}
                    >
                      {i18n.ui.phaseCounter} {phase.index + 1} / {i18n.phases.length}
                    </p>
                  </div>
                </div>

                {/* Title */}
                <h2
                  className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight ${S.text.title[mode]}`}
                >
                  {phase.title[language]}
                </h2>

                {/* Subtitle */}
                <p className={`mt-3 text-xs sm:text-sm lg:text-base leading-relaxed ${S.text.subtitle[mode]}`}>
                  {phase.subtitle[language]}
                </p>

                {/* Metrics Grid */}
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {phase.metrics.map((metric, idx) => {
                    const MetricIcon = metric.icon
                    return (
                      <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.04 * idx, ease: EASE_CURVE }}
                        className={`rounded-2xl px-3.5 py-3 ${S.metric[mode]}`}
                      >
                        <div
                          className={`flex items-center gap-2 ${
                            isRTL ? 'flex-row-reverse justify-end' : 'flex-row'
                          }`}
                        >
                          <MetricIcon className="h-3.5 w-3.5 shrink-0 text-cyan-400" strokeWidth={2} />
                          <span
                            className={`font-semibold uppercase ${S.text.muted[mode]} ${
                              isAr ? 'text-[11px] tracking-normal' : 'text-[10px] tracking-wider'
                            }`}
                          >
                            {metric.label[language]}
                          </span>
                        </div>
                        <p
                          dir="ltr"
                          className={`mt-1.5 font-mono text-xs sm:text-sm font-bold tracking-wider ${
                            S.text.metric[mode]
                          } ${isAr ? 'text-right' : 'text-left'}`}
                        >
                          {metric.value}
                        </p>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Phase Progress Rail ─── */}
        <div className="absolute top-1/2 right-4 sm:right-6 lg:right-8 z-20 flex -translate-y-1/2 flex-col items-center gap-3">
          {i18n.phases.map((p) => (
            <div
              key={p.index}
              className={`h-11 w-1.5 rounded-full transition-all duration-400 ${
                p.index === activePhase ? S.railActive : S.railInactive[mode]
              }`}
              role="presentation"
            />
          ))}
        </div>

        {/* ─── Scroll Prompt Hint (Phase 1) ─── */}
        <AnimatePresence>
          {activePhase === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1.5 pointer-events-none"
            >
              <span
                className={`font-semibold uppercase ${S.text.subtitle[mode]} ${
                  isAr ? 'text-xs tracking-normal' : 'text-[11px] tracking-[0.25em]'
                }`}
              >
                {i18n.ui.scrollHint}
              </span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="h-4 w-4 text-cyan-400" />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── AI Simulation Telemetry Panel (Bottom Right) ─── */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-4 sm:bottom-6 right-3 sm:right-6 lg:right-8 z-20 w-[330px] sm:w-[410px] lg:w-[450px]"
          aria-label="Simulation Telemetry Monitoring Panel"
        >
          <div
            className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 ${S.card[mode]}`}
          >
            {/* Top Telemetry Status Header */}
            <div
              className={`flex items-center justify-between pb-3 mb-3 border-b ${
                mode === 'dark' ? 'border-white/[0.08]' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span
                  className={`font-mono font-extrabold text-[10px] tracking-wider text-cyan-400`}
                >
                  {isAr ? 'محرك المحاكاة: متصل' : 'SIM_ENGINE: ACTIVE'}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[10px] font-bold text-slate-400">
                  T+{telemetryTime}
                </span>
              </div>
            </div>

            {/* Dynamic Phase Status & State */}
            <div className={`mb-3 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between gap-2 mb-1">
                <span
                  className={`font-bold font-mono text-[11px] text-cyan-300 tracking-wide`}
                >
                  {currentSimDetail.badge[language]}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-md font-mono text-[9px] font-bold ${
                    mode === 'dark'
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                      : 'bg-cyan-100 border border-cyan-300 text-cyan-900'
                  }`}
                >
                  {currentSimDetail.status[language]}
                </span>
              </div>
              <p
                className={`text-[11px] leading-snug font-medium ${
                  mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {currentSimDetail.sub[language]}
              </p>
            </div>

            {/* Animated Telemetry Waveform / Bar Indicators */}
            <div
              className={`p-2.5 rounded-2xl mb-3 flex items-center justify-between gap-3 ${
                mode === 'dark' ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-mono text-[9px] uppercase font-bold text-slate-400">
                  DATA STREAM: 99.8% FIDELITY
                </span>
              </div>

              {/* Dynamic Animated Signal Equalizer Bars */}
              <div className="flex items-end gap-1 h-3.5">
                <span className="w-1 bg-cyan-400 rounded-xs animate-pulse h-2" />
                <span className="w-1 bg-cyan-400 rounded-xs animate-pulse h-3.5 delay-75" />
                <span className="w-1 bg-cyan-400 rounded-xs animate-pulse h-1.5 delay-150" />
                <span className="w-1 bg-cyan-400 rounded-xs animate-pulse h-3 delay-100" />
                <span className="w-1 bg-cyan-400 rounded-xs animate-pulse h-2.5 delay-200" />
              </div>
            </div>

            {/* Operational Clarification Notice */}
            <div
              className={`pt-2.5 border-t ${
                mode === 'dark' ? 'border-white/[0.06]' : 'border-slate-200'
              }`}
            >
              <div className={`flex items-start gap-2 ${isAr ? 'text-right flex-row-reverse' : 'text-left'}`}>
                <Activity className="w-3.5 h-3.5 shrink-0 mt-0.5 text-cyan-400" />
                <p
                  className={`text-[10px] sm:text-[10.5px] leading-relaxed ${
                    mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {i18n.disclaimer}
                </p>
              </div>
            </div>
          </div>
        </motion.aside>

      </div>
    </section>
  )
}
