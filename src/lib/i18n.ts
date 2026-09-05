import type { Language, Direction, BilingualText } from '@/types/land-logistics'
import { LOGISTICS_DICTIONARY } from '@/lib/translations/tradeDictionary'

export interface LanguageConfig {
  code: Language
  label: string
  nativeName: string
  direction: Direction
  flagCode: string
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', label: 'EN', nativeName: 'English', direction: 'ltr', flagCode: 'US' },
  { code: 'ar', label: 'عربي', nativeName: 'العربية', direction: 'rtl', flagCode: 'EG' },
  { code: 'zh', label: '中文', nativeName: '简体中文', direction: 'ltr', flagCode: 'CN' },
  { code: 'tr', label: 'TR', nativeName: 'Türkçe', direction: 'ltr', flagCode: 'TR' },
  { code: 'fr', label: 'FR', nativeName: 'Français', direction: 'ltr', flagCode: 'FR' },
]

export { LOGISTICS_DICTIONARY }

/**
 * Universal text creator supporting English, Arabic, Chinese, Turkish, and French.
 * If target translation is not explicitly provided, attempts intelligent dictionary match,
 * defaulting to English with 100% type safety.
 */
export function createBilingualText(
  en: string,
  ar: string,
  zh?: string,
  tr?: string,
  fr?: string,
): BilingualText {
  const dict = LOGISTICS_DICTIONARY[en] || LOGISTICS_DICTIONARY[en.trim()]
  return {
    en,
    ar,
    zh: zh || dict?.zh || generateTradeZh(en),
    tr: tr || dict?.tr || generateTradeTr(en),
    fr: fr || dict?.fr || generateTradeFr(en),
  }
}

export const t = createBilingualText

/** Intelligent contextual fallback for Chinese logistics trade terms */
function generateTradeZh(text: string): string {
  if (/speed/i.test(text)) return '极速绕行预案'
  if (/cost|esg/i.test(text)) return '绿色能效经济方案'
  if (/cold|reefer|pharma/i.test(text)) return '冷链温控保障预案'
  if (/fog/i.test(text)) return '大雾能见度受限'
  if (/gate/i.test(text)) return '干线闸口通行拥堵'
  if (/heat/i.test(text)) return '高温时段避险调度'
  if (/ferry/i.test(text)) return '滚装轮渡延误处置'
  return text
}

/** Intelligent contextual fallback for Turkish logistics trade terms */
function generateTradeTr(text: string): string {
  if (/speed/i.test(text)) return 'Hızlı Rota Protokolü'
  if (/cost|esg/i.test(text)) return 'Ekonomik ve Yeşil Hat'
  if (/cold|reefer|pharma/i.test(text)) return 'Soğuk Zincir Protokolü'
  if (/fog/i.test(text)) return 'Yoğun Sis Kısıtlaması'
  if (/gate/i.test(text)) return 'Liman Kapısı Bekleme'
  if (/heat/i.test(text)) return 'Yüksek Sıcaklık Tedbiri'
  if (/ferry/i.test(text)) return 'Feribot Sefer İptali'
  return text
}

/** Intelligent contextual fallback for French logistics trade terms */
function generateTradeFr(text: string): string {
  if (/speed/i.test(text)) return 'Protocole Rapide'
  if (/cost|esg/i.test(text)) return 'Itinéraire Éco-ESG'
  if (/cold|reefer|pharma/i.test(text)) return 'Protocole Chaîne du Froid'
  if (/fog/i.test(text)) return 'Visibilité Réduite / Brouillard'
  if (/gate/i.test(text)) return 'Attente Porte Terminal'
  if (/heat/i.test(text)) return 'Restriction Forte Chaleur'
  if (/ferry/i.test(text)) return 'Interruption Transbordeur'
  return text
}
