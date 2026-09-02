import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '../../components/interaction/Magnetic'
import { useAuth } from '../../auth/useAuth'

export function RegisterSection() {
  const { user, isLoading } = useAuth()

  const isAuthenticated = user !== null

  return (
    <section className="register" id="register">
      <div data-reveal>
        <p className="overline">
          {isAuthenticated
            ? 'Your workspace'
            : 'Your next step'}
        </p>

        <h2>
          {isAuthenticated ? (
            <>
              Your engineering
              <br />
              <em>system awaits.</em>
            </>
          ) : (
            <>
              Build a four-year
              <br />
              plan worth following.
            </>
          )}
        </h2>
      </div>

      <Magnetic
        as="a"
        className="register-button"
        href={isAuthenticated ? '/dashboard' : '/signup'}
        cursorLabel={isAuthenticated ? 'OPEN' : 'JOIN'}
        reveal="section"
      >
        <span>
          {isLoading
            ? 'Loading...'
            : isAuthenticated
              ? 'Open dashboard'
              : 'Reserve your place'}
        </span>

        <ArrowUpRight size={25} />
      </Magnetic>

      <div className="register-footer" data-reveal>
        <span>ENGINEERING_OS / 2026</span>
        <span>
          {isAuthenticated
            ? 'Your system. Your direction.'
            : 'Designed for the first move.'}
        </span>
      </div>
    </section>
  )
}