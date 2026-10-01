import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Art } from '../types'

export interface CartLine {
  id: string
  lot: number
  name: string
  brand: string
  price: number
  art: Art
  photo?: string
}

interface CartState {
  lines: CartLine[]
  add: (line: CartLine) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      // Every drop is a single unique item, so adding twice is a no-op.
      add: (line) =>
        set((s) => (s.lines.some((l) => l.id === line.id) ? s : { lines: [...s.lines, line] })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'soko-cart', partialize: (s) => ({ lines: s.lines }) },
  ),
)

export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.price, 0)
