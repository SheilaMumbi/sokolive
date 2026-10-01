import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, it, vi } from 'vitest'
import { useFeed } from '../store/feedStore'
import { ProductCard } from './ProductCard'

const base = {
  id: 'i1', lot: 101, name: 'Canvas Tote', brand: 'Mitumba', category: 'bags' as const, price: 800, size: 'One size',
  condition: '9/10', seller: 'Test', art: { shape: 'tote' as const, bg: '#fff', a: '#000', b: '#111', c: '#222' }, startsAt: Date.now() - 1000, claimed: false,
}

beforeEach(() => useFeed.setState({ claim: vi.fn() }))

it('claims via keyboard-accessible button with a descriptive label', async () => {
  render(<ul><ProductCard item={{ ...base, endsAt: Date.now() + 30_000, claimState: 'available' }} /></ul>)
  await userEvent.click(screen.getByRole('button', { name: /claim canvas tote for kes 800/i }))
  expect(useFeed.getState().claim).toHaveBeenCalledWith('i1')
})

it('shows Ended and disables the button once the timer is up', () => {
  render(<ul><ProductCard item={{ ...base, endsAt: Date.now() - 1000, claimState: 'available' }} /></ul>)
  expect(screen.getByRole('button', { name: /ended/i })).toBeDisabled()
  expect(screen.getByRole('timer')).toHaveAccessibleName(/ended/i)
})

it('shows Sold out when someone else claimed it', () => {
  render(<ul><ProductCard item={{ ...base, endsAt: Date.now() + 30_000, claimState: 'taken' }} /></ul>)
  expect(screen.getByRole('button', { name: /sold out/i })).toBeDisabled()
})
