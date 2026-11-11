# Architecture and navigation map

## Verified workflow files

This map covers the workflow files created by this template, not every possible item in the repository. No application architecture has been inferred.

```text
package.json                      <-- GitHub package metadata, CLI entry, test command
README.md                         <-- installation, integration, adaptable project guide
bin/
  ai-workflow-scaffold.cjs         <-- init/update/resolve command routing
lib/
  scaffold-files.cjs              <-- shared document allowlist and path safeguards
  scaffold-updates.cjs            <-- saved baselines, clean merges, staged conflicts
tests/
  scaffold.test.cjs                <-- isolated subprocess/filesystem tests of setup
  updates.test.cjs                 <-- versioned update/resolve and metadata safety cases
  codex-agents.test.cjs            <-- Codex role fields and legacy-layout migration
AGENTS.md                         <-- orchestrator, shared constraints, test-first gate
PROJECT.md                        <-- current context and adoption fields
ARCHITECTURE.md                    <-- this navigation and ownership guide
.codex/agents/
  backend.toml                    <-- backend role, medium reasoning, inherited model
  frontend.toml                   <-- frontend/SEO role, medium reasoning, inherited model
  reviewer.toml                   <-- read-only review role, high reasoning, inherited model
tasks/
  README.md                       <-- adoption, execution, and resume guide
  _template/
    plans.md                      <-- canonical task/step/case/checkpoint form
    todo.md                       <-- pending work and next-action form
    done.md                       <-- completion evidence form; no completed examples
```

## Entry points and relationships

- Start at [AGENTS.md](AGENTS.md). Read [PROJECT.md](PROJECT.md) for concrete project constraints and consult this map to find relevant files.
- [README.md](README.md) explains GitHub npx setup and updates; [package.json](package.json) exposes [the CLI](bin/ai-workflow-scaffold.cjs) and selects the payload. [Shared file handling](lib/scaffold-files.cjs) supplies the eleven-document allowlist and path checks; [the update engine](lib/scaffold-updates.cjs) records upstream text, compares current/new content, uses Git for clean two-sided merges, and stages conflicts for explicit resolution. Initial setup preserves custom files and marks unknown originals honestly. Reruns use receiving-project `.ai-workflow-scaffold/state.json`; incoming review files and an exclusive lock live in the same metadata directory. That state is generated at runtime and is not a source-package artifact.
- Consumer copies omit package metadata, CLI/lib/tests, and source task history; only eleven reusable documents plus their tracking state are created. The package excludes repository-local TASK-* history: only tasks/README.md and tasks/_template/*.md are distributed from tasks. Keep the receiving application's manifest, adapt the root README, preserve active update tracking through cleanup, and remove source-tool map entries/references when not copied.
- Codex agents first read every project-owned Markdown file and the complete .codex/agents/*.toml configurations as required by AGENTS.md, then use first-use setup if applicable. Only the orchestrator adapts guidelines. Use [backend](.codex/agents/backend.toml) or [frontend](.codex/agents/frontend.toml) only for affected work; [reviewer](.codex/agents/reviewer.toml) instructions govern read-only review. Standalone roles omit model/provider/permission overrides and set only the requested per-role reasoning.
- [tasks/README.md](tasks/README.md) explains copying [plans.md](tasks/_template/plans.md), [todo.md](tasks/_template/todo.md), and [done.md](tasks/_template/done.md) into one task folder.
- Active plans define scope and approved expectations. Todo entries reference the plan; done entries preserve completed IDs and actual evidence. No separate test-report store or approval service exists.
- Repository-local task folders are maintenance history, not reusable forms or approval for a receiving project. Keep that history in the source checkout; it is intentionally absent from the distributed workflow map and package.

## First-use mapping

PROJECT.md holds the setup state, target identity, inspected evidence, concrete ownership paths, and established/configured commands. This map supplies navigation, not a second setup-state store. During first use, edit tree entries, annotations, entry-point references, and source-only wording to match inspected files. Preserve reusable sections and shared workflow relationships; remove obsolete setup-only sections under AGENTS.md cleanup. Add or remove entries as the actual structure requires; do not regenerate unrelated guidance. Never copy illustrative application paths below into the verified map without evidence.

For a blank project, record the observed empty application areas and unresolved stack/layout instead of generating a preferred framework. For monorepos, name the selected workspace and relevant shared boundaries; resolve an ambiguous target first. A bounded structure scan is allowed for mapping; routine source inspection stays targeted.

## Ownership and contracts

The orchestrator owns workflow documents, project/map maintenance, and task ledgers. Backend and frontend own application files according to PROJECT.md and each active plan. Reviewer owns no editable paths. Shared application contracts and configuration receive one named owner per affected file in the plan; cross-role changes use sequential handoffs.

The Markdown task forms define workflow records; the CLI provides local initialization, tracked updates, and conflict acknowledgment through versioned state. It performs no remote fetches, application operations, or deployments. There are no established receiving-application routes, database schemas, or shared application runtime types. Codex role definitions are described below.

The three standalone Codex TOML files are project-scoped agent definitions, discovered by supported Codex clients. Existing tracked Markdown-role layouts are fixed compatibility inputs: the update engine validates that exact old allowlist, saves pre-codex-agents-state.json under receiving-project update metadata, retains unchanged guide baselines, and stages unknown-baseline TOML replacements. Old role files and pending artifacts are preserved for manual integration; normal new-layout updates follow after resolution. No personal/global/main Codex config is changed.

## Tests and commands

The scaffold's Node-based [setup tests](tests/scaffold.test.cjs) and [versioned update tests](tests/updates.test.cjs) use real subprocesses and temporary project fixtures; prerequisites and the command are defined in PROJECT.md. They do not establish the receiving application's test system or build commands. Task cases and evidence live in corresponding plans/todo/done records. Inspect the adopting project's actual test configuration and record verified commands in PROJECT.md; do not run placeholder commands. Known fixture limits must remain separate from passing coverage.

No generated/vendor directories are identified by this map. After adoption, identify actual generated directories, their sources, test locations, entry points, and commands using targeted inspection.

## Illustrative application map only

The following directories are examples, not claims that they exist or ownership assignments:

```text
src/
  components/      <-- reusable UI components
  features/        <-- feature-specific screens and behavior
  services/        <-- external service clients; owner depends on runtime
tests/             <-- test location depends on the real project
```

## Maintenance

After copying, adapt the verified map's project-specific entries to the adopting project's observed structure and meaningful file anchors while keeping its sections. Do not enumerate every source file. Update affected entries in the same task that adds, moves, removes, or changes responsibility for relevant files/contracts. Use targeted search if a dependency is absent from the map. Source code establishes actual behavior; this map helps locate it.
