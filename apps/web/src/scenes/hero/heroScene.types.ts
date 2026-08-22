import type { MutableRefObject } from 'react'

export interface HeroSceneControls {
  readonly pointer: MutableRefObject<{ x: number; y: number }>
  readonly scrollProgress: MutableRefObject<number>
  readonly isVisible: boolean
}
