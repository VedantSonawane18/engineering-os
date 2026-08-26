import { useCallback, useEffect, useRef, useState } from 'react'
import { animateJourneySelection, createJourneyScroll } from '../../animations/journeyAnimations'
import { JourneyProgress } from '../../components/journey/JourneyProgress'
import { JourneyYearNav } from '../../components/journey/JourneyYearNav'
import { JourneyYearPanel } from '../../components/journey/JourneyYearPanel'
import { journeyYears } from '../../data/journey'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function JourneySection() {
  const root = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const setActiveYear = useCallback((index: number) => setActiveIndex(index), [])
  useEffect(() => createJourneyScroll(root, setActiveYear, !prefersReducedMotion), [prefersReducedMotion, setActiveYear])
  useEffect(() => animateJourneySelection(root, !prefersReducedMotion), [activeIndex, prefersReducedMotion])
  return <section className="journey" ref={root}><div className="journey-head section-grid"><div className="section-marker">02 / THE FOUR YEARS</div><h2>Not a race.<br />A sequence.</h2><p>You don't need to know everything in Year 1. You need to know what matters now.</p></div><div className="journey-experience"><JourneyProgress years={journeyYears} activeIndex={activeIndex} /><JourneyYearNav years={journeyYears} activeIndex={activeIndex} onSelect={setActiveYear} />{journeyYears.map((year, index) => <JourneyYearPanel key={year.id} year={year} active={index === activeIndex} />)}</div></section>
}
