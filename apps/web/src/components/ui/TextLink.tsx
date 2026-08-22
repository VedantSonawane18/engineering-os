import type { ReactNode } from 'react'
import { ArrowDownRight } from 'lucide-react'
import { Magnetic } from '../interaction/Magnetic'

interface TextLinkProps { readonly href: string; readonly children: ReactNode; readonly reveal?: boolean; readonly magnetic?: boolean; readonly cursorLabel?: string }
export function TextLink({ href, children, reveal = false, magnetic = false, cursorLabel }: TextLinkProps) {
  const content = <>{children} <ArrowDownRight size={18} /></>
  if (magnetic) return <Magnetic as="a" className="text-link" href={href} cursorLabel={cursorLabel} reveal={reveal ? 'hero' : undefined}>{content}</Magnetic>
  return <a className="text-link" href={href} data-hero-reveal={reveal || undefined}>{content}</a>
}
