export type Category = 'shoes' | 'tops' | 'bags'
export type Shape = 'sneaker' | 'hightop' | 'tee' | 'hoodie' | 'jacket' | 'tote' | 'crossbody' | 'backpack'

/** Colourway used to draw the product illustration. */
export interface Art {
  shape: Shape
  bg: string
  a: string // main
  b: string // secondary
  c: string // accent
}

/** Server's view of an item. */
export interface Product {
  id: string
  lot: number
  name: string
  brand: string
  category: Category
  price: number // KES
  size: string
  condition: string
  seller: string
  art: Art
  /** Product photo URL. Optional: the UI falls back to the illustration if it's missing or fails to load. */
  photo?: string
  startsAt: number // epoch ms
  endsAt: number
  claimed: boolean
  own?: boolean
}

/** Client's view: server state plus who holds it. */
export type ClaimState = 'available' | 'pending' | 'mine' | 'taken'

export interface FeedItem extends Product {
  claimState: ClaimState
}

export interface FeedEvent {
  id: number
  kind: 'drop' | 'claim' | 'chat'
  who?: string
  text: string
}

export interface FeedResponse {
  items: Product[]
  events: FeedEvent[]
  viewers: number
  serverTime: number
}

export interface HostDraft {
  name: string
  category: Category
  shape: Shape
  price: number
  size: string
  minutes: number
  palette: number
  photo?: string
}
