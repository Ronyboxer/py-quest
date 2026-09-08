# PyQuest

[![CI](https://github.com/Ronyboxer/py-quest/actions/workflows/ci.yml/badge.svg)](https://github.com/Ronyboxer/py-quest/actions/workflows/ci.yml)

Learn Python in the browser. Bite-sized lessons and coding challenges where
your code actually runs, no backend involved.

Live: https://py-quest-gamma.vercel.app

Execution runs on Pyodide, which is CPython compiled to WebAssembly, so the
interpreter is the real thing rather than a simulation. There is no server.
Progress, XP, and the daily streak live in `localStorage`.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
```

First load downloads the Pyodide runtime from the CDN (~6 MB, browser-cached
after that). A "Loading Python…" ribbon shows progress; the rest of the UI is
usable immediately while it warms up.

## What's inside

| Concern            | Choice                                               |
| ------------------ | ---------------------------------------------------- |
| Framework          | React 19 + Vite                                      |
| Python execution   | **Pyodide** (WASM), loaded once and reused           |
| Editor             | Monaco (`@monaco-editor/react`), Python syntax       |
| Styling            | Tailwind CSS v4 (`@tailwindcss/vite`)                |
| Animation          | Framer Motion                                        |
| Persistence        | `localStorage` - no auth, no DB                       |

### Features

- **Level map** - a vertical path grouped into 10 units.
  Completed nodes are filled, the current one bounces, future ones stay locked
  until the previous node is done.
- **Lessons** - 1–3 concept screens each, with a *runnable, editable* example.
- **Coding challenges** - problem statement, Monaco editor with a starter
  template, a **Run** button (real stdout/stderr/tracebacks), and a **Submit**
  button that grades against hidden test cases and shows per-case pass/fail.
- **Real execution + checking** - both `return`-value problems (function called
  with args, compared to expected) and `stdout` problems (program output
  compared, with `input()` fed from canned stdin). Python errors render as a
  clean traceback in the console - they never crash the UI.
- **Gamification** - XP bar, daily streak, and level-complete celebration with
  confetti. All persisted across refreshes.
- **Hints** - 1–2 optional, progressively-revealed hints per challenge.

## The curriculum is just data

Everything you learn is defined in **`src/data/curriculum.js`**. Adding a unit,
lesson, or challenge means editing that one file - no new components.

```js
// A return-value challenge:
{
  id: 'u8-c1', type: 'challenge', title: 'Reverse a string',
  xp: 45, difficulty: 'Easy',
  prompt: 'Write reverse(s) that RETURNS the string reversed.',
  starterCode: 'def reverse(s):\n    pass\n',
  hints: ['Slicing with step -1 reverses a sequence.'],
  checkType: 'return', functionName: 'reverse',
  testCases: [{ args: ['python'], expected: 'nohtyp' }],
}
```

- `checkType: 'return'` → needs `functionName`; test cases are `{ args, expected }`.
- `checkType: 'stdout'` → test cases are `{ stdin?, expected }`; output is
  compared whitespace-trimmed.

Units progress: **1** print/vars → **2** numbers/strings → **3** logic →
**4** loops → **5** collections → **6** functions → **7** comprehensions/zip →
**8** easy algorithms (Two Sum, etc.) → **9** recursion/two-pointer →
**10** valid parentheses, binary search, merge, group anagrams.

## Tests

Two test layers, both runnable from npm:

```bash
npm run validate   # runs a reference solution for EVERY challenge through the
                   # real Python harness (Node + Pyodide) and asserts all
                   # test cases pass, catches a bad expected value instantly.
npm run smoke      # full browser E2E (Playwright + system Chrome): mounts the
                   # app, loads Pyodide, finishes a lesson, runs + submits a
                   # challenge, and asserts XP persisted to localStorage.
                   # Requires the dev server running on :5188.
```

## Tradeoffs and known limits

- **Pyodide is a big first download (~6 MB).** It's the price of running real
  CPython client-side. It loads lazily and is browser-cached, and we boot it in
  the background while the user reads the map. For an even snappier first paint
  you could self-host the Pyodide assets and add a service worker.
- **No sandboxing beyond the browser.** Code runs in the user's own browser tab
  via WASM, so it can't touch your machine - but a user could write an infinite
  loop and hang their tab. A production version should run Pyodide in a **Web
  Worker** with a watchdog/timeout so a runaway loop can be killed without
  freezing the UI. (Kept on the main thread here for simplicity.)
- **Output checking is value/`stdout` comparison**, not AST analysis, so a
  challenge that says "don't use `max()`" can't truly enforce it - the hint asks
  nicely. Fine for a learning app; tighten with static checks if needed.
- **Linear unlock graph.** Nodes unlock strictly in order. The data structure
  could support a branching tree; the map renderer would need small changes.
- **Pinned versions:** the browser loads Pyodide `v0.27.2` from jsDelivr (see
  `index.html`); the Node validation script uses the `pyodide` npm package. The
  harness is plain Python, so it behaves identically across these.

## Project layout

```
src/
  lib/pyodideRunner.js   # Pyodide singleton + Python grading harness
  lib/storage.js         # localStorage: XP, streak, completed nodes
  data/curriculum.js     # ALL course content (edit here to add content)
  components/             # TopBar, LevelMap, LessonScreen, ChallengeScreen,
                          # Console, LevelCompleteModal
  App.jsx                # view routing + progress state
scripts/                 # validate-curriculum.mjs, smoke.mjs
```
