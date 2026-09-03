'use client'

/* ── Multi-modal suite switcher ───────────────────────────────────────────
   Two presentations of one table:

   · `variant="bar"`  — a compact frosted segmented control for the header.
   · `variant="grid"` — a four-card grid for the mobile drawer.

   The bar is icon-only and hidden below `lg`. Land's header carries a wordmark
   plus a two-line tagline, three nav links, a language pill and a theme
   toggle; at `md` (768px) that row is already near its budget, so the switcher
   waits for `lg` and phones get the grid in the drawer instead.

   Icons come from lucide-react, which the rest of this surface already uses —
   ocean draws its own because it ships no icon package.
────────────────────────────────────────────────────────────────────────── */

import { useTheme } from 'next-themes'
import { Layers, Truck, Ship, Plane } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { SURFACES, SUITE_LABEL, type SurfaceId } from '@/lib/suite'

const ICONS: Record<SurfaceId, typeof Layers> = {
  hub: Layers,
  land: Truck,
  ocean: Ship,
  air: Plane,
}

export default function SuiteSwitcher({
  current,
  variant = 'bar',
  onNavigate,
  className = '',
}: {
  current: SurfaceId
  variant?: 'bar' | 'grid'
  onNavigate?: () => void
  className?: string
}) {
  const { language, direction } = useLanguage()
  const { resolvedTheme } = useTheme()
  const mode = resolvedTheme === 'light' ? 'light' : 'dark'

  if (variant === 'grid') {
    return (
      /* A labelled landmark, not a bare div: this is the only way off the
         surface on a phone, and a screen-reader user should be able to jump
         straight to it. */
      <nav aria-label={SUITE_LABEL[language]} className={className} dir={direction}>
        <p className={`mb-3 text-[10px] font-bold uppercase tracking-[0.24em] ${
          mode === 'dark' ? 'text-slate-500' : 'text-slate-500'
        } ${direction === 'rtl' ? 'tracking-normal' : ''}`}>
          {SUITE_LABEL[language]}
        </p>
        <div className="grid grid-cols-4 gap-2">
          {SURFACES.map((s) => {
            const Icon = ICONS[s.id]
            const active = s.id === current
            const copy = s[language]
            const base =
              'flex flex-col items-center justify-center rounded-xl border px-1 py-2.5 text-center transition-all duration-300'

            if (!s.live) {
              return (
                <span
                  key={s.id}
                  aria-disabled="true"
                  title={copy.note}
                  className={`${base} cursor-not-allowed ${
                    mode === 'dark'
                      ? 'border-white/[0.06] bg-white/[0.02] text-slate-600'
                      : 'border-slate-200/70 bg-slate-50 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span className="mt-1.5 text-[11px] font-semibold leading-none">{copy.name}</span>
                </span>
              )
            }

            return (
              <a
                key={s.id}
                href={active ? undefined : s.href}
                aria-current={active ? 'page' : undefined}
                onClick={onNavigate}
                title={copy.note}
                className={`${base} ${
                  active
                    ? 'cursor-default border-transparent'
                    : mode === 'dark'
                      ? 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:border-white/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
                style={
                  active
                    ? {
                        borderColor: s.accent,
                        background: `${s.accent}1f`,
                        color: mode === 'dark' ? s.accent : '#0f172a',
                        boxShadow: `0 0 16px ${s.glow}`,
                      }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="mt-1.5 text-[11px] font-semibold leading-none">{copy.name}</span>
              </a>
            )
          })}
        </div>
      </nav>
    )
  }

  /* bar */
  return (
    <nav
      aria-label={SUITE_LABEL[language]}
      dir="ltr"
      className={`shrink-0 flex items-center gap-0.5 rounded-full p-1 border backdrop-blur-2xl ${
        mode === 'dark'
          ? 'bg-[#051336]/80 border-white/10'
          : 'bg-white/80 border-slate-200'
      } ${className}`}
    >
      {SURFACES.map((s) => {
        const Icon = ICONS[s.id]
        const active = s.id === current
        const copy = s[language]
        const label = `${copy.name} — ${copy.note}`

        if (!s.live) {
          return (
            <span
              key={s.id}
              aria-disabled="true"
              title={label}
              className={`grid h-7 w-7 cursor-not-allowed place-items-center rounded-full ${
                mode === 'dark' ? 'text-slate-600' : 'text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="sr-only">{label}</span>
            </span>
          )
        }

        return (
          <a
            key={s.id}
            href={active ? undefined : s.href}
            aria-current={active ? 'page' : undefined}
            aria-label={label}
            title={label}
            className={`grid h-7 w-7 place-items-center rounded-full transition-all duration-300 ${
              active
                ? 'cursor-default'
                : mode === 'dark'
                  ? 'text-slate-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
            style={
              active
                ? {
                    background: `${s.accent}26`,
                    color: mode === 'dark' ? s.accent : '#0f172a',
                    boxShadow: `0 0 12px ${s.glow}`,
                  }
                : undefined
            }
          >
            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        )
      })}
    </nav>
  )
}
