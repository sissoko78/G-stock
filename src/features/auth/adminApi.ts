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
  const responseText = await response.text()
  let payload: unknown
  try {
    payload = responseText ? JSON.parse(responseText) : null
  } catch {
    if (!response.ok) throw new Error('La demande a échoué. Réessayez dans quelques instants.')
    throw new Error('Le serveur a renvoyé une réponse inattendue. Rechargez la page et réessayez.')
  }
  if (!response.ok) throw new Error(readApiMessage(payload))
  if (!isRecord(payload)) throw new Error('Le serveur a renvoyé une réponse vide. Rechargez la page et réessayez.')
  if (method === 'GET' && !Array.isArray(payload.companies)) {
    throw new Error('La liste des entreprises n’a pas pu être lue. Rechargez la page et réessayez.')
  }
  return payload as { companies: CompanySummary[]; companyId?: string; ownerEmail?: string }
}

function readApiMessage(payload: unknown): string {
  if (isRecord(payload) && typeof payload.error === 'string') return payload.error
  return 'La demande a échoué.'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
