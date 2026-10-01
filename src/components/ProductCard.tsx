import { memo } from 'react'
import { useEnded } from '../hooks/useNow'
import { kes } from '../format'
import type { FeedItem } from '../types'
import { ClaimButton } from './ClaimButton'
import { CheckIcon } from './Icons'
import { Photo } from './Photo'
import { TimerPill } from './Timers'
import s from '../app.module.css'

/** Dims the photo when the lot is over or yours. Re-renders once, at expiry. */
export function Veil({ item, large }: { item: FeedItem; large?: boolean }) {
  const ended = useEnded(item.endsAt)
  const c = item.claimState
  if (c === 'mine')
    return (
      <div className={`${s.veil} ${large ? s.veilLg : ''}`} aria-hidden="true">
        <span className={s.veilCheck}><CheckIcon width={large ? 34 : 24} height={large ? 34 : 24} /></span>
        <strong>Claimed!</strong>
        <span>You got it</span>
      </div>
    )
  const label = c === 'taken' ? 'Sold out' : ended ? 'Ended' : null
  if (!label) return null
  return (
    <div className={`${s.veil} ${large ? s.veilLg : ''}`} aria-hidden="true">
      <strong>{label}</strong>
    </div>
  )
}

export const ProductCard = memo(function ProductCard({ item }: { item: FeedItem }) {
  return (
    <li className={s.card}>
      <div className={s.cardMedia}>
        <Photo src={item.photo} art={item.art} />
        <TimerPill endsAt={item.endsAt} name={item.name} />
        <Veil item={item} />
      </div>
      <div className={s.cardBody}>
        <h3 className={s.cardTitle}>{item.name}</h3>
        <p className={s.meta}>
          {item.size} · {item.condition}
        </p>
        <p className={s.price}>{kes(item.price)}</p>
        <ClaimButton item={item} />
      </div>
    </li>
  )
})
