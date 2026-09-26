import { useEffect, useMemo, useRef, useState } from 'react';
import { SETS } from './data';
import Fireworks from './components/Fireworks';
import Header from './components/Header';
import Hero from './components/Hero';
import InfoCard from './components/InfoCard';
import NextProblemCard from './components/NextProblemCard';
import ProblemList from './components/ProblemList';
import Stats from './components/Stats';

const STORAGE_KEY = 'neetcode_sr_v2';
const today = () => new Date().setHours(0, 0, 0, 0);
const daysFromNow = (days) => today() + days * 86400000;
const formatDate = (timestamp) =>
  new Date(timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
const problemUrl = (problem) =>
  `https://neetcode.io/problems/${problem[4] || problem[3]}?list=neetcode150`;
const progressKey = (problem) => problem[3];

const loadState = (key) => {
  const saved = localStorage.getItem(key);
  if (!saved) return {};
  try {
    return JSON.parse(saved) || {};
  } catch (error) {
    console.error('Unable to read saved progress. Starting with an empty queue.', error);
    return {};
  }
};

const normalizeDueDates = (progress) => {
  const currentDay = today();
  const dueDates = Object.values(progress)
    .map((record) => record?.due)
    .filter((due) => typeof due === 'number' && Number.isFinite(due));
  const oldestDue = Math.min(...dueDates);
  if (!dueDates.length || oldestDue >= currentDay) return progress;
  const offset = currentDay - oldestDue;
  return Object.fromEntries(
    Object.entries(progress).map(([key, record]) => [
      key,
      record?.due == null ? record : { ...record, due: record.due + offset },
    ]),
  );
};

const loadSharedProgress = () => {
  const sharedKey = `${STORAGE_KEY}_progress`;
  const saved = localStorage.getItem(sharedKey);
  if (saved) {
    const progress = loadState(sharedKey);
    const normalized = normalizeDueDates(progress);
    if (normalized !== progress) {
      try {
        localStorage.setItem(sharedKey, JSON.stringify(normalized));
      } catch (error) {
        console.error('Unable to save normalized review dates to browser storage.', error);
      }
    }
    return normalized;
  }

  const migrated = {};
  Object.values(SETS).forEach((set) => {
    const setKey = Object.entries(SETS).find(([, value]) => value === set)?.[0];
    const legacy = loadState(`${STORAGE_KEY}_${setKey}`);
    set.problems.forEach((problem, index) => {
      if (legacy[index] && !migrated[progressKey(problem)]) {
        migrated[progressKey(problem)] = legacy[index];
      }
    });
  });
  return normalizeDueDates(migrated);
};

function App() {
  const [activeSet, setActiveSet] = useState(
    () => localStorage.getItem(`${STORAGE_KEY}_set`) || 'neetcode150',
  );
  const [state, setState] = useState(loadSharedProgress);
  const [filter, setFilter] = useState('all');
  const [focusedIdx, setFocusedIdx] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [completedIdx, setCompletedIdx] = useState(null);
  const [burst, setBurst] = useState(null);
  const pointerPosition = useRef({ x: 0, y: 0 });
  const feedbackTimer = useRef(null);
  const set = SETS[activeSet];
  const problems = set.problems;

  const notify = (message) => {
    setFeedback(message);
    setBurst({ id: Date.now(), ...pointerPosition.current });
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(''), 5000);
  };

  useEffect(() => {
    const handlePointerMove = (event) => {
      pointerPosition.current = { x: event.clientX, y: event.clientY };
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useEffect(() => {
    if (!burst) return undefined;
    const timer = setTimeout(() => setBurst(null), 700);
    return () => clearTimeout(timer);
  }, [burst]);

  useEffect(() => () => {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
  }, []);

  const save = (next) => {
    setState(next);
    try {
      localStorage.setItem(`${STORAGE_KEY}_progress`, JSON.stringify(next));
    } catch (error) {
      console.error('Unable to save progress to browser storage.', error);
    }
  };

  const changeSet = (key) => {
    if (!SETS[key]) return;
    localStorage.setItem(`${STORAGE_KEY}_set`, key);
    setActiveSet(key);
    setFilter('all');
    setFocusedIdx(null);
    setCompletedIdx(null);
    setFeedback('');
  };

  const resetProgress = () => {
    if (!window.confirm('Reset all practice progress?')) return;
    if (
      !window.confirm(
        'This permanently clears every completed problem and review date across all practice sets. Continue?',
      )
    )
      return;
    localStorage.removeItem(`${STORAGE_KEY}_progress`);
    Object.keys(SETS).forEach((key) => localStorage.removeItem(`${STORAGE_KEY}_${key}`));
    setState({});
    setFocusedIdx(null);
    setCompletedIdx(null);
    notify('Progress reset');
  };

  const getRecord = (problem) =>
    state[progressKey(problem)] || {
      status: 'new',
      ef: 2.3,
      interval: 0,
      reps: 0,
      due: null,
      last: null,
    };

  const grade = (problem, gradeValue) => {
    const key = progressKey(problem);
    const record = { ...getRecord(problem), last: today() };
    if (gradeValue === 0) {
      record.reps = 0;
      record.interval = 1;
      record.ef = Math.max(1.3, record.ef - 0.2);
    } else {
      record.reps = (record.reps || 0) + 1;
      if (gradeValue === 1) record.ef = Math.max(1.3, record.ef - 0.15);
      if (gradeValue === 3) record.ef += 0.15;
      if (record.reps === 1) record.interval = 1;
      else if (record.reps === 2) record.interval = 3;
      else record.interval = Math.round(record.interval * record.ef * (gradeValue === 1 ? 0.75 : 1));
    }
    record.due = daysFromNow(record.interval);
    record.status = record.interval >= 21 ? 'mastered' : 'review';
    save({ ...state, [key]: record });
  };

  const markStarted = (problem) => {
    const key = progressKey(problem);
    const record = getRecord(problem);
    if (record.status !== 'new') return;
    record.status = 'review';
    record.reps = 0;
    record.ef = 2.3;
    record.interval = 1;
    record.due = daysFromNow(1);
    record.last = today();
    save({ ...state, [key]: record });
    setFocusedIdx(problems.indexOf(problem));
    setCompletedIdx(problems.indexOf(problem));
    notify('Marked as completed');
  };

  const uncomplete = (problem) => {
    const key = progressKey(problem);
    if (!state[key]) return;
    const next = { ...state };
    delete next[key];
    save(next);
    if (focusedIdx === problems.indexOf(problem)) {
      setFocusedIdx(null);
      setCompletedIdx(null);
    }
    notify('Marked as not completed');
  };

  const queueNext = useMemo(() => {
    const due = [];
    problems.forEach((problem, index) => {
      const record = state[progressKey(problem)];
      if (record && record.due !== null && record.due <= today()) due.push([index, record.due]);
    });
    if (due.length) {
      due.sort((a, b) => a[1] - b[1]);
      return { idx: due[0][0], type: 'due' };
    }
    const index = problems.findIndex((problem) => !state[progressKey(problem)]);
    return index === -1 ? null : { idx: index, type: 'new' };
  }, [problems, state]);

  const current =
    focusedIdx === null || !problems[focusedIdx]
      ? queueNext
      : {
          idx: focusedIdx,
          type:
            completedIdx === focusedIdx || !state[progressKey(problems[focusedIdx])]
              ? 'new'
              : 'due',
        };

  const moveNext = () => {
    const start = current ? current.idx + 1 : 0;
    const remaining = problems.findIndex(
      (problem, index) => index >= start && !state[progressKey(problem)],
    );
    const due = problems
      .map((problem, index) => ({ index, record: state[progressKey(problem)] }))
      .find(({ index, record }) => index >= start && record?.due != null && record.due <= today());
    const index =
      remaining === -1
        ? (due?.index ?? problems.findIndex((problem) => !state[progressKey(problem)]))
        : remaining;
    if (index === -1) {
      setFocusedIdx(null);
      setCompletedIdx(null);
      notify('All problems completed');
      return;
    }
    setFocusedIdx(index);
    setCompletedIdx(null);
    notify('Moved to next problem');
  };

  const categories = useMemo(() => [...new Set(problems.map((problem) => problem[1]))], [problems]);
  const doneCount = problems.filter((problem) => state[progressKey(problem)]).length;
  const dueCount = problems.filter(
    (problem) => state[progressKey(problem)]?.due !== null && state[progressKey(problem)]?.due <= today(),
  ).length;
  const masteredCount = problems.filter(
    (problem) => state[progressKey(problem)]?.status === 'mastered',
  ).length;
  const progress = problems.length ? Math.round((doneCount / problems.length) * 100) : 0;

  return (
    <div className="app-shell">
      <Header onReset={resetProgress} />
      <main className="container main">
        <Hero activeSet={activeSet} sets={SETS} onSetChange={changeSet} />
        <Stats
          doneCount={doneCount}
          total={problems.length}
          dueCount={dueCount}
          masteredCount={masteredCount}
          progress={progress}
        />
        <NextProblemCard
          next={current}
          problems={problems}
          completedIdx={completedIdx}
          onMarkStarted={markStarted}
          onMoveNext={moveNext}
          onGrade={grade}
          onNotify={notify}
          problemUrl={problemUrl}
        />
        <ProblemList
          categories={categories}
          filter={filter}
          problems={problems}
          progress={state}
          onFilterChange={setFilter}
          onUncomplete={uncomplete}
          formatDate={formatDate}
          isDue={(record) => record?.due <= today()}
          problemUrl={problemUrl}
          progressKey={progressKey}
        />
        <InfoCard />
      </main>
      <Fireworks burst={burst} />
      {feedback && (
        <div className="toast" role="status">
          {feedback} ✓
        </div>
      )}
      <footer className="footer">Pattern Recall · Links open directly on LeetCode</footer>
    </div>
  );
}

export default App;
