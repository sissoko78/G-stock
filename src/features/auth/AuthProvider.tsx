import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { firebaseAuth, isFirebaseConfigured } from '../../shared/services/firebase'
import { AuthContext } from './authContext'

export interface AuthSession {
  user: User
  isSuperAdmin: boolean
  tenantId: string | null
  tenantRole: string | null
  companyName: string | null
}

async function updateUserSession(user: User | null, active: () => boolean, onUpdate: (session: AuthSession | null, error?: string) => void) {
  if (!user) { onUpdate(null); return }
  try {
    const token = await user.getIdTokenResult(true)
    if (!active()) return
    const claims = token.claims
    onUpdate({
      user,
      isSuperAdmin: claims.superAdmin === true,
      tenantId: typeof claims.tenantId === 'string' ? claims.tenantId : null,
      tenantRole: typeof claims.tenantRole === 'string' ? claims.tenantRole : null,
      companyName: typeof claims.companyName === 'string' ? claims.companyName : null,
    })
  } catch {
    if (active()) onUpdate(null, 'Impossible de vérifier les droits de ce compte.')
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={useFirebaseSession()}>{children}</AuthContext.Provider>
}

function useFirebaseSession() {
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => watchFirebaseAuth(setLoading, setSession, setError), [])
  return useMemo(() => ({
    loading,
    configured: isFirebaseConfigured,
    session,
    error,
    signOut: async () => { if (firebaseAuth) await signOut(firebaseAuth) },
  }), [loading, session, error])
}

function watchFirebaseAuth(setLoading: (loading: boolean) => void, setSession: (session: AuthSession | null) => void, setError: (error: string | null) => void) {
  if (!firebaseAuth) return () => undefined
    let active = true
    const onUpdate = (nextSession: AuthSession | null, nextError?: string) => {
      setSession(nextSession)
      setError(nextError ?? null)
      setLoading(false)
    }
    const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
      setLoading(true)
      setError(null)
      void updateUserSession(user, () => active, onUpdate)
    })
  return () => { active = false; unsubscribe() }
}
