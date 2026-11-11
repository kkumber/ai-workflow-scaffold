const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const sourceRoot = path.resolve(__dirname, '..');
const statePath = '.ai-workflow-scaffold/state.json';
const lockPath = '.ai-workflow-scaffold/update.lock';
const reusableFiles = [
  'README.md', 'AGENTS.md', 'PROJECT.md', 'ARCHITECTURE.md',
  '.codex/agents/backend.toml', '.codex/agents/frontend.toml', '.codex/agents/reviewer.toml',
  'tasks/README.md', 'tasks/_template/plans.md', 'tasks/_template/todo.md', 'tasks/_template/done.md',
];

function normalized(text) {
  return text.replace(/\r\n/g, '\n');
}

function documentFingerprint(text) {
  return crypto.createHash('sha256').update(normalized(text), 'utf8').digest('hex');
}

function fingerprint(packageRoot) {
  const templates = [...reusableFiles].sort().map(function readTemplate(relativePath) {
    return [relativePath, normalized(fs.readFileSync(path.join(packageRoot, relativePath), 'utf8'))];
  });
  return crypto.createHash('sha256').update(JSON.stringify(templates), 'utf8').digest('hex');
}

function baseText(relativePath) {
  const lines = ['# Fixture document: ' + relativePath];
  for (let line = 1; line <= 25; line += 1) {
    lines.push('Guidance line ' + String(line).padStart(2, '0') + ': stable scaffold instruction.');
  }
  return lines.join('\n') + '\n';
}

function changeLine(text, line, replacement) {
  const lines = normalized(text).split('\n');
  lines[line] = replacement;
  return lines.join('\n');
}

function writeFile(root, relativePath, content) {
  const destination = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content);
}

function createPackage(temporaryRoot, name, version, replacements = {}) {
  const packageRoot = path.join(temporaryRoot, name);
  fs.mkdirSync(path.join(packageRoot, 'bin'), { recursive: true });
  fs.copyFileSync(path.join(sourceRoot, 'bin', 'ai-workflow-scaffold.cjs'), path.join(packageRoot, 'bin', 'ai-workflow-scaffold.cjs'));
  const libraryRoot = path.join(sourceRoot, 'lib');
  if (fs.existsSync(libraryRoot)) {
    fs.cpSync(libraryRoot, path.join(packageRoot, 'lib'), { recursive: true });
  }
  writeFile(packageRoot, 'package.json', JSON.stringify({ name: 'ai-workflow-scaffold', version: version }));
  for (const relativePath of reusableFiles) {
    let text = baseText(relativePath);
    if (Object.hasOwn(replacements, relativePath)) {
      text = replacements[relativePath];
    }
    writeFile(packageRoot, relativePath, text);
  }
  // Real source history is deliberately present in the package fixture, but must never be installed.
  writeFile(packageRoot, 'tasks/TASK-999-source-only/done.md', 'Source maintenance history\n');
  return packageRoot;
}

function workspace(testContext) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-updates-test-'));
  const projectRoot = path.join(temporaryRoot, 'receiving project');
  fs.mkdirSync(projectRoot);
  testContext.after(function removeFixture() {
    assert.equal(path.dirname(temporaryRoot), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temporaryRoot).startsWith('scaffold-updates-test-'));
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  });
  return {
    temporaryRoot: temporaryRoot,
    projectRoot: projectRoot,
    v1: createPackage(temporaryRoot, 'version one', '1.0.0'),
  };
}

function run(packageRoot, projectRoot, argumentsList = [], environment = process.env) {
  const result = spawnSync(process.execPath, [path.join(packageRoot, 'bin', 'ai-workflow-scaffold.cjs'), ...argumentsList], {
    cwd: projectRoot,
    env: environment,
    encoding: 'utf8',
    timeout: 15000,
  });
  assert.equal(result.error, undefined, 'The real CLI subprocess must run, not fail to launch.');
  return result;
}

function succeeds(result) {
  assert.equal(result.status, 0, result.stderr + result.stdout);
}

function conflicts(result) {
  assert.equal(result.status, 2, result.stderr + result.stdout);
}

function readState(projectRoot) {
  const target = path.join(projectRoot, statePath);
  assert.equal(fs.existsSync(target), true, 'Initialization must create managed-update state; subsequent behavior was not reached.');
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function initialize(fixture) {
  succeeds(run(fixture.v1, fixture.projectRoot));
  return readState(fixture.projectRoot);
}

function entryFor(state, sourcePath) {
  const entry = state.files.find(function matches(candidate) {
    return candidate.sourcePath === sourcePath;
  });
  assert.ok(entry, 'State must contain ' + sourcePath);
  return entry;
}

function snapshot(directoryPath, relativeRoot = '') {
  const entries = {};
  for (const name of fs.readdirSync(directoryPath).sort()) {
    const fullPath = path.join(directoryPath, name);
    const relativePath = path.posix.join(relativeRoot, name);
    const information = fs.lstatSync(fullPath);
    if (information.isSymbolicLink()) {
      entries[relativePath] = { link: fs.readlinkSync(fullPath) };
    } else if (information.isDirectory()) {
      Object.assign(entries, snapshot(fullPath, relativePath));
    } else {
      entries[relativePath] = fs.readFileSync(fullPath).toString('base64');
    }
  }
  return entries;
}

function assertNoProjectChanges(fixture, operation) {
  const before = snapshot(fixture.projectRoot);
  const result = operation();
  assert.equal(result.status, 1, result.stderr + result.stdout);
  assert.deepEqual(snapshot(fixture.projectRoot), before, 'Failure must preserve every existing project byte and path.');
  return result;
}

function directoryLink(targetPath, linkPath) {
  let linkType = 'dir';
  if (process.platform === 'win32') {
    linkType = 'junction';
  }
  fs.symlinkSync(targetPath, linkPath, linkType);
}

function withoutGit(fixture) {
  const environment = { ...process.env };
  for (const key of Object.keys(environment)) {
    if (key.toLowerCase() === 'path') {
      delete environment[key];
    }
  }
  environment.PATH = path.join(fixture.temporaryRoot, 'empty-path');
  fs.mkdirSync(environment.PATH);
  return environment;
}

test('TC-U01 / AC-01: given copied, matching, and customized files, initialization records honest baselines', function (testContext) {
  const fixture = workspace(testContext);
  writeFile(fixture.projectRoot, 'AGENTS.md', 'Private receiving-project instructions\n');
  writeFile(fixture.projectRoot, 'PROJECT.md', baseText('PROJECT.md'));

  const state = initialize(fixture);

  assert.equal(state.schemaVersion, 1);
  assert.deepEqual(state.package, { version: '1.0.0', fingerprint: fingerprint(fixture.v1) });
  assert.equal(state.files.length, 11);
  assert.deepEqual(state.files.map(function source(entry) { return entry.sourcePath; }).sort(), [...reusableFiles].sort());
  assert.equal(entryFor(state, 'AGENTS.md').upstreamText, null);
  assert.equal(entryFor(state, 'AGENTS.md').upstreamIdentity, null);
  assert.equal(entryFor(state, 'PROJECT.md').upstreamText, baseText('PROJECT.md'));
  assert.deepEqual(entryFor(state, 'PROJECT.md').upstreamIdentity, { version: '1.0.0', fingerprint: documentFingerprint(baseText('PROJECT.md')) });
  assert.equal(entryFor(state, 'tasks/_template/plans.md').upstreamText, baseText('tasks/_template/plans.md'));
  assert.doesNotMatch(JSON.stringify(state), /Private receiving-project/);
  assert.equal(fs.existsSync(path.join(fixture.projectRoot, 'package.json')), false);
  assert.equal(fs.existsSync(path.join(fixture.projectRoot, 'tasks/TASK-999-source-only')), false);
  assert.equal(fs.existsSync(path.join(fixture.projectRoot, lockPath)), false);
});

test('TC-U02 / AC-01,AC-04,AC-06: given local edits and deletion with unchanged upstream, rerun preserves them and is idempotent', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', 'Project-specific setup with tutorial removed\n');
  fs.unlinkSync(path.join(fixture.projectRoot, 'tasks/README.md'));
  const before = snapshot(fixture.projectRoot);

  succeeds(run(fixture.v1, fixture.projectRoot));
  succeeds(run(fixture.v1, fixture.projectRoot, ['update']));

  assert.deepEqual(snapshot(fixture.projectRoot), before);
});

test('TC-U03 / AC-02: given unchanged local guidance, default rerun applies a newer upstream and advances its baseline', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const incoming = changeLine(baseText('README.md'), 20, 'New upstream installation instruction.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'README.md': incoming });

  succeeds(run(v2, fixture.projectRoot));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'README.md'), 'utf8'), incoming);
  const state = readState(fixture.projectRoot);
  assert.equal(entryFor(state, 'README.md').upstreamText, incoming);
  assert.equal(entryFor(state, 'README.md').upstreamIdentity.version, '2.0.0');
  assert.deepEqual(state.package, { version: '2.0.0', fingerprint: fingerprint(v2) });
});

test('TC-U04 / AC-02: given distant local and upstream edits, real Git merges both without saving local text in state', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const local = changeLine(baseText('PROJECT.md'), 3, 'Receiving project purpose: custom business.');
  const incoming = changeLine(baseText('PROJECT.md'), 22, 'New shared upstream workflow rule.');
  writeFile(fixture.projectRoot, 'PROJECT.md', local);
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': incoming });

  const result = run(v2, fixture.projectRoot, ['update']);

  succeeds(result);
  const merged = fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8');
  assert.equal(merged, changeLine(incoming, 3, 'Receiving project purpose: custom business.'));
  assert.match(result.stdout, /merg/i);
  assert.equal(entryFor(readState(fixture.projectRoot), 'PROJECT.md').upstreamText, incoming);
  assert.doesNotMatch(JSON.stringify(readState(fixture.projectRoot)), /custom business/);
});

test('TC-U05 / AC-02: given CRLF local files, updates and clean merges retain CRLF while comparing normalized text', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 3, 'Local CRLF purpose.').replace(/\n/g, '\r\n'));
  writeFile(fixture.projectRoot, 'README.md', baseText('README.md').replace(/\n/g, '\r\n'));
  const projectIncoming = changeLine(baseText('PROJECT.md'), 22, 'Upstream CRLF-compatible workflow.');
  const readmeIncoming = changeLine(baseText('README.md'), 20, 'Upstream installation update.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': projectIncoming, 'README.md': readmeIncoming });

  succeeds(run(v2, fixture.projectRoot, ['update']));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), changeLine(projectIncoming, 3, 'Local CRLF purpose.').replace(/\n/g, '\r\n'));
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'README.md'), 'utf8'), readmeIncoming.replace(/\n/g, '\r\n'));
});

test('TC-U06 / AC-04: given two revisions with the same version string, content identity detects the changed templates', function (testContext) {
  const fixture = workspace(testContext);
  const initialState = initialize(fixture);
  const incoming = changeLine(baseText('AGENTS.md'), 20, 'Same-version upstream rule change.');
  const v2 = createPackage(fixture.temporaryRoot, 'same version new content', '1.0.0', { 'AGENTS.md': incoming });

  succeeds(run(v2, fixture.projectRoot, ['update']));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'AGENTS.md'), 'utf8'), incoming);
  const state = readState(fixture.projectRoot);
  assert.equal(state.package.version, '1.0.0');
  assert.notEqual(state.package.fingerprint, initialState.package.fingerprint);
  assert.equal(state.package.fingerprint, fingerprint(v2));
});

test('TC-U07 / AC-03,AC-04: given overlapping edits, stage upstream without project markers while clean files update', function (testContext) {
  const fixture = workspace(testContext);
  const initialState = initialize(fixture);
  const local = changeLine(baseText('PROJECT.md'), 5, 'Local interpretation of the setup rule.');
  const incoming = changeLine(baseText('PROJECT.md'), 5, 'Upstream interpretation of the setup rule.');
  const cleanIncoming = changeLine(baseText('README.md'), 20, 'Independent installation update.');
  writeFile(fixture.projectRoot, 'PROJECT.md', local);
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': incoming, 'README.md': cleanIncoming });

  const result = run(v2, fixture.projectRoot, ['update']);

  conflicts(result);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), local);
  assert.doesNotMatch(local, /<<<<<<<|=======|>>>>>>>/);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'README.md'), 'utf8'), cleanIncoming);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, '.ai-workflow-scaffold/incoming/PROJECT.md'), 'utf8'), incoming);
  const state = readState(fixture.projectRoot);
  assert.deepEqual(entryFor(state, 'PROJECT.md').upstreamIdentity, entryFor(initialState, 'PROJECT.md').upstreamIdentity);
  assert.equal(entryFor(state, 'PROJECT.md').upstreamText, baseText('PROJECT.md'));
  assert.equal(entryFor(state, 'PROJECT.md').pending.text, incoming);
  assert.equal(entryFor(state, 'PROJECT.md').pending.identity.version, '2.0.0');
  assert.match(result.stdout + result.stderr, /PROJECT\.md/);
  assert.match(result.stdout + result.stderr, /incoming/);
  const afterConflict = snapshot(fixture.projectRoot);
  conflicts(run(v2, fixture.projectRoot, ['update']));
  assert.deepEqual(snapshot(fixture.projectRoot), afterConflict);
});

test('TC-U08 / AC-03,AC-04: given a manually merged pending revision, resolve under V3 acknowledges V2 then allows the next merge', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 5, 'Local rule.'));
  const incomingV2 = changeLine(baseText('PROJECT.md'), 5, 'Upstream V2 rule.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': incomingV2 });
  conflicts(run(v2, fixture.projectRoot, ['update']));
  const manuallyMerged = changeLine(incomingV2, 5, 'Manually combined local and upstream rule.');
  writeFile(fixture.projectRoot, 'PROJECT.md', manuallyMerged);
  const incomingV3 = changeLine(incomingV2, 22, 'New V3 shared instruction.');
  const v3 = createPackage(fixture.temporaryRoot, 'version three', '3.0.0', { 'PROJECT.md': incomingV3 });

  succeeds(run(v3, fixture.projectRoot, ['resolve', 'PROJECT.md']));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), manuallyMerged);
  const acknowledged = entryFor(readState(fixture.projectRoot), 'PROJECT.md');
  assert.equal(acknowledged.upstreamText, incomingV2);
  assert.equal(acknowledged.upstreamIdentity.version, '2.0.0');
  assert.equal(acknowledged.pending, null);
  succeeds(run(v3, fixture.projectRoot, ['update']));
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), changeLine(incomingV3, 5, 'Manually combined local and upstream rule.'));
});

test('TC-U09 / AC-01,AC-03: given legacy customized files, initialize unknown bases and stage one-time manual integration', function (testContext) {
  const fixture = workspace(testContext);
  writeFile(fixture.projectRoot, 'AGENTS.md', 'Legacy local policy with unknown original.\n');
  initialize(fixture);

  conflicts(run(fixture.v1, fixture.projectRoot, ['update']));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'AGENTS.md'), 'utf8'), 'Legacy local policy with unknown original.\n');
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, '.ai-workflow-scaffold/incoming/AGENTS.md'), 'utf8'), baseText('AGENTS.md'));
  const state = readState(fixture.projectRoot);
  assert.equal(entryFor(state, 'AGENTS.md').upstreamText, null);
  succeeds(run(fixture.v1, fixture.projectRoot, ['resolve', 'AGENTS.md']));
  assert.equal(entryFor(readState(fixture.projectRoot), 'AGENTS.md').upstreamText, baseText('AGENTS.md'));
});

test('TC-U10 / AC-03,AC-06: given a locally deleted document changed upstream, stage conflict and let resolve preserve deletion', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  fs.unlinkSync(path.join(fixture.projectRoot, 'tasks/README.md'));
  const incoming = changeLine(baseText('tasks/README.md'), 20, 'New task-operation instruction.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'tasks/README.md': incoming });

  conflicts(run(v2, fixture.projectRoot, ['update']));

  assert.equal(fs.existsSync(path.join(fixture.projectRoot, 'tasks/README.md')), false);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, '.ai-workflow-scaffold/incoming/tasks/README.md'), 'utf8'), incoming);
  succeeds(run(v2, fixture.projectRoot, ['resolve', 'tasks/README.md']));
  assert.equal(fs.existsSync(path.join(fixture.projectRoot, 'tasks/README.md')), false);
  succeeds(run(v2, fixture.projectRoot, ['update']));
  assert.equal(fs.existsSync(path.join(fixture.projectRoot, 'tasks/README.md')), false);
});

test('TC-U11 / AC-05: given no tracking, explicit update explains initialization and changes nothing', function (testContext) {
  const fixture = workspace(testContext);
  writeFile(fixture.projectRoot, 'AGENTS.md', 'Legacy instructions\n');
  const result = assertNoProjectChanges(fixture, function update() { return run(fixture.v1, fixture.projectRoot, ['update']); });
  assert.match(result.stderr, /tracking|state|initializ/i);
});

test('TC-U12 / AC-01,AC-05: given lowercase README, initialization and future updates keep its actual destination casing', function (testContext) {
  const fixture = workspace(testContext);
  writeFile(fixture.projectRoot, 'readme.md', baseText('README.md'));
  const state = initialize(fixture);
  assert.equal(entryFor(state, 'README.md').destinationPath, 'readme.md');
  const incoming = changeLine(baseText('README.md'), 20, 'Lowercase README upstream update.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'README.md': incoming });

  succeeds(run(v2, fixture.projectRoot, ['update']));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'readme.md'), 'utf8'), incoming);
  assert.deepEqual(fs.readdirSync(fixture.projectRoot).filter(function isReadme(name) { return name.toLowerCase() === 'readme.md'; }), ['readme.md']);
});

test('TC-U13 / AC-05: given multiple root README variants, reject initialization without choosing one', function (testContext) {
  const fixture = workspace(testContext);
  writeFile(fixture.projectRoot, 'README.md', 'Uppercase document\n');
  writeFile(fixture.projectRoot, 'readme.md', 'Lowercase document\n');
  const variants = fs.readdirSync(fixture.projectRoot).filter(function isReadme(name) { return name.toLowerCase() === 'readme.md'; });
  if (variants.length !== 2) {
    testContext.skip('Filesystem cannot represent separate README.md/readme.md entries; ambiguous-casing behavior not exercised.');
    return;
  }
  const result = assertNoProjectChanges(fixture, function initializeAmbiguousProject() { return run(fixture.v1, fixture.projectRoot); });
  assert.match(result.stderr, /README|ambiguous|multiple/i);
});

const invalidStates = [
  ['TC-U14', 'malformed JSON', function corrupt() { return '{not valid JSON'; }],
  ['TC-U15', 'unsupported schema', function corrupt(state) { state.schemaVersion = 2; return JSON.stringify(state); }],
  ['TC-U16', 'source traversal', function corrupt(state) { state.files[0].sourcePath = '../outside.md'; return JSON.stringify(state); }],
  ['TC-U17', 'destination traversal', function corrupt(state) { state.files[0].destinationPath = '../outside.md'; return JSON.stringify(state); }],
  ['TC-U18', 'unknown source', function corrupt(state) { state.files[0].sourcePath = 'secrets.md'; return JSON.stringify(state); }],
  ['TC-U19', 'missing managed entry', function corrupt(state) { state.files.pop(); return JSON.stringify(state); }],
  ['TC-U20', 'duplicate managed entry', function corrupt(state) { state.files.push(state.files[0]); return JSON.stringify(state); }],
  ['TC-U21', 'invalid package fingerprint', function corrupt(state) { state.package.fingerprint = 'not-a-sha256'; return JSON.stringify(state); }],
];

for (const [caseId, description, corrupt] of invalidStates) {
  test(caseId + ' / AC-05: given ' + description + ', update rejects untrusted tracking before writes', function (testContext) {
    const fixture = workspace(testContext);
    const state = initialize(fixture);
    writeFile(fixture.projectRoot, statePath, corrupt(state));
    const outsideFile = path.join(fixture.temporaryRoot, 'outside.md');
    fs.writeFileSync(outsideFile, 'Outside sentinel\n');
    const result = assertNoProjectChanges(fixture, function update() { return run(fixture.v1, fixture.projectRoot, ['update']); });
    assert.match(result.stderr, /state|schema|path|fingerprint|entry|source|JSON|tracking/i);
    assert.equal(fs.readFileSync(outsideFile, 'utf8'), 'Outside sentinel\n');
  });
}

test('TC-U22 / AC-05: given a metadata junction, initialization rejects it without touching the outside target', function (testContext) {
  const fixture = workspace(testContext);
  const outsideRoot = path.join(fixture.temporaryRoot, 'outside');
  fs.mkdirSync(outsideRoot);
  writeFile(outsideRoot, 'sentinel.md', 'Outside metadata target\n');
  directoryLink(outsideRoot, path.join(fixture.projectRoot, '.ai-workflow-scaffold'));
  const result = assertNoProjectChanges(fixture, function initializeLinkedMetadata() { return run(fixture.v1, fixture.projectRoot); });
  assert.match(result.stderr, /\.ai-workflow-scaffold|metadata|link/i);
  assert.deepEqual(fs.readdirSync(outsideRoot), ['sentinel.md']);
  assert.equal(fs.readFileSync(path.join(outsideRoot, 'sentinel.md'), 'utf8'), 'Outside metadata target\n');
});

test('TC-U23 / AC-05: given a linked incoming directory, reject all updates before changing independent clean files', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const outsideRoot = path.join(fixture.temporaryRoot, 'outside');
  fs.mkdirSync(outsideRoot);
  directoryLink(outsideRoot, path.join(fixture.projectRoot, '.ai-workflow-scaffold/incoming'));
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 5, 'Local changed rule.'));
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', {
    'PROJECT.md': changeLine(baseText('PROJECT.md'), 5, 'Upstream changed rule.'),
    'README.md': changeLine(baseText('README.md'), 20, 'Independent incoming change.'),
  });
  const result = assertNoProjectChanges(fixture, function update() { return run(v2, fixture.projectRoot, ['update']); });
  assert.match(result.stderr, /incoming|link/i);
  assert.deepEqual(fs.readdirSync(outsideRoot), []);
});

test('TC-U24 / AC-05: given an obstructed tracked destination, preflight rejects otherwise clean updates', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  fs.unlinkSync(path.join(fixture.projectRoot, 'PROJECT.md'));
  fs.mkdirSync(path.join(fixture.projectRoot, 'PROJECT.md'));
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'README.md': changeLine(baseText('README.md'), 20, 'New README rule.') });
  const result = assertNoProjectChanges(fixture, function update() { return run(v2, fixture.projectRoot, ['update']); });
  assert.match(result.stderr, /PROJECT\.md/);
});

test('TC-U25 / AC-03,AC-05: given edited incoming artifacts, resolve and replacement preserve them and reject acknowledgment', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 5, 'Local rule.'));
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': changeLine(baseText('PROJECT.md'), 5, 'Upstream rule.') });
  conflicts(run(v2, fixture.projectRoot, ['update']));
  writeFile(fixture.projectRoot, '.ai-workflow-scaffold/incoming/PROJECT.md', 'User edited the staged incoming artifact\n');
  assertNoProjectChanges(fixture, function resolve() { return run(v2, fixture.projectRoot, ['resolve', 'PROJECT.md']); });
  const v3 = createPackage(fixture.temporaryRoot, 'version three', '3.0.0', { 'PROJECT.md': changeLine(baseText('PROJECT.md'), 5, 'Latest upstream rule.') });
  assertNoProjectChanges(fixture, function update() { return run(v3, fixture.projectRoot, ['update']); });
});

test('TC-U26 / AC-05: given an existing update lock, reject overlap without removing another run\'s lock', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, lockPath, 'Existing run lock\n');
  const result = assertNoProjectChanges(fixture, function update() { return run(fixture.v1, fixture.projectRoot, ['update']); });
  assert.match(result.stderr, /lock/i);
  assert.match(result.stderr, /recover|manual|remove|running/i);
});

test('TC-U27 / AC-02,AC-05: given missing Git when a merge is required, fail safely without advancing state', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 3, 'Local project purpose.'));
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': changeLine(baseText('PROJECT.md'), 22, 'Upstream shared rule.') });
  const environment = withoutGit(fixture);
  const result = assertNoProjectChanges(fixture, function updateWithoutGit() { return run(v2, fixture.projectRoot, ['update'], environment); });
  assert.match(result.stderr, /git/i);
});

test('TC-U28 / AC-02: given missing Git and upstream-only edits, update succeeds without invoking a merge tool', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const incoming = changeLine(baseText('README.md'), 20, 'Upstream-only installation improvement.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'README.md': incoming });
  const environment = withoutGit(fixture);

  succeeds(run(v2, fixture.projectRoot, ['update'], environment));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'README.md'), 'utf8'), incoming);
});

test('TC-U29 / AC-05: given no pending conflict, resolve refuses to acknowledge an arbitrary document', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const result = assertNoProjectChanges(fixture, function resolve() { return run(fixture.v1, fixture.projectRoot, ['resolve', 'PROJECT.md']); });
  assert.match(result.stderr, /pending|conflict/i);
  assertNoProjectChanges(fixture, function traverse() { return run(fixture.v1, fixture.projectRoot, ['resolve', '../outside.md']); });
});

test('TC-U30 / AC-05: given empty project, help documents init/update/resolve and unsupported commands remain read-only', function (testContext) {
  const fixture = workspace(testContext);
  const result = run(fixture.v1, fixture.projectRoot, ['--help']);
  succeeds(result);
  assert.match(result.stdout, /update/);
  assert.match(result.stdout, /resolve/);
  assert.deepEqual(fs.readdirSync(fixture.projectRoot), []);
  assertNoProjectChanges(fixture, function invalidCommand() { return run(fixture.v1, fixture.projectRoot, ['replace-all']); });
});

test('TC-U31 / AC-05: given a baseline whose text no longer matches its fingerprint, reject state without writes', function (testContext) {
  const fixture = workspace(testContext);
  const state = initialize(fixture);
  entryFor(state, 'PROJECT.md').upstreamText = 'Corrupted saved upstream baseline\n';
  writeFile(fixture.projectRoot, statePath, JSON.stringify(state));
  const result = assertNoProjectChanges(fixture, function update() { return run(fixture.v1, fixture.projectRoot, ['update']); });
  assert.match(result.stderr, /fingerprint|baseline|state|identity/i);
});

test('TC-U32 / AC-03,AC-05: given corrupt pending text identity, reject resolve without acknowledging it', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 5, 'Local rule.'));
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': changeLine(baseText('PROJECT.md'), 5, 'Upstream rule.') });
  conflicts(run(v2, fixture.projectRoot, ['update']));
  const state = readState(fixture.projectRoot);
  entryFor(state, 'PROJECT.md').pending.text = 'Corrupted staged text\n';
  writeFile(fixture.projectRoot, statePath, JSON.stringify(state));
  const result = assertNoProjectChanges(fixture, function resolve() { return run(v2, fixture.projectRoot, ['resolve', 'PROJECT.md']); });
  assert.match(result.stderr, /pending|fingerprint|identity|state/i);
});

test('TC-U33 / AC-05: given a junction at state.json, initialization rejects the metadata leaf before copying', function (testContext) {
  const fixture = workspace(testContext);
  const outsideRoot = path.join(fixture.temporaryRoot, 'outside');
  fs.mkdirSync(outsideRoot);
  fs.mkdirSync(path.join(fixture.projectRoot, '.ai-workflow-scaffold'));
  directoryLink(outsideRoot, path.join(fixture.projectRoot, statePath));
  assertNoProjectChanges(fixture, function initializeLinkedState() { return run(fixture.v1, fixture.projectRoot); });
  assert.deepEqual(fs.readdirSync(outsideRoot), []);
});

test('TC-U34 / AC-01,AC-05: given a README renamed after tracking, update discovers its new casing and saves it', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  // Use a temporary name so case-only renaming is observable on case-insensitive filesystems.
  fs.renameSync(path.join(fixture.projectRoot, 'README.md'), path.join(fixture.projectRoot, 'readme-moving.md'));
  fs.renameSync(path.join(fixture.projectRoot, 'readme-moving.md'), path.join(fixture.projectRoot, 'readme.md'));
  const incoming = changeLine(baseText('README.md'), 20, 'README update after case-only rename.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'README.md': incoming });

  succeeds(run(v2, fixture.projectRoot, ['update']));

  assert.equal(entryFor(readState(fixture.projectRoot), 'README.md').destinationPath, 'readme.md');
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'readme.md'), 'utf8'), incoming);
  assert.deepEqual(fs.readdirSync(fixture.projectRoot).filter(function isReadme(name) { return name.toLowerCase() === 'readme.md'; }), ['readme.md']);
});

test('TC-U35 / AC-03,AC-05: given lowercase README destination, report and accept canonical README.md for resolve', function (testContext) {
  const fixture = workspace(testContext);
  writeFile(fixture.projectRoot, 'readme.md', 'Existing custom README\n');
  initialize(fixture);

  const result = run(fixture.v1, fixture.projectRoot, ['update']);

  conflicts(result);
  assert.match(result.stdout + result.stderr, /readme\.md/);
  assert.match(result.stdout + result.stderr, /resolve\s+README\.md/);
  succeeds(run(fixture.v1, fixture.projectRoot, ['resolve', 'README.md']));
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'readme.md'), 'utf8'), 'Existing custom README\n');
  assert.equal(entryFor(readState(fixture.projectRoot), 'README.md').pending, null);
});

test('TC-U36 / AC-03,AC-05: given unrecognized incoming content, reject collision before any clean project updates', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, '.ai-workflow-scaffold/incoming/PROJECT.md', 'Unrecognized user review artifact\n');
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 5, 'Local changed rule.'));
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', {
    'PROJECT.md': changeLine(baseText('PROJECT.md'), 5, 'Upstream changed rule.'),
    'README.md': changeLine(baseText('README.md'), 20, 'Independent incoming change.'),
  });
  const result = assertNoProjectChanges(fixture, function update() { return run(v2, fixture.projectRoot, ['update']); });
  assert.match(result.stderr, /incoming|artifact|recogniz|edited/i);
});

test('TC-U37 / AC-03,AC-04: given a resolved artifact matching accepted upstream, a later conflict may safely replace it', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  writeFile(fixture.projectRoot, 'PROJECT.md', changeLine(baseText('PROJECT.md'), 5, 'Local rule.'));
  const upstreamV2 = changeLine(baseText('PROJECT.md'), 5, 'Upstream V2 rule.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': upstreamV2 });
  conflicts(run(v2, fixture.projectRoot, ['update']));
  const local = changeLine(upstreamV2, 5, 'Manually combined rule.');
  writeFile(fixture.projectRoot, 'PROJECT.md', local);
  succeeds(run(v2, fixture.projectRoot, ['resolve', 'PROJECT.md']));
  // Resolved incoming artifacts may be retained or removed; either is safe before the next conflict.
  const upstreamV3 = changeLine(upstreamV2, 5, 'Upstream V3 changed rule.');
  const v3 = createPackage(fixture.temporaryRoot, 'version three', '3.0.0', { 'PROJECT.md': upstreamV3 });

  conflicts(run(v3, fixture.projectRoot, ['update']));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), local);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, '.ai-workflow-scaffold/incoming/PROJECT.md'), 'utf8'), upstreamV3);
  assert.equal(entryFor(readState(fixture.projectRoot), 'PROJECT.md').upstreamText, upstreamV2);
  assert.equal(entryFor(readState(fixture.projectRoot), 'PROJECT.md').pending.text, upstreamV3);
});

test('TC-U38 / AC-02,AC-04: given local content already equal to incoming, advance its base without Git or document changes', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const incoming = changeLine(baseText('PROJECT.md'), 20, 'Already integrated upstream rule.');
  writeFile(fixture.projectRoot, 'PROJECT.md', incoming);
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': incoming });

  succeeds(run(v2, fixture.projectRoot, ['update'], withoutGit(fixture)));

  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), incoming);
  assert.equal(entryFor(readState(fixture.projectRoot), 'PROJECT.md').upstreamText, incoming);
});

test('TC-U39 / AC-03,AC-04: given a newer pending conflict, selecting the older accepted revision still reports unresolved review', function (testContext) {
  const fixture = workspace(testContext);
  initialize(fixture);
  const local = changeLine(baseText('PROJECT.md'), 5, 'Local interpretation of the rule.');
  writeFile(fixture.projectRoot, 'PROJECT.md', local);
  const incomingV2 = changeLine(baseText('PROJECT.md'), 5, 'Upstream V2 interpretation.');
  const v2 = createPackage(fixture.temporaryRoot, 'version two', '2.0.0', { 'PROJECT.md': incomingV2 });
  conflicts(run(v2, fixture.projectRoot, ['update']));
  const originalPending = entryFor(readState(fixture.projectRoot), 'PROJECT.md').pending;

  const result = run(fixture.v1, fixture.projectRoot, ['update']);

  conflicts(result);
  assert.match(result.stdout + result.stderr, /Conflict.*PROJECT\.md/);
  assert.match(result.stdout + result.stderr, /incoming[\\/]PROJECT\.md/);
  assert.match(result.stdout + result.stderr, /resolve\s+PROJECT\.md/);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, 'PROJECT.md'), 'utf8'), local);
  assert.equal(fs.readFileSync(path.join(fixture.projectRoot, '.ai-workflow-scaffold/incoming/PROJECT.md'), 'utf8'), incomingV2);
  const unresolved = entryFor(readState(fixture.projectRoot), 'PROJECT.md');
  assert.deepEqual(unresolved.pending, originalPending);
  assert.equal(unresolved.upstreamText, baseText('PROJECT.md'));
  succeeds(run(fixture.v1, fixture.projectRoot, ['resolve', 'PROJECT.md']));
  const acknowledged = entryFor(readState(fixture.projectRoot), 'PROJECT.md');
  assert.equal(acknowledged.upstreamText, incomingV2);
  assert.equal(acknowledged.upstreamIdentity.version, '2.0.0');
  assert.equal(acknowledged.pending, null);
});
