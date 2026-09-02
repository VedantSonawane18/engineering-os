import type {
  AuthUser,
  LoginInput,
  RegisterInput,
} from './auth.types'

import { API_BASE_URL } from '../api/apiBase'

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    },
  )

  if (!response.ok) {
    let message = 'Something went wrong.'

    try {
      const error =
        (await response.json()) as {
          message?: string
        }

      if (error.message) {
        message = error.message
      }
    } catch {
      // Keep the generic error message.
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export function register(
  input: RegisterInput,
): Promise<AuthUser> {
  return request<AuthUser>(
    '/api/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export function login(
  input: LoginInput,
): Promise<AuthUser> {
  return request<AuthUser>(
    '/api/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export function getCurrentUser(): Promise<AuthUser> {
  return request<AuthUser>(
    '/api/auth/me',
  )
}

export function logout(): Promise<void> {
  return request<void>(
    '/api/auth/logout',
    {
      method: 'POST',
    },
  )
}