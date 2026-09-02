import { API_BASE_URL } from '../api/apiBase'

export type ApprovalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'

export interface AdminStudent {
  readonly id: string
  readonly fullName: string
  readonly email: string
  readonly approvalStatus: ApprovalStatus
  readonly createdAt: string
  readonly updatedAt: string
}

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${url}`,
    {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`,
    )
  }

  return response.json() as Promise<T>
}

export async function getAdminStudents(): Promise<
  AdminStudent[]
> {
  return request<AdminStudent[]>(
    '/api/admin/students',
  )
}

export async function getAdminStudent(
  id: string,
): Promise<AdminStudent> {
  return request<AdminStudent>(
    `/api/admin/students/${id}`,
  )
}

export async function markStudentUnderReview(
  id: string,
): Promise<AdminStudent> {
  return request<AdminStudent>(
    `/api/admin/students/${id}/review`,
    {
      method: 'POST',
    },
  )
}

export async function approveStudent(
  id: string,
): Promise<AdminStudent> {
  return request<AdminStudent>(
    `/api/admin/students/${id}/approve`,
    {
      method: 'POST',
    },
  )
}

export async function rejectStudent(
  id: string,
): Promise<AdminStudent> {
  return request<AdminStudent>(
    `/api/admin/students/${id}/reject`,
    {
      method: 'POST',
    },
  )
}
export async function deleteStudent(
  id: string,
): Promise<void> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/students/${id}`,
    {
      method: 'DELETE',
      credentials: 'include',
    },
  )

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}.`

    try {
      const body = (await response.json()) as {
        message?: string
      }

      if (body.message) {
        message = body.message
      }
    } catch {
      // Keep the default message.
    }

    throw new Error(message)
  }
}

export type AdminPaymentStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'

export interface AdminPayment {
  readonly id: string
  readonly studentId: string
  readonly studentName: string
  readonly studentEmail: string
  readonly method: string
  readonly referenceType: 'TRANSACTION_ID' | 'UTR'
  readonly referenceValue: string
  readonly status: AdminPaymentStatus
  readonly submittedAt: string
  readonly reviewedAt: string | null
  readonly reviewedByEmail: string | null
  readonly reviewNote: string | null
  readonly screenshotAvailable: boolean
}

/**
 * Returns null when the student has not submitted a
 * payment yet (backend returns 204 for this route).
 */
export async function getAdminPaymentByStudent(
  studentId: string,
): Promise<AdminPayment | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/payments/student/${studentId}`,
    {
      credentials: 'include',
      headers: { Accept: 'application/json' },
    },
  )

  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`,
    )
  }

  return response.json() as Promise<AdminPayment>
}

export async function getAdminPayments(
  status?: AdminPaymentStatus,
): Promise<AdminPayment[]> {
  const query = status ? `?status=${status}` : ''

  return request<AdminPayment[]>(
    `/api/admin/payments${query}`,
  )
}

export async function markPaymentUnderReview(
  id: string,
): Promise<AdminPayment> {
  return request<AdminPayment>(
    `/api/admin/payments/${id}/review`,
    { method: 'POST' },
  )
}

export async function verifyPayment(
  id: string,
): Promise<AdminPayment> {
  return request<AdminPayment>(
    `/api/admin/payments/${id}/verify`,
    { method: 'POST' },
  )
}

export async function rejectPayment(
  id: string,
  note?: string,
): Promise<AdminPayment> {
  return request<AdminPayment>(
    `/api/admin/payments/${id}/reject`,
    {
      method: 'POST',
      body: JSON.stringify({ note: note ?? null }),
    },
  )
}

/**
 * Fetches a payment screenshot as a credentialed blob
 * and returns an object URL. Caller should revoke it
 * (URL.revokeObjectURL) when no longer needed.
 */
export async function getAdminPaymentScreenshotUrl(
  paymentId: string,
): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/payments/${paymentId}/screenshot`,
    { credentials: 'include' },
  )

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}.`,
    )
  }

  const blob = await response.blob()

  return URL.createObjectURL(blob)
}