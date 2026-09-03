import type { LucideIcon } from 'lucide-react'
import type { BilingualText } from './land-logistics'

export type DisruptionSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE'

export type StrategyModeId = 'speed' | 'cost-esg' | 'cold-chain-reefer'

export interface ContingencyStrategyOption {
  id: StrategyModeId
  icon: LucideIcon
  name: BilingualText
  tagline: BilingualText
  delayMitigationHours: number
  costVariancePercent: number
  co2OffsetKg: number
  confidenceScore: number
  rerouteProtocol: BilingualText
}

export interface DisruptionScenarioOption {
  id: string
  code: string
  title: BilingualText
  location: BilingualText
  affectedCorridor: string
  severity: DisruptionSeverity
  impactDescription: BilingualText
  baseDelayHours: number
  potentialLossRisk: string
  radarCoordinates: [number, number] // Percentage coordinates for SVG incident radar [x%, y%]
  strategies: ContingencyStrategyOption[]
}

export interface DisruptionSimulationResult {
  activeScenario: DisruptionScenarioOption
  selectedStrategy: ContingencyStrategyOption
  netDelayHours: number
  hoursSaved: number
  fuelEfficiencyGain: number
  lossPreventionRate: string
  authChecksumToken: string
}
