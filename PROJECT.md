# Project context

## Current template repository

This repository supplies portable Markdown instructions for an orchestrator, backend, frontend, and read-only reviewer. Its users are project owners and AI agents adopting a test-first approval workflow. The approved bootstrap requirements and evidence live in [TASK-001](tasks/TASK-001-bootstrap-workflow/plans.md).

This is a documentation template, not a configured application or test platform. No application stack, automated test runner, runtime API, database, or deployment target is established by these files. Navigation is in [ARCHITECTURE.md](ARCHITECTURE.md); adoption instructions are in [tasks/README.md](tasks/README.md).

The orchestrator owns these coordination documents. Backend/frontend application paths are not assigned here because no application paths have been verified. Do not infer them from example directories. The introduction above describes the scaffold source only; during adoption, change these specific paragraphs to describe the receiving project and remove the source-history link if its target was not copied. Keep the document structure.

## Workflow setup record

Workflow setup status: template

Allowed values: `template`, `in progress`, `ready`. This scaffold source intentionally remains `template`; maintaining it is not application adoption. In a receiving project, the orchestrator follows the first-use protocol in AGENTS.md and updates this record. Missing state or a mismatched target also requires setup inspection.

| Setup field | Value |
|---|---|
| Configured project identity | [TODO: receiving project's observed name/purpose and relative workspace target; avoid machine-specific absolute paths] |
| Setup owner | Orchestrator |
| Evidence inspected | [TODO: actual manifest, configuration, instruction, and entry-point paths with observations] |
| Markdown orientation | [TODO: project-owned files read; exclusions and any reading blockers] |
| Guideline files adapted | [TODO: exact paths and project-specific changes; preserve shared rules] |
| Verification performed | [TODO: actual path/link/consistency checks and results] |
| Commands discovered but not run | [TODO: distinguish configured commands from verified results] |
| Blocking setup decisions | [TODO: question, impact, owner, next action; None when resolved] |
| Nonblocking unknowns | [TODO: values deferred until relevant application work] |
| Resume / next action | [TODO: remaining setup action or None when ready] |

Set `ready` only after the target is identified, relevant project bindings and links are accurate, shared policies remain intact, and no blocking setup decision remains. Do not infer readiness from the absence of TODO markers: reusable task placeholders must remain blank, and nonblocking project unknowns may remain explicit. Ready describes documentation setup only. Reuse a matching ready record without wholesale rewrites; check stale or copied records against the actual project.

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
