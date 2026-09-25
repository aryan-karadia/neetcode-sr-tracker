export default function Hero({ activeSet, sets, onSetChange }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Your practice queue</p>
        <h1>Build recall that holds under pressure.</h1>
        <p className="hero-copy">
          Work through the roadmap in order, then revisit the patterns that need more reps. One
          focused recommendation at a time.
        </p>
      </div>
      <div className="select-group">
        <label className="label" htmlFor="practice-set">
          Practice set
        </label>
        <select
          id="practice-set"
          className="select"
          value={activeSet}
          onChange={(event) => onSetChange(event.target.value)}
        >
          {Object.entries(sets).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
