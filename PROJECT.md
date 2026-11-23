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

This repository supplies Codex-specific project guidance and standalone backend, frontend, and read-only reviewer configurations. Its users are project owners and Codex agents selecting risk-based implementation and focused verification: tests-first for major features, complex behavior, material flows and high-risk work, direct implementation for small low-risk changes. The [approval policy](AGENTS.md#decide-when-user-approval-is-required) separately determines checkpoints; tests-first alone does not pause agreed-scope work, while high-risk work requires explicit approval. The roles live in [.codex/agents/backend.toml](.codex/agents/backend.toml), [.codex/agents/frontend.toml](.codex/agents/frontend.toml), and [.codex/agents/reviewer.toml](.codex/agents/reviewer.toml); backend/frontend reasoning is medium and reviewer high. No role sets a model, so the user's Codex session/default model choice remains in control. This source repository's maintenance history is excluded from package and receiving-project copies.

This is a Codex workflow scaffold and its delivery tool, not a configured receiving application. It establishes no receiving-application stack, test platform, runtime API, database, or deployment target. Navigation is in [ARCHITECTURE.md](ARCHITECTURE.md); adoption instructions are in [tasks/README.md](tasks/README.md).

[package.json](package.json) defines `create-workflow-scaffold` version 0.4.0 (GitHub tag `v0.4.0`), prepared for the short `npx create-workflow-scaffold` / `npm create workflow-scaffold` commands after npm publication; GitHub installation remains available. Matching create-workflow-scaffold and compatibility ai-workflow-scaffold executable aliases both use [bin/ai-workflow-scaffold.cjs](bin/ai-workflow-scaffold.cjs), which initializes missing reusable guidance and tracking, then manages updates on reruns. Shared allowlist/path handling lives in [lib/scaffold-files.cjs](lib/scaffold-files.cjs); [lib/scaffold-updates.cjs](lib/scaffold-updates.cjs) owns state, merges, conflicts and resolution. [README.md](README.md) covers installation, publication status, legacy migration, updates and project-specific adaptation. Requirements: Node.js >=20, npm/npx, Git for GitHub fetching and two-sided text merges. `npm test` runs the setup, update and Codex-role suites with Node's built-in runner; it tests this tool, not the receiving application. Keep `.ai-workflow-scaffold/state.json` and pending review state while updates are used; package naming does not change that state directory. There are no install hooks or runtime dependencies. During adoption keep the receiving manifest/custom README and remove uncopied source-tool references. Distribution metadata establishes neither an application stack nor verified receiving-project commands; local verification does not establish registry availability.

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

Keep this file a concise overview and index. During setup, create linked project-owned documents using the [modular specification forms](tasks/_template/plans.md#modular-project-documents); reuse existing canonical specs. Do not invent features/phases or copy empty templates as completed plans. Apply the setup completion rule to every detail in the linked documents too.

### Project identity and purpose

[TODO: brief problem, solution, audience, scope and explicit exclusions; link the detailed specification in plans/PROJECT-SPEC.md or its existing equivalent.]

### Goals, objectives and success measures

[TODO: brief GOAL-ID outcomes and measurable targets, priority and completion conditions; link detailed rationale, baselines and measurement evidence in the specification.]

### Feature catalogue and behavior

| Feature / goals | Scope and priority | Phase | Status / evidence | Detailed specification / task links |
|---|---|---|---|---|
| [TODO: FEAT/GOAL IDs] | [TODO: included/deferred/excluded and reason] | [TODO: PHASE ID] | [TODO: actual status/evidence] | [TODO: link plans/features/FEAT-NN-name.md or existing spec, and relevant tasks] |

### Technical stack and architecture decisions

Use the adoption fields for stack/version bindings. [TODO: brief project-specific decisions, constraints and gotchas; link detailed layer choices, data model, contracts and quality requirements in the specification and navigation in ARCHITECTURE.md.]

### Tools and working environment

Use the adoption fields for canonical paths/commands. [TODO: link detailed tool purposes, setup, environment/access boundaries, verification and operation instructions in the specification or existing docs.]

### Implementation plan by phases

| Phase | Outcome / goals / features | Dependencies | Status / owner | Phase document / exit evidence |
|---|---|---|---|---|
| [TODO: PHASE ID/title] | [TODO: usable outcome, GOAL/FEAT IDs] | [TODO: prerequisite phases/decisions] | [TODO] | [TODO: link plans/phases/PHASE-NN-name.md and result evidence] |

Create one file per agreed phase; phase documents own detailed sequencing, entry/exit criteria, risks and handoffs. Keep this roadmap brief. No phase status substitutes for task approval or authorizes release operations.

### Using this blueprint during implementation

Before planning, starting, or resuming a phase, use the [reading index](#reading-index) and shared [phase procedure](tasks/README.md#plan-start-or-resume-an-implementation-phase). Read only the selected phase document and relevant linked specifications; reuse current context.

## Context maintenance

Keep brief project summaries, indexes, decisions/gotchas and concrete bindings here; detailed specifications live in linked plans/ documents or existing canonical docs. Keep navigation in ARCHITECTURE.md. Record task-specific decisions, cases, approvals and execution evidence in the active plan. Update only affected project/phase facts when decisions or implementation change. Never place secrets, real credentials, private customer data, or environment access tokens in these documents.
