import { useEffect, useRef, useState } from 'react'
import type { MutableRefObject } from 'react'
import { ScrollTrigger } from '../animations/gsap'

export interface HeroSceneController {
  readonly pointer: MutableRefObject<{ x: number; y: number }>
  readonly scrollProgress: MutableRefObject<number>
  readonly isVisible: boolean
}

export function useHeroScene(element: HTMLElement | null, isEnabled: boolean): HeroSceneController {
  const pointer = useRef({ x: 0, y: 0 })
  const scrollProgress = useRef(0)
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    if (!element || !isEnabled) return
    const onPointerMove = (event: PointerEvent) => {
      const bounds = element.getBoundingClientRect()
      pointer.current.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
      pointer.current.y = -((event.clientY - bounds.top) / bounds.height - 0.5) * 2
    }
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.01 })
    const trigger = ScrollTrigger.create({ trigger: element, start: 'top bottom', end: 'bottom top', onUpdate: (self) => { scrollProgress.current = self.progress } })
    element.addEventListener('pointermove', onPointerMove, { passive: true })
    observer.observe(element)
    return () => { element.removeEventListener('pointermove', onPointerMove); observer.disconnect(); trigger.kill() }
  }, [element, isEnabled])
  return { pointer, scrollProgress, isVisible }
}
