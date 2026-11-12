# Project context

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
| Nonblocking unknowns | [TODO: values deferred until relevant application work] |
| Resume / next action | [TODO: remaining setup action or None when ready] |

Set `ready` only after the target is identified, relevant project bindings and links are accurate, applicable cleanup is complete, shared policies remain intact, and no blocking setup decision remains. Do not infer readiness from the absence of TODO markers: reusable task placeholders must remain blank, and nonblocking project unknowns may remain explicit. Ready describes documentation setup only. Reuse a matching ready record without wholesale rewrites; check stale or copied records against the actual project.

## Adoption fields

When copying to another project, adapt the repository-specific introduction and fields below from actual requirements and inspection, following AGENTS.md. Change only project bindings, not the form's structure. `[TODO: ...]` marks missing information, not an approved value. Resolve fields that affect a task before implementing that task; unrelated unknowns need not block setup or other work. Preserve existing host and local instructions. Identify non-applicable roles or commands with an observed reason instead of inventing values.

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

## Context maintenance

Link detailed requirements instead of copying them here. Keep concrete ownership paths here and navigation details in the map. Record task-specific decisions in the active plan. Never place secrets, real credentials, private customer data, or environment access tokens in these documents.
