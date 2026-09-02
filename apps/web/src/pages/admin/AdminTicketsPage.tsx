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
import {
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  getAdminTickets,
  type Ticket,
  type TicketStatus,
} from '../../api/tickets'

type Filter = 'ALL' | TicketStatus

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

export function AdminTicketsPage() {
  const {
    user,
    isLoading: authLoading,
  } = useAuth()

  const [tickets, setTickets] =
    useState<Ticket[]>([])

  const [filter, setFilter] =
    useState<Filter>('ALL')

  const [search, setSearch] =
    useState('')

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadTickets = useCallback(
    async () => {
      setIsLoading(true)
      setError('')

      try {
        const result =
          filter === 'ALL'
            ? await getAdminTickets()
            : await getAdminTickets(filter)

        setTickets(result)
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load support tickets.',
        )
      } finally {
        setIsLoading(false)
      }
    },
    [filter],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadTickets()
    }, 0)

    return () => {
      window.clearTimeout(timer)
    }
  }, [loadTickets])

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

  const searchTerm =
    search.trim().toLowerCase()

  const filteredTickets =
    tickets.filter((ticket) => {
      if (searchTerm === '') {
        return true
      }

      return (
        ticket.subject
          .toLowerCase()
          .includes(searchTerm) ||
        ticket.studentName
          .toLowerCase()
          .includes(searchTerm) ||
        ticket.studentEmail
          .toLowerCase()
          .includes(searchTerm) ||
        ticket.id
          .toLowerCase()
          .includes(searchTerm)
      )
    })

  const filters: Array<
    [Filter, string]
  > = [
    ['ALL', 'ALL'],
    ['OPEN', 'OPEN'],
    ['IN_PROGRESS', 'IN PROGRESS'],
    [
      'WAITING_FOR_STUDENT',
      'WAITING FOR STUDENT',
    ],
    ['RESOLVED', 'RESOLVED'],
    ['CLOSED', 'CLOSED'],
  ]

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
          <span>ADMIN / SUPPORT</span>

          <Link to="/admin">
            ADMIN HOME
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <Link
              to="/admin"
              className="admin-back-link"
            >
              <ArrowLeft size={15} />
              ADMIN CONTROL CENTER
            </Link>

            <p className="overline">
              ADMINISTRATION / SUPPORT
            </p>

            <h1>
              Student
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

        <section className="dashboard-system admin-student-directory">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                SUPPORT INBOX
              </p>

              <h2>
                Conversations
                <br />
                <em>
                  requiring attention.
                </em>
              </h2>
            </div>

            <span>
              {filteredTickets.length} /{' '}
              {tickets.length}
            </span>
          </div>

          <div className="admin-student-filters">
            {filters.map(
              ([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={
                    filter === value
                      ? 'admin-filter active'
                      : 'admin-filter'
                  }
                  onClick={() =>
                    setFilter(value)
                  }
                >
                  {label}
                </button>
              ),
            )}
          </div>

          <label>
            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
              placeholder="Search student, email, subject or ticket ID"
              style={{
                marginBottom: '1rem',
              }}
            />
          </label>

          {isLoading && (
            <div className="dashboard-loading admin-list-loading">
              <RefreshCw size={18} />

              <span>
                LOADING SUPPORT INBOX...
              </span>
            </div>
          )}

          {!isLoading && error && (
            <div className="dashboard-error admin-list-error">
              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  void loadTickets()
                }
              >
                <RefreshCw size={16} />
                TRY AGAIN
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredTickets.length === 0 && (
              <div className="admin-empty-state">
                <span>
                  NO TICKETS FOUND
                </span>

                <p>
                  There are no support tickets
                  matching the current filter.
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            filteredTickets.length > 0 && (
              <div className="admin-student-list">
                {filteredTickets.map(
                  (
                    ticket,
                    index,
                  ) => (
                    <Link
                      key={ticket.id}
                      to={`/admin/tickets/${ticket.id}`}
                      className="admin-student-row"
                    >
                      <div className="admin-student-number">
                        {String(
                          index + 1,
                        ).padStart(2, '0')}
                      </div>

                      <div className="admin-student-info">
                        <h3>
                          {ticket.subject}
                        </h3>

                        <p>
                          {ticket.studentName}
                          {' / '}
                          {ticket.studentEmail}
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

                      <div className="admin-student-date">
                        {formatDate(
                          ticket.updatedAt,
                        )}
                      </div>

                      <ArrowUpRight
                        className="admin-student-arrow"
                        size={21}
                      />
                    </Link>
                  ),
                )}
              </div>
            )}
        </section>
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