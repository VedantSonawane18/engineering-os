import { API_BASE_URL } from './apiBase'
export type DashboardApprovalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'

export interface DashboardData {
  readonly user: {
    readonly id: string
    readonly fullName: string
    readonly email: string
    readonly role: string
  }

  readonly approval: {
    readonly status: DashboardApprovalStatus
  }

  readonly academic: {
    readonly configured: boolean
  }

  readonly technology: {
    readonly configured: boolean
  }

  readonly queries: {
    readonly open: number
  }

  readonly tickets: {
    readonly open: number
  }
}

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `Dashboard request failed with status ${response.status}`,
    )
  }

  return response.json() as Promise<DashboardData>
}