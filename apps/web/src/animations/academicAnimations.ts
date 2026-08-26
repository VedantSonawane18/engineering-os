import type { RefObject } from 'react'
import { gsap } from './gsap'

export function createAcademicScroll(root: RefObject<HTMLElement | null>, onActiveChange: (index: number) => void, isEnabled: boolean): () => void {
  if (!isEnabled) return () => undefined
  const context = gsap.context(() => {
    const section = root.current
    if (!section) return
    const factorCount = section.querySelectorAll('.academic-flow button').length
    let activeIndex = 0
    gsap.timeline({ scrollTrigger: { trigger: section, start: 'top 72%', end: 'bottom 65%', scrub: 0.45, onUpdate: (self) => { const nextIndex = Math.min(factorCount - 1, Math.floor(self.progress * factorCount)); if (nextIndex !== activeIndex) { activeIndex = nextIndex; onActiveChange(nextIndex) } } } })
      .from(section.querySelector('.academic-flow__line'), { scaleX: 0, transformOrigin: 'left center', ease: 'none' })
      .from(section.querySelector('.academic-outcome'), { opacity: 0.35, y: 12, ease: 'none' }, 0)
  }, root)
  return () => context.revert()
}

export function animateAcademicSelection(root: RefObject<HTMLElement | null>, isEnabled: boolean): () => void {
  if (!isEnabled) return () => undefined
  const context = gsap.context(() => {
    const factor = root.current?.querySelector<HTMLElement>('.academic-factor.is-active')
    if (factor) gsap.from(factor.children, { opacity: 0, y: 10, duration: 0.36, stagger: 0.06, ease: 'power2.out', clearProps: 'transform,opacity' })
  }, root)
  return () => context.revert()
}
