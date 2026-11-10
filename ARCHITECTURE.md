# Architecture and navigation map

## Verified workflow files

This map covers the workflow files created by this template, not every possible item in the repository. No application architecture has been inferred.

```text
AGENTS.md                         <-- orchestrator, shared constraints, test-first gate
PROJECT.md                        <-- current context and adoption fields
ARCHITECTURE.md                    <-- this navigation and ownership guide
agents/
  backend.md                      <-- backend behavior and test ownership
  frontend.md                     <-- UI behavior, presentation, and test ownership
  reviewer.md                     <-- read-only test and implementation review
tasks/
  README.md                       <-- adoption, execution, and resume guide
  _template/
    plans.md                      <-- canonical task/step/case/checkpoint form
    todo.md                       <-- pending work and next-action form
    done.md                       <-- completion evidence form; no completed examples
  TASK-001-bootstrap-workflow/
    plans.md                      <-- authorized template creation plan
    todo.md                       <-- remaining bootstrap work, if any
    done.md                       <-- actual validation and completion evidence
  TASK-002-portable-setup/
    plans.md                      <-- portability findings and first-use changes
    todo.md                       <-- remaining review/setup-documentation work
    done.md                       <-- validation and finding resolutions
```

## Entry points and relationships

- Start at [AGENTS.md](AGENTS.md). Read [PROJECT.md](PROJECT.md) for concrete project constraints and consult this map to find relevant files.
- All agents first read every project-owned Markdown file as required by AGENTS.md, then use the first-use setup protocol if applicable. Only the orchestrator adapts guidelines. Use [backend](agents/backend.md) or [frontend](agents/frontend.md) responsibilities only for affected work. [Reviewer](agents/reviewer.md) instructions govern read-only evaluation of cases and changes.
- [tasks/README.md](tasks/README.md) explains copying [plans.md](tasks/_template/plans.md), [todo.md](tasks/_template/todo.md), and [done.md](tasks/_template/done.md) into one task folder.
- Active plans define scope and approved expectations. Todo entries reference the plan; done entries preserve completed IDs and actual evidence. No separate test-report store or approval service exists.
- [Bootstrap plan](tasks/TASK-001-bootstrap-workflow/plans.md), [pending ledger](tasks/TASK-001-bootstrap-workflow/todo.md), and [completion evidence](tasks/TASK-001-bootstrap-workflow/done.md) document this repository's initial setup. They are history, not task forms or approval for future work.
- [Portability plan](tasks/TASK-002-portable-setup/plans.md), [pending work](tasks/TASK-002-portable-setup/todo.md), and [review evidence](tasks/TASK-002-portable-setup/done.md) document the first-use instruction review. These source-history entries must be removed from the receiving map if those task folders are not copied; never create fictional history just to satisfy a link.

## First-use mapping

PROJECT.md holds the setup state, target identity, inspected evidence, concrete ownership paths, and established/configured commands. This map supplies navigation, not a second setup-state store. During first use, edit existing tree entries, annotations, entry-point references, and source-only wording to match inspected files. Preserve the map's sections and shared workflow relationships. Add or remove individual entries as the actual structure requires; do not regenerate unrelated guidance. Never copy the illustrative application paths below into the verified map without evidence.

For a blank project, record the observed empty application areas and unresolved stack/layout instead of generating a preferred framework. For monorepos, name the selected workspace and relevant shared boundaries; resolve an ambiguous target first. A bounded structure scan is allowed for mapping; routine source inspection stays targeted.

## Ownership and contracts

The orchestrator owns workflow documents, project/map maintenance, and task ledgers. Backend and frontend own application files according to PROJECT.md and each active plan. Reviewer owns no editable paths. Shared application contracts and configuration receive one named owner per affected file in the plan; cross-role changes use sequential handoffs.

The Markdown task forms are the only interfaces provided here. There are no established application routes, schemas, shared runtime types, or executable agent registrations in this template.

## Tests and commands

No automated application test runner or build command is established by the template. Task cases and evidence live in the corresponding plans/todo/done records. Inspect the adopting project's actual test configuration and record verified commands in PROJECT.md; do not run placeholder commands. Bootstrap document validation evidence belongs in its done.md.

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
