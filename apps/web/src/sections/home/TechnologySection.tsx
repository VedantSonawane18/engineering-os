import { useState } from 'react'
import { technologyPaths } from '../../data/technologyPaths'
import type { TechnologyPathId } from '../../types/technology'
import { TechnologyPathway } from '../../components/technology/TechnologyPathway'
import { TechnologyPathwayNav } from '../../components/technology/TechnologyPathwayNav'

export function TechnologySection() {
  const [activeId, setActiveId] =
    useState<TechnologyPathId>('development')

  return (
    <section
      id="technology"
      className="technology section-grid"
      aria-labelledby="technology-title"
    >
      <div className="technology-intro" data-reveal>
        <p className="overline">Technology / direction / specialization</p>

        <h2 id="technology-title">
          Better inputs.
          <br />
          <em>Stronger signal.</em>
        </h2>

        <p>
          You do not need to learn everything. You need enough
          understanding to choose what deserves your time.
        </p>

        <p className="technology-intro__note">
          Explore the paths. Understand the work. Then choose.
        </p>
      </div>

      <div className="technology-system" data-reveal>
        <TechnologyPathwayNav
          paths={technologyPaths}
          activeId={activeId}
          onSelect={setActiveId}
        />

        <div className="technology-pathways">
          {technologyPaths.map((path) => (
            <TechnologyPathway
              key={path.id}
              path={path}
              isActive={path.id === activeId}
              onSelect={setActiveId}
            />
          ))}
        </div>
      </div>
    </section>
  )
}