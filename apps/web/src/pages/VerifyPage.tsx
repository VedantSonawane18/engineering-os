import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { useAuth } from '../auth/useAuth'
import {
  resendVerification,
  verifyEmail,
} from '../auth/authApi'

interface VerifyLocationState {
  readonly email?: string
}

export function VerifyPage() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    user,
    isLoading: authLoading,
    refreshUser,
  } = useAuth()

  const state =
    location.state as VerifyLocationState | null

  const initialEmail =
    state?.email ?? user?.email ?? ''

  const [email, setEmail] =
    useState(initialEmail)

  const [emailCode, setEmailCode] =
    useState('')

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const [isResending, setIsResending] =
    useState(false)

  if (authLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <span>
          RESTORING SESSION...
        </span>
      </main>
    )
  }

  if (
    user &&
    user.emailVerified
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  async function handleVerification(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const normalizedEmail =
      email.trim()

    if (
      !normalizedEmail ||
      emailCode.length !== 6
    ) {
      return
    }

    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      await verifyEmail(
        normalizedEmail,
        emailCode,
      )

      /*
       * The verification request updates the database,
       * but the React auth context still contains the
       * pre-verification user object.
       *
       * Refresh /me so AuthProvider receives the new
       * emailVerified=true state before navigating.
       */
      const updatedUser =
        await refreshUser()

      if (
        !updatedUser ||
        !updatedUser.emailVerified
      ) {
        setError(
          'Your email was verified, but your session could not be refreshed. Please log in again.',
        )

        return
      }

      setEmailCode('')

      setMessage(
        'Email verified successfully. Opening your Engineering OS dashboard...',
      )

      navigate(
        '/dashboard',
        {
          replace: true,
        },
      )
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to verify your email.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend() {
    const normalizedEmail =
      email.trim()

    if (!normalizedEmail) {
      setError(
        'Enter your email address first.',
      )

      return
    }

    setError('')
    setMessage('')
    setIsResending(true)

    try {
      await resendVerification(
        normalizedEmail,
      )

      setEmailCode('')

      setMessage(
        'A new verification code has been sent. Check your inbox and SPAM / JUNK folder.',
      )
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to resend the verification code.',
      )
    } finally {
      setIsResending(false)
    }
  }

  return (
    <AuthShell
      eyebrow="03 / VERIFY ACCOUNT"
      title={
        <>
          Verify your
          <br />
          <em>email.</em>
        </>
      }
      description="Enter the six-digit verification code sent to your registered email address before continuing into Engineering OS."
      footer={
        <p>
          Already verified?{' '}
          <Link to="/login">
            Return to login
          </Link>
        </p>
      }
    >
      <div className="auth-form">
        <label>
          <span>EMAIL ADDRESS</span>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value,
              )
            }
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={
              isSubmitting ||
              isResending
            }
          />
        </label>

        <div
          style={{
            border:
              '1px solid rgba(196, 214, 60, 0.35)',
            background:
              'rgba(196, 214, 60, 0.06)',
            padding:
              '0.9rem 1rem',
            marginTop: '0.5rem',
            marginBottom: '0.25rem',
          }}
        >
          <p
            style={{
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong>
              IMPORTANT:
            </strong>{' '}
            Check your{' '}
            <strong>
              SPAM / JUNK
            </strong>{' '}
            folder if you do not see the
            verification email in your inbox.
          </p>
        </div>

        <form
          onSubmit={handleVerification}
          className="auth-form"
        >
          <label>
            <span>EMAIL OTP</span>

            <input
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={emailCode}
              onChange={(event) =>
                setEmailCode(
                  event.target.value.replace(
                    /\D/g,
                    '',
                  ),
                )
              }
              placeholder="6-digit code"
              autoComplete="one-time-code"
              required
              disabled={
                isSubmitting ||
                isResending
              }
            />
          </label>

          <button
            className="auth-submit"
            type="submit"
            disabled={
              isSubmitting ||
              isResending ||
              emailCode.length !== 6
            }
          >
            <span>
              {isSubmitting
                ? 'VERIFYING EMAIL...'
                : 'VERIFY EMAIL'}
            </span>

            <span aria-hidden="true">
              →
            </span>
          </button>
        </form>

        {error && (
          <p
            className="auth-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {message && (
          <p className="auth-success">
            {message}
          </p>
        )}

        <button
          type="button"
          className="auth-submit"
          onClick={() =>
            void handleResend()
          }
          disabled={
            isSubmitting ||
            isResending ||
            !email.trim()
          }
        >
          <span>
            {isResending
              ? 'SENDING...'
              : 'RESEND CODE'}
          </span>

          <span aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </AuthShell>
  )
}