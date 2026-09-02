import { careerStages } from '../../data/careerSystem'

export function CareerSection() {
  return (
    <section
      id="career"
      className="career"
      aria-labelledby="career-title"
    >
      <div className="career__header" data-reveal>
        <p className="overline">
          Career / proof / opportunity
        </p>

        <h2 id="career-title">
          Your degree is the environment.
          <br />
          <em>Your work is the evidence.</em>
        </h2>

        <p>
          A career is rarely one giant decision. It is a sequence of
          small decisions that compound over four years.
        </p>
      </div>

      <div className="career__system">
        <div className="career__line" aria-hidden="true">
          <span />
        </div>

        <ol className="career__stages">
          {careerStages.map((stage) => (
            <li
              key={stage.number}
              className="career-stage"
              data-career-stage
            >
              <div className="career-stage__marker">
                <span>{stage.number}</span>
                <i aria-hidden="true" />
              </div>

              <div className="career-stage__content">
                <p>{stage.number}</p>

                <h3>{stage.title}</h3>

                <span>{stage.outcome}</span>

                <p>{stage.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="career__closing" data-reveal>
        <span className="overline">THE COMPOUNDING EFFECT</span>

        <p>
          Learn something.
          <br />
          Build something.
          <br />
          Prove something.
          <br />
          Repeat.
        </p>

        <span className="career__arrow" aria-hidden="true">
          ↓
        </span>
      </div>
    </section>
  )
}