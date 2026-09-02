import {
  ArrowLeft,
  ArrowUpRight,
  Circle,
  Send,
} from 'lucide-react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import {
  useState,
  type FormEvent,
} from 'react'
import { useAuth } from '../auth/useAuth'
import { createTicket } from '../api/tickets'

export function QueryPage() {
  const {
    user,
    isLoading: authLoading,
  } = useAuth()

  const navigate = useNavigate()

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] =
    useState(false)

  if (authLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <span>RESTORING SESSION...</span>
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role === 'ADMIN') {
    return <Navigate to="/admin/tickets" replace />
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const trimmedSubject = subject.trim()
    const trimmedMessage = message.trim()

    if (trimmedSubject.length < 3) {
      setError(
        'Subject must contain at least 3 characters.',
      )
      return
    }

    if (trimmedMessage.length < 1) {
      setError('Please describe your query.')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      const ticket = await createTicket({
        subject: trimmedSubject,
        message: trimmedMessage,
      })

      navigate(`/tickets/${ticket.id}`, {
        replace: true,
      })
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : 'Unable to submit your query.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link
          to="/dashboard"
          className="dashboard-wordmark"
        >
          ENGINEERING<span>_OS</span>
        </Link>

        <div className="dashboard-header-right">
          <span>STUDENT / QUERY</span>

          <Link to="/tickets">
            YOUR TICKETS
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <Link
              to="/dashboard"
              className="admin-back-link"
            >
              <ArrowLeft size={15} />
              BACK TO DASHBOARD
            </Link>

            <p className="overline">
              STUDENT SUPPORT / 07
            </p>

            <h1>
              Post a
              <br />
              <em>Query.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>PRIVATE SUPPORT</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-card query-form-card">
          <div className="dashboard-card-top">
            <span>NEW SUPPORT REQUEST</span>
            <span>01</span>
          </div>

          <div className="dashboard-card-main">
            <h2>
              What can we
              <br />
              <em>help you with?</em>
            </h2>

            <p>
              Send a private query to the Engineering OS
              administrator. Your conversation will only
              be visible to you and the administrator.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label>
              <span>SUBJECT</span>

              <input
                value={subject}
                onChange={(event) =>
                  setSubject(event.target.value)
                }
                placeholder="What do you need help with?"
                maxLength={200}
                required
              />
            </label>

            <label>
              <span>MESSAGE / DOUBT</span>

              <textarea
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder="Describe your question or issue..."
                maxLength={5000}
                required
                rows={10}
              />
            </label>

            <div className="query-form-meta">
              <span>
                <Circle
                  size={8}
                  fill="currentColor"
                />
                PRIVATE CONVERSATION
              </span>

              <span>
                {message.length} / 5000
              </span>
            </div>

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
                  ? 'SUBMITTING QUERY...'
                  : 'SUBMIT QUERY'}
              </span>

              {isSubmitting ? (
                <Send size={17} />
              ) : (
                <ArrowUpRight size={17} />
              )}
            </button>
          </form>
        </section>
      </section>

      <footer className="dashboard-footer">
        <span>ENGINEERING_OS / 2026</span>
        <span>
          Private student support system.
        </span>
      </footer>
    </main>
  )
}