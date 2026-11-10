# TASK-001: Create the reusable workflow

Status: done
Owner: orchestrator (coordination documents only)
Requirement source: the user's supplied “Reusable Agent Workflow with Test-First User Review” plan and explicit instruction to implement it.

## Objective and behavior

Create a portable Markdown workflow with role boundaries, readable code rules, task records, an architecture guide, and a test-first user checkpoint for each coherent feature step.

Current behavior: targeted reads found no root AGENTS.md, PROJECT.md, ARCHITECTURE.md, or tasks/README.md. Targeted tree checks found no agents/ or tasks/ directory. These observations do not assert that the entire repository is empty.

Proposed behavior: agents enter through AGENTS.md, use project and architecture context to find relevant files, execute a focused task plan, and obtain user approval of test evidence before changing application behavior.

## Scope and decisions

- Create documentation only. No application features, dependencies, executable agent configuration, test runner, migrations, or deployment.
- Use one checkpoint per coherent feature step; require an explicit user reply before its implementation.
- This bootstrap is authorized by the user's explicit instruction to implement the supplied documentation plan. Do not fabricate a separate prior test checkpoint or retroactively claim these documents were tested before they existed.
- Use direct document checks rather than artificial application tests. Checks requiring the new files run after creation.
- Perform orchestrator self-review for this documentation-only change; do not describe it as independent review.
- Preserve unrelated files. Do not infer framework choices or future application ownership paths.

## File inventory

All paths below are proposed additions, owned by the orchestrator; no modifications or deletions are planned.

| Path | Purpose |
|---|---|
| AGENTS.md | Shared instructions and orchestration |
| PROJECT.md | Project context and customization fields |
| ARCHITECTURE.md | Verified workflow map and navigation |
| agents/backend.md | Backend role and test duties |
| agents/frontend.md | Frontend role and contract boundaries |
| agents/reviewer.md | Read-only test and implementation review |
| tasks/README.md | Setup, lifecycle, and resume instructions |
| tasks/_template/plans.md | Canonical task and checkpoint form |
| tasks/_template/todo.md | Pending execution form |
| tasks/_template/done.md | Completion evidence form |
| tasks/TASK-001-bootstrap-workflow/plans.md | This bootstrap plan |
| tasks/TASK-001-bootstrap-workflow/todo.md | Bootstrap progress |
| tasks/TASK-001-bootstrap-workflow/done.md | Actual bootstrap completion evidence |

## Steps and acceptance criteria

- STEP-01: Create workflow and role documents, task forms, and usage guide; map their relationships.
- STEP-02: Validate the exact file set, relative links, placeholders, and workflow scenarios; fix inconsistencies and record evidence.

AC-01: All thirteen planned Markdown files exist with valid internal file references.
AC-02: The workflow requires tests, classified initial results, test-quality review, a professional user report, and explicit approval before each application implementation step.
AC-03: Role boundaries, ownership, checklist states, and approval renewal rules agree across files.
AC-04: Task forms cover requirements, cases, commands/results, user decisions, review, and resume context without fictional completion evidence.
AC-05: Architecture and project context distinguish verified workflow files from illustrative application paths and unfilled fields.
AC-06: Every scenario in the user's validation matrix has an explicit rule; no project-specific technology restriction is inherited.

## Verification plan

| Case | Criteria | Given / action / expected result | Method and initial expectation |
|---|---|---|---|
| TC-01 | AC-01 | Planned files absent; create documents; exact inventory and relative links resolve | Direct document validation after writing; initially unavailable, not a behavioral failing test |
| TC-02 | AC-02, AC-03, AC-06 | Read workflow and roles; walk all twelve user scenarios; each has a consistent outcome | Targeted self-review after writing |
| TC-03 | AC-04, AC-05 | Read forms and map; distinguish placeholders, example IDs, and actual evidence | Targeted self-review after writing |

Actual validation commands/results and scenario self-review are recorded in done.md. No application test command is established for this documentation template.

## Interfaces, risk, and recovery

No runtime interfaces change. AGENTS.md defines policy; role files specialize it; PROJECT.md supplies context; ARCHITECTURE.md supplies navigation; task files hold scoped requirements, state, and evidence. Risk: contradictory instructions or stale navigation. Mitigation: review cross-file references and scenario outcomes. No database or rollout action applies. Correct documents in place if a defect is found; no destructive recovery is necessary.

## Checkpoint and resume

User decision: explicitly requested implementation of the supplied documentation plan in this chat. This authorizes this bootstrap, not future application checkpoints. No separate test approval was claimed.

Next action: none for this completed bootstrap. Before using the template in an application project, customize PROJECT.md and the architecture map from that project's verified requirements and files. No unresolved user decision blocks this bootstrap.
