### Sat, August 9th — Website To‑Do (high‑impact, step‑by‑step)

- [X] Prep (10 min)
  - [X] Pull latest, clear cache, verify local build runs clean
  - [X] Create a fresh `content-review` branch

- [ ] Content audit: life_areas
  - [ ] Read each page against its source file; flag inaccuracies/duplicates
  - [ ] Normalize tone, headings, bullets, and color blocks
  - [ ] Preserve key examples; don’t shorten evidence‑backed parts
  - [ ] Commit: "life_areas: normalize tone + preserve key examples"
  - [ ] ADHD Reasons: confirm 2‑column format everywhere (You might | What's really going on)
  - [ ] Replace any remaining "Insight"/"Context matters" headings with concrete terms (Executive dysfunction, Time blindness, Working memory, Shame/avoidance, Attention)
  - [ ] Bills & Money: review updated left‑column labels and diversified emojis; tighten middle‑column copy if needed
  - [ ] Move any unique "How to work" tactics into Strategies (avoid generic timer/just start)

- [ ] Content audit: complex_loops
  - [ ] Validate loop descriptions and steps; ensure none were lost during cleanup
  - [ ] Add missing "try this" bullets and "tip" blocks where light
  - [ ] Commit: "complex_loops: restore key steps + tighten language"
  - [ ] ADHD Reasons: ensure normalization of vague headings; verify no fallback labels remain
  - [ ] Confirm 2‑column rendering in UI (component updated); spot‑check a few loops (e.g., Analysis Paralysis, Chronic Lateness)

- [ ] Content audit: identities
  - [ ] Check identity intros and sections for inclusive wording and specificity
  - [ ] Confirm examples/cautions remain; add sources if missing
  - [ ] Commit: "identities: inclusive edits + examples preserved"

- [ ] Source parity check (for all three groups)
  - [ ] For each page, cross‑check with `*_sources` tables
  - [ ] If a source supports removed text, either restore text or move it to a “note”
  - [ ] Commit: "sources: parity and cross‑references updated"
  - [ ] Script: expand 2‑col export with source diff to highlight mismatches

- [ ] Guides
  - [ ] Clean up current guides for consistent structure (summary, sections, sources)
  - [ ] Draft 2–3 new guides in the same voice and layout
  - [ ] Wire into walkthrough where relevant
  - [ ] Commit: "guides: unify structure + add N new guides"

- [ ] Scripts
  - [ ] Add scripts section; format like guides (clear steps, sample wording)
  - [ ] Ensure modals/walkthrough can parse script sections
  - [ ] Commit: "scripts: initial set + formatting"
  - [ ] Add a migration script to push suggested strategy moves into each page's Strategies (de‑dupe on insert)

- [ ] Quiz
  - [ ] Fix current quiz logic/UX (results clarity, state persistence)
  - [ ] Rework questions and scoring for clearer archetypes
  - [ ] Commit: "quiz: logic fixes + content rework"

- [ ] Resources & podcasts
  - [ ] Add resources by category; add 1–2 high‑quality podcasts per category
  - [ ] Ensure category steps in modal paginate when long
  - [ ] Commit: "resources: categories + podcasts added"

- [ ] Feelings pages: scan for unformatted markdown
  - [ ] Walkthrough: confirm bold/italics in Quick Summary, Soft Start, Tough Love, ADHD reasons, steps (intro/try‑this/tips), and Sources
  - [ ] Page content: ensure `formatMarkdownText` (or equivalent) is applied everywhere
  - [ ] Fix remaining colon‑based bolding or list parsing edge cases

- [ ] Barriers pages: scan for unformatted markdown
  - [ ] Walkthrough: verify bold/italics for summary, sections, ADHD reasons, steps, and Sources
  - [ ] Page content: confirm parity with feelings’ formatter
  - [ ] Align colon‑heading bolding behavior across both features

- [ ] Automated check (optional)
  - [ ] Add a dev‑only validator that crawls feelings/barriers DOM and logs any section where raw markdown tokens (`**`, `_`) remain after render
  - [ ] Add a validator for life_areas/complex_loops ADHD Reasons: 
        - flag truncated left labels, 
        - missing colon in middle heading, 
        - vague headings (Insight/Context), 
        - empty descriptions

- [ ] Final pass
  - [ ] Run build, lint, and manual smoke test of key routes
  - [ ] Push branch and open PR with a checklist summarizing above

---
Notes captured today
- Removed "How to work with your brain" column; site now renders 2‑column ADHD Reasons.
- Normalized middle‑column headings to concrete ADHD terms.
- Bills & Money: updated You‑might labels; diversified emojis; improved middle‑column copy.
- Added audit scripts:
  - audit-adhd-reasons.ts (autofix for You‑might truncation, section markers, typos)
  - export-adhd-reasons-2col-report.ts (generates 2‑col markdown + suggested strategy moves)
- Remaining high‑severity items (from audit): 7 — address first tomorrow.

