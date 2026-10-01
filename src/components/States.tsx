import { BoxIcon, WifiOffIcon } from './Icons'
import s from '../app.module.css'

export function SkeletonHero() {
  return (
    <section className={s.hero} aria-busy="true" aria-label="Loading the live drop">
      <div className={`${s.heroMedia} ${s.shimmer}`} />
      <div className={s.heroInfo}>
        <div className={`${s.bar} ${s.shimmer}`} style={{ width: '35%' }} />
        <div className={`${s.bar} ${s.shimmer}`} style={{ width: '80%', height: 30 }} />
        <div className={`${s.bar} ${s.shimmer}`} style={{ width: '55%' }} />
        <div className={`${s.bar} ${s.shimmer}`} style={{ width: '30%', height: 28 }} />
        <div className={`${s.btn} ${s.btnBig} ${s.shimmer}`} />
      </div>
    </section>
  )
}

export function SkeletonList() {
  return (
    <ul className={s.grid} aria-busy="true" aria-label="Loading items">
      {Array.from({ length: 8 }, (_, i) => (
        <li key={i} className={`${s.card} ${s.skeleton}`} aria-hidden="true">
          <div className={`${s.cardMedia} ${s.shimmer}`} />
          <div className={s.cardBody}>
            <div className={`${s.bar} ${s.shimmer}`} style={{ width: '85%' }} />
            <div className={`${s.bar} ${s.shimmer}`} style={{ width: '50%' }} />
            <div className={`${s.bar} ${s.shimmer}`} style={{ width: '35%' }} />
            <div className={`${s.btn} ${s.shimmer}`} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function ErrorState({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className={s.state} role="alert">
      <span className={s.stateIcon}><WifiOffIcon width={36} height={36} /></span>
      <h2>Something went wrong</h2>
      <p>{message ?? 'We couldn’t load the live feed.'} Check your connection and try again.</p>
      <button className={`${s.btn} ${s.btnClaim} ${s.btnInline}`} onClick={onRetry}>
        Retry
      </button>
    </div>
  )
}

export function EmptyState({ filtered, onReset, onRefresh }: { filtered: boolean; onReset: () => void; onRefresh: () => void }) {
  return (
    <div className={s.state}>
      <span className={s.stateIcon}><BoxIcon width={36} height={36} /></span>
      <h2>{filtered ? 'Nothing matches your filters' : 'No items live right now'}</h2>
      <p>{filtered ? 'New drops arrive every 20–30 seconds. Try another category.' : 'Check back soon. New drops arrive every 20–30 seconds.'}</p>
      <button className={`${s.btn} ${s.btnClaim} ${s.btnInline}`} onClick={filtered ? onReset : onRefresh}>
        {filtered ? 'Clear filters' : 'Refresh'}
      </button>
    </div>
  )
}
