import { TextLink } from '../../components/ui/TextLink'

export function SignalSection() {
  return <section className="signal section-grid"><div className="signal-visual" data-reveal><div className="signal-axis x" /><div className="signal-axis y" /><div className="signal-point one" /><div className="signal-point two" /><div className="signal-point three" /><span>YOUR EFFORT</span><span>YOUR DIRECTION</span></div><div className="signal-copy" data-reveal><p className="overline">Academic strategy / technology / career</p><h2>Better inputs.<br /><em>Stronger signal.</em></h2><p>Your CGPA is one signal. Your projects, thinking and consistency are others. Learn how the system connects.</p><TextLink href="#webinar">See the framework</TextLink></div></section>
}
