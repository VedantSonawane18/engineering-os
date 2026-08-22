import { useEffect } from 'react'
import type { RefObject } from 'react'
import { createHomeScroll } from '../animations/homeScroll'

export function useHomeScroll(root: RefObject<HTMLElement | null>, isEnabled: boolean): void {
  useEffect(() => createHomeScroll(root, isEnabled), [root, isEnabled])
}
