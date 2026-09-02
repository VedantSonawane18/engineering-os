import { useCallback, useEffect, useState } from 'react'
import {
  fetchDashboard,
  type DashboardData,
} from '../api/dashboard'

interface DashboardState {
  readonly data: DashboardData | null
  readonly isLoading: boolean
  readonly error: string | null
}

export function useDashboard(): DashboardState & {
  readonly refresh: () => Promise<void>
} {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboard = useCallback(async () => {
    try {
      const dashboard = await fetchDashboard()

      setData(dashboard)
      setError(null)
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : 'Unable to load dashboard.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadDashboard])

  const refresh = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    await loadDashboard()
  }, [loadDashboard])

  return {
    data,
    isLoading,
    error,
    refresh,
  }
}