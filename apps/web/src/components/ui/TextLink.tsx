import type { ReactNode } from 'react'
import { ArrowDownRight } from 'lucide-react'

interface TextLinkProps { readonly href: string; readonly children: ReactNode; readonly reveal?: boolean }
export function TextLink({ href, children, reveal = false }: TextLinkProps) {
  return <a className="text-link" href={href} data-hero-reveal={reveal || undefined}>{children} <ArrowDownRight size={18} /></a>
}
