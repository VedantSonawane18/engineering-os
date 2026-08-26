import { useCallback, useEffect, useRef, useState } from 'react'
import { animateAcademicSelection, createAcademicScroll } from '../../animations/academicAnimations'
import { AcademicFactor } from '../../components/academic/AcademicFactor'
import { AcademicFlow } from '../../components/academic/AcademicFlow'
import { AcademicOutcome } from '../../components/academic/AcademicOutcome'
import { academicFactors } from '../../data/academicSystem'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function AcademicSystemSection() {
  const root = useRef<HTMLElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const setActiveFactor = useCallback((index: number) => setActiveIndex(index), [])
  useEffect(() => createAcademicScroll(root, setActiveFactor, !prefersReducedMotion), [prefersReducedMotion, setActiveFactor])
  useEffect(() => animateAcademicSelection(root, !prefersReducedMotion), [activeIndex, prefersReducedMotion])
  return <section className="academic-system" ref={root}><div className="academic-system__head section-grid"><div className="section-marker">03 / THE ACADEMIC SYSTEM</div><div><p className="overline">Keep doors open</p><h2>CGPA isn't your career.<br />But it can decide which <em>doors</em> you're allowed to knock on.</h2></div></div><div className="academic-system__body"><AcademicFlow factors={academicFactors} activeIndex={activeIndex} onSelect={setActiveFactor} />{academicFactors.map((factor, index) => <AcademicFactor key={factor.id} factor={factor} active={index === activeIndex} />)}<AcademicOutcome /></div></section>
}
