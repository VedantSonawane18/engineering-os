import {
  ArrowLeft,
  ArrowUpRight,
  Circle,
  RefreshCw,
} from 'lucide-react'
import {
  Link,
  Navigate,
  useParams,
} from 'react-router-dom'
import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react'
import { useAuth } from '../auth/useAuth'
import {
  getMyTicket,
  sendStudentMessage,
  type TicketDetail,
  type TicketStatus,
} from '../api/tickets'

function formatStatus(
  status: TicketStatus,
): string {
  return status === 'IN_PROGRESS'
    ? 'IN PROGRESS'
    : status === 'WAITING_FOR_STUDENT'
      ? 'WAITING FOR YOU'
      : status
}

function formatDate(
  value: string,
): string {
  return new Intl.DateTimeFormat(
    undefined,
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(value))
}

export function TicketDetailPage() {
  const {
    user,
    isLoading: authLoading,
  } = useAuth()

  const { id } = useParams<{
    id: string
  }>()

  const [ticket, setTicket] =
    useState<TicketDetail | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')

  const [reply, setReply] = useState('')

  const [isSending, setIsSending] =
    useState(false)

  const loadTicket = useCallback(async () => {
    if (!id) {
      setError('Ticket ID is missing.')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await getMyTicket(id)
      setTicket(result)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load this ticket.',
      )
    } finally {
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTicket()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadTicket])

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

  async function handleReply(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!id || !reply.trim() || isSending) {
      return
    }

    setIsSending(true)
    setError('')

    try {
      const updatedTicket =
        await sendStudentMessage(id, {
          message: reply.trim(),
        })

      setTicket(updatedTicket)
      setReply('')
    } catch (sendError) {
      setError(
        sendError instanceof Error
          ? sendError.message
          : 'Unable to send your reply.',
      )
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <RefreshCw size={18} />
        <span>LOADING CONVERSATION...</span>
      </main>
    )
  }

  if (error && !ticket) {
    return (
      <main className="dashboard-page dashboard-error-page">
        <div className="dashboard-error">
          <p className="overline">
            SUPPORT / TICKET
          </p>

          <h1>
            Unable to load
            <br />
            <em>conversation.</em>
          </h1>

          <p>{error}</p>

          <Link to="/tickets">
            <ArrowLeft size={16} />
            BACK TO TICKETS
          </Link>
        </div>
      </main>
    )
  }

  if (!ticket) {
    return null
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
          <span>STUDENT / TICKET</span>

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
              to="/tickets"
              className="admin-back-link"
            >
              <ArrowLeft size={15} />
              BACK TO TICKETS
            </Link>

            <p className="overline">
              PRIVATE CONVERSATION
            </p>

            <h1>{ticket.subject}</h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>
              TICKET /
              {ticket.id.slice(0, 8).toUpperCase()}
            </span>

            <span>
              {formatStatus(ticket.status)}
            </span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-card">
          <div className="dashboard-card-top">
            <span>CONVERSATION STATUS</span>
            <span>
              {formatStatus(ticket.status)}
            </span>
          </div>

          <div className="approval-status">
            <span className="approval-indicator approval-approved">
              <Circle
                size={9}
                fill="currentColor"
              />
            </span>

            <strong>
              {formatStatus(ticket.status)}
            </strong>
          </div>

          <p>
            This conversation is private between
            you and the Engineering OS administrator.
          </p>
        </section>

        <section className="ticket-conversation">
          {ticket.messages.map((item) => {
            const isStudent =
              item.senderRole === 'STUDENT'

            return (
              <article
                key={item.id}
                className={
                  isStudent
                    ? 'ticket-message ticket-message-student'
                    : 'ticket-message ticket-message-admin'
                }
              >
                <div className="ticket-message-meta">
                  <span>
                    {isStudent
                      ? 'YOU'
                      : 'ENGINEERING OS / ADMIN'}
                  </span>

                  <span>
                    {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className="ticket-message-body">
                  <p>{item.message}</p>
                </div>
              </article>
            )
          })}
        </section>

        {error && (
          <p
            className="auth-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {ticket.status !== 'CLOSED' &&
          ticket.status !== 'RESOLVED' && (
            <section className="dashboard-card ticket-reply-card">
              <div className="dashboard-card-top">
                <span>REPLY</span>
                <span>01</span>
              </div>

              <form
                className="auth-form"
                onSubmit={handleReply}
              >
                <label>
                  <span>YOUR MESSAGE</span>

                  <textarea
                    value={reply}
                    onChange={(event) =>
                      setReply(event.target.value)
                    }
                    placeholder="Write your reply..."
                    maxLength={5000}
                    rows={7}
                    required
                  />
                </label>

                <button
                  className="auth-submit"
                  type="submit"
                  disabled={
                    isSending ||
                    reply.trim() === ''
                  }
                >
                  <span>
                    {isSending
                      ? 'SENDING...'
                      : 'SEND REPLY'}
                  </span>

                  <ArrowUpRight size={17} />
                </button>
              </form>
            </section>
          )}

        {(ticket.status === 'CLOSED' ||
          ticket.status === 'RESOLVED') && (
          <section className="dashboard-next">
            <div>
              <span>CONVERSATION CLOSED</span>

              <h2>
                This ticket has been
                <br />
                <em>resolved.</em>
              </h2>
            </div>

            <div className="dashboard-next-status">
              <Circle
                size={10}
                fill="currentColor"
              />
              <span>
                {formatStatus(ticket.status)}
              </span>
            </div>
          </section>
        )}
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