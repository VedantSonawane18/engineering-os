import { API_BASE_URL } from './apiBase'

export type PaymentMethod =
  | 'UPI'
  | 'BANK_TRANSFER'
  | 'CARD'
  | 'OTHER'

export type TransactionReferenceType =
  | 'TRANSACTION_ID'
  | 'UTR'

export type PaymentStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'

export interface PaymentData {
  readonly id: string
  readonly method: PaymentMethod
  readonly referenceType: TransactionReferenceType
  readonly referenceValue: string
  readonly status: PaymentStatus
  readonly submittedAt: string
  readonly reviewedAt: string | null
  readonly reviewNote: string | null
  readonly screenshotAvailable: boolean
}

export interface SubmitPaymentInput {
  readonly method: PaymentMethod
  readonly referenceType: TransactionReferenceType
  readonly referenceValue: string
  readonly screenshot: File
}

async function parseErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const body = (await response.json()) as {
      message?: string
    }

    return body.message ?? 'Something went wrong.'
  } catch {
    return 'Something went wrong.'
  }
}

/**
 * Returns null when the student has not submitted a
 * payment yet (backend returns 404 for /me in that
 * case) instead of treating it as an error.
 */
export async function fetchMyPayment(): Promise<PaymentData | null> {
  const response = await fetch(
    `${API_BASE_URL}/api/payments/me`,
    {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    },
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json() as Promise<PaymentData>
}

export async function submitPayment(
  input: SubmitPaymentInput,
): Promise<PaymentData> {
  const formData = new FormData()

  formData.append('method', input.method)
  formData.append('referenceType', input.referenceType)
  formData.append('referenceValue', input.referenceValue)
  formData.append('screenshot', input.screenshot)

  const response = await fetch(
    `${API_BASE_URL}/api/payments/me`,
    {
      method: 'POST',
      credentials: 'include',
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  return response.json() as Promise<PaymentData>
}

/**
 * Fetches the current student's payment screenshot as
 * a credentialed blob and returns an object URL. The
 * caller is responsible for revoking it when done
 * (URL.revokeObjectURL) to avoid leaking memory.
 */
export async function fetchMyScreenshotUrl(): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/payments/me/screenshot`,
    {
      credentials: 'include',
    },
  )

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response))
  }

  const blob = await response.blob()

  return URL.createObjectURL(blob)
}
