import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { gsap } from '../../animations/gsap'

interface MagneticBaseProps { readonly children: ReactNode; readonly className: string; readonly cursorLabel?: string; readonly reveal?: 'hero' | 'section' }
interface MagneticLinkProps extends MagneticBaseProps { readonly as: 'a'; readonly href: string }
interface MagneticButtonProps extends MagneticBaseProps { readonly as: 'button'; readonly type?: 'button' | 'submit' | 'reset' }
type MagneticProps = MagneticLinkProps | MagneticButtonProps

export function Magnetic(props: MagneticProps) {
  const elementRef = useRef<HTMLElement | null>(null)
  const setElement = (element: HTMLAnchorElement | HTMLButtonElement | null) => { elementRef.current = element }
  useEffect(() => {
    const element = elementRef.current
    if (!element || !window.matchMedia('(pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const moveToX = gsap.quickTo(element, 'x', { duration: 0.32, ease: 'power3.out' })
    const moveToY = gsap.quickTo(element, 'y', { duration: 0.32, ease: 'power3.out' })
    const reset = () => { moveToX(0); moveToY(0) }
    const move = (event: Event) => { if (!(event instanceof PointerEvent)) return; const bounds = element.getBoundingClientRect(); moveToX(((event.clientX - bounds.left) / bounds.width - 0.5) * 10); moveToY(((event.clientY - bounds.top) / bounds.height - 0.5) * 10) }
    element.addEventListener('pointermove', move)
    element.addEventListener('pointerleave', reset)
    element.addEventListener('blur', reset)
    return () => { element.removeEventListener('pointermove', move); element.removeEventListener('pointerleave', reset); element.removeEventListener('blur', reset); gsap.set(element, { x: 0, y: 0 }) }
  }, [])
  const commonProps = { ref: setElement, className: `${props.className} magnetic`, 'data-cursor-label': props.cursorLabel, 'data-hero-reveal': props.reveal === 'hero' || undefined, 'data-reveal': props.reveal === 'section' || undefined }
  return props.as === 'a' ? <a {...commonProps} href={props.href}>{props.children}</a> : <button {...commonProps} type={props.type ?? 'button'}>{props.children}</button>
}
