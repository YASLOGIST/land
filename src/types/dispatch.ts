import type { LucideIcon } from 'lucide-react'
import type { BilingualText } from './land-logistics'

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
  estimatedTimeHours: number
  estimatedTimeFormatted: string
  etaVarianceFormatted: string
  co2SavedKg: number
  fuelReductionPercent: number
  costEstimateUsd: number
  confidenceScore: number
  cryptographicManifestHash: string
  meshNodePingMs: number
  zeroLossVerificationStatus: 'VERIFIED' | 'TAMPER_PROOF_SEALED'
}
