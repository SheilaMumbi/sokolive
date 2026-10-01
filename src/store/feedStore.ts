import { create } from 'zustand'
import { api, ApiError } from '../api'
import type { ClaimState, FeedEvent, FeedItem, HostDraft, Product } from '../types'
import { useCart } from './cartStore'
import { useToasts } from './toastStore'

interface FeedState {
  items: FeedItem[]
  /** Items that arrived while the user was scrolled down. Shown behind a "new items" pill. */
  pending: FeedItem[]
  status: 'loading' | 'ready' | 'error'
  error: string | null
  /** True when a background refresh failed but we still have items to show. */
  stale: boolean
  viewers: number
  /** Recent viewer counts, for the header sparkline. */
  viewerHistory: number[]
  events: FeedEvent[]
  load: () => Promise<void>
  poll: (opts?: { hold?: boolean }) => Promise<void>
  flushPending: () => void
  claim: (id: string) => Promise<void>
  release: (id: string) => void
  host: (draft: HostDraft) => Promise<boolean>
}

const toItem = (p: Product): FeedItem => ({ ...p, claimState: p.claimed ? 'taken' : 'available' })

const setClaimState = (items: FeedItem[], id: string, claimState: ClaimState) =>
  items.map((i) => (i.id === id ? { ...i, claimState } : i))

export const useFeed = create<FeedState>((set, get) => ({
  items: [],
  pending: [],
  status: 'loading',
  error: null,
  stale: false,
  viewers: 0,
  viewerHistory: [],
  events: [],

  load: async () => {
    set({ status: 'loading', error: null })
    try {
      const res = await api.feed()
      set({ items: res.items.map(toItem), status: 'ready', viewers: res.viewers, viewerHistory: [res.viewers], events: res.events, stale: false })
    } catch (e) {
      set({ status: 'error', error: (e as Error).message })
    }
  },

  poll: async ({ hold = false } = {}) => {
    if (get().status !== 'ready') return
    let res
    try {
      res = await api.feed()
    } catch {
      set({ stale: true })
      return
    }
    const { items, pending } = get()
    const known = new Map([...items, ...pending].map((i) => [i.id, i]))
    const fresh: FeedItem[] = []
    const claimedByOthers: string[] = []

    for (const p of res.items) {
      const local = known.get(p.id)
      if (!local) fresh.push(toItem(p))
      else if (p.claimed && local.claimState === 'available') claimedByOthers.push(p.id)
    }

    const taken = new Set(claimedByOthers)
    const markTaken = (list: FeedItem[]) =>
      list.map((i) => (taken.has(i.id) ? { ...i, claimState: 'taken' as const } : i))

    set({
      viewers: res.viewers,
      viewerHistory: [...get().viewerHistory, res.viewers].slice(-24),
      events: res.events,
      stale: false,
      items: markTaken(hold ? items : [...fresh, ...items]),
      pending: markTaken(hold ? [...fresh, ...pending] : pending),
    })

    for (const id of claimedByOthers) {
      const it = known.get(id)!
      useToasts.getState().push(`Someone just claimed the ${it.name}!`)
    }
  },

  flushPending: () => set((s) => ({ items: [...s.pending, ...s.items], pending: [] })),

  claim: async (id) => {
    const item = get().items.find((i) => i.id === id)
    if (!item || item.claimState !== 'available' || Date.now() >= item.endsAt) return

    // Optimistic: flip the UI and add to cart before the server answers.
    set((s) => ({ items: setClaimState(s.items, id, 'pending') }))
    useCart.getState().add({
      id,
      lot: item.lot,
      name: item.name,
      brand: item.brand,
      price: item.price,
      art: item.art,
      photo: item.photo,
    })

    try {
      await api.claim(id)
      set((s) => ({ items: setClaimState(s.items, id, 'mine') }))
      useToasts.getState().push(`You claimed the ${item.name}!`, 'success')
    } catch (e) {
      // Roll back both the card and the cart, then explain why.
      const err = e as ApiError
      const lost = err.status === 409 || err.status === 410 || err.status === 404
      set((s) => ({ items: setClaimState(s.items, id, lost ? 'taken' : 'available') }))
      useCart.getState().remove(id)
      useToasts
        .getState()
        .push(
          lost
            ? `Sorry, the ${item.name} is gone. ${err.message}.`
            : `Couldn't claim the ${item.name}. ${err.message}`,
          'error',
        )
    }
  },

  release: (id) => {
    useCart.getState().remove(id)
    set((s) => ({
      items: s.items.map((i) => (i.id === id && i.claimState === 'mine' ? { ...i, claimState: 'available' } : i)),
    }))
    api.release(id).catch(() => {})
  },

  host: async (draft) => {
    try {
      const p = await api.host(draft)
      // The seller's own drop goes straight to the top of the wall, whatever the scroll position.
      set((s) => ({ items: [toItem(p), ...s.items] }))
      useToasts.getState().push(`${p.name} is live. Lot #${p.lot}`, 'success')
      return true
    } catch (e) {
      useToasts.getState().push((e as Error).message, 'error')
      return false
    }
  },
}))
