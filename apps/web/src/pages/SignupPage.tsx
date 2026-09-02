import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router-dom'
import { AuthShell } from '../components/auth/AuthShell'
import { useAuth } from '../auth/useAuth'

export function SignupPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] =
    useState('')
  const [password, setPassword] =
    useState('')

  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    setError('')
    setIsSubmitting(true)

    try {
      await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        password,
      })

      navigate('/dashboard', {
        replace: true,
      })
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to create your account.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      eyebrow="01 / CREATE ACCOUNT"
      title={
        <>
          Enter the
          <br />
          <em>system.</em>
        </>
      }
      description="Create your Engineering OS account and continue directly into your dashboard."
      footer={
        <p>
          Already registered?{' '}
          <Link to="/login">Login</Link>
        </p>
      }
    >
      <form
        className="auth-form"
        onSubmit={handleSubmit}
      >
        <label>
          <span>FULL NAME</span>

          <input
            value={fullName}
            onChange={(event) =>
              setFullName(event.target.value)
            }
            placeholder="Your name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
          />
        </label>

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
          <span>PHONE NUMBER</span>

          <input
            type="tel"
            value={phoneNumber}
            onChange={(event) =>
              setPhoneNumber(event.target.value)
            }
            placeholder="+91 80104 03545"
            autoComplete="tel"
            required
            inputMode="tel"
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
            placeholder="At least 8 characters"
            autoComplete="new-password"
            required
            minLength={8}
            maxLength={72}
          />
        </label>

        {error && (
          <p
            className="auth-error"
            role="alert"
          >
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
              ? 'CREATING ACCOUNT...'
              : 'CREATE ACCOUNT'}
          </span>

          <span aria-hidden="true">
            →
          </span>
        </button>
      </form>
    </AuthShell>
  )
}