# Pattern Recall · Coding Interview Tracker

A single-file web app that tracks your progress through the [Blind 75](https://neetcode.io/practice), [NeetCode 150](https://neetcode.io/practice), or NeetCode 250 roadmap **in roadmap order**, and schedules reviews using a spaced-repetition
algorithm so the patterns actually stick — not just the answers.

## How it works

- **Practice sets** can be changed at any time from Blind 75 to NeetCode 150 (the default) or NeetCode 250. Each set has isolated progress and review history.
- **What to do next** is always one clear recommendation: either the next new problem in the roadmap, or the next
  problem that's due for review — whichever is more urgent.
- **Scheduling** uses a simplified **SM-2** algorithm (the spacing model behind Anki/SuperMemo). First review after
  1 day, then 3 days, then the interval grows by an ease factor each time you rate a review "Good" or "Easy," and
  collapses back to 1 day on "Blanked." This spaced-repetition effect is well studied for improving long-term
  retention, including for applied/procedural skills like recognizing an algorithmic pattern under time pressure —
  not just rote facts.
- Every problem links straight to LeetCode to actually write the code.
- All progress is stored in your browser's `localStorage` — nothing leaves your machine, there's no backend.
  There is no expiration or one-month cleanup: progress remains until the user clears the site's browser data.
  Progress is separate for each browser/device and is not synced between them. Private/incognito browsing may
  remove it when the private window closes.

## Run it

It's a static file — no build step or package install is required. React, ReactDOM, and Babel are loaded from
CDN scripts in `index.html`.

```bash
open index.html          # macOS
# or just double-click index.html
```

## Deploy it (Netlify)

This is a static site, so no build command or server-side database is required.

1. Push this repo to GitHub.
2. In Netlify, choose **Add new site** → **Import an existing project** and select the repository.
3. Leave **Build command** empty and set **Publish directory** to `.`.
4. Deploy. Netlify will serve [`index.html`](./index.html) over HTTPS.

The deployed site will use the same browser `localStorage` behavior as the local file. Changing the domain,
browser, device, or private-browsing mode creates a separate storage area.

## Roadmap coverage

Covers the Blind 75, NeetCode 150, and NeetCode 250 practice sets, grouped by category. The active set is selected
from the top-right menu, and its review history is kept separately in local storage. To remove progress, clear this
site's browser storage; there is no in-app reset that runs automatically.

## License

MIT — do whatever you want with it.
