# Using this workflow

## Adopt it in another project

1. Read the project's existing instructions and all project-owned Markdown guidelines first, following [AGENTS.md](../AGENTS.md). Exclude dependency/vendor/generated copies, caches, and repository internals; read a dependency-installed scaffold's own supplied guidelines when they are the explicit setup reference. Merge the shared root rules; do not blindly replace established instructions or claim to override the host.
2. Copy the root workflow files, the [role files](../agents/backend.md), this guide, and the `_template` folder. Do not copy completed task history as if it belonged to the new project. In the copied architecture map, remove bootstrap history entries that were not copied.
3. Let the orchestrator follow the first-use protocol in AGENTS.md. Adapt the current-repository wording and fields in [PROJECT.md](../PROJECT.md) from actual requirements, manifests, commands, and ownership paths. Track `template → in progress → ready` in its setup record. Preserve the document's sections and common policies; unknown values remain explicit and block only dependent work.
4. Adapt the project-specific map entries in [ARCHITECTURE.md](../ARCHITECTURE.md) to inspected structure. Keep its sections and reusable workflow entries that were copied. Add meaningful application/test anchors, shared contracts, commands, and generated paths without enumerating the whole codebase. Remove live source-history references whose files were not copied.
5. Select supported delegated agents or declared single-agent role phases. Markdown role files describe responsibilities; they do not register executable agents or guarantee delegation. Do not generate tool-specific configuration without a separate request and verified tool requirements.

Concrete application path ownership belongs in PROJECT.md and the active plan, not invented framework-specific paths in role instructions.

## First use after installation or copying

The scaffold is distributed as `ai-workflow-scaffold`. See the root [README.md](../README.md) for npx setup/update/resolve commands and optional npm install/manual-copy. First initialization copies missing reusable documents, preserves existing files, and records known/unknown upstream baselines. Later tracked runs update unmodified files and cleanly merge separate changes; overlapping edits or unknown originals produce staged incoming files for explicit manual integration and resolution. Package installation alone does not initialize root guidance or make a host read it. Keep the receiving manifest, omit source history/CLI/lib/test entries from its map, and adapt the existing root README from actual evidence while preserving project content and casing. Multiple root README variants reject as ambiguous.

Once the host reads the project-owned AGENTS.md, its first-use protocol directs the orchestrator to inspect and adapt existing files. Preserve reusable sections and change project-specific wording/entries. Its final cleanup step removes obsolete setup-only sections, examples, and proven disposable scaffold artifacts after inspecting contents/references and recording exact removals in PROJECT.md. Remove completed adoption tutorials from this guide while retaining its task creation, approval, ownership, completion, and resume instructions. Keep tasks/_template/ and the receiving project's real task records. Repair links and verify cleanup before ready. Do not rewrite common constraints, loosen approval gates, fill future forms with fictional data, or replace the user's rules. Retain these reusable setup instructions when maintaining the scaffold source itself.

The npm package excludes this source repository's task history entirely. From tasks, its explicit payload contains only this guide and _template/*.md. The CLI uses the same restricted reusable task paths and never copies source TASK-* folders. Exclusion from distribution is not deletion: maintenance records remain in the source checkout.

Preserve `.ai-workflow-scaffold/` tracking and pending incoming review files while managed updates are used; they are active state, not completed setup artifacts. Commit the state with project guidance according to project conventions. Keep incoming copies unedited and resolve conflicts using the reported canonical document path after manually reviewing the project file. Legacy customizations without known originals require one-time manual integration. Tracked updates preserve local deletions, or stage a conflict if upstream changed the deleted file; they do not automatically reverse cleanup. Review clean text merges for project meaning and retain a concise update procedure after removing obsolete adoption tutorials.

The setup record in PROJECT.md is the single source for setup status and inspected evidence. A blank project may have accurate documentation with nonblocking unknown stack/layout fields; do not select a framework just to complete setup. An ambiguous multi-project target or conflicting requirement must be resolved before the affected edits. Missing/partial records resume setup; a matching `ready` record stays unchanged unless bindings change. A copied ready record must be checked against the receiving project before reuse.

This narrow orchestrator-only setup is permitted documentation initialization, followed by direct path/link/consistency checks and a user report. It does not implement features or replace the later test-first application checkpoint. Reviewers remain read-only and report setup gaps. Maintaining this scaffold source keeps its status `template` and its reusable forms unfilled.

## Start one task

Choose an unused task ID and short descriptive folder name, such as `tasks/TASK-NNN-short-description/`. Inspect the receiving project's existing ledger before assigning an ID; source-repository task numbers are not reserved in another project. Source history in this repository documents prior maintenance, not new-project requirements.

1. Create the task folder and copy [plans.md](_template/plans.md) into it first.
2. Inspect the relevant requirements, source, and tests. Fill the goal, observed behavior, scope, exact files, owners, interfaces, ordered steps, and criteria. Label proposed paths accurately.
3. Define requirement-based test cases using stable STEP/AC/TC IDs. Split work into coherent behaviors with separately reviewable checkpoints.
4. Copy [todo.md](_template/todo.md), derive concrete pending actions from the plan, and copy [done.md](_template/done.md) without fabricating completed entries. Relative links among these three files remain valid in the task folder.
5. The copied plans.md introduction links to this guide using `../README.md`; this works for both `_template` and a sibling task folder. Replace form instructions and relevant placeholders as you populate the task.

For a planning-only request, stop after planning; do not change application files.

## Run each step

Follow the root [test-first cycle](../AGENTS.md): understand, plan, write tests, run tests, review test quality, report to the user, wait for approval, implement, verify, review, record completion.

Before approval, specialists may change only scoped tests, test-only support, and minimal existing test-system configuration; the orchestrator maintains task records. Meaningful application behavior remains unchanged. Classify initial failures honestly and repair test-only mistakes. A broken environment is not behavioral proof.

For material behavior changes, obtain independent test review when available. Present a professional checkpoint covering goal, expectations, cases, actual results, failure meaning, limits, review outcomes, and exact planned application changes. Save the report evidence and set `awaiting user approval` before asking for approval.

Pause affected and dependent application work until the user replies. An earlier feature request, silence, and elapsed time do not approve this checkpoint. Record the actual reply against the step and plan/case revision. User feedback that changes expectations requires updated tests, rerun evidence, and a renewed checkpoint.

After approval, implement simply, preserve the test expectations, rerun focused checks, and review requirements beyond test coverage. Fix findings through the owning role. Material scope/behavior/contract changes return to the checkpoint.

## Ownership, dependencies, and review

Backend owns application/server behavior; frontend owns presentation/interaction. Use [backend](../agents/backend.md), [frontend](../agents/frontend.md), and [reviewer](../agents/reviewer.md) boundaries. The orchestrator owns coordination records. Assign shared-file ownership explicitly, including manifests, lockfiles, shared types, and build configuration. Never edit the same file concurrently.

Stabilize backend contracts before dependent frontend implementation. Frontend tests may use clearly identified contract mocks but must disclose limits and complete actual integration checks when required. Missing contracts are blockers, not permission to invent behavior.

Reviewers remain read-only and return findings to the orchestrator. Owners fix findings. Record severity, location, impact, correction condition, and disposition. P0/P1/P2 findings block affected completion; P3 is advisory unless a requirement is violated. Re-review corrections. Single-agent role phases provide self-review, not independent review; declare the mode rather than switching silently.

## Track and finish

Use the same states throughout the records:

```text
planned → tests in progress → awaiting user approval
        → implementation in progress → in review → done
```

Test-quality review is part of `tests in progress`; `in review` means post-implementation review. Blocked/cancelled entries retain reasons, last valid stage, and next action or disposition of partial changes. Overall task status reflects the active step; the task is done only when all required criteria and review conditions are satisfied.

Move completed work entries, preserving IDs, from todo.md into done.md with changed-file purposes, approval reference, actual verification, review outcome, and limits. Leave pending/cancelled work visible in todo.md. Never rename the entire file after completing one entry. Do not count reruns as distinct tests.

The orchestrator's professional final report stands alone: completed behavior and decisions, individual added/modified/deleted files, relevant connections, actual evidence, review resolutions, skipped checks/reasons, and remaining work/risks. Use caveman fragments only for internal updates and handoffs, not user checkpoints or final reports.

## Missing infrastructure and documentation checks

Inspect existing test options before proposing a new framework. Report setup needs and resolve them separately; do not alter production code before approval to enable tests. Manual behavior verification needs explicit acceptance when replacing required automation. Define reproducible steps and limits, retaining the checkpoint.

For documentation/non-behavior deliverable changes, use direct checks instead of pointless application tests. Report what was inspected before editing and which checks can only run afterward. Obtain approval before deliverable edits unless the user directly requested those specific edits or the narrow first-use protocol applies. Task planning/evidence records remain allowed preparation without recursive gates. Never claim checks ran on nonexistent files. These documentation permissions do not approve future application steps or authorize rewriting unrelated policies.

## Resume after context loss

Complete the mandatory all-project-owned-Markdown orientation in AGENTS.md, then check PROJECT.md setup applicability and the active plan/records before inspecting exact affected source/tests. Confirm current step, last stage, next action, blocker, case revision, evidence, and approval applicability. Inspect relevant intervening changes before reusing stale evidence. Do not rerun matching completed setup or regenerate guidelines merely because context was lost. A material expectation change needs renewed approval. Do not replay unrelated chats or treat context loss as permission to skip the checkpoint.

## Maintain the map and evidence

Update architecture entries in the task that changes important file locations, responsibilities, contracts, entry points, or test commands. Keep project constraints in PROJECT.md, navigation in the map, task decisions in plans.md, active state in todo.md, and completion evidence in done.md. Do not add a separate approval service or test-report file.

Keep secrets and private data out of all records. Separate creating migration/deployment files from executing operations. Respect actual authorization and safe test environments. Tests support the covered cases; passing checks are not proof that every requirement is correct.
