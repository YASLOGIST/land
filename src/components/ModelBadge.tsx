'use client'

/**
 * ModelBadge — marks a figure, chart or telemetry card as output from the
 * digital-twin model rather than a reading from a live operational feed.
 *
 * Place it wherever a number could be mistaken for something measured: the
 * stat tiles, the dashboard, the dispatch simulator, the capability specs.
 * Use `short` where the full label would crowd the layout, as on the
 * cross-modal handoff cards.
 *
 * This is the inline half of the disclosure. The other half is the Terms
 * text in LegalModal, which the badge is deliberately redundant with. A
 * screenshot of one card travels without the modal attached.
 */

import { AlertTriangle } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

const LABEL = {
  full: {
    en: 'Interactive Model · Digital Twin Simulation',
    ar: 'نموذج تفاعلي · محاكاة توأم رقمي',
  },
  short: { en: 'Simulated', ar: 'محاكاة' },
}

export default function ModelBadge({
  short = false,
  className = '',
}: {
  short?: boolean
  className?: string
}) {
  const { language, direction } = useLanguage()
  const text = short ? LABEL.short[language] : LABEL.full[language]

  return (
    <span
      dir={direction}
      className={`inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/[0.07] px-2.5 py-1 text-amber-200/90 ${
        direction === 'rtl'
          ? 'text-[10px] font-semibold tracking-normal'
          : 'font-mono text-[9px] font-bold uppercase tracking-[0.16em]'
      } leading-none ${className}`}
    >
      <AlertTriangle className="w-3 h-3 shrink-0" aria-hidden="true" />
      {text}
    </span>
  )
}
