import {
  ArrowLeft,
  ArrowUpRight,
  Circle,
  RefreshCw,
} from 'lucide-react'
import {
  Link,
  Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  getMyTickets,
  type Ticket,
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

export function TicketsPage() {
  const {
    user,
    isLoading: authLoading,
  } = useAuth()

  const [tickets, setTickets] =
    useState<Ticket[]>([])
  const [isLoading, setIsLoading] =
    useState(true)
  const [error, setError] = useState('')

  async function loadTickets() {
    setIsLoading(true)
    setError('')

    try {
      const result = await getMyTickets()
      setTickets(result)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load your tickets.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTickets()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [])

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
          <span>STUDENT / SUPPORT</span>

          <Link to="/queries">
            POST QUERY
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
              STUDENT SUPPORT / 08
            </p>

            <h1>
              Your
              <br />
              <em>Tickets.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>PRIVATE SUPPORT</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-system">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                SUPPORT HISTORY
              </p>

              <h2>
                Your private
                <br />
                <em>conversations.</em>
              </h2>
            </div>

            <span>
              {tickets.length} TICKET
              {tickets.length === 1 ? '' : 'S'}
            </span>
          </div>

          {isLoading && (
            <div className="dashboard-loading admin-list-loading">
              <RefreshCw size={18} />
              <span>LOADING YOUR TICKETS...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="dashboard-error admin-list-error">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void loadTickets()}
              >
                <RefreshCw size={16} />
                TRY AGAIN
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            tickets.length === 0 && (
              <div className="admin-empty-state">
                <span>NO TICKETS YET</span>

                <p>
                  Your private support conversations
                  will appear here.
                </p>

                <Link to="/queries">
                  POST YOUR FIRST QUERY
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            )}

          {!isLoading &&
            !error &&
            tickets.length > 0 && (
              <div className="admin-student-list">
                {tickets.map((ticket, index) => (
                  <Link
                    key={ticket.id}
                    to={`/tickets/${ticket.id}`}
                    className="admin-student-row"
                  >
                    <div className="admin-student-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="admin-student-info">
                      <h3>
                        {ticket.subject}
                      </h3>

                      <p>
                        {formatDate(
                          ticket.updatedAt,
                        )}
                      </p>
                    </div>

                    <div
                      className={`admin-student-status admin-status-${ticket.status.toLowerCase()}`}
                    >
                      <Circle
                        size={8}
                        fill="currentColor"
                      />
                      {formatStatus(
                        ticket.status,
                      )}
                    </div>

                    <ArrowUpRight
                      className="admin-student-arrow"
                      size={21}
                    />
                  </Link>
                ))}
              </div>
            )}
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