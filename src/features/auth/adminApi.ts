import type { AuthSession } from './AuthProvider'

export interface CompanySummary {
  id: string
  name: string
  ownerEmail: string
  status: string
  createdAt?: string | null
}

export async function adminRequest(session: AuthSession | null, method: 'GET' | 'POST', body?: object) {
  const token = await session?.user.getIdToken()
  if (!token) throw new Error('Votre session a expiré. Reconnectez-vous.')
  const response = await fetch('/api/admin/companies', {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) throw new Error(readApiMessage(payload))
  return payload as { companies?: CompanySummary[]; companyId?: string; ownerEmail?: string }
}

function readApiMessage(payload: unknown): string {
  if (typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string') return payload.error
  return 'La demande a échoué.'
}
