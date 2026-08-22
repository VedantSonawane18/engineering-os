import { webinarDetails } from '../../data/homeContent'

export function WebinarSection() {
  return <section className="webinar section-grid" id="webinar"><div className="webinar-meta" data-reveal><span>03 / LIVE SESSION</span><span>Limited room</span></div><div className="webinar-content" data-reveal><p className="overline">The engineering reset</p><h2>The roadmap<br />starts <em>here.</em></h2><p>A live working session for first-year students who want clarity before the semester turns into momentum.</p></div><div className="webinar-info" data-reveal>{webinarDetails.map((detail) => <div key={detail.label}><span>{detail.label}</span><strong>{detail.value}</strong></div>)}</div></section>
}
