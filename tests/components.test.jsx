import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import NextProblemCard from '../src/components/NextProblemCard';
import ProblemList from '../src/components/ProblemList';
import Stats from '../src/components/Stats';

const problem = [
  'Contains Duplicate',
  'Arrays & Hashing',
  'E',
  'contains-duplicate',
  'duplicate-integer',
];

describe('dashboard components', () => {
  it('renders all dashboard metrics and progress width', () => {
    render(<Stats doneCount={3} total={10} dueCount={2} masteredCount={1} progress={30} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('/10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(document.querySelector('.progress-bar')).toHaveStyle({ width: '30%' });
  });

  it('renders a new-problem action and canonical solution link', async () => {
    const user = userEvent.setup();
    const onMarkStarted = vi.fn();
    render(
      <NextProblemCard
        next={{ idx: 0, type: 'new' }}
        problems={[problem]}
        completedIdx={null}
        onMarkStarted={onMarkStarted}
        onMoveNext={vi.fn()}
        onGrade={vi.fn()}
        onNotify={vi.fn()}
        problemUrl={(item) => `https://neetcode.io/problems/${item[4]}`}
      />,
    );

    expect(screen.getByRole('link', { name: /open on leetcode/i })).toHaveAttribute(
      'href',
      'https://leetcode.com/problems/contains-duplicate/',
    );
    expect(screen.getByRole('link', { name: /view solution/i })).toHaveAttribute(
      'href',
      'https://neetcode.io/problems/duplicate-integer',
    );
    await user.click(screen.getByRole('button', { name: /mark completed/i }));
    expect(onMarkStarted).toHaveBeenCalledWith(problem);
  });

  it('toggles a problem category accordion', async () => {
    const user = userEvent.setup();
    render(
      <ProblemList
        categories={['Arrays & Hashing', 'Trees']}
        filter="all"
        problems={[
          problem,
          ['Invert Binary Tree', 'Trees', 'E', 'invert-binary-tree', 'invert-a-binary-tree'],
        ]}
        progress={{}}
        onFilterChange={vi.fn()}
        onUncomplete={vi.fn()}
        formatDate={() => 'Jan 1'}
        isDue={() => false}
        problemUrl={() => '#'}
        progressKey={(item) => item[3]}
      />,
    );

    expect(screen.getByText('Contains Duplicate')).toBeVisible();
    await user.click(screen.getAllByRole('button', { name: /arrays & hashing/i })[1]);
    expect(screen.getByText('Contains Duplicate').closest('.accordion').querySelector('.problem').parentElement)
      .toHaveAttribute('hidden');
  });
});
