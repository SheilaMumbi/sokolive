import { useState } from 'react'
import type { Art } from '../types'
import { ProductArt } from './ProductArt'
import s from '../app.module.css'

/**
 * Product photo in a fixed-ratio box (so nothing shifts while it loads). Decorative alt:
 * the product name always sits next to it. If there's no photo, or it fails to load on a
 * flaky connection, we show a neutral illustration instead of a broken image.
 */
export function Photo({ src, art, priority }: { src?: string; art: Art; priority?: boolean }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed)
    return (
      <div className={s.ph}>
        <ProductArt art={art} className={s.phArt} />
      </div>
    )
  return (
    <img
      className={s.photo}
      src={src}
      alt=""
      width={600}
      height={750}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      {...(priority ? { fetchPriority: 'high' as const } : {})}
      onError={() => setFailed(true)}
    />
  )
}
