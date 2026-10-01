import { beforeEach, describe, expect, it } from 'vitest'
import { cartTotal, useCart } from './cartStore'

const art = { shape: 'tote' as const, bg: '#fff', a: '#000', b: '#111', c: '#222' }
const line = (id: string, price: number) => ({ id, lot: 101, name: id, brand: 'Nike', price, art })

describe('cart', () => {
  beforeEach(() => {
    localStorage.clear()
    useCart.setState({ lines: [] })
  })

  it('adds items and computes the KES total', () => {
    useCart.getState().add(line('a', 1500))
    useCart.getState().add(line('b', 2300))
    expect(useCart.getState().lines).toHaveLength(2)
    expect(cartTotal(useCart.getState().lines)).toBe(3800)
  })

  it('ignores duplicate adds (each drop is a unique item)', () => {
    useCart.getState().add(line('a', 1500))
    useCart.getState().add(line('a', 1500))
    expect(useCart.getState().lines).toHaveLength(1)
  })

  it('removes items and updates the total', () => {
    useCart.getState().add(line('a', 1500))
    useCart.getState().add(line('b', 2300))
    useCart.getState().remove('a')
    expect(cartTotal(useCart.getState().lines)).toBe(2300)
  })

  it('persists to localStorage so it survives a refresh', () => {
    useCart.getState().add(line('a', 1500))
    const saved = JSON.parse(localStorage.getItem('soko-cart')!)
    expect(saved.state.lines[0].id).toBe('a')
  })

  it('rehydrates from localStorage', async () => {
    localStorage.setItem('soko-cart', JSON.stringify({ state: { lines: [line('z', 900)] }, version: 0 }))
    await useCart.persist.rehydrate()
    expect(useCart.getState().lines.map((l) => l.id)).toEqual(['z'])
  })
})
