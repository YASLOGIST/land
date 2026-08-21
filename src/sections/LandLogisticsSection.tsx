'use client'

/**
 * LandLogisticsSection — YASLOGIST Land Operations Scrollytelling
 *
 * Directive 1: Absolute Zero-Occlusion Left-Pinned Stage Cards
 * - Strict, fixed vertical timeline stack pinned to the absolute left margin (left-4 sm:left-6 lg:left-8 top-1/2 -translate-y-1/2).
 * - Maximum width strictly constrained (w-[310px] sm:w-[345px] lg:w-[370px]) so the center and right regions
 *   (where AMRs, forklifts, and heavy trucks operate in all 3 stages) remain 100% visible and unobstructed.
 *
 * Directive 2: Double-Mount True Cinematic Theme Cross-Fade
 * - Both /videos/FINAL.mp4 (Light) and /videos/FINALnight.mp4 (Dark) mounted simultaneously in the DOM.
 * - Dark video opacity tied to theme with `transition-opacity duration-1000 ease-in-out` for a butter-smooth,
 *   continuous, and jump-free theme transition.
 * - Frame-accurate time synchronization in lockstep across both video elements.
 *
 * Directive 1 (Part B): Natural Corner Occlusion
 * - Expanded 'SIM ENGINE' HUD widget positioned in the bottom-right corner to naturally and imperceptibly
 *   cover the video generation artifact without any artificial post-processing blur on the video itself.
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
      'Directing Autonomous Mobile Robots (AMRs) for high-precision sorting, batching, and preparation within distribution centers.',
      'توجيه الروبوتات المستقلة (AMRs) لتصنيف وتجميع وتجهيز الشحنات بدقة فائقة داخل مراكز التوزيع اللوجستية.',
    ),
    metrics: [
      { id: 'amr-sync', icon: Cpu, label: t('AMR Sync', 'مزامنة الروبوتات'), value: '12ms LATENCY' },
      { id: 'iot', icon: Activity, label: t('IoT Sensors', 'مستشعرات IoT'), value: 'CALIBRATED' },
      { id: 'sort', icon: ShieldCheck, label: t('Sort SLA', 'كفاءة الفرز'), value: '99.9% OPTIMAL' },
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
      'Synchronizing equipment movement and safe forklift retraction with container telemetry for secure sealing and Zero-Loss compliance.',
      'مزامنة حركة المعدات وتراجع الرافعة الآمن مع مستشعرات الحاويات لضمان الإغلاق المحكم والامتثال الأمني (Zero-Loss).',
    ),
    metrics: [
      { id: 'load-cycle', icon: Forklift, label: t('Load Cycle', 'دورة التحميل'), value: '02:14 MIN' },
      { id: 'telemetry', icon: ShieldCheck, label: t('Telemetry', 'رابط القياس'), value: 'SECURED' },
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
      'Routing advanced truck fleets via AI-driven dynamic paths with continuous trip status and real-time waypoint telemetry.',
      'توجيه أسطول الشاحنات المتقدمة عبر مسارات ديناميكية مدعومة بالذكاء الاصطناعي ومراقبة الحالة اللحظية للرحلة.',
    ),
    metrics: [
      { id: 'grid', icon: Cpu, label: t('Grid Power', 'طاقة الشبكة'), value: '94% EFFICIENT' },
      { id: 'gps', icon: Globe, label: t('GPS Route', 'مسار GPS'), value: 'DYNAMIC' },
      { id: 'eta', icon: Activity, label: t('ETA Margin', 'هامش الوصول'), value: '< 1.2 MIN' },
    ],
  },
]

const DISCLAIMER: BilingualText = t(
  'High-Fidelity Telemetry Simulation — Digital twin model illustrating YASLOGIST autonomous mechanics.',
  'نموذج محاكاة للقياس عن بُعد عالي الدقة — يوضح الآلية التشغيلية لمنظومة ياسلوجيست المستقلة.',
)

/* ========================================================================== */
/*  Zero-Color Optical Glass Styling Tokens                                   */
/* ========================================================================== */

const S = {
  card: {
    dark: 'border border-white/15 bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.18)]',
    light: 'border border-slate-300/90 bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(15,23,42,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)]',
  },
  metric: {
    dark: 'border border-white/10 bg-white/[0.03] backdrop-blur-xl hover:border-cyan-400/40 transition-colors',
    light: 'border border-slate-200 bg-white/80 backdrop-blur-xl shadow-xs hover:border-cyan-500/50 transition-colors',
  },
  icon: {
    dark: 'bg-white/[0.05] text-cyan-300 border border-white/15 shadow-[0_0_15px_rgba(6,182,212,0.25)]',
    light: 'bg-cyan-50 text-cyan-900 border border-cyan-300 shadow-xs',
  },
  railActive: 'bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] scale-y-110',
  railInactive: { dark: 'bg-slate-700/60', light: 'bg-slate-300' },
  text: {
    title: { dark: 'text-white', light: 'text-slate-950' },
    subtitle: { dark: 'text-slate-300', light: 'text-slate-800' },
    muted: { dark: 'text-slate-400', light: 'text-slate-600' },
    metric: { dark: 'text-cyan-300', light: 'text-cyan-950' },
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
      sub: t('AMR Fleet Mesh & Dynamic Staging', 'أسراب الروبوتات والتجهيز الذكي'),
      status: t('ACTIVE // 12ms', 'نشط // 12ms'),
    },
    {
      badge: t('PHASE 02: DOCK LOADING & SEAL', 'المرحلة 02: التحميل والختم'),
      sub: t('Robotic Retraction & Zero-Loss Lock', 'تراجع آلي وقفل أمني خالي من الفقدان'),
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
      className="relative w-full bg-slate-950"
      style={{ height: `${scrollLength * 100}vh` }}
      aria-label={phase.title[language]}
    >
      {/* ─── Sticky Viewport Container ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ─── DIRECTIVE 2: DOUBLE-MOUNT CINEMATIC THEME CROSS-FADE ─── */}
        {/* BASE LAYER: Daytime Video (/videos/FINAL.mp4) */}
        <video
          ref={lightVideoRef}
          src="/videos/FINAL.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className="pointer-events-none absolute inset-0 h-full w-full object-cover scale-[1.05] origin-center z-0"
          style={{ willChange: 'transform' }}
          aria-hidden="true"
        />

        {/* OVERLAY LAYER: Nocturnal Video (/videos/FINALnight.mp4) with 1000ms butter-smooth opacity cross-fade */}
        <video
          ref={darkVideoRef}
          src="/videos/FINALnight.mp4"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover scale-[1.05] origin-center z-1 transition-opacity duration-1000 ease-in-out ${
            mode === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity, transform' }}
          aria-hidden="true"
        />

        {/* ─── DIRECTIVE 1: ABSOLUTE ZERO-OCCLUSION LEFT-PINNED STAGE CARDS ─── */}
        {/* Strictly pinned to the left edge so center/right (AMRs, Forklifts, Trucks) are 100% visible */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 left-4 sm:left-6 lg:left-8 z-20 w-[310px] sm:w-[345px] lg:w-[370px] pointer-events-auto ${
            isRTL ? 'text-right' : 'text-left'
          }`}
        >
          {/* Vertical Timeline Step Navigation Pills */}
          <div className={`flex items-center gap-1.5 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : 'flex-row'}`}>
            {PHASES.map((p) => {
              const isActive = p.index === activePhase
              return (
                <div
                  key={p.index}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9.5px] font-mono font-bold transition-all duration-300 ${
                    isActive
                      ? mode === 'dark'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_10px_rgba(6,182,212,0.35)]'
                        : 'bg-cyan-100 text-cyan-950 border border-cyan-400 shadow-xs'
                      : mode === 'dark'
                        ? 'bg-white/[0.04] text-slate-400 border border-white/10'
                        : 'bg-white/70 text-slate-600 border border-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-400'}`} />
                  <span>0{p.index + 1}</span>
                </div>
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
              className={`relative rounded-3xl p-4 sm:p-5 ${S.card[mode]}`}
            >
              {/* Specular Top Reflection Line */}
              <div
                className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none"
                aria-hidden="true"
              />

              {/* Header Kicker */}
              <div
                className={`mb-2.5 flex items-center gap-2.5 ${
                  isRTL ? 'flex-row-reverse justify-end' : 'flex-row'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${S.icon[mode]}`}
                >
                  <PhaseIcon className="h-4 w-4" strokeWidth={1.8} />
                </span>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p
                    className={`font-bold uppercase text-cyan-400 ${
                      isAr ? 'text-[10px] tracking-normal' : 'text-[9.5px] tracking-[0.18em]'
                    }`}
                  >
                    {phase.kicker[language]}
                  </p>
                  <p
                    className={`font-semibold font-mono ${S.text.muted[mode]} ${
                      isAr ? 'text-[10px] tracking-normal' : 'text-[10px] tracking-wider'
                    }`}
                  >
                    {i18n.ui.phaseCounter} {phase.index + 1} / {i18n.phases.length}
                  </p>
                </div>
              </div>

              {/* Title */}
              <h2
                className={`text-lg sm:text-xl font-extrabold leading-tight tracking-tight ${S.text.title[mode]}`}
              >
                {phase.title[language]}
              </h2>

              {/* Subtitle */}
              <p className={`mt-2 text-xs leading-relaxed ${S.text.subtitle[mode]}`}>
                {phase.subtitle[language]}
              </p>

              {/* Metrics Grid */}
              <div className="mt-4 grid grid-cols-3 gap-1.5">
                {phase.metrics.map((metric, idx) => {
                  const MetricIcon = metric.icon
                  return (
                    <motion.div
                      key={metric.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.02 * idx, ease: EASE_CURVE }}
                      className={`rounded-xl p-2 ${S.metric[mode]}`}
                    >
                      <div
                        className={`flex items-center gap-1 ${
                          isRTL ? 'flex-row-reverse justify-end' : 'flex-row'
                        }`}
                      >
                        <MetricIcon className="h-2.5 w-2.5 shrink-0 text-cyan-400" strokeWidth={2} />
                        <span
                          className={`font-semibold uppercase truncate ${S.text.muted[mode]} ${
                            isAr ? 'text-[9px] tracking-normal' : 'text-[8.5px] tracking-wider'
                          }`}
                        >
                          {metric.label[language]}
                        </span>
                      </div>
                      <p
                        dir="ltr"
                        className={`mt-0.5 font-mono text-[10px] sm:text-[11px] font-bold tracking-tight ${
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

        {/* ─── Phase Progress Rail ─── */}
        <div className="absolute top-1/2 right-4 sm:right-6 lg:right-8 z-20 flex -translate-y-1/2 flex-col items-center gap-2">
          {i18n.phases.map((p) => (
            <div
              key={p.index}
              className={`h-8 w-1.5 rounded-full transition-all duration-400 ${
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
              className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-1 pointer-events-none"
            >
              <span
                className={`font-semibold uppercase ${S.text.subtitle[mode]} ${
                  isAr ? 'text-xs tracking-normal' : 'text-[10px] tracking-[0.2em]'
                }`}
              >
                {i18n.ui.scrollHint}
              </span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="h-3.5 w-3.5 text-cyan-400" />
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── DIRECTIVE 1 (Part B): Naturally Occluding Bottom-Right SIM ENGINE HUD Widget ─── */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-20 w-[310px] sm:w-[360px] lg:w-[400px]"
          aria-label="Simulation Telemetry Monitoring Panel"
        >
          <div
            className={`rounded-3xl p-4 sm:p-5 border transition-all duration-300 ${S.card[mode]}`}
          >
            {/* Top Telemetry Status Header */}
            <div
              className={`flex items-center justify-between pb-2.5 mb-2.5 border-b ${
                mode === 'dark' ? 'border-white/[0.08]' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                </span>
                <span className="font-mono font-extrabold text-[9.5px] tracking-wider text-cyan-400">
                  {i18n.ui.simulationBadge}: ONLINE
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-mono text-[9.5px] font-bold text-slate-400">
                  T+{telemetryTime}
                </span>
              </div>
            </div>

            {/* Dynamic Phase Status */}
            <div className={`mb-2.5 ${isAr ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between gap-1.5 mb-0.5">
                <span className="font-bold font-mono text-[10.5px] text-cyan-300 truncate">
                  {currentSimDetail.badge[language]}
                </span>
                <span
                  className={`px-1.5 py-0.2 rounded font-mono text-[8.5px] font-bold shrink-0 ${
                    mode === 'dark'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-cyan-100 text-cyan-900 border border-cyan-300'
                  }`}
                >
                  {currentSimDetail.status[language]}
                </span>
              </div>
              <p
                className={`text-[10.5px] leading-tight ${
                  mode === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {currentSimDetail.sub[language]}
              </p>
            </div>

            {/* Signal Stream & Telemetry Waveform Bar */}
            <div
              className={`p-2.5 rounded-2xl mb-2 flex items-center justify-between gap-2.5 ${
                mode === 'dark' ? 'bg-white/[0.03] border border-white/[0.06]' : 'bg-slate-50 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-mono text-[8.5px] uppercase font-bold text-slate-400">
                  STREAM: 99.8% FIDELITY
                </span>
              </div>
              <div className="flex items-end gap-1 h-3">
                <span className="w-0.5 bg-cyan-400 rounded-xs animate-pulse h-1.5" />
                <span className="w-0.5 bg-cyan-400 rounded-xs animate-pulse h-3 delay-75" />
                <span className="w-0.5 bg-cyan-400 rounded-xs animate-pulse h-1 delay-150" />
                <span className="w-0.5 bg-cyan-400 rounded-xs animate-pulse h-2.5 delay-100" />
              </div>
            </div>

            {/* Operational Clarification Notice */}
            <div
              className={`pt-2 border-t ${
                mode === 'dark' ? 'border-white/[0.06]' : 'border-slate-200'
              }`}
            >
              <div className={`flex items-start gap-1.5 ${isAr ? 'text-right flex-row-reverse' : 'text-left'}`}>
                <Activity className="w-3 h-3 shrink-0 mt-0.5 text-cyan-400" />
                <p
                  className={`text-[9px] leading-relaxed ${
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
