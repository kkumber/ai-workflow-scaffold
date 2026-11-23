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
- Workflow/risk rationale and selected checks: [TODO: direct low-risk or test-first; justify from behavior/dependencies, record focused checks and escalation triggers; assess approval separately under the root policy]
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
- Checkpoint: [TODO: root approval-policy trigger and decision/evidence, or authorized scope and reason no separate checkpoint is required; tests-first alone does not require a pause]
- User authorization/applicable approval: [TODO: requested/agreed scope; for a required checkpoint, actual decision and covered outcome/steps/roles/case revision, pending until reply. Reclassify material discoveries]
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
- Workflow/risk rationale: [TODO: direct low-risk or test-first, behavior/dependency consequences; select per coherent step if mixed; separately record approval-policy trigger or basis to continue within authorized scope]
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

Repeat rows as needed. Each coherent step has an explicit verification classification and separate approval assessment. Group technical steps under coherent outcomes; one explicit approval may cover listed steps/roles when presented together under the root approval policy.

| Step | Goal / ordered implementation actions | Owner | Prerequisites / handoff | Criteria |
|---|---|---|---|---|
| STEP-01 | [TODO: concrete actions; after any required approval] | [TODO] | [TODO: stable interfaces, earlier steps] | AC-01 |

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

## User checkpoint: when required by the approval policy

- Approval assessment: [TODO: trigger under the root policy, or agreed scope and reason no checkpoint is required; if none, omit unused checkpoint fields and continue]
- Outcome / covered steps and roles / plan revision / case IDs: [TODO]
- Status: [TODO: not presented, awaiting user approval, approved, changes requested]
- Goal and expected behavior: [TODO]
- Cases: [TODO: reference matrix IDs; chat summarizes relevant input/action/outcome groups and significant boundaries]
- Initial evidence: [TODO: reference command/result rows; summarize failure meaning]
- Coverage/review: [TODO: reference limits and test-quality review above]
- Implementation scope: [TODO: reference exact files/step above]
- Approval question: Do you approve this outcome's expected behavior, test cases, and listed implementation steps and roles?
- User decision: [TODO: pending until an actual reply; accurate decision or message reference, no invented quote/time]
- Approved scope/revision: [TODO: exact outcome, steps, roles and expectation/case revision; never infer blanket approval]
- Feedback and changes since checkpoint: [TODO: renew checkpoint if material]

When a checkpoint is required and not already satisfied, save evidence, update pending state and [wait for explicit approval](../../AGENTS.md#4-report-to-the-user-and-wait). Otherwise proceed through testing, implementation and review within agreed scope. Disclose documentation checks possible only after writing.

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

## Modular project documents

Read only the required template section when authoring project specifications, features or phases. These are specification forms, not task execution records. AI setup creates the project-owned files; the initializer does not copy a prepopulated plans tree. Preserve existing canonical specifications and link them instead of creating duplicates.

Complete the following scaffold during adoption using user decisions, existing requirements and repository evidence. These fields describe the receiving project; they are intentionally unfilled in this reusable source. Give enough detail for a new contributor to understand what to build, why, for whom and in what order. Retain useful existing project documentation and link its canonical sections instead of copying them. A placeholder is an unknown, not a requirement or implementation permission. Label statements as observed, decided or proposed where the distinction matters; record evidence and decision sources. Do not invent a product, stack, feature or delivery commitment to complete the form.

## Project specification template

Copy the following detail fields into `plans/PROJECT-SPEC.md`, or use equivalent existing canonical specifications. Keep brief summaries and links in PROJECT.md; fix relative references for the destination.

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

Use PROJECT.md's adoption fields as the canonical path/command inventory. Add tool purposes and usage here without duplicating those entries. Cover applicable package management, local services, development, formatting/linting, type checking, tests, builds, CI, debugging and delivery tools.

| Tool / service | Purpose and when used | Version / configuration evidence | Setup and command reference | Side effects / access boundary | Verification status |
|---|---|---|---|---|---|
| [TODO] | [TODO: actual use] | [TODO: relative paths or requirement source] | [TODO: link command inventory or canonical setup instructions] | [TODO: local files, external service, safe data requirements; never credentials] | [TODO: configured only or actual check/result reference] |

- **Local setup:** [TODO: ordered prerequisites, configuration variable names, safe sample data, service startup and common recovery; reference existing instructions]
- **Environment boundaries:** [TODO: development/test/staging/production distinctions and separately authorized operations]
- **Verification strategy:** [TODO: suitable checks for each layer, fixture/mocking limits and how results are recorded; preserve AGENTS.md risk classification]
- **Delivery and operation:** [TODO: build artifacts, release procedure, monitoring ownership and rollback reference; execution needs its own authorization where applicable]

## Feature specification template

Create `plans/features/FEAT-NN-short-name.md` only for an agreed feature needing detailed specification. Catalogue/index entries remain in PROJECT.md; task cases and approvals remain in task plans.

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

## Phase specification template

Use stable PHASE IDs, explicit feature assignments and dependency order. Define phases around usable outcomes rather than arbitrary file groups. Add only phases justified by actual scope; discovery, foundation, feature delivery, integration and release are possible categories, not mandatory work or an approved sequence. Clearly distinguish planned scope from verified delivery. Phase status summarizes project progress; task records remain canonical for execution and approval.

Create `plans/phases/PHASE-NN-short-name.md` for each agreed phase, link it from PROJECT.md and fill the following fields from requirements/decisions. Keep stable IDs when titles change. Scope includes FEAT/GOAL references; a phase may link several task plans.

# PHASE-01 — [TODO: title]

Status: [TODO: proposed/planned/in progress/blocked/complete/deferred]. Link this file from the PROJECT.md roadmap.

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
