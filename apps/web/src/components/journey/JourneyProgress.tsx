import type { JourneyYear } from '../../types/content'
interface JourneyProgressProps { readonly years: readonly JourneyYear[]; readonly activeIndex: number }
export function JourneyProgress({ years, activeIndex }: JourneyProgressProps) { return <div className="journey-progress" aria-hidden="true"><div className="journey-progress__line"><span style={{ transform: `scaleX(${(activeIndex + 1) / years.length})` }} /></div><div className="journey-progress__labels">{years.map((year) => <span key={year.id}>{year.title}</span>)}</div></div> }
