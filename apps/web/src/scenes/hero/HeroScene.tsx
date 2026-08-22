import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useHeroScene } from '../../hooks/useHeroScene'
import { EngineeringLattice } from './EngineeringLattice'
import { SceneLights } from './SceneLights'

interface HeroSceneProps { readonly isEnabled: boolean }
export function HeroScene({ isEnabled }: HeroSceneProps) {
  const [element, setElement] = useState<HTMLDivElement | null>(null)
  const controls = useHeroScene(element, isEnabled)
  return <div ref={setElement} className="hero-scene" data-hero-reveal aria-hidden="true"><Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.25], fov: 42 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }} frameloop={controls.isVisible ? 'always' : 'never'}><SceneLights /><EngineeringLattice {...controls} /></Canvas></div>
}
