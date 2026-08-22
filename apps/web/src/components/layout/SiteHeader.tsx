import { Menu } from 'lucide-react'

export function SiteHeader() {
  return <header className="site-header"><a className="wordmark" href="#top" aria-label="Engineering OS home">ENGINEERING<span>_</span>OS</a><nav aria-label="Primary navigation"><a href="#journey">The journey</a><a href="#webinar">Webinar</a><a href="#register">Register</a></nav><button className="menu-button" type="button" aria-label="Open navigation"><Menu size={19} /></button></header>
}
