# [TODO: TASK-NNN short title]

This is a reusable form, not an active or approved task. Copy it using [the task guide](../README.md). Example STEP/AC/TC IDs are placeholders, not evidence. Replace all relevant `[TODO: ...]` fields before execution; use Not applicable with a reason for unaffected sections.

## Task record

- Task ID/title: [TODO: unique ID and title]
- Status: planned
- Owner: [TODO: orchestrator]
- Execution mode: [TODO: delegated or single-agent role phases; disclose self-review]
- Requirements source: [TODO: canonical requirement references and user decisions]
- Plan revision: [TODO: simple revision label, e.g. R1; increment on material changes]
- Active step: [TODO: STEP ID]
- Project setup reference: [PROJECT.md](../../PROJECT.md), including target identity, setup status, and relevant unresolved bindings. Do not duplicate setup state here. Complete the root Markdown orientation and applicable first-use setup before application work; this task may document setup itself when that is the requested work.

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

Repeat the step and criterion rows as needed. Each step is one coherent behavior suitable for its own test-first checkpoint.

| Step | Goal / ordered implementation actions | Owner | Prerequisites / handoff | Criteria |
|---|---|---|---|---|
| STEP-01 | [TODO: concrete actions after approval] | [TODO] | [TODO: stable interfaces, earlier steps] | AC-01 |

| Criterion | Observable requirement | Source / approved decision |
|---|---|---|
| AC-01 | [TODO: externally assessable outcome] | [TODO] |

## Test matrix: before application changes

Expectations originate from requirements, not imagined implementation. Include only relevant cases. For manual cases, give reproducible steps and explain why that method is appropriate or record user acceptance of reduced automation.

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
- Initial expectation: [TODO: pass/fail and intended reason; not yet an actual result]
- Mocks/limits: [TODO: contract assumptions and behavior not established]

## Commands and evidence

Only fill actual results after running checks. Record working directory, command, relevant test names, counts when available, and meaningful failure excerpts without secrets. For direct inspection, record the exact procedure instead of inventing a command.

| Step / case | Phase: initial or final | Command/procedure and working directory | Actual result | Failure classification / reason | Evidence limits |
|---|---|---|---|---|---|
| [TODO] | [TODO] | [TODO: established command] | Not run | [TODO: fill only after execution] | [TODO] |

Initial result classifications: expected behavioral failure; existing-behavior pass; setup/environment failure; test definition/syntax failure; unrelated pre-existing failure; not run. A missing proposed interface must be distinguished from a behavioral assertion reached through it.

Focused regression strategy: [TODO: checks justified by risk].
Skipped checks: [TODO: each reason; record explicit user acceptance if required verification is reduced].

## Test-quality review

- Step and case revision reviewed: [TODO]
- Reviewer / mode: [TODO: independent or self-review]
- Requirement/expectation alignment: [TODO]
- Assertion and mock quality / meaningful failure reason: [TODO]
- Missing cases and unsupported assumptions: [TODO]
- Findings, owners, and resolutions: [TODO: do not claim review before it occurs]

## User checkpoint: repeat for each step

- Step / plan revision / case IDs: [TODO]
- Status: [TODO: not presented, awaiting user approval, approved, changes requested]
- Goal and expected behavior: [TODO]
- Cases, inputs/actions/expected results: [TODO: refer to matrix; chat report must stand alone]
- Actual initial results and failure meaning: [TODO]
- Coverage limits, blocked checks, and review findings/resolutions: [TODO]
- Planned application files and changes: [TODO]
- Approval question: Do you approve this step's expected behavior, test cases, and planned implementation?
- User decision: [TODO: pending until an actual reply; accurate decision or message reference, no invented quote/time]
- Approved scope/revision: [TODO: exact step and expectation revision; never infer blanket approval]
- Feedback and changes since checkpoint: [TODO: renew checkpoint if material]

Save evidence, update todo.md, and pause application changes while awaiting the user's reply. For documentation, disclose which checks are possible only after writing.

## Post-implementation review and acceptance

- Final evidence: [TODO: link rows above; no duplicate test counts]
- Changed files: [TODO: actual additions/modifications/deletions and purposes]
- Review mode/findings/dispositions: [TODO]
- Criterion-to-result mapping: [TODO: each AC to evidence or explicit remaining limit]
- Map/document updates: [TODO]
- Remaining work and risks: [TODO]

Only move entries to done.md when the applicable approval, implementation, verification, review, and documentation conditions are satisfied. No blocking finding may remain open. Tests support covered behavior; they do not prove all requirements correct.

## Resume and recovery

- Last valid stage / active step: [TODO]
- Current approval applicability: [TODO]
- Blocker / dependency / affected cases: [TODO or None]
- Precise next action: [TODO]
- Material discoveries and plan changes: [TODO]
- Recovery considerations / unapplied operations: [TODO or Not applicable with reason]
