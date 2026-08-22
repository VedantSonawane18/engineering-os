import { journeyYears } from '../../data/homeContent'

export function JourneySection() {
  return <section className="journey"><div className="journey-head section-grid" data-reveal><div className="section-marker">02 / THE FOUR YEARS</div><h2>Not a race.<br />A sequence.</h2><p>Each year asks something different of you. See the next move, before it becomes urgent.</p></div><div className="year-track">{journeyYears.map((year, index) => <article className="year" key={year.label} data-reveal><div className="year-number">0{index + 1}</div><p className="overline">{year.label}</p><h3>{year.title}</h3><p>{year.copy}</p><span className="line" /></article>)}</div></section>
}
