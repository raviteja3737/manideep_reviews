---
name: A Reader's First Review
description: Manideep's first book review of Zidd — an editorial reading journal in paper and ink.
colors:
  paper: "#FAF9F6"
  ink: "#252525"
  placeholder: "#6B6B6B"
typography:
  display:
    fontFamily: "Playfair Display, Georgia, Times New Roman, serif"
    fontSize: "clamp(3.6rem, 14vw, 6rem)"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.75rem, 2vw, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  logline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(1.25rem, 2vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.375
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.85
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.24em"
  label-small:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    letterSpacing: "0.14em"
rounded:
  none: "0"
  pill: "9999px"
spacing:
  section: "5.5rem"
  group: "3.5rem"
  paragraph: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
  chip-reaction:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-reaction-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
---

# Design System: A Reader's First Review

## Overview

**Creative North Star: "A private letter, published."**

The entire visual system is a reading journal made webpage: warm paper (`#FAF9F6`) and one ink (`#252525`), a single centered column, and total restraint everywhere else. There is no imagery, no gradient, no color accent, no card. Typography scale and generous whitespace carry whatever "design" exists; the review's own words are the visual subject. The system deliberately refuses the commercial book-landing arrangement — no hero imagery, no CTA funnel, no stat cards — because this is one person's honest first attempt, addressed to friends.

**Key Characteristics:**
- Two colors only: paper and ink, with ink alpha-tints for secondary text and hairlines.
- Playfair Display for everything display (including italic loglines and the signature); Inter for all reading text and form labels.
- One measure (max 40rem / ~640px), centered, no blocking ornament.
- Hairline rules as the only separators between journal "pages."
- Interactions are monochrome inversions: selected state = ink fill, paper text.

## Colors

A two-color system. Tints of ink (via alpha over paper) do all secondary work, so the palette never grows.

### Primary
- **Ink** (#252525): all headings, the review text, form questions, filled states (selected chips, submit button, slider thumb), the sole drawn icon (star), and selection-highlight background.

### Neutral
- **Paper** (#FAF9F6): the page ground, text on filled elements, no other surfaces exist.
- **Placeholder gray** (#6B6B6B): input placeholders only — chosen for ≥4.5:1 contrast on paper.

### Named Rules
**The One Ink Rule.** Every color on the page is ink, paper, or an alpha blend of the two. A new hue may not enter; if something feels like it needs color, it actually needs more whitespace.

## Typography

**Display Font:** Playfair Display (Georgia → Times New Roman fallback stack in `--font-display`)
**Body Font:** Inter (`--font-sans`)

**Character:** Book-front high-contrast serif against a calm, screen-first sans. The serif carries ceremony (title, loglines, section titles, questions, signature); the sans does the silent work of actually being read.

### Hierarchy
- **Display** (500, clamp(3.6rem, 14vw, 6rem), 0.95, -0.02em): the single word "Zidd" — used once, nothing else is this large.
- **Headline** (500, 1.75–2.25rem, Playfair): section titles — "A little note from me", "Okay, your turn…", "What readers think".
- **Logline** (400, 1.25–1.5rem, Playfair italic): the subtitle and the epigraph; also the right-aligned signature.
- **Form question** (500, 20–21.6px, Playfair): fieldset/label run in the serif so questions feel asked by the author, not the machine.
- **Body** (400, 17–18px, Inter, 1.85, measure 65–75ch): review paragraphs, personal note, feedback entries.
- **Label** (500, 11px, 0.24em, uppercase): the kicker "MY FIRST BOOK REVIEW · 2026" and the footer line.
- **Meta** (400, 11–13px, Inter): dates, "writing 8/10", hints, under-hint lines.

### Named Rules
**The Serif-Speaks Rule.** Serif is for speaking (titles, questions, signature); Inter is for reading. Assertions inside Inter body may go italic (`*pyaar mein andha*`) but never switch family.

## Layout

One centered column: `max-width: 40rem` with 24px side padding. Sections stack in strict narrative order — kicker, title, logline, byline, epigraph, review, P.S., note, form, community, footer — divided by full-measure hairlines (`1px`, ink at 15–25%). Vertical rhythm: 3.5rem margins above each form question group, 5.5rem between journal sections, ~2rem between paragraphs. Responsive: the single column never becomes two; the slider spans full width below `sm` (640px) and caps at 22rem above it; reaction chips wrap naturally (two-up on desktop, one/two-up mixed on phones).

## Elevation & Depth

No shadows anywhere — the system is flat paper. Depth is expressed only through the ink-fil fill of selected states and hairline separators; the page has exactly one plane plus its writing.

## Shapes

Deliberately mixed form language, each shape meaning something: buttons are **sharp squares** (0 radius) — pressed print blocks; interactive choices are **full pills** (9999px) — soft, tactile, forgiving; text fields are either **boxed** (textarea, 1px hairline border) or **underlined** (name/email-style inputs, bottom hairline only). No other radii exist.

## Components

### Buttons
- **Shape:** sharp rectangle (0 radius), minimum touch height 48px.
- **Primary:** ink fill, paper text, 14px 32px padding, "Share my thoughts →".
- **Hover / focus:** hover dims to 85% opacity; keyboard focus = 2px ink outline, 2px offset.

### Chips (reactions + read-status)
- **Style:** hairline pill (ink 25% border), transparent ground, 44px+ touch height.
- **Selected:** full ink inversion — ink ground, paper text.
- **Read-status variant:** single-select; same states.

### Inputs / Fields
- **Boxed:** textarea — 1px ink-22% border, transparent ground, no radius, focuses to solid ink border + 2px outline offset.
- **Underlined:** name field — bottom hairline only, borderless above.
- **Placeholder:** #6B6B6B.
- **Range slider:** 1px hairline track, 22px solid-ink round thumb, live "n / 10" output set in Playfair tabular numerals.

### Star Rating
- **Signature component.** Five labeled radio inputs with a drawn outline star (single SVG on the whole site); filled star = solid ink, preview on hover, visible "You rated my review: n out of 5 stars" line below; keyboard arrows move the selection.

### Community List
- Entries divided by hairlines; name in Playfair 18px, meta in 11–13px Inter; 16px stars; reaction echoes as small hairline pills; feedback text at body size. Average line set with Playfair numerals above the list.

## Do's and Don'ts

### Do:
- **Do** keep every emphasis typographic: the ₹35 / ₹10 crore amounts are slightly larger Playfair with a hairline underline — that's the ceiling of "emphasis."
- **Do** use ink alpha tints (70–90%) for secondary text; never invent a gray family.
- **Do** give keyboard focus a visible 2px ink outline with 2px offset on every interactive element.
- **Do** keep the review copy verbatim — no autoreplace, no smart quotes, no re-paragraphing.

### Don't:
- **Don't** add imagery, illustrations, gradients, colored backgrounds, or icons beyond the drawn star.
- **Don't** shadow or lift elements; the page is flat paper.
- **Don't** turn the ₹ amounts, feedback, or community entries into colored cards.
- **Don't** animate beyond brief (150–180ms) opacity/color transitions; respect reduced motion.
- **Don't** exceed the 40rem measure or add navigation; the site is one continuous read.
