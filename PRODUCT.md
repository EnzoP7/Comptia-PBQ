# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Students preparing the CompTIA Security+ SY0-701 exam, in English or Spanish. Public: most arrive from GitHub or a shared link and have never seen the tool. The author also uses it to study. The main scene is a desktop or laptop study session: several PBQs in a row or a timed mock exam.

## Product Purpose

Free practice of the exam's performance-based questions (PBQs): interactive scenarios graded criterion by criterion with partial credit, explanations that name the exam trap, timed mock exams weighted by official domain, and spaced-repetition flashcards for confused concept pairs. Success: a candidate walks into the exam having already done every PBQ format and knowing why each answer is right.

## Positioning

92 original PBQs mapped to all 28 SY0-701 objectives, difficulty calibrated against what candidates report, PBQs outside the official objectives explicitly marked as "Extra", and full English/Spanish parity, for free and without an account.

## Operating Context

- Long desktop sessions; mobile is supported but secondary.
- Free practice with optional hints, a timed mock exam with no hints or pause, a trap review modal, a ports/concepts cheat sheet, a progress report by domain.
- Keyboard shortcuts for validate, next/previous, grading, reset, cheat sheet, trap review.

## Capabilities and Constraints

- React 19, Vite, Tailwind CSS 4, TypeScript; static site deployed to GitHub Pages from `main`.
- All state lives in the browser (localStorage); no accounts or backend.
- Content is authored in Spanish and translated at runtime by a DOM translator over `src/i18n/en.json`; any new UI text must pass `npm run i18n:check`.
- Font size can be adjusted per user (normal, large, extra large).

## Brand Commitments

- The user asked for colors and design that resemble CompTIA's look (2026-10-29). The tool must still never use CompTIA logos or imply affiliation; the disclaimer "not affiliated with CompTIA" stays.
- Name in use: "Security+ SY0-701 PBQ Simulator".

## Evidence on Hand

- 92 PBQs, 111 trap cards, study guides, all in the repository.
- Screenshots in `docs/images/`.
- No testimonials, user counts or pass-rate data exist; none may be invented.

## Product Principles

1. Exam fidelity over decoration: practice should feel like the exam, not a game.
2. Teach on every answer: grading explains the why and the trap.
3. Honest scope: say what may not appear instead of padding.
4. Free, private, no account.

## Accessibility & Inclusion

WCAG 2.1 AA: contrast, full keyboard operation, adjustable text size. Correct/incorrect must not rely on color alone.
