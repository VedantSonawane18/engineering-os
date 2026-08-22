import type { RefObject } from 'react'
import { gsap } from './gsap'

export function createHomeScroll(root: RefObject<HTMLElement | null>, isEnabled: boolean): () => void {
  if (!isEnabled) return () => undefined
  const context = gsap.context(() => {
    const hero = root.current?.querySelector<HTMLElement>('.hero')
    if (hero) {
      gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.65 } })
        .to(hero.querySelector('.hero-copy h1'), { yPercent: -12, ease: 'none' }, 0)
        .to(hero.querySelector('.hero-copy p'), { yPercent: -7, opacity: 0.62, ease: 'none' }, 0)
        .to(hero.querySelector('.hero-scene, .hero-system'), { scale: 0.91, opacity: 0.48, yPercent: -4, ease: 'none' }, 0)
    }
    const reality = root.current?.querySelector<HTMLElement>('.problem')
    if (reality) {
      const manual = reality.querySelector('.reality-mask')
      const rows = gsap.utils.toArray<HTMLElement>(reality.querySelectorAll('.challenge'))
      gsap.timeline({ scrollTrigger: { trigger: reality, start: 'top 76%', once: true } })
        .from(reality.querySelector('.section-marker'), { opacity: 0, y: 12, duration: 0.45, ease: 'power2.out' })
        .from(manual, { clipPath: 'inset(0 100% 0 0)', duration: 0.7, ease: 'power3.out' }, 0.08)
      gsap.from(rows, { opacity: 0, y: 18, duration: 0.5, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: reality.querySelector('.challenge-list'), start: 'top 84%', once: true }, onStart: () => rows.forEach((row) => row.classList.add('is-active')) })
    }
    const journey = root.current?.querySelector<HTMLElement>('.journey')
    if (journey) {
      const track = journey.querySelector<HTMLElement>('.year-track')
      const years = gsap.utils.toArray<HTMLElement>(journey.querySelectorAll('.year'))
      if (track && years.length) gsap.to(track, { '--journey-progress': 1, ease: 'none', scrollTrigger: { trigger: journey, start: 'top 65%', end: 'bottom 65%', scrub: 0.45, onUpdate: (self) => { const activeIndex = Math.min(years.length - 1, Math.floor(self.progress * years.length)); years.forEach((year, index) => year.classList.toggle('is-active', index === activeIndex)) } } })
    }
    const signal = root.current?.querySelector<HTMLElement>('.signal')
    if (signal) gsap.timeline({ scrollTrigger: { trigger: signal, start: 'top 77%', end: 'center 58%', scrub: 0.5 } })
      .from(signal.querySelectorAll('.signal-axis'), { scaleX: 0, transformOrigin: 'left center', stagger: 0.12, ease: 'none' })
      .from(signal.querySelectorAll('.signal-point'), { scale: 0.3, opacity: 0, stagger: 0.11, ease: 'none' }, 0.1)
      .from(signal.querySelector('.signal-copy'), { x: 20, opacity: 0.5, ease: 'none' }, 0)
    const webinar = root.current?.querySelector<HTMLElement>('.webinar')
    if (webinar) gsap.timeline({ scrollTrigger: { trigger: webinar, start: 'top 78%', once: true } })
      .from(webinar.querySelector('.webinar-meta'), { opacity: 0, y: 18, duration: 0.45, ease: 'power2.out' })
      .from(webinar.querySelector('.webinar-content h2'), { y: 36, opacity: 0, duration: 0.72, ease: 'power3.out' }, 0.08)
      .from(webinar.querySelector('.webinar-content p:last-child'), { opacity: 0, y: 14, duration: 0.45, ease: 'power2.out' }, 0.32)
      .from(webinar.querySelectorAll('.webinar-info div'), { opacity: 0, y: 12, duration: 0.4, stagger: 0.1, ease: 'power2.out' }, 0.43)
    const register = root.current?.querySelector<HTMLElement>('.register')
    if (register) gsap.timeline({ scrollTrigger: { trigger: register, start: 'top 78%', once: true } })
      .from(register.querySelector('h2'), { y: 22, opacity: 0, duration: 0.6, ease: 'power3.out' })
      .from(register.querySelector('.register-button'), { scale: 0.94, opacity: 0, duration: 0.55, ease: 'power2.out' }, 0.2)
  }, root)
  return () => context.revert()
}
