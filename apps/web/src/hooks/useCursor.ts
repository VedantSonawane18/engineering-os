import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { gsap } from '../animations/gsap'

interface CursorState { readonly elementRef: RefObject<HTMLDivElement | null>; readonly label: string | null }

export function useCursor(isEnabled: boolean): CursorState {
  const elementRef = useRef<HTMLDivElement>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const position = useRef({ x: 0, y: 0 })
  const labelRef = useRef<string | null>(null)
  const [label, setLabel] = useState<string | null>(null)
  useEffect(() => {
    if (!isEnabled || !elementRef.current) return
    const element = elementRef.current
    const setX = gsap.quickSetter(element, 'x', 'px')
    const setY = gsap.quickSetter(element, 'y', 'px')
    const setOpacity = gsap.quickSetter(element, 'opacity')
    const updateLabel = (target: EventTarget | null) => {
      const nextLabel = target instanceof Element ? target.closest<HTMLElement>('[data-cursor-label]')?.dataset.cursorLabel ?? null : null
      if (nextLabel !== labelRef.current) { labelRef.current = nextLabel; setLabel(nextLabel) }
    }
    const onPointerMove = (event: PointerEvent) => { pointer.current.x = event.clientX; pointer.current.y = event.clientY; setOpacity(1); updateLabel(event.target) }
    const onPointerLeave = () => setOpacity(0)
    const tick = () => {
      position.current.x += (pointer.current.x - position.current.x) * 0.18
      position.current.y += (pointer.current.y - position.current.y) * 0.18
      setX(position.current.x)
      setY(position.current.y)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onPointerLeave)
    gsap.ticker.add(tick)
    return () => { window.removeEventListener('pointermove', onPointerMove); document.documentElement.removeEventListener('pointerleave', onPointerLeave); gsap.ticker.remove(tick) }
  }, [isEnabled])
  return { elementRef, label }
}
