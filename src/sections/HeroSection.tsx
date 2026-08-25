'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Radio,
  ShieldCheck,
  Cpu,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'

const t = (en: string, ar: string) => ({ en, ar })

const content = {
  kicker: t(
    'SOVEREIGN 6G AUTONOMOUS SUPPLY CHAIN INFRASTRUCTURE',
    'البنية التحتية السيادية لسلاسل الإمداد المستقلة 6G',
  ),
  title: t('YASLOGIST', 'YASLOGIST'),
  subtitle: t('AIR · LAND · OCEANS', 'جو · بر · بحر'),
  description: t(
    'Redefining global multimodal logistics through AI telemetry orchestration, predictive routing, and autonomous infrastructure across air corridors, deepwater fairways, and land grids.',
    'إعادة ابتكار اللوجستيات متعددة الوسائط عبر تنسيق القياس الآني بالذكاء الاصطناعي، والتوجيه التنبؤي، والبنية التحتية المستقلة عبر الممرات الجوية والبحرية والبرية.',
  ),
  cta: t('Explore Operations', 'استكشف العمليات'),
  scrollPrompt: t('Scroll to Advance Video', 'مرّر للتحكم بالفيديو'),
  founder: {
    category: t('PLATFORM FOUNDER', 'مؤسس المنصة'),
    name: t('Ahmed Yasser Ali', 'أحمد ياسر علي'),
    role: t('Supply Chain & Logistics Specialist', 'أخصائي سلاسل الإمداد واللوجستيات'),
    subfooter: t('YASLOGIST · DOKKI, CAIRO', 'ياسلوجيست · الدقي، القاهرة'),
  },
}

export default function HeroSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRtl = direction === 'rtl'
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const targetTimeRef = useRef<number>(0)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  /* ── 1. Responsive Viewport & Device Detection ── */
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        (window.innerWidth < 1024 && ('ontouchstart' in window || navigator.maxTouchPoints > 0))
      setIsMobile(mobile)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  /* ── 2. Direct DOM Mount & Forced Video Trigger (Autoplay Failsafe) ── */
  const handleTouchStart = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      video.play().catch((err) => console.log('Autoplay deferred:', err))
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      if (video.readyState >= 1) {
        setVideoLoaded(true)
      }
      if (isMobile) {
        video.play().catch((err) => console.log('Autoplay deferred:', err))
      }
    }
  }, [isMobile])

  useEffect(() => {
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    return () => window.removeEventListener('touchstart', handleTouchStart)
  }, [handleTouchStart])

  /* ── 3. Desktop Scroll Scrubbing & Progress Calculation ── */
  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return

    const rect = sectionRef.current.getBoundingClientRect()
    const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight

    if (totalScrollable <= 0) return

    const scrolled = Math.max(0, -rect.top)
    const rawProgress = Math.min(1, Math.max(0, scrolled / totalScrollable))
    setScrollProgress(rawProgress)

    // Only sync video currentTime on Desktop viewports
    if (!isMobile && videoRef.current) {
      const video = videoRef.current
      if (video.duration && !isNaN(video.duration)) {
        targetTimeRef.current = rawProgress * video.duration
      }
    }
  }, [isMobile])

  // Smooth lerp frame loop for desktop 60fps video scrubbing
  useEffect(() => {
    let isRunning = true

    const updateVideoTime = () => {
      if (!isMobile && videoRef.current && videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        const video = videoRef.current
        const diff = targetTimeRef.current - video.currentTime

        // Fast responsive dampening
        if (Math.abs(diff) > 0.005) {
          video.currentTime += diff * 0.35
        }
      }

      if (isRunning) {
        animFrameRef.current = requestAnimationFrame(updateVideoTime)
      }
    }

    animFrameRef.current = requestAnimationFrame(updateVideoTime)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    window.addEventListener('touchmove', handleScroll, { passive: true })
    handleScroll()

    return () => {
      isRunning = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      window.removeEventListener('touchmove', handleScroll)
    }
  }, [handleScroll, isMobile])

  const handleLoadedMetadata = () => {
    setVideoLoaded(true)
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.playsInline = true
      video.autoplay = true
      if (isMobile) {
        video.play().catch((err) => console.log('Autoplay deferred:', err))
      } else {
        video.pause()
        video.currentTime = 0
      }
    }
    handleScroll()
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-transparent text-white"
      style={{ height: '140vh' }}
      dir={direction}
      onTouchStart={handleTouchStart}
    >
      {/* ─── STICKY VIEWPORT CONTAINER ─── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between pt-20 pb-6 px-4 sm:px-8 lg:px-12 bg-transparent">
        
        {/* ─── BACKGROUND VIDEO (DESKTOP SCRUB / MOBILE AUTOPLAY LOOP) ─── */}
        <video
          ref={videoRef}
          src="/videos/mainlandbackground.mp4"
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          controls={false}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{
            transform: 'translateZ(0)',
            willChange: 'transform',
            opacity: videoLoaded ? 1 : 0.85,
          }}
          aria-hidden="true"
        >
          <source src="/videos/mainlandbackground.mp4" type="video/mp4" />
          <source src="/assets/mainlandbackground.mp4" type="video/mp4" />
          <source src="/mainlandbackground.mp4" type="video/mp4" />
        </video>

        {/* ─── CLEAN TRANSLUCENT OVERLAY TINT (NO SOLID OBSCURING LAYERS) ─── */}
        <div
          className="absolute inset-0 z-0 pointer-events-none bg-black/20"
          aria-hidden="true"
        />

        {/* ─── ELITE CINEMATIC CENTERED YASLOGIST BRANDING & HERO BLOCK ─── */}
        <div className="relative z-10 my-auto container mx-auto max-w-4xl flex flex-col items-center text-center px-4">
          
          {/* Sovereign Kicker Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-mono font-bold tracking-[0.2em] uppercase backdrop-blur-3xl bg-cyan-500/15 border border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>{content.kicker[language]}</span>
            </span>
          </motion.div>

          {/* Master YASLOGIST Title with Sovereign Specular Lighting */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-3 flex items-center justify-center gap-2 sm:gap-3"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none select-none">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(6,182,212,0.5)]">
                YAS
              </span>
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(59,130,246,0.4)]">
                LOGIST
              </span>
              <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_rgba(6,182,212,1)] ml-1 align-baseline" />
            </h1>
          </motion.div>

          {/* Multimodal Subtitle Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-3 px-5 py-1.5 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-xl text-xs sm:text-sm md:text-base font-black tracking-[0.4em] uppercase text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{content.subtitle[language]}</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            </span>
          </motion.div>

          {/* Concise High-Clarity Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-xs sm:text-sm md:text-base text-slate-200/90 font-normal leading-relaxed max-w-2xl mb-7 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
          >
            {content.description[language]}
          </motion.p>

          {/* Centered CTA & Live 6G Telemetry Beacon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            <a
              href="#vision-transition"
              className="group relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 bg-cyan-500/25 border border-cyan-400/60 text-white hover:bg-cyan-500/40 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] backdrop-blur-2xl"
            >
              <div
                className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <span>{content.cta[language]}</span>
              <ArrowIcon
                className={`w-4 h-4 text-cyan-400 transition-transform duration-300 ${
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
              />
            </a>

            {/* Satellite Mesh Beacon */}
            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-black/60 border border-white/20 text-[11px] font-mono text-slate-300 backdrop-blur-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold">6G MESH ONLINE</span>
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 ml-1" />
            </div>
          </motion.div>
        </div>

        {/* ─── STRICTLY ANCHORED BOTTOM-RIGHT FOUNDER PROFILE CARD (NEVER FLIPS SIDES) ─── */}
        <div
          dir="ltr"
          className="hidden md:block absolute bottom-14 sm:bottom-16 right-4 sm:right-8 z-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`w-auto min-w-[300px] sm:min-w-[340px] max-w-sm rounded-2xl sm:rounded-3xl p-4 sm:p-5 border backdrop-blur-3xl transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1.5px_rgba(255,255,255,0.2)] ${
              mode === 'dark'
                ? 'border-cyan-500/35 bg-[#050D24]/90 hover:border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.25)]'
                : 'border-cyan-500/30 bg-[#071330]/95 hover:border-cyan-400/50 shadow-[0_0_25px_rgba(6,182,212,0.15)]'
            }`}
          >
            {/* Specular Top Reflection Line */}
            <div
              className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex items-center gap-4">
              {/* Circular Portrait Frame with Subtle Cyan Glow */}
              <div className="relative shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full p-[2px] bg-gradient-to-tr from-cyan-400 via-sky-300 to-blue-500 shadow-[0_0_16px_rgba(6,182,212,0.55)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                  <img
                    src="/assets/founder-original.png"
                    alt={content.founder.name[language]}
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </div>
              </div>

              {/* Founder Information Structure */}
              <div className="flex flex-col text-left">
                {/* Category Header: PLATFORM FOUNDER (Cyan luminous styling) */}
                <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-[0.2em] uppercase text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                  {content.founder.category[language]}
                </span>

                {/* Name: Ahmed Yasser Ali (Bold, clean executive typography) */}
                <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-tight mt-0.5">
                  {content.founder.name[language]}
                </h3>

                {/* Role: Supply Chain & Logistics Specialist */}
                <p className="text-[11.5px] sm:text-xs font-medium text-slate-300 leading-snug mt-0.5">
                  {content.founder.role[language]}
                </p>

                {/* Sub-footer: YASLOGIST · DOKKI, CAIRO */}
                <span className="text-[9.5px] sm:text-[10px] font-mono font-bold tracking-[0.16em] uppercase text-cyan-400/90 mt-1">
                  {content.founder.subfooter[language]}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── BOTTOM SCRUBBING HINT & PROGRESS HUD ─── */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span className="font-bold text-slate-300">{content.scrollPrompt[language]}</span>
          </div>

          {/* Scrub Timeline Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cyan-400 font-bold">
              TIMELINE: {Math.round(scrollProgress * 100)}%
            </span>
            <div className="w-24 sm:w-32 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}



