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
  /** Egyptian road classification, e.g. the Cairo-Alexandria Desert Road. */
  roadClass: BilingualText
  /** Governing surface and lane description for the trunk section. */
  roadSurface: BilingualText
  /** Legal axle load under Egyptian Roads & Bridges Law 84/1968 and its
   *  amendments, as enforced at the corridor's weighbridges. */
  axleLoadLimitT: number
  clearanceHeightM: number
  /** Booked departure slot out of the origin yard. */
  railSlotTime: string
  chokepointName: BilingualText
  chokepointGps: [number, number]
  /** Weighbridge the corridor's overload risk concentrates on. */
  weighbridgeGps: [number, number]
  /** Where the corridor most often loses time: gate queue, checkpoint, ferry. */
  dwellHotspotGps: [number, number]
  customsManifestType: BilingualText
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
