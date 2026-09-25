# Pattern Recall · Coding Interview Tracker

A Vite-powered React web app for practicing the [Blind 75](https://neetcode.io/practice), [NeetCode 150](https://neetcode.io/practice), or NeetCode 250 roadmap in roadmap order. It combines a focused daily queue with spaced repetition so algorithmic patterns become easier to recall under interview pressure.

## Development

Install dependencies and start the Vite development server:

```sh
npm install
npm run dev
```

The project includes Tailwind CSS and the standard shadcn/ui configuration. New shadcn components can be added with the shadcn CLI and will use the `@/components/ui` and `@/lib` aliases.

Create a production build with:

```sh
npm run build
```

Run the test suite with:

```sh
npm test
```

## CI/CD And Netlify

The GitHub Actions workflow in `.github/workflows/ci-cd.yml` installs dependencies with
`npm ci`, runs the Vitest test suite, and builds the application. Pull requests targeting
`main` and pushes to `main` run these test and build checks.

Netlify deployment is managed by Netlify's Git integration: configure the site to use
this repository, deploy the `main` branch, use `npm run build` as the build command, and
publish the `dist` directory. Each push to `main` then triggers Netlify's automatic
production deployment without requiring GitHub deployment secrets or a manual CLI step.

## How It Works

- **Practice sets** can be changed at any time from Blind 75 to NeetCode 150, the default, or NeetCode 250. Progress and review history are shared for matching problems across every set, so completing a problem in one list also completes it in every list that contains it.
- **Next up** always gives one clear recommendation: the next new problem or the most urgent problem due for review.
- **Progress dashboard** shows attempted, due today, mastered, and remaining problems, including a completion bar.
- **Category filters** narrow the roadmap by topic while preserving the recommended next problem.
- **LeetCode links** open directly to each problem.
- **NeetCode solution links** appear beside every completed problem for quick review.
- **Uncomplete controls** let you return a completed problem to the not-started queue from the roadmap list.
- NeetCode 150 entries store their canonical NeetCode solution slug separately from the LeetCode slug, so renamed routes such as `duplicate-integer` and `is-anagram` resolve correctly.
- **Scheduling** uses a simplified SM-2 algorithm. Initial reviews are scheduled after 1 day and 3 days, then intervals grow according to an ease factor. A failed review resets the interval to 1 day. When the saved schedule is overdue, the app shifts all repetition dates forward by the same amount so its oldest repetition date is today; review history remains unchanged.

## Roadmap Coverage

The app includes three selectable sets:

- **Blind 75** — 75 core interview problems.
- **NeetCode 150** — 150 problems and the default set.
- **NeetCode 250** — 250 problems for broader pattern coverage.

Problems are grouped into topics including Arrays & Hashing, Two Pointers, Sliding Window, Trees, Graphs, Dynamic Programming, Greedy, Intervals, Math & Geometry, and Bit Manipulation.

## Data And Privacy

Progress is stored only in the browser's `localStorage` under a shared problem-keyed store. Nothing is sent to an application backend. Progress is not synced between browsers or devices, and private/incognito sessions may discard it when the session closes.

To remove progress, clear the site's browser storage. There is no automatic expiration or in-app reset.
The header's **Reset progress** button clears progress across all practice sets after two confirmation prompts.

The interface uses a dark navy surface palette with lime primary actions, blue informational accents, amber review states, and red due states. These colors are used consistently for hierarchy and status rather than decoration.

## License

MIT — do whatever you want with it.
