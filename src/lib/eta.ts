/* ── computeEta — deterministic land-ETA arithmetic ────────────────────
   Pure, dependency-free module for the dispatch simulator. No randomness,
   no "AI", no hidden constants: every term in the total comes from an
   explicit input, and the result carries a full breakdown so the UI can
   show where the hours go.

   Semantics of the inputs (all declared, model-side values):
     distanceKm        declared road distance of the corridor
     avgSpeedKmh       declared average line-haul speed for the chosen mode
     gateQueueMin      expected origin gate / yard queue (midpoint of the
                       declared window where the data declares a range)
     weighbridgeMin    expected weighbridge stop time
     restBreakMin      scheduled driver rest / checkpoint-break minutes
     borderHrs         expected border (or ferry) clearance hours; 0 for
                       purely domestic corridors
     departureTime     ISO 8601 departure (offset-carrying). When omitted
                       the module uses the current time, which is a UI
                       convenience — pass an explicit value for
                       reproducible tests.
     gateQueueBandMin  one-sided half-width of the declared gate window
     borderBandHrs     one-sided half-width of the declared border window

   The confidence band is the declared spread on the two terms that
   genuinely vary — gate queues and border dwell — added conservatively
   (worst case: both at the same extreme). Everything else in the model
   moves on schedule.
────────────────────────────────────────────────────────────────────── */

export type EtaSegmentId =
  | 'drive'
  | 'origin-gate-queue'
  | 'weighbridge'
  | 'driver-rest'
  | 'border-clearance'
  | 'incident-hold'

export interface EtaBreakdownSegment {
  id: EtaSegmentId
  /** English telemetry label — rendered in the mono HUD. */
  label: string
  /** Segment duration in minutes (decimal allowed). */
  minutes: number
  /** Optional qualifier, e.g. the declared window the figure came from. */
  note?: string
}

export interface EtaInput {
  distanceKm: number
  avgSpeedKmh: number
  gateQueueMin: number
  weighbridgeMin: number
  borderHrs: number
  restBreakMin: number
  departureTime?: string
  gateQueueBandMin?: number
  borderBandHrs?: number
  /** Disruption hold applied by the incident command model, minutes. */
  incidentHoldMin?: number
}

export interface EtaResult {
  /** ISO 8601 arrival instant (departure + total minutes). */
  etaIso: string
  /** Total door-to-door hours including every declared segment. */
  totalHours: number
  /** Total door-to-door minutes (decimal allowed). */
  totalMinutes: number
  /** Pure drive time, minutes. */
  driveMinutes: number
  /** ± minutes around the ETA from declared gate/border spreads. */
  confidenceBandMin: number
  /** Ordered segments: drive + declared holds. Sum equals totalMinutes. */
  breakdown: EtaBreakdownSegment[]
}

const MIN_PER_HOUR = 60

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export function computeEta(input: EtaInput): EtaResult {
  const {
    distanceKm,
    avgSpeedKmh,
    gateQueueMin,
    weighbridgeMin,
    borderHrs,
    restBreakMin,
    departureTime,
    gateQueueBandMin = 0,
    borderBandHrs = 0,
    incidentHoldMin = 0,
  } = input

  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    throw new RangeError('computeEta: distanceKm must be a positive number')
  }
  if (!Number.isFinite(avgSpeedKmh) || avgSpeedKmh <= 0) {
    throw new RangeError('computeEta: avgSpeedKmh must be a positive number')
  }
  for (const [name, value] of Object.entries({
    gateQueueMin,
    weighbridgeMin,
    borderHrs,
    restBreakMin,
    gateQueueBandMin,
    borderBandHrs,
    incidentHoldMin,
  })) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`computeEta: ${name} must be a non-negative number`)
    }
  }

  const driveMinutes = (distanceKm / avgSpeedKmh) * MIN_PER_HOUR

  const breakdown: EtaBreakdownSegment[] = [
    {
      id: 'drive',
      label: 'DRIVE TIME (LINE HAUL)',
      minutes: driveMinutes,
      note: `${distanceKm} KM @ ${avgSpeedKmh} KM/H`,
    },
  ]
  if (gateQueueMin > 0) {
    breakdown.push({
      id: 'origin-gate-queue',
      label: 'ORIGIN GATE / YARD QUEUE',
      minutes: gateQueueMin,
      note: gateQueueBandMin > 0 ? `DECLARED ±${gateQueueBandMin} MIN` : 'DECLARED POINT VALUE',
    })
  }
  if (weighbridgeMin > 0) {
    breakdown.push({
      id: 'weighbridge',
      label: 'WEIGHBRIDGE CHECK',
      minutes: weighbridgeMin,
    })
  }
  if (restBreakMin > 0) {
    breakdown.push({
      id: 'driver-rest',
      label: 'SCHEDULED DRIVER REST / BREAKS',
      minutes: restBreakMin,
    })
  }
  if (borderHrs > 0) {
    breakdown.push({
      id: 'border-clearance',
      label: 'BORDER / FERRY CLEARANCE',
      minutes: borderHrs * MIN_PER_HOUR,
      note: borderBandHrs > 0 ? `DECLARED ±${borderBandHrs} HRS` : 'DECLARED POINT VALUE',
    })
  }
  if (incidentHoldMin > 0) {
    breakdown.push({
      id: 'incident-hold',
      label: 'INCIDENT HOLD (DISRUPTION)',
      minutes: incidentHoldMin,
    })
  }

  const totalMinutes = breakdown.reduce((sum, segment) => sum + segment.minutes, 0)
  const confidenceBandMin = round1(
    (gateQueueBandMin > 0 ? gateQueueBandMin : 0) +
      (borderBandHrs > 0 ? borderBandHrs * MIN_PER_HOUR : 0),
  )

  const departureMs = departureTime ? Date.parse(departureTime) : Date.now()
  if (!Number.isFinite(departureMs)) {
    throw new RangeError(`computeEta: departureTime "${departureTime}" is not a valid ISO date`)
  }
  const etaIso = new Date(departureMs + totalMinutes * MIN_PER_HOUR * 1000).toISOString()

  return {
    etaIso,
    totalHours: round1(totalMinutes / MIN_PER_HOUR),
    totalMinutes,
    driveMinutes,
    confidenceBandMin,
    breakdown,
  }
}
