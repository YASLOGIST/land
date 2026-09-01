'use client'

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'

export default function Footer() {
  const { resolvedTheme } = useTheme()
  const { language, direction } = useLanguage()

  const mode = resolvedTheme === 'light' ? 'light' : 'dark'
  const isRtl = direction === 'rtl'

  const t = (en: string, ar: string) => ({ en, ar })

  const content = {
    tagline: t(
      'Next-generation land freight intelligence and autonomous smart warehousing supply chain command.',
      'منصة ذكاء الشحن البري والمستودعات الذكية من الجيل القادم وقيادة مستقلة لسلاسل التوريد.',
    ),
    platformTitle: t('Platform Infrastructure', 'بنية المنصة'),
    platformLinks: [
      { label: t('Autonomous Land Operations', 'العمليات البرية المستقلة'), href: '#land-logistics' },
      { label: t('Platform Capabilities', 'قدرات المنصة والذكاء الاصطناعي'), href: '#capabilities' },
      { label: t('Corridor Dispatch Matrix', 'مصفوفة إرسال وتوجيه الممرات'), href: '#dispatch-optimizer' },
      { label: t('AI Disruption Command', 'مركز معالجة الاختناقات بالذكاء الاصطناعي'), href: '#disruption-command' },
      { label: t('System Telemetry & Stats', 'القياس عن بعد والأداء'), href: '#telemetry' },
    ],
    companyTitle: t('Intelligence & Network', 'الشبكة والمنظومة'),
    companyLinks: [
      { label: t('Global Command Hub', 'مركز القيادة والتحكم'), href: '#infrastructure' },
      { label: t('Zero-Trust Compliance', 'أمان الامتثال الرقمي'), href: '#capabilities' },
      { label: t('IoT Sensor Architecture', 'بنية مستشعرات الأسطول'), href: '#capabilities' },
      { label: t('Enterprise Contact', 'التواصل المؤسسي'), href: '#' },
    ],
    newsletterTitle: t('Fleet Bulletins', 'النشرة الإخبارية للأسطول'),
    newsletterDesc: t('Subscribe to receive real-time autonomous routing bulletins and dispatch network health digests.', 'اشترك لتلقي تقارير التوجيه الذاتي الفوري ونشرات صحة شبكة الإرسال.'),
    newsletterPlaceholder: t('Enter enterprise email', 'أدخل البريد الإلكتروني للمؤسسة'),
    newsletterBtn: t('Subscribe', 'اشترك الآن'),
    copyright: t('© 2026 YASLOGIST Inc. All rights reserved.', '© 2026 ياسلوجيست. جميع الحقوق محفوظة.'),
    footerRight: t('Autonomous Land Freight & Smart Warehousing Intelligence.', 'الذكاء المستقل للشحن البري والمستودعات الذكية.'),
    invalidEmailErr: t('Please enter a valid email address.', 'يرجى إدخال عنوان بريد إلكتروني صحيح.'),
    successText: t('Subscription activated. Welcome onboard!', 'تم تفعيل الاشتراك بنجاح. مرحباً بك معنا!'),
    requiredEmailErr: t('Email address is required.', 'عنوان البريد الإلكتروني مطلوب.')
  }

  // Newsletter Validation States
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      setStatus('error')
      setErrorMessage(content.requiredEmailErr[language])
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      setStatus('error')
      setErrorMessage(content.invalidEmailErr[language])
      return
    }

    setStatus('loading')

    // Simulate API registration delay
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 1200)
  }

  return (
    <footer
      id="footer"
      className={`py-20 px-6 sm:px-10 lg:px-16 transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950 border-t border-white/[0.08]'
          : 'bg-slate-100 border-t border-slate-300'
      }`}
      dir={direction}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-1.5 text-2xl font-black tracking-tight">
              <span 
                className="drop-shadow-[0_0_12px_rgba(211,238,34,0.4)]"
                style={{
                  color: '#D3EE22',
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                YAS
              </span>
              <span 
                className={mode === 'dark' ? 'text-white' : 'text-slate-900'}
                style={{
                  fontFamily: 'Plus Jakarta Sans, sans-serif'
                }}
              >
                LOGIST
              </span>
            </div>
            <p className={`text-sm leading-relaxed max-w-sm ${
              mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {content.tagline[language]}
            </p>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-4">
            <h3 
              className={`font-black text-xs uppercase tracking-widest ${isRtl ? 'tracking-normal' : ''}`}
              style={{ color: mode === 'dark' ? '#9eb7e0' : '#475569' }}
            >
              {content.platformTitle[language]}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.platformLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 ${
                      mode === 'dark'
                        ? 'text-slate-400 hover:text-cyan-400'
                        : 'text-slate-600 hover:text-cyan-600'
                    }`}
                  >
                    {link.label[language]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Network & Intelligence Links */}
          <div className="flex flex-col gap-4">
            <h3 
              className={`font-black text-xs uppercase tracking-widest ${isRtl ? 'tracking-normal' : ''}`}
              style={{ color: mode === 'dark' ? '#8db7f5' : '#475569' }}
            >
              {content.companyTitle[language]}
            </h3>
            <ul className="flex flex-col gap-3">
              {content.companyLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors duration-200 ${
                      mode === 'dark'
                        ? 'text-slate-400 hover:text-cyan-400'
                        : 'text-slate-600 hover:text-cyan-600'
                    }`}
                  >
                    {link.label[language]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Comprehensive Newsletter Signup with Validation States */}
          <div className="flex flex-col gap-4">
            <h3 
              className={`font-black text-xs uppercase tracking-widest ${isRtl ? 'tracking-normal' : ''}`}
              style={{ color: mode === 'dark' ? '#22d3ee' : '#0891b2' }}
            >
              {content.newsletterTitle[language]}
            </h3>
            <p className={`text-xs leading-relaxed ${
              mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {content.newsletterDesc[language]}
            </p>

            {/* Newsletter Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2.5 mt-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (status === 'error') setStatus('idle')
                  }}
                  disabled={status === 'loading' || status === 'success'}
                  placeholder={content.newsletterPlaceholder[language]}
                  className={`w-full py-2.5 px-3.5 pr-10 text-xs rounded-xl transition-all duration-300 outline-none font-sans border ${
                    mode === 'dark'
                      ? 'bg-slate-900/50 text-white placeholder-slate-500 border-white/10 focus:border-cyan-500/50'
                      : 'bg-white text-slate-900 placeholder-slate-400 border-slate-200 focus:border-cyan-500/50'
                  } ${status === 'error' ? 'border-red-500/70 focus:border-red-500/80 bg-red-500/[0.02]' : ''} ${
                    status === 'success' ? 'border-emerald-500/70 bg-emerald-500/[0.02]' : ''
                  }`}
                  style={{ paddingRight: isRtl ? '10px' : '36px', paddingLeft: isRtl ? '36px' : '10px' }}
                />
                
                {/* Right Input Icon matching LTR / RTL orientation */}
                <div className={`absolute pointer-events-none ${isRtl ? 'left-3' : 'right-3'}`}>
                  {status === 'loading' ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : status === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Mail className={`w-4 h-4 ${status === 'error' ? 'text-red-400' : 'text-slate-400'}`} />
                  )}
                </div>
              </div>

              {/* Action Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`py-2.5 px-4 rounded-xl font-bold text-xs transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 ${
                  status === 'success'
                    ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-500 cursor-default'
                    : 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] hover:brightness-105'
                } disabled:opacity-80`}
              >
                {status === 'loading' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : null}
                <span>{content.newsletterBtn[language]}</span>
              </button>

              {/* Sub-form Validation Feedback Triggers */}
              <div className="min-h-[16px] mt-1 relative overflow-hidden">
                {status === 'error' && (
                  <div className="flex items-center gap-1.5 text-red-400 text-[11px] animate-slide-in">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {status === 'success' && (
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] animate-slide-in">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{content.successText[language]}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 flex flex-col md:flex-row justify-between items-center gap-4 ${
            mode === 'dark' ? 'border-t border-white/[0.06]' : 'border-t border-slate-300'
          }`}
        >
          <p className="text-xs font-mono text-slate-500">
            {content.copyright[language]}
          </p>
          <p className="text-xs text-slate-500">
            {content.footerRight[language]}
          </p>
        </div>
      </div>
    </footer>
  )
}
