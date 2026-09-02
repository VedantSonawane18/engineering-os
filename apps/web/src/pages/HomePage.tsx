import { useEffect, useRef } from 'react'
import { createHomeAnimations } from '../animations/homeAnimations'
import { SiteHeader } from '../components/layout/SiteHeader'
import { useLenisScroll } from '../hooks/useLenisScroll'
import { useHomeScroll } from '../hooks/useHomeScroll'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { HeroSection } from '../sections/home/HeroSection'
import { AcademicSystemSection } from '../sections/home/AcademicSystemSection'
import { JourneySection } from '../sections/home/JourneySection'
import { RealitySection } from '../sections/home/RealitySection'
import { RegisterSection } from '../sections/home/RegisterSection'
import { TechnologySection } from '../sections/home/TechnologySection'
import { WebinarSection } from '../sections/home/WebinarSection'
import { CareerSection } from '../sections/home/CareerSection'

export function HomePage() {
  const root = useRef<HTMLElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()
  const isMotionEnabled = !prefersReducedMotion
  useLenisScroll(isMotionEnabled)
  useEffect(() => createHomeAnimations(root, isMotionEnabled), [isMotionEnabled])
  useHomeScroll(root, isMotionEnabled)
  return <main ref={root}><SiteHeader /><HeroSection /><RealitySection /><JourneySection /><AcademicSystemSection /><TechnologySection /><WebinarSection /><RegisterSection /><CareerSection /></main>
}
