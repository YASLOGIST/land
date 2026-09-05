import type { Language, Direction, BilingualText } from '@/types/land-logistics'

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

/**
 * High-precision dictionary for international logistics trade, freight transport,
 * supply chain operations, corridors, and telemetry command systems.
 */
const LOGISTICS_DICTIONARY: Record<string, { zh: string; tr: string; fr: string }> = {
  // Navigation & Suite Links
  'Overview': { zh: '走廊概览', tr: 'Genel Bakış', fr: 'Aperçu' },
  'Capabilities': { zh: '核心运力', tr: 'Yetkinlikler', fr: 'Capacités' },
  'Corridors': { zh: '干线走廊', tr: 'Koridorlar', fr: 'Corridors' },
  'Disruption': { zh: '应急指挥', tr: 'Kriz Yönetimi', fr: 'Disruption' },
  'Network': { zh: '枢纽网络', tr: 'Lojistik Ağı', fr: 'Réseau' },
  'Select Language': { zh: '选择语言', tr: 'Dil Seçin', fr: 'Choisir la Langue' },
  'Launch Land Suite': { zh: '启动陆运控制台', tr: 'Kara Sistemini Başlat', fr: 'Lancer la Suite Terrestre' },
  'Live Telemetry': { zh: '实时遥测', tr: 'Canlı Telemetri', fr: 'Télémétrie en Direct' },
  'Close': { zh: '关闭', tr: 'Kapat', fr: 'Fermer' },

  // Hero Section
  'INTELLIGENT FREIGHT // ARTERIAL HEAVY-HAUL MESH': {
    zh: '智能货运 // 重载干线骨干物流网',
    tr: 'AKILLI TAŞIMACILIK // AĞIR YÜK KARA TAŞIMA AĞI',
    fr: 'FRET INTELLIGENT // RÉSEAU MAILLÉ DE TRANSPORT LOURD',
  },
  'Autonomous heavy-haul line-haul dispatch across Egypt, Gulf & Levant. Cryptographically sealed manifest chain, real-time ETA engine, dynamic reroute protocols.': {
    zh: '覆盖埃及、海湾及黎凡特的智能干线重载调度。具备加密电子运单存证、实时动态ETA计算与自主避障重算协议。',
    tr: 'Mısır, Körfez ve Levant genelinde otonom ağır yük hat sevkiyatı. Kriptografik mühürlü konşimento zinciri, gerçek zamanlı ETA motoru, dinamik rota protokolleri.',
    fr: "Expédition autonome de fret lourd à travers l'Égypte, le Golfe et le Levant. Chaîne de manifeste scellée par cryptographie, moteur ETA en temps réel et protocoles de déroutement dynamique.",
  },
  'Launch Line-Haul Console': { zh: '启动干线调度台', tr: 'Hat Sevkiyat Konsolu', fr: 'Lancer la Console de Ligne' },
  'Inspect Trade Corridors': { zh: '查看贸易大走廊', tr: 'Ticaret Koridorlarını İncele', fr: 'Explorer les Corridors' },
  'CORRIDOR VELOCITY': { zh: '走廊平均运速', tr: 'KORİDOR HIZI', fr: 'VITESSE DU CORRIDOR' },
  'DISPATCH AUTOMATION': { zh: '调度自动化率', tr: 'SEVKİYAT OTOMASYONU', fr: "AUTOMATISATION D'EXPÉDITION" },
  'TRANSIT ACCURACY': { zh: '时效达成准点率', tr: 'VARIŞ DOĞRULUĞU', fr: 'PRÉCISION DE TRANSIT' },
  'REEFER STABILITY': { zh: '冷链温控合格率', tr: 'SOĞUK ZİNCİR İSTİKRARI', fr: 'STABILITÉ FRIGORIFIQUE' },

  // Dashboard Overview Section
  'ANALYTICS & CONTROL ROOM': { zh: '数据分析与监控大厅', tr: 'ANALİTİK VE KONTROL MERKEZİ', fr: 'SALLE DE CONTRÔLE & ANALYTIQUE' },
  'Autonomous Command Overview': { zh: '自主调度指挥全景概览', tr: 'Otonom Komuta Genel Bakışı', fr: 'Vue d\'Ensemble du Commandement Autonome' },
  'Real-time simulation throughput analytics and automated network health telemetry.': {
    zh: '干线吞吐量实时仿真推演与全网健康状态遥测监控。',
    tr: 'Gerçek zamanlı simülasyon hacim analitiği ve otomatik ağ sağlığı telemetrisi.',
    fr: 'Analytique du débit de simulation en temps réel et télémétrie automatisée de la santé du réseau.',
  },
  'Throughput Rate': { zh: '吞吐流速', tr: 'Hacim Akışı', fr: 'Taux de Débit' },
  'Active Fleet Units': { zh: '在途车队单元', tr: 'Aktif Filo Birimleri', fr: 'Unités de Flotte Actives' },
  'Network Efficiency': { zh: '网络运行综合效率', tr: 'Lojistik Ağ Verimliliği', fr: 'Efficacité du Réseau' },
  'Real-time node sync and path recalculation stability rate.': {
    zh: '干线节点实时数据同步率与路径重算动态稳定性。',
    tr: 'Gerçek zamanlı düğüm senkronizasyonu ve rota yeniden hesaplama kararlılığı.',
    fr: 'Synchronisation des nœuds en temps réel et taux de stabilité du recalcul des trajets.',
  },
  'Calibrate Mesh Network': { zh: '校准干线网络路由', tr: 'Ağı Kalibre Et', fr: 'Calibrer le Réseau Maillé' },
  'Recalibrating network paths...': { zh: '正在重新校准走廊最优路径...', tr: 'Ağ yolları yeniden kalibre ediliyor...', fr: 'Recalibrage des trajets du réseau...' },
  'Simulated Grid Load': { zh: '模拟干线负荷率', tr: 'Simüle Edilmiş Ağ Yükü', fr: 'Charge Réseau Simulée' },
  'HEAVY TRAFFIC DETECTED': { zh: '走廊负荷过载 / 预警', tr: 'YOĞUN TRAFİK ALGILANDI', fr: 'TRAFIC DENSE DÉTECTÉ' },
  'OPTIMAL LOAD FREIGHT': { zh: '最佳载货运行状态', tr: 'OPTİMAL YÜK KAPASİTESİ', fr: 'CHARGE DE FRET OPTIMALE' },
  'Aggregated Throughput': { zh: '累计总运量', tr: 'Toplam Taşıma Hacmi', fr: 'Débit Cumulé' },
  'Mesh Sync Latency': { zh: '网络同步延迟', tr: 'Ağ Senkronizasyon Gecikmesi', fr: 'Latence de Synchronisation' },
  'Optimal Routes': { zh: '已生成最优路径', tr: 'Optimal Rotalar', fr: 'Itinéraires Optimaux' },
  'Tons/hr': { zh: '吨/小时', tr: 'Ton/saat', fr: 'Tonnes/h' },
  'Nodes Synchronized': { zh: '个节点已完成同步', tr: 'Senkronize Düğüm', fr: 'Nœuds Synchronisés' },

  // Corridor Dispatch Section
  'LIVE MULTI-CORRIDOR DISPATCH ENGINE': {
    zh: '多走廊实时协同调度引擎',
    tr: 'CANLI ÇOKLU KORİDOR SEVKİYAT MOTORU',
    fr: 'MOTEUR DE DÉPÊCHE MULTI-CORRIDOR EN DIRECT',
  },
  'Interactive Land Logistics Simulator': {
    zh: '交互式国际陆运全要素仿真器',
    tr: 'İnteraktif Kara Lojistiği Simülatörü',
    fr: 'Simulateur Interactif de Logistique Terrestre',
  },
  'Select Corridor': { zh: '选择重点运输走廊', tr: 'Taşımacılık Koridoru Seçin', fr: 'Sélectionner le Corridor' },
  'Select Transport Mode': { zh: '选择运输装备类型', tr: 'Taşıma Modunu Seçin', fr: 'Sélectionner le Mode de Transport' },
  'Cargo Classification': { zh: '货物安全等级与分类', tr: 'Kargo Sınıflandırması', fr: 'Classification du Fret' },
  'Payload Weight': { zh: '单车装载吨位', tr: 'Faydalı Yük Ağırlığı', fr: 'Poids de Charge Utile' },
  'Tons': { zh: '吨', tr: 'Ton', fr: 'Tonnes' },
  'Estimated Transit Time': { zh: '核算门到门运输时效', tr: 'Tahmini Varış Süresi', fr: 'Temps de Transit Estimé' },
  'Est. Operational Cost': { zh: '综合运营总成本', tr: 'Tahmini Operasyonel Maliyet', fr: 'Coût Opérationnel Estimé' },
  'CO2 Reduction Offset': { zh: '绿色低碳减排量', tr: 'CO2 Emisyon Tasarrufu', fr: 'Économie de CO2' },
  'Fuel Efficiency Gain': { zh: '燃油经济综合增益', tr: 'Yakıt Verimliliği Artışı', fr: 'Gain d\'Efficacité Carburant' },
  'Cryptographic Manifest Seal': { zh: '区块链防篡改电子运单封条', tr: 'Kriptografik Taşıma Belgesi Mührü', fr: 'Sceau Cryptographique du Manifeste' },
  'Generate Cryptographic Waybill': { zh: '签发高安全级电子运单', tr: 'Kriptografik Taşıma Belgesi Üret', fr: 'Générer le Manifeste Cryptographique' },
  'Compare Route Alternatives': { zh: '多走廊路径多维对比', tr: 'Alternatif Rotaları Karşılaştır', fr: 'Comparer les Alternatives de Route' },

  // Disruption Command Section
  'CORRIDOR EXCEPTION COMMAND CENTRE': {
    zh: '陆运走廊异常与应急指挥中心',
    tr: 'KORİDOR KRİZ VE İSTİSNA YÖNETİM MERKEZİ',
    fr: 'CENTRE DE COMMANDEMENT DES INCIDENTS DE CORRIDOR',
  },
  'Corridor Incident Resolution': {
    zh: '走廊突发事件自主处置系统',
    tr: 'Koridor Olay ve Kriz Çözümleme',
    fr: 'Résolution des Incidents de Corridor',
  },
  'Bottleneck detection across the modelled corridor set, with reroute options costed against transit time, road charges and cargo condition.': {
    zh: '走廊瓶颈实时检测，结合通行时效、路桥通行费及冷链货物工况智能核算最优避障绕行预案。',
    tr: 'Modellenen koridor setinde darboğaz tespiti, transit süre, yol ücretleri ve kargo durumuna göre maliyetlendirilmiş alternatif rota seçenekleri.',
    fr: 'Détection des goulets d\'étranglement sur le réseau modélisé, avec déroutement chiffré selon le temps de transit, les péages et l\'état de la cargaison.',
  },
  'Active Corridor Disruptions': { zh: '当前突发走廊阻断预警', tr: 'Aktif Koridor Kesintileri', fr: 'Perturbations Actives du Corridor' },
  'Select AI Autonomous Contingency Protocol': {
    zh: '选择AI自主应急处置协议',
    tr: 'Otonom Acil Durum Protokolünü Seçin',
    fr: 'Sélectionner le Protocole d\'Urgence Autonome IA',
  },
  'Authorize Autonomous AI Reroute': {
    zh: '授权并激活AI自主绕行方案',
    tr: 'Otonom Yeniden Rotalamayı Onayla',
    fr: 'Autoriser le Déroutement Autonome IA',
  },
  'Transit Time Recovered': { zh: '挽回在途延误时间', tr: 'Geri Kazanılan Zaman', fr: 'Temps de Transit Récupéré' },
  'Net Delay With AI Reroute': { zh: 'AI介入后最终净延误', tr: 'Müdahale Sonrası Net Gecikme', fr: 'Retard Net avec Déroutement' },
  'Asset Risk Mitigation': { zh: '资产及货损风险防范', tr: 'Varlık Riski Azaltma Oranı', fr: 'Atténuation du Risque d\'Actif' },
  'Autonomous Reroute Authorization Token': {
    zh: '自主重路由加密授权凭证',
    tr: 'Otonom Yeniden Rota Yetkilendirme Belgesi',
    fr: 'Jeton d\'Autorisation de Déroutement Autonome',
  },
  'Copy Authorization Token': { zh: '复制授权凭证', tr: 'Yetki Belgesini Kopyala', fr: 'Copier le Jeton d\'Autorisation' },
  'Token Copied': { zh: '凭证已复制', tr: 'Belge Kopyalandı', fr: 'Jeton Copié' },

  // Capabilities Section
  'CORE LOGISTICS INFRASTRUCTURE': { zh: '重载骨干物流基础设施', tr: 'TEMEL LOJİSTİK ALTYAPISI', fr: 'INFRASTRUCTURE LOGISTIQUE FONDAMENTALE' },
  'Engineered for Continental Scale': { zh: '专为跨大陆级规模打造的陆运体系', tr: 'Kıtasal Ölçek İçin Tasarlandı', fr: 'Conçu pour une Échelle Continentale' },
  'Deterministic logistics operating system combining physical land assets with autonomous algorithmic dispatch, cryptographic tracking, and precision corridor engineering.': {
    zh: '将物理陆运枢纽与自主算法调度、加密存证追踪和精准走廊工程学相结合的确定性物流操作系统。',
    tr: 'Fiziksel kara varlıklarını otonom algoritmik sevkiyat, kriptografik takip ve hassas koridor mühendisliği ile birleştiren deterministik lojistik işletim sistemi.',
    fr: 'Système d\'exploitation logistique déterministe combinant actifs terrestres physiques, dépêche algorithmique autonome, traçabilité cryptographique et ingénierie de précision.',
  },
}

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
  const dict = LOGISTICS_DICTIONARY[en]
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
