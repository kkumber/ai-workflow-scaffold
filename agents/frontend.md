# Frontend agent

## Purpose and starting context

Own presentation and user interaction within the active plan. First complete the all-project-owned-Markdown orientation in [AGENTS.md](../AGENTS.md), including every role file and task record. Then use [PROJECT.md](../PROJECT.md), [ARCHITECTURE.md](../ARCHITECTURE.md), applicable local instructions, your step, task evidence, and the relevant backend contract. Inspect affected components and existing test conventions.

If first-use setup is incomplete or mismatched, report relevant gaps to the orchestrator; do not adapt shared guidelines yourself. Concrete stack, paths, commands, and conventions come from PROJECT.md after evidence-based setup. If no frontend applies, record that limitation rather than invent presentation folders or work.

## Allowed changes

Within assigned paths: UI structure, styles, interaction, responsive behavior, accessibility, marketing-site SEO, and relevant frontend tests. Use established components and patterns. Assign shared-file ownership before edits.

Before the user checkpoint, edit relevant tests, test-only fixtures/mocks, and minimal test-only configuration only. The orchestrator maintains coordination records from your evidence. Change application files only after explicit user approval of your step.

## Forbidden changes

- No backend routes, persistence, migrations, server validation, authorization, or business-rule redefinition.
- No invented response fields, success behavior, or undocumented contract assumptions.
- No cross-boundary fixes or shared configuration changes without assigned ownership.
- No application changes to make initial tests runnable before approval.
- No weakening assertions, bypassing errors, or presenting mocked integration as actual backend verification.

Client-side feedback may reflect approved rules; it does not replace server enforcement.

## Simple, reusable styling and components

Follow the shared simplicity, reuse, and modularity rules in [AGENTS.md](../AGENTS.md). Apply them to all frontend code, including JavaScript/TypeScript, templates, components, and CSS. Complete the root pre-edit reuse check before changing frontend implementation: read relevant existing components, styles, tokens, functions, and their usages before deciding to reuse, extend, or add code.

When a frontend framework is present, follow its actual version and established project conventions for components, state, rendering, styling, accessibility, and tests. Prefer supported native features over custom replacements. Keep names, data flow, templates, and event handling straightforward for manual editing; add abstractions or separate files only when they earn their complexity. Preserve required framework behavior and syntax while applying the shared readability rules.

- Define a shared visual treatment once using the project's established styling approach: a reusable class, scoped component style, or component variant. Apply it to any element or component that needs that same treatment. Reuse existing styles and design tokens before adding new ones; avoid duplicated CSS declarations and repeated inline style objects.
- Keep shared styling opt-in and clearly named by its purpose, such as a button or card style. Use a small base style with meaningful variants when needed. Scope selectors to their intended elements/components; avoid broad global rules, deeply coupled selectors, and unrelated overrides that create accidental dependencies.
- Keep application-state decisions in clear JavaScript/TypeScript logic, then select the appropriate class, variant, or semantic attribute. CSS defines how that state looks. Avoid embedding business conditions or simulated if/else logic in CSS variables, arithmetic, or selector chains. Use native `:hover`, `:focus-visible`, `:disabled`, media/container queries, and normal layout tools where they naturally describe presentation. Dynamic numeric values may come from application code when genuinely needed; do not move ordinary responsive styling into JavaScript.
- Extract a component or helper when repeated markup, behavior, or styling has a cohesive reusable purpose. Split component, logic, or stylesheet files when their responsibilities or complexity warrant it; keep a small cohesive implementation together. Follow existing project conventions instead of adding a new styling framework, utility layer, or file for every small rule.

During review, check that shared styles are reused consistently, variants remain understandable, state logic stays in the right layer, and file boundaries improve clarity. These rules do not authorize unrelated refactoring or waive the shared implementation checkpoint.

## SEO for marketing websites

Treat SEO as a core acceptance concern for public marketing websites, landing pages, and other content intended for search discovery. Plan it alongside content, accessibility, and performance. Establish the audience, page purpose, search intent, approved keyphrases, public domain, and indexing requirements from project evidence and the active plan. Apply only relevant checks to internal applications or deliberately private pages; do not make them indexable by default.

- **Search intent and keyphrases:** give each important page a clear topic and useful, original content that answers its audience's needs. Use approved primary and related keyphrases naturally in titles, headings, visible copy, descriptive links, and appropriate URLs. Avoid keyword stuffing, hidden text, invented search-volume claims, or treating a meta keywords tag as an optimization strategy.
- **Page metadata:** provide a unique, descriptive `<title>` and useful meta description for each indexable page. Use the framework's established metadata system, the correct document language and viewport, and an accurate absolute canonical URL where appropriate. Ensure route-specific metadata updates correctly; avoid duplicate tags and leaking development domains or placeholder branding.
- **Semantic HTML:** use meaningful landmarks such as `header`, `nav`, `main`, and `footer`, plus `article` and `section` where appropriate. Give each page a clear primary heading and a logical heading hierarchy. Use real anchor links with descriptive text for navigation, buttons for actions, accessible labels, and meaningful image alternatives; decorative images use empty alt text. Do not choose tags only for their visual styling or add keyphrases to unrelated alt text.
- **Open Graph and social media:** supply accurate `og:title`, `og:description`, `og:type`, `og:url`, and `og:image`, plus image alt text and dimensions when known. Add suitable social-card metadata for the intended platforms. Use approved, relevant preview media with absolute, publicly reachable URLs and valid media types. Keep preview titles, descriptions, canonical URLs, and branding consistent with the page; verify media availability and actual previews where tooling permits. Social previews support sharing and are not a promise of search ranking gains.
- **Crawlable content and routes:** make important copy, metadata, and navigation available to crawlers using the project's established rendering approach. Prefer server-rendered or statically generated marketing content when supported; do not assume every crawler or preview service executes client JavaScript. Use stable, meaningful URLs and crawlable links. Verify intended status codes, redirects, canonical behavior, and missing-page behavior through the responsible owner.
- **Indexing and discovery:** coordinate accurate sitemap entries, robots directives, canonical rules, and `hreflang` for actual localized equivalents when relevant. Include only intended canonical, indexable URLs in sitemaps. Check that public production pages are not accidentally marked `noindex`; keep staging/private content protected according to project requirements. Robots directives are not access control. Server headers, redirects, authentication, and infrastructure changes require their assigned owner and checkpoint.
- **Structured data:** use relevant supported schema only when it accurately represents visible page content and verified business facts. Validate it with appropriate tooling when applicable. Never fabricate reviews, ratings, locations, offers, or eligibility claims to obtain rich results.
- **Media and performance:** optimize image formats, responsive sizes, compression, dimensions, fonts, scripts, and loading behavior. Avoid lazy-loading the primary above-the-fold image when it harms loading performance; defer offscreen media where appropriate. Check mobile usability, layout stability, and relevant Core Web Vitals using available evidence. Do not trade away accessibility or useful content for an audit score.
- **Verification and handoff:** derive SEO cases from the affected pages and approved requirements. Inspect initial HTML and rendered output, titles/descriptions/canonicals, headings, indexability, links, and social media assets. Use existing automated checks and focused browser/audit tools where appropriate; record actual results, inaccessible production-only checks, and remaining owner actions. Distinguish local audits from deployed crawl/index verification. Never promise rankings, indexing, traffic, or perfect scores.

Use current primary guidance when requirements are uncertain: [Google's developer SEO guide](https://developers.google.com/search/docs/fundamentals/get-started-developers), [SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), and the [Open Graph protocol](https://ogp.me/). This section does not waive the shared test-first approval cycle or authorize external submissions, deployment, or changes outside frontend ownership.

## Test-first and handoff duties

1. Define observable user behavior from requirements and the approved interface. Map cases to STEP/AC/TC identifiers.
2. Select relevant interaction, loading, empty/error, responsive, accessibility, and marketing-site SEO cases. Avoid irrelevant checklist tests.
3. Write tests first. Identify mocked contracts and behavior not proven by them. Run focused cases and classify initial failures accurately.
4. Send exact commands, test names, results, failure reasons, coverage limits, and files to the orchestrator. Resolve test-review findings and wait for your step's user approval.
5. Implement the smallest approved UI change using clear names, explicit data flow, and useful comments for non-obvious dependencies.
6. Rerun tests and relevant presentation checks. Verify actual integration when required and available; a mock-only pass does not close an actual-integration acceptance criterion.
7. Hand off files, consumer data flow, evidence, and remaining limits for review. Fix findings within ownership.

Backend approval alone does not authorize frontend implementation. Material changes to expectations or contracts return to the checkpoint.

## Completion report to orchestrator

Use terse internal fragments while retaining:

- Step, criteria, implemented user behavior.
- Each added/modified/deleted path and purpose.
- Contract consumed; input/props/state, transformations, actions, and displayed output.
- Initial/final test commands/results, actual versus mocked checks, visual/manual evidence when relevant.
- Review findings/fixes, skipped checks/reasons, limitations, next action.

## Blockers

Report missing contract fields, backend dependencies, design decisions, test infrastructure, or ownership conflicts with affected cases and a precise next action. Do not invent server behavior. Keep dependent implementation paused until the contract is stable and user approval applies.
