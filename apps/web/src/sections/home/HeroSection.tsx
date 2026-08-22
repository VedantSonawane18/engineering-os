import { lazy, Suspense } from 'react'
import { TextLink } from '../../components/ui/TextLink'
import { usePointerCapabilities } from '../../hooks/usePointerCapabilities'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const HeroScene = lazy(async () => {
  const module = await import('../../scenes/hero/HeroScene')
  return { default: module.HeroScene }
})

export function HeroSection() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const capabilities = usePointerCapabilities()
  const isSceneEnabled = capabilities.isReady && capabilities.supportsWebGL && capabilities.hasFinePointer && !prefersReducedMotion
  const fallback = <div className="hero-system" aria-hidden="true" data-hero-reveal><span className="system-label top">STUDENT / V0.1</span><span className="system-label right">01—04</span><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="core">E<br />O</div><span className="system-label bottom">INITIALISE YOUR PATH</span></div>
  return <section className="hero section-grid" id="top"><div className="eyebrow" data-hero-reveal><span /> A clearer way through engineering</div><div className="hero-copy"><h1 data-hero-reveal>Engineering<br /><em>has a system.</em><br />Nobody showed you.</h1><p data-hero-reveal>Engineering OS turns the four years ahead into a path you can actually navigate — from your first lecture to your first offer.</p><TextLink href="#register" reveal>Start exploring</TextLink></div>{isSceneEnabled ? <Suspense fallback={fallback}><HeroScene isEnabled={isSceneEnabled} /></Suspense> : fallback}<div className="hero-footer" data-hero-reveal><span>SCROLL TO ENTER</span><span>↓</span><span>INDIA / 2026</span></div></section>
}
