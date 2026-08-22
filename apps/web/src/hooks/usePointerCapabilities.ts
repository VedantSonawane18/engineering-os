import { useState } from 'react'

export interface PointerCapabilities {
  readonly isReady: boolean
  readonly supportsWebGL: boolean
  readonly hasFinePointer: boolean
}

export function usePointerCapabilities(): PointerCapabilities {
  const [capabilities] = useState<PointerCapabilities>(() => {
    const canvas = document.createElement('canvas')
    const supportsWebGL = Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'))
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches
    return { isReady: true, supportsWebGL, hasFinePointer }
  })
  return capabilities
}
