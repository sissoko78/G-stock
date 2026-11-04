import { createContext } from 'react'
import type { AuthSession } from './AuthProvider'

export interface AuthState {
  loading: boolean
  configured: boolean
  session: AuthSession | null
  error: string | null
  signOut: () => Promise<void>
}

export const AuthContext = createContext<AuthState | null>(null)
