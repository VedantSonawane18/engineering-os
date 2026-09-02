import type { TechnologyPath } from '../../types/technology'

interface TechnologyPathwayNavProps {
  paths: readonly TechnologyPath[]
  activeId: TechnologyPath['id']
  onSelect: (id: TechnologyPath['id']) => void
}

export function TechnologyPathwayNav({
  paths,
  activeId,
  onSelect,
}: TechnologyPathwayNavProps) {
  return (
    <nav className="technology-pathway-nav" aria-label="Technology pathways">
      {paths.map((path) => (
        <button
          key={path.id}
          type="button"
          className={activeId === path.id ? 'is-active' : ''}
          aria-pressed={activeId === path.id}
          onClick={() => onSelect(path.id)}
        >
          <span>{path.number}</span>
          <strong>{path.title}</strong>
        </button>
      ))}
    </nav>
  )
}