import { memo, type ReactNode } from 'react'
import type { Art } from '../types'

/**
 * Hand-drawn flat product illustrations, parameterised by colourway. Inline SVG keeps a
 * card at ~1 kB instead of a photo download, which matters on patchy mobile data.
 */
const INK = '#1C1B18'
const stitch = { fill: 'none', stroke: INK, strokeWidth: 1.5, strokeOpacity: 0.35, strokeDasharray: '3 3' } as const
const line = { fill: 'none', stroke: INK, strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

function Sneaker({ a, b, c, tall }: { a: string; b: string; c: string; tall?: boolean }) {
  const upper = tall
    ? 'M28 138 L28 52 Q28 44 36 42 L72 38 Q80 38 84 46 L92 62 Q100 80 130 90 Q176 98 182 124 Q184 132 180 138 Z'
    : 'M26 138 L26 98 Q26 90 34 88 L62 82 Q74 78 82 66 L90 58 Q94 54 100 58 L112 72 Q122 84 142 92 Q176 100 182 124 Q184 132 180 138 Z'
  return (
    <g>
      <path d="M20 138 L186 138 L186 148 Q186 162 170 162 L40 162 Q20 162 20 146 Z" fill="#F3EEE4" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M26 152 H182" {...stitch} />
      <path d={upper} fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M142 92 Q176 100 182 124 Q184 132 180 138 L136 138 Q148 116 142 92Z" fill={b} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d={tall ? 'M28 138 L28 52 Q28 44 36 42 L52 40 L52 138Z' : 'M26 138 L26 98 Q26 90 34 88 L52 85 L52 138Z'} fill={b} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M62 128 Q92 120 122 98" {...line} stroke={c} strokeWidth="9" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${94 + i * 9} ${64 + i * 8} l11 -6`} {...line} stroke="#F3EEE4" strokeWidth="4" />
      ))}
      <path d="M26 138 Q80 132 140 138" {...stitch} />
    </g>
  )
}

function Tee({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <g>
      <path d="M72 40 Q100 56 128 40 L172 62 L156 96 L142 88 L142 168 L58 168 L58 88 L44 96 L28 62 Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M72 40 Q100 56 128 40" fill="none" stroke={b} strokeWidth="7" strokeLinecap="round" />
      <circle cx="100" cy="106" r="22" fill={c} stroke={INK} strokeWidth="2.5" />
      <path d="M90 112 L100 94 L110 112 Z" fill={b} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M58 160 H142 M44 96 L58 100 M156 96 L142 100" {...stitch} />
    </g>
  )
}

function Hoodie({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <g>
      <path d="M70 42 L130 42 L174 66 L180 146 L154 148 L150 170 L50 170 L46 148 L20 146 L26 66 Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M66 46 Q64 14 100 14 Q136 14 134 46 Q124 70 100 74 Q76 70 66 46Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M80 44 Q82 28 100 28 Q118 28 120 44 Q112 62 100 64 Q88 62 80 44Z" fill={b} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <path d="M92 66 V92 M108 66 V92" {...line} stroke={c} strokeWidth="3" />
      <path d="M66 126 H134 L142 160 H58 Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M62 126 L70 150 M138 126 L130 150" {...stitch} />
      <rect x="22" y="140" width="30" height="8" fill={c} opacity=".9" />
      <rect x="148" y="140" width="30" height="8" fill={c} opacity=".9" />
    </g>
  )
}

function Jacket({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <g>
      <path d="M70 44 L100 56 L130 44 L176 70 L170 150 L148 146 L148 172 L52 172 L52 146 L30 150 L24 70 Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M70 44 L100 76 L130 44 L118 38 L100 54 L82 38 Z" fill={b} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M100 76 V172" {...line} stroke={INK} strokeWidth="2" />
      <rect x="60" y="116" width="28" height="22" rx="2" fill="none" stroke={INK} strokeWidth="2" />
      <rect x="112" y="116" width="28" height="22" rx="2" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M32 140 L52 144 M168 140 L148 144" {...line} stroke={c} strokeWidth="5" />
      <circle cx="100" cy="92" r="3" fill={c} stroke={INK} strokeWidth="1.5" />
      <circle cx="100" cy="118" r="3" fill={c} stroke={INK} strokeWidth="1.5" />
    </g>
  )
}

function Tote({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <g>
      <path d="M70 84 Q70 30 100 30 Q130 30 130 84" fill="none" stroke={INK} strokeWidth="14" strokeLinecap="round" />
      <path d="M70 84 Q70 30 100 30 Q130 30 130 84" fill="none" stroke={b} strokeWidth="8" strokeLinecap="round" />
      <path d="M42 78 H158 L168 176 H32 Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M37 126 H163 V142 H37 Z" fill={c} stroke={INK} strokeWidth="2" />
      <rect x="84" y="92" width="32" height="22" fill={b} stroke={INK} strokeWidth="2" />
      <path d="M50 168 H150" {...stitch} />
    </g>
  )
}

function Crossbody({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <g>
      <path d="M58 92 Q40 24 100 24 Q160 24 142 92" fill="none" stroke={INK} strokeWidth="11" strokeLinecap="round" />
      <path d="M58 92 Q40 24 100 24 Q160 24 142 92" fill="none" stroke={b} strokeWidth="6" strokeLinecap="round" />
      <rect x="40" y="84" width="120" height="82" rx="12" fill={a} stroke={INK} strokeWidth="2.5" />
      <path d="M40 96 Q40 84 52 84 H148 Q160 84 160 96 V112 Q100 140 40 112 Z" fill={b} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <circle cx="100" cy="126" r="8" fill={c} stroke={INK} strokeWidth="2.5" />
      <path d="M48 158 H152" {...stitch} />
    </g>
  )
}

function Backpack({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <g>
      <path d="M86 40 Q86 22 100 22 Q114 22 114 40" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      <path d="M52 66 Q52 38 100 38 Q148 38 148 66 L154 172 Q154 184 142 184 H58 Q46 184 46 172 Z" fill={a} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M62 120 H138 V168 Q138 174 132 174 H68 Q62 174 62 168 Z" fill={b} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M62 132 H138" {...line} stroke={c} strokeWidth="5" />
      <path d="M64 62 Q100 78 136 62" {...line} stroke={INK} strokeWidth="2" />
      <rect x="92" y="84" width="16" height="16" rx="3" fill={c} stroke={INK} strokeWidth="2" />
    </g>
  )
}

export const ProductArt = memo(function ProductArt({ art, className }: { art: Art; className?: string }) {
  const { shape, a, b, c } = art
  const body: Record<Art['shape'], ReactNode> = {
    sneaker: <Sneaker a={a} b={b} c={c} />,
    hightop: <Sneaker a={a} b={b} c={c} tall />,
    tee: <Tee a={a} b={b} c={c} />,
    hoodie: <Hoodie a={a} b={b} c={c} />,
    jacket: <Jacket a={a} b={b} c={c} />,
    tote: <Tote a={a} b={b} c={c} />,
    crossbody: <Crossbody a={a} b={b} c={c} />,
    backpack: <Backpack a={a} b={b} c={c} />,
  }
  return (
    <svg viewBox="0 0 200 200" className={className} role="presentation" aria-hidden="true" focusable="false">
      <ellipse cx="100" cy="176" rx="62" ry="6" fill={INK} opacity=".18" />
      {body[shape]}
    </svg>
  )
})
