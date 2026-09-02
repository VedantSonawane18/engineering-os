import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from './authApi'

import { AuthContext } from './AuthContext'

import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from './auth.types'

interface AuthProviderProps {
  readonly children: ReactNode
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser()

      setUser(currentUser)

      return currentUser
    } catch {
      setUser(null)

      return null
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function restoreSession() {
      try {
        const currentUser = await getCurrentUser()

        if (mounted) {
          setUser(currentUser)
        }
      } catch {
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void restoreSession()

    return () => {
      mounted = false
    }
  }, [])

  const login = useCallback(
    async (input: LoginInput) => {
      const authenticatedUser =
        await loginRequest(input)

      setUser(authenticatedUser)

      return authenticatedUser
    },
    [],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const authenticatedUser =
        await registerRequest(input)

      setUser(authenticatedUser)

      return authenticatedUser
    },
    [],
  )

  const logout = useCallback(async () => {
    await logoutRequest()

    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
    ],
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}