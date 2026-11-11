# TASK-004: Preserve project customizations while updating the scaffold

## Task record

- Status: done
- Owner: orchestrator; backend specialist owns CLI/runtime modules and tests; independent read-only reviewer
- Requirement: user requested an update mechanism after learning rerunning npx only copies missing files. Preserve receiving-project customizations and the existing task-history exclusion and first-use cleanup rules.
- Revision: R1 / active step STEP-01
- Setup: [PROJECT.md](../../PROJECT.md); this is scaffold-source maintenance, so setup stays template. All twenty pre-existing project-owned Markdown files were previously read in full in this context; rediscovery found no new files before these records. Reuse unchanged orientation; relevant current source/tests were reread.

## Objective, observed behavior, and scope

The current bin/ai-workflow-scaffold.cjs has eleven explicitly allowed reusable documents and validates managed paths. It only accepts no arguments or --help, copies missing files exclusively, and preserves existing ordinary files/readme variants. There is no update state, saved baseline, merge, or conflict-resolution command. tests/scaffold.test.cjs exercises that contract; its exact-file assertion and help text will need explicit expectation revisions for added tracking metadata. Prior Windows file-symlink fixture limitation remains known; do not silently skip it or transfer a pass claim to new paths.

Implement managed document updates, not a generic package updater. Do not fetch remote content inside the CLI: npx supplies the selected GitHub revision. Continue excluding source TASK-* records from archive and consumer copies. No lifecycle hooks, npm dependencies, deployment, remote push, migration, application feature, forced overwrite, or automatic artifact deletion. A version pin intentionally selects that revision; package version and a content fingerprint identify the templates actually used, even when two commits share a version string.

## Decision and command contract

1. `npx github:kkumber/ai-workflow-scaffold` initializes tracking on first use; when valid tracking exists it performs the managed update. `... update` explicitly requests an update and requires tracking; without it, fail without writing and explain the one-time initialization path. `... --help` remains read-only; unsupported arguments fail without writes. `... resolve <relative-document-path>` acknowledges that a specific staged conflict has been manually reviewed/merged; it records the staged upstream baseline without replacing the project file.
2. `.ai-workflow-scaffold/state.json` stores schemaVersion 1, the selected package version/content fingerprint, and per-file source/destination identity, original upstream text or null, and any pending upstream text/identity. Only the eleven allowlisted source documents can be managed; the root README destination may use its actual casing. Store upstream templates, not copies of customized project content. Recommend committing state with project guidance; cleanup must retain it while managed updates are used.
3. First initialization copies missing docs as before, then records baselines for copied files and existing files exactly matching upstream. Preserve customized pre-existing files and mark their baseline unknown (null). Never invent their historical base. Existing README casing is retained. Multiple root README variants are ambiguous: reject without project writes rather than choosing one. Existing custom files are not rewritten during initialization.
4. For tracked files with a known baseline: if incoming equals baseline, preserve current project content including intentional deletion; if current equals baseline, apply incoming; if current equals incoming, just advance the baseline; otherwise use Git's native three-way text merge. Apply only a clean merge and advance that file's baseline. Compare normalized text for CRLF/LF-only differences while retaining the local newline style for a merged/updated existing document. Do not require Git for comparisons that do not need a merge.
5. On overlapping edits, unknown baseline, or a locally deleted file changed upstream, keep the destination exactly as it is and stage the latest upstream text under `.ai-workflow-scaffold/incoming/<source-path>`. Report the project and incoming paths and return exit code 2 while allowing independent clean file updates. Never write conflict markers into project files. Do not advance a conflicted file's baseline. Unchanged-upstream customizations and intentionally removed setup tutorials remain preserved; touched cleanup areas may require manual review.
6. `resolve <path>` requires an actual pending conflict, validates the staged incoming text against recorded pending content, preserves current destination contents (or its deliberate absence), and promotes only that staged upstream baseline. It must not silently acknowledge a newer package revision instead of the staged version. Subsequent update repeats use the acknowledged upstream base. Incoming files may remain as review artifacts until safely replaced; do not delete arbitrary project paths. Users edit project documents, not incoming templates. If an incoming artifact has been edited, preserve it and reject replacement with a clear message.
7. Legacy projects lacking state cannot have earlier customizations auto-merged safely. Normal initialization records unknown baselines without overwriting custom files. A subsequent update stages those upstream templates for one-time manual integration and `resolve`; future changes then use tracked merges. Missing legacy files are treated as missing setup files at initialization; document that users with intentional deletions should review initialization before running it. There is no guessed automatic migration from historical installed versions.
8. Treat state as untrusted: validate schema/types, identity/content fingerprints, complete allowlisted entries, relative paths, README aliases, and pending records. Reject invalid JSON, unsupported schema, traversal/unknown paths, missing tracked entries, directory obstructions, and symlink/junction destinations or state/incoming ancestors before changing project documents. Never follow a metadata symlink. Preflight all files before applying a run, including conflict artifacts that will be written. Reject multiple README variants. Preserve the existing path safeguards.
9. Use a short-lived exclusive lock within the validated metadata directory to reject overlapping updater runs. Release the lock on ordinary error/success; do not guess whether a crash-left lock is stale. Give a clear manual recovery explanation. Write state via an atomic temporary-file rename after document writes; keep baselines idempotent so a retry recognizes already-applied upstream content. Recheck planned live content before replacement to avoid overwriting an edit made during planning. No promise of a filesystem transaction or protection against hostile concurrent ancestor replacement; no force flag or automatic rollback is included.

### Exact proposed state interface

State is `{schemaVersion:1, package:{version,fingerprint}, files:[{sourcePath,destinationPath,upstreamText,upstreamIdentity,pending}]}`. There is exactly one file entry per allowlisted source document. `upstreamText` is the accepted upstream string or null for unknown legacy original; `upstreamIdentity` is `{version,fingerprint}` or null with an unknown original. `pending` is null or `{text,identity:{version,fingerprint}}` for staged upstream review. Top-level package identifies the selected run; per-file accepted/pending identities remain independent, because a run may update some files and leave others unresolved. Resolving under a newer CLI promotes the saved pending text/identity, never the currently executing package's template.

Top-level package fingerprint: SHA-256 of UTF-8 `JSON.stringify` of sorted `[sourcePath,normalizedText]` tuples for all eleven upstream documents. Each per-file upstreamIdentity/pending.identity fingerprint is SHA-256 of UTF-8 normalized text for that single document, so its stored content can be verified even when file baselines span different revisions. Validate per-file content/hash agreement; top-level aggregate is an identity label with format validation, not a reconstructible proof of historical package content. Normalize CRLF to LF only; do not trim whitespace or change EOF newlines. Transient exclusive lock path: `.ai-workflow-scaffold/update.lock`. Preserve state bytes on a no-change rerun (no volatile timestamps).

On an update, discover the single current root README filename case-insensitively. If its casing changed since initialization, use that existing alias, preserve its spelling, and update destinationPath rather than create a second README. No alias means the tracked README is locally absent; preserve its deletion under the normal comparison/conflict rules. Multiple aliases reject before project writes. The multiple-alias automated case may be explicitly not run when the fixture filesystem cannot represent both names (e.g. Windows case-insensitive directories); disclose that as no coverage at checkpoint, with static review only on this host. Deterministic simulation of an edit during merge planning is outside automated coverage; code review must inspect pre-write rechecks and report this limit, without injecting a test-only production seam or mocked merge result.

`resolve` accepts the canonical allowlisted source path (`README.md`, even when its destination is `readme.md`). Reports must name the actual destination and the exact canonical resolve command. An existing incoming artifact may be replaced only when its bytes match that file's saved pending text, or a retained artifact matching the last accepted upstream text after resolution. An edited/unrecognized artifact, including one present without state, is not trusted: preserve it and reject a planned replacement before any document writes, with recovery guidance. Initialization may leave unrelated metadata artifacts untouched but must not adopt them as saved pending content. This rule provides safe reuse of review artifacts without deleting them or adding another history store.

## Files and ownership

| Exact path | State/action | Owner | Purpose |
|---|---|---|---|
| bin/ai-workflow-scaffold.cjs | Existing/modify after checkpoint | Backend | Command routing and existing setup integration |
| lib/scaffold-files.cjs | Proposed/add after checkpoint | Backend | Shared allowlist/path inspection used by setup and updates; extract current helpers rather than duplicate them |
| lib/scaffold-updates.cjs | Proposed/add after checkpoint | Backend | Tracking, safe update planning, Git merge, conflict acknowledgment |
| tests/scaffold.test.cjs | Existing/test changes before checkpoint | Backend | Revise exact-file expectations for one tracking file; retain old safety assertions |
| tests/updates.test.cjs | Proposed/add before checkpoint | Backend | Real versioned-package fixtures, state/merge/conflict/safety tests |
| package.json | Existing/modify after checkpoint | Orchestrator | Version 0.2.0, include lib/*.cjs, test all tests/*.test.cjs; retain restricted task payload |
| README.md | Existing/modify after checkpoint | Orchestrator | Init/update/resolve commands, legacy migration, conflicts, commit pinning |
| AGENTS.md | Existing/modify after checkpoint | Orchestrator | Keep managed-update state through adoption cleanup |
| PROJECT.md | Existing/modify after checkpoint | Orchestrator | Actual tool entry/state/Git prerequisites, not receiving-app configuration |
| ARCHITECTURE.md | Existing/modify after checkpoint | Orchestrator | New responsibility/module/state and test navigation |
| tasks/README.md | Existing/modify after checkpoint | Orchestrator | Update workflow and preserving state during cleanup |
| tasks/TASK-004-managed-updates/plans.md | New/add now | Orchestrator | Canonical decisions, cases, checkpoint |
| tasks/TASK-004-managed-updates/todo.md | New/add now | Orchestrator | Pending stage and owners |
| tasks/TASK-004-managed-updates/done.md | New/add now | Orchestrator | Actual evidence; not fictional completion |

The two runtime modules have distinct existing responsibilities and shared helpers, not a generic abstraction framework. No dependency manifest or runtime edits are allowed before checkpoint approval. Source history stays repository-local and outside the package; do not add local-history links to reusable distributed docs.

## Interfaces and data flow

npx supplies a package -> read allowlisted upstream documents and package identity -> inspect project destinations and validated saved state -> classify per-file no-op, replace, clean merge, or conflict -> preflight planned writes -> apply clean results/stage upstream proposals -> atomically save per-file baselines -> release lock -> report created/preserved/updated/merged/conflicted paths and next action. resolve promotes the exact saved pending base after explicit acknowledgment. No network operations by runtime, no database/schema change except a versioned local JSON tracking format. Git `merge-file --stdout` computes from temporary files, without writing the receiving project or invoking a shell; use argument arrays, no custom merge algorithm or automatic ours/theirs resolution.

## Steps and acceptance criteria

STEP-01: prepare tests, run baseline, obtain independent test-quality review, present user checkpoint. STEP-02: after approval implement runtime/modules/metadata/docs, run focused checks and isolated packaged install/update, independent implementation review, close evidence.

| Criterion | Observable result | Basis |
|---|---|---|
| AC-01 | Init preserves existing content and records known/unknown upstream baselines; rerun selects updates | User's automatic-update request plus prior preservation contract |
| AC-02 | Upstream-only and non-overlapping changes apply while local customizations and newline style survive | User's requirement to preserve receiving-project changes |
| AC-03 | Conflicts/unknown bases/deleted-and-updated files stay untouched, with staged upstream and exit 2; resolve advances only reviewed pending base | No forced replacement or guessed original |
| AC-04 | Repeats are idempotent; resolved files support later updates; content identity detects same-version template changes | Repeated npx update scenario |
| AC-05 | Metadata/path/README/lock/input failures preserve project files and external targets | Existing installer safety and untrusted tracking input |
| AC-06 | Cleanup preserves tracking and local deletions; legacy process is truthful; source task history stays excluded | Earlier explicit cleanup and distribution requirements |
| AC-07 | Archive includes runtime modules/tests; real two-version packaged npx sequence works; docs/links and applicable tests verified with limits attributed | Actual usable GitHub-distributed CLI |

## Tests and verification before implementation

Backend owner must write explicit Given/When/Then cases with stable TC IDs in tests and send the complete case matrix to the orchestrator for this plan before checkpoint. Use Node's established built-in runner and real CLI subprocesses. Create isolated V1/V2/V3 package fixtures containing actual runtime code and controlled upstream documents/versions; change fixture text, not production interfaces. Call real Git for clean/conflict merges. No mocks of filesystem, merge results, state storage, or package identity. Cover baseline creation, unchanged repeats, upstream-only updates, clean two-sided edits, CRLF, same-version content changes, conflict markers excluded from project files, staged conflict resolution then another update, unknown legacy originals, unchanged-upstream customization/deletion, deleted-and-updated conflict, renamed README casing, multiple README rejection, malformed state/schema/path, linked metadata/incoming parents, obstructed destinations, pending-content tampering, held lock, missing Git when a merge is required, help/invalid args. Focused cases may combine related assertions; no arbitrary coverage targets or silent skips.

Initial expectation: new-behavior cases should fail for absent state/update/resolve behavior; classify failures that cannot reach later actions honestly. Existing safety cases may pass. Revising TC-04 to allow documented tracking metadata is a changed requirement, not permission to weaken overwrite/link safeguards. Fixture mistakes must be fixed before presenting checkpoint. Prior TC-13 Windows EPERM is an environment failure, not application evidence; report it separately without repeating unproductive permission retries unless the environment changes.

Planned commands: `node --test --test-reporter=dot tests/updates.test.cjs`, focused existing safety tests, later `npm test` and local archive/npx scenarios. Exact actual results belong below and in done.md after execution. No tests have been run for these proposed changes yet. Primary reference inspected: Git merge-file official documentation describes three-way merge, stdout mode, and conflict status; npm npx official documentation describes cache execution and versioned package specs. No claim Git merges arbitrary semantic changes correctly; tests cover defined text cases, conflicts require human review.

## Checkpoint and review

### R1 test matrix and initial results

Every TC-U case below is a new-behavior subprocess integration case in `tests/updates.test.cjs`; fixture source and versioned upstream documents are real local files, and production CLI code is copied unchanged into isolated V1/V2/V3 fixtures. Common action is init/update/resolve as listed. No mocked merge/filesystem/state behavior. Initial expectation is failure from missing tracking/commands, with safety cases possibly reaching their assertions. Goal is the observable outcome in Then; source is the cited AC and locked R1 contract.

| Case / criteria | Given | When | Then |
|---|---|---|---|
| TC-U01 / AC-01 | Missing, matching, and customized docs | Initialize | Eleven known/unknown bases and valid identities; local custom text not saved as base; no source history/manifest copies |
| TC-U02 / AC-01,04,06 | Tracked local edit and deleted guide; same upstream | Default and explicit rerun | Content/deletion/state byte-idempotent |
| TC-U03 / AC-02 | Untouched local; changed upstream | Default rerun | Apply new doc and advance baseline |
| TC-U04 / AC-02 | Distant local/upstream edits | Update | Merge both; save only upstream base |
| TC-U05 / AC-02 | CRLF local, upstream-only and two-sided changes | Update | Clean replacements/merges keep local CRLF |
| TC-U06 / AC-04 | Same package version, different template text | Update | Apply change and detect different content fingerprint |
| TC-U07 / AC-03,04 | Overlapping PROJECT edits plus clean README change | Update twice | Exit 2, original conflicting file intact, upstream staged, old file base retained, clean update applied, repeat deterministic |
| TC-U08 / AC-03,04 | V2 pending; manual merge; V3 runner | Resolve then update | Accept exact staged V2 and merge later V3 without losing manual edit |
| TC-U09 / AC-01,03 | Legacy custom file without original | Init/update/resolve | Unknown base, staged upstream, preserved content, explicit accepted base |
| TC-U10 / AC-03,06 | Locally deleted file changed upstream | Update/resolve/update | Stage proposal and keep intentional deletion |
| TC-U11 / AC-05 | No state, existing local doc | Explicit update | Clear initialization guidance; no writes |
| TC-U12 / AC-01,05 | Existing lowercase README | Init then update | Preserve actual casing and one root README |
| TC-U13 / AC-05 | Two root README case variants | Init | Reject ambiguity without writes; explicit not-run on incapable fixture FS |
| TC-U14 / AC-05 | Malformed state JSON | Update | Reject without project/external changes |
| TC-U15 / AC-05 | Unsupported schema | Update | Reject without writes |
| TC-U16 / AC-05 | Traversing source path | Update | Reject without project/external changes |
| TC-U17 / AC-05 | Traversing destination path | Update | Reject without project/external changes |
| TC-U18 / AC-05 | Unknown source path | Update | Reject without writes |
| TC-U19 / AC-05 | Missing managed entry | Update | Reject without writes |
| TC-U20 / AC-05 | Duplicate managed entry | Update | Reject without writes |
| TC-U21 / AC-05 | Invalid package fingerprint | Update | Reject without writes |
| TC-U22 / AC-05 | Metadata directory junction | Init | Reject; project and external target unchanged |
| TC-U23 / AC-05 | Incoming junction; conflict and clean update | Update | Reject all planned writes; external target untouched |
| TC-U24 / AC-05 | Directory obstructs tracked document | Update | Reject before independent clean writes |
| TC-U25 / AC-03,05 | User edited incoming review file | Resolve and later update | Reject acknowledgment/replacement; preserve content/state |
| TC-U26 / AC-05 | Existing exclusive lock | Update | Reject overlap, retain lock, explain recovery |
| TC-U27 / AC-02,05 | Merge required; Git absent from PATH | Update | Fail safely, no writes/baseline advance |
| TC-U28 / AC-02 | Upstream-only change; Git absent | Update | Apply without Git |
| TC-U29 / AC-05 | No pending conflict, or traversal arg | Resolve | Reject without writes |
| TC-U30 / AC-05 | Empty project | Help and invalid command | Explain update/resolve; no writes |
| TC-U31 / AC-05 | Base text/hash mismatch | Update | Reject state without writes |
| TC-U32 / AC-03,05 | Pending text/hash mismatch | Resolve | Reject acknowledgment without writes |
| TC-U33 / AC-05 | Junction at state.json | Init | Reject before copies; external target unchanged |
| TC-U34 / AC-01,05 | README case renamed after tracking | Update | Discover alias, retain case, save destination, apply upstream |
| TC-U35 / AC-03,05 | Lowercase customized README, unknown base | Update/resolve README.md | Report actual destination/canonical command; preserve local content |
| TC-U36 / AC-03,05 | Unknown incoming artifact plus independent clean change | Update | Reject collision before any project writes |
| TC-U37 / AC-03,04 | Retained accepted V2 incoming artifact, later V3 conflict | Update | Safely stage V3; preserve local/accepted base |
| TC-U38 / AC-02,04 | Local already equals incoming; Git absent | Update | Keep document and advance base without Git |
| TC-U39 / AC-03,04 | V2 unresolved conflict; runner selects previously accepted V1 | Update then resolve | Keep exact pending V2/base/local content, report exit 2 and canonical resolution; resolution still promotes staged V2 |

Existing `tests/scaffold.test.cjs`: only TC-04 exact-file expectation changes to eleven documents plus `.ai-workflow-scaffold/state.json`; all other existing cases unchanged. This explicit requirement change is included in checkpoint approval. Eight other applicable old cases currently pass; old TC-13 cannot create its Windows file-symlink fixture (EPERM).

Initial backend runs from repository root: `node --test --test-reporter=tap tests/updates.test.cjs` -> 38 tests, 0 pass, 37 fail, 1 explicit TC-U13 fixture-capability skip. Thirty-three stop at missing-state guard after otherwise successful old init; U11 lacks the required no-state explanation; U22/U33 accept ignored metadata junctions; U30 lacks update help. These demonstrate missing tracking/commands/metadata handling, not reached merge assertions. `node --test --test-reporter=tap tests/scaffold.test.cjs` -> 10 tests, 8 pass, 2 fail (new TC-04 metadata expectation and pre-existing TC-13 fixture EPERM). Combined distinct cases: 48 total, 8 passing existing behavior, 38 expected missing-feature failures, 1 environment failure, 1 not-run case. Reruns are not extra cases.

Pre-checkpoint review: independent reviewer reproduced initial counts and requested TC-U38 remove Git from PATH to establish its claimed no-Git route. Backend extracted a test-only withoutGit helper reused in U27/U28/U38, fixed U38, and reran with unchanged classifications. Independent reviewer confirmed the correction and no remaining blocking test-definition findings. No production code or assertion scope changed.

Coverage limits: no dynamic coverage of simultaneous user edits during planning, actual atomic-state IO failure, or Git's error-status 255; implementation review must inspect them. Two-version archive/npx verification is planned after implementation and has not run for TASK-004. Windows TC-U13 is explicitly not run; TC-13 is fixture failure; neither is passing coverage. These limits must appear in the user checkpoint and final report, with acceptance if they remain unresolved at closure.

Post-approval regression TC-U39 was added for an independent review finding in the already approved unresolved-conflict exit-2 requirement; no expectation/scope was relaxed or changed. Existing documents, incoming artifacts, and state now use exclusive same-directory temporary writes plus pre-rename rechecks/atomic replacement. There is still no cross-file transaction: if an artifact write succeeds but state save fails, a later retry may correctly reject it as unrecognized. README recovery explicitly preserves/reviews/moves aside that reported artifact before rerun without resetting state. This is disclosed partial-IO recovery, not a promised journal/rollback system.

Status: approved. User explicitly selected “Approve implementation and stated test limits” in the async R1 checkpoint after receiving behavior/cases/results and the two Windows/static-review limits. This approves STEP-02 R1 runtime, metadata/docs, tests and disclosed coverage approach; it does not turn unrun cases into passes or authorize remote push/deployment. Independent test-quality review complete; U38 corrected. Actual implementation starts after this decision. Approval question and expectations are recorded above; no inference from TASK-003 or earlier documentation requests.

## Resume, risks, and recovery

Execution-mode update: backend and independent reviewer stopped at a workspace credit limit after implementation and two P2 corrections, before their final rerun/re-review completed. Continue in declared single-agent backend verification and self-review phases under the orchestrator, preserving the approved contract. Existing independent test review and initial source findings remain attributable; the final source recheck is self-review, not independent. Root owns any remaining minimal backend corrections sequentially; no agents are editing these files concurrently. Required remaining work: verify fixes/TC-U39, run final suite and fresh real archive scenarios, inspect docs/links, record limits and close only completed entries.

Final stage: done, approved R1 with added regression TC-U39 for the existing unresolved-conflict requirement. Final evidence, corrected review findings, file inventory and acceptance mapping are in [done.md](done.md). Actual npm test result is 49 distinct cases: 47 pass, 1 accepted Windows file-symlink fixture failure, 1 explicitly not-run case-variant fixture. Real three-version archive/npx scenarios and documentation checks passed. Independent initial review found two P2 issues; backend fixed them and root completed final self-review after delegated credit exhaustion. No remaining blocking finding within accepted scope. Next action: none locally; commit/push required for GitHub delivery. Clean text merges require meaning review; partial cross-file IO recovery and legacy unknown originals remain documented. State contains upstream templates and path metadata, not customized project backups; keep it with project guidance. No remote push/deploy performed.
