'use client'

import React, { useState } from 'react'
import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'
import { Mail, CheckCircle2, AlertCircle, Loader2, Phone, MapPin } from 'lucide-react'
import LegalModal, { type LegalKey } from '@/components/LegalModal'

/* Single source of truth for the business contact details. The same line and
   inbox appear on main and ocean; a second number on a third surface reads as
   a second company. */
const PHONE_DISPLAY = '+20 104 113 9910'
const PHONE_TEL = '+201041139910'
const EMAIL = 'contact@yaslogist.me'

/* The company's verified channels, matching main/index.html's footer. Land
   previously linked to none of them. Icons are inline paths rather than an icon
   package so the set stays identical to main's, which draws its own. */
const SOCIAL = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/yaslogist',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    name: 'X',
    href: 'https://x.com/yaslogist',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    name: 'WhatsApp',
    href: 'https://wa.me/201041139910',
    path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z',
  },
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/yaslogist',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/yaslogist',
    path: 'M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z',
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@yaslogist',
    path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
] as const

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
      { label: t('Enterprise Contact', 'التواصل المؤسسي'), href: `mailto:${EMAIL}` },
    ],
    contactTitle: t('Contact', 'التواصل'),
    address: t('New Cairo, Cairo, Egypt', 'القاهرة الجديدة، القاهرة، مصر'),
    socialTitle: t('Social channels', 'قنوات التواصل'),
    legalTitle: t('Legal', 'الشؤون القانونية'),
    legalLinks: [
      { key: 'terms' as LegalKey, label: t('Terms of Service', 'الشروط والأحكام') },
      { key: 'privacy' as LegalKey, label: t('Privacy Policy', 'سياسة الخصوصية') },
      { key: 'security' as LegalKey, label: t('Security', 'الأمان') },
    ],
    newsletterTitle: t('Fleet Bulletins', 'النشرة الإخبارية للأسطول'),
    newsletterDesc: t('Subscribe to receive real-time autonomous routing bulletins and dispatch network health digests.', 'اشترك لتلقي تقارير التوجيه الذاتي الفوري ونشرات صحة شبكة الإرسال.'),
    newsletterPlaceholder: t('Enter enterprise email', 'أدخل البريد الإلكتروني للمؤسسة'),
    newsletterBtn: t('Subscribe', 'اشترك الآن'),
    copyright: t('© 2026 YASLOGIST. All rights reserved.', '© 2026 ياسلوجيست. جميع الحقوق محفوظة.'),
    footerRight: t('Autonomous Land Freight & Smart Warehousing Intelligence.', 'الذكاء المستقل للشحن البري والمستودعات الذكية.'),
    invalidEmailErr: t('Please enter a valid email address.', 'يرجى إدخال عنوان بريد إلكتروني صحيح.'),
    successText: t('Opening your mail app to confirm…', 'جارٍ فتح تطبيق البريد لتأكيد الاشتراك…'),
    requiredEmailErr: t('Email address is required.', 'عنوان البريد الإلكتروني مطلوب.')
  }

  // Newsletter Validation States
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [legal, setLegal] = useState<LegalKey | null>(null)

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

    // No subscription backend exists on this surface. Rather than fake a
    // success state with a timer — which told the visitor they were subscribed
    // when nothing had been recorded anywhere — hand the address to the user's
    // own mail client, the same fallback main/index.html uses.
    setStatus('success')
    window.location.href =
      `mailto:${EMAIL}?subject=` +
      encodeURIComponent('Subscribe — Fleet Bulletins') +
      '&body=' +
      encodeURIComponent(trimmedEmail)
    setEmail('')
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
                className="brand-logo-font drop-shadow-[0_0_12px_rgba(211,238,34,0.4)]"
                style={{ color: '#D3EE22' }}
              >
                YAS
              </span>
              <span className={`brand-logo-font ${mode === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                LOGIST
              </span>
            </div>
            <p className={`text-sm leading-relaxed max-w-sm ${
              mode === 'dark' ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {content.tagline[language]}
            </p>

            {/* Contact — the same line, inbox and address carried by main and
                ocean, so the three surfaces resolve to one company. */}
            <div className="flex flex-col gap-2 mt-2">
              <h3
                className={`font-black text-xs uppercase tracking-widest ${isRtl ? 'tracking-normal' : ''}`}
                style={{ color: mode === 'dark' ? '#9eb7e0' : '#475569' }}
              >
                {content.contactTitle[language]}
              </h3>
              <a
                href={`tel:${PHONE_TEL}`}
                className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                  mode === 'dark' ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <span dir="ltr" className="font-mono text-xs">{PHONE_DISPLAY}</span>
              </a>
              <a
                href={`mailto:${EMAIL}`}
                className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                  mode === 'dark' ? 'text-slate-400 hover:text-cyan-400' : 'text-slate-600 hover:text-cyan-600'
                }`}
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span dir="ltr" className="font-mono text-xs">{EMAIL}</span>
              </a>
              <p className={`flex items-center gap-2 text-sm ${
                mode === 'dark' ? 'text-slate-500' : 'text-slate-500'
              }`}>
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs">{content.address[language]}</span>
              </p>

              {/* Social channels — the same six accounts main links to. */}
              <nav
                className="flex flex-wrap items-center gap-2 mt-2"
                aria-label={content.socialTitle[language]}
              >
                {SOCIAL.map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className={`grid h-9 w-9 place-items-center rounded-xl border transition-all duration-200 ${
                      mode === 'dark'
                        ? 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-400/40 hover:text-cyan-400'
                        : 'border-slate-200 bg-white/70 text-slate-500 hover:border-cyan-500/40 hover:text-cyan-600'
                    }`}
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true" focusable="false">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </nav>
            </div>
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
                  disabled={status === 'loading'}
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
                disabled={status === 'loading'}
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

          {/* Legal — buttons rather than anchors: the documents open in place,
              matching ocean's footer modals. There is no separate page to link. */}
          <nav
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            aria-label={content.legalTitle[language]}
          >
            {content.legalLinks.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setLegal(item.key)}
                className={`text-xs transition-colors duration-200 cursor-pointer ${
                  mode === 'dark' ? 'text-slate-500 hover:text-cyan-400' : 'text-slate-500 hover:text-cyan-600'
                }`}
              >
                {item.label[language]}
              </button>
            ))}
          </nav>

          <p className="text-xs text-slate-500">
            {content.footerRight[language]}
          </p>
        </div>
      </div>

      <LegalModal open={legal !== null} section={legal} onClose={() => setLegal(null)} />
    </footer>
  )
}
