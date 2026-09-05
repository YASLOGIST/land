/* ── check:eta — deterministic unit tests for src/lib/eta.ts ───────────
   The ETA engine is bundled with esbuild and evaluated in Node, then run
   against fixed input vectors. Deterministic module => deterministic
   tests: no mocks, no time-dependent cases (every vector passes an
   explicit departureTime). Exits non-zero on the first failure; wired into
   `npm run gate` alongside check:network-summary.
────────────────────────────────────────────────────────────────────── */

import { build } from 'esbuild'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import assert from 'node:assert/strict'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ETA_FILE = path.join(ROOT, 'src', 'lib', 'eta.ts')

let failed = 0
let passed = 0

async function test(name, fn) {
  try {
    await fn()
    passed += 1
    console.log(`  ✓ ${name}`)
  } catch (err) {
    failed += 1
    console.error(`  ✗ ${name}`)
    console.error(`    ${err.message.split('\n').join('\n    ')}`)
  }
}

const result = await build({
  entryPoints: [ETA_FILE],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
  logLevel: 'silent',
})
const mod = await import(
  'data:text/javascript;base64,' + Buffer.from(result.outputFiles[0].text).toString('base64')
)
const { computeEta } = mod

console.log('check:eta — src/lib/eta.ts unit tests')
console.log('  module bundled from', path.relative(ROOT, ETA_FILE))

const DEP = '2026-09-05T06:00:00+03:00'
const DEP_MS = Date.parse(DEP)

/* 1 — pure domestic arithmetic: 400 km @ 80 km/h + declared stops. */
await test('domestic trip: drive + gate + weigh + rest totals', () => {
  const eta = computeEta({
    distanceKm: 400,
    avgSpeedKmh: 80,
    gateQueueMin: 60,
    weighbridgeMin: 8,
    borderHrs: 0,
    restBreakMin: 30,
    departureTime: DEP,
  })
  assert.equal(eta.driveMinutes, 300) // 400 / 80 * 60
  assert.equal(eta.totalMinutes, 398) // 300 + 60 + 8 + 30
  assert.equal(eta.totalHours, 6.6)
  assert.equal(eta.confidenceBandMin, 0) // no declared spread => no band
  assert.deepEqual(
    eta.breakdown.map((s) => s.id),
    ['drive', 'origin-gate-queue', 'weighbridge', 'driver-rest'],
  )
  const sum = eta.breakdown.reduce((acc, s) => acc + s.minutes, 0)
  assert.equal(sum, eta.totalMinutes)
  const etaMs = Date.parse(eta.etaIso)
  assert.ok(Math.abs(etaMs - (DEP_MS + 398 * 60_000)) < 1.5, `etaIso off: ${eta.etaIso}`)
})

/* 2 — band = declared gate spread + declared border spread (worst case). */
await test('declared spreads produce additive worst-case band', () => {
  const eta = computeEta({
    distanceKm: 950,
    avgSpeedKmh: 85,
    gateQueueMin: 150,
    gateQueueBandMin: 90, // declared window 60–240
    weighbridgeMin: 7,
    borderHrs: 6,
    borderBandHrs: 3, // declared window 3–9 h
    restBreakMin: 25,
    departureTime: DEP,
  })
  assert.equal(eta.confidenceBandMin, 90 + 3 * 60)
  assert.equal(eta.totalMinutes, 950 / 85 * 60 + 150 + 7 + 6 * 60 + 25)
  const hasBorder = eta.breakdown.some((s) => s.id === 'border-clearance')
  assert.ok(hasBorder)
})

/* 3 — deterministic: identical input => identical output. */
await test('same input twice gives identical results', () => {
  const input = {
    distanceKm: 570,
    avgSpeedKmh: 80,
    gateQueueMin: 65,
    weighbridgeMin: 9,
    borderHrs: 5,
    restBreakMin: 20,
    gateQueueBandMin: 0,
    borderBandHrs: 3,
    departureTime: DEP,
  }
  assert.deepEqual(computeEta(input), computeEta(input))
})

/* 4 — guards: nonsense input must throw, never return a number. */
await test('guards: zero speed, negative distance, bad ISO, negative segment', () => {
  const base = {
    distanceKm: 100,
    avgSpeedKmh: 80,
    gateQueueMin: 10,
    weighbridgeMin: 5,
    borderHrs: 0,
    restBreakMin: 10,
    departureTime: DEP,
  }
  assert.throws(() => computeEta({ ...base, avgSpeedKmh: 0 }), RangeError)
  assert.throws(() => computeEta({ ...base, distanceKm: -5 }), RangeError)
  assert.throws(() => computeEta({ ...base, restBreakMin: -1 }), RangeError)
  assert.throws(() => computeEta({ ...base, departureTime: 'not-a-date' }), RangeError)
})

/* 5 — border-free trip omits the border segment entirely. */
await test('domestic corridor has no border segment', () => {
  const eta = computeEta({
    distanceKm: 175,
    avgSpeedKmh: 85,
    gateQueueMin: 112.5,
    weighbridgeMin: 6,
    borderHrs: 0,
    restBreakMin: 0,
    departureTime: DEP,
  })
  assert.ok(!eta.breakdown.some((s) => s.id === 'border-clearance'))
  assert.equal(eta.totalMinutes, 175 / 85 * 60 + 112.5 + 6)
})

/* 6 — incident hold shows as its own breakdown segment and shifts the ETA. */
await test('incident hold adds a transparent segment and delays arrival', () => {
  const eta = computeEta({
    distanceKm: 265,
    avgSpeedKmh: 85,
    gateQueueMin: 135,
    weighbridgeMin: 7,
    borderHrs: 0,
    restBreakMin: 30,
    incidentHoldMin: 120,
    departureTime: DEP,
  })
  const incident = eta.breakdown.find((s) => s.id === 'incident-hold')
  assert.ok(incident, 'incident-hold segment missing')
  assert.equal(incident.minutes, 120)
  const base = computeEta({
    distanceKm: 265,
    avgSpeedKmh: 85,
    gateQueueMin: 135,
    weighbridgeMin: 7,
    borderHrs: 0,
    restBreakMin: 30,
    departureTime: DEP,
  })
  assert.ok(Date.parse(eta.etaIso) - Date.parse(base.etaIso) >= 120 * 60_000 - 1.5)
})

/* 7 — long-haul: no declared gate/border spread means no fabricated band. */
await test('zero declared spread yields zero band (no invented confidence)', () => {
  const eta = computeEta({
    distanceKm: 1840,
    avgSpeedKmh: 80,
    gateQueueMin: 40,
    gateQueueBandMin: 0,
    weighbridgeMin: 50,
    borderHrs: 16,
    borderBandHrs: 0,
    restBreakMin: 90,
    departureTime: DEP,
  })
  assert.equal(eta.confidenceBandMin, 0)
})

if (failed > 0) {
  console.error(`check:eta — ${failed} failed, ${passed} passed`)
  process.exit(1)
}
console.log(`check:eta — ${passed} passed, 0 failed`)
