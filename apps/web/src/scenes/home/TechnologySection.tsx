import { useState } from 'react'
import { TechnologyPathway } from '../../components/technology/TechnologyPathway'
import { TechnologyPathwayNav } from '../../components/technology/TechnologyPathwayNav'
import { technologyPaths } from '../../data/technologyPaths'
import type { TechnologyPathId } from '../../types/technology'
import { TechnologyScene } from '../../scenes/technology/TechnologyScene'

export function TechnologySection() {
  const [activeId, setActiveId] =
    useState<TechnologyPathId>('development')

  const activeIndex = technologyPaths.findIndex(
    (path) => path.id === activeId,
  )

  return (
    <section
      id="technology"
      className="technology"
      aria-labelledby="technology-title"
    >
      <div className="technology__inner">

        {/* LEFT SYSTEM */}
        <aside className="technology__intro">

          <div>
            <p className="overline">
              Technology / direction / specialization
            </p>

            <h2 id="technology-title">
              Better inputs.
              <br />
              <em>Stronger signal.</em>
            </h2>

            <p className="technology__description">
              You do not need to learn everything.
              You need enough understanding to choose
              what deserves your time.
            </p>

            <p className="technology__note">
              Explore the paths.
              <br />
              Understand the work.
              <br />
              Then choose.
            </p>
          </div>

          <TechnologyScene activeIndex={activeIndex} />

          <div className="technology__statement">
            <span>∞</span>
            <p>
              Every path is a system.
              <br />
              Your clarity is the multiplier.
            </p>
          </div>

        </aside>

        {/* RIGHT SYSTEM */}
        <div className="technology__content">

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

          <div className="technology__career">
            <div>
              <span className="overline">
                AFTER THIS PATH
              </span>

              <strong>
                Build strong projects.
              </strong>
            </div>

            <div>
              <span>01</span>
              Build
            </div>

            <div>
              <span>02</span>
              Gain exposure
            </div>

            <div>
              <span>03</span>
              Build your portfolio
            </div>

            <div>
              <span>04</span>
              Become interview ready
            </div>

            <a href="#webinar">
              Explore career system
              <span>↗</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  )
}