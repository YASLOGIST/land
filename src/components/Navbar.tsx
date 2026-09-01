'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/hooks/use-language'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const { resolvedTheme } = useTheme()
  const { language, direction, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRTL = direction === 'rtl'

  const t = (en: string, ar: string) => ({ en, ar })

  const subtitle = t(
    'THE NEXT-GEN SUPPLY CHAIN INTELLIGENCE PLATFORM',
    'منصة ذكاء سلسلة التوريد للجيل القادم'
  )

  const navLinks = [
    { label: t('Solutions', 'الحلول'), href: '#capabilities' },
    { label: t('Platform', 'المنصة'), href: '#dashboard-overview' },
    { label: t('Contact', 'التواصل'), href: '#footer' }
  ]

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <>
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
        <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo & Platform Tagline */}
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className={`group flex items-center gap-3 transition-transform duration-200 ${
              isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'
            }`}
          >
            {/* Circular Badge with Logo Mark */}
            <div 
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full p-1 bg-gradient-to-tr from-cyan-600/40 via-blue-600/30 to-slate-900 border border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.55)] flex items-center justify-center shrink-0"
              style={{ borderColor: '#c4df12' }}
            >
              <img
                src="/assets/yaslogist-logo-mark.png"
                alt="YASLOGIST"
                className="w-full h-full object-contain filter drop-shadow-[0_0_6px_rgba(6,182,212,0.7)]"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex flex-col justify-center">
              {/* Top Brand Name */}
              <div className="flex items-center gap-2">
                <span 
                  className={`brand-logo-font text-lg sm:text-xl font-black tracking-tight leading-none ${
                    mode === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{
                    fontFamily: 'Plus Jakarta Sans',
                    fontSize: '18px',
                    width: '120px'
                  }}
                >
                  YASLOGIST
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

          {/* Desktop Navigation Links */}
          <nav className={`hidden md:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`text-xs uppercase font-extrabold tracking-widest transition-all duration-300 relative py-1.5 group ${
                  mode === 'dark' ? 'text-slate-300 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                {link.label[language]}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Global Controls: High-Tech Language Pill & Theme */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Toggle Switch */}
            <div
              dir="ltr"
              className="relative flex items-center p-1 rounded-full bg-[#051336]/90 border border-cyan-500/35 backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_15px_rgba(6,182,212,0.2)]"
            >
              {/* EN Button */}
              <button
                onClick={() => setLanguage('en')}
                className={`relative z-10 px-3.5 py-1 rounded-full text-xs font-bold leading-none select-none transition-colors duration-200 ${
                  language === 'en'
                    ? 'text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                style={{ borderRadius: '10002px' }}
                aria-label="Switch to English"
              >
                {language === 'en' && (
                  <motion.div
                    layoutId="navbar-active-lang"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_14px_rgba(6,182,212,0.85)] z-[-1]"
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
                    ? 'text-slate-950 font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
                style={{ fontFamily: 'Aref Ruqaa', fontSize: '15px' }}
                aria-label="التبديل إلى العربية"
              >
                {language === 'ar' && (
                  <motion.div
                    layoutId="navbar-active-lang"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400 shadow-[0_0_14px_rgba(6,182,212,0.85)] z-[-1]"
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

          {/* Mobile Hamburger Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle 
              className={`!h-8 !w-8 rounded-full transition-all duration-300 [&>svg]:!w-4 [&>svg]:!h-4 ${
                mode === 'dark'
                  ? 'bg-white/[0.04] text-cyan-300 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-cyan-505/50 hover:bg-cyan-50 shadow-sm'
              }`}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border transition-all ${
                mode === 'dark'
                  ? 'border-white/10 text-white hover:bg-white/5 bg-slate-900/40'
                  : 'border-slate-200 text-slate-800 hover:bg-slate-100 bg-white'
              }`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </motion.header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`fixed top-16 left-0 right-0 z-40 md:hidden border-b flex flex-col p-6 gap-6 backdrop-blur-2xl ${
              mode === 'dark'
                ? 'bg-slate-950/95 border-white/[0.08] shadow-2xl'
                : 'bg-white/95 border-slate-200 shadow-xl'
            }`}
            dir={direction}
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm uppercase font-bold tracking-widest py-2 border-b ${
                    mode === 'dark'
                      ? 'text-slate-300 hover:text-cyan-400 border-white/[0.04]'
                      : 'text-slate-700 hover:text-cyan-600 border-slate-100'
                  }`}
                >
                  {link.label[language]}
                </a>
              ))}
            </nav>

            {/* Language Selection inside Drawer */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-500 uppercase">
                {language === 'en' ? 'Select Language' : 'اختر اللغة'}
              </span>

              <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-700/50">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    language === 'en' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ar')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    language === 'ar' ? 'bg-cyan-400 text-slate-950 font-black' : 'text-slate-400'
                  }`}
                  style={{ fontFamily: 'Aref Ruqaa' }}
                >
                  عربي
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
