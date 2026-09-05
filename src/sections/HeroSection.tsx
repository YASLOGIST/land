'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Truck,
  Warehouse,
} from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
// GSAP + ScrollTrigger are loaded lazily inside the scrub effect (below) so
// the scroll-scrubbed hero video never blocks first paint with the GSAP
// bundle. The type-only import below keeps the ref type at zero runtime cost.
import type { ScrollTrigger } from 'gsap/ScrollTrigger'

const t = (en: string, ar: string) => ({ en, ar })

const content = {
  kicker: t(
    'ROAD FREIGHT VISIBILITY · NAFEZA / ACID INTEGRATED · GATE TO GATE',
    'تتبّع الشحن البري · متكامل مع نافذة ورقم ACID · من بوابة إلى بوابة',
  ),
  title: t('YASLOGIST', 'YASLOGIST'),
  subtitle: t('ROAD FREIGHT · FTL/LTL · SMART WAREHOUSING', 'شحن بري · حمولات كاملة ومجزأة · تخزين ذكي'),
  description: t(
    'One shipment record across the Egyptian road network — booking, bill of lading, container, truck plate, gate pass and ACID resolved to a single identity, with turn times tracked on the Sokhna–Alexandria, 30th of June Axis and Regional Ring Road corridors.',
    'سجل واحد للشحنة عبر شبكة الطرق المصرية — الحجز وبوليصة الشحن والحاوية ولوحة الشاحنة وإذن البوابة ورقم ACID تُربط في هوية واحدة، مع قياس أزمنة الدوران على محاور السخنة–الإسكندرية، ومحور 30 يونيو، والطريق الدائري الإقليمي.',
  ),
  cta: t('Explore Operations', 'استكشف العمليات'),
  scrollPrompt: t('Scroll to Advance Video', 'مرّر للتحكم بالفيديو'),
  founder: {
    category: t('PLATFORM FOUNDER', 'مؤسس المنصة'),
    name: t('Ahmed Yasser Ali', 'أحمد ياسر علي'),
    role: t('Supply Chain & Logistics Specialist', 'أخصائي سلاسل الإمداد واللوجستيات'),
    subfooter: t('YASLOGIST · NEW CAIRO, CAIRO', 'ياسلوجيست · القاهرة الجديدة، القاهرة'),
  },
}

export default function HeroSection() {
  const { language, direction } = useLanguage()

  const isRtl = direction === 'rtl'
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const sectionRef = useRef<HTMLElement | null>(null)
  const pinContainerRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const timelineTextRef = useRef<HTMLSpanElement | null>(null)
  const timelineBarRef = useRef<HTMLDivElement | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const targetProgressRef = useRef<number>(0)
  const currentProgressRef = useRef<number>(0)
  const animFrameIdRef = useRef<number | null>(null)

  // ── GSAP ScrollTrigger Pinning & Scroll-Driven Video Scrubbing ──
  useEffect(() => {
    const video = videoRef.current
    const section = sectionRef.current
    const pinContainer = pinContainerRef.current
    if (!video || !section || !pinContainer) return

    let disposed = false
    let innerCleanup: (() => void) | undefined

    // Dynamic import: GSAP loads after first paint, before the first scroll.
    void (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      if (disposed) return
      gsap.registerPlugin(ScrollTrigger)

      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      video.pause()

      let isMounted = true
      const isLoopingRef = { current: false }

    // Smooth RAF loop: strictly interpolates progress and seeks video.currentTime
    const renderLoop = () => {
      if (!isMounted) return

      const targetP = targetProgressRef.current
      const curP = currentProgressRef.current
      const diff = targetP - curP

      let continueLoop = false

      // Fluid lerp for forward and reverse scrubbing
      if (Math.abs(diff) > 0.0002) {
        currentProgressRef.current += diff * 0.22 // Softer, ultra-smooth interpolation rate
        continueLoop = true
      } else {
        currentProgressRef.current = targetP
      }

      const p = Math.max(0, Math.min(1, currentProgressRef.current))
      const dur = video.duration && !isNaN(video.duration) && video.duration > 0 ? video.duration : 10.006
      const targetTime = Math.max(0, Math.min(p * dur, dur - 0.02))

      if (video.readyState >= 2 && Math.abs(video.currentTime - targetTime) > 0.015) {
        try {
          video.currentTime = targetTime
        } catch {
          // Guard for seek throttling
        }
      }

      // 60fps Timeline HUD indicators
      const pct = Math.round(p * 100)
      if (timelineTextRef.current) {
        timelineTextRef.current.textContent = `TIMELINE: ${pct}%`
      }
      if (timelineBarRef.current) {
        timelineBarRef.current.style.width = `${pct}%`
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

    // Robust GSAP ScrollTrigger with true pinning and pinSpacing
    const trigger = ScrollTrigger.create({
      trigger: section,
      pin: pinContainer,
      pinSpacing: true,
      anticipatePin: 1,
      start: 'top top',
      end: '+=3500',
      scrub: 0.5,
      onUpdate: (self) => {
        targetProgressRef.current = self.progress
        startLoop()
      },
    })
    scrollTriggerRef.current = trigger

    const onVideoReady = () => {
      setVideoLoaded(true)
      video.pause()
      ScrollTrigger.refresh()
    }

    if (video.readyState >= 2) {
      onVideoReady()
    } else {
      video.addEventListener('loadedmetadata', onVideoReady, { once: true })
      video.addEventListener('canplay', onVideoReady, { once: true })
    }

    const handleResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', handleResize, { passive: true })

    innerCleanup = () => {
      isMounted = false
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current)
      }
      window.removeEventListener('resize', handleResize)
      video.removeEventListener('loadedmetadata', onVideoReady)
      video.removeEventListener('canplay', onVideoReady)
      trigger.kill()
    }
    })() // end async scrub setup

    return () => {
      disposed = true
      innerCleanup?.()
    }
  }, [])

  const handleLoadedMetadata = () => {
    setVideoLoaded(true)
    const video = videoRef.current
    if (video) {
      video.muted = true
      video.playsInline = true
      video.preload = 'auto'
      video.pause()
      video.currentTime = 0
    }
  }

  // Interactive timeline click-to-scrub handler
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const newProgress = Math.max(0, Math.min(1, clickX / rect.width))
    targetProgressRef.current = newProgress
    
    if (scrollTriggerRef.current) {
      const trigger = scrollTriggerRef.current
      const targetScrollY = trigger.start + newProgress * (trigger.end - trigger.start)
      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      })
    }
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-slate-950 text-white"
      dir={direction}
    >
      {/* ─── PINNED VIEWPORT CONTAINER (GSAP PINNED) ─── */}
      <div
        ref={pinContainerRef}
        className="relative h-screen w-full overflow-hidden flex flex-col justify-between pt-20 pb-5 px-4 sm:px-8 lg:px-12 bg-slate-950"
      >
        
        {/* ─── SINGLE SOURCE OF TRUTH BACKGROUND LAYER (Z-0) ─── */}
        <video
          ref={videoRef}
          src="/assets/mainlandbackground.mp4"
          poster="/assets/mainlandbackground-poster.jpg"
          muted
          playsInline
          webkit-playsinline="true"
          x5-playsinline="true"
          preload="auto"
          controls={false}
          autoPlay={false}
          loop={false}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={() => setVideoLoaded(true)}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          style={{
            opacity: videoLoaded ? 1 : 0.85,
          }}
          aria-hidden="true"
        >
          <source src="/assets/mainlandbackground.mp4" type="video/mp4" />
          <source src="/videos/mainlandbackground.mp4" type="video/mp4" />
          <source src="/mainlandbackground.mp4" type="video/mp4" />
        </video>

        {/* ─── CONTRAST OVERLAY (Z-10, POINTER-EVENTS-NONE) ─── */}
        <div
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-slate-950/60"
          aria-hidden="true"
        />

        {/* ─── HERO CONTENT BLOCK ─── */}
        <div className="relative z-10 my-auto container mx-auto max-w-4xl flex flex-col items-center text-center px-2 sm:px-4">
          
          {/* Master Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-4 text-center"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.15]">
              {language === 'ar' ? (
                <>
                  الشحن الذكي.<br />
                  <span className="text-[#D3EE22] drop-shadow-[0_0_20px_rgba(211,238,34,0.35)]">آفاق بلا حدود.</span>
                </>
              ) : (
                <>
                  Intelligent Freight.<br />
                  <span className="text-[#D3EE22] drop-shadow-[0_0_20px_rgba(211,238,34,0.35)]">Boundless Terrains.</span>
                </>
              )}
            </h1>
          </motion.div>

          {/* Bi-Modal Land Logistics Subtitle Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-white/15 backdrop-blur-xl text-xs font-mono tracking-widest uppercase text-gold-300">
              <Truck className="w-3.5 h-3.5 text-[#E8B317]" />
              <span className="text-slate-200 font-bold">{content.subtitle[language]}</span>
              <Warehouse className="w-3.5 h-3.5 text-gold-400" />
            </span>
          </motion.div>

          {/* Concise High-Clarity Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="text-xs sm:text-sm md:text-base text-slate-200/95 font-medium leading-relaxed max-w-2xl mb-7 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
          >
            {content.description[language]}
          </motion.p>

          {/* Centered CTA & Live Telemetry Beacon */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.28 }}
            className="flex flex-wrap items-center justify-center gap-3.5"
          >
            <a
              href="#vision-transition"
              className="group relative overflow-hidden inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm sm:text-base font-bold transition-all duration-300 bg-gold-500 hover:bg-gold-400 text-slate-950 shadow-[0_0_25px_rgba(232,179,23,0.4)] border border-gold-400/40"
            >
              <div
                className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold-300 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <span className="text-slate-950 font-black">{content.cta[language]}</span>
              <ArrowIcon
                className={`w-4 h-4 text-slate-950 transition-transform duration-300 ${
                  isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                }`}
              />
            </a>
          </motion.div>
        </div>

        {/* ─── ELEGANT NON-COLLIDING FOUNDER PROFILE CARD (ANCHORED SAFELY) ─── */}
        <div
          dir="ltr"
          className="hidden md:block absolute bottom-14 right-4 sm:right-8 z-20 pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-auto min-w-[280px] max-w-xs p-3.5 sm:p-4 rounded-2xl border border-gold-500/20 bg-slate-950/80 backdrop-blur-2xl transition-all duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.15)] hover:border-gold-400/40"
            style={{
              width: '312.234375px',
              height: '136px',
              paddingLeft: '25px',
              paddingRight: '12px',
              paddingBottom: '28px',
              marginLeft: '7px',
              marginBottom: '13px',
              marginRight: '-16px',
              marginTop: '-2px'
            }}
          >
            {/* Specular Top Reflection Line */}
            <div
              className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-gold-400/60 to-transparent pointer-events-none"
              aria-hidden="true"
            />

            <div className="flex items-center gap-3.5">
              {/* Circular Portrait Frame with Subtle Gold Glow */}
              <div className="relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full p-[2px] bg-gradient-to-tr from-gold-400 via-amber-300 to-yellow-500 shadow-[0_0_14px_rgba(232,179,23,0.45)]">
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
              <div className="flex flex-col text-left justify-center flex-1 min-w-0">
                {/* Category Header: PLATFORM FOUNDER */}
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#D3EE22]">
                  {content.founder.category[language]}
                </span>

                {/* Name: Ahmed Yasser Ali */}
                <h3 
                  className="text-white truncate font-arabic font-normal tracking-wide"
                  style={{
                    fontFamily: 'Aref Ruqaa',
                    fontStyle: 'normal',
                    fontSize: '17px',
                    fontWeight: 'normal',
                    lineHeight: '30.75px'
                  }}
                >
                  {content.founder.name[language]}
                </h3>

                {/* Role: Supply Chain & Logistics Specialist */}
                <p className="text-[11px] font-medium text-slate-300 leading-snug mt-0.5">
                  {content.founder.role[language]}
                </p>

                {/* Sub-footer: YASLOGIST · NEW CAIRO, CAIRO */}
                <span className="text-[9px] font-mono font-bold tracking-wider uppercase text-gold-400/90 mt-1">
                  {content.founder.subfooter[language]}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── BOTTOM SCRUBBING HINT & PROGRESS HUD ─── */}
        <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ChevronDown className="w-4 h-4 text-[#E8B317] animate-bounce" />
            <span className="font-bold text-slate-300 text-[11px] sm:text-xs tracking-wider">{content.scrollPrompt[language]}</span>
          </div>

          {/* Interactive Clickable Scrub Timeline Indicator */}
          <div className="flex items-center gap-2.5">
            <span ref={timelineTextRef} className="text-[10px] sm:text-xs text-gold-400 font-bold tracking-wider">
              TIMELINE: 0%
            </span>
            <div
              onClick={handleTimelineClick}
              className="w-24 sm:w-36 h-2 rounded-full bg-slate-800/90 border border-white/15 overflow-hidden cursor-pointer hover:h-2.5 transition-all p-[1px] relative group"
              title={language === 'ar' ? 'انقر للتقديم أو الترجيع' : 'Click to scrub timeline'}
            >
              <div
                ref={timelineBarRef}
                className="h-full bg-gradient-to-r from-gold-500 via-amber-400 to-[#E8B317] rounded-full transition-all duration-75"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
