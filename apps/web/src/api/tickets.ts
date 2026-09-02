import { API_BASE_URL } from './apiBase'

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_STUDENT'
  | 'RESOLVED'
  | 'CLOSED'

export interface Ticket {
  readonly id: string
  readonly subject: string
  readonly status: TicketStatus
  readonly studentName: string
  readonly studentEmail: string
  readonly createdAt: string
  readonly updatedAt: string
}

export interface TicketMessage {
  readonly id: string
  readonly senderId: string
  readonly senderName: string
  readonly senderRole: 'STUDENT' | 'ADMIN'
  readonly message: string
  readonly createdAt: string
}

export interface TicketDetail extends Ticket {
  readonly messages: TicketMessage[]
}

export interface CreateTicketInput {
  readonly subject: string
  readonly message: string
}

export interface CreateTicketMessageInput {
  readonly message: string
}

export interface UpdateTicketStatusInput {
  readonly status: TicketStatus
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
        Accept: 'application/json',
        ...(options?.headers ?? {}),
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      await parseErrorMessage(response),
    )
  }

  return response.json() as Promise<T>
}

export async function createTicket(
  input: CreateTicketInput,
): Promise<TicketDetail> {
  return request<TicketDetail>(
    '/api/tickets',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export async function getMyTickets(): Promise<
  Ticket[]
> {
  return request<Ticket[]>(
    '/api/tickets',
  )
}

export async function getMyTicket(
  id: string,
): Promise<TicketDetail> {
  return request<TicketDetail>(
    `/api/tickets/${encodeURIComponent(id)}`,
  )
}

export async function sendStudentMessage(
  id: string,
  input: CreateTicketMessageInput,
): Promise<TicketDetail> {
  return request<TicketDetail>(
    `/api/tickets/${encodeURIComponent(id)}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export async function getAdminTickets(
  status?: TicketStatus,
): Promise<Ticket[]> {
  const query = status
    ? `?status=${encodeURIComponent(status)}`
    : ''

  return request<Ticket[]>(
    `/api/admin/tickets${query}`,
  )
}

export async function getAdminTicket(
  id: string,
): Promise<TicketDetail> {
  return request<TicketDetail>(
    `/api/admin/tickets/${encodeURIComponent(id)}`,
  )
}

export async function sendAdminMessage(
  id: string,
  input: CreateTicketMessageInput,
): Promise<TicketDetail> {
  return request<TicketDetail>(
    `/api/admin/tickets/${encodeURIComponent(id)}/messages`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}

export async function updateAdminTicketStatus(
  id: string,
  input: UpdateTicketStatusInput,
): Promise<TicketDetail> {
  return request<TicketDetail>(
    `/api/admin/tickets/${encodeURIComponent(id)}/status`,
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
}