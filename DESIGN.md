---
name: Security+ SY0-701 PBQ Simulator
description: An exam-room practice screen for the Security+ performance-based questions.
colors:
  brand-red: "#c8102e"
  brand-red-text: "#b00f29"
  brand-red-tint: "#fdf1f3"
  exam-page: "#f0f1f3"
  exam-panel: "#ffffff"
  hairline: "#e1e4e8"
  rule-strong: "#c8cdd3"
  ink: "#101317"
  ink-body: "#2f353e"
  ink-secondary: "#454c56"
  ink-muted: "#5f6670"
  charcoal-page: "#111214"
  charcoal-panel: "#1a1b1e"
  charcoal-hairline: "#2a2c30"
  success: "#047857"
  warning: "#a14c07"
  error: "#be123c"
  info-navy: "#2c578c"
typography:
  title:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
  body:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
  section-tab:
    fontFamily: "Source Sans 3, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    letterSpacing: "0.06em"
  data:
    fontFamily: "JetBrains Mono, ui-monospace, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
rounded:
  tab: "4px"
  control: "8px"
  button: "12px"
  module: "16px"
spacing:
  module-padding: "20px"
  control-gap: "8px"
components:
  button-primary:
    backgroundColor: "{colors.brand-red}"
    textColor: "#ffffff"
    rounded: "{rounded.button}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "#a90d27"
  button-secondary:
    backgroundColor: "{colors.ink-body}"
    textColor: "{colors.exam-panel}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
  button-neutral:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.ink-body}"
    rounded: "{rounded.button}"
    padding: "8px 16px"
  section-tab:
    backgroundColor: "{colors.brand-red}"
    textColor: "#ffffff"
    typography: "{typography.section-tab}"
    rounded: "{rounded.tab}"
    padding: "4px 10px"
  module:
    backgroundColor: "{colors.exam-panel}"
    rounded: "{rounded.module}"
    padding: "{spacing.module-padding}"
---

# Design System: Security+ SY0-701 PBQ Simulator

## Overview

**Creative North Star: "The Exam Room"**

The simulator should feel like the screen a candidate meets on exam day, not a hacker console. Work happens on white panes over a cool-gray page, set in a plain institutional sans, with one brand red that marks only what matters: the primary action, where you are, and the label at the head of each module. Everything else is neutral ink, so the scenario text and the task carry the page.

Density is moderate and steady: long study sessions on a desktop are the main scene, so body text is generous (15px, 1.6 line height) and the controls stay compact. A charcoal theme exists for night study and keeps the same red; the Linux terminal is always charcoal because a shell is dark.

The look is inspired by CompTIA's colors at the user's request, but it never uses CompTIA's logo or wording that implies the product is official.

**Key Characteristics:**
- Light exam screen by default, charcoal on demand, one red in both.
- Flat modules defined by a 1px hairline, not by shadow.
- A small red tab heads every module.
- Monospace only for data: timers, counts, IPs, ports, commands.

## Colors

Restrained: neutrals plus one brand red, with semantic green, amber, rose and navy for state.

### Primary
- **Brand Red** (#c8102e): fill of the primary action (Submit and Validate, Start, Add rule), the section tab, the focus ring, the active language and the active PBQ outline. White text on it passes AA (5.9:1).
- **Brand Red Text** (#b00f29): red used as text or outline on light panes (active nav item, active PBQ chip).
- **Brand Red Tint** (#fdf1f3): pale field behind selected or emphasized red elements.

### Secondary
- **Info Navy** (#2c578c): the single "information" hue. All indigo, violet, purple, sky and blue utilities resolve to it, so the app never shows more than one non-state accent besides red.

### Neutral
- **Exam Page** (#f0f1f3): page ground and inset wells.
- **Exam Panel** (#ffffff): modules and cards.
- **Hairline** (#e1e4e8): 1px module borders, chip fills, dividers.
- **Rule Strong** (#c8cdd3): input borders and stronger dividers.
- **Ink** (#101317) for headings; **Ink Body** (#2f353e) for reading text; **Ink Secondary** (#454c56) and **Ink Muted** (#5f6670, 5.1:1 on the page) for labels and metadata.
- **Charcoal Page / Panel / Hairline** (#111214 / #1a1b1e / #2a2c30): the dark theme's equivalents.

### Named Rules
**The Red Means Here Rule.** Red appears only on the primary action, the current position, section tabs, focus and genuine errors. Icons, counts, numbers and decoration are neutral ink.

**The One Token Layer Rule.** Components keep the original utility names (slate, cyan, emerald, amber, rose); `src/index.css` redefines what each shade means per theme. Shades 950–800 are tints, 700–500 are fills and borders, 400–100 are text. New UI uses the same shade roles and never hardcodes hex values.

## Typography

**Body Font:** Source Sans 3 (with system-ui fallback)
**Data Font:** JetBrains Mono (with Consolas fallback)

**Character:** A sober, highly legible workhorse sans, like an institutional exam screen, paired with a mono reserved for values a candidate has to read exactly.

### Hierarchy
- **Title** (700, 1.5rem, 1.3): the PBQ title.
- **Body** (400, 15px, 1.6; scenario text scales up with the A+ and A++ text-size control): scenario, requirements, explanations.
- **Label** (600, 0.75rem): buttons, chips, metadata lines such as "PBQ 3 de 92 • Category".
- **Section tab** (700, 0.6875rem, 0.06em tracking, uppercase): module headings only.
- **Data** (500, 0.75rem mono): timer, ports, IPs, commands, counters.

### Named Rules
**The Mono Is Data Rule.** Monospace is for values, never for navigation, labels or a "technical" look.

**The No Eyebrow Rule.** Position and category information sits as sentence-case metadata; no red, tracked, uppercase line above a heading.

## Layout

Centered container (max-width 80rem) with a fixed header bar (brand, modes, language, theme, sound), a toolbar row (mode switch, timer, hints, flag, cheat sheet, trap review), a scrolling filter row and a PBQ strip. Each PBQ is a brief module (scenario left, requirements right on desktop; stacked on mobile) followed by the simulator and a floating sticky action bar with Previous, Submit and Validate, and Next. Horizontal scrollers fade out at the right edge so they read as scrollable.

## Elevation & Depth

Flat by default. Modules are defined by a 1px hairline on the gray page, with no shadow. Shadows are reserved for things that truly float above the page: the sticky action bar and modal dialogs.

### Named Rules
**The One Elevation Rule.** A surface gets a hairline or a shadow, never both, unless it floats over scrolling content.

## Shapes

Modules use 16px corners, buttons 12px, controls and chips 8px. The section tab has 4px top corners and a square bottom, so it reads as a tab attached to its module.

## Components

### Buttons
- **Primary:** brand red fill, white label, 12px corners; hover darkens to #a90d27. One per view.
- **Secondary (Next):** inverted ink fill (dark ink on light theme, light on dark), white label.
- **Neutral:** hairline fill with body ink (Previous, Reset, Restore).
- **Focus:** 2px brand-red outline with 2px offset on every focusable element.

### Chips
- **Filter and PBQ chips:** neutral fill, muted count in tabular figures; the active PBQ chip gets a red outline.
- **Difficulty:** Basic (success), Intermediate (warning), Advanced (error), Extra (neutral): the only multi-color chips, because difficulty is data.

### Cards / Modules
- **Corner Style:** 16px.
- **Background:** exam panel on exam page.
- **Border:** 1px hairline; no shadow.
- **Internal Padding:** 20px.

### Section Tab (signature component)
A small red tab with white uppercase label (and an optional 14px icon) heads each module: Scenario, Requirements, the controls tray, the classification matrix console. It is the system's one recurring brand gesture.

### Theme Switch
Sun/moon icon button next to the language switch. The saved theme is applied before first paint by an inline script, and the browser `theme-color` follows it.

## Do's and Don'ts

### Do:
- **Do** use the shade roles of the token layer (`bg-slate-900` panel, `border-slate-800` hairline, `text-slate-500` muted, `bg-cyan-600 text-on-accent` primary) instead of new colors.
- **Do** head every new module with the `section-tab` utility.
- **Do** use `text-on-accent` for text on any filled brand or state color, because `text-white` means dark ink in the light theme.
- **Do** wrap always-dark surfaces (terminals, consoles) in `.theme-dark`.
- **Do** keep correct and incorrect distinguishable by icon or text, not color alone.

### Don't:
- **Don't** use red for icons, counts or decoration.
- **Don't** combine a hairline border with a wide shadow on in-page modules.
- **Don't** introduce a second accent hue; information color is navy only.
- **Don't** use CompTIA logos or wording that implies affiliation.
