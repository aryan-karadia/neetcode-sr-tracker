# Pattern Recall · Coding Interview Tracker

A single-file React web app for practicing the [Blind 75](https://neetcode.io/practice), [NeetCode 150](https://neetcode.io/practice), or NeetCode 250 roadmap in roadmap order. It combines a focused daily queue with spaced repetition so algorithmic patterns become easier to recall under interview pressure.

## How It Works

- **Practice sets** can be changed at any time from Blind 75 to NeetCode 150, the default, or NeetCode 250. Each set has isolated progress and review history.
- **Next up** always gives one clear recommendation: the next new problem or the most urgent problem due for review.
- **Progress dashboard** shows attempted, due today, mastered, and remaining problems, including a completion bar.
- **Category filters** narrow the roadmap by topic while preserving the recommended next problem.
- **LeetCode links** open directly to each problem.
- **Scheduling** uses a simplified SM-2 algorithm. Initial reviews are scheduled after 1 day and 3 days, then intervals grow according to an ease factor. A failed review resets the interval to 1 day.

## Roadmap Coverage

The app includes three selectable sets:

- **Blind 75** — 75 core interview problems.
- **NeetCode 150** — 150 problems and the default set.
- **NeetCode 250** — 250 problems for broader pattern coverage.

Problems are grouped into topics including Arrays & Hashing, Two Pointers, Sliding Window, Trees, Graphs, Dynamic Programming, Greedy, Intervals, Math & Geometry, and Bit Manipulation.

## Data And Privacy

Progress is stored only in the browser's `localStorage` under set-specific keys. Nothing is sent to an application backend. Progress is not synced between browsers or devices, and private/incognito sessions may discard it when the session closes.

To remove progress, clear the site's browser storage. There is no automatic expiration or in-app reset.

The interface uses a dark navy surface palette with lime primary actions, blue informational accents, amber review states, and red due states. These colors are used consistently for hierarchy and status rather than decoration.

## License

MIT — do whatever you want with it.
