import { createContext } from 'react'
import type { AuthUser, LoginInput, RegisterInput } from './auth.types'

export interface AuthContextValue {
  readonly user: AuthUser | null
  readonly isLoading: boolean
  readonly isAuthenticated: boolean
  readonly login: (input: LoginInput) => Promise<AuthUser>
  readonly register: (input: RegisterInput) => Promise<AuthUser>
  readonly logout: () => Promise<void>
  readonly refreshUser: () => Promise<AuthUser | null>
}

export const AuthContext =
  createContext<AuthContextValue | null>(null)