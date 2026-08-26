import type { RefObject } from 'react'
import { gsap } from './gsap'

export function createJourneyScroll(root: RefObject<HTMLElement | null>, onActiveChange: (index: number) => void, isEnabled: boolean): () => void {
  if (!isEnabled) return () => undefined
  const context = gsap.context(() => {
    const section = root.current
    if (!section) return
    let activeIndex = 0
    gsap.to(section.querySelector('.journey-progress__line span'), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 70%', end: 'bottom 65%', scrub: 0.45, onUpdate: (self) => { const nextIndex = Math.min(3, Math.floor(self.progress * 4)); if (nextIndex !== activeIndex) { activeIndex = nextIndex; onActiveChange(nextIndex) } } } })
  }, root)
  return () => context.revert()
}

export function animateJourneySelection(root: RefObject<HTMLElement | null>, isEnabled: boolean): () => void {
  if (!isEnabled) return () => undefined
  const context = gsap.context(() => {
    const panel = root.current?.querySelector<HTMLElement>('.journey-year-panel.is-active')
    if (!panel) return
    gsap.from(panel.querySelectorAll('.journey-panel-heading, .journey-panel-list, .journey-panel-outcome'), { opacity: 0, y: 12, stagger: 0.055, duration: 0.38, ease: 'power2.out', clearProps: 'transform,opacity' })
  }, root)
  return () => context.revert()
}
