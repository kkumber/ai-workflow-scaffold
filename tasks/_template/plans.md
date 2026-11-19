# [TODO: TASK-NNN short title]

Reusable form, not an active or approved task. Select compact direct, short or expanded; remove unused form instructions. Example IDs are not evidence. All forms follow [AGENTS.md](../../AGENTS.md), especially [risk/verification](../../AGENTS.md#classify-the-change-and-select-verification), the [test-first cycle](../../AGENTS.md#test-first-cycle-repeat-for-each-coherent-step) and [record/reporting rules](../../AGENTS.md#communication-and-completion-report).

## Compact direct work

For a small bounded direct change, one entry in an existing relevant plan or a new plans.md is sufficient; separate todo/done are optional. Fill the first two bullets before editing, then add actual evidence/status. Expand only for a real dependency or risk; use the test-first forms if reclassified.

- Goal / authorization / workflow: [TODO: requested outcome, direct risk rationale and one owner]
- Scope / approach / selected verification: [TODO: exact affected files/actions, relevant dependencies, observable acceptance and focused check/expected outcome; if phased: PROJECT.md section/phase links, FEAT/GOAL IDs and prerequisite evidence]
- Evidence / review / limits: [TODO: actual command or reproducible inspection, result and review attribution; material limits only]
- Status / next action: [TODO: actual stage; unfinished action or done]

## Short form: small, bounded tasks

Retain this section and remove unused expanded form instructions when copying. Expand a concern when it affects correctness, contracts, security, migration/concurrency, recovery or rollout. Do not hide an unresolved requirement in a short record.

- Task/status/owner/mode/revision/active step: [TODO; disclose self-review]
- Workflow/risk rationale and selected checks: [TODO: direct low-risk or test-first; justify from behavior/dependencies, record focused checks and escalation triggers]
- Requirement/user decision and project reference: [TODO: link PROJECT.md setup/sections; if phased: PHASE/FEAT/GOAL IDs and prerequisite evidence; follow the shared phase procedure without duplicating requirements]
- Observed behavior → expected outcome; scope and material decisions: [TODO: evidence and reason]
- Exact existing/proposed files, actions, purposes and one owner per shared file: [TODO: compact inventory]
- STEP-01 / AC-01: [TODO: ordered actions, observable criterion, basis and dependencies]
- Relevant contracts/data flow/risks: [TODO: concrete interfaces, boundaries and recovery if affected; otherwise one concise scope statement]

| Case / AC / kind / level | Goal and requirement basis | Given → When → Then | Check/test location; initial expectation if test-first; mocks/limits |
|---|---|---|---|
| TC-01 / AC-01 / [TODO] | [TODO] | [TODO] | [TODO] |

| Case / initial or final | Exact command/procedure and working directory | Actual result/classification/counts; meaningful failure or limit |
|---|---|---|
| [TODO] | [TODO] | Not run |

- Check/review suitability: [TODO: selected workflow/revision/mode, actual findings/resolutions; test-first includes test-quality review, direct work reviews meaningful focused coverage]
- Checkpoint: [TODO: required for test-first; summary, evidence references and explicit approval question. Direct work: no separate checkpoint, state basis once]
- User authorization/applicable approval: [TODO: requested scope for direct work; actual decision/revision for test-first, pending until reply. Reclassify material discoveries]
- Final review/acceptance: [TODO: mode, findings/dispositions, AC-to-evidence mapping, document/map changes and remaining limits; remove confirmed task-owned temporary artifacts under AGENTS.md, retain required evidence]
- Resume: [TODO: last valid stage, approval applicability, blocker and precise next action; record changed facts only]

Keep results here; todo/done link them under the root record/reporting rules.

## Expanded form

Use the following sections instead of the short form when the task warrants their detail. Mark an unaffected concern once with a reason rather than filling repetitive Not applicable fields.

## Task record

- Task ID/title: [TODO: unique ID and title]
- Status: planned
- Owner: [TODO: orchestrator]
- Execution mode: [TODO: delegated or single-agent role phases; disclose self-review]
- Workflow/risk rationale: [TODO: direct low-risk or test-first, behavior/dependency consequences; select per coherent step if mixed]
- Selected verification and expansion triggers: [TODO: smallest meaningful checks; justify expensive checks only when relevant]
- Requirements source: [TODO: canonical requirement references and user decisions]
- Plan revision: [TODO: simple revision label, e.g. R1; increment on material changes]
- Active step: [TODO: STEP ID]
- Project setup reference: [PROJECT.md](../../PROJECT.md), including target identity, setup status, and relevant unresolved bindings. Do not duplicate setup state here. Complete the root scoped orientation and applicable first-use setup before application work; this task may document setup itself when that is the requested work.

- Phase guidance reference: [TODO for phased implementation: PROJECT.md section/phase links, FEAT/GOAL IDs and prerequisite evidence; follow the shared phase procedure.]

## Objective, current behavior, and scope

- Goal and observable outcome: [TODO]
- Current behavior: [TODO: inspected file/symbol and evidence; distinguish unknowns]
- Proposed behavior: [TODO]
- In scope: [TODO]
- Out of scope: [TODO]
- Decisions and reasons: [TODO: separate user decisions from implementation choices]
- Assumptions: [TODO: basis and impact]
- Unresolved decisions: [TODO: question, affected work, owner; resolve before dependent work]

## Files and ownership

List exact files, not directory substitutes. Label proposed files and names. Include tests and coordination records. Assign each shared file exactly one owner.

| Path | Existing/proposed | Add/modify/delete | Owner | Purpose/change | Dependency |
|---|---|---|---|---|---|
| [TODO: exact path] | [TODO] | [TODO] | [TODO] | [TODO] | [TODO] |

## Interfaces and data flow

[TODO: actual/proposed entry points and contracts, inputs, authorization/validation, transformations, persistence/effects, consumers, outputs/errors; relevant UI states. Describe the document workflow for governance tasks. Link stable requirements rather than duplicate them.]

Schema, existing data, migrations, concurrency, recovery, and rollout: [TODO: expand concrete details only when affected; separate creating files from executing operations. Otherwise give a reason for Not applicable.]

## Steps, dependencies, and acceptance criteria

Repeat rows as needed. Each coherent step has an explicit workflow classification; only test-first steps require a test-first checkpoint.

| Step | Goal / ordered implementation actions | Owner | Prerequisites / handoff | Criteria |
|---|---|---|---|---|
| STEP-01 | [TODO: concrete actions; after approval when test-first] | [TODO] | [TODO: stable interfaces, earlier steps] | AC-01 |

| Criterion | Observable requirement | Source / approved decision |
|---|---|---|
| AC-01 | [TODO: externally assessable outcome] | [TODO] |

## Verification cases: tests-first when required

Use the root test-definition and verification policy. Include only relevant cases; for manual checks give reproducible actions/expected results and explain suitability.

### TC-01

- Step / criterion: STEP-01 / AC-01
- Kind: [TODO: new behavior, regression, or existing behavior]
- Goal: [TODO: what this case establishes]
- Given: [TODO: starting state, safe fixtures, inputs]
- When: [TODO: action]
- Then: [TODO: observable expected result]
- Basis: [TODO: precise requirement or user decision]
- Test file/location: [TODO: exact existing or proposed file; procedure location for manual checks]
- Level: [TODO: unit, integration, component, end-to-end, or manual/direct inspection]
- Initial expectation: [TODO for test-first: pass/fail and intended reason; direct work need not invent a failing baseline]
- Mocks/limits: [TODO: contract assumptions and behavior not established]

## Commands and evidence

Only fill actual results after running checks. Record working directory, command, relevant test names, counts when available, and meaningful failure excerpts without secrets. For direct inspection, record the exact procedure instead of inventing a command.

| Step / case | Phase: initial or final | Command/procedure and working directory | Actual result | Failure classification / reason | Evidence limits |
|---|---|---|---|---|---|
| [TODO] | [TODO] | [TODO: established command] | Not run | [TODO: fill only after execution] | [TODO] |

Classify initial results using [the root categories](../../AGENTS.md#2-run-and-classify-initial-results), distinguishing a missing interface from behavior reached through it.

Focused regression strategy: [TODO: checks justified by risk].
Skipped checks: [TODO: each reason; record explicit user acceptance if required verification is reduced].

## Test-quality review (test-first steps)

- Step and case revision reviewed: [TODO]
- Reviewer / mode: [TODO: independent or self-review]
- Requirement/expectation alignment: [TODO]
- Assertion and mock quality / meaningful failure reason: [TODO]
- Missing cases and unsupported assumptions: [TODO]
- Findings, owners, and resolutions: [TODO: do not claim review before it occurs]

## User checkpoint: test-first steps only

- Step / plan revision / case IDs: [TODO]
- Status: [TODO: not presented, awaiting user approval, approved, changes requested]
- Goal and expected behavior: [TODO]
- Cases: [TODO: reference matrix IDs; chat summarizes relevant input/action/outcome groups and significant boundaries]
- Initial evidence: [TODO: reference command/result rows; summarize failure meaning]
- Coverage/review: [TODO: reference limits and test-quality review above]
- Implementation scope: [TODO: reference exact files/step above]
- Approval question: Do you approve this step's expected behavior, test cases, and planned implementation?
- User decision: [TODO: pending until an actual reply; accurate decision or message reference, no invented quote/time]
- Approved scope/revision: [TODO: exact step and expectation revision; never infer blanket approval]
- Feedback and changes since checkpoint: [TODO: renew checkpoint if material]

For test-first steps, save evidence, update todo.md and [wait for explicit step approval](../../AGENTS.md#4-report-to-the-user-and-wait). Disclose documentation checks possible only after writing.

## Post-implementation review and acceptance

- Final evidence: [TODO: link rows above; no duplicate test counts]
- Changed files: [TODO: update canonical inventory above with actual purposes]
- Review mode/findings/dispositions: [TODO]
- Criterion-to-result mapping: [TODO: each AC to evidence or explicit remaining limit]
- Map/document updates: [TODO]
- Remaining work and risks: [TODO]

Apply root [closure conditions](../../AGENTS.md#6-verify-review-and-close) before moving completed IDs to done.md. Keep cases/results/decisions here; todo/done reference them. Omit unaffected subsections with a reason.

## Resume and recovery

- Last valid stage / active step: [TODO]
- Current approval applicability: [TODO]
- Blocker / dependency / affected cases: [TODO or None]
- Precise next action: [TODO]
- Material discoveries and plan changes: [TODO]
- Recovery considerations / unapplied operations: [TODO or Not applicable with reason]
