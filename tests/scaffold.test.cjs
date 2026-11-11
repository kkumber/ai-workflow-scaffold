const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const scaffoldRoot = path.resolve(__dirname, '..');
const executablePath = path.join(scaffoldRoot, 'bin', 'ai-workflow-scaffold.cjs');
const reusableFiles = [
  'README.md',
  'AGENTS.md',
  'PROJECT.md',
  'ARCHITECTURE.md',
  'agents/backend.md',
  'agents/frontend.md',
  'agents/reviewer.md',
  'tasks/README.md',
  'tasks/_template/plans.md',
  'tasks/_template/todo.md',
  'tasks/_template/done.md',
];

function createWorkspace(testContext) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'ai-workflow-scaffold-test-'));
  const projectRoot = path.join(temporaryRoot, 'project with spaces');
  fs.mkdirSync(projectRoot);
  testContext.after(function removeWorkspace() {
    // Delete only the unique directory created by this test, never the fixture target alone.
    assert.equal(path.dirname(temporaryRoot), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temporaryRoot).startsWith('ai-workflow-scaffold-test-'));
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  });
  return { temporaryRoot: temporaryRoot, projectRoot: projectRoot };
}

function runCommand(projectRoot, argumentsList = []) {
  const result = spawnSync(process.execPath, [executablePath, ...argumentsList], {
    cwd: projectRoot,
    encoding: 'utf8',
    timeout: 10000,
  });
  assert.equal(result.error, undefined, 'The CLI subprocess must start and finish normally.');
  assert.doesNotMatch(
    result.stderr,
    /MODULE_NOT_FOUND|Cannot find module/,
    'The proposed CLI entry point is missing; no behavior assertion was reached.',
  );
  return result;
}

function listFiles(directoryPath, relativeRoot = '') {
  const files = [];
  for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
    const relativePath = path.posix.join(relativeRoot, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(path.join(directoryPath, entry.name), relativePath));
    } else {
      files.push(relativePath);
    }
  }
  return files.sort();
}

function assertSuccessful(result) {
  assert.equal(result.status, 0, result.stderr);
}

function assertRejected(result, destinationPattern) {
  assert.notEqual(result.status, 0, 'Conflicting destinations must cause a nonzero exit status.');
  assert.match(result.stderr, destinationPattern, 'The error must identify the conflicting destination.');
}

test('TC-04 / TASK-004 AC-01: an empty project receives eleven documents and managed-update state', function (testContext) {
  const workspace = createWorkspace(testContext);
  const result = runCommand(workspace.projectRoot);

  assertSuccessful(result);
  assert.deepEqual(listFiles(workspace.projectRoot), [...reusableFiles, '.ai-workflow-scaffold/state.json'].sort());
  for (const relativePath of reusableFiles) {
    assert.deepEqual(
      fs.readFileSync(path.join(workspace.projectRoot, relativePath)),
      fs.readFileSync(path.join(scaffoldRoot, relativePath)),
      relativePath + ' must be copied faithfully.',
    );
    assert.ok(result.stdout.includes(relativePath), 'The report must name ' + relativePath);
  }
});

test('TC-05 / AC-06: existing guidance and application files survive while missing guidance is copied', function (testContext) {
  const workspace = createWorkspace(testContext);
  const existingFiles = {
    'AGENTS.md': 'Existing project instructions\n',
    'README.md': 'Existing application setup\n',
    'package.json': '{"name":"receiving-project","private":true}\n',
    'agents/backend.md': 'Existing backend policy\n',
  };
  fs.mkdirSync(path.join(workspace.projectRoot, 'agents'));
  for (const [relativePath, content] of Object.entries(existingFiles)) {
    fs.writeFileSync(path.join(workspace.projectRoot, relativePath), content);
  }

  const result = runCommand(workspace.projectRoot);

  assertSuccessful(result);
  for (const [relativePath, content] of Object.entries(existingFiles)) {
    assert.equal(fs.readFileSync(path.join(workspace.projectRoot, relativePath), 'utf8'), content);
  }
  assert.equal(fs.existsSync(path.join(workspace.projectRoot, 'tasks', '_template', 'plans.md')), true);
  assert.match(result.stdout, /preserv|skip|merge|exist/i);
  assert.match(result.stdout, /AGENTS\.md/);
  assert.match(result.stdout, /README\.md/);
  assert.match(result.stdout, /agents[\\/]backend\.md/);
});

test('TC-06 / AC-06: a lowercase root readme is preserved without creating a second README', function (testContext) {
  const workspace = createWorkspace(testContext);
  fs.writeFileSync(path.join(workspace.projectRoot, 'readme.md'), 'Custom lowercase README\n');

  const result = runCommand(workspace.projectRoot);

  assertSuccessful(result);
  assert.equal(fs.readFileSync(path.join(workspace.projectRoot, 'readme.md'), 'utf8'), 'Custom lowercase README\n');
  const readmeNames = fs.readdirSync(workspace.projectRoot).filter(function isReadme(name) {
    return name.toLowerCase() === 'readme.md';
  });
  assert.deepEqual(readmeNames, ['readme.md']);
  assert.match(result.stdout, /readme\.md/i);
  assert.match(result.stdout, /preserv|skip|merge|exist/i);
});

test('TC-07 / AC-06: rerunning preserves edited guidance and adds no extra files', function (testContext) {
  const workspace = createWorkspace(testContext);
  assertSuccessful(runCommand(workspace.projectRoot));
  fs.writeFileSync(path.join(workspace.projectRoot, 'PROJECT.md'), 'Project-specific context\n');
  const beforeContents = new Map();
  for (const relativePath of listFiles(workspace.projectRoot)) {
    beforeContents.set(relativePath, fs.readFileSync(path.join(workspace.projectRoot, relativePath), 'utf8'));
  }

  const result = runCommand(workspace.projectRoot);

  assertSuccessful(result);
  assert.deepEqual(listFiles(workspace.projectRoot), [...beforeContents.keys()]);
  for (const [relativePath, content] of beforeContents) {
    assert.equal(fs.readFileSync(path.join(workspace.projectRoot, relativePath), 'utf8'), content);
  }
  assert.match(result.stdout, /preserv|skip|merge|exist/i);
});

test('TC-08 / AC-07: a file obstructing the tasks directory rejects setup before any copy', function (testContext) {
  const workspace = createWorkspace(testContext);
  fs.writeFileSync(path.join(workspace.projectRoot, 'tasks'), 'Do not replace this file\n');

  const result = runCommand(workspace.projectRoot);

  assertRejected(result, /tasks/i);
  assert.deepEqual(fs.readdirSync(workspace.projectRoot), ['tasks']);
  assert.equal(fs.readFileSync(path.join(workspace.projectRoot, 'tasks'), 'utf8'), 'Do not replace this file\n');
});

test('TC-09 / AC-07: a linked parent is rejected without writing into or outside the project', function (testContext) {
  const workspace = createWorkspace(testContext);
  const outsideRoot = path.join(workspace.temporaryRoot, 'outside');
  fs.mkdirSync(outsideRoot);
  fs.writeFileSync(path.join(outsideRoot, 'sentinel.txt'), 'Outside content\n');
  let linkType = 'dir';
  if (process.platform === 'win32') {
    linkType = 'junction';
  }
  fs.symlinkSync(outsideRoot, path.join(workspace.projectRoot, 'agents'), linkType);

  const result = runCommand(workspace.projectRoot);

  assertRejected(result, /agents/i);
  assert.deepEqual(fs.readdirSync(workspace.projectRoot), ['agents']);
  assert.equal(fs.lstatSync(path.join(workspace.projectRoot, 'agents')).isSymbolicLink(), true);
  assert.deepEqual(fs.readdirSync(outsideRoot), ['sentinel.txt']);
  assert.equal(fs.readFileSync(path.join(outsideRoot, 'sentinel.txt'), 'utf8'), 'Outside content\n');
});

test('TC-10 / AC-07: a linked managed destination is rejected before any copy', function (testContext) {
  const workspace = createWorkspace(testContext);
  const outsideRoot = path.join(workspace.temporaryRoot, 'outside');
  fs.mkdirSync(outsideRoot);
  let linkType = 'dir';
  if (process.platform === 'win32') {
    linkType = 'junction';
  }
  // A directory link at a document path exercises link rejection without Windows file-symlink privileges.
  fs.symlinkSync(outsideRoot, path.join(workspace.projectRoot, 'PROJECT.md'), linkType);

  const result = runCommand(workspace.projectRoot);

  assertRejected(result, /PROJECT\.md/i);
  assert.deepEqual(fs.readdirSync(workspace.projectRoot), ['PROJECT.md']);
  assert.equal(fs.lstatSync(path.join(workspace.projectRoot, 'PROJECT.md')).isSymbolicLink(), true);
  assert.deepEqual(fs.readdirSync(outsideRoot), []);
});

test('TC-11 / AC-08: help describes setup without writing project files', function (testContext) {
  const workspace = createWorkspace(testContext);

  const result = runCommand(workspace.projectRoot, ['--help']);

  assertSuccessful(result);
  assert.match(result.stdout, /usage|ai-workflow-scaffold/i);
  assert.match(result.stdout, /preserv|skip|overwrite/i);
  assert.deepEqual(fs.readdirSync(workspace.projectRoot), []);
});

test('TC-12 / AC-08: unsupported arguments fail with an explanation and no project writes', function (testContext) {
  const workspace = createWorkspace(testContext);

  const result = runCommand(workspace.projectRoot, ['--force']);

  assertRejected(result, /--force|unknown|unsupported|usage/i);
  assert.deepEqual(fs.readdirSync(workspace.projectRoot), []);
});

test('TC-13 / AC-07: a file symlink at a managed destination is rejected without changing its target', function (testContext) {
  const workspace = createWorkspace(testContext);
  const outsideFile = path.join(workspace.temporaryRoot, 'outside-project-context.md');
  fs.writeFileSync(outsideFile, 'Outside project context\n');
  fs.symlinkSync(outsideFile, path.join(workspace.projectRoot, 'PROJECT.md'), 'file');

  const result = runCommand(workspace.projectRoot);

  assertRejected(result, /PROJECT\.md/i);
  assert.deepEqual(fs.readdirSync(workspace.projectRoot), ['PROJECT.md']);
  assert.equal(fs.lstatSync(path.join(workspace.projectRoot, 'PROJECT.md')).isSymbolicLink(), true);
  assert.equal(fs.readFileSync(outsideFile, 'utf8'), 'Outside project context\n');
});
