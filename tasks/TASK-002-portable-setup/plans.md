# TASK-002: Review portability and add first-use setup

Status: done
Owner: orchestrator; documentation-only maintenance with targeted self-review.
Requirement: the user requested review of every Markdown file and first-use project adaptation that preserves existing document structure and changes project-specific wording.

## Objective and observations

All thirteen existing Markdown files were read. Existing rules contain no setup status, preserve source-specific references in live adoption instructions, disagree on initial versus narrow resume reading, and leave the boundaries of first-use edits undefined. No package.json or package installer was found by targeted manifest discovery. Do not claim npm distribution works.

Proposed behavior: read project-owned Markdown guidelines, detect incomplete or stale setup, inspect the receiving project's actual structure and manifests, and minimally bind existing documents to it. Keep safety, role boundaries, test-first approval, and blank task forms intact. Record evidence and setup state; do not repeatedly rewrite ready projects.

## Scope and authorization

This user request authorizes the specified documentation review and adaptation-rule edits. No application code, dependency installation, npm packaging, scripts shipped as workflow features, or runtime configuration is included. Preserve TASK-001 history. Scaffold-source setup stays template; do not pretend this source repository is an adopting application.

## Review findings to resolve

| ID | Severity | Issue | Resolution target |
|---|---|---|---|
| F-01 | P2 | No first-use trigger, setup evidence, or completion rule | Root setup protocol and PROJECT.md state |
| F-02 | P2 | Unbounded Markdown reading includes third-party/generated docs; role/resume lists disagree | Consistent all-project-owned reading rule |
| F-03 | P2 | Source-only references and reserved task ID hinder copying | Evidence-based map/context edits and receiving-ledger ID selection |
| F-04 | P2 | Setup auto-edits conflict with ordinary approval and read-only reviewer constraints | Narrow orchestrator-only setup exception, preserving application gate |
| F-05 | P2 | Package installation example has no implemented delivery path | State root integration prerequisite; no unsupported install command |
| F-06 | P2 | No limits for empty, monorepo, partially configured, or already-ready projects | Unknowns, root selection, resume, and repeat-run rules |

## File inventory and steps

All files are owned by the orchestrator. Modify AGENTS.md (setup/read rules), PROJECT.md (state/evidence), ARCHITECTURE.md (setup/map guidance and current task navigation), tasks/README.md (adoption/resume), agents/backend.md, agents/frontend.md, agents/reviewer.md (consistent startup and setup boundary), tasks/_template/plans.md (setup prerequisite), tasks/_template/todo.md (setup blocker), tasks/_template/done.md (configuration/evidence reference). Add this task's plans.md, todo.md, and done.md for scope, progress, and actual review evidence. No deletions or edits to TASK-001.

- STEP-01: Apply the reviewed documentation corrections and first-use protocol.
- STEP-02: Validate all Markdown links, setup state references, preserved guardrails, and static setup scenarios; close ledgers only with actual evidence.

AC-01: First use explicitly changes only evidence-supported project bindings while preserving sections and common policies.
AC-02: Setup has template/in progress/ready states, target identity, evidence, unknowns, and repeat-run rules.
AC-03: All startup/resume/role instructions agree on project-owned Markdown orientation, without treating history as current authority.
AC-04: Root integration after package installation is described honestly; no npm installer is claimed.
AC-05: Empty/ambiguous/ready/stale/copied projects have explicit handling; reviewers remain read-only and application approval remains mandatory.
AC-06: All sixteen planned Markdown files and their relative file links resolve; source history and task forms remain truthful.

## Verification cases and intended results

TC-01 / AC-06: after writing, use a temporary direct-validation helper to check nonempty exact file inventory and relative Markdown links. Record exact command/results in done.md; no application tests are appropriate.

TC-02 / AC-01–AC-05: static walkthrough of first copy, interrupted setup, repeat ready read, copied stale ready state, existing custom instructions, multiple roots, blank application, no test system, dependency-only installation, reviewer startup, preserved blank forms, and later application checkpoint. Each must have an explicit consistent outcome.

TC-03 / AC-03, AC-06: re-read changed guidance and inspect consistency, source-only history boundaries, role ownership, setup status, and placeholders. Resolve review findings through orchestrator edits. This is self-review, not independent agent execution.

## Interfaces, risks, and checkpoint

No runtime interfaces change. PROJECT.md stores setup state and evidence; AGENTS.md controls the setup action; all other live guidance references that protocol. Risk: setup could rewrite policies or fabricate project facts. Restrict edits to inspected bindings, preserve existing customizations, and block only dependent work on unresolved material details. Use relative project paths.

User authorization: direct request in this chat for these documentation changes; no fabricated prior test approval. No database/deployment actions apply. Actual verification and finding dispositions are in done.md. Next action: none for this documentation task. Package delivery remains a separate, unimplemented capability.
