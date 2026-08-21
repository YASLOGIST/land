'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'

const t = (en: string, ar: string) => ({ en, ar })

const content = {
  kicker: t(
    'THE NEXT-GEN SUPPLY CHAIN INTELLIGENCE PLATFORM',
    'منصة ذكاء سلسلة التوريد من الجيل القادم',
  ),
  title: t('YASLOGIST', 'YASLOGIST'),
  subtitle: t('AIR · LAND · OCEANS', 'جو · بر · بحر'),
  description: t(
    'Redefining global logistics through AI-powered intelligence, real-time telemetry monitoring, and autonomous operations across air, land, and ocean networks.',
    'إعادة ابتكار الخدمات اللوجستية العالمية عبر الذكاء الاصطناعي، والمراقبة الفورية للقياس عن بعد، والعمليات المستقلة عبر الشبكات الجوية والبرية والبحرية.',
  ),
  cta: t('Explore Land Operations', 'استكشف العمليات البرية'),
}

export default function HeroSection() {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRtl = direction === 'rtl'
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  }

  return (
    <section
      className={`relative w-full min-h-screen overflow-hidden flex flex-col justify-center items-center pt-20 pb-16 ${
        mode === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
      }`}
      dir={direction}
    >
      {/* Ambient background aura */}
      <div
        className={`absolute inset-0 z-0 pointer-events-none ${
          mode === 'dark'
            ? 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.15),transparent)]'
            : 'bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(6,182,212,0.08),transparent)]'
        }`}
      />
      
      {/* Tech grid lines */}
      <div
        className="absolute inset-0 z-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-20 container mx-auto px-6 sm:px-8 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center justify-center max-w-4xl"
        >
          {/* Kicker Pill */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <span
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold backdrop-blur-xl transition-all duration-300 ${
                isRtl ? 'text-xs sm:text-sm tracking-normal' : 'text-[10px] sm:text-xs tracking-[0.2em] uppercase'
              } ${
                mode === 'light'
                  ? 'bg-white/80 border border-cyan-500/30 text-cyan-800 shadow-sm'
                  : 'bg-white/[0.03] border border-white/10 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>{content.kicker[language]}</span>
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={itemVariants}
            className="mb-4 text-6xl sm:text-8xl md:text-9xl font-black tracking-tight leading-none"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-200 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.3)]">
              {content.title[language]}
            </span>
          </motion.h1>

          {/* Subtitle with Consistent Arabic & English Rendering */}
          <motion.div variants={itemVariants} className="mb-6 sm:mb-8">
            <p
              className={`font-bold ${
                isRtl
                  ? 'text-2xl sm:text-3xl tracking-normal'
                  : 'text-xl sm:text-2xl tracking-[0.45em] uppercase'
              } ${
                mode === 'light' ? 'text-slate-700' : 'text-slate-200'
              }`}
            >
              {content.subtitle[language]}
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className={`mb-10 sm:mb-12 max-w-2xl text-base sm:text-lg leading-relaxed ${
              mode === 'light' ? 'text-slate-600' : 'text-slate-300'
            }`}
          >
            {content.description[language]}
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={itemVariants}>
            <a
              href="#land-logistics"
              className={`group relative overflow-hidden inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-base sm:text-lg font-semibold transition-all duration-300 backdrop-blur-2xl ${
                mode === 'light'
                  ? 'bg-white/80 border border-slate-300/80 text-cyan-900 hover:border-cyan-500 hover:bg-cyan-50 shadow-md hover:shadow-xl'
                  : 'bg-white/[0.03] border border-white/15 text-white hover:bg-white/[0.06] hover:border-cyan-400/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.37),inset_0_1px_1px_0_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]'
              }`}
            >
              {/* Specular Top Reflection Line */}
              <div
                className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/40 dark:via-cyan-400/40 to-transparent pointer-events-none"
                aria-hidden="true"
              />
              <span>{content.cta[language]}</span>
              <ArrowIcon
                className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
                  isRtl ? 'group-hover:-translate-x-1.5' : 'group-hover:translate-x-1.5'
                }`}
              />
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className={mode === 'light' ? 'text-slate-400' : 'text-slate-500'}
        >
          <ChevronDown className="w-6 h-6 opacity-70" />
        </motion.div>
      </motion.div>
    </section>
  )
}
