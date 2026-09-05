import type { LucideIcon } from 'lucide-react'
import 'react'

declare module 'react' {
  interface VideoHTMLAttributes<T> extends MediaHTMLAttributes<T> {
    defaultMuted?: boolean
    'webkit-playsinline'?: string | boolean
  }
}

/** Supported locales for the YASLOGIST platform. */
export type Language = 'en' | 'ar' | 'zh' | 'tr' | 'fr'

/** Text direction derived from the active locale. */
export type Direction = 'ltr' | 'rtl'

/** A localized string dictionary supporting global trade languages. */
export interface BilingualText {
  en: string
  ar: string
  zh: string
  tr: string
  fr: string
  [key: string]: string
}

/** One operational telemetry metric shown on a phase card. */
export interface MetricProps {
  /** Stable React key / metric identifier. */
  id: string
  icon: LucideIcon
  /** Metric label, localized. */
  label: BilingualText
  /** Metric value — telemetry-style reading, kept in English by design. */
  value: string
  /** Sub-status or unit detail */
  status?: string
}

/** Content model for one scroll phase of the scrollytelling section. */
export interface PhaseProps {
  /** Phase index (0-based). */
  index: number
  /** Scroll-progress range [start, end] in which this phase is active. */
  range: readonly [number, number]
  title: BilingualText
  subtitle: BilingualText
  /** Eyebrow / kicker label above the title. */
  kicker: BilingualText
  icon: LucideIcon
  metrics: MetricProps[]
}

/** Rich specification chip for capability cards. */
export interface CapabilitySpec {
  label: BilingualText
  value: string
  numValue?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

/** Content model for the 6 redesigned capability cards. */
export interface CapabilityCardItem {
  id: string
  indexNumber: string
  icon: LucideIcon
  kicker: BilingualText
  title: BilingualText
  tagline: BilingualText
  description: BilingualText
  specs: CapabilitySpec[]
  accentColor?: string
  interactiveType: 'route' | 'radar' | 'security' | 'robotics' | 'globe' | 'predictive'
}

/** Rigorous translation contract for the whole section. */
export interface TranslationProps {
  language: Language
  direction: Direction
  phases: PhaseProps[]
  disclaimer: string
  ui: {
    scrollHint: string
    phaseCounter: string
    simulationBadge: string
    themeToggle: string
    languageToggle: string
  }
}

/** Theme contract. */
export interface ThemeProps {
  theme: 'dark' | 'light'
  videoSrc: string
  isDark: boolean
}

/** Public props accepted by <LandLogisticsSection />. */
export interface LandLogisticsSectionProps {
  /** Section anchor id. Defaults to "land-logistics". */
  id?: string
  /** Scroll length multiplier — section height = scrollLength * 100vh. */
  scrollLength?: number
}
