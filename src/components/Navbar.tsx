'use client'

import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { Sun, Moon, Sparkles } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

export default function Navbar() {
  const { resolvedTheme, setTheme } = useTheme()
  const { language, direction, toggleLanguage } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRTL = direction === 'rtl'

  const t = (en: string, ar: string) => ({ en, ar })

  const subtitle = t(
    'THE NEXT-GEN SUPPLY CHAIN INTELLIGENCE PLATFORM',
    'منصة ذكاء سلسلة التوريد للجيل القادم'
  )

  const langLabel = language === 'en' ? 'العربية' : 'English'

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${
        mode === 'dark'
          ? 'bg-slate-950/75 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white/85 backdrop-blur-xl border-b border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.05)]'
      }`}
      dir={direction}
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Logo & Platform Tagline */}
        <a 
          href="#" 
          className={`group flex flex-col justify-center transition-transform duration-200 ${
            isRTL ? 'text-right items-start' : 'text-left items-start'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              YAS
            </span>
            <span className={mode === 'dark' ? 'text-white' : 'text-slate-900'}>
              LOGIST
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.9)]" />
          </div>
          <span className={`transition-colors mt-0.5 ${
            isRTL ? 'text-[10px] tracking-normal font-normal' : 'text-[8px] sm:text-[9px] uppercase font-medium tracking-[0.25em]'
          } ${
            mode === 'dark' ? 'text-slate-400 group-hover:text-cyan-300' : 'text-slate-500 group-hover:text-cyan-700'
          }`}>
            {subtitle[language]}
          </span>
        </a>

        {/* Global Controls: Language & Theme */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className={`h-8 px-3.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 flex items-center gap-1.5 ${
              mode === 'dark'
                ? 'bg-white/[0.04] text-cyan-300 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                : 'bg-white text-cyan-800 border border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50 shadow-sm'
            }`}
            aria-label="Toggle language"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>{langLabel}</span>
          </button>
          
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(mode === 'dark' ? 'light' : 'dark')}
            className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              mode === 'dark'
                ? 'bg-white/[0.04] text-cyan-300 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-500/50 hover:bg-cyan-50 shadow-sm'
            }`}
            aria-label="Toggle Theme"
          >
            {mode === 'dark' ? (
              <Sun className="w-4 h-4 text-cyan-300 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </motion.header>
  )
}
