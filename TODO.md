# ADHD First Aid Kit - Project TODO

> **Status Dashboard** | **Last Updated:** 2025-01-08
> - **Critical Priority:** Mobile UX Improvements, Search functionality 🔴  
> - **Launch Blockers:** Search functionality 🔴
> - **Legal Requirements:** Complete ✅
> - **Content Audit:** In Progress 🟡
> - **PWA Features:** Enhanced ✅

---

## 🚀 Quick Navigation

- [[#🔥 Critical Priority]] - Must-do items for immediate attention
- [[#📱 Mobile UX Improvements]] - User experience fixes
- [[#🚨 Launch Readiness]] - Production deployment checklist  
- [[#📝 Content Audit]] - Ongoing content improvements
- [[#📱 PWA Enhancements]] - Progressive Web App features
- [[#📊 Development Notes]] - Completed work and context

---

## 🔥 Critical Priority

> **These items block launch and must be completed first**

### Search Functionality #critical #bug
- [ ] **Fix search functionality**
  - [ ] Debug current search feature issues
  - [ ] Test search across all content types (barriers, feelings, life areas, etc.)
  - [ ] Ensure search results are accurate and helpful
  - [ ] Test search on mobile devices
  - [ ] Add search analytics to track usage patterns

### Legal Requirements #critical #legal
- [x] **✅ COMPLETED: Write comprehensive terms and conditions**
  - [x] Cover mental health content disclaimers
  - [x] Address liability limitations
  - [x] Include user conduct guidelines
  - [x] Specify intellectual property rights
- [x] **✅ COMPLETED: Create privacy policy**
  - [x] Cover data collection practices (minimal for this app)
  - [x] Address ADHD-specific privacy considerations
  - [x] Include cookie usage if applicable
  - [x] Specify data retention policies
- [x] **✅ COMPLETED: Integrate legal documents with markdown system**
  - [x] Created comprehensive Terms of Service (public/terms-of-service.md)
  - [x] Created detailed Privacy Policy (public/privacy-policy.md)
  - [x] Built markdown parsing system with gray-matter for easy content updates
  - [x] Updated legal page to read from markdown files dynamically
  - [x] Added proper contact information (marlie@navcoaching.org)
  - [x] Set Massachusetts jurisdiction and proper business attribution (Navigating the Storm)
- [ ] Add legal links to footer
- [ ] Implement cookie consent banner if needed
- [ ] Review GDPR compliance requirements

---

## 📱 Mobile UX Improvements

> **Issue:** Website looks gorgeous on desktop but needs significant mobile improvements for usability.

### Comprehensive Mobile Audit #mobile #ux
- [ ] **Comprehensive mobile responsiveness audit across all pages**
  - [ ] Audit all page layouts for mobile breakpoints
  - [ ] Document specific mobile UX pain points
  - [ ] Prioritize issues by severity and user impact

### Navigation & Header Fixes #mobile #ui
- [ ] **Fix mobile navigation and header layouts**
  - [ ] Ensure consistent mobile-friendly navigation across all pages
  - [ ] Fix header text wrapping and icon sizing
  - [ ] Optimize hamburger menus and touch targets

### Typography & Readability #mobile #typography
- [ ] **Improve mobile text sizing and readability** 
  - [ ] Apply responsive text sizing patterns (text-sm sm:text-base) to all pages
  - [ ] Fix text wrapping with break-words and proper flex layouts
  - [ ] Ensure proper line height and spacing for mobile reading

### Touch Targets & Interaction #mobile #accessibility
- [ ] **Optimize mobile touch targets and button spacing**
  - [ ] Ensure all buttons meet 44px minimum touch target size
  - [ ] Add proper spacing between interactive elements
  - [ ] Fix navigation button layouts (like we did for feelings page)

### Device Testing #mobile #testing
- [ ] **Test mobile UX on real devices and fix issues**
  - [ ] Test on various screen sizes and devices
  - [ ] Fix any remaining layout or interaction issues
  - [ ] Validate accessibility on mobile

> **Template Reference:** Use feelings page mobile fixes as pattern:
> - `flex-shrink-0` for icons
> - `min-w-0` for text containers  
> - `text-sm sm:text-base` for responsive sizing
> - `break-words` for proper text wrapping

---

## 📝 Content Audit

> **High-impact, step-by-step content improvements**

### Life Areas Content #content #audit
- [ ] **Content audit: life_areas**
  - [ ] Read each page against its source file; flag inaccuracies/duplicates
  - [ ] Normalize tone, headings, bullets, and color blocks
  - [ ] Preserve key examples; don't shorten evidence‑backed parts
  - [ ] Commit: "life_areas: normalize tone + preserve key examples"
  - [ ] ADHD Reasons: confirm 2‑column format everywhere (You might | What's really going on)
  - [ ] Replace any remaining "Insight"/"Context matters" headings with concrete terms (Executive dysfunction, Time blindness, Working memory, Shame/avoidance, Attention)
  - [ ] Bills & Money: review updated left‑column labels and diversified emojis; tighten middle‑column copy if needed
  - [ ] Move any unique "How to work" tactics into Strategies (avoid generic timer/just start)

### Complex Loops Content #content #audit
- [ ] **Content audit: complex_loops**
  - [ ] Validate loop descriptions and steps; ensure none were lost during cleanup
  - [ ] Add missing "try this" bullets and "tip" blocks where light
  - [ ] Commit: "complex_loops: restore key steps + tighten language"
  - [ ] ADHD Reasons: ensure normalization of vague headings; verify no fallback labels remain
  - [ ] Confirm 2‑column rendering in UI (component updated); spot‑check a few loops (e.g., Analysis Paralysis, Chronic Lateness)

### Identities Content #content #audit
- [ ] **Content audit: identities**
  - [ ] Check identity intros and sections for inclusive wording and specificity
  - [ ] Confirm examples/cautions remain; add sources if missing
  - [ ] Commit: "identities: inclusive edits + examples preserved"

### Source Verification #content #sources
- [ ] **Source parity check (for all three groups)**
  - [ ] For each page, cross‑check with `*_sources` tables
  - [ ] If a source supports removed text, either restore text or move it to a "note"
  - [ ] Commit: "sources: parity and cross‑references updated"
  - [ ] Script: expand 2‑col export with source diff to highlight mismatches

### Markdown Formatting #content #formatting
- [ ] **Feelings pages: scan for unformatted markdown**
  - [ ] Walkthrough: confirm bold/italics in Quick Summary, Soft Start, Tough Love, ADHD reasons, steps (intro/try‑this/tips), and Sources
  - [ ] Page content: ensure `formatMarkdownText` (or equivalent) is applied everywhere
  - [ ] Fix remaining colon‑based bolding or list parsing edge cases

- [ ] **Barriers pages: scan for unformatted markdown**
  - [ ] Walkthrough: verify bold/italics for summary, sections, ADHD reasons, steps, and Sources
  - [ ] Page content: confirm parity with feelings' formatter
  - [ ] Align colon‑heading bolding behavior across both features

### Additional Content Features #content #new
- [ ] **Guides**
  - [ ] Clean up current guides for consistent structure (summary, sections, sources)
  - [ ] Draft 2–3 new guides in the same voice and layout
  - [ ] Wire into walkthrough where relevant
  - [ ] Commit: "guides: unify structure + add N new guides"

- [ ] **Scripts**
  - [ ] Add scripts section; format like guides (clear steps, sample wording)
  - [ ] Ensure modals/walkthrough can parse script sections
  - [ ] Commit: "scripts: initial set + formatting"
  - [ ] Add a migration script to push suggested strategy moves into each page's Strategies (de‑dupe on insert)

- [ ] **Quiz**
  - [ ] Fix current quiz logic/UX (results clarity, state persistence)
  - [ ] Rework questions and scoring for clearer archetypes
  - [ ] Commit: "quiz: logic fixes + content rework"

- [ ] **Resources & podcasts**
  - [ ] Add resources by category; add 1–2 high‑quality podcasts per category
  - [ ] Ensure category steps in modal paginate when long
  - [ ] Commit: "resources: categories + podcasts added"

---

## 🚨 Launch Readiness

> **Production deployment checklist**

### Security & Privacy #security #legal
- [ ] **Content safety and disclaimers**
  - [ ] Add medical disclaimer stating this is not a substitute for professional care
  - [ ] Include crisis resources and suicide prevention hotlines
  - [ ] Add content warnings for sensitive mental health topics
  - [ ] Review all content for safety and accuracy
  - [ ] Consider professional mental health expert review

- [ ] **Security hardening**
  - [ ] Implement Content Security Policy (CSP) headers
  - [ ] Add security headers (HSTS, X-Frame-Options, etc.)
  - [ ] Review and secure all environment variables
  - [ ] Set up proper error handling to avoid exposing sensitive data
  - [ ] Implement rate limiting for API endpoints

### SEO & Performance #seo #performance
- [ ] **Search engine optimization**
  - [ ] Create sitemap.xml for better search indexing
  - [ ] Add robots.txt file
  - [ ] Implement proper meta descriptions for all pages
  - [ ] Add structured data/schema markup for mental health content
  - [ ] Optimize page titles and headings (H1, H2 structure)
  - [ ] Add Open Graph and Twitter Card meta tags

- [ ] **Performance optimization**
  - [ ] Run Lighthouse audit and achieve 90+ scores
  - [ ] Optimize images with next/image and proper alt text
  - [ ] Implement lazy loading for heavy content
  - [ ] Minimize JavaScript bundles
  - [ ] Set up proper caching headers
  - [ ] Test Core Web Vitals performance

### Accessibility & Compliance #accessibility #wcag
- [ ] **WCAG 2.1 AA compliance**
  - [ ] Ensure proper color contrast ratios throughout app
  - [ ] Add comprehensive keyboard navigation support
  - [ ] Implement proper ARIA labels and roles
  - [ ] Test with screen readers (VoiceOver, NVDA)
  - [ ] Add skip-to-content links
  - [ ] Ensure focus indicators are visible

- [ ] **Inclusive design**
  - [ ] Test with users who have ADHD for usability feedback
  - [ ] Review language for inclusivity and accessibility
  - [ ] Ensure content works for various reading levels
  - [ ] Test color-blind friendly design

### Quality Assurance #testing #qa
- [ ] **Comprehensive testing**
  - [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
  - [ ] Mobile device testing on real phones/tablets
  - [ ] Test offline functionality and PWA features
  - [ ] Load testing for high traffic scenarios
  - [ ] Test all forms and user interactions
  - [ ] Verify all links work and content loads properly

- [ ] **Error handling & monitoring**
  - [ ] Implement comprehensive error boundaries
  - [ ] Set up error monitoring (Sentry, LogRocket, etc.)
  - [ ] Create custom 404 and 500 error pages
  - [ ] Test error scenarios and edge cases
  - [ ] Implement analytics to track user behavior

### Business & Legal #business #legal
- [ ] **Business considerations**
  - [ ] Register appropriate domain name
  - [ ] Set up business entity if needed
  - [ ] Consider trademark registration for brand protection
  - [ ] Review insurance needs for mental health content
  - [ ] Understand liability for providing mental health resources

- [ ] **Content licensing**
  - [ ] Ensure all content is properly licensed or original
  - [ ] Credit sources and research appropriately
  - [ ] Verify icon and image licensing
  - [ ] Document content creation and review process

### Deployment & Infrastructure #deployment #infrastructure
- [ ] **Production deployment**
  - [ ] Set up production hosting (Vercel, Netlify, etc.)
  - [ ] Configure custom domain with SSL
  - [ ] Set up production environment variables
  - [ ] Configure CDN for global performance
  - [ ] Set up backup and recovery procedures

- [ ] **Monitoring & maintenance**
  - [ ] Implement uptime monitoring
  - [ ] Set up performance monitoring
  - [ ] Create content update workflow
  - [ ] Plan regular security updates
  - [ ] Document deployment and maintenance procedures

### Launch Marketing #marketing #launch
- [ ] **Launch preparation**
  - [ ] Create launch announcement content
  - [ ] Set up social media presence
  - [ ] Prepare press kit for mental health publications
  - [ ] Plan soft launch with beta users
  - [ ] Create user onboarding experience

- [ ] **Post-launch support**
  - [ ] Set up user feedback collection system
  - [ ] Plan content update schedule
  - [ ] Create user support documentation
  - [ ] Establish community guidelines if adding social features

### Final Pass #final #validation
- [ ] **Automated check (optional)**
  - [ ] Add a dev‑only validator that crawls feelings/barriers DOM and logs any section where raw markdown tokens (`**`, `_`) remain after render
  - [ ] Add a validator for life_areas/complex_loops ADHD Reasons: 
        - flag truncated left labels, 
        - missing colon in middle heading, 
        - vague headings (Insight/Context), 
        - empty descriptions

- [ ] **Final validation**
  - [ ] Run build, lint, and manual smoke test of key routes
  - [ ] Push branch and open PR with a checklist summarizing above

---

## 📱 PWA Enhancements

> **Progressive Web App features**

### Mobile Installation Guide #pwa #mobile
- [ ] **Create user guide for installing app on mobile devices**
  - [ ] Write step-by-step installation guide for iOS (Safari)
  - [ ] Write step-by-step installation guide for Android (Chrome)
  - [ ] Include screenshots for each major step
  - [ ] Add troubleshooting section for common installation issues
  - [ ] Consider adding this guide to the app's help section or onboarding
  - [ ] Test installation process on real devices to validate instructions

---

## 📊 Development Notes

> **Completed work and important context**

### Recent Achievements ✅
- **✅ COMPLETED:** Legal documentation and integration system (2025-01-08)
  - Created comprehensive Terms of Service and Privacy Policy with proper business information
  - Built dynamic markdown parsing system using gray-matter for easy content management
  - Integrated legal documents into site architecture with server-side rendering
  - Added Massachusetts jurisdiction and proper liability disclaimers
  - Set up maintainable content update workflow via markdown files
- **✅ COMPLETED:** Fixed mobile text wrapping and responsiveness in feelings page navigation (commit f7b5c05)
- Removed "How to work with your brain" column; site now renders 2‑column ADHD Reasons
- Normalized middle‑column headings to concrete ADHD terms
- Bills & Money: updated You‑might labels; diversified emojis; improved middle‑column copy

### Audit Scripts Available 🛠️
- `audit-adhd-reasons.ts` (autofix for You‑might truncation, section markers, typos)
- `export-adhd-reasons-2col-report.ts` (generates 2‑col markdown + suggested strategy moves)

### Priority Context 📌
- **Remaining high‑severity items:** 7 — address first tomorrow
- **Mobile UX** is critical priority due to desktop/mobile experience gap
- **Search functionality** blocks user discovery of content
- **Legal requirements** block production deployment

---

## 📋 Tags Reference

**Priority Tags:** `#critical` `#high` `#medium` `#low`
**Feature Tags:** `#mobile` `#content` `#security` `#legal` `#pwa` `#testing`
**Status Tags:** `#bug` `#enhancement` `#blocked` `#in-progress`
**Component Tags:** `#ui` `#ux` `#accessibility` `#performance` `#seo`