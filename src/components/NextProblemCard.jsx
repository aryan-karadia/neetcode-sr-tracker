import { Fragment } from 'react';
import { Badge, Button } from './ui';

export default function NextProblemCard({
  next,
  problems,
  completedIdx,
  onMarkStarted,
  onMoveNext,
  onGrade,
  onNotify,
  problemUrl,
}) {
  const problem = next ? problems[next.idx] : null;

  return (
    <section className="card next-card">
      {problem ? (
        <>
          <p className="next-heading">Next up · {next.type === 'due' ? 'Review' : 'New problem'}</p>
          <div className="badges">
            <Badge tone={next.type === 'due' ? 'due' : 'primary'}>
              {next.type === 'due' ? 'Review' : 'New'}
            </Badge>
            <Badge>{problem[1]}</Badge>
            <Badge>{problem[2]}</Badge>
          </div>
          <h2 className="next-title">{problem[0]}</h2>
          <p className="next-meta">
            {next.type === 'due'
              ? 'How did it go this time?'
              : 'Start a focused attempt, then schedule your first review.'}
          </p>
          <div className="actions">
            <a
              className="btn btn-primary"
              target="_blank"
              rel="noreferrer"
              href={`https://leetcode.com/problems/${problem[3]}/`}
            >
              Open on LeetCode ↗
            </a>
            {next.type === 'new' && (
              <Fragment>
                <a
                  className="btn btn-secondary"
                  target="_blank"
                  rel="noreferrer"
                  href={problemUrl(problem)}
                >
                  View solution ↗
                </a>
                <Button
                  className="btn-success"
                  onClick={() =>
                    completedIdx === next.idx ? onMoveNext() : onMarkStarted(problem)
                  }
                >
                  {completedIdx === next.idx ? 'Move to next problem →' : 'Mark completed'}
                </Button>
              </Fragment>
            )}
          </div>
          {next.type === 'due' && (
            <Fragment>
              <div className="review-actions">
                {completedIdx !== next.idx && (
                  <div className="grade">
                    <Button className="grade-again" onClick={() => onGrade(problem, 0)}>
                      Blanked
                    </Button>
                    <Button className="grade-hard" onClick={() => onGrade(problem, 1)}>
                      Hard
                    </Button>
                    <Button className="grade-good" onClick={() => onGrade(problem, 2)}>
                      Good
                    </Button>
                    <Button
                      className="grade-easy"
                      onClick={() => {
                        onGrade(problem, 3);
                        onNotify('Marked as completed');
                      }}
                    >
                      Easy
                    </Button>
                  </div>
                )}
                <Button className="btn-success" onClick={onMoveNext}>
                  Move to next problem →
                </Button>
              </div>
            </Fragment>
          )}
        </>
      ) : (
        <>
          <p className="next-heading">All caught up</p>
          <h2 className="next-title">Your queue is clear.</h2>
          <p className="next-meta">No new problems left and nothing due for review.</p>
        </>
      )}
    </section>
  );
}
