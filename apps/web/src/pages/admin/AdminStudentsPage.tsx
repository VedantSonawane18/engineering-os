import {
  ArrowLeft,
  ArrowUpRight,
  Circle,
  RefreshCw,
  Trash2,
} from 'lucide-react'
import {
  Link,
  Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../../auth/useAuth'
import {
  deleteStudent,
  getAdminStudents,
  type AdminStudent,
  type ApprovalStatus,
} from '../../admin/adminApi'

type Filter = 'ALL' | ApprovalStatus

export function AdminStudentsPage() {
  const {
    user,
    isLoading: authLoading,
  } = useAuth()

  const [students, setStudents] = useState<
    AdminStudent[]
  >([])

  const [filter, setFilter] =
    useState<Filter>('ALL')

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState('')

  const [deletingStudentId, setDeletingStudentId] =
    useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function initialise() {
      try {
        const result =
          await getAdminStudents()

        if (cancelled) {
          return
        }

        setStudents(result)
        setError('')
      } catch (loadError) {
        if (cancelled) {
          return
        }

        setStudents([])

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load students.',
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void initialise()

    return () => {
      cancelled = true
    }
  }, [])

  async function loadStudents() {
    setIsLoading(true)
    setError('')

    try {
      const result =
        await getAdminStudents()

      setStudents(result)
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'Unable to load students.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDeleteStudent(
    student: AdminStudent,
  ) {
    const confirmed =
      window.confirm(
        [
          'DELETE STUDENT ACCOUNT?',
          '',
          `Student: ${student.fullName}`,
          `Email: ${student.email}`,
          '',
          'This will permanently remove:',
          '• The student account',
          '• Payment information',
          '• Uploaded payment evidence',
          '• Student profile data',
          '• Support tickets',
          '• Ticket messages',
          '',
          'This action cannot be undone.',
          '',
          'Continue?',
        ].join('\n'),
      )

    if (!confirmed) {
      return
    }

    setError('')
    setDeletingStudentId(student.id)

    try {
      await deleteStudent(student.id)

      setStudents((currentStudents) =>
        currentStudents.filter(
          (currentStudent) =>
            currentStudent.id !== student.id,
        ),
      )
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : 'Unable to delete student account.',
      )
    } finally {
      setDeletingStudentId(null)
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

  const filteredStudents =
    filter === 'ALL'
      ? students
      : students.filter(
          (student) =>
            student.approvalStatus === filter,
        )

  const pendingCount = students.filter(
    (student) =>
      student.approvalStatus === 'PENDING',
  ).length

  const underReviewCount = students.filter(
    (student) =>
      student.approvalStatus === 'UNDER_REVIEW',
  ).length

  const approvedCount = students.filter(
    (student) =>
      student.approvalStatus === 'APPROVED',
  ).length

  const rejectedCount = students.filter(
    (student) =>
      student.approvalStatus === 'REJECTED',
  ).length

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
          <span>ADMIN / STUDENTS</span>

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
              ADMINISTRATION / 03
            </p>

            <h1>
              Student
              <br />
              <em>Directory.</em>
            </h1>
          </div>

          <div className="dashboard-intro-meta">
            <span>ENGINEERING OS</span>
            <span>STUDENT REVIEW</span>
          </div>
        </div>

        <div className="dashboard-rule" />

        <section className="dashboard-status-grid">
          <article className="dashboard-card account-card">
            <div className="dashboard-card-top">
              <span>TOTAL STUDENTS</span>
              <span>01</span>
            </div>

            <div className="dashboard-card-main">
              <h2>{students.length}</h2>
              <p>Registered student accounts.</p>
            </div>

            <div className="dashboard-card-footer">
              <span>DIRECTORY</span>
              <strong>LIVE</strong>
            </div>
          </article>

          <article className="dashboard-card approval-card">
            <div className="dashboard-card-top">
              <span>REQUIRES ATTENTION</span>
              <span>02</span>
            </div>

            <div className="approval-status">
              <span className="approval-indicator approval-pending">
                <Circle
                  size={9}
                  fill="currentColor"
                />
              </span>

              <strong>
                {pendingCount} PENDING
              </strong>
            </div>

            <p>
              Applications currently waiting
              for administrator review.
            </p>

            <div className="dashboard-card-footer">
              <span>
                REVIEW / APPROVED / REJECTED
              </span>

              <strong>
                {underReviewCount} / {approvedCount} /{' '}
                {rejectedCount}
              </strong>
            </div>
          </article>
        </section>

        <section className="dashboard-system admin-student-directory">
          <div className="dashboard-section-heading">
            <div>
              <p className="overline">
                REGISTERED STUDENTS
              </p>

              <h2>
                Review every
                <br />
                <em>student account.</em>
              </h2>
            </div>

            <span>
              {filteredStudents.length} /{' '}
              {students.length}
            </span>
          </div>

          <div className="admin-student-filters">
            {(
              [
                ['ALL', students.length],
                ['PENDING', pendingCount],
                [
                  'UNDER_REVIEW',
                  underReviewCount,
                ],
                ['APPROVED', approvedCount],
                ['REJECTED', rejectedCount],
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
                onClick={() =>
                  setFilter(value)
                }
              >
                {value === 'UNDER_REVIEW'
                  ? 'UNDER REVIEW'
                  : value}

                <span>{count}</span>
              </button>
            ))}
          </div>

          {isLoading && (
            <div className="dashboard-loading admin-list-loading">
              <RefreshCw size={18} />

              <span>
                LOADING STUDENT DIRECTORY...
              </span>
            </div>
          )}

          {!isLoading && error && (
            <div className="dashboard-error admin-list-error">
              <p>{error}</p>

              <button
                type="button"
                onClick={() =>
                  void loadStudents()
                }
              >
                <RefreshCw size={16} />
                TRY AGAIN
              </button>
            </div>
          )}

          {!isLoading &&
            !error &&
            filteredStudents.length === 0 && (
              <div className="admin-empty-state">
                <span>NO ACCOUNTS FOUND</span>

                <p>
                  There are no students matching
                  this filter.
                </p>
              </div>
            )}

          {!isLoading &&
            !error &&
            filteredStudents.length > 0 && (
              <div className="admin-student-list">
                {filteredStudents.map(
                  (student, index) => (
                    <Link
                      key={student.id}
                      to={`/admin/students/${student.id}`}
                      className="admin-student-row"
                    >
                      <div className="admin-student-number">
                        {String(index + 1).padStart(
                          2,
                          '0',
                        )}
                      </div>

                      <div className="admin-student-info">
                        <h3>
                          {student.fullName}
                        </h3>

                        <p>{student.email}</p>
                      </div>

                      <div
                        className={`admin-student-status admin-status-${student.approvalStatus.toLowerCase()}`}
                      >
                        <Circle
                          size={8}
                          fill="currentColor"
                        />

                        {student.approvalStatus ===
                        'UNDER_REVIEW'
                          ? 'UNDER REVIEW'
                          : student.approvalStatus}
                      </div>

                      <div className="admin-student-date">
                        {new Date(
                          student.createdAt,
                        ).toLocaleDateString(
                          'en-IN',
                          {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          },
                        )}
                      </div>

                      <button
                        type="button"
                        aria-label={`Delete ${student.fullName}`}
                        title={`Delete ${student.fullName}`}
                        disabled={
                          deletingStudentId ===
                          student.id
                        }
                        onClick={(event) => {
                          event.preventDefault()
                          event.stopPropagation()

                          void handleDeleteStudent(
                            student,
                          )
                        }}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          border: '1px solid currentColor',
                          background: 'transparent',
                          padding: '0.55rem',
                          cursor:
                            deletingStudentId ===
                            student.id
                              ? 'wait'
                              : 'pointer',
                          opacity:
                            deletingStudentId ===
                            student.id
                              ? 0.5
                              : 1,
                        }}
                      >
                        {deletingStudentId ===
                        student.id ? (
                          <RefreshCw
                            size={17}
                          />
                        ) : (
                          <Trash2 size={17} />
                        )}
                      </button>

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
          Administrator control system.
        </span>
      </footer>
    </main>
  )
}