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
import { useAuth } from '../../auth/useAuth'
import {
  getAdminTicket,
  sendAdminMessage,
  updateAdminTicketStatus,
  type TicketDetail,
  type TicketStatus,
} from '../../api/tickets'

function formatStatus(
  status: TicketStatus,
): string {
  return status === 'IN_PROGRESS'
    ? 'IN PROGRESS'
    : status === 'WAITING_FOR_STUDENT'
      ? 'WAITING FOR STUDENT'
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

export function AdminTicketDetailPage() {
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

  const [error, setError] =
    useState('')

  const [reply, setReply] =
    useState('')

  const [isSending, setIsSending] =
    useState(false)

  const [isUpdatingStatus, setIsUpdatingStatus] =
    useState(false)

  const loadTicket = useCallback(
    async () => {
      if (!id) {
        setError(
          'Ticket ID is missing.',
        )
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const result =
          await getAdminTicket(id)

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
    },
    [id],
  )

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadTicket()
      }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadTicket])

  if (authLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <span>
          RESTORING SESSION...
        </span>
      </main>
    )
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    )
  }

  if (user.role !== 'ADMIN') {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }

  async function handleReply(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !id ||
      !reply.trim() ||
      isSending
    ) {
      return
    }

    setIsSending(true)
    setError('')

    try {
      const updatedTicket =
        await sendAdminMessage(id, {
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

  async function handleStatusChange(
    status: TicketStatus,
  ) {
    if (
      !id ||
      !ticket ||
      isUpdatingStatus ||
      ticket.status === status
    ) {
      return
    }

    setIsUpdatingStatus(true)
    setError('')

    try {
      const updatedTicket =
        await updateAdminTicketStatus(
          id,
          { status },
        )

      setTicket(updatedTicket)
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : 'Unable to update ticket status.',
      )
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (isLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <RefreshCw size={18} />
        <span>
          LOADING CONVERSATION...
        </span>
      </main>
    )
  }

  if (error && !ticket) {
    return (
      <main className="dashboard-page dashboard-error-page">
        <div className="dashboard-error">
          <p className="overline">
            ADMIN / SUPPORT
          </p>

          <h1>
            Unable to load
            <br />
            <em>conversation.</em>
          </h1>

          <p>{error}</p>

          <Link to="/admin/tickets">
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
    <main className="dashboard-page admin-page">
      <header className="dashboard-header">
        <Link
          to="/admin"
          className="dashboard-wordmark"
        >
          ENGINEERING<span>_OS</span>
        </Link>

        <div className="dashboard-header-right">
          <span>ADMIN / TICKET</span>

          <Link to="/admin/tickets">
            SUPPORT
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <Link
              to="/admin/tickets"
              className="admin-back-link"
            >
              <ArrowLeft size={15} />
              BACK TO SUPPORT
            </Link>

            <p className="overline">
              PRIVATE SUPPORT CONVERSATION
            </p>

            <h1>
              {ticket.subject}
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>
              TICKET /
              {ticket.id
                .slice(0, 8)
                .toUpperCase()}
            </span>

            <span>
              {formatStatus(
                ticket.status,
              )}
            </span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-status-grid">
          <article className="dashboard-card account-card">
            <div className="dashboard-card-top">
              <span>STUDENT</span>
              <span>01</span>
            </div>

            <div className="dashboard-card-main">
              <h2>
                {ticket.studentName}
              </h2>

              <p>
                {ticket.studentEmail}
              </p>
            </div>

            <div className="dashboard-card-footer">
              <span>CREATED</span>

              <strong>
                {formatDate(
                  ticket.createdAt,
                )}
              </strong>
            </div>
          </article>

          <article className="dashboard-card approval-card">
            <div className="dashboard-card-top">
              <span>TICKET STATUS</span>
              <span>02</span>
            </div>

            <div className="approval-status">
              <span className="approval-indicator approval-approved">
                <Circle
                  size={9}
                  fill="currentColor"
                />
              </span>

              <strong>
                {formatStatus(
                  ticket.status,
                )}
              </strong>
            </div>

            <p>
              Change the support workflow
              status using the controls below.
            </p>

            <div className="dashboard-card-footer">
              <span>UPDATED</span>

              <strong>
                {formatDate(
                  ticket.updatedAt,
                )}
              </strong>
            </div>
          </article>
        </section>

        <section className="dashboard-card">
          <div className="dashboard-card-top">
            <span>STATUS CONTROL</span>
            <span>03</span>
          </div>

          <div className="admin-student-filters">
            {(
              [
                'OPEN',
                'IN_PROGRESS',
                'WAITING_FOR_STUDENT',
                'RESOLVED',
                'CLOSED',
              ] as TicketStatus[]
            ).map((status) => (
              <button
                key={status}
                type="button"
                className={
                  ticket.status === status
                    ? 'admin-filter active'
                    : 'admin-filter'
                }
                disabled={
                  isUpdatingStatus
                }
                onClick={() =>
                  void handleStatusChange(
                    status,
                  )
                }
              >
                {formatStatus(status)}
              </button>
            ))}
          </div>
        </section>

        <section className="ticket-conversation">
          {ticket.messages.map(
            (item) => {
              const isAdmin =
                item.senderRole ===
                'ADMIN'

              return (
                <article
                  key={item.id}
                  className={
                    isAdmin
                      ? 'ticket-message ticket-message-admin'
                      : 'ticket-message ticket-message-student'
                  }
                >
                  <div className="ticket-message-meta">
                    <span>
                      {isAdmin
                        ? 'YOU / ADMIN'
                        : ticket.studentName}
                    </span>

                    <span>
                      {formatDate(
                        item.createdAt,
                      )}
                    </span>
                  </div>

                  <div className="ticket-message-body">
                    <p>
                      {item.message}
                    </p>
                  </div>
                </article>
              )
            },
          )}
        </section>

        {error && (
          <p
            className="auth-error"
            role="alert"
          >
            {error}
          </p>
        )}

        {ticket.status !==
          'CLOSED' && (
          <section className="dashboard-card ticket-reply-card">
            <div className="dashboard-card-top">
              <span>ADMIN REPLY</span>
              <span>04</span>
            </div>

            <form
              className="auth-form"
              onSubmit={handleReply}
            >
              <label>
                <span>
                  MESSAGE TO STUDENT
                </span>

                <textarea
                  value={reply}
                  onChange={(event) =>
                    setReply(
                      event.target.value,
                    )
                  }
                  placeholder="Write your reply..."
                  maxLength={5000}
                  rows={8}
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

                <ArrowUpRight
                  size={17}
                />
              </button>
            </form>
          </section>
        )}

        {ticket.status ===
          'CLOSED' && (
          <section className="dashboard-next">
            <div>
              <span>
                CONVERSATION CLOSED
              </span>

              <h2>
                This support ticket is
                <br />
                <em>closed.</em>
              </h2>
            </div>

            <div className="dashboard-next-status">
              <Circle
                size={10}
                fill="currentColor"
              />
              <span>CLOSED</span>
            </div>
          </section>
        )}
      </section>

      <footer className="dashboard-footer">
        <span>
          ENGINEERING_OS / 2026
        </span>

        <span>
          Administrator support system.
        </span>
      </footer>
    </main>
  )
}