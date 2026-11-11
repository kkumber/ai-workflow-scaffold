# TASK-005: Codex-specific agent files

## Task record and authorization

- Status: done. Revision: R1. Active step: complete.
- Requirement: user requests project `.codex/agents/*.toml` instead of `agents/*.md`, reviewer reasoning high, backend/frontend medium, with model selection left to Codex desktop.
- Mode/owner: sequential single-agent test/backend implementation/orchestrator/self-review phases. Delegated agents previously stopped at a workspace credit limit; no independent review is claimed for this task. Root owns each listed file, with runtime edits reserved for the approved backend phase.
- Setup: [PROJECT.md](../../PROJECT.md); reusable source stays template. All 23 existing Markdown files already read fully in this context; discovery found the same files, no `.codex/**/*.toml`, and clean git status. Current role files reread in full. Reuse unchanged orientation, not historical task authorization.
- Specific requested configuration/docs conversion is authorized. Installer/updater path and state migration is a material runtime change and retains the test-first checkpoint. No runtime or source-role deletion before approval. Do not alter the user's personal Codex settings or project config.toml.

## Verified Codex contract

The current official [Codex subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents) was searched and opened before local inspection. It documents standalone project `.codex/agents/*.toml`, required name/description/developer_instructions, optional model_reasoning_effort, parent/default model resolution when no model is set, and inherited permissions. No main config registration is required by that documented standalone format. Codex custom files do not create a separate read-only sandbox; reviewer remains read-only by instructions.

Each role file will contain `name`, `description`, `model_reasoning_effort`, and a readable multiline literal `developer_instructions` body. Backend/frontend use medium; reviewer high. Omit model, model_provider, defaults, and permission overrides. Preserve existing instructions, ownership/approval boundaries, SEO, reusable-code/framework/manual-editability rules; fix instruction links for the nested directory. Actual desktop loading/spawning is not exercised: parse syntax and inspect the documented schema, preserve current desktop/global model configuration. Python 3.14.7 is available for one-off full TOML parsing via stdlib tomllib; it is verification tooling, not a new npm/runtime/test dependency.

## Current behavior and scope

The v0.2.0 copy list is eleven Markdown documents including three agents/*.md; package.json ships agents/*.md. Shared path checks and state validation in lib/scaffold-files.cjs/lib/scaffold-updates.cjs assume that exact allowlist; changing only files would break new installs and reject existing tracked state. Tests use real subprocess fixtures and currently reference old role paths. Source task-history exclusion and active update-state retention must remain.

New installs copy eight Markdown guides/forms plus three Codex TOML roles, and tracking state. Managed updates continue normal clean-only merges on the new allowlist. Bump package to 0.3.0 and ship `.codex/agents/*.toml` explicitly, retaining task guide/forms only from tasks. Delete the three old role files from this source after successful conversion; remove the source agents directory only if empty. Do not delete receiving-project legacy roles automatically.

## Receiving-project migration decisions

1. Retain schemaVersion 1 and its exact record shape. Validate either the exact current allowlist or the exact recognized legacy v0.2.0 allowlist; reject mixed/unknown/duplicate/traversing layouts. Legacy recognition is a fixed compatibility input, not a new writable allowlist.
2. When loading valid legacy state for default/update, preserve its original JSON bytes in `.ai-workflow-scaffold/pre-codex-agents-state.json` before replacing active state. The backup retains accepted and pending legacy upstream identities/content, not customized project-file text. If backup already exists with identical bytes, reuse it; if it differs or is linked/obstructed, reject before project writes and preserve it.
3. Keep the eight unchanged-path entries and their baselines/pending state. Replace the three old role entries in active state with unknown-baseline entries for the new TOML paths. Stage each latest TOML under `.ai-workflow-scaffold/incoming/.codex/agents/` and return exit 2. Leave customized old Markdown roles and any existing target TOML files untouched; do not guess a semantic conversion of receiving-project custom instructions or drop legacy pending history. This is a one-time manual layout migration, not silent overwrite or automatic deletion.
4. Report old and new paths, saved state backup, and exact canonical resolve commands. The user merges relevant custom role instructions into the actual new TOML files, then resolves each `.codex/agents/<role>.toml`. Resolution preserves local files and accepts the staged upstream baseline. Old receiving-project Markdown roles may be removed only after inspected manual migration under the setup cleanup rule.
5. Ordinary subsequent new-layout updates use saved TOML baselines. Repeating an unresolved migration is idempotent and retains conflict proposals. Existing symlink/junction/state/incoming safeguards and atomic writes apply to `.codex` ancestors and the migration backup. Existing project `.codex/config.toml` and unrelated .codex files remain byte-identical.
6. New-layout state selects only new canonical paths; older runtime versions may reject it safely rather than downgrade. No general schema migration framework, TOML runtime parser, forced migration, new dependency, or live Codex launch is needed. Source TOML syntax/schema is verified directly; manual resolution remains an acknowledgment, not semantic validation of custom TOML.

## Files and ownership

All files have one owner: root in the declared phase. Proposed paths are not yet created production files.

| Path | Action / phase | Purpose |
|---|---|---|
| .codex/agents/backend.toml | Add after approval | Backend instructions, medium effort, no model |
| .codex/agents/frontend.toml | Add after approval | Frontend/SEO/styles instructions, medium effort, no model |
| .codex/agents/reviewer.toml | Add after approval | Read-only review instructions, high effort, no model |
| agents/backend.md | Delete after validated conversion | Superseded source role |
| agents/frontend.md | Delete after validated conversion | Superseded source role |
| agents/reviewer.md | Delete after validated conversion | Superseded source role |
| lib/scaffold-files.cjs | Modify after approval | New allowlist and .codex directory safeguards |
| lib/scaffold-updates.cjs | Modify after approval | Fixed legacy layout validation, backup/staged migration |
| package.json | Modify after approval | v0.3.0 and explicit Codex TOML payload; test command |
| tests/scaffold.test.cjs | Modify now | New role-copy/preservation/link paths |
| tests/updates.test.cjs | Modify now | Current versioned fixtures use new role allowlist |
| tests/codex-agents.test.cjs | Add now | Role artifact fields, legacy migration/backup/preservation/safety |
| AGENTS.md | Modify after approval | Codex orchestration, role paths, TOML orientation/setup rules |
| README.md | Modify after approval | Codex files/efforts/inherited model and migration procedure |
| PROJECT.md | Modify after approval | Codex scope and path/runtime references |
| ARCHITECTURE.md | Modify after approval | New role map and migration connections |
| tasks/README.md | Modify after approval | Codex setup/role links and cleanup after migration |
| tasks/TASK-005-codex-agents/plans.md | Add now | Canonical scope/cases/checkpoint |
| tasks/TASK-005-codex-agents/todo.md | Add now | Pending stage |
| tasks/TASK-005-codex-agents/done.md | Add now | Actual evidence |

No main/personal Codex config changes, model pin, history rewrite, database action, remote push, or publication. Workspace `.codex` has a protected permission boundary; use the required tool permission for actual requested files after the reviewable checkpoint, not a workaround.

## Steps and acceptance criteria

STEP-01: revise/write tests, run/classify initial results, self-review quality, present checkpoint. STEP-02 after approval: convert roles, update runtime/docs/metadata, run relevant suites, actual TOML parsing, archive/npx/migration checks, self-review and close.

| Criterion | Observable result / basis |
|---|---|
| AC-01 | Exactly three valid documented Codex TOML roles; medium/medium/high; no model or inherited-setting overrides; existing instruction duties preserved. User request and official schema. |
| AC-02 | New init and current-layout updates copy/manage only new role paths and keep other project Codex settings. User path change with prior no-overwrite guarantee. |
| AC-03 | Valid legacy state migrates to staged new TOML with exact state backup, preserves old/custom/new files, pending history and source task exclusion, and supports resolution/future updates. Prior customization-preserving update contract. |
| AC-04 | Invalid layouts, backup collisions, and linked Codex/backup paths reject before writes; idempotent retries and atomic safety preserved. Existing safe-updater contract. |
| AC-05 | Package includes TOML, excludes old roles/source task history, docs/links/role instructions remain consistent, real local packaged install/migration works. Actual usable delivery. |

## Test plan and initial evidence

Use the established Node runner and real subprocess/filesystem fixtures; no new npm dependencies or fake merge outcomes. Revise only path-related expectations in existing suites. Add explicit Given/When/Then cases for role source presence/fields/no model, new init and Codex config preservation, exact legacy migration snapshot/pending preservation, staged conflict idempotency and manual resolve/later update, existing target preservation, backup collision/link rejection, mixed layout rejection, and `.codex/agents` junction rejection. Complete case IDs/matrix and actual results before the checkpoint. New cases should fail for missing TOML/layout support; classify prerequisite failures separately from later assertions. Retain previous Windows EPERM and case-sensitive filesystem limitations without weakening tests; acceptance applies when reported again for this step.

Direct checks after conversion: stdlib tomllib parse all three actual files; validate required/allowed fields and requested efforts; compare preserved policy sections/link resolution; npm pack inventory and real local npx fresh/legacy migration scenarios; git diff whitespace. No actual Codex desktop model change, reload, or agent spawn tested. Command and counts remain not run until recorded in done.md.

## Checkpoint and resume

### Cases and actual initial results

All TC-C cases are new-behavior integration or direct-source checks in tests/codex-agents.test.cjs, with the user request/AC as basis. Migration fixtures contain both known legacy inputs and proposed new package inputs so the unchanged old runtime reaches its genuine legacy behavior; no mock merge/filesystem/state. Existing update fixtures adopt the new intended package layout and fail at its unsupported path boundary, not at later merge assertions. Existing setup/update assertions are unchanged except role paths, parent-link fixture path, and copy-list expectations.

| Case / criterion | Given | When | Then |
|---|---|---|---|
| TC-C01 / AC-01 | Actual source role files | Inspect required Codex fields | Three named files, medium/medium/high, instructions, nested root links, no model/provider/permissions override |
| TC-C02 / AC-02 | Empty receiver with existing .codex/config.toml | Initialize | New TOML roles copied, old roles absent, user settings unchanged |
| TC-C03 / AC-03 | Valid legacy state, custom old role and pre-existing new config | Update | Exact original-state backup, new layout active, three incoming TOML conflicts, old/new custom files intact, useful paths/resolve report |
| TC-C04 / AC-03 | Legacy migration staged | Repeat, integrate/resolve each role, change upstream | Idempotent proposal, preserved manual edits, later clean update |
| TC-C05 / AC-04 | Different existing backup | Migrate | Reject before writes; preserve backup and state |
| TC-C06 / AC-04 | Backup points outside via junction | Migrate | Reject; project and outside unchanged |
| TC-C07 / AC-04 | Linked .codex parent | Initialize | Reject before writes; outside untouched |
| TC-C08 / AC-04 | Linked .codex/agents and existing settings | Initialize | Reject without altering settings/external target |
| TC-C09 / AC-04 | Mixed legacy/current file-list state | Update | Reject without guessed migration or writes |
| TC-C10 / AC-03,04 | Exact prior backup already saved | Migrate | Reuse identical bytes and stage new roles |
| TC-C11 / AC-03 | Pending old-role identity/artifact | Migrate | Preserve them in exact backup and old incoming file |
| TC-C12 / AC-04 | Ordinary file obstructing .codex | Initialize | Reject before writes |

Actual initial command: `node --test --test-reporter=tap tests/codex-agents.test.cjs tests/scaffold.test.cjs tests/updates.test.cjs` through ctx_shell background job shell_48ba972428a50c45. Result: 61 cases, 11 pass, 49 fail, 1 explicit not-run. Of 49 failures, 48 are expected absent Codex files/new layout/migration handling; unchanged TC-13 fails fixture EPERM. TC-U13 remains not run on case-insensitive filesystem. Twelve new cases: C09 existing rejection passes, other eleven fail because requested files/migration/guards are absent. Thirty-nine updated-layout cases: four existing validation/help cases pass, 34 stop at old runtime expecting agents/backend.md in a new-format package, one not run. Setup suite: six existing cases pass, three fail revised path/guard expectations, one EPERM fixture failure. These do not demonstrate new effort settings or later merge behavior before their prerequisites exist.

Self-review: real subprocesses/legacy JSON format/hashes checked against published state contract; no runtime seams or weakened assertions. New helper is intentionally scoped to legacy/current coexistence because existing private suite helpers assume a single layout and cannot be imported without registering tests. Preserved pre-existing Codex data and backup bytes are asserted, not just mocked exit codes. Full TOML syntax/schema, complete role-policy preservation, source deletion, archive exclusion, and actual packaged migration are direct post-write checks, not claimed executed now. No blocking test-definition issue found. Live Codex desktop reload/spawn/model selection and dynamic IO/race failures are not tested; Windows limits remain explicit and must be accepted when checkpointing/closing.

Status: approved. User explicitly selected “Approve implementation and stated limits” in the R1 async checkpoint after the behavior/cases/results and review/verification limits. This covers the required role-path delivery/migration changes, self-review, known Windows limits and no live Codex model-session launch. Requested effort/model choices remain fixed. No source runtime/config/manifest edits or deletions occurred before that decision. Next action: STEP-02, including protected project-file write permission as required by host; no personal/main Codex config edits or remote publication authorized.

## Final acceptance and resume

All local work complete; actual file inventory, command results, source role preservation, migration and limits in [done.md](done.md). Source Codex TOML parses with medium backend/frontend and high reviewer, no model pin; old source Markdown roles removed after full instruction comparison. Real 0.2.0-to-0.3.0 archive/npx migration preserves old/custom/new roles and main config, stages unknown originals, saves exact backup and supports resolution/repeats. Final npm test: 61 total, 59 pass, 1 accepted Windows fixture EPERM, 1 explicit not-run. Actual TOML parsing/links/package checks passed; review is self-review as declared. No live Codex session/model change or runtime parsing claim. No remaining local blocker; commit/push still needed before GitHub delivery. Prior source history retained and excluded from package.
