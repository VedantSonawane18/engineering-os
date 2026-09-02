import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import {
  ArrowUpRight,
  Check,
  Circle,
  RefreshCw,
  Upload,
} from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import {
  fetchMyPayment,
  fetchMyScreenshotUrl,
  submitPayment,
  type PaymentData,
  type PaymentMethod,
  type TransactionReferenceType,
} from '../api/payments'

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'PENDING',
  UNDER_REVIEW: 'UNDER REVIEW',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
}

const STATUS_DESCRIPTION: Record<string, string> = {
  PENDING:
    'Your payment evidence has been received and is waiting for an administrator to begin review.',
  UNDER_REVIEW:
    'An administrator is currently reviewing your payment evidence.',
  VERIFIED:
    'Your payment has been verified. This is one of the checks required for webinar access.',
  REJECTED:
    'Your payment evidence was rejected. Review the note below, then resubmit with corrected details.',
}

export function PaymentPage() {
  const { user, isLoading: authLoading } = useAuth()

  const [payment, setPayment] =
    useState<PaymentData | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [screenshotUrl, setScreenshotUrl] =
    useState<string | null>(null)

  const [method, setMethod] =
    useState<PaymentMethod>('UPI')

  const [referenceType, setReferenceType] =
    useState<TransactionReferenceType>('TRANSACTION_ID')

  const [referenceValue, setReferenceValue] = useState('')
  const [screenshot, setScreenshot] = useState<File | null>(null)

  const [submitError, setSubmitError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const result = await fetchMyPayment()

        if (cancelled) {
          return
        }

        setPayment(result)

        if (result?.screenshotAvailable) {
          const url = await fetchMyScreenshotUrl()

          if (!cancelled) {
            setScreenshotUrl(url)
          }
        }
      } catch (cause) {
        if (!cancelled) {
          setLoadError(
            cause instanceof Error
              ? cause.message
              : 'Unable to load your payment status.',
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
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
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (!screenshot) {
      setSubmitError(
        'Upload a payment screenshot to continue.',
      )
      return
    }

    setSubmitError('')
    setIsSubmitting(true)

    try {
      const result = await submitPayment({
        method,
        referenceType,
        referenceValue,
        screenshot,
      })

      setPayment(result)

      const url = await fetchMyScreenshotUrl()
      setScreenshotUrl(url)

      setReferenceValue('')
      setScreenshot(null)
    } catch (cause) {
      setSubmitError(
        cause instanceof Error
          ? cause.message
          : 'Unable to submit your payment.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link to="/" className="dashboard-wordmark">
          ENGINEERING<span>_OS</span>
        </Link>

        <div className="dashboard-header-right">
          <Link to="/dashboard">
            DASHBOARD
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>

      <section className="dashboard-content">
        <div className="dashboard-intro">
          <div>
            <p className="overline">
              STUDENT WORKSPACE / PAYMENT
            </p>

            <h1>
              Submit your
              <br />
              <em>payment evidence.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>PAYMENT VERIFICATION</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        {isLoading ? (
          <p>LOADING PAYMENT STATUS...</p>
        ) : (
          <>
            {loadError && (
              <div
                className="dashboard-error admin-list-error"
                role="alert"
              >
                <p>{loadError}</p>
              </div>
            )}

            {payment && (
              <section className="dashboard-card approval-card">
                <div className="dashboard-card-top">
                  <span>CURRENT PAYMENT STATUS</span>
                  <span>01</span>
                </div>

                <div className="approval-status">
                  <span
                    className={`approval-indicator approval-${payment.status.toLowerCase()}`}
                  >
                    <Circle size={9} fill="currentColor" />
                  </span>

                  <strong>
                    {STATUS_LABEL[payment.status]}
                  </strong>
                </div>

                <p>
                  {STATUS_DESCRIPTION[payment.status]}
                </p>

                {payment.status === 'REJECTED' &&
                  payment.reviewNote && (
                    <p>
                      <strong>Admin note:</strong>{' '}
                      {payment.reviewNote}
                    </p>
                  )}

                <div className="dashboard-card-footer">
                  <span>
                    {payment.referenceType === 'UTR'
                      ? 'UTR'
                      : 'TRANSACTION ID'}
                  </span>
                  <strong>
                    {payment.referenceValue}
                  </strong>
                </div>

                {screenshotUrl && (
                  <img
                    src={screenshotUrl}
                    alt="Your submitted payment screenshot"
                    style={{
                      marginTop: '1rem',
                      maxWidth: '100%',
                      borderRadius: '4px',
                    }}
                  />
                )}
              </section>
            )}

            <section className="dashboard-card">
              <div className="dashboard-card-top">
                <span>
                  {payment
                    ? 'RESUBMIT PAYMENT EVIDENCE'
                    : 'SUBMIT PAYMENT EVIDENCE'}
                </span>
                <span>{payment ? '02' : '01'}</span>
              </div>

              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >
                <label>
                  <span>PAYMENT METHOD</span>

                  <select
                    value={method}
                    onChange={(event) =>
                      setMethod(
                        event.target
                          .value as PaymentMethod,
                      )
                    }
                  >
                    <option value="UPI">UPI</option>
                    <option value="BANK_TRANSFER">
                      BANK TRANSFER
                    </option>
                    <option value="CARD">CARD</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </label>

                <label>
                  <span>REFERENCE TYPE</span>

                  <select
                    value={referenceType}
                    onChange={(event) =>
                      setReferenceType(
                        event.target
                          .value as TransactionReferenceType,
                      )
                    }
                  >
                    <option value="TRANSACTION_ID">
                      TRANSACTION ID
                    </option>
                    <option value="UTR">
                      UTR NUMBER
                    </option>
                  </select>
                </label>

                <label>
                  <span>
                    {referenceType === 'UTR'
                      ? 'UTR NUMBER'
                      : 'TRANSACTION ID'}
                  </span>

                  <input
                    value={referenceValue}
                    onChange={(event) =>
                      setReferenceValue(
                        event.target.value,
                      )
                    }
                    placeholder="Enter the reference exactly as shown"
                    required
                    minLength={4}
                    maxLength={100}
                  />
                </label>

                <label>
                  <span>PAYMENT SCREENSHOT</span>

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setScreenshot(
                        event.target.files?.[0] ?? null,
                      )
                    }
                    required
                  />
                </label>

                {submitError && (
                  <p role="alert">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <RefreshCw size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                  {isSubmitting
                    ? 'SUBMITTING...'
                    : 'SUBMIT PAYMENT'}
                </button>
              </form>
            </section>
          </>
        )}

        <section className="dashboard-next">
          <div>
            <span>NEXT STEP</span>

            <h2>
              Payment feeds into
              <br />
              <em>webinar authorization.</em>
            </h2>
          </div>

          <div className="dashboard-next-status">
            <Check size={17} />
            <span>
              {payment?.status === 'VERIFIED'
                ? 'PAYMENT VERIFIED'
                : 'AWAITING VERIFICATION'}
            </span>
          </div>
        </section>
      </section>

      <footer className="dashboard-footer">
        <span>ENGINEERING_OS / 2026</span>
        <span>A clearer way through engineering.</span>
      </footer>
    </main>
  )
}
