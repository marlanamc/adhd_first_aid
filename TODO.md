### Tomorrow — Website To‑Do (high‑impact, step‑by‑step)

- [ ] Prep (10 min)
  - [ ] Pull latest, clear cache, verify local build runs clean
  - [ ] Create a fresh `content-review` branch

- [ ] Content audit: life_areas
  - [ ] Read each page against its source file; flag inaccuracies/duplicates
  - [ ] Normalize tone, headings, bullets, and color blocks
  - [ ] Preserve key examples; don’t shorten evidence‑backed parts
  - [ ] Commit: "life_areas: normalize tone + preserve key examples"

- [ ] Content audit: complex_loops
  - [ ] Validate loop descriptions and steps; ensure none were lost during cleanup
  - [ ] Add missing "try this" bullets and "tip" blocks where light
  - [ ] Commit: "complex_loops: restore key steps + tighten language"

- [ ] Content audit: identities
  - [ ] Check identity intros and sections for inclusive wording and specificity
  - [ ] Confirm examples/cautions remain; add sources if missing
  - [ ] Commit: "identities: inclusive edits + examples preserved"

- [ ] Source parity check (for all three groups)
  - [ ] For each page, cross‑check with `*_sources` tables
  - [ ] If a source supports removed text, either restore text or move it to a “note”
  - [ ] Commit: "sources: parity and cross‑references updated"

- [ ] Guides
  - [ ] Clean up current guides for consistent structure (summary, sections, sources)
  - [ ] Draft 2–3 new guides in the same voice and layout
  - [ ] Wire into walkthrough where relevant
  - [ ] Commit: "guides: unify structure + add N new guides"

- [ ] Scripts
  - [ ] Add scripts section; format like guides (clear steps, sample wording)
  - [ ] Ensure modals/walkthrough can parse script sections
  - [ ] Commit: "scripts: initial set + formatting"

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

- [ ] Final pass
  - [ ] Run build, lint, and manual smoke test of key routes
  - [ ] Push branch and open PR with a checklist summarizing above

