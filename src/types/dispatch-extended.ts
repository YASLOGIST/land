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
  riskScore: string
  flightLevel: string
  flightLevelRange: string
  headwindKts: number
  outsideAirTempC: number
  bathymetryDepthM: number
  surfaceCurrentsKts: string
  seaIceCoverage: string
  axleLoadLimitT: number
  clearanceHeightM: number
  railSlotTime: string
  chokepointName: BilingualText
  chokepointGps: [number, number]
  catTurbulenceGps: [number, number]
  piracyZoneGps: [number, number]
  seaIceZoneGps: [number, number]
  customsManifestType: BilingualText
  // Aviation Layer Vectors
  aviationOptimalNavyPath: string
  aviationAltCyanPath: string
  aviationWarningRedPath: string
  aviationLimeFuelSavePath: string
  // Maritime Layer Vectors
  maritimeTealSafePath: string
  maritimeAmberCongestionPath: string
  maritimeSeaIcePath: string
  // Land Layer Vectors
  landBurntOrangeHighwayPath: string
  landOliveRuralPath: string
  landForestGreenRailPath: string
  landCharcoalClosedPath: string
  // Legacy paths
  realAirPath: string
  realOceanPath: string
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
  type: 'air' | 'sea' | 'multimodal'
  country: BilingualText
  stats: string
  throughput: string
  clearanceTime: string
}
