import { useEffect, useMemo, useRef, useState } from 'react'

/**
 * A running-stitch divider sewn edge to edge: a wave of separate stitches,
 * each with a soft shadow (raised off the cloth) and a fibre twist along it.
 * The wave is built in real pixels from the measured width, so stitches keep
 * the same size at every screen width instead of stretching. Decorative only.
 *
 * tone picks the thread colour; 'coral' is the house lead.
 */
const THREAD = {
  coral: 'var(--color-coral)',
  green: 'var(--color-green)',
  pink: 'var(--color-pink)',
  bone: 'var(--color-line-strong)',
} as const

const H = 36
const MID = H / 2
const AMP = 9 // bend height, px
const WAVE = 260 // px per full bend
const STITCH = 14 // stitch length, px
const GAP = 8 // needle gap, px
const EDGE = 14 // room for the knots

const y = (x: number) => MID + AMP * Math.sin((2 * Math.PI * x) / WAVE)

/** Fixed pseudo-random in -1..1: stitches look hand-sewn but never shift between renders. */
const jitter = (n: number) => {
  const s = Math.sin(n * 12.9898) * 43758.5453
  return (s - Math.floor(s)) * 2 - 1
}

/** One path string; each stitch is its own subpath, so the gaps stay open. */
function stitchPath(w: number) {
  let d = ''
  let x = EDGE
  for (let n = 0; x < w - EDGE; n++) {
    const end = Math.min(x + STITCH + jitter(n) * 2, w - EDGE)
    d += `M${x.toFixed(1)} ${y(x).toFixed(1)}`
    for (let t = x + 2; t < end; t += 2) d += `L${t.toFixed(1)} ${y(t).toFixed(1)}`
    d += `L${end.toFixed(1)} ${y(end).toFixed(1)}`
    x = end + GAP + jitter(n + 99) * 1.5
  }
  return d
}

export default function Stitch({
  tone = 'coral',
  className = '',
}: {
  tone?: keyof typeof THREAD
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const d = useMemo(() => (w ? stitchPath(w) : ''), [w])
  const c = THREAD[tone]

  return (
    <div ref={ref} className={'py-8 md:py-12 ' + className} role="separator" aria-hidden="true">
      <svg viewBox={`0 0 ${w || 1} ${H}`} height={H} className="block w-full" fill="none">
        {w > 0 && (
          <>
            {/* Shadow under each stitch, so the thread sits raised on the cloth. */}
            <path
              d={d}
              transform="translate(0 1.2)"
              stroke="var(--color-bone)"
              strokeOpacity="0.22"
              strokeWidth="3.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* The thread. */}
            <path d={d} stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Fibre twist: fine light flecks running down each stitch. */}
            <path
              d={d}
              stroke="var(--color-ink)"
              strokeOpacity="0.5"
              strokeWidth="0.9"
              strokeDasharray="1.6 2.4"
              strokeLinecap="round"
            />
            {/* French knots where the thread is tied off. */}
            <circle cx="6" cy={y(6)} r="4" fill={c} />
            <circle cx={w - 6} cy={y(w - 6)} r="4" fill={c} />
          </>
        )}
      </svg>
    </div>
  )
}
