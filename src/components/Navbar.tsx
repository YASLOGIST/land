'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/hooks/use-language'

export default function Navbar() {
  const { resolvedTheme } = useTheme()
  const { language, direction, setLanguage } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRTL = direction === 'rtl'

  const t = (en: string, ar: string) => ({ en, ar })

  const subtitle = t(
    'THE NEXT-GEN SUPPLY CHAIN INTELLIGENCE PLATFORM',
    'منصة ذكاء سلسلة التوريد للجيل القادم'
  )

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
      }`}
      dir={direction}
    >
      <div 
        className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between"
        style={{
          borderColor: '#000000',
          borderWidth: '0px',
          borderRadius: '0px',
          color: '#000000',
          fontFamily: 'Plus Jakarta Sans'
        }}
      >
        
        {/* Logo & Platform Tagline (Matched to Reference) */}
        <a 
          href="#" 
          className={`group flex items-center gap-3 transition-transform duration-200 ${
            isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
          }`}
        >
          {/* Circular Badge with Digital Compass Vector */}
          <div 
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-1 bg-gradient-to-tr from-cyan-600/40 via-blue-600/30 to-slate-900 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.55)] flex items-center justify-center shrink-0"
            style={{ borderColor: '#c4df12' }}
          >
            <img
              src="/assets/yaslogist-logo-mark.png"
              alt="YASLOGIST"
              className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]"
            />
          </div>

          <div className="flex flex-col justify-center">
            {/* Top Brand Name + CORE Badge */}
            <div className="flex items-center gap-2">
              <span 
                className={`brand-logo-font text-lg sm:text-xl font-black tracking-tight leading-none ${
                  mode === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
                style={{
                  fontFamily: 'Plus Jakarta Sans',
                  fontSize: '18px',
                  width: '201px'
                }}
              >
                YASLOGIST
              </span>
              <span 
                className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase border border-cyan-400/60 bg-cyan-500/15 text-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.3)]"
                style={{
                  fontSize: '0px',
                  lineHeight: '0px',
                  width: '0px',
                  height: '0px',
                  paddingTop: '0px',
                  paddingLeft: '0px',
                  paddingRight: '0px',
                  paddingBottom: '0px',
                  borderRadius: '0px',
                  borderWidth: '0px'
                }}
              >
                CORE
              </span>
            </div>

            {/* Subtitle Tagline */}
            <span className={`transition-colors mt-0.5 ${
              isRTL ? 'text-[9.5px] tracking-normal font-normal' : 'text-[7.5px] sm:text-[8.5px] uppercase font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em]'
            } ${
              mode === 'dark' ? 'text-cyan-200/80 group-hover:text-cyan-300' : 'text-slate-600 group-hover:text-cyan-700'
            }`}>
              {subtitle[language]}
            </span>
          </div>
        </a>

        {/* Global Controls: High-Tech Language Pill & Theme */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Toggle Switch Match (Pill Design) */}
          <div
            dir="ltr"
            className="relative flex items-center p-1 rounded-full bg-[#051336]/90 border border-cyan-500/35 backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.2)]"
            style={{ borderColor: '#bed406', borderWidth: '0px' }}
          >
            {/* EN Button */}
            <button
              onClick={() => setLanguage('en')}
              className={`relative z-10 px-3.5 py-1 rounded-full text-xs font-bold leading-none select-none transition-colors duration-200 ${
                language === 'en'
                  ? 'text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
              style={{
                borderColor: '#3b3a1e',
                color: '#fefefe',
                borderRadius: '10002px'
              }}
              aria-label="Switch to English"
            >
              {language === 'en' && (
                <motion.div
                  layoutId="navbar-active-lang"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_14px_rgba(6,182,212,0.85)] z-[-1]"
                  style={{ borderColor: '#f5dc00' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              EN
            </button>

            {/* AR Button */}
            <button
              onClick={() => setLanguage('ar')}
              className={`relative z-10 px-3.5 py-1 rounded-full font-bold leading-none select-none transition-colors duration-200 ar-lang-button ${
                language === 'ar'
                  ? 'text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
              style={{ fontFamily: 'Aref Ruqaa', fontSize: '16px' }}
              aria-label="التبديل إلى العربية"
            >
              {language === 'ar' && (
                <motion.div
                  layoutId="navbar-active-lang"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_14px_rgba(6,182,212,0.85)] z-[-1]"
                  style={{ fontFamily: 'Aref Ruqaa' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              عربي
            </button>
          </div>
          
          {/* Theme Toggle */}
          <ThemeToggle 
            className={`!h-8 !w-8 rounded-full transition-all duration-300 [&>svg]:!w-4 [&>svg]:!h-4 ${
              mode === 'dark'
                ? 'bg-white/[0.04] text-cyan-300 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50 shadow-sm'
            }`}
          />
        </div>
      </div>
    </motion.header>
  )
}

