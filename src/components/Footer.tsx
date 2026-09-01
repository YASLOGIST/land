'use client'

import { useTheme } from 'next-themes'
import { useLanguage } from '@/hooks/use-language'

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
      { label: t('Inland Logistics & Field Hubs', 'المراكز اللوجستية والموانئ الجافة'), href: '#infrastructure' },
    ],
    companyTitle: t('Intelligence & Network', 'الشبكة والمنظومة'),
    companyLinks: [
      { label: t('Global Command Hub', 'مركز القيادة والتحكم'), href: '#infrastructure' },
      { label: t('Zero-Trust Compliance', 'أمان الامتثال الرقمي'), href: '#capabilities' },
      { label: t('IoT Sensor Architecture', 'بنية مستشعرات الأسطول'), href: '#capabilities' },
      { label: t('Enterprise Contact', 'التواصل المؤسسي'), href: '#' },
    ],
    copyright: t('© 2026 YASLOGIST Inc. All rights reserved.', '© 2026 ياسلوجيست. جميع الحقوق محفوظة.'),
    footerRight: t('Autonomous Land Freight & Smart Warehousing Intelligence.', 'الذكاء المستقل للشحن البري والمستودعات الذكية.'),
  }

  return (
    <footer
      className={`py-20 px-6 sm:px-10 lg:px-16 transition-colors duration-500 ${
        mode === 'dark'
          ? 'bg-slate-950 border-t border-white/[0.08]'
          : 'bg-slate-100 border-t border-slate-300'
      }`}
      dir={direction}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-12 md:gap-8 justify-between mb-16">
          
          {/* Column 1: Brand & Tagline */}
          <div className="w-full md:w-1/3 flex flex-col gap-4">
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

          <div className="w-full md:w-auto flex gap-12 sm:gap-20 flex-wrap">
            {/* Column 2: Platform Links */}
            <div className="flex flex-col gap-4">
              <h3 
                className={`font-bold ${isRtl ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}
                style={{ color: '#9eb7e0' }}
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

            {/* Column 3: Network & Security Links */}
            <div className="flex flex-col gap-4">
              <h3 
                className={`font-bold ${isRtl ? 'text-xs tracking-normal' : 'text-xs uppercase tracking-widest'}`}
                style={{ color: '#8db7f5' }}
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
