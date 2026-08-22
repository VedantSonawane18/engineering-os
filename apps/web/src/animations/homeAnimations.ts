import type { RefObject } from 'react'
import { gsap } from './gsap'

export function createHomeAnimations(root: RefObject<HTMLElement | null>, isEnabled: boolean): () => void {
  if (!isEnabled) return () => undefined
  const context = gsap.context(() => {
    gsap.from('[data-hero-reveal]', { y: 28, opacity: 0, duration: 0.95, ease: 'power3.out', stagger: 0.09, delay: 0.15 })
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, { y: 32, opacity: 0, duration: 0.75, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 88%' } })
    })
  }, root)
  return () => context.revert()
}
