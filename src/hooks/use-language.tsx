import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Direction, Language } from '@/types/land-logistics'

interface LanguageContextValue {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'yaslogist-language'

function resolveInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null
  if (stored && ['en', 'ar', 'zh', 'tr', 'fr'].includes(stored)) {
    return stored
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(resolveInitialLanguage)

  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
  }, [])

  const toggleLanguage = useCallback(() => {
    const cycle: Language[] = ['en', 'ar', 'zh', 'tr', 'fr']
    setLanguageState((prev) => {
      const idx = cycle.indexOf(prev)
      return cycle[(idx + 1) % cycle.length]
    })
  }, [])

  // Keep <html lang/dir> in sync so native bidi behavior and a11y stay correct.
  useEffect(() => {
    const root = document.documentElement
    root.lang = language
    root.dir = direction
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language, direction])

  const value = useMemo<LanguageContextValue>(
    () => ({ language, direction, setLanguage, toggleLanguage }),
    [language, direction, setLanguage, toggleLanguage],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within a <LanguageProvider>')
  }
  return ctx
}
