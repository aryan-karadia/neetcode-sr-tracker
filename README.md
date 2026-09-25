# NeetCode 150 · Spaced Repetition Tracker

A single-file web app that tracks your progress through the [NeetCode 150](https://neetcode.io/practice) roadmap
(a superset of the Blind 75) **in NeetCode's recommended order**, and schedules reviews using a spaced-repetition
algorithm so the patterns actually stick — not just the answers.

## How it works

- **What to do next** is always one clear recommendation: either the next new problem in the roadmap, or the next
  problem that's due for review — whichever is more urgent.
- **Scheduling** uses a simplified **SM-2** algorithm (the spacing model behind Anki/SuperMemo). First review after
  1 day, then 3 days, then the interval grows by an ease factor each time you rate a review "Good" or "Easy," and
  collapses back to 1 day on "Blanked." This spaced-repetition effect is well studied for improving long-term
  retention, including for applied/procedural skills like recognizing an algorithmic pattern under time pressure —
  not just rote facts.
- Every problem links straight to LeetCode to actually write the code.
- All progress is stored in your browser's `localStorage` — nothing leaves your machine, there's no backend.

## Run it

It's a static file — no build step, no dependencies.

```bash
open index.html          # macOS
# or just double-click index.html
```

## Deploy it (GitHub Pages)

1. Push this repo to GitHub (see below).
2. In the repo settings, go to **Pages** → set source to the `main` branch, root folder.
3. Your tracker will be live at `https://<your-username>.github.io/<repo-name>/`.

## Roadmap coverage

Currently covers the full **NeetCode 150** list, grouped and ordered by category exactly as NeetCode presents it
(Arrays & Hashing → Two Pointers → Sliding Window → ... → Bit Manipulation). Extending to the full NeetCode 250 is
a matter of appending more entries to the `P` array in `index.html`.

## License

MIT — do whatever you want with it.
