import {
  ArrowLeft,
  ArrowUpRight,
  Circle,
  RefreshCw,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  getAdminPayments,
  type AdminPayment,
  type AdminPaymentStatus,
} from '../../admin/adminApi'

type Filter = 'ALL' | AdminPaymentStatus

export function AdminPaymentsPage() {
  const { user, isLoading: authLoading } = useAuth()

  const [payments, setPayments] = useState<AdminPayment[]>(
    [],
  )

  const [filter, setFilter] = useState<Filter>('ALL')
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadPayments() {
    setIsLoading(true)
    setError('')

    try {
      const result = await getAdminPayments()
      setPayments(result)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load payments.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadPayments()
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

  if (user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  const searchTerm = search.trim().toLowerCase()

  const filteredPayments = payments
    .filter((payment) =>
      filter === 'ALL' ? true : payment.status === filter,
    )
    .filter((payment) =>
      searchTerm === ''
        ? true
        : payment.studentEmail
            .toLowerCase()
            .includes(searchTerm) ||
          payment.studentName
            .toLowerCase()
            .includes(searchTerm),
    )

  const countFor = (status: AdminPaymentStatus) =>
    payments.filter((payment) => payment.status === status)
      .length

  return (
    <main className="dashboard-page admin-page">
      <header className="dashboard-header">
        <Link to="/admin" className="dashboard-wordmark">
          ENGINEERING<span>_OS</span>
        </Link>

        <div className="dashboard-header-right">
          <span>ADMIN / PAYMENTS</span>

          <Link to="/admin">
            ADMIN HOME
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <Link to="/admin" className="admin-back-link">
              <ArrowLeft size={15} />
              ADMIN CONTROL CENTER
            </Link>

            <p className="overline">
              ADMINISTRATION / 04
            </p>

            <h1>
              Payment
              <br />
              <em>Review Queue.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>PAYMENT VERIFICATION</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-system admin-student-directory">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                PAYMENT SUBMISSIONS
              </p>

              <h2>
                Verify every
                <br />
                <em>payment submission.</em>
              </h2>
            </div>

            <span>
              {filteredPayments.length} / {payments.length}
            </span>
          </div>

          <div className="admin-student-filters">
            {(
              [
                ['ALL', payments.length],
                ['PENDING', countFor('PENDING')],
                [
                  'UNDER_REVIEW',
                  countFor('UNDER_REVIEW'),
                ],
                ['VERIFIED', countFor('VERIFIED')],
                ['REJECTED', countFor('REJECTED')],
              ] as const
            ).map(([value, count]) => (
              <button
                key={value}
                type="button"
                className={
                  filter === value
                    ? 'admin-filter active'
                    : 'admin-filter'
                }
                onClick={() => setFilter(value)}
              >
                {value === 'UNDER_REVIEW'
                  ? 'UNDER REVIEW'
                  : value}
                <span>{count}</span>
              </button>
            ))}
          </div>

          <label>
            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by student name or email"
              style={{ marginBottom: '1rem' }}
            />
          </label>

          {isLoading && (
            <div className="dashboard-loading admin-list-loading">
              <RefreshCw size={18} />
              <span>LOADING PAYMENTS...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="dashboard-error admin-list-error">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void loadPayments()}
              >
                <RefreshCw size={16} />
                TRY AGAIN
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredPayments.length === 0 && (
              <div className="admin-empty-state">
                <span>NO PAYMENTS FOUND</span>
                <p>
                  There are no submissions matching this
                  filter.
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            filteredPayments.length > 0 && (
              <div className="admin-student-list">
                {filteredPayments.map((payment, index) => (
                  <Link
                    key={payment.id}
                    to={`/admin/students/${payment.studentId}`}
                    className="admin-student-row"
                  >
                    <div className="admin-student-number">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="admin-student-info">
                      <h3>{payment.studentName}</h3>
                      <p>{payment.studentEmail}</p>
                    </div>

                    <div
                      className={`admin-student-status admin-status-${payment.status.toLowerCase()}`}
                    >
                      <Circle size={8} fill="currentColor" />
                      {payment.status === 'UNDER_REVIEW'
                        ? 'UNDER REVIEW'
                        : payment.status}
                    </div>

                    <div className="admin-student-date">
                      {payment.referenceType === 'UTR'
                        ? 'UTR'
                        : 'TXN ID'}
                      : {payment.referenceValue}
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
        <span>Administrator control system.</span>
      </footer>
    </main>
  )
}
