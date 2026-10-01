import type { Art, Category, Shape } from './types'

type Colors = Omit<Art, 'shape'>

/** Hand-picked colourways: background, main, secondary, accent. */
export const PALETTES: (Colors & { name: string })[] = [
  { name: 'Sunset', bg: '#F4B183', a: '#F3EEE4', b: '#1C1B18', c: '#E5381E' },
  { name: 'Cobalt', bg: '#C7D3FF', a: '#2B3BFF', b: '#F3EEE4', c: '#FFD23F' },
  { name: 'Moss', bg: '#D7E3B5', a: '#2F4A2A', b: '#E9E2CF', c: '#E5381E' },
  { name: 'Bone', bg: '#E7C9B0', a: '#F3EEE4', b: '#8A5A3C', c: '#1C1B18' },
  { name: 'Ink', bg: '#BFC6CF', a: '#1C1B18', b: '#F3EEE4', c: '#FF4A1C' },
  { name: 'Bubble', bg: '#F7C4D4', a: '#D9366B', b: '#F3EEE4', c: '#1C1B18' },
  { name: 'Lemon', bg: '#F5E27A', a: '#1C1B18', b: '#F5E27A', c: '#2B3BFF' },
  { name: 'Teal', bg: '#A9D8D0', a: '#0E6B63', b: '#F3EEE4', c: '#FF8A3D' },
]

export const SHAPES: Record<Category, { shape: Shape; label: string }[]> = {
  shoes: [
    { shape: 'sneaker', label: 'Low-top' },
    { shape: 'hightop', label: 'High-top' },
  ],
  tops: [
    { shape: 'tee', label: 'T-shirt' },
    { shape: 'hoodie', label: 'Hoodie' },
    { shape: 'jacket', label: 'Jacket' },
  ],
  bags: [
    { shape: 'tote', label: 'Tote' },
    { shape: 'crossbody', label: 'Crossbody' },
    { shape: 'backpack', label: 'Backpack' },
  ],
}

export const artFor = (shape: Shape, palette: number): Art => {
  const { name: _n, ...colors } = PALETTES[palette % PALETTES.length]
  return { shape, ...colors }
}
