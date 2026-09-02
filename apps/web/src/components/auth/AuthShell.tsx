import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface AuthShellProps {
  readonly eyebrow: string
  readonly title: ReactNode
  readonly description: string
  readonly children: ReactNode
  readonly footer: ReactNode
}

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <main className="auth-page">
      <header className="auth-header">
        <Link to="/" className="auth-wordmark">
          ENGINEERING<span>_OS</span>
        </Link>

        <span className="auth-index">
          ENGINEERING OS / 2026
        </span>
      </header>

      <section className="auth-layout">
        <div className="auth-intro">
          <p className="overline">{eyebrow}</p>

          <h1>{title}</h1>

          <p>{description}</p>
        </div>

        <div className="auth-panel">
          {children}

          <div className="auth-footer">
            {footer}
          </div>
        </div>
      </section>
    </main>
  )
}