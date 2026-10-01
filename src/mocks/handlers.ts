import { http, HttpResponse, delay } from 'msw'
import { control } from './control'
import { artFor } from '../palettes'
import type { FeedEvent, HostDraft, Product } from '../types'

import { TEMPLATES, type Template } from './data'

/**
 * In-memory "server". MSW runs these handlers in the page, so state resets on a
 * full reload (the cart is persisted client-side, which is what the brief asks for).
 *
 * Live push is simulated lazily: every request checks the server clock and
 * publishes any items that are due (one every 20–30 s). The client polls.
 */
const PUSH_MIN = 20_000
const PUSH_MAX = 30_000
const MAX_ITEMS = 48
const WHO = ['Achieng', 'Kamau', 'Njeri', 'Otieno', 'Mwende', 'Barasa', 'Zawadi', 'Kiprono', 'Wambui', 'Juma', 'Amani', 'Chebet']
const CHAT = [
  'is this still available??',
  'what’s the size on this one?',
  'drop them faster 😭',
  'Nairobi delivery same day?',
  'M-Pesa ready 💸',
  'that colourway is crazy',
  'lowest price pls',
  'restock of the Dunks next week?',
  'Westlands pickup works?',
]

let seq = 0
let eventSeq = 0
let items: Product[] = []
let events: FeedEvent[] = []
let nextPushAt = 0
let tplOrder: Template[] = []
let viewers = 212

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
const emit = (e: Omit<FeedEvent, 'id'>) => {
  events.unshift({ id: ++eventSeq, ...e })
  events = events.slice(0, 20)
}
const nextTemplate = () => {
  if (!tplOrder.length) tplOrder = [...TEMPLATES].sort(() => Math.random() - 0.5)
  return tplOrder.pop()!
}

function push(at: number, lifetime: number, announce = true) {
  const t = nextTemplate()
  const lot = 100 + ++seq
  items.unshift({
    id: `lot-${lot}`,
    lot,
    name: t.name,
    brand: t.brand,
    category: t.category,
    price: t.price,
    size: t.size,
    condition: t.condition,
    seller: t.seller,
    art: artFor(t.shape, t.pal),
    photo: t.photo,
    startsAt: at,
    endsAt: at + lifetime,
    claimed: false,
  })
  items = items.slice(0, MAX_ITEMS)
  if (announce) emit({ kind: 'drop', text: `New drop · ${t.brand} ${t.name}` })
}

export function resetServer() {
  seq = 0
  items = []
  events = []
  const now = Date.now()
  // Seed a busy wall: older lots first so the newest ends up on top. Some already ended/claimed.
  for (let i = 26; i > 0; i--) {
    const age = i * 18_000
    push(now - age, age + (i % 5 === 0 ? -5_000 : rand(20_000, 300_000)), false)
    if (i % 4 === 0) items[0].claimed = true
  }
  for (let i = 0; i < 7; i++) emit({ kind: i === 3 ? 'claim' : 'chat', who: pick(WHO), text: i === 3 ? `claimed ${items[3].brand} ${items[3].name}` : pick(CHAT) })
  nextPushAt = now + rand(PUSH_MIN, PUSH_MAX)
}

function claimBy(it: Product, who = pick(WHO)) {
  it.claimed = true
  emit({ kind: 'claim', who, text: `claimed ${it.brand} ${it.name}` })
}

function tick() {
  const now = Date.now()
  while (now >= nextPushAt) {
    push(nextPushAt, rand(150_000, 330_000))
    nextPushAt += rand(PUSH_MIN, PUSH_MAX)
  }
  // Other shoppers occasionally grab a live item; the newest ones are hotter.
  items.forEach((it, i) => {
    if (it.claimed || it.endsAt <= now) return
    const chance = it.own ? 0.12 : i < 3 ? 0.07 : 0.025
    if (Math.random() < chance) claimBy(it)
  })
  if (Math.random() < 0.55) emit({ kind: 'chat', who: pick(WHO), text: pick(CHAT) })
  viewers = Math.max(80, Math.min(520, viewers + Math.round(rand(-9, 10))))
}

const snapshot = () => ({ items, events, viewers, serverTime: Date.now() })

resetServer()

export const handlers = [
  http.get('/api/feed', async () => {
    await delay(250 + Math.random() * 450)
    if (control.offline) return HttpResponse.error()
    tick()
    return HttpResponse.json(snapshot())
  }),

  http.post('/api/items', async ({ request }) => {
    await delay(500 + Math.random() * 400)
    if (control.offline) return HttpResponse.error()
    const d = (await request.json()) as HostDraft
    const name = String(d.name ?? '').trim()
    if (name.length < 3 || name.length > 60)
      return HttpResponse.json({ error: 'Give the item a name (3–60 characters)' }, { status: 422 })
    if (!(d.price >= 100 && d.price <= 200_000))
      return HttpResponse.json({ error: 'Price must be between KES 100 and 200,000' }, { status: 422 })
    const now = Date.now()
    const lot = 100 + ++seq
    const item: Product = {
      id: `lot-${lot}`,
      lot,
      name,
      brand: 'Your drop',
      category: d.category,
      price: Math.round(d.price),
      size: d.size?.trim() || 'One size',
      condition: 'Pre-loved',
      seller: 'You',
      art: artFor(d.shape, d.palette),
      photo: typeof d.photo === 'string' && d.photo.startsWith('blob:') ? d.photo : undefined,
      startsAt: now,
      endsAt: now + Math.min(10, Math.max(1, d.minutes)) * 60_000,
      claimed: false,
      own: true,
    }
    items.unshift(item)
    items = items.slice(0, MAX_ITEMS)
    emit({ kind: 'drop', text: `New drop · ${name} (yours)` })
    return HttpResponse.json(item, { status: 201 })
  }),

  http.post('/api/items/:id/claim', async ({ params }) => {
    await delay(400 + Math.random() * 600)
    if (control.offline) return HttpResponse.error()
    const it = items.find((i) => i.id === params.id)
    if (!it) return HttpResponse.json({ error: 'Item not found' }, { status: 404 })
    if (it.endsAt <= Date.now())
      return HttpResponse.json({ error: 'This drop has ended' }, { status: 410 })
    // Race condition: someone else may claim between the user's tap and our check.
    if (it.claimed || Math.random() < 0.15) {
      if (!it.claimed) claimBy(it)
      return HttpResponse.json({ error: 'Too slow — someone else claimed it' }, { status: 409 })
    }
    it.claimed = true
    emit({ kind: 'claim', who: 'You', text: `claimed ${it.brand} ${it.name}` })
    return HttpResponse.json({ ok: true })
  }),

  http.post('/api/items/:id/release', async ({ params }) => {
    await delay(150)
    const it = items.find((i) => i.id === params.id)
    if (it && it.endsAt > Date.now()) it.claimed = false
    return HttpResponse.json({ ok: true })
  }),
]
