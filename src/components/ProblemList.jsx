import { Fragment } from 'react';

export default function ProblemList({
  categories,
  filter,
  problems,
  progress,
  onFilterChange,
  onUncomplete,
  formatDate,
  isDue,
  problemUrl,
  progressKey,
}) {
  return (
    <>
      <div className="toolbar">
        <h2>Roadmap problems</h2>
        <div className="filters">
          {['all', ...categories].map((category) => (
            <button
              key={category}
              className={`filter ${filter === category ? 'active' : ''}`}
              onClick={() => onFilterChange(category)}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>
      <section className="card list-card">
        {categories
          .filter((category) => filter === 'all' || filter === category)
          .map((category) => {
            const items = problems
              .map((problem, index) => ({ problem, index }))
              .filter(({ problem }) => problem[1] === category);
            const finished = items.filter(({ problem }) => progress[progressKey(problem)]).length;

            return (
              <div className="accordion" key={category}>
                <button
                  className="accordion-trigger"
                  onClick={(event) => {
                    const content = event.currentTarget.nextElementSibling;
                    content.hidden = !content.hidden;
                  }}
                >
                  {category}
                  <span>
                    {finished}/{items.length} · ＋
                  </span>
                </button>
                <div>
                  {items.map(({ problem, index }) => {
                    const record = progress[progressKey(problem)];
                    let status = 'Not started';
                    let tone = 'new';
                    if (record?.status === 'mastered') {
                      tone = 'mastered';
                      status = `Mastered · next review ${formatDate(record.due)}`;
                    } else if (isDue(record)) {
                      tone = 'due';
                      status = 'Due for review';
                    } else if (record) {
                      tone = 'review';
                      status = `Reviewing · next ${formatDate(record.due)}`;
                    }

                    return (
                      <div className="problem" key={`${problem[3]}-${index}`}>
                        <div className="problem-name">
                          <span className={`dot ${tone}`} />
                          <span>{problem[0]}</span>
                          <span>
                            {problem[2]} · {status}
                          </span>
                        </div>
                        <div className="problem-actions">
                          <a
                            className="problem-link"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://leetcode.com/problems/${problem[3]}/`}
                          >
                            Solve ↗
                          </a>
                          {record && (
                            <Fragment>
                              <a
                                className="solution-link"
                                target="_blank"
                                rel="noreferrer"
                                href={problemUrl(problem)}
                              >
                                Solution ↗
                              </a>
                              <button
                                type="button"
                                className="solution-link"
                                style={{
                                  padding: 0,
                                  border: 0,
                                  background: 'none',
                                  cursor: 'pointer',
                                  font: 'inherit',
                                }}
                                onClick={() => onUncomplete(problem)}
                              >
                                Uncomplete
                              </button>
                            </Fragment>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </section>
    </>
  );
}
