# Codex Workflow Scaffold

Project guidance and standalone Codex agent configurations for an orchestrator, backend owner, frontend owner, and read-only reviewer. It provides setup records, role boundaries, reusable task forms, and a test-first user approval checkpoint before each application implementation step.

This repository is the reusable scaffold source. In a receiving project, this README becomes editable project documentation: adapt it to that project's actual purpose, setup, and commands using the instructions below.

## Codex agents and model selection

| Role | Project file | Reasoning effort |
|---|---|---|
| Backend | [.codex/agents/backend.toml](.codex/agents/backend.toml) | medium |
| Frontend | [.codex/agents/frontend.toml](.codex/agents/frontend.toml) | medium |
| Reviewer | [.codex/agents/reviewer.toml](.codex/agents/reviewer.toml) | high |

Each file supplies name, description, reasoning effort, and the full role instructions. No file sets `model`: continue choosing your model in Codex desktop; these roles retain Codex's parent/default model resolution. No personal settings or project `.codex/config.toml` are created or rewritten. Custom roles inherit parent permissions; the reviewer's read-only constraint is enforced through its instructions, not a separate sandbox override. Use a Codex client that supports the documented standalone project-agent format. See the [official Codex subagent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents).

## Installation from GitHub

Prerequisites: Node.js 20 or newer, npm (including npx), Git, and access to the GitHub repository. Run this from the receiving project's root:

```sh
npx github:kkumber/ai-workflow-scaffold
```

The equivalent Git URL form is:

```sh
npx git+https://github.com/kkumber/ai-workflow-scaffold.git
```

For reproducible adoption, pin a reviewed commit by replacing `COMMIT_SHA` with its full hash:

```sh
npx github:kkumber/ai-workflow-scaffold#COMMIT_SHA
```

npx runs the command from npm's cache without adding a project dependency. On first use, it copies missing reusable documents into the current directory, preserves existing files, and records upstream baselines in `.ai-workflow-scaffold/state.json`. Later runs use that state to update tracked documents while preserving project customizations. Managed paths are checked for obstructing files and links before writes. There is no force-replace option. The receiving project's package manifest and lockfile are left untouched. See the [npx reference](https://docs.npmjs.com/cli/v11/commands/npx/).

Show usage without copying files:

```sh
npx github:kkumber/ai-workflow-scaffold --help
```

If you prefer to retain the package as development tooling, you can instead install it and then run its setup command:

```sh
npm install --save-dev github:kkumber/ai-workflow-scaffold
npx ai-workflow-scaffold
```

That optional install adds a development dependency; commit its manifest/lockfile changes according to project conventions. Installing alone does not copy root guidance. The package has no lifecycle hooks or runtime dependencies.

The GitHub commands require these package files to be committed and pushed to the selected revision. Fetching by package name without a prior local install assumes separate npm registry publication; this scaffold does not require that publication.

## Update an adopted project

After initialization, rerunning the command performs a managed update. You can also request it explicitly:

```sh
npx github:kkumber/ai-workflow-scaffold update
```

The updater compares the saved upstream baseline, your current document, and the selected package's new template. Untouched documents receive upstream changes; separate edits are combined with Git's three-way text merge. Git must be available when both sides changed. Local customizations and deliberately deleted files are retained when upstream is unchanged. A deleted file changed upstream is reported for review, not recreated. CRLF documents keep their newline style. A content fingerprint detects template changes even when the package version string was not changed.

If edits overlap or an original baseline is unknown, the project file stays untouched and the upstream copy is saved at `.ai-workflow-scaffold/incoming/<document-path>`. Independent clean updates may still apply; the command returns exit code 2 for unresolved conflicts. Review the incoming copy and edit the project document to combine the changes. Then explicitly acknowledge that document:

```sh
npx github:kkumber/ai-workflow-scaffold resolve AGENTS.md
```

Use the reported canonical document path; for a lowercase root `readme.md`, the resolve argument is still `README.md`. Resolution records the exact staged upstream baseline and preserves your project file, including a deliberate deletion. It does not apply or verify your manual merge. Leave incoming copies unedited; changes to review artifacts are preserved and must be moved aside or reviewed before they can be replaced. A later command can then merge future upstream changes using the acknowledged base.

Keep `.ai-workflow-scaffold/state.json` with the project-owned guidance, normally in version control, and retain it during first-use cleanup. It stores upstream templates, selected version/content identities, and pending upstream text, not backups of your customized documents. Removing it loses merge history. A lock prevents overlapping updater runs; if a crash leaves a lock, confirm no updater is running before removing the reported lock file. Each existing document and state file is replaced through a temporary file and rename, but an IO interruption can still leave some whole-file updates applied before state is saved. Fix the IO problem and retry. If the retry reports an unrecognized incoming artifact written before the state save failed, preserve and review it, move that reported artifact aside, then rerun; do not reset state or discard unreviewed project content. Updates do not provide a filesystem-wide transaction or semantic review of merged prose.

For a project installed with the old copy-only command, run normal initialization once to start tracking. Existing custom files are preserved with unknown originals; the next update stages them for one-time manual integration and resolution. Missing files are copied during this initial adoption, so review intentional legacy deletions and old `agents/*.md` customizations first. Integrate applicable old role instructions into the new TOML rather than assuming defaults imported them. `update` without state stops and explains initialization; it never guesses a historical baseline.

npx uses the package revision you request. To select a reviewed new revision explicitly, replace `COMMIT_SHA` with its full commit hash:

```sh
npx github:kkumber/ai-workflow-scaffold#COMMIT_SHA update
```

A pin to an older commit intentionally keeps that older revision. The CLI itself does not fetch a newer revision or publish changes.

## Migrate the previous Markdown roles

For a tracked project using `agents/backend.md`, `agents/frontend.md`, and `agents/reviewer.md`, run the new revision's `update` command. It recognizes that exact previous layout, saves the original tracking bytes as `.ai-workflow-scaffold/pre-codex-agents-state.json`, and stages the three new templates under `.ai-workflow-scaffold/incoming/.codex/agents/`. Existing old roles, pending old review artifacts, and any existing target TOML files remain untouched. A differing or linked migration backup blocks changes rather than being overwritten.

Review the staged templates and old custom instructions, create or merge the actual `.codex/agents/*.toml` files, and validate the TOML. Keep the model unset to retain your session/default selection and keep the requested role efforts unless you intentionally change them. Then acknowledge each reviewed role:

```sh
npx github:kkumber/ai-workflow-scaffold resolve .codex/agents/backend.toml
npx github:kkumber/ai-workflow-scaffold resolve .codex/agents/frontend.toml
npx github:kkumber/ai-workflow-scaffold resolve .codex/agents/reviewer.toml
```

This is a one-time manual format migration, not a guessed conversion of customized Markdown. Resolve records the staged upstream baseline and does not validate custom TOML semantics. Keep the state backup while needed for review/recovery; remove obsolete old role files only after confirming their useful content was integrated and references were updated, under the normal cleanup rule. Later updates merge tracked TOML using the same preservation/conflict behavior. Mixed or unknown state layouts reject without writes; older runtimes may safely reject the new layout rather than downgrade it.

## Integrate the workflow

1. Read applicable receiving-project instructions and relevant project context before making changes. Follow AGENTS.md's scoped context rule; use the supplied setup procedure as the explicit adoption reference.
2. Run the npx command above to initialize `AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `.codex/agents/*.toml`, `tasks/README.md`, `tasks/_template/*.md`, and a root README in matching project-owned paths. This is eight Markdown guides/forms and three Codex role files, plus update tracking. Initialization creates missing directories and copies only missing files; it excludes source `tasks/TASK-*` history and the old Markdown roles. Manual adoption uses the same file set after checking destinations.
3. On initialization, review preserved custom files and merge relevant workflow guidance manually or with the orchestrator. Their original upstream content is unknown; managed updates need the one-time integration described above. The command does not personalize project content. A single existing root README with any casing, including `readme.md`, is retained without adding another; multiple root README variants are rejected as ambiguous. Keep useful project content and installation guidance.
4. Keep the receiving project's own `package.json`; the scaffold's manifest is distribution metadata, not an application manifest to copy. Do not edit personalized guidance inside `node_modules`, where reinstalls can replace it.
5. Make sure Codex reads the project-owned `AGENTS.md` and discovers the standalone files in `.codex/agents/`; dependency-only copies are not project agent configuration. Request the backend, frontend, or reviewer by its configured name. No main config or model override is required by this scaffold.
6. Ask the orchestrator to perform first-use setup under [AGENTS.md](AGENTS.md). It inspects the project, adapts project-specific wording, cleans up obsolete setup material, and records evidence and status in [PROJECT.md](PROJECT.md). Preserve shared policies and useful project content; remove references to source-only files that were not copied.

Example setup request:

> Set up this scaffold for the current project. Merge existing instructions, inspect actual files and commands, adapt the root README and workflow documents, preserve shared policies, and record setup evidence in PROJECT.md. Do not invent a stack or implement application features.

Commit the integrated project-owned guidance and update state so the workflow remains available independently of the installed dependency. Later managed updates use the saved originals to merge upstream changes; review clean results and resolve reported conflicts while retaining project customizations.

## Adapt this README to the receiving project

During first use, use this document's section structure as a starting point and change project-specific wording in place. Update its title and introduction to the observed project name, purpose, users, and workflows. In the installation section, document the project's actual prerequisites and install commands; keep any still-useful scaffold reference clearly identified as workflow tooling. In setup sections, document verified configuration steps and entry points. Remove obsolete setup-only sections during final cleanup. Never copy example commands as established project commands without inspecting configuration.

Preserve existing README content and user customizations. Reference [PROJECT.md](PROJECT.md) for canonical ownership, command definitions, setup state, and inspected evidence; do not maintain a conflicting second setup record here. Distinguish commands found in configuration from commands actually executed. If stack, commands, or application layout are unknown, say so rather than selecting them. Resolve unknowns before dependent work.

Remove source-only distribution and maintenance wording only where it no longer describes the receiving project. Keep applicable workflow links and shared constraints. Adapt project details again when evidence changes; do not regenerate an already accurate README on every session.

## Use the workflow

Start with [AGENTS.md](AGENTS.md), project context in [PROJECT.md](PROJECT.md), and the [architecture map](ARCHITECTURE.md). The [task guide](tasks/README.md) explains adoption, task creation, approval, execution, and resuming work.

Each task uses [plans.md](tasks/_template/plans.md), [todo.md](tasks/_template/todo.md), and [done.md](tasks/_template/done.md). For application behavior, write and run tests, review initial results, obtain the user's explicit step approval, implement, verify, review, and record completion. Documentation setup uses the specific permissions and direct checks defined in AGENTS.md.

## Finish setup and remove scaffolding

Before marking a receiving project's setup ready, follow the cleanup step in AGENTS.md. Remove obsolete adoption walkthroughs, scaffold branding/examples, and source-maintenance sections after replacing them with actual project information. This one-time cleanup section may itself be removed when complete. Inspect candidate scaffold-only files/folders and their references before removal; record exact removals/reasons in PROJECT.md and repair links afterward. Preserve project content, shared policies, reusable roles/task forms, actual setup/task evidence, and `.ai-workflow-scaffold/` tracking while updates are used. Do not delete the whole tasks folder or installed package/cache. Contextual cleanup is the orchestrator's adoption step, not an automatic deletion hook; tracked updates preserve local deletions or report conflicts if upstream changed the deleted material.

## Maintain the scaffold source

When maintaining this repository itself, leave its setup status as `template` and future task forms unfilled; retain these reusable setup instructions. Inspect package contents with `npm pack --dry-run` before sharing a revision. The package explicitly includes `.codex/agents/*.toml`, excludes old `agents/*.md`, and excludes repository TASK-* history. Only tasks/README.md and tasks/_template/*.md are included from tasks; repository-local task records remain here as maintenance history.

Run `npm test` to exercise the setup command using Node's built-in test runner and isolated temporary projects. Link tests require permission to create filesystem links, including file symlinks on Windows. These are scaffold-tool tests, not a receiving application's test system. No database or deployment is supplied. The package currently declares `UNLICENSED`; no open-source license grant is included.

## Context-efficient work

AGENTS.md defines scoped startup reading and preserves reuse, framework, approval and review requirements. Read the assigned role and current task; consult completed history only for relevant decisions. Load [setup procedures](tasks/README.md#first-use-procedure) for adoption and the [marketing SEO checklist](tasks/README.md#marketing-seo-checklist) for affected public content. Keep requirements/results canonical in plans, pending state in todo and concise completion references in done. Use focused handoffs, relevant skills and compressed routine logs while retrieving complete source/failures when needed. Personal model and plugin settings remain user-controlled; context savings are not a guarantee of a particular token bill.
