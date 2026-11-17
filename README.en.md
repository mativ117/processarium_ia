# Processarium

**A small world for understanding work.**

[Open in English](https://mativ117.github.io/processarium_ia/?lang=en) · [Français](README.md)

Follow a file through a miniature workshop. Each role collects it, works on it and passes the result on. Continuous playback connects scenes without a fixed pause or a position reset. Use Play/Pause, step through manually or choose a speed from 0.75× to 2×. Playback pauses when a human decision is required. Reduced-motion settings remove the walking animation.

The default view focuses on the scene and the concrete input/output change. Open “Explore the details” for resources and longer explanations. Roles have distinct signs and accessories, with visual actions for sorting cards, writing, scanning, checking, coding, packaging, designing and manipulating a model. These illustrate work rather than executing it.

## Eight guides, four levels

| Level | Guides |
| --- | --- |
| Simple | An idea into a post; a message into a reply |
| Intermediate | Meeting notes into a plan; comparing solutions |
| Advanced | Calque document conversion; a CoachOS editor feature |
| Expert | A complete 3D game update; a large-scale document assistant |

The expert teams have 10–12 roles and up to five simultaneous contributors. The planned and elapsed times are fictional scenario data, not real measurements or the duration of the animation. The simulation does not run AI agents, send messages or change the referenced projects.

## Languages

French and English are the reference editions, with authored interface, guide, role, result and help text. Switch language without restarting playback or losing progress. Share links with `?lang=en` or `?lang=fr`.

Other languages can be generated using the browser’s optional local `Translator` API. Availability depends on the browser, device and language pair; universal support is not guaranteed. A model download may be needed. There is no translation service or API key built into the site. Browsers without this API may offer their own “Translate page” command.

An automatic edition is clearly labeled and may contain errors. It is activated only when the entire translation has finished. Unsupported languages, failures and cancellation leave the previous edition intact. Language codes, links, identifiers and numeric scenario data stay unchanged. Right-to-left languages change the reading direction. Generated editions are kept in session memory; a reload returns to the chosen reference language.

## Run and validate

Requires Node.js 22+ and Python 3. No JavaScript dependency installation is needed.

```sh
npm run dev
# Open http://127.0.0.1:8000
```

```sh
python3 -m pip install -r tests/requirements.txt
python3 -m playwright install chromium
npm run check
npm run pages
npm test
```

Tests cover all guides, saved collections, PDF branches, responsive layouts, continuous positions, pause/resume and language changes during playback. Browser API mocks cover automatic-translation failure modes and RTL layout; they do not validate translation quality or actual language support on a device. Real Safari/iPhone testing remains separate.

## Publish

GitHub Pages serves **`main /docs`**. `npm run pages` rebuilds `dist/` and exports the complete static site to tracked `docs/`, including `.nojekyll`. Commit source changes and `docs/` together. GitHub checks that the published export exactly matches the build and runs the tests. Production scripts and styles have content-based filenames to keep cached assets consistent with each update. The built `dist/preview.html` is also a self-contained preview.

Progress, collection, reference language and speed are stored in this browser only. There is no account, synchronization, tracking or remote AI service. Optional translation uses the browser’s local engine and may trigger browser-managed model downloads. The host can log visits.

Drawings are created in code. No assets from the reference video are reused. No redistribution license has been selected.
