---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/components"]
---

Scope: whole app shell and every PBQ simulator (src/App.tsx and src/components). Mode: Operate.
Audience: Security+ SY0-701 candidates, long desktop study sessions; mobile secondary. Task: solve PBQs, read grading, run timed mock exams.
Constraints: user-pinned look "like CompTIA" (red, neutral grays, white) without CompTIA logos or implied affiliation; light default plus a dark option; layout and positions unchanged (colors, type, borders, section tabs, buttons only); WCAG AA; i18n DOM translator must keep working.

## Direction contract

THESIS: The exam room, not a cyber dashboard. Refuses the category default of near-black neon "hacker console" chrome.
OWN-WORLD: White and cool-gray work panes, near-black ink, one brand red (#C8102E family) reserved for primary action, current position and alerts; hairline-ruled modules headed by a small red tab (raise from japanese-high-density-web: hairline module discipline); red never decorates (raise from boarding-pass/gate-board: one alert color reserved for change). Dark mode: charcoal neutrals, same red.
STORY: The candidate sees an exam-day screen, knows where they are (PBQ n of N, timer), acts on one red primary button, and reads grading in calm neutral panels.
FIRST VIEWPORT: Unchanged layout: header bar with brand mark, mode switch and timer; PBQ strip; scenario module with red tab; task area; validate button in red.
FORM: User-pinned "CompTIA exam room"; roll assigned grounded #5 (network notation) overridden by the pinned brief; seed key add45610.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
