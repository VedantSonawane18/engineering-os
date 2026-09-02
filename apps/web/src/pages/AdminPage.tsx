import {
  ArrowUpRight,
  Circle,
  LogOut,
  Users,
} from 'lucide-react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

export function AdminPage() {
  const {
    user,
    isLoading: authLoading,
    logout,
  } = useAuth()

  const navigate = useNavigate()

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

  async function handleLogout() {
    await logout()

    navigate('/', {
      replace: true,
    })
  }

  return (
    <main className="dashboard-page admin-page">
      <header className="dashboard-header">
        <Link
          to="/"
          className="dashboard-wordmark"
        >
          ENGINEERING<span>_OS</span>
        </Link>

        <div className="dashboard-header-right">
          <span>ADMIN / 2026</span>

          <button
            type="button"
            onClick={() => void handleLogout()}
          >
            LOGOUT
            <LogOut size={15} />
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <p className="overline">
              ADMINISTRATOR WORKSPACE / 01
            </p>

            <h1>
              Welcome,
              <br />
              <em>{user.fullName}.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>ADMIN SYSTEM</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-status-grid">
          <article className="dashboard-card account-card">
            <div className="dashboard-card-top">
              <span>ADMIN ACCOUNT</span>
              <span>01</span>
            </div>

            <div className="dashboard-card-main">
              <h2>{user.fullName}</h2>
              <p>{user.email}</p>
            </div>

            <div className="dashboard-card-footer">
              <span>ROLE</span>
              <strong>ADMIN</strong>
            </div>
          </article>

          <article className="dashboard-card approval-card">
            <div className="dashboard-card-top">
              <span>SYSTEM ACCESS</span>
              <span>02</span>
            </div>

            <div className="approval-status">
              <span className="approval-indicator approval-approved">
                <Circle
                  size={9}
                  fill="currentColor"
                />
              </span>

              <strong>AUTHORIZED</strong>
            </div>

            <p>
              You have administrator access to
              Engineering OS.
            </p>

            <div className="dashboard-card-footer">
              <span>ACCESS</span>
              <strong>FULL</strong>
            </div>
          </article>
        </section>

        <section className="dashboard-system">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                ADMINISTRATION
              </p>

              <h2>
                Manage the
                <br />
                <em>Engineering OS.</em>
              </h2>
            </div>

            <span>03 — 07</span>
          </div>

          <div className="dashboard-system-grid">
            <Link
              to="/admin/students"
              className="dashboard-system-card dashboard-system-card-wide"
            >
              <div>
                <span>03 / STUDENTS</span>

                <h3>
                  Student
                  <br />
                  Directory
                </h3>

                <p>
                  Review student accounts,
                  approval status and applications.
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/admin/payments"
              className="dashboard-system-card"
            >
              <div>
                <span>04 / PAYMENTS</span>

                <h3>
                  Payment
                  <br />
                  Review
                </h3>

                <p>
                  Review submitted payment evidence
                  and verification status.
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/admin/reviews"
              className="dashboard-system-card"
            >
              <div>
                <span>05 / REVIEWS</span>

                <h3>
                  Pending
                  <br />
                  Reviews
                </h3>

                <p>
                  Review applications that require
                  administrator attention.
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/admin/students"
              className="dashboard-system-card dashboard-system-card-wide"
            >
              <div>
                <span>06 / APPLICATIONS</span>

                <h3>
                  Application
                  <br />
                  Control
                </h3>

                <p>
                  Approve, reject or request
                  clarification from students.
                </p>
              </div>

              <Users size={23} />
            </Link>

            <Link
              to="/admin/tickets"
              className="dashboard-system-card dashboard-system-card-wide"
            >
              <div>
                <span>07 / SUPPORT</span>

                <h3>
                  Student
                  <br />
                  Tickets
                </h3>

                <p>
                  Reply privately to student queries
                  and manage support conversations.
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>
          </div>
        </section>

        <section className="dashboard-next">
          <div>
            <span>ADMIN SYSTEM</span>

            <h2>
              Everything you need
              <br />
              <em>to review applications.</em>
            </h2>
          </div>

          <div className="dashboard-next-status">
            <Circle
              size={10}
              fill="currentColor"
            />
            <span>AUTHORIZED</span>
          </div>
        </section>
      </section>

      <footer className="dashboard-footer">
        <span>ENGINEERING_OS / 2026</span>

        <span>
          Administrator control system.
        </span>
      </footer>
    </main>
  )
}