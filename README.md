# AI Workflow Scaffold

Portable Markdown guidance for an orchestrator, backend owner, frontend owner, and read-only reviewer. It provides project setup records, role boundaries, reusable task forms, and a test-first user approval checkpoint before each application implementation step.

This repository is the reusable scaffold source. In a receiving project, this README becomes editable project documentation: adapt it to that project's actual purpose, setup, and commands using the instructions below.

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

npx runs the setup command from npm's cache without adding a project dependency. The command copies missing reusable documents into the current directory, preserves existing files, and reports files that need merging. It checks managed paths for obstructing files and links before copying; resolve reported conflicts and rerun. There is no overwrite or force option. The receiving project's package manifest and lockfile are left untouched. See the [npx reference](https://docs.npmjs.com/cli/v11/commands/npx/).

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

## Integrate the workflow

1. Read the receiving project's existing instructions and project-owned Markdown before making changes. Read this package's supplied guidance as the setup reference.
2. Run the npx command above to copy `AGENTS.md`, `PROJECT.md`, `ARCHITECTURE.md`, `agents/*.md`, `tasks/README.md`, `tasks/_template/*.md`, and a root README into matching project-owned paths. It creates missing directories and copies only missing files; it does not copy source `tasks/TASK-*` history. For manual adoption, copy that same file set from an installed package or checkout after checking destinations.
3. Review reported preserved files and merge relevant workflow guidance manually or with the orchestrator. The command does not merge or personalize existing content. A root README with any casing, including `readme.md`, is preserved without adding a second one. Keep useful project content and installation guidance.
4. Keep the receiving project's own `package.json`; the scaffold's manifest is distribution metadata, not an application manifest to copy. Do not edit personalized guidance inside `node_modules`, where reinstalls can replace it.
5. Make sure your agent host reads the project-owned `AGENTS.md`. Markdown role files describe duties; they do not register executable agents or guarantee that a host automatically loads instructions from dependencies.
6. Ask the orchestrator to perform first-use setup under [AGENTS.md](AGENTS.md). It inspects the project, adapts specific wording while preserving document structure and shared policies, and records evidence and setup status in [PROJECT.md](PROJECT.md). Remove source-history links from copied documents when those task records were not copied.

Example setup request:

> Set up this scaffold for the current project. Merge existing instructions, inspect actual files and commands, adapt the root README and workflow documents, preserve shared policies, and record setup evidence in PROJECT.md. Do not invent a stack or implement application features.

Commit the integrated project-owned guidance so the workflow remains available independently of the installed dependency. A later package update does not refresh those copies automatically; review and merge relevant upstream changes while retaining project customizations.

## Adapt this README to the receiving project

During first use, retain this document's section structure and change project-specific wording in place. Update its title and introduction to the observed project name, purpose, users, and workflows. In the installation section, document the project's actual prerequisites and install commands; keep any useful scaffold installation reference clearly identified as workflow tooling. In setup sections, document verified configuration steps and entry points. Never copy example commands as established project commands without inspecting configuration.

Preserve existing README content and user customizations. Reference [PROJECT.md](PROJECT.md) for canonical ownership, command definitions, setup state, and inspected evidence; do not maintain a conflicting second setup record here. Distinguish commands found in configuration from commands actually executed. If stack, commands, or application layout are unknown, say so rather than selecting them. Resolve unknowns before dependent work.

Remove source-only distribution and maintenance wording only where it no longer describes the receiving project. Keep applicable workflow links and shared constraints. Adapt project details again when evidence changes; do not regenerate an already accurate README on every session.

## Use the workflow

Start with [AGENTS.md](AGENTS.md), project context in [PROJECT.md](PROJECT.md), and the [architecture map](ARCHITECTURE.md). The [task guide](tasks/README.md) explains adoption, task creation, approval, execution, and resuming work.

Each task uses [plans.md](tasks/_template/plans.md), [todo.md](tasks/_template/todo.md), and [done.md](tasks/_template/done.md). For application behavior, write and run tests, review initial results, obtain the user's explicit step approval, implement, verify, review, and record completion. Documentation setup uses the specific permissions and direct checks defined in AGENTS.md.

## Maintain the scaffold source

When maintaining this repository itself, leave its setup status as `template` and future task forms unfilled. Inspect package contents with `npm pack --dry-run` before sharing a revision. The package includes source task history so links resolve inside the distribution; receiving projects copy only the reusable guidance listed above.

Run `npm test` to exercise the setup command using Node's built-in test runner and isolated temporary projects. Link tests require permission to create filesystem links, including file symlinks on Windows. These are scaffold-tool tests, not a receiving application's test system. No database or deployment is supplied. The package currently declares `UNLICENSED`; no open-source license grant is included.
