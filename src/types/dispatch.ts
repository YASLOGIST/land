import type { LucideIcon } from 'lucide-react'
import type { BilingualText } from './land-logistics'
import type { EtaResult } from '../lib/eta'

export type TransportModeId =
  | 'electric-truck'
  | 'electric-platoon'
  | 'ltl-crossdock'
  | 'heavy-haul-ftl'

export interface TransportModeOption {
  id: TransportModeId
  icon: LucideIcon
  name: BilingualText
  speedDescriptor: BilingualText
  efficiencyRating: string
  baseCostPerTonKm: number
  baseSpeedKmh: number
  emissionsFactor: number // kg CO2 per ton-km
}

export type CargoClassId =
  | 'pharma-coldchain'
  | 'high-tech-sealed'
  | 'heavy-industrial'
  | 'fast-fmcg'
  | 'hazardous-hazmat'

export interface CargoClassOption {
  id: CargoClassId
  name: BilingualText
  securityLevel: string
  tempClass: BilingualText
  riskFactor: number
}

export interface TradeCorridorOption {
  id: string
  code: string
  originCity: BilingualText
  originHub: string
  destinationCity: BilingualText
  destinationHub: string
  distanceKm: number
  supportedModes: TransportModeId[]
  riskScore: string
  customsManifestType: BilingualText
  waypoints: {
    name: string
    coordinates: [number, number]
    status: 'clear' | 'active' | 'synced'
  }[]
}

export interface DispatchSimulationOutput {
  /** Total door-to-door time including every declared (MODELLED) hold,
   *  formatted as e.g. "13h 55m" or "2d 3h". */
  estimatedTimeFormatted: string
  /** Declared-spread confidence band, e.g. "±68 MIN (MODELLED)". */
  etaVarianceFormatted: string
  /** Local arrival wall-clock from the engine's etaIso, "(MODELLED)". */
  arrivalTimeFormatted: string
  co2SavedKg: number
  fuelReductionPercent: number
  costEstimateUsd: number
  cryptographicManifestHash: string
  meshNodePingMs: number
  /** Full deterministic ETA result — breakdown drives the segment list. */
  eta: EtaResult
}
