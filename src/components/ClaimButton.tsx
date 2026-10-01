import { useEnded } from '../hooks/useNow'
import { kes } from '../format'
import { useFeed } from '../store/feedStore'
import type { FeedItem } from '../types'
import { CheckIcon } from './Icons'
import s from '../app.module.css'

export function ClaimButton({ item, big }: { item: FeedItem; big?: boolean }) {
  const ended = useEnded(item.endsAt)
  const claim = useFeed((st) => st.claim)
  const { claimState: c, name } = item
  const size = big ? s.btnBig : ''

  if (c === 'mine')
    return (
      <button className={`${s.btn} ${s.btnDone} ${size}`} disabled aria-label={`${name} claimed, in your cart`}>
        <CheckIcon width={18} height={18} /> Claimed
      </button>
    )
  if (c === 'pending')
    return (
      <button className={`${s.btn} ${s.btnDone} ${size}`} disabled aria-label={`Claiming ${name}`}>
        Claiming…
      </button>
    )
  if (c === 'taken')
    return (
      <button className={`${s.btn} ${size}`} disabled aria-label={`${name} sold out`}>
        Sold out
      </button>
    )
  if (ended)
    return (
      <button className={`${s.btn} ${size}`} disabled aria-label={`${name} ended`}>
        Ended
      </button>
    )
  return (
    <button className={`${s.btn} ${s.btnClaim} ${size}`} onClick={() => claim(item.id)} aria-label={`Claim ${name} for ${kes(item.price)}`}>
      Claim
    </button>
  )
}
