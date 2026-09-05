/* ── Bundle guard ─────────────────────────────────────────────────────
   Fails the gate if an academic reference, or a personal document,
   reaches the built artifact.

   This mirrors ocean/scripts/check-bundle.mjs, which was written after an
   eager wildcard glob kept re-inlining the AASTMT emblem as a data URI
   long after its components were deleted. Land had no equivalent gate,
   and shipped a full CV PDF — carrying `Arab Academy for Science,
   Technology & Maritime Transport (AASTMT)`, a personal mobile and a
   personal email — as an orphaned file under `public/`, fetchable by
   anyone who guessed the path. `public/` is copied to the deploy root
   verbatim, so nothing in the source tree had to reference it.

   Two surfaces are therefore checked, not one:
     1. the built HTML, for inlined academic tokens
     2. the emitted asset tree, for personal documents copied wholesale
────────────────────────────────────────────────────────────────────── */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const DIST = "dist";
const BUNDLE = join(DIST, "index.html");

/* Academic identifiers. The platform is presented as a commercial
   product; none of these may reach production on any surface. */
const BANNED = ["AASTMT", "Arab Academy", "CITL", "211010469"];

/* Personal-document shapes. A CV is never a site asset — it carries a
   home address, a personal mobile and an education history that the
   commercial positioning deliberately removed. */
const BANNED_FILES = [/\bcv\b/i, /curriculum[\s_-]*vitae/i, /\bresume\b/i, /\.docx\.pdf$/i];

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let failed = false;

/* ── 1. Academic tokens in the built HTML ─────────────────────────── */

let html;
try {
  html = readFileSync(BUNDLE, "utf8");
} catch {
  console.error(`✗ ${BUNDLE} not found — run the build before this check.`);
  process.exit(1);
}

const hits = BANNED.map((token) => [
  token,
  (html.match(new RegExp(escape(token), "gi")) ?? []).length,
]).filter(([, count]) => count > 0);

if (hits.length > 0) {
  console.error(`✗ ${BUNDLE}: academic references must not ship`);
  for (const [token, count] of hits) {
    console.error(`    ${token} — ${count} occurrence${count === 1 ? "" : "s"}`);
  }
  failed = true;
} else {
  console.log(`✓ ${BUNDLE}: 0 academic references (${BANNED.length} tokens checked)`);
}

/* ── 2. Personal documents anywhere in the emitted tree ───────────── */

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

if (existsSync(DIST)) {
  const offenders = walk(DIST).filter((file) => {
    const name = relative(DIST, file);
    return BANNED_FILES.some((pattern) => pattern.test(name));
  });

  if (offenders.length > 0) {
    console.error(`✗ ${DIST}: personal documents must not ship`);
    for (const file of offenders) console.error(`    ${relative(DIST, file)}`);
    console.error("  Delete it from public/ — public/ is copied to the deploy root verbatim.");
    failed = true;
  } else {
    console.log(`✓ ${DIST}: 0 personal documents (${BANNED_FILES.length} patterns checked)`);
  }
}

process.exit(failed ? 1 : 0);
