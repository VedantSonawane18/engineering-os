import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    try {
      const authenticatedUser = await login({
        email,
        password,
      })

      if (authenticatedUser.role === 'ADMIN') {
        navigate('/admin', {
          replace: true,
        })
      } else {
        navigate('/dashboard', {
          replace: true,
        })
      }
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to sign you in.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="02 / AUTHENTICATE"
      title={
        <>
          Welcome
          <br />
          <em>back.</em>
        </>
      }
      description="Continue where you left off and access your Engineering OS workspace."
      footer={
        <p>
          Don't have an account?{' '}
          <Link to="/signup">Create one</Link>
        </p>
      }
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <label>
          <span>EMAIL</span>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </label>

        <label>
          <span>PASSWORD</span>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="Your password"
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <button
          className="auth-submit"
          type="submit"
          disabled={isSubmitting}
        >
          <span>
            {isSubmitting
              ? 'AUTHENTICATING...'
              : 'LOGIN'}
          </span>

          <span aria-hidden="true">↗</span>
        </button>
      </form>
    </AuthShell>
  )
}