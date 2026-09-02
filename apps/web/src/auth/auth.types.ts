export type UserRole = 'STUDENT' | 'ADMIN'

export type ApprovalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'

export interface AuthUser {
  readonly id: string
  readonly fullName: string
  readonly email: string
  readonly phoneNumber: string | null
  readonly role: UserRole
  readonly approvalStatus: ApprovalStatus
}

export interface LoginInput {
  readonly email: string
  readonly password: string
}

export interface RegisterInput {
  readonly fullName: string
  readonly email: string
  readonly phoneNumber: string
  readonly password: string
}

export interface AuthError {
  readonly message: string
}