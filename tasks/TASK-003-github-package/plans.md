# TASK-003: GitHub package and adaptable README

## Task record

Status: done. Revision: R2. Owner: orchestrator for coordination; backend owner for CLI/tests; independent read-only test and implementation reviews. Requirements: user's initial package/README request, followed by explicit choice “Use npx for one-time setup”. Setup reference: [PROJECT.md](../../PROJECT.md); scaffold-source status remains template.

## Objective, observations, and scope

All sixteen existing project-owned Markdown files were read in full. Clean initial git status; origin is https://github.com/kkumber/ai-workflow-scaffold.git. No manifest, root README, runtime code, test framework, or installer exists. The configured lean-ctx executable and MCP tools are unavailable; bounded native reads used. npm is absent from PATH; runtime discovery is pending.

R1 added declarative packaging and installation/setup documentation under the specific user request. npm pack succeeded with 21 entries; npm 11.13.0 was found outside PATH after approved tool access. The user then chose npx for one-time setup. R2 adds a small CLI under the application checkpoint below. No lifecycle hook, automatic overwrite, new dependencies, registry publication, or remote push. GitHub availability requires committing and pushing the files, which this task does not claim to have done. The R1 tarball is temporary evidence, not the final R2 distribution.

## Files and ownership

Coordination documents and package metadata have one owner: orchestrator. The CLI and tests have one owner: delegated backend specialist, as assigned below.

| File | Action | Purpose |
|---|---|---|
| package.json | Add | Package identity, repository metadata, explicit Markdown payload |
| README.md | Add | GitHub installation, explicit safe integration, project adaptation |
| AGENTS.md | Modify | Include README in minimal first-use adaptation |
| PROJECT.md | Modify | Describe package delivery and README adaptation accurately |
| ARCHITECTURE.md | Modify | Map package, README, and current task |
| tasks/README.md | Modify | Replace obsolete no-manifest statement with actual delivery path |
| tasks/TASK-003-github-package/plans.md | Add | Canonical requirements, cases, decisions |
| tasks/TASK-003-github-package/todo.md | Add | Pending state |
| tasks/TASK-003-github-package/done.md | Add | Actual results and limitations |
| bin/ai-workflow-scaffold.cjs | Proposed addition, backend owner after approval | One-time scaffold-copy command |
| tests/scaffold.test.cjs | Add before approval, backend owner | Node built-in test runner exercising the real CLI in temporary projects |
| agents/frontend.md | Modify, orchestrator-owned role guidance | User-requested marketing-site SEO responsibilities |

## Workflow and steps

Documentation/package supplement STEP-08 / AC-13–AC-15: user requests post-first-use cleanup and exclusion of this repository's task history from npx distribution. Orchestrator owns package.json (narrow task payload), AGENTS.md (canonical cleanup), README.md/tasks/README.md (adoption), PROJECT.md (cleanup evidence), ARCHITECTURE.md (package-safe map), and plans.md/todo.md/done.md (records). AC-13: remove obsolete setup-only wording/sections and inspected disposable scaffold-only artifacts; preserve project content, shared policies, reusable roles/forms, real task records, and setup evidence; verify references/report removals before ready. AC-14: package includes only tasks/README.md and tasks/_template/*.md from tasks; source TASK-* history remains repository-only. AC-15: repository/distribution links resolve; packaged setup still creates exactly eleven reusable documents with no source task folders. Specific documentation/metadata authorization applies; no runtime algorithm change or application checkpoint. Existing CLI already has an explicit history-free copy list. Direct checks: npm archive inventory, isolated packaged setup, relative links, whitespace, targeted self-review. Preserve unrelated CLI edits; prior CLI test evidence is not fresh verification. Historical accepted file-symlink limit is unchanged.

Documentation supplement STEP-07 / AC-12: user clarifies that pre-edit reuse applies explicitly to backend as well as frontend, and requests framework best practices with simple, readable code suitable for manual editing. Orchestrator owns AGENTS.md (canonical framework/manual-editability rules), agents/backend.md and agents/frontend.md (role-specific application), and plans.md/todo.md/done.md (scope/evidence). Direct documentation authorization; no runtime changes or added application checkpoint. Verify both roles reference shared reuse rules, framework guidance targets observed project/version and native facilities, simplicity does not bypass required framework conventions, and whitespace is clean. Self-review and direct inspection are proportionate; no application tests apply.

Documentation supplement STEP-06 / AC-11: user explicitly requests that agents read existing reusable components, styles, and functions before changes instead of duplicating equivalent functionality. Orchestrator owns AGENTS.md (canonical pre-edit reuse check), agents/frontend.md (reference in styling duties), and plans.md/todo.md/done.md (scope and evidence). Specific documentation authorization applies; no runtime change or new application checkpoint. Direct verification: inspect rule ordering, targeted search/read requirements, reuse/extension and justified-new-code decision, preserved role boundaries, and git diff whitespace checks. No automated application tests are appropriate.

Documentation supplement STEP-05 / AC-10: user explicitly requests simple reusable code across all languages, reusable CSS styles, application conditions in JavaScript rather than CSS tricks, and file separation only when justified. Orchestrator owns edits to AGENTS.md (canonical shared rule), agents/frontend.md (styling application), and this task's plans.md/todo.md/done.md (scope, state, evidence). No runtime, test, manifest, or package-copy contract changes. Direct checks after editing: inspect requested rule coverage and consistency, verify local Markdown references and whitespace; self-review is proportionate for this explicit documentation request. Preserve native CSS presentation features and existing framework conventions while keeping business/state decisions in application code. Authorization is the user's specific request; no additional application checkpoint applies.

Documentation supplement: user directly requested SEO importance in frontend guidance, including meta tags, keyphrases, proper HTML tags, and Open Graph media. STEP-04 / AC-09: add explicit marketing-site SEO planning, implementation, and verification duties without changing application code or waiving ownership/approval boundaries. Direct checks: review requested topic coverage, unchanged role constraints, Markdown links, and whitespace. This specific documentation edit is authorized independently of the pending CLI checkpoint. No automated application tests apply to written guidance; record actual checks in done.md. The new guidance does not change the CLI copy contract or ten test expectations.

STEP-01: create manifest/README; update related first-use guidance. AC-01: valid installable metadata matches origin and includes all linked scaffold documents. AC-02: README shows npm GitHub install, pinning, explicit copy/merge, and excludes source task history/package metadata from adoption. AC-03: first-use rules adapt README to inspected project facts while preserving existing project content and shared policies.

STEP-02: direct verification and self-review. AC-04: pack and local isolated install succeed; Markdown links resolve; no install scripts/dependencies or unrelated edits. Evidence must distinguish local verification from unpublished GitHub state.

## Direct verification cases

- TC-01 / AC-01, AC-04: after writing, parse manifest; run npm pack; inspect exact archive paths against manifest and linked files. Expected: complete Markdown payload, no runtime/dependency/install scripts. Initial observation: manifest absent, not an executed behavior test.
- TC-02 / AC-01, AC-04: install resulting archive in an isolated temporary consumer with scripts disabled, no audit/fund, and confirm installed manifest plus workflow/forms. Expected: installed dependency with no project-root AGENTS.md automatically created. No mocks. Covers local archive, not GitHub fetch of unpushed changes.
- TC-03 / AC-02, AC-03: validate relative Markdown links; review integration into blank/existing projects and README rewrite boundaries. Expected: preserve existing instructions/README, adapt root copy only, keep package identity/history out of receiving configuration. Direct checks appropriate for metadata/docs; no automated application suite exists.

## Review, checkpoint, and recovery

R1 documentation used self-review. R2 CLI requires test review and explicit approval. The orchestrator edits coordination documents; a delegated backend owner writes CLI tests and later implementation. Manifest and root documentation remain orchestrator-owned, with executable metadata changes waiting for approval. Commands and actual results go in [done.md](done.md). No database/migrations/deployment applies. Preserve prior history.

## R2 CLI contract and checkpoint

STEP-03 supersedes the R1 manual-copy default with an npx executable. AC-05: from the current working directory, copy the eleven reusable Markdown files (four root files including README, three roles, task guide, three forms) into matching paths; do not copy package metadata or source task history. AC-06: never overwrite existing files; preserve root README.md/readme.md variants and report paths needing merge; repeated runs are safe. AC-07: reject obstructing files, symlinks/junctions at managed destinations or parent directories before copying anything, and return a nonzero exit status with a useful error. AC-08: --help succeeds without writing, unknown arguments fail without writing. No target argument, merge engine, force flag, or automatic project-personalization is included. The agent performs evidence-based README/workflow adaptation afterward.

Use Node's built-in test runner, adding no test dependencies. The backend owner defines requirement-based cases in tests/scaffold.test.cjs before implementation: blank destination, existing guidance, lowercase README, rerun, blocked directory, linked parent, linked destination, help, and invalid arguments. Each case uses a real subprocess and isolated temporary directories, with no mocked filesystem. New CLI behavior should initially fail because the executable does not exist; distinguish that missing-interface failure from reached behavior assertions. Existing Markdown adaptation/direct checks remain TC-03.

All cases below are new-behavior subprocess integration tests at `tests/scaffold.test.cjs`, basis AC-05–AC-08 and the user's npx choice. Goal: establish the stated observable outcome. Initial expectation is failure from the absent CLI; fixture/environment failures are recorded separately. Fixtures use temporary directories, not live receiving projects. No mocks. TC-13 extends coverage following independent review.

| Case / criterion | Given | When | Then |
|---|---|---|---|
| TC-04 / AC-05 | Empty project directory with spaces in its path | Run command there | Exactly eleven reusable documents copied faithfully and reported; no manifest/history |
| TC-05 / AC-06 | Existing root guidance, backend policy, and project manifest | Run command | Existing content preserved, missing forms copied, merge/preservation report names existing guidance |
| TC-06 / AC-06 | Existing lowercase readme.md | Run command | Preserve it and create no second root README; report it |
| TC-07 / AC-06 | Prior setup followed by custom PROJECT.md edit | Run again | No file/content changes and preservation report |
| TC-08 / AC-07 | File named tasks obstructs directory | Run command | Nonzero error identifies tasks; no copies or changed existing content |
| TC-09 / AC-07 | agents is linked to external fixture directory | Run command | Nonzero error identifies agents; project and external contents unchanged |
| TC-10 / AC-07 | PROJECT.md is a directory link/junction | Run command | Nonzero error identifies PROJECT.md; no copies and link target unchanged |
| TC-11 / AC-08 | Empty project | Run --help | Success, usage/preservation explanation, no writes |
| TC-12 / AC-08 | Empty project | Run unsupported --force | Nonzero explanatory error, no writes |
| TC-13 / AC-07 | PROJECT.md is a symlink to an external fixture file | Run command | Nonzero error identifies PROJECT.md; no copies, link and target preserved |

Checkpoint revision: R2 / STEP-03. Status: approved. User replied “approved” after the checkpoint and SEO supplement; this approves the presented R2 behavior/cases and planned CLI implementation. User's npx preference authorizes test preparation, not the required implementation checkpoint. Initial results: 10 cases, 0 pass, 10 fail, 0 skip; TC-04–TC-12 missing-entry failures (MODULE_NOT_FOUND), TC-13 fixture setup EPERM. This establishes the absent proposed executable, not reached behavioral failures. Independent test-definition review complete, no remaining actionable findings; real file-symlink case added following review. Escalated fixture retry produced no completed result before the checkpoint; verification remains open. Evidence in done.md. Proposed implementation files: bin/ai-workflow-scaffold.cjs, package.json (bin/engines/test command/payload), README.md (npx default), PROJECT.md, ARCHITECTURE.md, tasks/README.md (actual CLI path); no application implementation until presented evidence receives explicit approval. After implementation, rerun tests, pack, and locally exercise npx with the archive; remote fetch cannot cover unpushed changes. File-symlink coverage is not waived. Approval question: Do you approve STEP-03 R2's expected behavior, ten test cases, and planned implementation? User decision: approved. Resume: implement R2, resolve fixture execution, verify and independently review before closure.

## Final acceptance and resume

All required local work complete. Final results and criterion mapping: [done.md](done.md). Nine subprocess behavior cases pass; TC-13 remains a Windows EPERM fixture failure even after an elevated retry. User explicitly chose “Accept the documented verification limit”; no test assertion changed or unverified case counted as passing. Independent implementation review found no actionable findings. Real archive installation and one-time npx invocation succeeded in separate temporary projects; twenty Markdown documents and eighty-eight local links checked. Source setup remains template, forms remain reusable, SEO guidance included. No dependency, registry publication, database action, deployment, or push performed. Next action: none for this local task. A future commit/push is needed for GitHub delivery; accepted file-symlink limit remains visible for later verification.
