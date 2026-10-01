/** Tiny viewers-over-time line for the header. Decorative; the count beside it is the real info. */
export function Sparkline({ values }: { values: number[] }) {
  if (values.length < 2) return null
  const w = 56, h = 20
  const min = Math.min(...values), max = Math.max(...values)
  const span = Math.max(1, max - min)
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 2 - ((v - min) / span) * (h - 4)}`).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false">
      <polyline points={pts} fill="none" stroke="var(--accent-text)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
