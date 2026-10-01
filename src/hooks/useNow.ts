import { useSyncExternalStore } from 'react'

/**
 * One shared 1 s ticker for the whole app. Components subscribe through
 * useSyncExternalStore with a *derived* snapshot, so React only re-renders the
 * ones whose derived value actually changed — the feed itself never re-renders.
 */
const listeners = new Set<() => void>()
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (!timer) timer = setInterval(() => listeners.forEach((l) => l()), 1000)
  return () => {
    listeners.delete(cb)
    if (!listeners.size && timer) {
      clearInterval(timer)
      timer = undefined
    }
  }
}

/** Whole seconds left until `endsAt` (never negative). Re-renders once per second. */
export function useSecondsLeft(endsAt: number) {
  return useSyncExternalStore(subscribe, () => Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
}

/** Boolean that flips once when the deadline passes. Re-renders exactly once. */
export function useEnded(endsAt: number) {
  return useSyncExternalStore(subscribe, () => Date.now() >= endsAt)
}
