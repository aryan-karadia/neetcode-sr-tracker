export default function Header({ onReset }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="brand">
          <div className="logo">N</div>
          <div>
            <div className="brand-name">Pattern Recall</div>
            <div className="brand-sub">Spaced repetition for coding interviews</div>
          </div>
        </div>
        <div className="private-note">
          <span className="status-dot" /> Stored locally · private by default
          <button className="reset-button" onClick={onReset}>
            Reset progress
          </button>
        </div>
      </div>
    </header>
  );
}
