import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../src/App';

const STORAGE_KEY = 'neetcode_sr_v2_progress';
const SET_KEY = 'neetcode_sr_v2_set';

function renderApp() {
  return render(<App />);
}

function storedProgress() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

describe('Pattern Recall application flows', () => {
  beforeEach(() => {
    vi.setSystemTime(new Date('2026-09-25T12:00:00'));
  });

  it('starts with the first new problem and persists completion', async () => {
    const user = userEvent.setup();
    renderApp();

    expect(screen.getAllByText('Contains Duplicate').length).toBeGreaterThan(0);
    expect(screen.getByText('150')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /mark completed/i }));

    expect(screen.getByRole('status')).toHaveTextContent('Marked as completed');
    expect(screen.queryByRole('button', { name: 'Blanked' })).not.toBeInTheDocument();
    expect(storedProgress()['contains-duplicate']).toMatchObject({
      status: 'review',
      reps: 0,
      interval: 1,
      ef: 2.3,
    });
    expect(storedProgress()['contains-duplicate'].due).toBe(
      new Date('2026-09-26T00:00:00').getTime(),
    );
  });

  it('moves to the next new problem after completing the current problem', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: /mark completed/i }));
    await user.click(screen.getByRole('button', { name: /move to next problem/i }));

    expect(screen.getAllByText('Valid Anagram').length).toBeGreaterThan(0);
    expect(screen.getByText(/New problem/)).toBeInTheDocument();
  });

  it('prioritizes due reviews and applies grading intervals', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        'contains-duplicate': {
          status: 'review',
          ef: 2.3,
          interval: 1,
          reps: 0,
          due: new Date('2026-09-25T00:00:00').getTime(),
          last: new Date('2026-09-24T00:00:00').getTime(),
        },
      }),
    );
    const user = userEvent.setup();
    renderApp();

    expect(screen.getByText('Next up · Review')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Good' }));

    expect(storedProgress()['contains-duplicate']).toMatchObject({
      status: 'review',
      reps: 1,
      interval: 1,
      ef: 2.3,
    });
    expect(storedProgress()['contains-duplicate'].due).toBe(
      new Date('2026-09-26T00:00:00').getTime(),
    );
  });

  it('uses shared progress when switching practice sets', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: /mark completed/i }));
    await user.selectOptions(screen.getByLabelText('Practice set'), 'blind75');

    expect(screen.getByText('/75')).toBeInTheDocument();
    expect(within(screen.getByText('Contains Duplicate').parentElement).getByText(/reviewing/i)).toBeInTheDocument();
    expect(localStorage.getItem(SET_KEY)).toBe('blind75');
  });

  it('filters the roadmap by category', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getAllByRole('button', { name: 'Trees' })[0]);

    expect(screen.getByRole('heading', { name: 'Roadmap problems' })).toBeInTheDocument();
    expect(within(document.querySelector('.list-card')).queryByText('Contains Duplicate')).not.toBeInTheDocument();
  });

  it('requires both reset confirmations before clearing progress', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: /mark completed/i }));
    vi.spyOn(window, 'confirm').mockReturnValueOnce(true).mockReturnValueOnce(false);
    await user.click(screen.getByRole('button', { name: /reset progress/i }));
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();

    window.confirm.mockReturnValue(true);
    await user.click(screen.getByRole('button', { name: /reset progress/i }));
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent('Progress reset');
  });

  it('recovers from malformed saved progress without crashing', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(STORAGE_KEY, '{not-json');
    renderApp();

    expect(screen.getAllByText('Contains Duplicate').length).toBeGreaterThan(0);
    expect(error).toHaveBeenCalledWith(
      'Unable to read saved progress. Starting with an empty queue.',
      expect.any(SyntaxError),
    );
  });
});
