import type { TechnologyPath } from '../../types/technology'

interface TechnologyPathwayProps {
  path: TechnologyPath
  isActive: boolean
  onSelect: (id: TechnologyPath['id']) => void
}

export function TechnologyPathway({
  path,
  isActive,
  onSelect,
}: TechnologyPathwayProps) {
  return (
    <article
      className={`technology-pathway${isActive ? ' is-active' : ''}`}
      data-pathway={path.id}
    >
      <button
        type="button"
        className="technology-pathway__trigger"
        aria-pressed={isActive}
        onClick={() => onSelect(path.id)}
      >
        <span className="technology-pathway__number">{path.number}</span>

        <span className="technology-pathway__title">
          {path.title}
        </span>

        <span className="technology-pathway__indicator" aria-hidden="true">
          {isActive ? '−' : '+'}
        </span>
      </button>

      <div
        className="technology-pathway__panel"
        aria-hidden={!isActive}
      >
        <p className="technology-pathway__thesis">{path.thesis}</p>

        <p className="technology-pathway__description">
          {path.description}
        </p>

        <div className="technology-pathway__details">
          <div>
            <span className="overline">SUITABLE FOR</span>

            <ul>
              {path.suitableFor.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="overline">TECHNOLOGIES</span>

            <ul>
              {path.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>

          <div>
            <span className="overline">POTENTIAL ROLES</span>

            <ul>
              {path.roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="technology-pathway__progress">
          <span className="overline">PROGRESSION</span>

          <div className="technology-pathway__steps">
            {path.progression.map((step, index) => (
              <span key={step}>
                <i aria-hidden="true">{String(index + 1).padStart(2, '0')}</i>
                {step}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}