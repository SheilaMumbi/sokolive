import { useEffect, useRef, useState } from 'react'
import { useFeed } from '../store/feedStore'
import type { Category } from '../types'
import { FilterSheet } from './FilterSheet'
import { Hero } from './Hero'
import { HowItWorks } from './HowItWorks'
import { ArrowUpIcon, FilterIcon } from './Icons'
import { ProductCard } from './ProductCard'
import { EmptyState, ErrorState, SkeletonHero, SkeletonList } from './States'
import s from '../app.module.css'

const FILTERS: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'tops', label: 'Tops' },
  { id: 'bags', label: 'Bags' },
]

const POLL_MS = 5000
const SCROLLED = 120

export function Feed() {
  const status = useFeed((st) => st.status)
  const error = useFeed((st) => st.error)
  const items = useFeed((st) => st.items)
  const pendingCount = useFeed((st) => st.pending.length)
  const stale = useFeed((st) => st.stale)
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [liveOnly, setLiveOnly] = useState(false)
  const sheet = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const { load, poll } = useFeed.getState()
    load()
    // Skip polling while the tab is hidden: saves data on patchy mobile connections.
    const id = setInterval(() => {
      if (!document.hidden) poll({ hold: window.scrollY > SCROLLED })
    }, POLL_MS)
    return () => clearInterval(id)
  }, [])

  // Items that arrived while scrolled down are held back so nothing jumps; release them at the top.
  useEffect(() => {
    if (!pendingCount) return
    const onScroll = () => window.scrollY <= SCROLLED && useFeed.getState().flushPending()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pendingCount])

  const now = Date.now()
  const wall = items
    .slice(1) // the newest lot is on air above
    .filter((i) => filter === 'all' || i.category === filter)
    .filter((i) => !liveOnly || (i.claimState !== 'taken' && i.endsAt > now))
  const liveCount = items.filter((i) => i.claimState !== 'taken' && i.endsAt > now).length
  const filtered = filter !== 'all' || liveOnly

  return (
    <main id="main">
      {stale && status === 'ready' && (
        <p className={s.banner} role="status">
          Connection lost. Showing the last items we got, retrying…
        </p>
      )}

      {status === 'loading' && <SkeletonHero />}
      {status === 'ready' && <Hero />}
      {status === 'ready' && <HowItWorks />}

      <div className={s.wallHead} id="wall">
        <div className={s.wallTitleRow}>
          <h2 className={s.wallTitle}>Just dropped</h2>
          {status === 'ready' && <p className={s.count}>{liveCount} live now</p>}
        </div>
        <div className={s.filterBar}>
          <div className={s.filters} role="group" aria-label="Filter by category">
            {FILTERS.map((f) => (
              <button key={f.id} className={`${s.chip} ${filter === f.id ? s.chipOn : ''}`} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {f.label}
              </button>
            ))}
          </div>
          <button className={`${s.iconBtn} ${liveOnly ? s.iconBtnOn : ''}`} onClick={() => sheet.current?.showModal()} aria-label={liveOnly ? 'Filters, hiding ended items' : 'Filters'}>
            <FilterIcon />
          </button>
        </div>
      </div>

      {pendingCount > 0 && (
        <button
          className={s.newPill}
          onClick={() => {
            useFeed.getState().flushPending()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <ArrowUpIcon width={16} height={16} /> {pendingCount} new {pendingCount === 1 ? 'drop' : 'drops'}
        </button>
      )}

      {status === 'loading' && <SkeletonList />}
      {status === 'error' && <ErrorState message={error} onRetry={() => useFeed.getState().load()} />}
      {status === 'ready' && wall.length === 0 && (
        <EmptyState filtered={filtered} onRefresh={() => useFeed.getState().load()} onReset={() => { setFilter('all'); setLiveOnly(false) }} />
      )}
      {status === 'ready' && wall.length > 0 && (
        <ul className={s.grid} aria-label="Items on the wall">
          {wall.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </ul>
      )}

      <FilterSheet
        ref={sheet}
        category={filter}
        liveOnly={liveOnly}
        onApply={(c, l) => { setFilter(c); setLiveOnly(l) }}
      />
    </main>
  )
}
