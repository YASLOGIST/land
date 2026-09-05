'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useLanguage } from '@/hooks/use-language'
import { Menu, X } from 'lucide-react'
import SuiteSwitcher from '@/components/SuiteSwitcher'
import { SUPPORTED_LANGUAGES } from '@/lib/i18n'

export default function Navbar() {
  const { resolvedTheme } = useTheme()
  const { language, direction, setLanguage } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRTL = direction === 'rtl'

  const subtitle = {
    en: 'THE NEXT-GEN SUPPLY CHAIN INTELLIGENCE PLATFORM',
    ar: 'منصة ذكاء سلسلة التوريد للجيل القادم',
    zh: '下一代国际供应链智能物流平台',
    tr: 'YENİ NESİL TEDARİK ZİNCİRİ İSTİHBARAT PLATFORMU',
    fr: "PLATEFORME D'INTELLIGENCE LOGISTIQUE NOUVELLE GÉNÉRATION",
  }

  const navLinks = [
    {
      label: {
        en: 'Solutions',
        ar: 'الحلول',
        zh: '解决方案',
        tr: 'Çözümler',
        fr: 'Solutions',
      },
      href: '#capabilities',
    },
    {
      label: {
        en: 'Platform',
        ar: 'المنصة',
        zh: '监控大屏',
        tr: 'Platform',
        fr: 'Plateforme',
      },
      href: '#dashboard-overview',
    },
    {
      label: {
        en: 'Corridors',
        ar: 'الممرات',
        zh: '国际走廊',
        tr: 'Koridorlar',
        fr: 'Corridors',
      },
      href: '#corridor-dispatch',
    },
    {
      label: {
        en: 'Disruption',
        ar: 'الأزمات',
        zh: '应急调度',
        tr: 'Kriz Yönetimi',
        fr: 'Urgences',
      },
      href: '#disruption-command',
    },
    {
      label: {
        en: 'Contact',
        ar: 'التواصل',
        zh: '联系我们',
        tr: 'İletişim',
        fr: 'Contact',
      },
      href: '#footer',
    },
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
            {/* Canonical YASLOGIST monogram — the same vector mark as
                main/media/logo.svg and ocean's BrandMark. This replaced a
                192×192 raster PNG in a badge whose border was hardcoded to
                #c4df12, a colour that appears nowhere else in the brand and on
                neither of the other two surfaces. Drawn with currentColor so it
                inherits the header's theme instead of fighting it. */}
            <svg
              viewBox="0 0 64 64"
              className={`w-9 h-9 sm:w-10 sm:h-10 shrink-0 ${
                mode === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
              fill="none"
              stroke="currentColor"
              strokeLinecap="butt"
              strokeLinejoin="miter"
              role="img"
              aria-label="YASLOGIST"
            >
              <g strokeWidth="1.6" opacity="0.55">
                <ellipse cx="32" cy="32" rx="12.5" ry="29" />
                <path d="M3 32h58M8 17.5h48M8 46.5h48" />
              </g>
              <circle cx="32" cy="32" r="29" strokeWidth="2.2" />
              <g strokeWidth="5" strokeLinecap="square">
                <path d="M16 16 L27.5 31.5 L27.5 49" />
                <path d="M39 16 L30 28" />
                <path d="M40.5 20 L40.5 48 L53 48" />
              </g>
            </svg>

            <div className="flex flex-col justify-center">
              {/* Top Brand Name */}
              <div className="flex items-center gap-2">
                <span 
                  className={`brand-logo-font text-lg sm:text-xl font-black tracking-tight leading-none ${
                    mode === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                  style={{
                    fontSize: '18px',
                  }}
                >
                  YASLOGIST
                </span>
              </div>

              {/* Subtitle Tagline */}
              <span className={`transition-colors mt-0.5 ${
                isRTL ? 'text-[9.5px] tracking-normal font-normal' : 'text-[7.5px] sm:text-[8.5px] uppercase font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em]'
              } ${
                mode === 'dark' ? 'text-gold-200/80 group-hover:text-gold-300' : 'text-slate-600 group-hover:text-gold-700'
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
                  mode === 'dark' ? 'text-slate-300 hover:text-gold-400' : 'text-slate-600 hover:text-gold-600'
                }`}
              >
                {link.label[language]}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold-400 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Global Controls: Suite Switcher, High-Tech Language Pill & Theme */}
          <div className="hidden md:flex items-center gap-3">
            {/* `lg` and up: at `md` this row already carries the wordmark, a
                two-line tagline, three nav links, the language pill and the
                theme toggle, so the switcher waits for the wider breakpoint.
                Phones get the grid in the drawer below. */}
            <SuiteSwitcher current="land" className="hidden lg:flex" />

            {/* Multi-Language Switcher (EN, AR, ZH, TR, FR) */}
            <div
              dir="ltr"
              className="relative flex items-center p-0.5 rounded-full bg-[#051336]/90 border border-gold-500/35 backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.5),0_0_15px_rgba(232,179,23,0.2)]"
            >
              {SUPPORTED_LANGUAGES.map((item) => {
                const isSelected = language === item.code
                return (
                  <button
                    key={item.code}
                    onClick={() => setLanguage(item.code)}
                    className={`relative z-10 px-2.5 py-1 rounded-full text-[11px] font-bold leading-none select-none transition-colors duration-200 ${
                      isSelected
                        ? 'text-slate-950 font-black'
                        : 'text-slate-300 hover:text-white'
                    }`}
                    style={item.code === 'ar' ? { fontFamily: 'Aref Ruqaa', fontSize: '13.5px' } : undefined}
                    aria-label={`Switch language to ${item.nativeName}`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="navbar-active-lang"
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-gold-400 to-amber-500 shadow-[0_0_14px_rgba(232,179,23,0.85)] z-[-1]"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    {item.label}
                  </button>
                )
              })}
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle 
              className={`!h-8 !w-8 rounded-full transition-all duration-300 [&>svg]:!w-4 [&>svg]:!h-4 ${
                mode === 'dark'
                  ? 'bg-white/[0.04] text-gold-300 border border-white/10 hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-gold-500/50 hover:bg-gold-50 shadow-sm'
              }`}
            />
          </div>

          {/* Mobile Hamburger Trigger */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle 
              className={`!h-8 !w-8 rounded-full transition-all duration-300 [&>svg]:!w-4 [&>svg]:!h-4 ${
                mode === 'dark'
                  ? 'bg-white/[0.04] text-gold-300 border border-white/10 hover:border-gold-400/50 hover:bg-gold-500/10 hover:text-white shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-gold-500/50 hover:bg-gold-50 shadow-sm'
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
            className={`fixed top-16 left-0 right-0 z-40 md:hidden border-b flex flex-col p-5 sm:p-6 gap-5 sm:gap-6 backdrop-blur-2xl max-h-[calc(100vh-4rem)] overflow-y-auto overscroll-contain ${
              mode === 'dark'
                ? 'bg-slate-950/95 border-white/[0.08] shadow-2xl'
                : 'bg-white/95 border-slate-200 shadow-xl'
            }`}
            dir={direction}
          >
            {/* Suite grid first: a visitor who opened this menu to leave for
                another surface should not have to read past the section links
                to find the way out. */}
            <SuiteSwitcher
              current="land"
              variant="grid"
              onNavigate={() => setMobileMenuOpen(false)}
              className={`pb-5 border-b ${mode === 'dark' ? 'border-white/[0.06]' : 'border-slate-200'}`}
            />

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`text-sm uppercase font-bold tracking-widest py-2 border-b ${
                    mode === 'dark'
                      ? 'text-slate-300 hover:text-gold-400 border-white/[0.04]'
                      : 'text-slate-700 hover:text-gold-600 border-slate-100'
                  }`}
                >
                  {link.label[language]}
                </a>
              ))}
            </nav>

            {/* Language Selection inside Drawer */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                {language === 'ar'
                  ? 'اختر لغة المنصة'
                  : language === 'zh'
                  ? '选择平台语言'
                  : language === 'tr'
                  ? 'Platform Dilini Seçin'
                  : language === 'fr'
                  ? 'Choisir la Langue'
                  : 'Select Platform Language'}
              </span>

              <div className="grid grid-cols-5 p-1 rounded-2xl bg-slate-900 border border-slate-700/50 gap-1">
                {SUPPORTED_LANGUAGES.map((item) => {
                  const isSelected = language === item.code
                  return (
                    <button
                      key={item.code}
                      onClick={() => setLanguage(item.code)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                        isSelected ? 'bg-gold-500 text-slate-950 font-black shadow-md' : 'text-slate-400 hover:text-white'
                      }`}
                      style={item.code === 'ar' ? { fontFamily: 'Aref Ruqaa' } : undefined}
                    >
                      <span className="text-[11px] leading-tight font-black">{item.label}</span>
                      <span className="text-[8.5px] opacity-75 font-normal truncate max-w-full">{item.nativeName}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
