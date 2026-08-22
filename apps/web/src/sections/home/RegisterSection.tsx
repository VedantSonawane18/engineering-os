import { ArrowUpRight } from 'lucide-react'

export function RegisterSection() {
  return <section className="register" id="register"><div data-reveal><p className="overline">Your next step</p><h2>Build a four-year<br />plan worth following.</h2></div><a className="register-button" href="mailto:hello@engineeringos.in" data-reveal><span>Reserve your place</span><ArrowUpRight size={25} /></a><div className="register-footer" data-reveal><span>ENGINEERING_OS / 2026</span><span>Designed for the first move.</span></div></section>
}
