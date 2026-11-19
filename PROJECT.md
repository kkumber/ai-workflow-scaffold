# Project context

## Reading index

Use this index to select relevant sections; do not routinely read the whole file. Reuse unchanged context and reload relevant sections after context loss.

| Need | Sections |
|---|---|
| Purpose and outcomes | [Identity](#project-identity-and-purpose), [goals](#goals-objectives-and-success-measures) |
| Feature scope | [Catalogue and behavior](#feature-catalogue-and-behavior) |
| Implementation constraints | [Stack](#technical-stack-and-architecture-decisions), [tools](#tools-and-working-environment), [bindings](#adoption-fields) |
| Current phase | [Roadmap and phase links](#implementation-plan-by-phases) |
| Setup | [Setup record](#workflow-setup-record) |

## Current template repository

This repository supplies Codex-specific project guidance and standalone backend, frontend, and read-only reviewer configurations. Its users are project owners and Codex agents selecting risk-based implementation and focused verification: TDD/user checkpoints for major features, material flows and high-risk work, direct implementation for small low-risk changes. The roles live in [.codex/agents/backend.toml](.codex/agents/backend.toml), [.codex/agents/frontend.toml](.codex/agents/frontend.toml), and [.codex/agents/reviewer.toml](.codex/agents/reviewer.toml); backend/frontend reasoning is medium and reviewer high. No role sets a model, so the user's Codex session/default model choice remains in control. This source repository's maintenance history is excluded from package and receiving-project copies.

This is a Codex workflow scaffold and its delivery tool, not a configured receiving application. It establishes no receiving-application stack, test platform, runtime API, database, or deployment target. Navigation is in [ARCHITECTURE.md](ARCHITECTURE.md); adoption instructions are in [tasks/README.md](tasks/README.md).

[package.json](package.json) defines the `ai-workflow-scaffold` package for GitHub installation. Its npx command, [bin/ai-workflow-scaffold.cjs](bin/ai-workflow-scaffold.cjs), initializes missing reusable guidance and upstream tracking, then uses managed updates on reruns. Shared allowlist/path handling lives in [lib/scaffold-files.cjs](lib/scaffold-files.cjs); [lib/scaffold-updates.cjs](lib/scaffold-updates.cjs) owns state, clean merges, staged conflicts, and explicit resolution. [README.md](README.md) covers setup, legacy migration, updates, and project-specific README adaptation. Requirements: Node.js >=20, npm/npx, Git for GitHub fetching and two-sided text merges. `npm test` runs [setup tests](tests/scaffold.test.cjs) and [update tests](tests/updates.test.cjs) with Node's built-in runner; it tests the tool, not the receiving application. Keep `.ai-workflow-scaffold/state.json` and pending review state with adopted guidance while managed updates are used. There are no install hooks or npm runtime dependencies. During adoption, keep the receiving project's own manifest and customized README; remove source-tool paths/history references when not copied. Distribution metadata does not establish an application stack or verified receiving-project commands.

The orchestrator owns these coordination documents. Backend/frontend application paths are not assigned here because no application paths have been verified. Do not infer them from example directories. The introduction above describes the scaffold source only; during adoption, change these paragraphs to describe the receiving project. Preserve reusable sections and follow AGENTS.md when removing obsolete setup-only content.

The [Codex role/migration tests](tests/codex-agents.test.cjs) join the setup/update suites under npm test. The tool reads/writes agent configurations as UTF-8 text; full TOML parsing/schema inspection is a direct artifact check, not a Python runtime dependency. The legacy Markdown-role allowlist is accepted only for controlled state migration; old receiver files remain available for manual integration and backup before cleanup.

## Workflow setup record

Workflow setup status: template

Allowed values: `template`, `in progress`, `ready`. This scaffold source intentionally remains `template`; maintaining it is not application adoption. In a receiving project, the orchestrator follows the first-use protocol in AGENTS.md and updates this record. Missing state or a mismatched target also requires setup inspection.

| Setup field | Value |
|---|---|
| Configured project identity | [TODO: receiving project's observed name/purpose and relative workspace target; avoid machine-specific absolute paths] |
| Setup owner | Orchestrator |
| Evidence inspected | [TODO: actual manifest, configuration, instruction, and entry-point paths with observations] |
| Guidance orientation | [TODO: applicable instructions, project constraints, assigned role and relevant evidence read; exclusions/blockers] |
| Guideline files adapted | [TODO: exact paths and project-specific changes; preserve shared rules] |
| Setup cleanup | [TODO: exact removed wording/sections/files/folders and reasons, inspected references, retained uncertain items, or None with reason; record removals before deletion and verification afterward] |
| Verification performed | [TODO: actual path/link/consistency checks and results] |
| Commands discovered but not run | [TODO: distinguish configured commands from verified results] |
| Blocking setup decisions | [TODO: question, impact, owner, next action; None when resolved] |
| User-agreed deferrals | [TODO: detail, actual user agreement, impact, owner, dependent work that must wait and next resolution action; None only when established] |
| Resume / next action | [TODO: remaining setup action or None when ready] |

Set `ready` only after the target is identified, relevant project bindings and links are accurate, applicable cleanup is complete, shared policies remain intact, every setup detail satisfies the [first-use completion rule](tasks/README.md#first-use-procedure), and no unanswered setup decision remains. Every detail must be filled from evidence/user answers, supported as not applicable, or explicitly deferred by the user with limits recorded. Otherwise retain `in progress`. Do not infer readiness from the absence of TODO markers: reusable task placeholders must remain blank; unresolved project details require recorded user agreement to defer. Ready describes documentation setup only. Reuse a matching ready record without wholesale rewrites; check stale or copied records against the actual project.

## Adoption fields

When copying to another project, adapt the repository-specific introduction and fields below from actual requirements and inspection, following AGENTS.md. Change only project bindings, not the form's structure. `[TODO: ...]` marks missing information, not an approved value. During setup, give every detail a recorded disposition under the first-use completion rule; do not leave unasked unknowns merely because they seem unrelated or nonblocking. Resolve deferred details before their dependent work; user agreement to defer documentation decisions does not authorize dependent implementation. Preserve existing host and local instructions. Identify non-applicable roles or commands with an observed reason instead of inventing values.

| Field                          | Project value                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Purpose and goals              | [TODO: concrete outcomes]                                                          |
| Users and primary workflows    | [TODO: actors and important journeys]                                              |
| Requirements source            | [TODO: canonical documents or links]                                               |
| Stack and relevant versions    | [TODO: inspect manifests and runtime requirements]                                 |
| Entry points                   | [TODO: actual application entry files; link map entries]                           |
| Backend-owned paths and tests  | [TODO: verified paths]                                                             |
| Frontend-owned paths and tests | [TODO: verified paths]                                                             |
| Shared contracts/configuration | [TODO: actual paths; assign each affected file one owner per task]                 |
| Generated/vendor paths         | [TODO: verified outputs and sources; normally avoid direct edits]                  |
| Additional coding conventions  | [TODO: established project patterns; root readability rules still apply]           |
| Development prerequisites      | [TODO: runtimes, local services, safe test data requirements]                      |
| Automated test tools           | [TODO: existing tools and configuration files]                                     |
| Focused test commands          | [TODO: exact commands and working directories; verify before claiming established] |
| Build/type/lint commands       | [TODO: relevant commands, purpose, and side effects]                               |
| Manual verification            | [TODO: reproducible procedures and limitations]                                    |
| Business constraints           | [TODO: concrete rules and requirement references]                                  |
| Security and data boundaries   | [TODO: permissions, tenant/location scope if applicable, sensitive data handling]  |
| Deployment boundaries          | [TODO: local/remote environments and separately authorized actions]                |
| Known unknowns                 | [TODO: open question, impact, owner, and resolution needed]                        |

## Detailed project blueprint

Complete the following scaffold during adoption using user decisions, existing requirements and repository evidence. These fields describe the receiving project; they are intentionally unfilled in this reusable source. Give enough detail for a new contributor to understand what to build, why, for whom and in what order. Retain useful existing project documentation and link its canonical sections instead of copying them. A placeholder is an unknown, not a requirement or implementation permission. Label statements as observed, decided or proposed where the distinction matters; record evidence and decision sources. Do not invent a product, stack, feature or delivery commitment to complete the form.

### Project identity and purpose

- **Project name and summary:** [TODO: name, product category and a precise description of what the project does]
- **Problem and current situation:** [TODO: whose problem is being solved, how work happens today, pain points and consequences]
- **Proposed solution and value:** [TODO: how the product changes that work and the concrete benefit it provides]
- **Audience and stakeholders:** [TODO: primary/secondary users, business owner, delivery owner and decision makers]
- **Product boundaries:** [TODO: selected application/workspace, supported channels, organizations/locations, markets and external systems]
- **Core user journeys:** [TODO: actor, trigger, sequence, successful outcome and significant failure/exception paths; reference FEAT IDs below]
- **Current maturity:** [TODO: idea/prototype/existing product; observed capabilities, known gaps and evidence paths]
- **Scope and exclusions:** [TODO: committed scope, deferred work and explicit exclusions with reasons]
- **Requirements and decisions:** [TODO: canonical sources, accepted decisions, unresolved proposals and who can resolve them]

### Goals, objectives and success measures

Describe desired outcomes separately from the features used to achieve them. Use stable GOAL IDs; distinguish a measured baseline from an estimate or an unknown. Targets and dates require an actual decision source.

| Goal ID | Problem / desired outcome | Measurable objective and target | Baseline / evidence | Measurement method and timing | Owner / decision source |
|---|---|---|---|---|---|
| GOAL-01 | [TODO: outcome and affected users] | [TODO: metric, target, timeframe and rationale] | [TODO: observed value, estimate or unknown] | [TODO: data source and review cadence] | [TODO] |

- **Priority and tradeoffs:** [TODO: which outcomes take precedence and how conflicts are decided]
- **Project completion:** [TODO: observable product/business conditions for completion; link phase exit criteria]
- **Assumptions and constraints:** [TODO: budget, staffing, deadlines, compatibility and dependencies; identify evidence and impact]

### Feature catalogue and behavior

Assign a stable FEAT ID to each capability. Repeat the detail form for each feature or link an existing canonical specification containing these fields. Keep the catalogue here as the project-level index; task plans own step-specific cases, approvals and execution evidence.

| Feature ID / name | User need / linked goals | Priority and scope | Planned phase | Delivery status / evidence | Specification / task links |
|---|---|---|---|---|---|
| FEAT-01 / [TODO] | [TODO: actor, need, GOAL IDs] | [TODO: committed/proposed/deferred and priority] | [TODO: PHASE ID] | [TODO: proposed/planned/in progress/verified/deferred; evidence] | [TODO] |

**Feature detail: FEAT-01 — [TODO: name]**

- **Purpose and actors:** [TODO: problem solved, users, roles and prerequisites]
- **Entry points and journey:** [TODO: trigger, screens/routes/API or command surfaces, main sequence and result]
- **Inputs and rules:** [TODO: required/optional values, validation, calculations, defaults and significant boundaries]
- **Outputs and state changes:** [TODO: displayed results, stored changes, notifications and other side effects]
- **Permissions and data scope:** [TODO: who may view/change what; tenant/location boundaries and sensitive data handling]
- **States and exceptions:** [TODO: relevant empty/loading/success/error states, invalid input, unavailable dependencies and recovery]
- **Dependencies and integration:** [TODO: other FEAT IDs, external contracts, shared components and known constraints]
- **Acceptance and exclusions:** [TODO: observable outcomes, important boundaries and what is deliberately deferred]
- **Implementation evidence:** [TODO: existing paths and tests when observed; proposed paths must be labeled proposed]

### Technical stack and architecture decisions

Document the actual stack at the level needed to implement and maintain the project. Include applicable frontend, backend, languages/runtimes, database/storage, API contracts, authentication/authorization, background jobs, external services, infrastructure and testing layers. For each applicable layer, record the selected technology and why it fits. An absent layer needs only a short observed reason; do not add technology to fill a row.

| Layer / responsibility | Technology and version | Decision status / rationale | Manifest, lockfile or configuration evidence | Integration / constraints | Owning role |
|---|---|---|---|---|---|
| [TODO: applicable layer] | [TODO: configured version constraint; installed version only if verified] | [TODO: observed/decided/proposed; source and tradeoff] | [TODO: relative paths] | [TODO: consumers, compatibility and limits] | [TODO] |

- **System structure and data flow:** [TODO: main components, entry points, trust boundaries and request/event flow; link ARCHITECTURE.md for file navigation]
- **Data model and lifecycle:** [TODO: key entities, relationships, ownership, retention and deletion requirements; link canonical schema]
- **API and integration contracts:** [TODO: canonical contract location, producers/consumers, authentication, errors and version compatibility]
- **Quality requirements:** [TODO: applicable accessibility, performance, reliability, localization, security and observability expectations with measurable criteria]
- **Technical constraints and debt:** [TODO: existing limitations, accepted tradeoffs, compatibility requirements and resolution triggers]
- **Decision record links:** [TODO: accepted stack/architecture decisions, dates/revisions and unresolved alternatives; no implied approval]

### Tools and working environment

Use the adoption fields above as the canonical path/command inventory. Add tool purposes and usage here without duplicating those entries. Cover applicable package management, local services, development, formatting/linting, type checking, tests, builds, CI, debugging and delivery tools.

| Tool / service | Purpose and when used | Version / configuration evidence | Setup and command reference | Side effects / access boundary | Verification status |
|---|---|---|---|---|---|
| [TODO] | [TODO: actual use] | [TODO: relative paths or requirement source] | [TODO: link command inventory or canonical setup instructions] | [TODO: local files, external service, safe data requirements; never credentials] | [TODO: configured only or actual check/result reference] |

- **Local setup:** [TODO: ordered prerequisites, configuration variable names, safe sample data, service startup and common recovery; reference existing instructions]
- **Environment boundaries:** [TODO: development/test/staging/production distinctions and separately authorized operations]
- **Verification strategy:** [TODO: suitable checks for each layer, fixture/mocking limits and how results are recorded; preserve AGENTS.md risk classification]
- **Delivery and operation:** [TODO: build artifacts, release procedure, monitoring ownership and rollback reference; execution needs its own authorization where applicable]

### Implementation plan by phases

Use stable PHASE IDs, explicit feature assignments and dependency order. Define phases around usable outcomes rather than arbitrary file groups. Add only phases justified by actual scope; discovery, foundation, feature delivery, integration and release are possible categories, not mandatory work or an approved sequence. Clearly distinguish planned scope from verified delivery. Phase status summarizes project progress; task records remain canonical for execution and approval.

| Phase ID / title | Outcome / linked goals | Included FEAT IDs and scope | Prerequisites / predecessor phases | Owner | Status / linked task plans | Exit evidence |
|---|---|---|---|---|---|---|
| [PHASE-01](#phase-01) / [TODO] | [TODO: usable outcome, GOAL IDs] | [TODO: feature IDs and bounded deliverables] | [TODO: decisions, dependencies and readiness] | [TODO] | [TODO: proposed/planned/in progress/blocked/complete/deferred; links] | [TODO: measurable exit criteria and result references] |

#### PHASE-01

Title: [TODO: phase title]. Add a matching heading and roadmap link for each phase.

1. **Goal and scope:** [TODO: expected usable result, linked goals/features and exclusions]
2. **Entry criteria:** [TODO: required decisions, earlier phase evidence, stable contracts and environment readiness]
3. **Implementation sequence:** [TODO: ordered feature slices, contract/data/UI dependencies, integration points and handoffs; link task plans for exact files/owners]
4. **Reuse and affected areas:** [TODO: relevant existing modules/components/services, architecture references and necessary extensions; confirm through inspection before changes]
5. **Verification and acceptance:** [TODO: observable success/failure/boundary outcomes and appropriate checks; each task selects direct or test-first under AGENTS.md]
6. **Data and rollout considerations:** [TODO: affected schema/data, compatibility, recovery and release boundaries when applicable; omit irrelevant concerns with a brief reason]
7. **Dependencies, risks and open decisions:** [TODO: impact, owner, mitigation or resolution, and work blocked]
8. **Exit criteria and handoff:** [TODO: required acceptance, review, documentation, evidence and inputs for the next phase]
9. **Progress and next action:** [TODO: linked active tasks, actual completed outcomes, remaining work, blocker and precise next action]
10. **Planning assumptions:** [TODO: estimates/capacity/dates only when supported; label uncertainty and decision source]

Repeat this detail for subsequent phases. Split a phase into coherent implementation steps in task plans; one phase is not blanket approval for every step. A plan or roadmap does not establish that code exists, checks passed or release actions are authorized.

### Using this blueprint during implementation

Before planning, starting, or resuming a phase, use the [reading index](#reading-index) and shared [phase procedure](tasks/README.md#plan-start-or-resume-an-implementation-phase).

## Context maintenance

Keep the project definition, goals, feature catalogue, stack/tools and phased roadmap current here; link detailed canonical specifications instead of duplicating them. Keep concrete ownership paths here and navigation details in the map. Record task-specific decisions, cases, approvals and execution evidence in the active plan. Update only affected project/phase facts when decisions or implementation change. Never place secrets, real credentials, private customer data, or environment access tokens in these documents.
