import {
  ArrowUpRight,
  Check,
  Circle,
  Mail,
  Phone,
  RefreshCw,
  ScanLine,
} from 'lucide-react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { useDashboard } from '../hooks/useDashboard'
import { webinarConfig } from '../data/webinarConfig'

export function DashboardPage() {
  const {
    user,
    isLoading: authLoading,
    logout,
  } = useAuth()

  const navigate = useNavigate()

  const {
    data,
    isLoading: dashboardLoading,
    error,
    refresh,
  } = useDashboard()

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

  /*
   * Administrator accounts belong in the admin workspace.
   */
  if (user.role === 'ADMIN') {
    return <Navigate to="/admin" replace />
  }

  async function handleLogout() {
    await logout()

    navigate('/', {
      replace: true,
    })
  }

  if (dashboardLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <span>LOADING YOUR SYSTEM...</span>
      </main>
    )
  }

  if (error || !data) {
    return (
      <main className="dashboard-page dashboard-error-page">
        <div className="dashboard-error">
          <p className="overline">
            SYSTEM ERROR / DASHBOARD
          </p>

          <h1>
            We couldn't
            <br />
            <em>load your system.</em>
          </h1>

          <p>
            {error ??
              'An unexpected error occurred.'}
          </p>

          <button
            type="button"
            onClick={() => void refresh()}
          >
            <RefreshCw size={16} />
            TRY AGAIN
          </button>
        </div>
      </main>
    )
  }

  const approvalLabel =
    data.approval.status === 'APPROVED'
      ? 'APPROVED'
      : data.approval.status === 'REJECTED'
        ? 'REJECTED'
        : data.approval.status ===
            'UNDER_REVIEW'
          ? 'UNDER REVIEW'
          : 'PENDING'

  const approvalDescription =
    data.approval.status === 'APPROVED'
      ? 'Your Engineering OS access is active.'
      : data.approval.status === 'REJECTED'
        ? 'Your application has been rejected. Contact the administrator if you need clarification.'
        : data.approval.status ===
            'UNDER_REVIEW'
          ? 'Your application is currently being reviewed by the administrator.'
          : 'Your account is currently awaiting review.'

  const accessLabel =
    data.approval.status === 'APPROVED'
      ? 'ACTIVE'
      : 'LIMITED'

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link
          to="/"
          className="dashboard-wordmark"
        >
          ENGINEERING<span>_OS</span>
        </Link>

        <div className="dashboard-header-right">
          <span>
            {data.user.role} / 2026
          </span>

          <button
            type="button"
            onClick={() => void handleLogout()}
          >
            LOGOUT
            <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <p className="overline">
              STUDENT WORKSPACE / 01
            </p>

            <h1>
              Welcome,
              <br />
              <em>{data.user.fullName}.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>PERSONAL SYSTEM</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-status-grid">
          <article className="dashboard-card account-card">
            <div className="dashboard-card-top">
              <span>ACCOUNT</span>
              <span>01</span>
            </div>

            <div className="dashboard-card-main">
              <h2>{data.user.fullName}</h2>

              <p>{data.user.email}</p>
            </div>

            <div className="dashboard-card-footer">
              <span>ROLE</span>

              <strong>
                {data.user.role}
              </strong>
            </div>
          </article>

          <article className="dashboard-card approval-card">
            <div className="dashboard-card-top">
              <span>APPROVAL STATUS</span>
              <span>02</span>
            </div>

            <div className="approval-status">
              <span
                className={`approval-indicator approval-${data.approval.status.toLowerCase()}`}
              >
                <Circle
                  size={9}
                  fill="currentColor"
                />
              </span>

              <strong>
                {approvalLabel}
              </strong>
            </div>

            <p>
              {approvalDescription}
            </p>

            <div className="dashboard-card-footer">
              <span>ACCESS</span>

              <strong>
                {accessLabel}
              </strong>
            </div>
          </article>
        </section>

        <section className="dashboard-card contact-card">
          <div className="dashboard-card-top">
            <span>ADMINISTRATOR CONTACT</span>
            <span>03</span>
          </div>

          <div className="dashboard-card-main">
            <h2>Need help?</h2>

            <p>
              Have questions about your application,
              payment verification, approval status or
              Engineering OS access? Contact the
              administrator directly.
            </p>

            <div className="dashboard-contact-links">
              <a
                href={`mailto:${webinarConfig.supportEmail}`}
              >
                <span>
                  <Mail size={16} />
                  EMAIL
                </span>

                <strong>
                  {webinarConfig.supportEmail}
                </strong>

                <ArrowUpRight size={17} />
              </a>

              <a
                href={`tel:${webinarConfig.supportPhone.replace(
                  /\s/g,
                  '',
                )}`}
              >
                <span>
                  <Phone size={16} />
                  PHONE
                </span>

                <strong>
                  {webinarConfig.supportPhone}
                </strong>

                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
        </section>

        <section className="dashboard-webinar">
          <div className="dashboard-webinar-heading">
            <div>
              <p className="overline">
                WEBINAR / REGISTRATION
              </p>

              <h2>
                {webinarConfig.title}
                <br />
                <em>
                  Your ticket starts here.
                </em>
              </h2>
            </div>

            <span>04 / WEBINAR</span>
          </div>

          <div className="dashboard-webinar-grid">
            <div className="dashboard-webinar-info">
              <div className="dashboard-webinar-meta">
                <div>
                  <span>DATE</span>

                  <strong>
                    {webinarConfig.date}
                  </strong>
                </div>

                <div>
                  <span>TIME</span>

                  <strong>
                    {webinarConfig.time}
                  </strong>
                </div>

                <div>
                  <span>TIME ZONE</span>

                  <strong>
                    {webinarConfig.timezone}
                  </strong>
                </div>

                <div>
                  <span>TICKET</span>

                  <strong>
                    {webinarConfig.ticketFee}
                  </strong>
                </div>
              </div>

              <div className="dashboard-webinar-divider" />

              <div className="dashboard-webinar-copy">
                <span>
                  REGISTRATION INSTRUCTIONS
                </span>

                <ol>
                  {webinarConfig.paymentInstructions.map(
                    (instruction, index) => (
                      <li
                        key={instruction}
                      >
                        <span>
                          {String(
                            index + 1,
                          ).padStart(2, '0')}
                        </span>

                        <p>
                          {instruction}
                        </p>
                      </li>
                    ),
                  )}
                </ol>
              </div>

              <div className="dashboard-webinar-cta">
                <Link
                  to="/payment"
                  className="auth-submit"
                >
                  <span>
                    GO TO PAYMENT VERIFICATION
                  </span>

                  <ArrowUpRight
                    size={17}
                  />
                </Link>
              </div>
            </div>

            <div className="dashboard-webinar-payment">
              <div className="dashboard-webinar-payment-top">
                <div>
                  <span>SCAN TO PAY</span>

                  <strong>
                    {webinarConfig.ticketFee}
                  </strong>
                </div>

                <ScanLine size={22} />
              </div>

              <div className="dashboard-qr-frame">
                <img
                  src="/payment-qr.png"
                  alt="Engineering OS webinar payment QR code"
                />
              </div>

              <div className="dashboard-webinar-upi">
                <span>
                  PAYMENT IDENTIFIER / UPI
                </span>

                <strong>
                  {webinarConfig.paymentUpiId}
                </strong>
              </div>

              <p>
                Use the same email address that
                you registered with on Engineering
                OS. Payment approval does not
                transfer between accounts.
              </p>
            </div>
          </div>
        </section>

        <section className="dashboard-system">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                YOUR ENGINEERING SYSTEM
              </p>

              <h2>
                The things
                <br />
                <em>
                  that move you forward.
                </em>
              </h2>
            </div>

            <span>05 — 09</span>
          </div>

          <div className="dashboard-system-grid">
            <Link
              to="/academic"
              className="dashboard-system-card"
            >
              <div>
                <span>05 / ACADEMIC</span>

                <h3>
                  Academic
                  <br />
                  System
                </h3>

                <p>
                  {data.academic.configured
                    ? 'Your academic system is configured.'
                    : 'Build a clearer academic strategy around your engineering years.'}
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/technology"
              className="dashboard-system-card"
            >
              <div>
                <span>06 / DIRECTION</span>

                <h3>
                  Technology
                  <br />
                  Direction
                </h3>

                <p>
                  {data.technology.configured
                    ? 'Your technology direction is configured.'
                    : 'Explore technologies, paths and specializations worth your time.'}
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/payment"
              className="dashboard-system-card"
            >
              <div>
                <span>07 / VERIFICATION</span>

                <h3>
                  Payment
                </h3>

                <p>
                  Submit your Transaction ID
                  or UTR and payment screenshot
                  for administrator review.
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/queries"
              className="dashboard-system-card dashboard-system-card-wide"
            >
              <div>
                <span>08 / GUIDANCE</span>

                <h3>
                  Post a Query
                </h3>

                <p>
                  {data.queries.open > 0
                    ? `${data.queries.open} open query${
                        data.queries.open === 1
                          ? ''
                          : 'ies'
                      } requiring attention.`
                    : 'Stuck somewhere? Send a private question to the Engineering OS team.'}
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>

            <Link
              to="/tickets"
              className="dashboard-system-card dashboard-system-card-wide"
            >
              <div>
                <span>09 / SUPPORT</span>

                <h3>
                  Your Tickets
                </h3>

                <p>
                  {data.tickets.open > 0
                    ? `${data.tickets.open} open ticket${
                        data.tickets.open === 1
                          ? ''
                          : 's'
                      }`
                    : 'Track your questions, responses and support requests.'}
                </p>
              </div>

              <ArrowUpRight size={23} />
            </Link>
          </div>
        </section>

        <section className="dashboard-next">
          <div>
            <span>NEXT SYSTEM</span>

            <h2>
              Your four-year
              <br />
              <em>
                engineering plan.
              </em>
            </h2>
          </div>

          <div className="dashboard-next-status">
            <Check size={17} />

            <span>
              ACCOUNT ACTIVE
            </span>
          </div>
        </section>
      </section>

      <footer className="dashboard-footer">
        <span>
          ENGINEERING_OS / 2026
        </span>

        <span>
          A clearer way through engineering.
        </span>
      </footer>
    </main>
  )
}