export default function Stats({ doneCount, total, dueCount, masteredCount, progress }) {
  return (
    <section className="stats">
      <div className="card stat">
        <span className="stat-value">
          {doneCount}<small>/{total}</small>
        </span>
        <span className="stat-label">Attempted</span>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="card stat">
        <span className="stat-value">{dueCount}</span>
        <span className="stat-label">Due today</span>
      </div>
      <div className="card stat">
        <span className="stat-value">{masteredCount}</span>
        <span className="stat-label">Mastered</span>
      </div>
      <div className="card stat">
        <span className="stat-value">{Math.max(total - doneCount, 0)}</span>
        <span className="stat-label">Remaining</span>
      </div>
    </section>
  );
}
