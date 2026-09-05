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
  /** Residual hold after mitigation, hours — recomputed from the ETA engine
   *  as mitigated total minus planned total. */
  netDelayHours: number
  /** Engine-computed hours recovered: disrupted total − mitigated total. */
  hoursSaved: number
  fuelEfficiencyGain: number
  lossPreventionRate: string
  authChecksumToken: string
  /** Total door-to-door ETA with no incident, formatted (MODELLED). */
  etaPlannedFormatted: string
  /** Total door-to-door ETA with the incident and no mitigation. */
  etaDisruptedFormatted: string
  /** Total door-to-door ETA after the selected strategy's mitigation. */
  etaMitigatedFormatted: string
  /** Declared ± confidence band (minutes) on the affected corridor. */
  etaBandMin: number
  /** Per-strategy recovered hours, engine-computed for the option cards. */
  strategySavingsHours: Record<string, number>
}
