import { ArrowUpRight } from 'lucide-react'
import { Magnetic } from '../../components/interaction/Magnetic'

export function RegisterSection() {
  return <section className="register" id="register"><div data-reveal><p className="overline">Your next step</p><h2>Build a four-year<br />plan worth following.</h2></div><Magnetic as="a" className="register-button" href="mailto:hello@engineeringos.in" cursorLabel="OPEN" reveal="section"><span>Reserve your place</span><ArrowUpRight size={25} /></Magnetic><div className="register-footer" data-reveal><span>ENGINEERING_OS / 2026</span><span>Designed for the first move.</span></div></section>
}
