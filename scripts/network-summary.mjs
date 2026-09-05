/* ── Network summary generator + gate check ────────────────────────────
   The corridor dataset (src/data/landCorridors.ts) is heavy and must stay
   out of the entry bundle, so eager surfaces (VisionTransitionSection) read
   a two-number summary instead of importing the arrays.

   This script derives those numbers from the REAL arrays — the module is
   bundled with esbuild and evaluated in Node — then either:

     --write  rewrites src/data/network-summary.ts (default is --check)
     --check  verifies the committed summary matches the arrays

   npm run gate runs the check, so a count can never drift silently. The
   npm prebuild/predev hooks run --write, so dev and production builds are
   always generated from current data.
────────────────────────────────────────────────────────────────────── */

import { build } from 'esbuild'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_FILE = path.join(ROOT, 'src', 'data', 'landCorridors.ts')
const SUMMARY_FILE = path.join(ROOT, 'src', 'data', 'network-summary.ts')

const mode = process.argv.includes('--write') ? 'write' : 'check'

async function loadNetwork() {
  const result = await build({
    entryPoints: [DATA_FILE],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    logLevel: 'silent',
    alias: { '@': path.join(ROOT, 'src') },
  })
  const code = result.outputFiles[0].text
  const mod = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'))
  return {
    hubCount: mod.INLAND_LOGISTICS_HUBS.length,
    corridorCount: mod.LAND_TRADE_CORRIDORS.length,
  }
}

function render(net) {
  return `/* GENERATED FILE — do not edit by hand.
   Rollup counts for eager surfaces (VisionTransitionSection badge).
   Source of truth: src/data/landCorridors.ts — this module must never
   import it: landCorridors.ts is intentionally a lazy chunk.

   Regenerate:  npm run network-summary   (runs automatically on dev/build)
   Verify:      npm run check:network-summary   (part of npm run gate) */
export const NETWORK_SUMMARY = {
  hubCount: ${net.hubCount},
  corridorCount: ${net.corridorCount},
} as const
`
}

function readCommitted() {
  const text = readFileSync(SUMMARY_FILE, 'utf8')
  const hub = text.match(/hubCount:\s*(\d+)/)
  const corr = text.match(/corridorCount:\s*(\d+)/)
  if (!hub || !corr) throw new Error(`${SUMMARY_FILE} is malformed — regenerate with: npm run network-summary`)
  return { hubCount: Number(hub[1]), corridorCount: Number(corr[1]) }
}

const live = await loadNetwork()

if (mode === 'write') {
  const next = render(live)
  let current = null
  try {
    current = readFileSync(SUMMARY_FILE, 'utf8')
  } catch {
    current = null // first generation: no file yet
  }
  if (current !== next) {
    writeFileSync(SUMMARY_FILE, next)
    console.log(`✓ src/data/network-summary.ts regenerated (${live.hubCount} hubs, ${live.corridorCount} corridors)`)
  } else {
    console.log(`✓ src/data/network-summary.ts already current (${live.hubCount} hubs, ${live.corridorCount} corridors)`)
  }
  process.exit(0)
}

const committed = readCommitted()
if (committed.hubCount !== live.hubCount || committed.corridorCount !== live.corridorCount) {
  console.error(`✗ src/data/network-summary.ts is stale: committed ${committed.hubCount} hubs / ${committed.corridorCount} corridors, live data has ${live.hubCount} / ${live.corridorCount}.`)
  console.error(`  Regenerate with: npm run network-summary`)
  process.exit(1)
}
console.log(`✓ src/data/network-summary.ts matches landCorridors.ts (${live.hubCount} hubs, ${live.corridorCount} corridors)`)
