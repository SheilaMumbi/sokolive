import { kes } from '../format'
import { useFeed } from '../store/feedStore'
import { Activity } from './Activity'
import { ClaimButton } from './ClaimButton'
import { Photo } from './Photo'
import { Veil } from './ProductCard'
import { TimerBar, TimerPill } from './Timers'
import s from '../app.module.css'

/** The newest drop, "on air". Fixed-ratio media + reserved text space so swapping items never shifts the page. */
export function Hero() {
  const item = useFeed((st) => st.items[0])
  if (!item) return null

  return (
    <section className={s.hero} id="live" aria-label="On air now">
      <div className={s.heroMedia}>
        <Photo key={item.id} src={item.photo} art={item.art} priority />
        <span className={s.liveBadge}><span className={s.dot} aria-hidden="true" /> Live</span>
        <TimerPill endsAt={item.endsAt} name={item.name} large />
        <Veil item={item} large />
      </div>

      <div className={s.heroInfo}>
        <p className={s.eyebrow}>{item.own ? 'Your drop' : item.brand} · Lot {item.lot}</p>
        <h2 className={s.heroTitle}>{item.name}</h2>
        <p className={s.heroMeta}>
          Size {item.size} · {item.condition} · from {item.seller}
        </p>
        <p className={s.heroPrice}>{kes(item.price)}</p>
        <TimerBar startsAt={item.startsAt} endsAt={item.endsAt} />
        <ClaimButton item={item} big />
        <Activity />
      </div>
    </section>
  )
}
