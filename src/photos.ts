import type { Shape } from './types'

/**
 * How many photos exist per shape in /public/photos (named `<shape>-<n>.webp`, n from 0).
 * Templates are spread across them round-robin. Zero means "no photo yet" and the UI
 * shows the fallback illustration instead.
 */
export const PHOTO_COUNT: Record<Shape, number> = {
  sneaker: 10,
  hightop: 4,
  tee: 5,
  hoodie: 4,
  jacket: 6,
  tote: 4,
  crossbody: 3,
  backpack: 4,
}

const used: Partial<Record<Shape, number>> = {}

export function nextPhoto(shape: Shape): string | undefined {
  const n = PHOTO_COUNT[shape]
  if (!n) return undefined
  const i = used[shape] ?? 0
  used[shape] = i + 1
  return `${import.meta.env.BASE_URL}photos/${shape}-${i % n}.webp`
}
