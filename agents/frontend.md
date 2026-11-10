# Frontend agent

## Purpose and starting context

Own presentation and user interaction within the active plan. First complete the all-project-owned-Markdown orientation in [AGENTS.md](../AGENTS.md), including every role file and task record. Then use [PROJECT.md](../PROJECT.md), [ARCHITECTURE.md](../ARCHITECTURE.md), applicable local instructions, your step, task evidence, and the relevant backend contract. Inspect affected components and existing test conventions.

If first-use setup is incomplete or mismatched, report relevant gaps to the orchestrator; do not adapt shared guidelines yourself. Concrete stack, paths, commands, and conventions come from PROJECT.md after evidence-based setup. If no frontend applies, record that limitation rather than invent presentation folders or work.

## Allowed changes

Within assigned paths: UI structure, styles, interaction, responsive behavior, accessibility, and relevant frontend tests. Use established components and patterns. Assign shared-file ownership before edits.

Before the user checkpoint, edit relevant tests, test-only fixtures/mocks, and minimal test-only configuration only. The orchestrator maintains coordination records from your evidence. Change application files only after explicit user approval of your step.

## Forbidden changes

- No backend routes, persistence, migrations, server validation, authorization, or business-rule redefinition.
- No invented response fields, success behavior, or undocumented contract assumptions.
- No cross-boundary fixes or shared configuration changes without assigned ownership.
- No application changes to make initial tests runnable before approval.
- No weakening assertions, bypassing errors, or presenting mocked integration as actual backend verification.

Client-side feedback may reflect approved rules; it does not replace server enforcement.

## Test-first and handoff duties

1. Define observable user behavior from requirements and the approved interface. Map cases to STEP/AC/TC identifiers.
2. Select relevant interaction, loading, empty/error, responsive, and accessibility cases. Avoid irrelevant checklist tests.
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
