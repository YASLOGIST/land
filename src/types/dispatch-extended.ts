import type { BilingualText } from '@/types/land-logistics'
import type { TransportModeId } from '@/types/dispatch'

export interface WaypointDetail {
  name: string
  coordinates: [number, number]
  gps: [number, number]
  status: string
  weather: BilingualText
  throughputIndex: string
  avgClearanceTime: string
}

/** Declared segment figures the pure computeEta engine runs on. Every
 *  number traces to a declared (MODELLED) string in landCorridors.ts —
 *  a hub gate window, a waypoint clearance time, or the corridor route
 *  itself. Expected values are the midpoints of declared windows; the
 *  band fields are the one-sided half-widths of those windows. Corridors
 *  without a declared border window carry borderHrs 0. */
export interface DeclaredEtaSegments {
  /** Expected origin gate / yard queue, minutes (declared window midpoint). */
  gateQueueMin: number
  /** One-sided half-width of the declared gate window, minutes. */
  gateQueueBandMin: number
  /** Expected weighbridge stop, minutes. */
  weighbridgeMin: number
  /** Scheduled driver rest / checkpoint-break minutes declared on the route. */
  restBreakMin: number
  /** Expected border (or ferry) clearance hours; 0 = domestic corridor. */
  borderHrs: number
  /** One-sided half-width of the declared border window, hours. */
  borderBandHrs: number
}

export interface RealTradeCorridor {
  id: string
  code: string
  originCity: BilingualText
  originHub: string
  gisOrigin: string
  originGps: [number, number]
  destinationCity: BilingualText
  destinationHub: string
  gisDestination: string
  destinationGps: [number, number]
  distanceKm: number
  supportedModes: TransportModeId[]
  /** Corridor status band. The dispatch UI keys off the words MONITORED,
   *  YELLOW, HIGH and RED, so keep one of those in the string when the
   *  corridor should not render green. */
  riskScore: string
  /** Governing trunk route in the corridor's home jurisdiction, e.g. the
   *  Cairo-Alexandria Desert Road or Saudi Highway 40. */
  roadClass: BilingualText
  /** Governing surface and lane description for the trunk section. */
  roadSurface: BilingualText
  /** Per-axle load cap the corridor's weighbridges enforce, in tonnes. The
   *  number is jurisdiction-specific:
   *   - Egypt: single-axle limit applied under Roads & Bridges Law 84/1968
   *     and its amendments.
   *   - Saudi Arabia: the 13 t maximum on a single non-steered axle under
   *     Article 23 of the Traffic System Executive Regulations. Steered
   *     axles are capped lower (8 t single-tyred, 10 t dual-tyred), axles
   *     inside three-axle groups at 6.5 t each, and gross weights by axle
   *     count (2-axle 21 t, 3-axle 34 t, 4-axle 42 t, 5-axle 45 t) — the
   *     single number here is the per-axle ceiling, not the gross limit. */
  axleLoadLimitT: number
  /** Height envelope in metres the corridor is planned for: clearance under
   *  structures on Egyptian sections, and the 4.8 m legal vehicle height
   *  Saudi weigh stations check against. */
  clearanceHeightM: number
  /** Booked departure slot out of the origin yard. */
  railSlotTime: string
  /** Declared ETA segment figures (MODELLED) that feed the pure computeEta
   *  engine — see DeclaredEtaSegments. */
  etaModel: DeclaredEtaSegments
  chokepointName: BilingualText
  chokepointGps: [number, number]
  /** Weighbridge the corridor's overload risk concentrates on. */
  weighbridgeGps: [number, number]
  /** Where the corridor most often loses time: gate queue, checkpoint, ferry. */
  dwellHotspotGps: [number, number]
  /** Customs declaration regime for cargo moving on the corridor.
   *   - Egypt: NAFEZA pre-arrival declaration carrying the ACID number.
   *   - Saudi Arabia: the Bayan declaration (بيان جمركي) filed through the
   *     FASAH national single window operated under ZATCA. */
  customsManifestType: BilingualText
  /** Carrier operating licence a freight vehicle must hold on the corridor.
   *   - Saudi corridors: the Transport General Authority (TGA / الهيئة
   *     العامة للنقل) operating card (بطاقة تشغيل) required of every
   *     commercial freight vehicle on Saudi roads.
   *   - Egyptian corridors: the GARBLT-issued goods-transport licence. */
  operatorLicence: BilingualText
  // Land route vectors on the 1000x500 equirectangular canvas
  landBurntOrangeHighwayPath: string
  landOliveRuralPath: string
  landForestGreenRailPath: string
  landCharcoalClosedPath: string
  realLandPath: string
  predictivePath: string
  goldBypassPath: string
  waypoints: {
    name: string
    coordinates: [number, number]
    status: string
  }[]
  detailedWaypoints: WaypointDetail[]
}

export interface GlobalHubPin {
  id: string
  name: BilingualText
  gps: [number, number]
  type: 'dry-port' | 'seaport-gate' | 'industrial-zone' | 'border-crossing'
  country: BilingualText
  /** Who runs the facility. YASLOGIST books capacity at these nodes; it does
   *  not own them, and the copy must not imply otherwise. */
  operator: BilingualText
  stats: string
  throughput: string
  clearanceTime: string
}
