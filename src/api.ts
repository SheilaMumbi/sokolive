import type { FeedResponse, HostDraft, Product } from './types'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, init)
  } catch {
    throw new ApiError('Network problem — check your connection and try again.', 0)
  }
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(body.error ?? 'Something went wrong', res.status)
  return body as T
}

export const api = {
  host: (draft: HostDraft) =>
    request<Product>('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    }),
  feed: () => request<FeedResponse>('/api/feed'),
  claim: (id: string) => request<{ ok: true }>(`/api/items/${id}/claim`, { method: 'POST' }),
  release: (id: string) => request<{ ok: true }>(`/api/items/${id}/release`, { method: 'POST' }),
}
