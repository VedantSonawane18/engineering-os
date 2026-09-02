import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Circle,
  RefreshCw,
  X,
} from 'lucide-react'
import {
  Link,
  Navigate,
  useParams,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  approveStudent,
  getAdminStudent,
  getAdminPaymentByStudent,
  getAdminPaymentScreenshotUrl,
  markPaymentUnderReview,
  markStudentUnderReview,
  rejectPayment,
  rejectStudent,
  verifyPayment,
  type AdminPayment,
  type AdminStudent,
} from '../../admin/adminApi'

export function AdminStudentDetailPage() {
  const {
    user,
    isLoading: authLoading,
  } = useAuth()

  const { id } = useParams()

  const [student, setStudent] =
    useState<AdminStudent | null>(null)

  const [isLoading, setIsLoading] =
    useState(true)

  const [isUpdating, setIsUpdating] =
    useState(false)

  const [error, setError] = useState('')

  const [payment, setPayment] =
    useState<AdminPayment | null>(null)

  const [paymentScreenshotUrl, setPaymentScreenshotUrl] =
    useState<string | null>(null)

  const [isPaymentUpdating, setIsPaymentUpdating] =
    useState(false)

  const [paymentError, setPaymentError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadStudent() {
      if (!id) {
        setError('Student ID is missing.')
        setIsLoading(false)
        return
      }

      try {
        const result = await getAdminStudent(id)

        if (cancelled) {
          return
        }

        setStudent(result)
        setError('')
      } catch (loadError) {
        if (cancelled) {
          return
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load student.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    async function loadPayment() {
      if (!id) {
        return
      }

      try {
        const result = await getAdminPaymentByStudent(id)

        if (cancelled) {
          return
        }

        setPayment(result)

        if (result?.screenshotAvailable) {
          const url = await getAdminPaymentScreenshotUrl(
            result.id,
          )

          if (!cancelled) {
            setPaymentScreenshotUrl(url)
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setPaymentError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load payment details.',
          )
        }
      }
    }

    void loadStudent()
    void loadPayment()

    return () => {
      cancelled = true
    }
  }, [id])

  async function updatePaymentStatus(
    action: 'review' | 'verify' | 'reject',
  ) {
    if (!payment || isPaymentUpdating) {
      return
    }

    let note: string | undefined

    if (action === 'reject') {
      note =
        window.prompt(
          'Optional note for the student (leave blank to skip):',
        ) ?? undefined
    }

    setIsPaymentUpdating(true)
    setPaymentError('')

    try {
      let updated: AdminPayment

      if (action === 'review') {
        updated = await markPaymentUnderReview(payment.id)
      } else if (action === 'verify') {
        updated = await verifyPayment(payment.id)
      } else {
        updated = await rejectPayment(payment.id, note)
      }

      setPayment(updated)
    } catch (updateError) {
      setPaymentError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update payment status.',
      )
    } finally {
      setIsPaymentUpdating(false)
    }
  }

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

  async function updateStatus(
    action: 'review' | 'approve' | 'reject',
  ) {
    if (!student || isUpdating) {
      return
    }

    setIsUpdating(true)
    setError('')

    try {
      let updatedStudent: AdminStudent

      if (action === 'review') {
        updatedStudent =
          await markStudentUnderReview(student.id)
      } else if (action === 'approve') {
        updatedStudent =
          await approveStudent(student.id)
      } else {
        updatedStudent =
          await rejectStudent(student.id)
      }

      setStudent(updatedStudent)
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : 'Unable to update student status.',
      )
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <main className="dashboard-page dashboard-loading">
        <RefreshCw size={18} />
        <span>LOADING STUDENT ACCOUNT...</span>
      </main>
    )
  }

  if (error && !student) {
    return (
      <main className="dashboard-page dashboard-error-page">
        <div className="dashboard-error">
          <p className="overline">
            ADMIN / STUDENT REVIEW
          </p>

          <h1>
            Unable to load
            <br />
            <em>student account.</em>
          </h1>

          <p>{error}</p>

          <Link to="/admin/students">
            <ArrowLeft size={16} />
            BACK TO STUDENTS
          </Link>
        </div>
      </main>
    )
  }

  if (!student) {
    return null
  }

  const statusLabel =
    student.approvalStatus === 'UNDER_REVIEW'
      ? 'UNDER REVIEW'
      : student.approvalStatus

  const statusClass =
    student.approvalStatus.toLowerCase()

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
          <span>ADMIN / REVIEW</span>

          <Link to="/admin/students">
            STUDENTS
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <Link
              to="/admin/students"
              className="admin-back-link"
            >
              <ArrowLeft size={15} />
              STUDENT DIRECTORY
            </Link>

            <p className="overline">
              APPLICATION REVIEW / {student.id.slice(0, 8)}
            </p>

            <h1>
              Review
              <br />
              <em>{student.fullName}.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>APPLICATION CONTROL</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-status-grid">
          <article className="dashboard-card account-card">
            <div className="dashboard-card-top">
              <span>STUDENT ACCOUNT</span>
              <span>01</span>
            </div>

            <div className="dashboard-card-main">
              <h2>{student.fullName}</h2>
              <p>{student.email}</p>
            </div>

            <div className="dashboard-card-footer">
              <span>REGISTERED</span>

              <strong>
                {new Date(
                  student.createdAt,
                ).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </div>
          </article>

          <article className="dashboard-card approval-card">
            <div className="dashboard-card-top">
              <span>APPLICATION STATUS</span>
              <span>02</span>
            </div>

            <div className="approval-status">
              <span
                className={`approval-indicator approval-${statusClass}`}
              >
                <Circle
                  size={9}
                  fill="currentColor"
                />
              </span>

              <strong>{statusLabel}</strong>
            </div>

            <p>
              {student.approvalStatus ===
              'PENDING'
                ? 'This application is waiting for administrator review.'
                : student.approvalStatus ===
                    'UNDER_REVIEW'
                  ? 'This application is currently being reviewed.'
                  : student.approvalStatus ===
                      'APPROVED'
                    ? 'This student has been approved for Engineering OS access.'
                    : 'This application has been rejected.'}
            </p>

            <div className="dashboard-card-footer">
              <span>ACCOUNT ID</span>
              <strong>
                {student.id.slice(0, 8)}
              </strong>
            </div>
          </article>
        </section>

        <section className="dashboard-system">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                ADMINISTRATOR ACTIONS
              </p>

              <h2>
                Decide the
                <br />
                <em>application status.</em>
              </h2>
            </div>

            <span>03 / CONTROL</span>
          </div>

          {error && (
            <div
              className="dashboard-error admin-list-error"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}

          <div className="dashboard-system-grid">
            <button
              type="button"
              className="dashboard-system-card"
              disabled={isUpdating}
              onClick={() =>
                void updateStatus('review')
              }
            >
              <div>
                <span>01 / REVIEW</span>

                <h3>
                  Mark Under
                  <br />
                  Review
                </h3>

                <p>
                  Keep the application active while
                  an administrator investigates or
                  requests clarification.
                </p>
              </div>

              <RefreshCw size={23} />
            </button>

            <button
              type="button"
              className="dashboard-system-card"
              disabled={isUpdating}
              onClick={() =>
                void updateStatus('approve')
              }
            >
              <div>
                <span>02 / APPROVAL</span>

                <h3>
                  Approve
                  <br />
                  Student
                </h3>

                <p>
                  Approve the account and activate
                  the student's Engineering OS access.
                </p>
              </div>

              <Check size={23} />
            </button>

            <button
              type="button"
              className="dashboard-system-card dashboard-system-card-wide"
              disabled={isUpdating}
              onClick={() =>
                void updateStatus('reject')
              }
            >
              <div>
                <span>03 / REJECTION</span>

                <h3>
                  Reject
                  <br />
                  Application
                </h3>

                <p>
                  Reject the application when the
                  submitted information does not meet
                  the required criteria.
                </p>
              </div>

              <X size={23} />
            </button>
          </div>
        </section>

        <section className="dashboard-system">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">PAYMENT</p>

              <h2>
                Verify the
                <br />
                <em>payment evidence.</em>
              </h2>
            </div>

            <span>04 / PAYMENT</span>
          </div>

          {paymentError && (
            <div
              className="dashboard-error admin-list-error"
              role="alert"
            >
              <p>{paymentError}</p>
            </div>
          )}

          {!payment ? (
            <p>NOT SUBMITTED — the student has not submitted payment evidence yet.</p>
          ) : (
            <>
              <div className="dashboard-status-grid">
                <article className="dashboard-card approval-card">
                  <div className="dashboard-card-top">
                    <span>PAYMENT STATUS</span>
                    <span>A</span>
                  </div>

                  <div className="approval-status">
                    <span
                      className={`approval-indicator approval-${payment.status.toLowerCase()}`}
                    >
                      <Circle size={9} fill="currentColor" />
                    </span>

                    <strong>
                      {payment.status === 'UNDER_REVIEW'
                        ? 'UNDER REVIEW'
                        : payment.status}
                    </strong>
                  </div>

                  <div className="dashboard-card-footer">
                    <span>
                      {payment.referenceType === 'UTR'
                        ? 'UTR'
                        : 'TRANSACTION ID'}
                    </span>
                    <strong>{payment.referenceValue}</strong>
                  </div>

                  {payment.reviewNote && (
                    <p>
                      <strong>Note:</strong>{' '}
                      {payment.reviewNote}
                    </p>
                  )}
                </article>

                <article className="dashboard-card">
                  <div className="dashboard-card-top">
                    <span>SCREENSHOT</span>
                    <span>B</span>
                  </div>

                  {paymentScreenshotUrl ? (
                    <img
                      src={paymentScreenshotUrl}
                      alt={`Payment screenshot submitted by ${student.fullName}`}
                      style={{
                        maxWidth: '100%',
                        borderRadius: '4px',
                        marginTop: '0.75rem',
                      }}
                    />
                  ) : (
                    <p>No screenshot available.</p>
                  )}
                </article>
              </div>

              <div className="dashboard-system-grid">
                <button
                  type="button"
                  className="dashboard-system-card"
                  disabled={isPaymentUpdating}
                  onClick={() =>
                    void updatePaymentStatus('review')
                  }
                >
                  <div>
                    <span>UNDER REVIEW</span>
                    <h3>Mark Under Review</h3>
                  </div>
                  <RefreshCw size={23} />
                </button>

                <button
                  type="button"
                  className="dashboard-system-card"
                  disabled={isPaymentUpdating}
                  onClick={() =>
                    void updatePaymentStatus('verify')
                  }
                >
                  <div>
                    <span>VERIFY</span>
                    <h3>Approve Payment</h3>
                  </div>
                  <Check size={23} />
                </button>

                <button
                  type="button"
                  className="dashboard-system-card"
                  disabled={isPaymentUpdating}
                  onClick={() =>
                    void updatePaymentStatus('reject')
                  }
                >
                  <div>
                    <span>REJECT</span>
                    <h3>Reject Payment</h3>
                  </div>
                  <X size={23} />
                </button>
              </div>
            </>
          )}
        </section>

        <section className="dashboard-next">
          <div>
            <span>ADMIN REVIEW</span>

            <h2>
              Need clarification?
              <br />
              <em>Contact the student.</em>
            </h2>
          </div>

          <div className="dashboard-next-status">
            <Circle
              size={10}
              fill="currentColor"
            />
            <span>
              {isUpdating
                ? 'UPDATING...'
                : 'READY'}
            </span>
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