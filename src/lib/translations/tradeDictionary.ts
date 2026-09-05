/**
 * Comprehensive international trade, freight transport, logistics,
 * customs, telemetry, and corridor dictionary.
 * Supports English, Arabic, Chinese (zh), Turkish (tr), and French (fr).
 */

export interface TranslationEntry {
  zh: string
  tr: string
  fr: string
}

export const LOGISTICS_DICTIONARY: Record<string, TranslationEntry> = {
  '10th of Ramadan Logistics Zone': {
    zh: '斋月十日城综合物流园区',
    tr: '10 Ramazan Lojistik Bölgesi',
    fr: 'Zone Logistique du 10 Ramadan',
  },
  '6th of October Dry Port': {
    zh: '十月六日城内陆无水港',
    tr: '6 Ekim Kuru Limanı',
    fr: 'Port Sec du 6 Octobre',
  },
  '6th of October Dry Port, inbound gate and staging yard': {
    zh: '十月六日城无水港进场闸口与前置缓冲堆场',
    tr: '6 Ekim Kuru Limanı, giriş kapısı ve bekleme sahası',
    fr: 'Port Sec du 6 Octobre, porte d’entrée et parc d’attente',
  },
  '7 nodes across 4 corridors. YASLOGIST books capacity at them; the facilities belong to their port and zone authorities.': {
    zh: '分布于 4 条重点走廊上的 7 个关键物流节点。YASLOGIST 预定其通过运力；设施归属各大港务及开发区管委会所有。',
    tr: '4 koridor genelinde 7 düğüm noktası. YASLOGIST bunlarda kapasite rezerve eder; tesisler ilgili liman ve serbest bölge idarelerine aittir.',
    fr: '7 nœuds répartis sur 4 corridors. YASLOGIST y réserve des capacités ; les infrastructures relèvent de leurs autorités portuaires et de zones respectives.',
  },
  'A road leg is rarely the whole journey. The same shipment record follows the cargo into the terminal it is heading for, so the handover does not start with a phone call.': {
    zh: '陆地公路运输很少是旅程的终点。同一份数字化运单记录伴随货物实时流转直至其预定抵达的枢纽码头，跨模式业务交接无需繁琐电话沟通，全部系统自动对齐。',
    tr: 'Karayolu taşımacılığı nadiren yolculuğun tamamıdır. Aynı sevkiyat kaydı, varacağı terminale kadar kargoyu adım adım izler; böylece operasyonel devir teslim asla telefon trafiğine bırakılmaz.',
    fr: 'Le trajet routier n’est que rarement l’unique étape. Le même dossier suit la marchandise jusqu’au terminal de destination, éliminant tout besoin d’appels manuels lors des transferts.',
  },
  'A unified operating system combining real-time arterial highway routing, zero-trust telemetry, and robotic warehouse fulfillment into a continuous digital twin.': {
    zh: '将实时干线公路路由算法、零信任物联网安全遥测与仓储机器人自动化履约无缝融合于不间断运行的数字孪生系统中。',
    tr: 'Gerçek zamanlı ana karayolu rota optimizasyonunu, sıfır güven telemetrisini ve robotik depo karşılamasını sürekli bir dijital ikiz halinde birleştiren birleşik işletim sistemi.',
    fr: 'Un système d\'exploitation unifié associant routage autoroutier en temps réel, télémétrie zéro-trust et préparation d\'entrepôt robotisée au sein d\'un jumeau numérique continu.',
  },
  'ACTIVE // 18 ROBOTS': {
    zh: '运行中 // 18 台AMR机器人',
    tr: 'AKTİF // 18 ROBOT',
    fr: 'ACTIF // 18 ROBOTS',
  },
  'ACTIVE CORRIDORS': {
    zh: '在途活跃干线走廊',
    tr: 'AKTİF KORİDORLAR',
    fr: 'CORRIDORS ACTIFS',
  },
  'ACTIVE UNITS': {
    zh: '在途运行车辆',
    tr: 'AKTİF BİRİMLER',
    fr: 'UNITÉS ACTIVES',
  },
  'AI Disruption Command': {
    zh: 'AI突发事件应急指挥',
    tr: 'Yapay Zeka Kriz Komutası',
    fr: 'Commandement IA des Incidents',
  },
  'AI-orchestrated long-haul arterial convoys, dynamic capacity allocation, and connected V2X highway platoons.': {
    zh: 'AI算法动态调度的干线长途车队、动态运力弹性分配与网联V2X公路智能列队行驶技术。',
    tr: 'Yapay zekâ yönetimli uzun yol ana arter konvoyları, dinamik kapasite dağıtımı ve bağlantılı V2X otoyol müfreze sürüşü.',
    fr: 'Convois artériels longue distance orchestrés par IA, allocation dynamique des capacités et pelotons autoroutiers connectés V2X.',
  },
  'AMR Fleet Mesh & Staging': {
    zh: 'AMR机器人集群协同与集拼调度',
    tr: 'AMR Filo Ağı ve Sıralama',
    fr: 'Maillage Flotte AMR & Préparation',
  },
  'AMR Fleet Mesh // Active Node': {
    zh: 'AMR机器人集群网络 // 活跃节点',
    tr: 'AMR Filo Ağı // Aktif Düğüm',
    fr: 'Maillage Flotte AMR // Nœud Actif',
  },
  'ANALYTICS & CONTROL ROOM': {
    zh: '数据分析与监控大厅',
    tr: 'ANALİTİK VE KONTROL MERKEZİ',
    fr: 'SALLE DE CONTRÔLE & ANALYTIQUE',
  },
  'Active Corridor Disruptions': {
    zh: '当前突发走廊阻断预警',
    tr: 'Aktif Koridor Kesintileri',
    fr: 'Perturbations Actives du Corridor',
  },
  'Active Corridors': {
    zh: '当前活跃大走廊',
    tr: 'Aktif Koridorlar',
    fr: 'Corridors Actifs',
  },
  'Active Cryo & Chilled (-20°C to +4°C)': {
    zh: '主动制冷及冷冻冷藏 (-20°C 至 +4°C)',
    tr: 'Aktif Dondurucu ve Soğutmalı (-20°C ila +4°C)',
    fr: 'Froid Actif & Congelé (-20°C à +4°C)',
  },
  'Active Fleet Units': {
    zh: '在途车队单元',
    tr: 'Aktif Filo Birimleri',
    fr: 'Unités de Flotte Actives',
  },
  'Active High-Density Storage': {
    zh: '高密度立体智能储位',
    tr: 'Aktif Yüksek Yoğunluklu Depolama',
    fr: 'Stockage Actif Haute Densité',
  },
  'Active Terrestrial Corridor': {
    zh: '当前选择运输大走廊',
    tr: 'Aktif Karayolu Koridoru',
    fr: 'Corridor Terrestre Actif',
  },
  'Active fleet': {
    zh: '实时在途车队',
    tr: 'Aktif filo',
    fr: 'Flotte active',
  },
  'Advance Notice Window': {
    zh: '前瞻预警预报窗口',
    tr: 'Önceden Bildirim Penceresi',
    fr: 'Fenêtre de Préavis',
  },
  'Aerodynamic Drag Reduction': {
    zh: '气动风阻优化与能耗降幅',
    tr: 'Aerodinamik Sürtünme Azaltımı',
    fr: 'Réduction de Traînée Aérodynamique',
  },
  'Aggregated Throughput': {
    zh: '累计总运量',
    tr: 'Toplam Taşıma Hacmi',
    fr: 'Débit Cumulé',
  },
  'Ahmed Yasser Ali': {
    zh: '艾哈迈德·亚塞尔·阿里 (Ahmed Yasser Ali)',
    tr: 'Ahmed Yasser Ali',
    fr: 'Ahmed Yasser Ali',
  },
  'Ain Sokhna Port Road Gate': {
    zh: '苏赫奈海港公路进出闸口',
    tr: 'Ayn Sokhna Limanı Karayolu Kapısı',
    fr: 'Porte Routière du Port d’Ain Sokhna',
  },
  'Air Freight': {
    zh: '航空货运枢纽网络',
    tr: 'Hava Taşımacılığı',
    fr: 'Fret Aérien',
  },
  'Al Batha Border Crossing (Saudi Arabia / UAE)': {
    zh: '巴哈海关跨国陆路口岸 (沙特/阿联酋)',
    tr: 'Al Batha Sınır Kapısı (Suudi Arabistan / BAE)',
    fr: 'Poste Frontière d’Al Batha (Arabie Saoudite / EAU)',
  },
  'Al Batha Border Crossing (UAE)': {
    zh: '巴哈跨国陆路口岸 (面向阿联酋方向)',
    tr: 'Al Batha Sınır Kapısı (BAE)',
    fr: 'Poste Frontière d’Al Batha (Émirats)',
  },
  'Al Batha exit formalities plaza': {
    zh: '巴哈陆路口岸出境海关联检查验大厅',
    tr: 'Al Batha çıkış işlemleri gümrük sahası',
    fr: 'Zone des formalités de sortie d’Al Batha',
  },
  'Alexandria Port Authority': {
    zh: '亚历山大港务局 (APA)',
    tr: 'İskenderiye Liman Başkanlığı',
    fr: 'Autorité Portuaire d’Alexandrie',
  },
  'All assets are served over HTTPS in production. The interface runs entirely in your browser and performs no privileged operations on your device.': {
    zh: '生产环境中所有静态资产均通过严格加密的 HTTPS 协议安全分发。界面逻辑 100% 在您的浏览器沙箱内运行，不会对您的设备执行任何特权操作。',
    tr: 'Tüm kaynaklar üretim ortamında HTTPS üzerinden sunulur. Arayüz tamamen tarayıcınızın içinde çalışır ve cihazınızda hiçbir ayrıcalıklı işlem gerçekleştirmez.',
    fr: 'Tous les composants sont distribués via HTTPS. L’interface s’exécute intégralement dans votre navigateur sans aucune opération privilégiée sur votre équipement.',
  },
  'All fleet telemetry, corridor figures, throughput dashboards and dispatch outputs shown on this site are illustrative digital-twin models presented for demonstration purposes. They are not live operational data and must not be relied on for routing, contracting or compliance decisions.': {
    zh: '本平台展示的所有车队遥测、走廊指标、吞吐量仪表板和调度输出均为用于技术演示的数字孪生推演模型。它们并非实时运营指令，不得作为实际商业选路、合同履约或法律合规决策的法律依据。',
    tr: 'Bu sitede gösterilen tüm filo telemetrisi, koridor verileri, hacim panoları ve sevkiyat çıktıları tanıtım amaçlı illüstratif dijital ikiz modelleridir. Canlı operasyonel veri niteliği taşımazlar; rota planlama, sözleşme veya uyumluluk kararlarında doğrudan dayanak olarak kullanılamazlar.',
    fr: 'Toutes les données de télémétrie, corridors, débits et expéditions affichées sont des modèles de simulation de jumeau numérique à des fins de démonstration. Elles ne constituent pas des données réelles d’exploitation et ne doivent pas fonder de décisions contractuelles.',
  },
  'Ambient Protected': {
    zh: '常温干燥防潮安全防护',
    tr: 'Ortam Sıcaklığı Korumalı',
    fr: 'Protection Température Ambiante',
  },
  'Ambient temperature passes 45°C through the early afternoon in high summer. Reefer units on the open desert section run at full duty cycle to hold set point, fuel burn climbs, and any unit already down on refrigerant starts drifting out of range.': {
    zh: '盛夏午后气温突破 45°C。空旷沙漠路段上的冷藏机组全负荷运转以维持温控设定，燃油消耗急剧攀升，冷媒略有不足的机组极易面临失温超标风险。',
    tr: 'Yaz aylarında öğleden sonra ortam sıcaklığı 45°C’yi aşar. Açık çöl kesimindeki soğutucu üniteler ısıyı korumak için tam kapasite çalışır, yakıt tüketimi tırmanır ve soğutucu gazı yetersiz üniteler sınırların dışına çıkma riski taşır.',
    fr: 'En plein été, la température dépasse 45°C en début d’après-midi. Les groupes frigo fonctionnent à 100% de charge pour maintenir la consigne, la consommation s’envole et les circuits fatigués risquent la rupture thermique.',
  },
  'Arterial GPS': {
    zh: '干线高精GPS定位追踪',
    tr: 'Ana Arter GPS Takibi',
    fr: 'GPS Artériel',
  },
  'Arterial Highways & Inland Hubs': {
    zh: '干线大动脉与内陆核心物流港',
    tr: 'Ana Arter Karayolları ve İç Lojistik Merkezleri',
    fr: 'Grands Axes Routiers & Hubs Intérieurs',
  },
  'Asset Risk Mitigation': {
    zh: '资产及货损风险防范',
    tr: 'Varlık Riski Azaltma Oranı',
    fr: 'Atténuation du Risque d\'Actif',
  },
  'Audit Verification': {
    zh: '数字化审计存证合规',
    tr: 'Denetim Doğrulaması',
    fr: 'Vérification d’Audit',
  },
  'Audited 2026': {
    zh: '2026年度官方核验',
    tr: '2026 Denetimli',
    fr: 'Audité 2026',
  },
  'Authorize Autonomous AI Reroute': {
    zh: '授权并激活AI自主绕行方案',
    tr: 'Otonom Yeniden Rotalamayı Onayla',
    fr: 'Autoriser le Déroutement Autonome IA',
  },
  'Automated ACID filing integration with Egyptian Customs authority': {
    zh: '无缝集成埃及海关总署 Nafeza 系统 ACID 自动报关',
    tr: 'Mısır Gümrük İdaresi ile otomatik ACID bildirim entegrasyonu',
    fr: 'Intégration déclarative automatisée ACID avec la douane égyptienne',
  },
  'Automated ACID filing integration with Egyptian Customs authority (Nafeza single window), generating pre-validated digital declarations that clear border checkpoints 4× faster.': {
    zh: '无缝对接埃及海关总署 Nafeza 单一窗口平台自动化申报 ACID 提单号，生成预核验数字化报关单，边境关卡放行速度提升4倍。',
    tr: 'Mısır Gümrük İdaresi (Nafeza tek pencere) ile otomatik ACID bildirim entegrasyonu; sınır kapılarından 4 kat daha hızlı geçiş sağlayan ön onaylı dijital beyannameler üretir.',
    fr: 'Intégration automatisée des déclarations ACID avec la douane égyptienne (guichet unique Nafeza), générant des déclarations numériques pré-validées pour un dédouanement 4× plus rapide aux frontières.',
  },
  'Automated Dock Assignment': {
    zh: '自动化装卸月台指派',
    tr: 'Otomatik Rampa Ataması',
    fr: 'Attribution Automatisée des Quais',
  },
  'Automated Dock Loading & Sealing': {
    zh: '装卸月台自动化装车与电子铅封校验',
    tr: 'Otomatik Rampa Yükleme ve Mühürleme',
    fr: 'Chargement Automatisé à Quai & Scellage',
  },
  'Automated High-Bay Storage & AMR Staging Matrix': {
    zh: '高位自动化立体仓储与AMR机器人分拨矩阵',
    tr: 'Otomatik Yüksek Raf Depolama ve AMR Sıralama Matrisi',
    fr: 'Stockage Haute Densité Automatisé & Matrice de Tri AMR',
  },
  'Automated gate OCR scanning, blockchain-verified customs pre-clearance, and seamless rail/highway intermodal swap.': {
    zh: '集装箱闸口光学字符自动识别(OCR)、区块链防篡改关税预清关，以及公路与铁路多式联运无缝转运。',
    tr: 'Otomatik kapı OCR taraması, blokzincir doğrulamalı gümrük ön izinleri ve kesintisiz demiryolu/karayolu intermodal aktarımı.',
    fr: 'Lecture automatisée des plaques et conteneurs par OCR, pré-dédouanement certifié par blockchain et transfert intermodal route/rail sans rupture.',
  },
  'Automation & Ground Fleet': {
    zh: '自动化调度与干线地面车队',
    tr: 'Otomasyon ve Kara Filosu',
    fr: 'Automatisation & Flotte Terrestre',
  },
  'Autonomous Command Overview': {
    zh: '自主调度指挥全景概览',
    tr: 'Otonom Komuta Genel Bakışı',
    fr: 'Vue d\'Ensemble du Commandement Autonome',
  },
  'Autonomous Ground & Cross-Dock Mesh': {
    zh: '自主地面网络与智能越库骨干架构',
    tr: 'Otonom Kara ve Cross-Dock Ağ Yapısı',
    fr: 'Maillage Terrestre et Cross-Dock Autonome',
  },
  'Autonomous Ground Fleets': {
    zh: '自主重载陆运车队',
    tr: 'Otonom Kara Filoları',
    fr: 'Flottes Terrestres Autonomes',
  },
  'Autonomous Heavy Freight & V2X Platooning': {
    zh: '重载干线自主运输与V2X智能编队行驶',
    tr: 'Otonom Ağır Taşımacılık ve V2X Müfreze Sürüşü',
    fr: 'Fret Lourd Autonome & Peloton V2X',
  },
  'Autonomous Heavy Haulage (FTL & LTL Dedicated)': {
    zh: '自主重载干线运输（整车FTL与零担LTL专线）',
    tr: 'Otonom Ağır Yük Taşımacılığı (Özel FTL ve LTL)',
    fr: 'Transport Lourd Autonome (Dédié FTL & LTL)',
  },
  'Autonomous Heavy Haulage (FTL Dedicated)': {
    zh: '自主重载整车专线运输 (FTL Dedicated)',
    tr: 'Otonom Ağır Yük Taşımacılığı (Özel FTL)',
    fr: 'Transport Lourd Autonome (Dédié FTL)',
  },
  'Autonomous Land Freight & Smart Warehousing Intelligence.': {
    zh: '自主地面货运与智能仓储工程级智能平台。',
    tr: 'Otonom Kara Taşımacılığı ve Akıllı Depolama Zekası.',
    fr: 'Intelligence de Fret Routier Autonome & Entreposage Intelligent.',
  },
  'Autonomous Land Logistics Command Center': {
    zh: '自主陆运智慧调度全球指挥中心',
    tr: 'Otonom Kara Lojistiği Komuta Merkezi',
    fr: 'Centre de Commandement Logistique Terrestre Autonome',
  },
  'Autonomous Land Operations': {
    zh: '自主陆运调度作业',
    tr: 'Otonom Kara Operasyonları',
    fr: 'Opérations Terrestres Autonomes',
  },
  'Autonomous Land Platform Architecture': {
    zh: '自主陆运智慧调度平台体系架构',
    tr: 'Otonom Kara Platformu Mimarisi',
    fr: 'Architecture de Plateforme Terrestre Autonome',
  },
  'Autonomous Mobile Robots (AMR)': {
    zh: '自主移动机器人(AMR)',
    tr: 'Otonom Mobil Robotlar (AMR)',
    fr: 'Robots Mobiles Autonomes (AMR)',
  },
  'Autonomous Reroute Authorization Token': {
    zh: '自主重路由加密授权凭证',
    tr: 'Otonom Yeniden Rota Yetkilendirme Belgesi',
    fr: 'Jeton d\'Autorisation de Déroutement Autonome',
  },
  'Autonomous Route & Highway Corridor Simulation': {
    zh: '陆运走廊自主路径决策与全要素推演',
    tr: 'Otonom Rota ve Otoyol Koridoru Simülasyonu',
    fr: 'Simulation Autonome d’Itinéraires et de Corridors Autoroutiers',
  },
  'Autonomous Route Intelligence': {
    zh: '陆运自主导航决策算法',
    tr: 'Otonom Güzergah Zekası',
    fr: 'Intelligence de Routage Autonome',
  },
  'Autonomous Urban & Regional EV Fleet': {
    zh: '城市与区域纯电轻型自主配送车队',
    tr: 'Otonom Şehir İçi ve Bölgesel EV Filosu',
    fr: 'Flotte Électrique Autonome Urbaine & Régionale',
  },
  'Autonomous Warehouse Robotics': {
    zh: '自主仓储机器人集群系统',
    tr: 'Otonom Depo Robotiği',
    fr: 'Robotique d\'Entreposage Autonome',
  },
  'Autonomous heavy-haul line-haul dispatch across Egypt, Gulf & Levant. Cryptographically sealed manifest chain, real-time ETA engine, dynamic reroute protocols.': {
    zh: '覆盖埃及、海湾及黎凡特的智能干线重载调度。具备加密电子运单存证、实时动态ETA计算与自主避障重算协议。',
    tr: 'Mısır, Körfez ve Levant genelinde otonom ağır yük hat sevkiyatı. Kriptografik mühürlü konşimento zinciri, gerçek zamanlı ETA motoru, dinamik rota protokolleri.',
    fr: 'Expédition autonome de fret lourd à travers l\'Égypte, le Golfe et le Levant. Chaîne de manifeste scellée par cryptographie, moteur ETA en temps réel et protocoles de déroutement dynamique.',
  },
  'Autonomous mobile robot (AMR) high-bay fulfillment, cryptographic seal tracking, and active cryogenic temperature locks.': {
    zh: '自主移动机器人(AMR)立体高架库自动履约、高安全级加密电子铅封追踪与超低温主动温控锁。',
    tr: 'Otonom mobil robot (AMR) yüksek irtifa raf operasyonu, kriptografik mühür takibi ve aktif kriyojenik sıcaklık kilitleri.',
    fr: 'Préparation automatisée en grande hauteur par robots AMR, scellés cryptographiques et verrouillage actif de la température cryogénique.',
  },
  'Autonomous mobile robots (AMRs) coordinate real-time high-density parcel consolidation and automated loading dock dispatch.': {
    zh: '自主移动机器人(AMR)协同运作，实现实时高密度包裹集拼整包与月台装卸自动化无缝调度。',
    tr: 'Otonom mobil robotlar (AMR), gerçek zamanlı yüksek yoğunluklu koli konsolidasyonunu ve otomatik rampa yükleme sevkiyatını koordine eder.',
    fr: 'Les robots mobiles autonomes (AMR) coordonnent en temps réel la consolidation haute densité des colis et l’affectation automatisée aux quais de chargement.',
  },
  'Autonomous mobile robots (AMRs) coordinate real-time high-density parcel sortation, dynamic pallet staging, and automated dock induction.': {
    zh: '自主移动机器人(AMR)全自主协调高密度包裹分拣、托盘动态码放集拼与装卸月台自动化导入作业。',
    tr: 'Otonom mobil robotlar (AMR), gerçek zamanlı yüksek yoğunluklu koli ayrıştırmayı, dinamik palet yerleşimini ve otomatik rampa beslemesini koordine eder.',
    fr: 'Les robots mobiles autonomes (AMR) coordonnent en temps réel le tri haute densité des colis, le positionnement dynamique des palettes et l\'alimentation automatisée des quais.',
  },
  'Autonomous mobile robots (AMRs) for precision sortation, robotic dock loading, and AI-routed long-haul electric transport.': {
    zh: '自主移动机器人(AMR)实现毫米级智能分拣、自动化月台装车与AI全流程规划的纯电长途运输。',
    tr: 'Hassas sıralama, robotik rampa yükleme ve yapay zekâ rotalı uzun mesafe elektrikli taşımacılık için otonom mobil robotlar (AMR).',
    fr: 'Robots mobiles autonomes (AMR) pour le tri de précision, chargement robotisé à quai et traction électrique longue distance pilotée par IA.',
  },
  'Autonomous mobile robots handle palletising, picking and dock induction in the high-bay area. Throughput is bounded by charging cycles and by how fast the dock can absorb what the robots stage.': {
    zh: '自主移动机器人(AMR)在高架立体库区负责自动码垛、精准拣选以及月台衔接导入。作业吞吐量主要受充电循环节奏与装卸月台消化吸收中转速率所调控。',
    tr: 'Otonom mobil robotlar (AMR), yüksek raf alanında paletleme, toplama ve rampa besleme işlemlerini yürütür. Taşıma kapasitesi şarj döngüleri ve rampanın robotların getirdiği yükü ne kadar hızlı işleyebildiğiyle sınırlıdır.',
    fr: 'Les robots mobiles autonomes (AMR) gèrent la palettisation, le prélèvement et l\'alimentation des quais en zone de stockage haute densité. Le débit est régulé par les cycles de recharge et la capacité d\'absorption des quais.',
  },
  'Average Velocity': {
    zh: '干线综合巡航速度',
    tr: 'Ortalama Seyir Hızı',
    fr: 'Vitesse Moyenne',
  },
  'BADR CITY STAGING // -4H': {
    zh: '分流巴德尔城中转 // 挽回 4小时',
    tr: 'BADR ŞEHRİ AKTARMASI // -4 SAAT',
    fr: 'DÉVIATION PARC BADR CITY // -4H',
  },
  'BAYAN customs declaration via the FASAH single window for cross-border loads': {
    zh: '针对跨国跨境货运经 FASAH 申报之全流程 BAYAN 海关报关单',
    tr: 'Sınır ötesi yükler için FASAH tek penceresi üzerinden BAYAN gümrük beyannamesi',
    fr: 'Déclaration douanière BAYAN via le guichet FASAH pour transports transfrontaliers',
  },
  'BAYAN import declaration filed through the FASAH single window': {
    zh: '经沙特 FASAH 单一窗口系统在线申报的 BAYAN 进口报关单',
    tr: 'FASAH tek pencere sistemi üzerinden verilen BAYAN ithalat beyannamesi',
    fr: 'Déclaration d’importation BAYAN déposée via le guichet unique FASAH',
  },
  'Badr City Logistics Zone': {
    zh: '巴德尔城现代化陆港枢纽',
    tr: 'Badr Şehri Lojistik Bölgesi',
    fr: 'Zone Logistique de Badr City',
  },
  'Badr City Logistics Zone, Eastern Cairo': {
    zh: '开罗东部巴德尔城现代物流保税区',
    tr: 'Badr Şehri Lojistik Bölgesi, Doğu Kahire',
    fr: 'Zone Logistique de Badr City, Le Caire Est',
  },
  'Bay Alignment': {
    zh: '泊位靠桥精确对准',
    tr: 'Yükleme Bölmesi Hizalaması',
    fr: 'Alignement de Travée',
  },
  'Bi-Modal Infrastructure': {
    zh: '公铁陆仓双模协同骨干基础设施',
    tr: 'İki Modlu Altyapı',
    fr: 'Infrastructure Bimodale',
  },
  'Bi-Modal: Road Freight & Automated Warehousing': {
    zh: '双模协同：公路干线货运与全自动化智慧仓储',
    tr: 'Çift Modlu: Karayolu Taşımacılığı ve Otomatik Depolama',
    fr: 'Bimodal : Fret Routier & Entreposage Automatisé',
  },
  'Blockchain Manifest Validation': {
    zh: '区块链加密舱单校验',
    tr: 'Blokzincir Taşıma Belgesi Doğrulaması',
    fr: 'Validation Cryptographique du Manifeste',
  },
  'Blockchain Seals Active': {
    zh: '活跃区块链加密铅封',
    tr: 'Aktif Blokzincir Mühürleri',
    fr: 'Scellés Blockchain Actifs',
  },
  'Bonded ICD Processing & Multi-Modal Intermodal Transfer': {
    zh: '保税无水港(ICD)快速监管通关与多式联运中转',
    tr: 'Gümrüklü ICD İşleme ve Çok Modlu Taşımacılık Transferi',
    fr: 'Traitement en Port Sec Sous Douane & Transfert Intermodal',
  },
  'Border Dwell': {
    zh: '口岸关卡滞留时间',
    tr: 'Sınır Bekleme Süresi',
    fr: 'Attente Frontalière',
  },
  'Bottleneck detection across the modelled corridor set, with reroute options costed against transit time, road charges and cargo condition.': {
    zh: '走廊瓶颈实时检测，结合通行时效、路桥通行费及冷链货物工况智能核算最优避障绕行预案。',
    tr: 'Modellenen koridor setinde darboğaz tespiti, transit süre, yol ücretleri ve kargo durumuna göre maliyetlendirilmiş alternatif rota seçenekleri.',
    fr: 'Détection des goulets d\'étranglement sur le réseau modélisé, avec déroutement chiffré selon le temps de transit, les péages et l\'état de la cargaison.',
  },
  'Breezy 27°C // dry pavement': {
    zh: '微风 27°C // 路面干燥通行条件良好',
    tr: 'Rüzgarlı 27°C // kuru asfalt',
    fr: 'Vent modéré 27°C // chaussée sèche',
  },
  'Bypass Route Active': {
    zh: '规避拥堵备选路线已激活',
    tr: 'Alternatif Güzergah Aktif',
    fr: 'Itinéraire de Contournement Actif',
  },
  'CALIBRATED // SECURE': {
    zh: '已完成精准校准 // 高安全级防护',
    tr: 'KALİBRE EDİLDİ // GÜVENLİ',
    fr: 'ÉTALONNÉ // SÉCURISÉ',
  },
  'CO2 Reduction Offset': {
    zh: '绿色低碳减排量',
    tr: 'CO2 Emisyon Tasarrufu',
    fr: 'Économie de CO2',
  },
  'CORE LOGISTICS INFRASTRUCTURE': {
    zh: '重载骨干物流基础设施',
    tr: 'TEMEL LOJİSTİK ALTYAPISI',
    fr: 'INFRASTRUCTURE LOGISTIQUE FONDAMENTALE',
  },
  'CORRIDOR EXCEPTION COMMAND CENTRE': {
    zh: '陆运走廊异常与应急指挥中心',
    tr: 'KORİDOR KRİZ VE İSTİSNA YÖNETİM MERKEZİ',
    fr: 'CENTRE DE COMMANDEMENT DES INCIDENTS DE CORRIDOR',
  },
  'CORRIDOR VELOCITY': {
    zh: '走廊平均运速',
    tr: 'KORİDOR HIZI',
    fr: 'VITESSE DU CORRIDOR',
  },
  'CO₂ Emissions Saved': {
    zh: '绿色低碳减排总量 (CO₂ Saved)',
    tr: 'Tasarruf Edilen CO₂ Emisyonu',
    fr: 'Émissions de CO₂ Économisées',
  },
  'CUSTOMS FILING': {
    zh: '海关清关申报对接',
    tr: 'GÜMRÜK BİLDİRİMİ',
    fr: 'DÉCLARATION EN DOUANE',
  },
  'Cairo–Alexandria Desert Road, Regional Ring Road': {
    zh: '开罗–亚历山大沙漠高速公路及区域环线',
    tr: 'Kahire–İskenderiye Çöl Yolu, Bölgesel Çevre Yolu',
    fr: 'Route du Désert Le Caire–Alexandrie, Rocade Régionale',
  },
  'Cairo–Alexandria Desert Road, km 45–85': {
    zh: '开罗–亚历山大沙漠公路，45至85公里段',
    tr: 'Kahire–İskenderiye Çöl Yolu, km 45–85',
    fr: 'Route du Désert Le Caire–Alexandrie, km 45–85',
  },
  'Calibrate Mesh Network': {
    zh: '校准干线网络路由',
    tr: 'Ağı Kalibre Et',
    fr: 'Calibrer le Réseau Maillé',
  },
  'Capabilities': {
    zh: '核心运力',
    tr: 'Yetkinlikler',
    fr: 'Capacités',
  },
  'Cargo Classification': {
    zh: '货物安全等级与分类',
    tr: 'Kargo Sınıflandırması',
    fr: 'Classification du Fret',
  },
  'Cargo Specification': {
    zh: '货物货品属性与分类',
    tr: 'Kargo Özellikleri',
    fr: 'Spécification du Fret',
  },
  'Cheapest per hour, adds a handling movement to the shipment': {
    zh: '单位小时能耗成本最低，但会增加一次额外的仓储装卸理货环节',
    tr: 'Saatlik bazda en ekonomik çözüm, ancak sevkiyata ilave bir elleçleme ekler',
    fr: 'Option la plus économique à l’heure, implique une manipulation supplémentaire',
  },
  'Clear 28°C // Gulf of Aqaba swell 0.6 m': {
    zh: '晴天 28°C // 阿卡巴湾海浪涌高 0.6米 适航',
    tr: 'Açık 28°C // Akabe Körfezi dalga 0.6 m',
    fr: 'Dégagé 28°C // houle du golfe d’Aqaba 0,6 m',
  },
  'Clear 28°C // calm': {
    zh: '晴朗 28°C // 无风静稳',
    tr: 'Açık 28°C // sakin',
    fr: 'Dégagé 28°C // vent calme',
  },
  'Clear 28°C // high visibility': {
    zh: '晴 28°C // 能见度极佳',
    tr: 'Açık 28°C // yüksek görüş mesafesi',
    fr: 'Dégagé 28°C // excellente visibilité',
  },
  'Clear 29°C // light wind': {
    zh: '晴 29°C // 微风',
    tr: 'Açık 29°C // hafif rüzgar',
    fr: 'Dégagé 29°C // vent léger',
  },
  'Clear 30°C // road surface 38°C': {
    zh: '晴天 30°C // 道路沥青地表温度 38°C',
    tr: 'Açık 30°C // asfalt sıcaklığı 38°C',
    fr: 'Ciel dégagé 30°C // température de chaussée 38°C',
  },
  'Clear 31°C // good visibility': {
    zh: '晴空 31°C // 极佳能见度',
    tr: 'Açık 31°C // yüksek görüş mesafesi',
    fr: 'Dégagé 31°C // excellente visibilité',
  },
  'Clear 31°C // humidity 24%': {
    zh: '晴天 31°C // 湿度 24%',
    tr: 'Açık 31°C // nem %24',
    fr: 'Dégagé 31°C // humidité 24%',
  },
  'Clear 32°C // dry air': {
    zh: '晴 32°C // 空气干燥',
    tr: 'Açık 32°C // kuru hava',
    fr: 'Dégagé 32°C // air sec',
  },
  'Clear 32°C // humidity 22%': {
    zh: '晴朗 32°C // 相对湿度 22%',
    tr: 'Açık 32°C // nem %22',
    fr: 'Ciel dégagé 32°C // humidité 22%',
  },
  'Clear 33°C // humidity 40%': {
    zh: '晴 33°C // 相对湿度 40%',
    tr: 'Açık 33°C // nem %40',
    fr: 'Dégagé 33°C // humidité 40%',
  },
  'Clear 33°C // yard occupancy 94%': {
    zh: '晴朗 33°C // 堆场利用率达到 94% 预警值',
    tr: 'Açık 33°C // saha doluluk oranı %94',
    fr: 'Ciel dégagé 33°C // taux d’occupation du parc 94%',
  },
  'Clear 34°C // humidity 18%': {
    zh: '晴空 34°C // 干燥湿度 18%',
    tr: 'Açık 34°C // nem %18',
    fr: 'Dégagé 34°C // air sec 18%',
  },
  'Clear 35°C // dry air': {
    zh: '晴 35°C // 空气干燥',
    tr: 'Açık 35°C // kuru hava',
    fr: 'Dégagé 35°C // air très sec',
  },
  'Clear 36°C // humidity 20%': {
    zh: '晴朗 36°C // 湿度 20%',
    tr: 'Açık 36°C // nem %20',
    fr: 'Dégagé 36°C // humidité 20%',
  },
  'Clear 37°C // dry pavement': {
    zh: '晴 37°C // 路面干燥良好',
    tr: 'Açık 37°C // kuru yol',
    fr: 'Dégagé 37°C // revêtement sec',
  },
  'Clear 38°C // high visibility': {
    zh: '晴朗 38°C // 能见度极佳',
    tr: 'Açık 38°C // yüksek görüş mesafesi',
    fr: 'Dégagé 38°C // excellente visibilité',
  },
  'Clear 38°C // light haze': {
    zh: '晴热 38°C // 轻微扬尘雾霾',
    tr: 'Açık 38°C // hafif pus',
    fr: 'Dégagé 38°C // légère brume sèche',
  },
  'Clear 38°C // pavement 44°C': {
    zh: '晴热 38°C // 路表温度 44°C',
    tr: 'Açık 38°C // asfalt sıcaklığı 44°C',
    fr: 'Chaud 38°C // température de chaussée 44°C',
  },
  'Clear 39°C // humidity 15%': {
    zh: '干热 39°C // 干燥湿度 15%',
    tr: 'Açık 39°C // nem %15',
    fr: 'Chaleur sèche 39°C // humidité 15%',
  },
  'Clear 40°C // high visibility': {
    zh: '酷热 40°C // 能见度良好',
    tr: 'Açık 40°C // yüksek görüş mesafesi',
    fr: 'Chaleur 40°C // excellente visibilité',
  },
  'Clear 41°C // road surface 55°C': {
    zh: '酷热烈日 41°C // 沥青地表温度 55°C',
    tr: 'Açık 41°C // asfalt sıcaklığı 55°C',
    fr: 'Canicule 41°C // température au sol 55°C',
  },
  'Clear 46°C // road surface 61°C // reefer duty cycle 100%': {
    zh: '极热烈日 46°C // 地表路面温度 61°C // 冷机 100% 满负荷工作',
    tr: 'Açık 46°C // asfalt sıcaklığı 61°C // soğutucu %100 yükte',
    fr: 'Soleil de plomb 46°C // température du bitume 61°C // groupe frigo à 100%',
  },
  'Close': {
    zh: '关闭',
    tr: 'Kapat',
    fr: 'Fermer',
  },
  'Coastal 24°C // humidity 62%': {
    zh: '沿海微凉 24°C // 相对湿度 62%',
    tr: 'Sahil 24°C // nem %62',
    fr: 'Climat côtier 24°C // humidité 62%',
  },
  'Cold-Chain Pharma & Perishables Precision': {
    zh: '医药与生鲜高标准冷链温控工程',
    tr: 'İlaç ve Bozulabilir Gıda Soğuk Zincir Hassasiyeti',
    fr: 'Excellence Chaîne du Froid Pharma & Périssables',
  },
  'Cold-Chain Precision': {
    zh: '高精冷链精准温控',
    tr: 'Hassas Soğuk Zincir',
    fr: 'Précision de la Chaîne du Froid',
  },
  'Command Hub // Live Stream': {
    zh: '调度指挥大厅 // 实时数据流',
    tr: 'Komuta Merkezi // Canlı Akış',
    fr: 'Centre de Commandement // Flux en Direct',
  },
  'Compare Route Alternatives': {
    zh: '多走廊路径多维对比',
    tr: 'Alternatif Rotaları Karşılaştır',
    fr: 'Comparer les Alternatives de Route',
  },
  'Compare Route Modalities': {
    zh: '多维度多走廊运输方案智能对比',
    tr: 'Taşıma Yöntemlerini Karşılaştır',
    fr: 'Comparer les Modes d’Acheminement',
  },
  'Configure terrestrial trade corridors, monitor autonomous heavy haulage and electric platooning, and inspect cross-dock facilities with sub-second telemetry precision.': {
    zh: '按需配置跨国陆运走廊，在线监控重载自主车队与列队行驶，以亚秒级遥测精度实时审查越库分拨枢纽作业工况。',
    tr: 'Karayolu ticaret koridorlarını yapılandırın, otonom ağır yük taşımacılığını ve elektrikli araç müfrezelerini izleyin ve saniyeden kısa telemetri hassasiyetiyle cross-dock tesislerini denetleyin.',
    fr: 'Configurez les corridors terrestres, supervisez le transport lourd autonome en peloton et inspectez les installations cross-dock avec une précision télémétrique sub-seconde.',
  },
  'Connected V2X Arterial Platoons & Long-Haul Haulage': {
    zh: '网联V2X干线列队编组与长途重载运输',
    tr: 'Bağlantılı V2X Ana Arter Müfrezeleri ve Uzun Yol Taşımacılığı',
    fr: 'Pelotons Artériels Connectés V2X & Transport Long-Courrier',
  },
  'Connected V2X Electric Highway Platoon': {
    zh: '车路协同V2X纯电重卡高速编队',
    tr: 'Bağlantılı V2X Elektrikli Otoyol Müfrezesi',
    fr: 'Peloton Autoroutier Électrique Connecté V2X',
  },
  'Connecting highways to seaports & air corridors': {
    zh: '将高速公路无缝接入海运枢纽港与航空货运大动脉',
    tr: 'Karayollarını Deniz Limanlarına ve Hava Koridorlarına Bağlama',
    fr: 'Interconnexion des Réseaux Routiers, Portuaires et Aériens',
  },
  'Consolidated Cross-Dock Routing': {
    zh: '集约化越库中转智能路由',
    tr: 'Konsolide Cross-Dock Yönlendirmesi',
    fr: 'Routage Consolidé en Cross-Dock',
  },
  'Contact': {
    zh: '联系我们',
    tr: 'İletişim',
    fr: 'Contact',
  },
  'Containers Cleared': {
    zh: '已验放集装箱',
    tr: 'Gümrükten Çıkan Konteynerler',
    fr: 'Conteneurs Dédouanés',
  },
  'Continuous temperature & humidity telemetry': {
    zh: '高精度温湿度全时连续遥测',
    tr: 'Kesintisiz sıcaklık ve nem telemetrisi',
    fr: 'Télémétrie continue de température et d’humidité',
  },
  'Continuous temperature & humidity telemetry at ±0.2°C precision': {
    zh: '±0.2°C工业级温湿度高精全时遥测',
    tr: '±0.2°C hassasiyetle kesintisiz sıcaklık ve nem telemetrisi',
    fr: 'Télémétrie continue de température et d’humidité à ±0,2°C de précision',
  },
  'Continuous temperature and humidity telemetry at ±0.2°C sensor precision, with an excursion alert raised the moment a reefer leaves its band — on the leg where no carrier system reports anything.': {
    zh: '±0.2°C工业级高精度温湿度不间断遥测，当冷藏箱出现温度超出设定阈值时毫秒级自动触发预警，彻底消除普通承运系统无法覆盖的监控盲区。',
    tr: '±0.2°C sensör hassasiyetinde kesintisiz sıcaklık ve nem telemetrisi; soğutuculu araç belirlenen aralığın dışına çıktığı anda otomatik uyarı verilir — klasik taşıyıcı sistemlerinin raporlama yapamadığı etaplarda bile.',
    fr: 'Télémétrie continue de température et d’humidité avec une précision capteur de ±0,2°C, avec alerte immédiate dès qu’un conteneur frigorifique quitte sa plage — même sur les segments non couverts par les transporteurs tiers.',
  },
  'Copy Authorization Token': {
    zh: '复制授权凭证',
    tr: 'Yetki Belgesini Kopyala',
    fr: 'Copier le Jeton d\'Autorisation',
  },
  'Corridor Dispatch Matrix': {
    zh: '走廊调度全要素矩阵',
    tr: 'Koridor Sevkiyat Matrisi',
    fr: 'Matrice de Dépêche des Corridors',
  },
  'Corridor Incident Resolution': {
    zh: '走廊突发事件自主处置系统',
    tr: 'Koridor Olay ve Kriz Çözümleme',
    fr: 'Résolution des Incidents de Corridor',
  },
  'Corridors': {
    zh: '干线走廊',
    tr: 'Koridorlar',
    fr: 'Corridors',
  },
  'Crypto Lock': {
    zh: '密码学防篡改锁存',
    tr: 'Kripto Kilit',
    fr: 'Verrou Cryptographique',
  },
  'Cryptographic Hash': {
    zh: '安全哈希加密算法',
    tr: 'Kriptografik Karma',
    fr: 'Hachage Cryptographique',
  },
  'Cryptographic Manifest Chains': {
    zh: '高安全级区块链加密电子运单存证链',
    tr: 'Kriptografik Taşıma Belgesi Zincirleri',
    fr: 'Chaînes Cryptographiques de Manifestes',
  },
  'Cryptographic Manifest Seal': {
    zh: '区块链防篡改电子运单封条',
    tr: 'Kriptografik Taşıma Belgesi Mührü',
    fr: 'Sceau Cryptographique du Manifeste',
  },
  'Customs Integration': {
    zh: '海关报关系统深度集成',
    tr: 'Gümrük Entegrasyonu',
    fr: 'Intégration Douanière',
  },
  'Cycle-Count Inventory Match Rate': {
    zh: '循环盘点账实绝对匹配率',
    tr: 'Dönemsel Sayım Envanter Eşleşme Oranı',
    fr: 'Taux de Concordance des Stocks par Inventaire Tournant',
  },
  'DESERT ROAD RESTRICTED // +5H': {
    zh: '沙漠公路通行受限 // 延误 +5小时',
    tr: 'ÇÖL YOLU KISITLAMASI // +5 SAAT',
    fr: 'ROUTE DU DÉSERT PERTURBÉE // +5H',
  },
  'DISPATCH AUTOMATION': {
    zh: '调度自动化率',
    tr: 'SEVKİYAT OTOMASYONU',
    fr: 'AUTOMATISATION D\'EXPÉDITION',
  },
  'DOCK': {
    zh: '装卸月台',
    tr: 'RAMPA',
    fr: 'QUAI',
  },
  'Damietta Port Authority': {
    zh: '杜姆亚特港务局 (DPA)',
    tr: 'Damietta Liman Başkanlığı',
    fr: 'Autorité Portuaire de Damiette',
  },
  'Damietta Port Road Gate': {
    zh: '杜姆亚特海港陆运闸口',
    tr: 'Damietta Limanı Karayolu Kapısı',
    fr: 'Porte Routière du Port de Damiette',
  },
  'Data Freshness': {
    zh: '遥测数据刷新间隔',
    tr: 'Veri Güncelliği',
    fr: 'Fraîcheur des Données',
  },
  'Declaration Check': {
    zh: '报关与海关申报核验',
    tr: 'Beyanname Kontrolü',
    fr: 'Contrôle de Déclaration Douanière',
  },
  'Deep-sea export booking & port telemetry.': {
    zh: '远洋干线订舱、提单追踪与集装箱港口实时遥测。',
    tr: 'Açık deniz ihracat rezervasyonu ve liman telemetrisi.',
    fr: 'Réservation export grand large & télémétrie portuaire.',
  },
  'Dekheila Port Road Gate, Alexandria': {
    zh: '亚历山大德海拉海港进出闸口',
    tr: 'Dekheila Limanı Karayolu Kapısı, İskenderiye',
    fr: 'Porte Routière du Port de Dekheila, Alexandrie',
  },
  'Deterministic arithmetic from declared corridor figures. Drive + declared holds = total.': {
    zh: '依据已备案走廊参数实施确定性数学演算：纯在途行驶时效 + 申报关卡排队耗时 = 全程总耗时。',
    tr: 'Bildirilen koridor verilerinden deterministik hesaplama: Sürüş süresi + gümrük beklemesi = toplam süre.',
    fr: 'Calcul déterministe basé sur les paramètres du corridor : Temps de conduite + arrêts réglementaires = durée totale.',
  },
  'Digital Pre-Clearance & ACID Integration': {
    zh: '电子预通关与 ACID/NAFEZA 自动化集成',
    tr: 'Dijital Ön Gümrükleme ve ACID Entegrasyonu',
    fr: 'Pré-Dédouanement Numérique & Intégration ACID',
  },
  'Direct Trunk Highway Corridor': {
    zh: '点对点直达骨干高速公路走廊',
    tr: 'Doğrudan Ana Karayolu Koridoru',
    fr: 'Corridor Autoroutier Direct',
  },
  'Direct physical and digital integration between 6th of October Dry Port, 10th of Ramadan Logistics Zone, and primary maritime gateways': {
    zh: '十月六日城无水港、斋月十日城物流区与主要海运集装箱枢纽港之间的物理与数字化全链条打通',
    tr: '6 Ekim Kuru Limanı, 10 Ramazan Lojistik Bölgesi ve birincil deniz kapıları arasında doğrudan entegrasyon',
    fr: 'Intégration directe physique et numérique entre le port sec du 6 Octobre, le hub du 10 Ramadan et les terminaux maritimes majeurs',
  },
  'Direct physical and digital integration between 6th of October Dry Port, 10th of Ramadan Logistics Zone, and primary maritime gateways including Alexandria, Dekheila, and Sokhna.': {
    zh: '实现十月六日城无水港、斋月十日城物流枢纽与亚历山大、德海拉、苏赫奈等国家级海运枢纽港之间的物理车道与数字报关全域互联。',
    tr: '6 Ekim Kuru Limanı, 10 Ramazan Lojistik Bölgesi ve İskenderiye, Dekheila ve Ayn Sokhna gibi birincil deniz kapıları arasında doğrudan fiziksel ve dijital entegrasyon.',
    fr: 'Intégration physique et numérique directe entre le port sec du 6 Octobre, la zone logistique du 10 Ramadan et les terminaux maritimes majeurs comme Alexandrie, Dekheila et Sokhna.',
  },
  'Disruption': {
    zh: '应急指挥',
    tr: 'Kriz Yönetimi',
    fr: 'Disruption',
  },
  'Divert to Badr City staging, re-present at the booked slot': {
    zh: '重载车辆分流至巴德尔城缓冲站，在重新确认的绿色预约窗口有序入闸',
    tr: 'Badr Şehri bekleme alanına yönlendir, yeni randevu slotunda kapıya yanaş',
    fr: 'Déviation vers le parc de Badr City, présentation au nouveau créneau réservé',
  },
  'Dock Cycle': {
    zh: '月台作业周转时效',
    tr: 'Rampa Döngüsü',
    fr: 'Cycle de Quai',
  },
  'Drag Reduced': {
    zh: '气动阻力减少',
    tr: 'Sürtünme Azaltıldı',
    fr: 'Traînée Réduite',
  },
  'Driver rest counted against hours, weighbridge queue cleared first': {
    zh: '合规计入司机法定作息时间，待地磅站排队彻底疏解后享有优先通行权',
    tr: 'Sürücü dinlenme süresi sayılır, kantar kuyruğu temizlendikten sonra devam edilir',
    fr: 'Repos conducteur décompté, reprise dès résorption de la file au pont-bascule',
  },
  'Dry 30°C // clear skies': {
    zh: '干爽 30°C // 万里无云',
    tr: 'Kuru 30°C // açık gökyüzü',
    fr: 'Sec 30°C // ciel pur',
  },
  'Dry 30°C // high visibility': {
    zh: '干燥 30°C // 能见度极佳',
    tr: 'Kuru 30°C // yüksek görüş',
    fr: 'Sec 30°C // très bonne visibilité',
  },
  'Dry 34°C // sea breeze': {
    zh: '干燥 34°C // 沿岸海风',
    tr: 'Kuru 34°C // deniz esintisi',
    fr: 'Sec 34°C // brise marine',
  },
  'Dry Ports, Port Gates & Border Crossings': {
    zh: '内陆无水港、海运码头闸口与国家陆路口岸',
    tr: 'Kuru Limanlar, Liman Kapıları ve Sınır Geçişleri',
    fr: 'Ports Secs, Portes Maritimes & Postes Frontières',
  },
  'Dry ports integrated with seaports': {
    zh: '内陆干港与海运主要港口无缝联通',
    tr: 'Deniz limanlarıyla entegre kuru limanlar',
    fr: 'Ports secs intégrés aux ports maritimes',
  },
  'Dual carriageway with long single-carriageway sections, asphalt': {
    zh: '双向车道辅以长距离双向分隔路段，全沥青铺设',
    tr: 'Uzun tek şeritli kesimleri olan bölünmüş yol, asfalt',
    fr: 'Chaussée principale avec tronçons simples allongés, bitume',
  },
  'Dual carriageway, 2 lanes each way, asphalt — long straight desert sections': {
    zh: '全封闭长直旷野沙漠双向公路，单向各 2 车道，高标号重载沥青',
    tr: 'Bölünmüş yol, her yönde 2 şerit, asfalt — uzun düz çöl kesimleri',
    fr: 'Chaussée séparée, 2 voies par sens, bitume — longues lignes droites désertiques',
  },
  'Dual carriageway, 2–3 lanes each way, asphalt': {
    zh: '沥青铺装双向干道，单向各 2 至 3 车道',
    tr: 'Bölünmüş yol, her yönde 2–3 şerit, asfalt',
    fr: 'Chaussée séparée, 2 à 3 voies par sens, bitume',
  },
  'Dual carriageway, 3 lanes each way, asphalt': {
    zh: '全封闭双向沥青路面，单向双向各 3 车道',
    tr: 'Bölünmüş yol, her yönde 3 şerit, asfalt',
    fr: 'Chaussée séparée, 3 voies par sens, enrobé bitumineux',
  },
  'Dual carriageway, 3–4 lanes each way, asphalt': {
    zh: '高等级沥青公路，单向各 3 至 4 车道',
    tr: 'Bölünmüş yol, her yönde 3–4 şerit, asfalt',
    fr: 'Chaussée séparée, 3 à 4 voies par sens, enrobé',
  },
  'Dual carriageway, 4 lanes each way, asphalt': {
    zh: '重载等级全封闭沥青路面，双向各 4 车道',
    tr: 'Bölünmüş yol, her yönde 4 şerit, asfalt',
    fr: 'Chaussée séparée, 4 voies par sens, enrobé lourd',
  },
  'Durra–Haql Land Border (Jordan / Saudi Arabia)': {
    zh: '杜拉–哈克勒陆路海关关口 (约旦/沙特)',
    tr: 'Durra–Haql Kara Sınırı (Ürdün / Suudi Arabistan)',
    fr: 'Frontière Terrestre de Durra–Haql (Jordanie / Arabie Saoudite)',
  },
  'Dynamic Load Distribution': {
    zh: '动态载荷均衡分配',
    tr: 'Dinamik Yük Dağılımı',
    fr: 'Répartition Dynamique de Charge',
  },
  'Dynamic Re-Route': {
    zh: '动态自适应绕行',
    tr: 'Dinamik Yeniden Rota',
    fr: 'Déroutement Dynamique',
  },
  'Dynamic Reroute Efficiency': {
    zh: '动态绕行决策执行效率',
    tr: 'Dinamik Rota Değiştirme Verimliliği',
    fr: 'Efficacité de Déroutement Dynamique',
  },
  'ETA Margin': {
    zh: '到达时效容差裕度',
    tr: 'ETA Tolerans Payı',
    fr: 'Marge ETA',
  },
  'ETA Reliability': {
    zh: 'ETA到达时间可靠度',
    tr: 'ETA Güvenilirlik Oranı',
    fr: 'Fiabilité ETA',
  },
  'ETA SEGMENTS — WHERE THE HOURS GO': {
    zh: 'ETA 耗时分段透视 — 在途时间精准流向',
    tr: 'ETA AŞAMALARI — SAATLER NEREYE GİDİYOR?',
    fr: 'DÉCOMPOSITION ETA — OÙ VONT LES HEURES',
  },
  'ETA VARIANCE': {
    zh: '干线ETA预测方差',
    tr: 'ETA SAPMA ORANI',
    fr: 'VARIANCE ETA',
  },
  'ETA Variance': {
    zh: 'ETA 预估浮动偏差',
    tr: 'ETA Sapma Değeri',
    fr: 'Variance de l’ETA',
  },
  'ETA — PLANNED VS MITIGATED, RECOMPUTED PER STRATEGY': {
    zh: 'ETA 动态推演 — 原始计划 vs 应急处置方案全景重算',
    tr: 'ETA — PLANLANAN VE İYİLEŞTİRİLEN, STRATEJİ BAZINDA YENİDEN HESAPLANDI',
    fr: 'ETA — PLANIFIÉ VS ATTÉNUÉ, RECALCULÉ PAR STRATÉGIE',
  },
  'Egypt': {
    zh: '埃及',
    tr: 'Mısır',
    fr: 'Égypte',
  },
  'Egyptian goods-transport licence issued by GARBLT (roads & land transport authority)': {
    zh: '由埃及道路与陆运监管局 (GARBLT) 签发的全国陆运准营证',
    tr: 'GARBLT (Karayolları ve Kara Taşımacılığı İdaresi) onaylı Mısır yük taşıma lisansı',
    fr: 'Licence égyptienne de transport de marchandises délivrée par la GARBLT',
  },
  'Electric Fleet Highway Telemetry': {
    zh: '纯电重卡车队高速公路实时遥测',
    tr: 'Elektrikli Filo Otoyol Telemetrisi',
    fr: 'Télémétrie Autoroutière de Flotte Électrique',
  },
  'Electric Highway Platoon // Highway V2X': {
    zh: '纯电公路编队 // 高速V2X车路协同',
    tr: 'Elektrikli Otoyol Müfrezesi // Otoyol V2X',
    fr: 'Peloton Autoroutier Électrique // V2X Autoroutier',
  },
  'Email address is required.': {
    zh: '电子邮箱为必填项。',
    tr: 'E-posta adresi zorunludur.',
    fr: 'L’adresse e-mail est obligatoire.',
  },
  'Engineered for Absolute Precision': {
    zh: '专为绝对精度与工程级可靠性打造',
    tr: 'Mutlak Hassasiyet ve Güvenilirlik İçin Tasarlandı',
    fr: 'Conçu pour une Précision et Fiabilité Absolues',
  },
  'Engineered for Continental Scale': {
    zh: '专为跨大陆级规模打造的陆运体系',
    tr: 'Kıtasal Ölçek İçin Tasarlandı',
    fr: 'Conçu pour une Échelle Continentale',
  },
  'Engineering Ground Logistics & Smart Fulfillment': {
    zh: '工程级地面物流与智能履约交付',
    tr: 'Hassas Kara Lojistiği Mühendisliği ve Akıllı Sipariş Karşılama',
    fr: 'Ingénierie Logistique Terrestre & Exécution Intelligente',
  },
  'Enter enterprise email': {
    zh: '输入企业工作邮箱',
    tr: 'Kurumsal e-posta adresinizi girin',
    fr: 'Entrez votre adresse e-mail professionnelle',
  },
  'Enterprise Contact': {
    zh: '大客户与商务合作',
    tr: 'Kurumsal İletişim',
    fr: 'Contact Entreprise',
  },
  'Enterprise Security': {
    zh: '企业级安全防护与加密存证',
    tr: 'Kurumsal Güvenlik ve Uyumluluk',
    fr: 'Sécurité d’Entreprise',
  },
  'Est. Arrival (Local Time)': {
    zh: '预计抵港到达时间 (目的地当地时间)',
    tr: 'Tahmini Varış (Yerel Saat)',
    fr: 'Arrivée Estimée (Heure Locale)',
  },
  'Est. Operational Cost': {
    zh: '综合运营总成本',
    tr: 'Tahmini Operasyonel Maliyet',
    fr: 'Coût Opérationnel Estimé',
  },
  'Est. Transit Time': {
    zh: '预计全程运输耗时 (Transit Time)',
    tr: 'Tahmini Seyahat Süresi',
    fr: 'Temps de Transit Estimé',
  },
  'Estimated Operational Cost': {
    zh: '全程测算综合运营成本 (Operational Cost)',
    tr: 'Tahmini Operasyonel Maliyet',
    fr: 'Coût Opérationnel Estimé',
  },
  'Estimated Transit Time': {
    zh: '核算门到门运输时效',
    tr: 'Tahmini Varış Süresi',
    fr: 'Temps de Transit Estimé',
  },
  'Every bill of lading, weighbridge receipt, and seal inspection is cryptographically signed and chained': {
    zh: '每一份提单、地磅单和铅封质检数据均经过密码学签名并在区块链上形成不可篡改的存证链条',
    tr: 'Her konşimento, kantar fişi ve mühür denetimi kriptografik olarak imzalanır ve zincire bağlanır',
    fr: 'Chaque lettre de voiture, ticket de pesage et scellé fait l’objet d’une signature cryptographique chaînée',
  },
  'Every bill of lading, weighbridge receipt, and seal inspection is cryptographically signed and chained, creating a tamper-proof digital audit trail for high-value and bonded freight.': {
    zh: '每份国际提单、地磅称重单和海关铅封核验记录均采用加密签名上链存证，为高货值和保税转关货物构筑防篡改的数字化全流程审计链。',
    tr: 'Her konşimento, kantar makbuzu ve mühür denetimi kriptografik olarak imzalanır ve zincire eklenir; yüksek değerli ve gümrüklü kargolar için kurcalanamaz dijital denetim izi oluşturulur.',
    fr: 'Chaque lettre de voiture, ticket de pesée et inspection de scellé est signé cryptographiquement, établissant une piste d’audit numérique inviolable pour les marchandises sensibles sous douane.',
  },
  'Every vehicle, container, and reefer unit continuously broadcasts GPS, mechanical health, tire pressure, and cargo lock state': {
    zh: '所有在途卡车、集装箱和冷机全天候持续回传GPS、机械工况、胎压与货舱电子锁状态',
    tr: 'Her araç, konteyner ve soğutucu ünite kesintisiz GPS, mekanik durum, lastik basıncı ve kargo kilit durumunu yayınlar',
    fr: 'Chaque véhicule, conteneur et groupe frigo transmet en continu GPS, état mécanique, pression des pneus et verrouillage',
  },
  'Every vehicle, container, and reefer unit continuously broadcasts GPS, mechanical health, tire pressure, and cargo lock state to our centralized logistics command center.': {
    zh: '每辆运输重卡、集装箱及冷藏设备均全时向中心指挥调度控制台回传高精GPS定位、底盘机械健康、胎压及电子货舱门锁状态。',
    tr: 'Her araç, konteyner ve soğutucu ünite; GPS konumunu, mekanik durumunu, lastik basıncını ve kargo kilit durumunu merkezi lojistik komuta merkezimize kesintisiz iletir.',
    fr: 'Chaque véhicule, conteneur et unité frigorifique transmet en continu ses coordonnées GPS, sa santé mécanique, sa pression des pneus et l’état des scellés à notre centre de commandement.',
  },
  'Excursion Alert': {
    zh: '温偏超限报警时效',
    tr: 'Sapma Uyarı Süresi',
    fr: 'Alerte d’Excursion',
  },
  'Expand Preview': {
    zh: '展开全屏高清预览',
    tr: 'Önizlemeyi Büyüt',
    fr: 'Agrandir l’Aperçu',
  },
  'Explore Operations': {
    zh: '深入探索运营体系',
    tr: 'Operasyonları Keşfet',
    fr: 'Explorer les Opérations',
  },
  'Explore System Telemetry': {
    zh: '查阅全网实时遥测指标',
    tr: 'Sistem Telemetrisini İncele',
    fr: 'Explorer la Télémétrie Système',
  },
  'Export BAYAN, or GCC transit Bayan for through cargo, filed via the FASAH single window': {
    zh: '经 FASAH 单一窗口正式备案之出口 BAYAN 或海湾合作委员会过境联检申报单',
    tr: 'FASAH tek pencere üzerinden verilen İhracat BAYAN veya GCC transit beyannamesi',
    fr: 'Déclaration d’exportation BAYAN ou transit CCG déposée via le guichet unique FASAH',
  },
  'FLEET TELEMETRY': {
    zh: '车队遥测监控',
    tr: 'FİLO TELEMETRİSİ',
    fr: 'TÉLÉMÉTRIE DE FLOTTE',
  },
  'Facility & Fleet // Swarm Sync': {
    zh: '场站设施与车队单元 // 集群自适应协同',
    tr: 'Tesis ve Filo // Sürü Senkronizasyonu',
    fr: 'Infrastructures & Flotte // Synchronisation d’Essaim',
  },
  'Ferry leg, then dual carriageway asphalt': {
    zh: '海上轮渡航段，后接陆地全封闭重载沥青公路',
    tr: 'Feribot etabı, ardından bölünmüş asfalt karayolu',
    fr: 'Segment maritime par ferry, puis chaussée bitumineuse séparée',
  },
  'Field Deployments & Infrastructure': {
    zh: '地面真实作业场景与基础设施',
    tr: 'Saha Dağıtımları ve Altyapı',
    fr: 'Déploiements Opérationnels & Infrastructures',
  },
  'Filing Accuracy': {
    zh: '报关申报准确率',
    tr: 'Bildirim Doğruluğu',
    fr: 'Exactitude Déclarative',
  },
  'Fleet Bulletins': {
    zh: '车队与走廊简讯',
    tr: 'Filo Bültenleri',
    fr: 'Bulletins de Flotte',
  },
  'Fleet Fuel Optimization': {
    zh: '综合车队燃油经济优化增益',
    tr: 'Filo Yakıt Optimizasyonu',
    fr: 'Optimisation Carburant de la Flotte',
  },
  'Fleet In Platoon': {
    zh: '编组内车队占比',
    tr: 'Müfrezedeki Araçlar',
    fr: 'Flotte en Peloton',
  },
  'Fleet Telematics Ping Interval': {
    zh: '车队车联网动态巡检间隔',
    tr: 'Filo Telematik Veri Aralığı',
    fr: 'Fréquence de Ping Télématique de Flotte',
  },
  'Fleet status update: All arterial corridors operating at optimal flow rate.': {
    zh: '车队运行状态简讯：所有干线骨干走廊均在最优吞吐通畅速率下平稳运行。',
    tr: 'Filo durum güncellemesi: Tüm ana arter koridorları optimum akış hızında çalışıyor.',
    fr: 'Point de situation de la flotte : Tous les corridors artériels fonctionnent au débit optimal.',
  },
  'Fog, visibility 80 m // 14°C // dew point 13°C': {
    zh: '浓雾警告，能见度 80 米 // 气温 14°C // 露点温度 13°C',
    tr: 'Yoğun Sis, görüş 80 m // 14°C // çiy noktası 13°C',
    fr: 'Brouillard, visibilité 80 m // 14°C // point de rosée 13°C',
  },
  'Forecast Accuracy': {
    zh: '预测推演准确度',
    tr: 'Tahmin Doğruluğu',
    fr: 'Précision Prévisionnelle',
  },
  'Forklift movements and optical scans are logged against the seal number, so a seal broken between the dock and the gate is traceable to a shift and a bay.': {
    zh: '叉车装卸轨迹与高精光学扫描均与电子铅封号绑定记录存证，从月台到出入闸口期间如有铅封异常破坏，可精准追溯至具体作业班次与作业装卸泊位。',
    tr: 'Forklift hareketleri ve optik taramalar mühür numarasıyla eşleştirilerek kaydedilir; böylece rampa ile kapı arasında kırılan herhangi bir mühür belirli bir vardiyaya ve yükleme bölmesine kadar takip edilebilir.',
    fr: 'Les mouvements de chariots et scans optiques sont consignés avec le numéro de scellé : tout scellé rompu entre le quai et la porte est traçable jusqu\'au poste et à la travée d\'origine.',
  },
  'Forward-looking capacity forecasting': {
    zh: '前瞻性运力与业务需求推演预测',
    tr: 'Geleceğe dönük kapasite tahmini',
    fr: 'Prévision prospective de capacité',
  },
  'Fuel Saved': {
    zh: '综合燃油节约率',
    tr: 'Tasarruf Edilen Yakıt',
    fr: 'Économie de Carburant',
  },
  'GARBLT licence on the Egyptian leg; TGA operating card (بطاقة تشغيل) for vehicles on the Saudi leg': {
    zh: '埃及路段持有 GARBLT 运输牌照；沙特路段车辆全面持有沙特交通总局 (TGA) 营运许可卡 (بطاقة تشغيل)',
    tr: 'Mısır etabında GARBLT lisansı; Suudi Arabistan etabında TGA işletme kartı (بطاقة تشغيل)',
    fr: 'Licence GARBLT sur la section égyptienne ; carte d’exploitation TGA (بطاقة تشغيل) pour l’Arabie Saoudite',
  },
  'GATE QUEUE // +7H': {
    zh: '闸口排队拥堵 // 延误 +7小时',
    tr: 'KAPI KUYRUĞU // +7 SAAT',
    fr: 'FILE D’ATTENTE PORTE // +7H',
  },
  'GPS PING INTERVAL': {
    zh: 'GPS遥测上报频次',
    tr: 'GPS VERİ ARALIĞI',
    fr: 'INTERVALLE PING GPS',
  },
  'Gate Dwell Congestion, 6th of October Dry Port': {
    zh: '十月六日城无水港闸口高负荷压车滞留',
    tr: '6 Ekim Kuru Limanında Kapı Bekleme Yoğunluğu',
    fr: 'Congestion et Attente à la Porte du Port Sec du 6 Octobre',
  },
  'Gate OCR Clearance': {
    zh: '闸口OCR自动核放',
    tr: 'Kapı OCR İzni',
    fr: 'Autorisation Porte OCR',
  },
  'Generate Cryptographic Manifest': {
    zh: '签发区块链加密电子运单存证',
    tr: 'Kriptografik Taşıma Belgesi Oluştur',
    fr: 'Générer le Manifeste Cryptographique',
  },
  'Generate Cryptographic Waybill': {
    zh: '签发高安全级电子运单',
    tr: 'Kriptografik Taşıma Belgesi Üret',
    fr: 'Générer le Manifeste Cryptographique',
  },
  'Global Command Hub': {
    zh: '全球调度控制大厅',
    tr: 'Küresel Komuta Merkezi',
    fr: 'Centre de Commandement Mondial',
  },
  'H5 weigh station north of Yanbu': {
    zh: '延布以北 H5 高速重车轴重动态计重站',
    tr: 'Yanbu kuzeyindeki H5 kantar istasyonu',
    fr: 'Station de pesage autoroutière H5 au nord de Yanbu',
  },
  'HAULAGE': {
    zh: '干线大动脉重载运输',
    tr: 'ANA TAŞIMA',
    fr: 'TRACTION',
  },
  'HEAVY TRAFFIC DETECTED': {
    zh: '走廊负荷过载 / 预警',
    tr: 'YOĞUN TRAFİK ALGILANDI',
    fr: 'TRAFIC DENSE DÉTECTÉ',
  },
  'HIGHWAY // LIVE': {
    zh: '高速主线 // 实时在线',
    tr: 'OTOYOL // CANLI',
    fr: 'AUTOROUTE // EN DIRECT',
  },
  'Haql Crossing (toward Durra / Jordan)': {
    zh: '哈克勒口岸 (经杜拉出境前往约旦方向)',
    tr: 'Haql Sınır Kapısı (Durra / Ürdün yönü)',
    fr: 'Poste de Haql (vers Durra / Jordanie)',
  },
  'Hazy 29°C // crosswind advisory': {
    zh: '微霾 29°C // 侧风横风安全警示',
    tr: 'Puslu 29°C // yan rüzgar uyarısı',
    fr: 'Brumeux 29°C // avis de vent traversier',
  },
  'Heavy Cargo Tie-Down': {
    zh: '重载抗颠簸高强度紧固系泊',
    tr: 'Ağır Yük Sabitleme ve Bağlama',
    fr: 'Arrimage Haute Résistance Fret Lourd',
  },
  'High precision': {
    zh: '高精微温差',
    tr: 'Yüksek hassasiyet',
    fr: 'Haute précision',
  },
  'High-Value Sealed Electronic & Automotive Cargo': {
    zh: '高货值密封电子产品与汽车精密零部件',
    tr: 'Yüksek Değerli Mühürlü Elektronik ve Otomotiv Yükü',
    fr: 'Fret Électronique & Automobile Scellé Haute Valeur',
  },
  'High-density AMR swarm automation': {
    zh: '高密度AMR机器人集群全自主协同作业',
    tr: 'Yüksek yoğunluklu AMR sürü otomasyonu',
    fr: 'Automatisation d\'essaim AMR haute densité',
  },
  'High-fidelity telemetry simulation — a digital-twin model illustrating YASLOGIST road freight mechanics.': {
    zh: '高保真多维遥测仿真 — 呈现 YASLOGIST 公路干线货运工程化运作机制的数字孪生推演模型。',
    tr: 'Yüksek doğruluklu telemetri simülasyonu — YASLOGIST karayolu taşımacılığı mekaniklerini gösteren dijital ikiz modeli.',
    fr: 'Simulation télémétrique haute fidélité — modèle de jumeau numérique illustrant la mécanique du fret routier YASLOGIST.',
  },
  'Hofuf heavy-truck weigh plaza (H40)': {
    zh: '霍夫夫重卡动态地磅检测广场 (H40)',
    tr: 'Hofuf ağır vasıta kantar alanı (H40)',
    fr: 'Station de pesage poids lourds de Hofuf (H40)',
  },
  'Hold at Wadi El Natrun staging until visibility clears': {
    zh: '在瓦迪纳特隆前置货车停泊区驻留，待能见度好转后起运',
    tr: 'Görüş açılana kadar Vadi El Natrun park alanında bekleme',
    fr: 'Attente sur l’aire de Wadi El Natrun jusqu’à dissipation du brouillard',
  },
  'Hold in bonded cold storage until the heat window passes': {
    zh: '就近转入保税恒温冷库暂存，待日落高温窗口消退后再行发车',
    tr: 'Sıcaklık dalgası geçene kadar gümrüklü soğuk hava deposunda bekle',
    fr: 'Mise en attente en entrepôt frigorifique sous douane jusqu’à la baisse des températures',
  },
  'Hold the load at 10th of Ramadan until a berth is confirmed': {
    zh: '将出境货物稳妥暂存于斋月十日城集货基地，直至海运轮渡舱位百分之百确认',
    tr: 'Gemi yanaşması kesinleşene kadar yükü 10 Ramazan merkezinde beklet',
    fr: 'Conserver le chargement au hub du 10 Ramadan jusqu’à confirmation ferme du quai',
  },
  'Holds set point without running the genset through the wait': {
    zh: '无需柴油发电机长时间运转即可全程保持精准温控，大幅压降能耗成本',
    tr: 'Bekleme sırasında jeneratörü çalıştırmadan sıcaklığı sabit tutar',
    fr: 'Maintien rigoureux du froid sans solliciter les générateurs thermiques',
  },
  'Humid 33°C // Gulf breeze': {
    zh: '潮热 33°C // 波斯湾海风',
    tr: 'Nemli 33°C // Körfez esintisi',
    fr: 'Humide 33°C // brise du Golfe',
  },
  'INTELLIGENT FREIGHT // ARTERIAL HEAVY-HAUL MESH': {
    zh: '智能货运 // 重载干线骨干物流网',
    tr: 'AKILLI TAŞIMACILIK // AĞIR YÜK KARA TAŞIMA AĞI',
    fr: 'FRET INTELLIGENT // RÉSEAU MAILLÉ DE TRANSPORT LOURD',
  },
  'INVENTORY MATCH': {
    zh: '库存账实匹配率',
    tr: 'ENVANTER DOĞRULUĞU',
    fr: 'CONFORMITÉ DES STOCKS',
  },
  'If you believe you have found a genuine security issue, please report it to contact@yaslogist.me.': {
    zh: '若您发现任何潜在的安全漏洞或技术隐患，请及时发送报告至 contact@yaslogist.me。',
    tr: 'Gerçek bir güvenlik açığı bulduğunuzu düşünüyorsanız, lütfen contact@yaslogist.me adresine bildirin.',
    fr: 'Si vous estimez avoir identifié une anomalie de sécurité, merci de la signaler à contact@yaslogist.me.',
  },
  'In preparation': {
    zh: '系统正在联调筹备中',
    tr: 'Hazırlık Aşamasında',
    fr: 'En Cours de Préparation',
  },
  'Industrial Development Authority zone': {
    zh: '工业发展总局规划保税物流区',
    tr: 'Sanayi Geliştirme İdaresi bölgesi',
    fr: 'Zone de l’Autorité de Développement Industriel',
  },
  'Inspect Trade Corridors': {
    zh: '查看贸易大走廊',
    tr: 'Ticaret Koridorlarını İncele',
    fr: 'Explorer les Corridors',
  },
  'Intelligence & Network': {
    zh: '智能情报与全球网络',
    tr: 'İstihbarat ve Lojistik Ağı',
    fr: 'Intelligence & Réseau',
  },
  'Intelligent Dynamic LTL & Cross-Dock Hubs': {
    zh: '智能动态零担集拼与越库分拨枢纽 (LTL)',
    tr: 'Akıllı Dinamik LTL ve Cross-Dock Merkezleri',
    fr: 'Hubs Dynamiques LTL et Cross-Dock Intelligents',
  },
  'Intelligent Highway Pathfinding': {
    zh: '干线公路智能动态选路',
    tr: 'Akıllı Otoyol Rota Bulma',
    fr: 'Routage Autoroutier Intelligent',
  },
  'Interactive Digital Twin: Use the timeline scrub control to inspect real-time fleet telematics, spatial node routing, and automated fulfillment logic.': {
    zh: '交互式数字孪生系统：拖动时间轴控制器，即可全景查看实时车队遥测、空间走廊路由算法及仓储自动化履约逻辑。',
    tr: 'İnteraktif Dijital İkiz: Gerçek zamanlı filo telemetrisini, uzamsal düğüm yönlendirmesini ve otomatik sipariş karşılama mantığını incelemek için zaman çizelgesi kaydırıcısını kullanın.',
    fr: 'Jumeau Numérique Interactif : Utilisez le curseur temporel pour inspecter la télémétrie de flotte en temps réel, le routage spatial des nœuds et la logique de préparation automatisée.',
  },
  'Interactive Model · Digital Twin Simulation': {
    zh: '交互式推演模型 · 数字孪生全要素仿真',
    tr: 'İnteraktif Model · Dijital İkiz Simülasyonu',
    fr: 'Modèle Interactif · Simulation Jumeau Numérique',
  },
  'Intermodal Hubs': {
    zh: '多式联运骨干枢纽',
    tr: 'İntermodal Lojistik Merkezleri',
    fr: 'Hubs Intermodaux',
  },
  'Intermodal Transfer Time': {
    zh: '多式联运中转衔接耗时',
    tr: 'İntermodal Aktarma Süresi',
    fr: 'Temps de Transfert Intermodal',
  },
  'Intermodal handoff': {
    zh: '多式联运跨网无缝交接',
    tr: 'İntermodal Aktarma ve Entegrasyon',
    fr: 'Correspondance Intermodale',
  },
  'International Coastal Road, Regional Ring Road': {
    zh: '地中海国际滨海大动脉与区域大环线',
    tr: 'Uluslararası Sahil Yolu, Bölgesel Çevre Yolu',
    fr: 'Route Côtière Internationale, Rocade Régionale',
  },
  'IoT Sensor Architecture': {
    zh: 'IoT物联网多模传感架构',
    tr: 'IoT Sensör Mimarisi',
    fr: 'Architecture Capteurs IoT',
  },
  'IoT Telemetry': {
    zh: 'IoT物联网多模态遥测',
    tr: 'IoT Telemetrisi',
    fr: 'Télémétrie IoT',
  },
  'Jeddah Islamic Port Road Gate': {
    zh: '吉达伊斯兰港集装箱公路闸口',
    tr: 'Cidde İslam Limanı Karayolu Kapısı',
    fr: 'Porte Routière du Port Islamique de Djeddah',
  },
  'Jeddah Logistics / Bonded Zone': {
    zh: '吉达综合保税物流中心',
    tr: 'Cidde Lojistik / Serbest Gümrüklü Bölge',
    fr: 'Zone Logistique Sous Douane de Djeddah',
  },
  'Jordan / Saudi Arabia': {
    zh: '约旦 / 沙特阿拉伯',
    tr: 'Ürdün / Suudi Arabistan',
    fr: 'Jordanie / Arabie Saoudite',
  },
  'King Abdulaziz Port Road Gate, Dammam': {
    zh: '达曼阿卜杜勒阿齐兹国王港公路闸口',
    tr: 'Kral Abdülaziz Limanı Karayolu Kapısı, Dammam',
    fr: 'Porte Routière du Port King Abdulaziz, Dammam',
  },
  'Launch Land Suite': {
    zh: '启动陆运控制台',
    tr: 'Kara Sistemini Başlat',
    fr: 'Lancer la Suite Terrestre',
  },
  'Launch Line-Haul Console': {
    zh: '启动干线调度台',
    tr: 'Hat Sevkiyat Konsolu',
    fr: 'Lancer la Console de Ligne',
  },
  'Leaves the fog band before km 45, rebooks the dry port slot': {
    zh: '在驶入 45 公里雾带前提前变道分流，并自动重约无水港入闸泊位',
    tr: '45. kilometreden önce sis bandından çıkar, kuru liman randevusunu yeniler',
    fr: 'Quitte la nappe de brouillard avant le km 45 et réassigne le créneau au port sec',
  },
  'Legal': {
    zh: '合规与法律条款',
    tr: 'Yasal Bildirimler',
    fr: 'Mentions Légales',
  },
  'Level 4 autonomous electric semi-truck platooning with sub-millisecond inter-vehicle telemetry and dynamic drag reduction.': {
    zh: 'L4级自动驾驶纯电半挂重卡公路列队编组行驶，具备亚毫秒级车间车联网遥测通信与动态风阻优化减排。',
    tr: 'Milisaniyenin altında araçlar arası telemetri ve dinamik sürtünme azaltımı ile Seviye 4 otonom elektrikli tır müfreze sürüşü.',
    fr: 'Peloton de semi-remorques électriques autonomes de niveau 4 avec télémétrie inter-véhicules sub-milliseconde et réduction aérodynamique dynamique.',
  },
  'Line-Haul ETA Variance': {
    zh: '长途干线运输ETA误差浮动区间',
    tr: 'Ana Hat Taşımacılığı ETA Sapması',
    fr: 'Variance de l’ETA sur les Transports de Ligne',
  },
  'Line-haul fleets, cross-dock yards and dry port slots held in one shipment record, so a delay at any of the three shows up against the same ETA.': {
    zh: '干线重载车队、越库分拨场站与内陆无水港靠泊计划整合于统一运单，任意节点延误皆可实时联动推演并更新全局ETA。',
    tr: 'Ana hat filoları, cross-dock aktarma sahaları ve kuru liman yanaşma pencereleri tek bir sevkiyat kaydında birleştirilir; böylece her üç noktadaki herhangi bir gecikme anında aynı genel ETA\'ya yansıtılır.',
    fr: 'Flottes de ligne, plateformes de cross-dock et créneaux de ports secs unifiés dans un dossier d\'expédition unique, répercutant tout retard directement sur le même ETA global.',
  },
  'Line-haul trucks arrive against a booked cross-dock slot rather than a queue position, so the yard knows what is coming and the dwell it cannot avoid is at least planned for.': {
    zh: '干线重卡严格按照预先锁定的越库月台窗口抵港，而非在场外随机排队等待；场站提前掌控到货时间表，即使存在不可避免的作业驻留亦能事先全盘规划。',
    tr: 'Ana hat tırları sıra beklemek yerine rezerve edilmiş cross-dock slotuna göre varış yapar; böylece lojistik saha neyin geleceğini bilir ve önlenemeyen bekleme süreleri en azından önceden planlanmış olur.',
    fr: 'Les camions de ligne arrivent sur un créneau réservé au cross-dock plutôt qu\'en file aléatoire, permettant au parc d\'anticiper les flux et d\'ordonnancer les temps de présence inévitables.',
  },
  'Live Telemetry': {
    zh: '实时遥测',
    tr: 'Canlı Telemetri',
    fr: 'Télémétrie en Direct',
  },
  'MIDDAY HEAT WINDOW // +6H': {
    zh: '正午高温规避窗口 // 延误 +6小时',
    tr: 'ÖĞLE SICAKLIĞI // +6 SAAT',
    fr: 'CRÉNEAU FORTE CHALEUR // +6H',
  },
  'Mansoura bypass junction': {
    zh: '曼苏拉城外环立体立交分流枢纽',
    tr: 'Mansoura çevre yolu kavşağı',
    fr: 'Échangeur de contournement de Mansourah',
  },
  'Marine Weather Delay, Nuweiba Ro-Ro Crossing': {
    zh: '海上恶劣海况停航延误，努韦巴滚装轮渡码头',
    tr: 'Deniz Muhalefeti Nedeniyle Sefer İptali, Nuveybe Ro-Ro Geçişi',
    fr: 'Intempéries Maritimes & Suspension, Traversée Roulier de Nuweiba',
  },
  'Mean Response Latency': {
    zh: '全系统平均遥测响应时延',
    tr: 'Ortalama Yanıt Gecikmesi',
    fr: 'Latence Moyenne de Réponse',
  },
  'Mecca north bypass checkpoint (H40)': {
    zh: '麦加北部绕城干道大型安检站 (H40)',
    tr: 'Mekke kuzey çevre yolu kontrol noktası (H40)',
    fr: 'Poste de contrôle du contournement nord de La Mecque (H40)',
  },
  'Mesh Sync Latency': {
    zh: '网络同步延迟',
    tr: 'Ağ Senkronizasyon Gecikmesi',
    fr: 'Latence de Synchronisation',
  },
  'Midday Heat Alert, Suez–Cairo Desert Corridor': {
    zh: '正午极端高温橙色预警，苏伊士–开罗沙漠走廊',
    tr: 'Öğle Sıcağı Alarmı, Süveyş–Kahire Çöl Koridoru',
    fr: 'Alerte Canicule de Mi-Journée, Corridor Désertique Suez–Le Caire',
  },
  'Mild 26°C // morning fog risk': {
    zh: '温和 26°C // 晨间局地团雾预警',
    tr: 'Ilıman 26°C // sabah sisi riski',
    fr: 'Doux 26°C // risque de brume matinale',
  },
  'Mis-pick Rate': {
    zh: '拣货差错率',
    tr: 'Hatalı Toplama Oranı',
    fr: 'Taux d\'Erreur de Prélèvement',
  },
  'Modelled figures for the 4 active corridors and the yards along them, at the intervals a standard telematics unit and a monthly cycle count actually report.': {
    zh: '针对 4 条在途重点活跃走廊及沿线场站的数字化推演指标，以标准车载遥测终端及月度循环盘点的真实频次进行实时核算。',
    tr: '4 aktif koridor ve güzergahtaki lojistik sahaları için, standart telematik ünitesi ve aylık döngüsel sayımın bildirdiği aralıklarla modellenen veriler.',
    fr: 'Données modélisées pour les 4 corridors actifs et leurs plateformes, aux intervalles de rapportage réels de la télématique embarquée et des inventaires mensuels.',
  },
  'N wind 32 kt // swell 2.4 m // sailings suspended': {
    zh: '北风风速 32节 // 涌浪浪高 2.4米 // 轮渡航班全线暂停',
    tr: 'Kuzey rüzgarı 32 knot // dalga boyu 2.4 m // seferler askıya alındı',
    fr: 'Vent de nord 32 nœuds // houle 2,4 m // départs maritimes suspendus',
  },
  'NAFEZA pre-arrival declaration with ACID number': {
    zh: '已申报 ACID 认证编号的 Nafeza 到港前电子预报关单',
    tr: 'ACID numarası içeren NAFEZA varış öncesi gümrük beyannamesi',
    fr: 'Déclaration anticipée Nafeza avec numéro d’enregistrement ACID',
  },
  'NETWORK NODES': {
    zh: '走廊骨干关键节点',
    tr: 'LOJİSTİK AĞ DÜĞÜMLERİ',
    fr: 'NŒUDS DU RÉSEAU',
  },
  'NIGHT RUN // -4.5H': {
    zh: '调整为夜间冷运发车 // 挽回 4.5小时',
    tr: 'GECE SÜRÜŞÜ // -4.5 SAAT',
    fr: 'ROTATION DE NUIT // -4.5H',
  },
  'Nafeza single-window synchronisation': {
    zh: '埃及 Nafeza 单一窗口数据同步',
    tr: 'Nafeza tek pencere senkronizasyonu',
    fr: 'Synchronisation guichet unique Nafeza',
  },
  'National customs authorities': {
    zh: '国家联合海关边防署',
    tr: 'Ulusal gümrük idareleri',
    fr: 'Autorités douanières nationales',
  },
  'Net Delay With AI Reroute': {
    zh: 'AI介入后最终净延误',
    tr: 'Müdahale Sonrası Net Gecikme',
    fr: 'Retard Net avec Déroutement',
  },
  'Network': {
    zh: '枢纽网络',
    tr: 'Lojistik Ağı',
    fr: 'Réseau',
  },
  'Network Efficiency': {
    zh: '网络运行综合效率',
    tr: 'Lojistik Ağ Verimliliği',
    fr: 'Efficacité du Réseau',
  },
  'Network Health': {
    zh: '网络综合健康指标',
    tr: 'Lojistik Ağ Sağlığı',
    fr: 'Santé du Réseau',
  },
  'Neural demand forecasting anticipates regional seasonal surges, warehouse capacity shortfalls, and fleet distribution needs 14 days in advance with unmatched precision.': {
    zh: '神经网络需求预测算法提前14天以前所未有的高精度洞悉区域性季节货运高峰、仓储吞吐容量缺口以及干线车队运力调配需求。',
    tr: 'Yapay sinir ağı talep tahmini; bölgesel mevsimsel dalgalanmaları, depo kapasite açıklarını ve filo dağıtım ihtiyaçlarını 14 gün önceden eşsiz bir hassasiyetle öngörür.',
    fr: 'La prévision neuronale de la demande anticipe avec une précision inégalée les pics saisonniers régionaux, les saturations d\'entrepôt et les besoins de réallocation de flotte 14 jours à l\'avance.',
  },
  'New Cairo, Cairo, Egypt': {
    zh: '埃及 开罗 新开罗',
    tr: 'Yeni Kahire, Kahire, Mısır',
    fr: 'Nouveau Caire, Le Caire, Égypte',
  },
  'New Urban Communities Authority zone': {
    zh: '新城市社区管理局特设物流园区',
    tr: 'Yeni Kentsel Topluluklar İdaresi bölgesi',
    fr: 'Zone de l’Autorité des Nouvelles Communautés Urbaines',
  },
  'Next-generation land freight intelligence and autonomous smart warehousing supply chain command.': {
    zh: '下一代陆运货运智能中枢与自主无人智能仓储供应链指挥调度系统。',
    tr: 'Yeni nesil kara taşımacılığı istihbaratı ve otonom akıllı depolama tedarik zinciri komutası.',
    fr: 'Plateforme d’intelligence de fret terrestre nouvelle génération et commandement supply chain d’entreposage autonome.',
  },
  'No account is required and no personal information is requested at any point. An address entered into the bulletin form opens a pre-addressed draft in your own mail application; nothing is transmitted to a server from this page.': {
    zh: '无需注册任何账户，任何环节都不会索取个人敏感信息。订阅表单仅在您的本机调用默认邮件客户端生成草稿，不会通过网页端向外部服务器回传数据。',
    tr: 'Hiçbir aşamada hesap açmanız gerekmez ve kişisel bilgi talep edilmez. Bülten formuna girilen adres kendi e-posta uygulamanızda önceden doldurulmuş bir taslak açar; bu sayfadan hiçbir sunucuya veri aktarılmaz.',
    fr: 'Aucune création de compte n’est requise. Toute adresse saisie pour les bulletins ouvre directement un brouillon prérempli dans votre messagerie locale sans aucun transfert de données vers un serveur.',
  },
  'No fuel burnt on the quay, departure moves by a day': {
    zh: '完全规避码头排队油耗与司乘损耗，发车计划平稳延后一天',
    tr: 'Rıhtımda gereksiz yakıt yakılmaz, hareket bir gün sonraya planlanır',
    fr: 'Zéro consommation inutile de carburant à quai, départ reprogrammé le lendemain',
  },
  'Nodes Synchronized': {
    zh: '个节点已完成同步',
    tr: 'Senkronize Düğüm',
    fr: 'Nœuds Synchronisés',
  },
  'Northerly winds in the Gulf of Aqaba suspend Ro-Ro sailings. Trucks already through Egyptian exit formalities hold in the marshalling yard, the next available sailing is oversubscribed, and reefer loads burn fuel on the quay while they wait.': {
    zh: '阿卡巴湾持续强劲北风导致滚装轮渡全线停航。已办结埃及出境清关手续的重卡滞留于码头编组场，下一班轮渡舱位严重超额，待渡冷藏车在码头持续消耗燃油发电保冷。',
    tr: 'Akabe Körfezi’ndeki şiddetli kuzey rüzgarları Ro-Ro seferlerinin askıya alınmasına yol açtı. Mısır çıkış gümrüğünü tamamlayan tırlar sahada bekletiliyor, ilk sefer aşırı dolu ve frigorifik araçlar rıhtımda beklerken yakıt tüketiyor.',
    fr: 'De violents vents du nord dans le golfe d’Aqaba suspendent les traversées roulières. Les camions ayant accompli les formalités égyptiennes sont bloqués sur le terre-plein, le prochain départ est saturé et les groupes frigo consomment du carburant à quai.',
  },
  'Nuweiba Port, Ro-Ro berth and truck marshalling yard': {
    zh: '努韦巴海港，滚装船泊位与重载货车集结编组堆场',
    tr: 'Nuveybe Limanı, Ro-Ro yanaşma yeri ve tır park sahası',
    fr: 'Port de Nuweiba, quai roulier et terre-plein d’attente des poids lourds',
  },
  'Nuweiba Ro-Ro Crossing': {
    zh: '努韦巴跨海滚装轮渡通道',
    tr: 'Nuveybe Ro-Ro Sınır Geçişi',
    fr: 'Traversée Roulier de Nuweiba',
  },
  'Nuweiba Ro-Ro ferry, then Saudi Highway 5 and Highway 65': {
    zh: '努韦巴跨红海滚装轮渡衔接沙特 5 号及 65 号国家高速',
    tr: 'Nuveybe Ro-Ro feribotu, ardından Suudi 5 ve 65 numaralı Otoyolları',
    fr: 'Ferry roulier de Nuweiba, puis autoroutes saoudiennes 5 et 65',
  },
  'Nuweiba–Aqaba ferry crossing': {
    zh: '努韦巴–阿卡巴跨国跨海轮渡航线',
    tr: 'Nuveybe–Akabe feribot geçişi',
    fr: 'Traversée maritime par transbordeur Nuweiba–Aqaba',
  },
  'OPTIMAL LOAD FREIGHT': {
    zh: '最佳载货运行状态',
    tr: 'OPTİMAL YÜK KAPASİTESİ',
    fr: 'CHARGE DE FRET OPTIMALE',
  },
  'Ocean Gateway': {
    zh: '远洋深水港出海门户',
    tr: 'Deniz Aşırı Ağ Geçidi',
    fr: 'Passerelle Maritime',
  },
  'One shipment record across the Egyptian road network — booking, bill of lading, container, truck plate, gate pass and ACID resolved to a single identity, with turn times tracked on the Sokhna–Alexandria, 30th of June Axis and Regional Ring Road corridors.': {
    zh: '贯穿埃及干线公路网络的单一统一数字运单：订舱单、提单、集装箱号、车牌号、港口出入闸条码与ACID申报号汇聚于唯一数字身份，全程精准追踪苏赫奈–亚历山大、6月30日枢纽轴线及大开罗区域环线的高效周转时效。',
    tr: 'Mısır karayolu ağı genelinde tek sevkiyat kaydı: Rezervasyon, konşimento, konteyner, çekici plakası, kapı geçiş kartı ve ACID numarası tek bir dijital kimlikte çözümlenir; Ayn Sokhna–İskenderiye, 30 Haziran Aksı ve Bölgesel Çevre Yolu koridorlarında dönüş süreleri anlık izlenir.',
    fr: 'Dossier d\'expédition unifié sur tout le réseau routier égyptien : réservation, connaissement, conteneur, immatriculation camion, laissez-passer de porte et ACID fusionnés en une identité unique, avec suivi des temps de rotation sur les corridors Sokhna–Alexandrie, Axe du 30 Juin et Rocade Régionale.',
  },
  'Open YASLOGIST Air': {
    zh: '进入 YASLOGIST 航空货运平台',
    tr: 'YASLOGIST Air Sistemini Aç',
    fr: 'Ouvrir YASLOGIST Air',
  },
  'Open YASLOGIST Ocean': {
    zh: '进入 YASLOGIST 远洋海运平台',
    tr: 'YASLOGIST Ocean Sistemini Aç',
    fr: 'Ouvrir YASLOGIST Ocean',
  },
  'Opening your mail app to confirm…': {
    zh: '正在打开您的默认邮件客户端确认订阅…',
    tr: 'Onay için e-posta uygulamanız açılıyor…',
    fr: 'Ouverture de votre messagerie pour confirmation…',
  },
  'Operational Architecture in Action': {
    zh: '运行中的陆运工程级操作系统',
    tr: 'Operasyonel Mimari Sahada',
    fr: 'Architecture Opérationnelle en Action',
  },
  'Operational Excellence in Numbers': {
    zh: '以数字印证工程级卓越运营',
    tr: 'Rakamlarla Operasyonel Mükemmellik',
    fr: 'L’Excellence Opérationnelle en Chiffres',
  },
  'Operational nodes across Egypt and Saudi Arabia monitored with live gate queues and weather telemetry.': {
    zh: '全方位监控覆盖埃及和沙特阿拉伯的重点枢纽节点，实时采集闸口排队负荷与道路微气象遥测。',
    tr: 'Mısır ve Suudi Arabistan genelinde kapı kuyrukları ve meteoroloji telemetrisiyle anlık izlenen operasyonel düğümler.',
    fr: 'Nœuds opérationnels surveillés en direct à travers l’Égypte et l’Arabie Saoudite, avec files d’attente aux portes et télémétrie météo.',
  },
  'Optical Character Recognition (OCR)': {
    zh: '光学字符自动识别(OCR)',
    tr: 'Optik Karakter Tanıma (OCR)',
    fr: 'Reconnaissance Optique de Caractères (OCR)',
  },
  'Optimal Routes': {
    zh: '已生成最优路径',
    tr: 'Optimal Rotalar',
    fr: 'Itinéraires Optimaux',
  },
  'Oversized Industrial & Construction Machinery': {
    zh: '超大超重重型工业装备与工程机械',
    tr: 'Ağır Sanayi ve İnşaat Ekipmanları',
    fr: 'Équipements Industriels Lourds & Engins de Chantier',
  },
  'Overview': {
    zh: '走廊概览',
    tr: 'Genel Bakış',
    fr: 'Aperçu',
  },
  'PHASE 01: SMART WAREHOUSING': {
    zh: '第一阶段：智能现代立体仓储',
    tr: '1. AŞAMA: AKILLI DEPOLAMA',
    fr: 'PHASE 01 : ENTREPOSAGE INTELLIGENT',
  },
  'PHASE 02: DOCK LOADING & SEAL': {
    zh: '第二阶段：月台装卸与电子铅封',
    tr: '2. AŞAMA: RAMPA YÜKLEME VE MÜHÜR',
    fr: 'PHASE 02 : CHARGEMENT & SCELLAGE À QUAI',
  },
  'PHASE 03: HEAVY FREIGHT ROUTING': {
    zh: '第三阶段：重载干线智能路由',
    tr: '3. AŞAMA: AĞIR YÜK GÜZERGAHI',
    fr: 'PHASE 03 : ROUTAGE DE FRET LOURD',
  },
  'PLATFORM FOUNDER': {
    zh: '平台创始人',
    tr: 'PLATFORM KURUCUSU',
    fr: 'FONDATEUR DE LA PLATEFORME',
  },
  'PREDICTIVE LAND LOGISTICS DIGITAL TWIN': {
    zh: '预见性陆运物流数字孪生仿真台',
    tr: 'ÖNGÖRÜCÜ KARA LOJİSTİĞİ DİJİTAL İKİZİ',
    fr: 'JUMEAU NUMÉRIQUE PRÉDICTIF DE LOGISTIQUE TERRESTRE',
  },
  'PROTOCOL-BADR-STAGING-04': {
    zh: '应急预案：巴德尔前置分流-04',
    tr: 'PROTOKOL-BADR-BEKLEME-04',
    fr: 'PROTOCOLE-PARC-BADR-04',
  },
  'PROTOCOL-BONDED-COLD-09': {
    zh: '应急预案：保税冷库暂避-09',
    tr: 'PROTOKOL-GUMRUK-SOGUK-09',
    fr: 'PROTOCOLE-FRIGO-SOUS-DOUANE-09',
  },
  'PROTOCOL-NATRUN-HOLD-02': {
    zh: '应急预案：纳特隆驻车等待-02',
    tr: 'PROTOKOL-NATRUN-BEKLEME-02',
    fr: 'PROTOCOLE-NATRUN-ATTENTE-02',
  },
  'PROTOCOL-NIGHT-GATE-05': {
    zh: '应急预案：夜间错峰闸口-05',
    tr: 'PROTOKOL-GECE-KAPI-05',
    fr: 'PROTOCOLE-PORTE-NUIT-05',
  },
  'PROTOCOL-ORIGIN-HOLD-11': {
    zh: '应急预案：始发基地驻守-11',
    tr: 'PROTOKOL-CIKIS-BEKLETME-11',
    fr: 'PROTOCOLE-RETENTION-ORIGINE-11',
  },
  'PROTOCOL-PRECOOL-NIGHT-07': {
    zh: '应急预案：深度预冷夜运-07',
    tr: 'PROTOKOL-ON-SOGUTMA-GECE-07',
    fr: 'PROTOCOLE-REFROIDISSEMENT-NUIT-07',
  },
  'PROTOCOL-REBOOK-SAILING-10': {
    zh: '应急预案：改签首班复航-10',
    tr: 'PROTOKOL-YENI-SEFER-10',
    fr: 'PROTOCOLE-NOUVELLE-TRAVERSEE-10',
  },
  'PROTOCOL-REEFER-GENSET-03': {
    zh: '应急预案：冷链发电保障-03',
    tr: 'PROTOKOL-SOGUK-JENERATOR-03',
    fr: 'PROTOCOLE-GENERATEUR-FRIGO-03',
  },
  'PROTOCOL-REEFER-PRIORITY-06': {
    zh: '应急预案：冷链优先通关-06',
    tr: 'PROTOKOL-SOGUK-ONCELIK-06',
    fr: 'PROTOCOLE-FRIGO-PRIORITAIRE-06',
  },
  'PROTOCOL-RING-ROAD-REROUTE-01': {
    zh: '应急预案：区域环线重路由-01',
    tr: 'PROTOKOL-RING-ROAD-REROUTE-01',
    fr: 'PROTOCOLE-ROCADE-DEROUTEMENT-01',
  },
  'PROTOCOL-SHORE-POWER-12': {
    zh: '应急预案：码头岸电保冷-12',
    tr: 'PROTOKOL-SAHIL-ELEKTRIK-12',
    fr: 'PROTOCOLE-ALIMENTATION-QUAI-12',
  },
  'PROTOCOL-THROUGH-RUN-08': {
    zh: '应急预案：环线直通加注-08',
    tr: 'PROTOKOL-DURAKSIZ-08',
    fr: 'PROTOCOLE-DIRECT-ROCADES-08',
  },
  'Pallet sortation at the cross-dock, bypass routing when a chokepoint backs up, and pre-arrival filing — NAFEZA/ACID on Egyptian legs, Bayan via FASAH on Saudi legs — so clearance starts before the truck reaches the gate.': {
    zh: '越库分拨托盘全自动分拣、拥堵节点智能绕行决策与预申报对接（埃及段NAFEZA/ACID集成，沙特段FASAH/Bayan申报），确保车辆抵闸前即已启动海关电子核放。',
    tr: 'Cross-dock sahasında palet ayrıştırma, darboğazlarda alternatif rota yönlendirmesi ve varış öncesi gümrük bildirimi — Mısır etaplarında NAFEZA/ACID, Suudi etaplarında FASAH üzerinden Bayan — böylece tır kapıya ulaşmadan gümrükleme başlar.',
    fr: 'Tri de palettes au cross-dock, itinéraires de contournement en cas de goulet d\'étranglement et téléprocédures anticipées — NAFEZA/ACID pour l\'Égypte, Bayan via FASAH pour l\'Arabie — pour que le dédouanement débute avant la barrière d\'accès.',
  },
  'Payload Weight': {
    zh: '单车装载吨位',
    tr: 'Faydalı Yük Ağırlığı',
    fr: 'Poids de Charge Utile',
  },
  'Phase 01 // Smart Warehousing': {
    zh: '第一阶段 // 智能立体仓储',
    tr: 'Aşama 01 // Akıllı Depolama',
    fr: 'Phase 01 // Entreposage Intelligent',
  },
  'Phase 02 // Autonomous Fleet': {
    zh: '第二阶段 // 自主重载车队',
    tr: 'Aşama 02 // Otonom Filo',
    fr: 'Phase 02 // Flotte Autonome',
  },
  'Phase 02 // Dock Operations': {
    zh: '第二阶段 // 月台智慧作业',
    tr: 'Aşama 02 // Rampa Operasyonları',
    fr: 'Phase 02 // Opérations de Quai',
  },
  'Phase 03 // Arterial Haulage': {
    zh: '第三阶段 // 骨干大动脉重载运输',
    tr: 'Aşama 03 // Ana Arter Taşımacılığı',
    fr: 'Phase 03 // Transport Artériel',
  },
  'Phase 03 // Inland Dry Ports': {
    zh: '第三阶段 // 内陆无水港群',
    tr: 'Aşama 03 // İç Kara Limanları',
    fr: 'Phase 03 // Ports Secs Intérieurs',
  },
  'Phase 1: Smart Warehousing': {
    zh: '第一阶段：智能仓储',
    tr: '1. Aşama: Akıllı Depolama',
    fr: 'Phase 1 : Entreposage Intelligent',
  },
  'Phase 2: Autonomous Fleet': {
    zh: '第二阶段：自主车队',
    tr: '2. Aşama: Otonom Filo',
    fr: 'Phase 2 : Flotte Autonome',
  },
  'Phase 3: Inland Dry Ports': {
    zh: '第三阶段：内陆无水港',
    tr: '3. Aşama: İç Kara Limanları',
    fr: 'Phase 3 : Ports Secs Intérieurs',
  },
  'Plates Scanned': {
    zh: '已扫描车牌',
    tr: 'Taranan Plakalar',
    fr: 'Plaques Numérisées',
  },
  'Platform Capabilities': {
    zh: '核心运力与技术矩阵',
    tr: 'Platform Yetkinlikleri',
    fr: 'Capacités de la Plateforme',
  },
  'Platform Infrastructure': {
    zh: '平台基础设施架构',
    tr: 'Platform Altyapısı',
    fr: 'Infrastructures Plateforme',
  },
  'Platoon V2X': {
    zh: '车队V2X互联',
    tr: 'Müfreze V2X',
    fr: 'Peloton V2X',
  },
  'Please enter a valid email address.': {
    zh: '请输入合规有效的电子邮箱地址。',
    tr: 'Lütfen geçerli bir e-posta adresi girin.',
    fr: 'Veuillez saisir une adresse e-mail valide.',
  },
  'Position at the head of the yard before the berth reopens': {
    zh: '在泊位正式开放前将车队提前编组移动至码头前沿发车道第一梯队',
    tr: 'Rıhtım açılmadan önce aracı park sahasının en önüne yerleştir',
    fr: 'Positionnement en tête de file sur le terre-plein avant réouverture du quai',
  },
  'Position, speed and reefer temperature reported every 30 seconds over the mobile network, with gaps buffered on the unit.': {
    zh: '车载终端每30秒通过蜂窝网络回传高精GPS位置、车速与冷机温度，无信号区域自动进行本地双冗余缓存。',
    tr: 'Konum, hız ve soğutucu sıcaklığı mobil ağ üzerinden her 30 saniyede bir iletilir; sinyal kesintilerinde veriler araç ünitesinde önbelleğe alınır.',
    fr: 'Position, vitesse et température du groupe frigorifique transmises toutes les 30 secondes via le réseau mobile, avec mise en mémoire tampon sur boîtier.',
  },
  'Pre-cool the box and pull the run into the night window': {
    zh: '货箱出库深度预冷至设定下限，干线发车时间全面移至夜间低温时段',
    tr: 'Kasayı önceden soğutun ve seferi gece serinliğine çekin',
    fr: 'Pré-refroidir la caisse et décaler le départ sur la fraîcheur de la nuit',
  },
  'Predictive Analytics': {
    zh: '预见性智能分析',
    tr: 'Öngörücü Analitik',
    fr: 'Analytique Prédictive',
  },
  'Predictive Capacity & Demand Engine': {
    zh: '前瞻性运力与市场需求预测引擎',
    tr: 'Öngörücü Kapasite ve Talep Motoru',
    fr: 'Moteur Prédictif de Capacité & Demande',
  },
  'Priority gate lane for temperature-controlled loads': {
    zh: '为冷链生鲜与恒温货物启用绿色专用快速核放通道',
    tr: 'Sıcaklık kontrollü yükler için öncelikli kapı şeridi',
    fr: 'Voie d’accès prioritaire pour cargaisons sous température dirigée',
  },
  'Privacy Policy': {
    zh: '隐私保护政策',
    tr: 'Gizlilik Politikası',
    fr: 'Politique de Confidentialité',
  },
  'Proceed to 3-Phase Operational Simulation': {
    zh: '进入三阶段陆运全流程数字推演',
    tr: '3 Aşamalı Operasyonel Simülasyona Geç',
    fr: 'Accéder à la Simulation Opérationnelle en 3 Phases',
  },
  'Proprietary machine learning models calculate real-time environmental variables, arterial traffic flows, and inland customs queues to dynamically reroute FTL and LTL freight with zero friction.': {
    zh: '专用机器学习模型实时测算气象环境指标、干线交通流量以及内陆口岸闸口排队动态，零摩擦智能重新规划整车(FTL)与零担(LTL)在途路线。',
    tr: 'Tescilli makine öğrenimi modelleri, FTL ve LTL yüklerini sıfır aksamayla yeniden yönlendirmek için çevresel değişkenleri, ana arter trafik akışlarını ve iç gümrük kuyruklarını anlık olarak hesaplar.',
    fr: 'Des modèles propriétaires de machine learning calculent en temps réel les aléas météo, les flux de trafic et les files d’attente aux douanes pour dérouter sans friction le fret FTL et LTL.',
  },
  'Public dry port concession': {
    zh: '国家特许公私合营无水港',
    tr: 'Kamu imtiyazlı kuru liman',
    fr: 'Concession de port sec public',
  },
  'REBOOKED SAILING // -16H': {
    zh: '抢订首班复航舱位 // 挽回 16小时',
    tr: 'YENİDEN REZERVE EDİLDİ // -16 SAAT',
    fr: 'RÉSERVATION PREMIER DÉPART // -16H',
  },
  'REEFER STABILITY': {
    zh: '冷链温控合格率',
    tr: 'SOĞUK ZİNCİR İSTİKRARI',
    fr: 'STABILITÉ FRIGORIFIQUE',
  },
  'REGIONAL RING ROAD REROUTE // -3.5H': {
    zh: '改道区域环线绕行 // 挽回 3.5小时',
    tr: 'BÖLGESEL ÇEVRE YOLU // -3.5 SAAT',
    fr: 'DÉROUTEMENT ROCADE RÉGIONALE // -3.5H',
  },
  'ROAD FREIGHT VISIBILITY · NAFEZA / ACID INTEGRATED · GATE TO GATE': {
    zh: '公路货运全链路可视 · 深度集成 NAFEZA / ACID · 闸口到闸口',
    tr: 'KARA TAŞIMACILIĞI İZLENEBİLİRLİĞİ · NAFEZA / ACID ENTEGRELİ · KAPIDAN KAPIYA',
    fr: 'VISIBILITÉ FRET ROUTIER · INTÉGRÉ NAFEZA / ACID · DE PORTE À PORTE',
  },
  'ROAD FREIGHT · FTL/LTL · SMART WAREHOUSING': {
    zh: '公路干线货运 · 整车(FTL)与零担(LTL) · 智能仓储履约',
    tr: 'KARA TAŞIMACILIĞI · FTL/LTL · AKILLI DEPOLAMA',
    fr: 'FRET ROUTIER · FTL/LTL · ENTREPOSAGE INTELLIGENT',
  },
  'Rail Ramp Sync': {
    zh: '公铁联运装卸同步',
    tr: 'Demiryolu Rampası Senkronizasyonu',
    fr: 'Synchronisation Rampe Ferroviaire',
  },
  'Real-Time Command': {
    zh: '实时在线指挥控制',
    tr: 'Gerçek Zamanlı Komuta',
    fr: 'Commandement en Temps Réel',
  },
  'Real-Time Telematics & Cargo Integrity': {
    zh: '实时车队车联网与货物完整性监控',
    tr: 'Gerçek Zamanlı Telematik ve Kargo Bütünlüğü',
    fr: 'Télématique Temps Réel & Intégrité du Fret',
  },
  'Real-time': {
    zh: '实时在线',
    tr: 'Gerçek zamanlı',
    fr: 'Temps réel',
  },
  'Real-time node sync and path recalculation stability rate.': {
    zh: '干线节点实时数据同步率与路径重算动态稳定性。',
    tr: 'Gerçek zamanlı düğüm senkronizasyonu ve rota yeniden hesaplama kararlılığı.',
    fr: 'Synchronisation des nœuds en temps réel et taux de stabilité du recalcul des trajets.',
  },
  'Real-time simulation throughput analytics and automated network health telemetry.': {
    zh: '干线吞吐量实时仿真推演与全网健康状态遥测监控。',
    tr: 'Gerçek zamanlı simülasyon hacim analitiği ve otomatik ağ sağlığı telemetrisi.',
    fr: 'Analytique du débit de simulation en temps réel et télémétrie automatisée de la santé du réseau.',
  },
  'Rebook onto the first sailing after the window closes': {
    zh: '优先锁定天气转好风浪平息后的首班复航轮渡舱位',
    tr: 'Fırtına dindikten sonraki ilk seferde öncelikli yer ayırt',
    fr: 'Réservation prioritaire sur la première traversée dès réouverture',
  },
  'Recalibrating network paths...': {
    zh: '正在重新校准走廊最优路径...',
    tr: 'Ağ yolları yeniden kalibre ediliyor...',
    fr: 'Recalibrage des trajets du réseau...',
  },
  'Red Sea Ports Authority / ferry operators': {
    zh: '红海港务局 / 滚装轮渡运营联合体',
    tr: 'Kızıldeniz Limanları İdaresi / feribot işletmecileri',
    fr: 'Autorité des Ports de la Mer Rouge / armateurs de transbordeurs',
  },
  'Red Sea Ports Authority / terminal operators': {
    zh: '红海港务局 / 国际集装箱码头运营商',
    tr: 'Kızıldeniz Limanları İdaresi / terminal işletmecileri',
    fr: 'Autorité des Ports de la Mer Rouge / exploitants de terminaux',
  },
  'Reefer units on genset for the duration of the hold': {
    zh: '驻留期间全程启动发电机组保障冷藏箱持续供电制冷',
    tr: 'Bekleme süresince soğutucu ünitelerin jeneratörden beslenmesi',
    fr: 'Groupes frigorifiques sur générateur autonome pendant toute l’attente',
  },
  'Reefers jump the queue by agreement with the yard operator': {
    zh: '基于与堆场运营商协议，冷藏集装箱车辆优先验票快速过闸',
    tr: 'Saha işletmecisiyle yapılan anlaşma gereği frigorifik yükler öncelikli geçer',
    fr: 'Passage prioritaire des conteneurs frigo selon protocole d’exploitation',
  },
  'Reference Types Stitched': {
    zh: '多维参照类型全流程串联',
    tr: 'Referans Tipleri Eşleştirildi',
    fr: 'Types de Référence Fusionnés',
  },
  'Regional Ring Road reroute to 6th of October Dry Port': {
    zh: '经区域环线智能改道至十月六日城无水港',
    tr: 'Bölgesel Çevre Yolu üzerinden 6 Ekim Kuru Limanına alternatif rota',
    fr: 'Déroutement par la Rocade Régionale vers le Port Sec du 6 Octobre',
  },
  'Regulated Industrial Chemicals (HAZMAT Class 3/8)': {
    zh: '危险化学品受控合规运输 (HAZMAT 3/8类)',
    tr: 'Mevzuata Tabi Endüstriyel Kimyasallar (HAZMAT Sınıf 3/8)',
    fr: 'Produits Chimiques Réglementés (HAZMAT Classe 3/8)',
  },
  'Reroute Latency': {
    zh: '重路由决策时延',
    tr: 'Rota Değişim Gecikmesi',
    fr: 'Latence de Déroutement',
  },
  'Riyadh Dry Port': {
    zh: '利雅得内陆无水港枢纽',
    tr: 'Riyad Kuru Limanı',
    fr: 'Port Sec de Riyad',
  },
  'Riyadh Freight Terminal': {
    zh: '利雅得货运综合枢纽铁路场站',
    tr: 'Riyad Yük Terminali',
    fr: 'Terminal de Fret Ferroviaire de Riyad',
  },
  'Robot Uptime': {
    zh: '机器人作业稳定率',
    tr: 'Robot Çalışma Süresi',
    fr: 'Disponibilité Robots',
  },
  'Robotic Retraction & Seal // Logged': {
    zh: '机器人入位与铅封 // 已完成存证',
    tr: 'Robotik Geri Çekilme ve Mühür // Kaydedildi',
    fr: 'Rétraction Robotisée & Scellé // Enregistré',
  },
  'Robotic Retraction & Seal Logging': {
    zh: '机器人自动入位与锁闭电子存证',
    tr: 'Robotik Geri Çekilme ve Mühür Kaydı',
    fr: 'Rétraction Robotisée & Enregistrement du Scellé',
  },
  'Robots On Task': {
    zh: '正在执行任务机器人',
    tr: 'Görevdeki Robotlar',
    fr: 'Robots en Mission',
  },
  'Routing advanced electric long-haul truck fleets with connected V2X highway platooning and continuous waypoint telemetry.': {
    zh: '基于车路协同V2X公路编队技术与高频航路点连续遥测，智能路由纯电长途重载卡车车队。',
    tr: 'Bağlantılı V2X otoyol müfreze sürüşü ve kesintisiz telemetri ile gelişmiş elektrikli uzun yol tır filolarının yönlendirilmesi.',
    fr: 'Routage de flottes avancées de camions électriques longue distance en peloton V2X avec télémétrie continue.',
  },
  'Run straight through with a fuel stop at the ring road': {
    zh: '保持匀速直达通行，仅在环线指定服务区进行快速补能加油',
    tr: 'Çevre yolunda yakıt ikmali yaparak duraksız yola devam et',
    fr: 'Trajet direct continu avec ravitaillement rapide sur la rocade',
  },
  'SAILINGS SUSPENDED // +26H': {
    zh: '海运轮渡全线停航 // 延误 +26小时',
    tr: 'SEFERLER ASKIYA ALINDI // +26 SAAT',
    fr: 'TRAVERSÉES SUSPENDUES // +26H',
  },
  'SHA-256 Shipment Manifest': {
    zh: 'SHA-256 加密防篡改电子运单存证',
    tr: 'SHA-256 Taşıma Belgesi Özeti',
    fr: 'Manifeste d’Expédition Crypté SHA-256',
  },
  'SHA-256 verifiable chain of custody': {
    zh: 'SHA-256 可独立核验的不可篡改监管链',
    tr: 'SHA-256 ile doğrulanabilir gözetim zinciri',
    fr: 'Chaîne de garde vérifiable par empreinte SHA-256',
  },
  'SYSTEM TELEMETRY & PERFORMANCE': {
    zh: '系统核心遥测与运行效能',
    tr: 'SİSTEM TELEMETRİSİ VE PERFORMANS',
    fr: 'TÉLÉMÉTRIE DU SYSTÈME & PERFORMANCE',
  },
  'Saudi Arabia': {
    zh: '沙特阿拉伯',
    tr: 'Suudi Arabistan',
    fr: 'Arabie Saoudite',
  },
  'Saudi Arabia / Jordan': {
    zh: '沙特阿拉伯 / 约旦',
    tr: 'Suudi Arabistan / Ürdün',
    fr: 'Arabie Saoudite / Jordanie',
  },
  'Saudi Arabia / UAE': {
    zh: '沙特阿拉伯 / 阿联酋',
    tr: 'Suudi Arabistan / BAE',
    fr: 'Arabie Saoudite / EAU',
  },
  'Saudi Highway 10 (Riyadh–Al Kharj–Haradh–Al Batha)': {
    zh: '沙特 10 号大动脉高速 (利雅得–海尔吉–哈拉德–巴哈)',
    tr: 'Suudi 10 Numaralı Otoyolu (Riyad–Al Kharj–Haradh–Al Batha)',
    fr: 'Autoroute Saoudienne 10 (Riyad–Al Kharj–Haradh–Al Batha)',
  },
  'Saudi Highway 40 (Dammam–Al Ahsa–Riyadh)': {
    zh: '沙特 40 号国家高速公路 (达曼–哈萨–利雅得)',
    tr: 'Suudi 40 Numaralı Otoyolu (Dammam–Al Ahsa–Riyad)',
    fr: 'Autoroute Saoudienne 40 (Dammam–Al Ahsa–Riyad)',
  },
  'Saudi Highway 40 (Jeddah–Mecca–Riyadh)': {
    zh: '沙特 40 号国家大动脉 (吉达–麦加–利雅得)',
    tr: 'Suudi 40 Numaralı Otoyolu (Cidde–Mekke–Riyad)',
    fr: 'Autoroute Saoudienne 40 (Djeddah–La Mecque–Riyad)',
  },
  'Saudi Highway 5 coastal trunk (Jeddah–Yanbu–Al Wajh), then the Tabuk–Haql road': {
    zh: '沙特 5 号沿海红海走廊 (吉达–延布–瓦吉赫)，接塔布克–哈克勒干线',
    tr: 'Suudi 5 Numaralı Sahil Yolu (Cidde–Yanbu–Al Wajh), ardından Tebük–Haql yolu',
    fr: 'Axe côtier saoudien 5 (Djeddah–Yanbu–Al Wajh), puis route Tabuk–Haql',
  },
  'Saudi Ports Authority (Mawani) / terminal operators': {
    zh: '沙特港务总局 (Mawani) / 专业码头运营商',
    tr: 'Suudi Limanlar İdaresi (Mawani) / terminal operatörleri',
    fr: 'Autorité Portuaire Saoudienne (Mawani) / opérateurs de terminaux',
  },
  'Scroll to Advance Video': {
    zh: '滑动屏幕推进全景演示',
    tr: 'Videoyu İlerletmek İçin Kaydırın',
    fr: 'Faites Défiler pour Avancer la Vidéo',
  },
  'Sea breeze 25°C // humidity 58%': {
    zh: '海风宜人 25°C // 湿度 58%',
    tr: 'Deniz esintisi 25°C // nem %58',
    fr: 'Brise marine 25°C // humidité 58%',
  },
  'Sea breeze 31°C // humidity 68%': {
    zh: '海风 31°C // 湿度 68%',
    tr: 'Deniz esintisi 31°C // nem %68',
    fr: 'Brise marine 31°C // humidité 68%',
  },
  'Seamless synchronization between highways and smart cross-docks': {
    zh: '干线公路与智慧越库枢纽之间无缝协同对接',
    tr: 'Karayolları ve akıllı aktarma merkezleri arasında kesintisiz senkronizasyon',
    fr: 'Synchronisation fluide entre axes autoroutiers et hubs cross-dock intelligents',
  },
  'Seasonal Morning Fog, Cairo–Alexandria Desert Road': {
    zh: '季节性晨间大雾团，开罗–亚历山大沙漠公路',
    tr: 'Mevsimsel Sabah Sisi, Kahire–İskenderiye Çöl Yolu',
    fr: 'Brouillard Matinal Saisonnier, Route du Désert Le Caire–Alexandrie',
  },
  'Security': {
    zh: '网络安全体系',
    tr: 'Güvenlik',
    fr: 'Sécurité',
  },
  'Select AI Autonomous Contingency Protocol': {
    zh: '选择AI自主应急处置协议',
    tr: 'Otonom Acil Durum Protokolünü Seçin',
    fr: 'Sélectionner le Protocole d\'Urgence Autonome IA',
  },
  'Select Corridor': {
    zh: '选择重点运输走廊',
    tr: 'Taşımacılık Koridoru Seçin',
    fr: 'Sélectionner le Corridor',
  },
  'Select Language': {
    zh: '选择语言',
    tr: 'Dil Seçin',
    fr: 'Choisir la Langue',
  },
  'Select Transport Mode': {
    zh: '选择运输装备类型',
    tr: 'Taşıma Modunu Seçin',
    fr: 'Sélectionner le Mode de Transport',
  },
  'Sensor Precision': {
    zh: '传感器探测精度',
    tr: 'Sensör Hassasiyeti',
    fr: 'Précision Capteur',
  },
  'Set point reached before loading, temperature logged every 5 minutes': {
    zh: '装货前确保冷厢达到设定温度，行车途中每 5 分钟自动上报温湿度指标',
    tr: 'Yüklemeden önce hedef dereceye ulaşılır, sıcaklık 5 dakikada bir kaydedilir',
    fr: 'Température de consigne atteinte avant chargement, suivi toutes les 5 min',
  },
  'Several vessels discharge at Ain Sokhna inside the same window, so the trucks they generate all reach the dry port gate on the same afternoon. The staging yard fills, the queue spills onto the approach road, and drivers who arrived on their booked slot wait behind trucks that did not.': {
    zh: '多艘集装箱货轮在同一时间窗口集中靠泊苏赫奈港卸船，所生成的陆运重卡同时在午后涌向无水港入闸口。导致缓冲堆场饱和，车流蔓延倒灌至外部引桥，严格按预约到场的货车被迫与无预约车辆共同排队滞留。',
    tr: 'Ayn Sokhna Limanında aynı zaman aralığında birden fazla gemi tahliyesi yapıldığında, yönlendirilen tüm tırlar aynı öğleden sonra kuru liman kapısına yığılır. Park sahası dolar, kuyruk bağlantı yoluna taşar ve randevusuna sadık sürücüler randevusuz araçların ardında beklemek zorunda kalır.',
    fr: 'Le déchargement simultané de plusieurs navires à Ain Sokhna concentre les flux de camions vers le port sec au même moment. Le parc sature, la file déborde sur la voie d’accès et les camions ponctuels sont bloqués par les retardataires.',
  },
  'Shift the arrival to the night gate window': {
    zh: '将进港到达时段平移调整至夜间低峰放行窗口',
    tr: 'Giriş saatini gece kapı açılış penceresine kaydır',
    fr: 'Report de l’arrivée sur le créneau d’accès nocturne',
  },
  'Shock & Humidity Monitored': {
    zh: '振动冲击与湿度全时严密监测',
    tr: 'Darbe ve Nem Sensörlü Takip',
    fr: 'Surveillance Chocs & Humidité',
  },
  'Shore power for reefers in the marshalling yard': {
    zh: '在码头重载集结堆场直接接入工业级岸电为冷机供电',
    tr: 'Park sahasında frigorifik araçlar için sahil elektriği bağlantısı',
    fr: 'Raccordement électrique à quai pour les unités frigo en attente',
  },
  'Shortest elapsed time, highest genset load on the trailer': {
    zh: '全程运行耗时最短，但半挂机组发电机处于最大负荷状态',
    tr: 'En kısa varış süresi, ancak römork üzerindeki jeneratör maksimum yük altında çalışır',
    fr: 'Délai d’acheminement le plus court, sollicitation maximale du groupe embarqué',
  },
  'Simulated': {
    zh: '数字推演',
    tr: 'Simülasyon',
    fr: 'Simulation',
  },
  'Simulated Fleet Units': {
    zh: '在途数字仿真车队单元',
    tr: 'Simüle Edilen Filo Birimleri',
    fr: 'Unités de Flotte Simulées',
  },
  'Simulated Grid Load': {
    zh: '模拟干线负荷率',
    tr: 'Simüle Edilmiş Ağ Yükü',
    fr: 'Charge Réseau Simulée',
  },
  'Slot Adherence': {
    zh: '装卸泊位遵守率',
    tr: 'Slot Uyum Oranı',
    fr: 'Respect du Créneau',
  },
  'Smart Distribution Hubs & Cold-Chain Warehousing': {
    zh: '智能分拨中心与高精密冷链温控仓储',
    tr: 'Akıllı Dağıtım Merkezleri ve Soğuk Zincir Depolama',
    fr: 'Hubs de Distribution Intelligents & Entreposage Frigorifique',
  },
  'Smart Logistics Centers': {
    zh: '智能供应链物流中心',
    tr: 'Akıllı Lojistik Merkezleri',
    fr: 'Centres Logistiques Intelligents',
  },
  'Smart Warehouse & Staging Matrix': {
    zh: '智慧立体仓储与分拨集拼矩阵',
    tr: 'Akıllı Depolama ve Sıralama Matrisi',
    fr: 'Entrepôt Intelligent & Matrice de Tri',
  },
  'Social channels': {
    zh: '官方社交渠道',
    tr: 'Sosyal Medya',
    fr: 'Réseaux Sociaux',
  },
  'Sort Backlog': {
    zh: '分拣待处理队列',
    tr: 'Sıralama İş Listesi',
    fr: 'File de Tri en Attente',
  },
  'Standard Palletized FMCG & Retail Goods': {
    zh: '标准托盘化快消品(FMCG)与商超零售物资',
    tr: 'Standart Paletli Hızlı Tüketim ve Perakende Malları',
    fr: 'Produits de Grande Consommation (FMCG) sur Palettes',
  },
  'Strategic Inland Ports & Cross-Dock Hubs': {
    zh: '战略级内陆无水港与智能越库中心',
    tr: 'Stratejik İç Kara Limanları ve Cross-Dock Merkezleri',
    fr: 'Ports Secs Stratégiques & Hubs Cross-Dock',
  },
  'Sub-30s satellite & cellular ping intervals': {
    zh: '30秒级卫星与蜂窝双模低延迟通信',
    tr: '30 saniyenin altında uydu ve hücresel veri aralığı',
    fr: 'Intervalles de ping satellite et cellulaire inférieurs à 30s',
  },
  'Sub-second dynamic transit re-optimization': {
    zh: '亚秒级干线在途动态重算与优化',
    tr: 'Saniyeden kısa sürede dinamik transit optimizasyonu',
    fr: 'Réoptimisation dynamique du transit en une fraction de seconde',
  },
  'Subscribe': {
    zh: '立即订阅',
    tr: 'Abone Ol',
    fr: 'S’abonner',
  },
  'Subscribe to receive real-time autonomous routing bulletins and dispatch network health digests.': {
    zh: '订阅获取最新干线智能重算公告、走廊通行状态及网络健康态势简报。',
    tr: 'Gerçek zamanlı otonom rota bültenlerini ve lojistik ağ sağlığı özetlerini almak için abone olun.',
    fr: 'Abonnez-vous pour recevoir nos bulletins de routage autonome et les bilans de santé du réseau en temps réel.',
  },
  'Suez Road tollgate and checkpoint': {
    zh: '苏伊士路主线收费站及联合执法检查站',
    tr: 'Süveyş Yolu gişeleri ve kontrol noktası',
    fr: 'Péage et poste de contrôle de la route de Suez',
  },
  'Suez–Cairo Desert Road, Regional Ring Road': {
    zh: '苏伊士–开罗沙漠高速公路与区域大环线',
    tr: 'Süveyş–Kahire Çöl Yolu, Bölgesel Çevre Yolu',
    fr: 'Route du Désert Suez–Le Caire, Rocade Régionale',
  },
  'Suez–Cairo Desert Road, open desert section': {
    zh: '苏伊士–开罗沙漠公路，旷野沙漠开阔路段',
    tr: 'Süveyş–Kahire Çöl Yolu, açık çöl bölümü',
    fr: 'Route du Désert Suez–Le Caire, tronçon désertique découvert',
  },
  'Sunny 30°C // pavement 34°C': {
    zh: '晴空 30°C // 路面温度 34°C',
    tr: 'Güneşli 30°C // asfalt sıcaklığı 34°C',
    fr: 'Ensoleillé 30°C // revêtement 34°C',
  },
  'Supply Chain & Logistics Specialist': {
    zh: '供应链与国际物流高级专家',
    tr: 'Tedarik Zinciri ve Lojistik Uzmanı',
    fr: 'Spécialiste de la Supply Chain & de la Logistique',
  },
  'Synchronized Aerodynamic Convoy': {
    zh: '空气动力学自适应协同车队',
    tr: 'Senkronize Aerodinamik Konvoy',
    fr: 'Convoi Aérodynamique Synchronisé',
  },
  'Synchronized Hubs': {
    zh: '已全域同步的骨干枢纽',
    tr: 'Senkronize Edilmiş Lojistik Merkezleri',
    fr: 'Hubs Synchronisés',
  },
  'System Telemetry & Stats': {
    zh: '全系统遥测与运行统计',
    tr: 'Sistem Telemetrisi ve İstatistikler',
    fr: 'Télémétrie Système & Statistiques',
  },
  'System record against physical count, reconciled monthly. The gap is where a pallet moved without a scan.': {
    zh: '系统账面记录与物理货位实物定期月度复核核销；微小误差仅源自未及时触发条码扫描的货位移位。',
    tr: 'Sistem kaydı ile fiziksel sayım aylık olarak mutabakat edilir. Aradaki fark yalnızca barkod taraması yapılmadan hareket ettirilen paletleri gösterir.',
    fr: 'Rapprochement mensuel entre les écritures du système et le comptage physique. L’écart identifie les rares mouvements de palettes sans scan préalable.',
  },
  'TELEMETRY SYNC': {
    zh: '车联网遥测数据上报同步',
    tr: 'TELEMETRİ SENKRONİZASYONU',
    fr: 'SYNCHRONISATION TÉLÉMÉTRIQUE',
  },
  'TERRESTRIAL ARCHITECTURE // ROAD FREIGHT & WAREHOUSING': {
    zh: '陆地骨干架构 // 公路货运与智能仓储',
    tr: 'KARA MİMARİSİ // KARAYOLU TAŞIMACILIĞI VE DEPOLAMA',
    fr: 'ARCHITECTURE TERRESTRE // FRET ROUTIER & ENTREPOSAGE',
  },
  'TGA freight operating card (بطاقة تشغيل) for vehicles on Saudi roads': {
    zh: '沙特交通总局 (TGA) 核发之在沙营运车辆商业准运卡 (بطاقة تشغيل)',
    tr: 'Suudi karayollarındaki araçlar için TGA yük taşıma işletme kartı (بطاقة تشغيل)',
    fr: 'Carte d’exploitation de transport de fret TGA (بطاقة تشغيل) pour les routes saoudiennes',
  },
  'TIR carnet with GCC transit manifest': {
    zh: '国际公路运输公约 (TIR) 单证与海湾海关 (GCC) 过境舱单',
    tr: 'KİK transit manifestosu ekli TIR karnesi',
    fr: 'Carnet TIR avec manifeste de transit douanier du CCG',
  },
  'TOTAL PAYLOAD': {
    zh: '总计在运载荷',
    tr: 'TOPLAM YÜK KAPASİTESİ',
    fr: 'CHARGE UTILE TOTALE',
  },
  'TRANSIT ACCURACY': {
    zh: '时效达成准点率',
    tr: 'VARIŞ DOĞRULUĞU',
    fr: 'PRÉCISION DE TRANSIT',
  },
  'Telemetry Command': {
    zh: '全局遥测指挥控制',
    tr: 'Telemetri Komuta Merkezi',
    fr: 'Commandement Télémétrique',
  },
  'Temperature logged every 5 minutes, driver alerted on excursion': {
    zh: '每 5 分钟自动记录冷机温度，温度一旦偏离设定区间即刻声光预警驾驶员',
    tr: 'Her 5 dakikada bir sıcaklık kaydedilir, eşik aşıldığında sürücüye uyarı verilir',
    fr: 'Température consignée toutes les 5 min, alerte conducteur en cas d’anomalie',
  },
  'Temperature-Controlled Cold-Chain (Food & Pharma)': {
    zh: '恒温精准冷链运输 (食品与高价值医药)',
    tr: 'Sıcaklık Kontrollü Soğuk Zincir (Gıda ve İlaç)',
    fr: 'Chaîne du Froid Thermorégulée (Agroalimentaire & Pharma)',
  },
  'Terms of Service': {
    zh: '服务条款',
    tr: 'Hizmet Şartları',
    fr: 'Conditions d’Utilisation',
  },
  'The ACID issued on the Nafeza single window is carried on the shipment record from booking onward, so a declaration still open when the truck reaches the gate is visible before the truck is dispatched, not after it queues.': {
    zh: '在 Nafeza 单一窗口申请生成的 ACID 编号从订舱起即绑定至单批运单，若车辆抵闸时报关状态尚未关闭，调度系统在发车前便能清晰预警，彻底告别闸口盲目滞留排队。',
    tr: 'Nafeza tek penceresinden alınan ACID numarası rezervasyondan itibaren sevkiyat kaydına işlenir; böylece tır kapıya ulaştığında henüz açık olan bir beyanname, tır sıraya girdikten sonra değil daha yola çıkmadan tespit edilir.',
    fr: 'Le numéro ACID délivré sur le guichet unique Nafeza est rattaché au dossier dès la réservation : toute déclaration en suspens est détectée avant le départ du camion, évitant l’attente stérile à la barrière.',
  },
  'The YASLOGIST name, mark and interface are the work of the platform founder. Please request permission before reproducing them.': {
    zh: 'YASLOGIST 的品牌名称、注册商标及交互界面均为平台创始人的原创智力成果。在任何第三方复制或转引前，请务必获得官方正式授权。',
    tr: 'YASLOGIST adı, ticari markası ve arayüzü platform kurucusunun tescilli eseridir. Yeniden kullanmadan veya çoğaltmadan önce lütfen izin talep edin.',
    fr: 'Le nom, la marque et l’interface de YASLOGIST sont la propriété exclusive du fondateur. Toute reproduction requiert une autorisation écrite préalable.',
  },
  'The only values stored on your device are two local preferences — your chosen theme and language — kept in your browser’s local storage so the site remembers them on your next visit. They never leave your device and are cleared when you clear site data.': {
    zh: '保存在您设备上的唯一数据是两项本地偏好设置——您所选的主题模式与显示语言——它们安全保存在浏览器的 LocalStorage 中以便下次访问时生效。这些数据绝不会回传服务器，并在清除浏览器缓存时自动销毁。',
    tr: 'Cihazınızda saklanan tek değer iki yerel tercihtir — seçtiğiniz tema ve dil — sitenin sonraki ziyaretinizde bunları hatırlaması için tarayıcınızın yerel depolama alanında tutulur. Asla cihazınızın dışına çıkmaz ve site verilerini temizlediğinizde silinir.',
    fr: 'Les seules informations stockées localement sont vos préférences d’affichage (thème et langue) dans le stockage local de votre navigateur. Elles ne quittent jamais votre appareil et disparaissent à l’effacement des données de navigation.',
  },
  'The platform is a static front-end. There is no backend, no database and no user session, so there is no stored personal data to breach.': {
    zh: '本平台为高安全级静态前端架构。没有持久化后端、数据库或用户会话系统，因此从物理架构上杜绝了任何个人数据泄露的可能性。',
    tr: 'Platform tamamen statik bir ön uçtur. Arka uç, veritabanı veya kullanıcı oturumu yoktur; dolayısıyla ihlal edilebilecek saklanmış bir kişisel veri bulunmaz.',
    fr: 'La plateforme repose sur une architecture statique côté client, sans serveur applicatif ni base de données, éliminant tout risque de fuite de données personnelles.',
  },
  'The telemetry, dispatch and disruption visuals are presentation models illustrating how an instrumented land corridor would behave. They connect to no live fleet and command no real vehicle.': {
    zh: '网站呈现的遥测数据、调度推演和突发事件视觉交互均为技术仿真模型，旨在演示智能化数字陆运走廊的运作逻辑。它们未接入真实物理车队，亦不直接指挥实体运输车辆。',
    tr: 'Görüntülenen telemetri, sevkiyat ve kriz görselleri, donanımlı bir karayolu koridorunun nasıl çalışacağını gösteren tanıtım modelleridir. Hiçbir canlı filoya bağlı değildir ve gerçek araçlara komut vermez.',
    fr: 'Les visualisations de télémétrie, de dépêche et d’incidents sont des modèles illustrant le comportement d’un corridor terrestre connecté, sans prise de commande sur des véhicules réels.',
  },
  'This site collects nothing. There are no analytics scripts, no advertising trackers, no cookies and no third-party embeds that profile you.': {
    zh: '本平台不收集任何个人隐私数据。绝无任何统计分析脚本、广告追踪器、Cookie或建立用户画像的第三方嵌入式代码。',
    tr: 'Bu site hiçbir veri toplamaz. Kullanıcı profilinizi çıkaracak hiçbir analitik script, reklam izleyici, çerez veya üçüncü taraf eklenti bulunmamaktadır.',
    fr: 'Ce site ne collecte aucune donnée personnelle. Il ne contient aucun script d’analyse, aucun traceur publicitaire, aucun cookie ni composant tiers de profilage.',
  },
  'Throughput Rate': {
    zh: '吞吐流速',
    tr: 'Hacim Akışı',
    fr: 'Taux de Débit',
  },
  'Time-critical & cold-chain pharma expedited transfer through Cairo Cargo Village.': {
    zh: '针对紧急时效件与医药高标准冷链，经由开罗航空货运村(Cairo Cargo Village)实现极速转运。',
    tr: 'Kahire Kargo Köyü üzerinden zamana duyarlı ve soğuk zincir ilaçların ekspres aktarımı.',
    fr: 'Transit express pour fret pharmaceutique et urgent via le village de fret de l’aéroport du Caire.',
  },
  'Token Copied': {
    zh: '凭证已复制',
    tr: 'Belge Kopyalandı',
    fr: 'Jeton Copié',
  },
  'Tons': {
    zh: '吨',
    tr: 'Ton',
    fr: 'Tonnes',
  },
  'Tons/hr': {
    zh: '吨/小时',
    tr: 'Ton/saat',
    fr: 'Tonnes/h',
  },
  'Total Inland Yard': {
    zh: '内陆监管堆场总面积',
    tr: 'Toplam İç Saha Kapasitesi',
    fr: 'Superficie Totale des Parcs',
  },
  'Trades same-day delivery for a queue that has drained': {
    zh: '弹性调整当日交付计划，换取零排队免滞留的高速直接通关',
    tr: 'Kuyruk eriyene kadar bekleyerek sorunsuz ve kesintisiz geçiş sağla',
    fr: 'Décalage de la livraison en échange d’un passage fluide sans attente',
  },
  'Transit Time Recovered': {
    zh: '挽回在途延误时间',
    tr: 'Geri Kazanılan Zaman',
    fr: 'Temps de Transit Récupéré',
  },
  'Transport Mode': {
    zh: '货物运载车型装备',
    tr: 'Taşıma Modu',
    fr: 'Mode de Transport',
  },
  'Truck waits off the approach road instead of in the queue': {
    zh: '车辆在正规专用缓冲场站内安全候泊，彻底避免在公路干道主线违规积压',
    tr: 'Tır yol kenarında kuyrukta beklemek yerine güvenli park sahasında bekler',
    fr: 'Stationnement sécurisé hors des axes routiers plutôt qu’en file sur la chaussée',
  },
  'Turnaround': {
    zh: '平均周转提箱效率',
    tr: 'Araç Dönüş Süresi',
    fr: 'Temps de Rotation',
  },
  'Typical spread on a same-day corridor run. Gate queues and checkpoint holds are the two terms the model cannot pin down.': {
    zh: '同日到达走廊的典型时效波动区间；主要受港口闸口排队及联合执法检查站短时滞留等不可抗力因素影响。',
    tr: 'Aynı gün içinde tamamlanan koridor seferlerindeki tipik sapma payı. Kapı kuyrukları ve kontrol noktası beklemeleri bu değişkenliği belirleyen iki ana etkendir.',
    fr: 'Écart-type habituel sur un trajet de corridor le même jour. Les embouteillages aux portes et les contrôles routiers sont les deux aléas majeurs modélisés.',
  },
  'Unified terrestrial intelligence platform coordinating autonomous truck fleets, automated cross-dock terminals, and smart warehousing matrices across regional freight corridors.': {
    zh: '跨区域货运大动脉统一陆运智慧中枢平台，全面协调自主重载车队、全自动越库分拨中心与智能化立体仓储矩阵。',
    tr: 'Bölgesel yük koridorlarında otonom tır filolarını, otomatik cross-dock terminallerini ve akıllı depolama matrislerini koordine eden birleşik kara lojistiği platformu.',
    fr: 'Plateforme d’intelligence terrestre unifiée coordonnant flottes de camions autonomes, terminaux cross-dock automatisés et matrices d’entreposage intelligent.',
  },
  'Unified terrestrial intelligence platform coordinating autonomous truck fleets, automated high-bay fulfillment, and dry port intermodal operations across Middle East corridors.': {
    zh: '贯通中东重点贸易走廊的统一地面物流智能中枢平台，深度协调自主驾驶卡车车队、高位立体仓自动化履约与内陆无水港多式联运。',
    tr: 'Orta Doğu ticaret koridorlarında otonom tır filolarını, otomatik yüksek irtifa sipariş karşılamayı ve kuru liman intermodal operasyonlarını koordine eden birleşik kara lojistiği platformu.',
    fr: 'Plateforme d’intelligence terrestre unifiée coordonnant les flottes de camions autonomes, le stockage grande hauteur et les opérations intermodales sur les corridors du Moyen-Orient.',
  },
  'Uptime': {
    zh: '系统稳定可用率',
    tr: 'Çalışma Süresi',
    fr: 'Disponibilité Système',
  },
  'V2X Mesh Network Latency': {
    zh: 'V2X车间拓扑网络延迟',
    tr: 'V2X Ağ Gecikmesi',
    fr: 'Latence Réseau V2X',
  },
  'Vented / Thermal Shield': {
    zh: '透气通风 / 高性能隔热温盾',
    tr: 'Havalandırmalı / Termal Kalkanlı',
    fr: 'Ventilé / Bouclier Thermique',
  },
  'Visibility drops below 100 m between roughly 04:00 and 09:00 in the autumn and winter fog season. Traffic authorities impose speed restrictions or close the stretch outright, weighbridge queues back up behind the closure, and inbound trucks miss their booked yard slot at the dry port.': {
    zh: '秋冬大雾多发季节，清晨 04:00 至 09:00 能见度常跌破 100 米。交管部门采取严格限速甚至临时封路管制，导致地磅检测站后方重卡严重拥堵，进港货车错失无水港预约提还箱窗口。',
    tr: 'Sonbahar ve kış aylarında saat 04:00 ile 09:00 arasında görüş mesafesi 100 metrenin altına düşer. Trafik ekipleri hız sınırı getirir veya yolu tamamen kapatır; kantar kuyrukları birikir ve araçlar kuru limandaki rezervasyon pencerelerini kaçırır.',
    fr: 'En automne et hiver, la visibilité chute sous les 100 m entre 04h00 et 09h00. Les autorités ferment le tronçon ou limitent la vitesse, les files au pesage s’allongent et les camions manquent leur créneau au port sec.',
  },
  'Visual overview of YASLOGIST intelligent fulfillment facilities, inland logistics hubs, and connected road assets.': {
    zh: '全景展示 YASLOGIST 智能履约基地、内陆无水港群以及网联干线重运资产的实况运行图景。',
    tr: 'YASLOGIST akıllı sipariş karşılama tesislerinin, iç lojistik merkezlerinin ve bağlantılı karayolu varlıklarının görsel görünümü.',
    fr: 'Aperçu visuel des centres de préparation YASLOGIST, des hubs intérieurs et des flottes connectées en opération.',
  },
  'WAREHOUSING': {
    zh: '智能现代仓储',
    tr: 'DEPOLAMA',
    fr: 'ENTREPOSAGE',
  },
  'Wadi El Natrun rest area and checkpoint': {
    zh: '瓦迪纳特隆大型停车服务区与安检称重点',
    tr: 'Vadi El Natrun dinlenme tesisi ve kontrol noktası',
    fr: 'Aire de repos et poste de contrôle de Wadi El Natrun',
  },
  'Warehouse Robotics': {
    zh: '智能仓储机器人系统',
    tr: 'Depo Robotiği',
    fr: 'Robotique d’Entreposage',
  },
  'YASLOGIST': {
    zh: 'YASLOGIST',
    tr: 'YASLOGIST',
    fr: 'YASLOGIST',
  },
  'YASLOGIST is a supply-chain intelligence platform operated from its corporate branch in New Cairo, Cairo, Egypt.': {
    zh: 'YASLOGIST 是一家国际供应链智能技术平台，由位于埃及开罗新开罗的企业总部直接运营。',
    tr: 'YASLOGIST, kurumsal operasyonlarını Yeni Kahire, Kahire, Mısır’daki merkezinden yürüten bir tedarik zinciri istihbarat platformudur.',
    fr: 'YASLOGIST est une plateforme d’intelligence de la chaîne logistique opérée depuis sa direction à Nouveau Caire, Le Caire, Égypte.',
  },
  'YASLOGIST is not a freight forwarder, a transport operator or a customs broker. We do not move cargo, hold goods or file declarations; those are licensed activities and they belong to your carrier and your broker.': {
    zh: 'YASLOGIST 并非货运代理人、实际运输承运人或海关报关行。我们不直接移动货物、保管商品或代为申报；这些活动均属国家特许资质业务，依法由您的签约承运人和持牌清关行承担。',
    tr: 'YASLOGIST bir navlun komisyoncusu, nakliye operatörü veya gümrük müşaviri değildir. Doğrudan kargo taşımaz, mal depolamaz veya beyanname vermeyiz; bu faaliyetler yasal izne tabi olup anlaşmalı taşıyıcınız ve gümrük müşavirinize aittir.',
    fr: 'YASLOGIST n’est ni transitaire, ni transporteur, ni commissionnaire en douane. Nous ne transportons pas de marchandises, ne stockons aucun bien et ne déposons pas de déclarations, ces activités relevant de tiers agréés.',
  },
  'YASLOGIST · NEW CAIRO, CAIRO': {
    zh: 'YASLOGIST · 埃及开罗新开罗',
    tr: 'YASLOGIST · YENİ KAHİRE, KAHİRE',
    fr: 'YASLOGIST · NOUVEAU CAIRE, LE CAIRE',
  },
  'Yard Dwell Index': {
    zh: '场站停留时间指数',
    tr: 'Saha Bekleme İndeksi',
    fr: 'Indice de Séjour en Parc',
  },
  'ZATCA / Jordan Customs': {
    zh: 'ZATCA / 约旦海关总署',
    tr: 'ZATCA / Ürdün Gümrüğü',
    fr: 'ZATCA / Douanes Jordaniennes',
  },
  'ZATCA / UAE Federal Customs Authority': {
    zh: 'ZATCA / 阿联酋联邦海关总署',
    tr: 'ZATCA / BAE Federal Gümrük İdaresi',
    fr: 'ZATCA / Autorité Fédérale des Douanes des EAU',
  },
  'ZATCA-licensed bonded zone operators': {
    zh: '沙特天课税务海关总署 (ZATCA) 认证保税区运营商',
    tr: 'ZATCA lisanslı antrepo ve serbest bölge işletmecileri',
    fr: 'Opérateurs de zones sous douane agréés ZATCA',
  },
  'ZATCA-supervised dry port concession': {
    zh: 'ZATCA 监管的特许权内陆无水港',
    tr: 'ZATCA denetimli kuru liman imtiyazı',
    fr: 'Concession de port sec supervisée par ZATCA',
  },
  'Zero-Emission Regional Grid': {
    zh: '区域零碳超充智慧物流骨干网',
    tr: 'Sıfır Emisyonlu Bölgesel Dağıtım Ağı',
    fr: 'Réseau Régional Zéro Émission',
  },
  'Zero-Trust Compliance': {
    zh: '零信任架构与合规审计',
    tr: 'Sıfır Güven Uyumluluğu',
    fr: 'Conformité Zéro-Trust',
  },
  '© 2026 YASLOGIST. All rights reserved.': {
    zh: '© 2026 YASLOGIST. 保留所有权利。',
    tr: '© 2026 YASLOGIST. Tüm hakları saklıdır.',
    fr: '© 2026 YASLOGIST. Tous droits réservés.',
  },
}
