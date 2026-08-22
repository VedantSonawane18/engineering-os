import { usePointerCapabilities } from '../../hooks/usePointerCapabilities'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useCursor } from '../../hooks/useCursor'

export function Cursor() {
  const { hasFinePointer, isReady } = usePointerCapabilities()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isEnabled = isReady && hasFinePointer && !prefersReducedMotion
  const { elementRef, label } = useCursor(isEnabled)
  if (!isEnabled) return null
  return <div ref={elementRef} className={`cursor${label ? ' cursor--interactive' : ''}`} aria-hidden="true"><span className="cursor__horizontal" /><span className="cursor__vertical" />{label ? <span className="cursor__label">{label}</span> : null}</div>
}
