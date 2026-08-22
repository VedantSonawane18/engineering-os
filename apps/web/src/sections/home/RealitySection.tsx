import { ArrowUpRight } from 'lucide-react'
import { challenges } from '../../data/homeContent'

export function RealitySection() {
  return <section className="problem section-grid" id="journey"><div className="section-marker" data-reveal>01 / THE REALITY</div><div className="section-intro" data-reveal><p className="overline">The gap nobody names</p><h2>You got into engineering.<br />The <em>manual</em> never arrived.</h2></div><div className="challenge-list">{challenges.map((challenge) => <article className="challenge" key={challenge.number} data-reveal><span>{challenge.number}</span><div><h3>{challenge.title}</h3><p>{challenge.copy}</p></div><ArrowUpRight size={19} /></article>)}</div></section>
}
