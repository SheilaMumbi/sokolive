import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '../api'
import { useCart } from './cartStore'
import { useFeed } from './feedStore'
import { useToasts } from './toastStore'

vi.mock('../api', async (orig) => {
  const actual = await orig<typeof import('../api')>()
  return { ...actual, api: { feed: vi.fn(), claim: vi.fn(), release: vi.fn().mockResolvedValue({ ok: true }) } }
})
import { api } from '../api'

const item = {
  id: 'i1', lot: 101, name: 'Nike Air Max', brand: 'Nike', category: 'shoes' as const, price: 6500,
  size: 'EU 42', condition: '9/10', seller: 'Test', art: { shape: 'tote' as const, bg: '#fff', a: '#000', b: '#111', c: '#222' },
  startsAt: Date.now(), endsAt: Date.now() + 60_000, claimed: false, claimState: 'available' as const,
}
const stateOf = () => useFeed.getState().items[0].claimState

describe('claim flow', () => {
  beforeEach(() => {
    vi.mocked(api.claim).mockReset()
    useCart.setState({ lines: [] })
    useToasts.setState({ toasts: [] })
    useFeed.setState({ items: [{ ...item }], pending: [], status: 'ready' })
  })

  it('updates the UI and cart optimistically, before the server answers', () => {
    vi.mocked(api.claim).mockReturnValue(new Promise(() => {})) // never resolves
    useFeed.getState().claim('i1')
    expect(stateOf()).toBe('pending')
    expect(useCart.getState().lines.map((l) => l.id)).toEqual(['i1'])
  })

  it('confirms on success', async () => {
    vi.mocked(api.claim).mockResolvedValue({ ok: true })
    await useFeed.getState().claim('i1')
    expect(stateOf()).toBe('mine')
    expect(useCart.getState().lines).toHaveLength(1)
  })

  it('rolls back and shows a clear message when the server rejects (already claimed)', async () => {
    vi.mocked(api.claim).mockRejectedValue(new ApiError('Too slow — someone else claimed it', 409))
    await useFeed.getState().claim('i1')
    expect(stateOf()).toBe('taken')
    expect(useCart.getState().lines).toHaveLength(0)
    const toast = useToasts.getState().toasts.slice(-1)[0]
    expect(toast.kind).toBe('error')
    expect(toast.message).toMatch(/gone/i)
  })

  it('rolls back to claimable on a network failure so the user can retry', async () => {
    vi.mocked(api.claim).mockRejectedValue(new ApiError('Network problem', 0))
    await useFeed.getState().claim('i1')
    expect(stateOf()).toBe('available')
    expect(useCart.getState().lines).toHaveLength(0)
  })

  it('ignores a second tap while the first claim is in flight', async () => {
    vi.mocked(api.claim).mockResolvedValue({ ok: true })
    const p = useFeed.getState().claim('i1')
    useFeed.getState().claim('i1')
    await p
    expect(api.claim).toHaveBeenCalledTimes(1)
  })

  it('does not claim an expired item', async () => {
    useFeed.setState({ items: [{ ...item, endsAt: Date.now() - 1 }] })
    await useFeed.getState().claim('i1')
    expect(api.claim).not.toHaveBeenCalled()
  })
})
