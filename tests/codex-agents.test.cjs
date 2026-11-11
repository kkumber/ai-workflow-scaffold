const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const sourceRoot = path.resolve(__dirname, '..');
const roles = ['backend', 'frontend', 'reviewer'];
const guides = ['README.md', 'AGENTS.md', 'PROJECT.md', 'ARCHITECTURE.md', 'tasks/README.md', 'tasks/_template/plans.md', 'tasks/_template/todo.md', 'tasks/_template/done.md'];
const legacyFiles = [...guides, ...roles.map(function (role) { return 'agents/' + role + '.md'; })];
const currentFiles = [...guides, ...roles.map(function (role) { return '.codex/agents/' + role + '.toml'; })];
const statePath = '.ai-workflow-scaffold/state.json';
const backupPath = '.ai-workflow-scaffold/pre-codex-agents-state.json';

function hash(text) {
  return crypto.createHash('sha256').update(text.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

function write(root, relativePath, text) {
  const file = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

function read(root, relativePath) {
  const file = path.join(root, relativePath);
  assert.ok(fs.existsSync(file), 'Expected role or migration artifact is missing: ' + relativePath);
  return fs.readFileSync(file, 'utf8');
}

function roleTemplate(role) {
  let effort = 'medium';
  if (role === 'reviewer') effort = 'high';
  const instructions = Array.from({ length: 24 }, function (_, index) { return role + ' stable guidance ' + index; }).join('\n');
  return 'name = "' + role + '"\ndescription = "' + role + ' fixture"\nmodel_reasoning_effort = "' + effort + '"\ndeveloper_instructions = """\n' + instructions + '\n"""\n';
}

// Existing suite helpers are private and assume a single layout. These fixtures model both published layouts.
function fixture(testContext) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'codex-role-migration-'));
  const project = path.join(temporaryRoot, 'receiving project');
  const upstream = path.join(temporaryRoot, 'upstream');
  fs.mkdirSync(project);
  fs.mkdirSync(upstream);
  testContext.after(function cleanup() {
    assert.equal(path.dirname(temporaryRoot), path.resolve(os.tmpdir()));
    assert.ok(path.basename(temporaryRoot).startsWith('codex-role-migration-'));
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  });
  for (const directory of ['bin', 'lib']) {
    fs.cpSync(path.join(sourceRoot, directory), path.join(upstream, directory), { recursive: true });
  }
  write(upstream, 'package.json', JSON.stringify({ name: 'ai-workflow-scaffold', version: '0.3.0' }));
  // Old files coexist only in this test package to let the pre-change runtime reach its real old behavior.
  for (const file of legacyFiles) write(upstream, file, '# Original ' + file + '\n');
  for (const role of roles) write(upstream, '.codex/agents/' + role + '.toml', roleTemplate(role));
  return { temporaryRoot: temporaryRoot, project: project, upstream: upstream };
}

function run(item, argumentsList = []) {
  const result = spawnSync(process.execPath, [path.join(item.upstream, 'bin/ai-workflow-scaffold.cjs'), ...argumentsList], {
    cwd: item.project, encoding: 'utf8', timeout: 15000,
  });
  assert.equal(result.error, undefined, String(result.error));
  return result;
}

function seedLegacy(item) {
  const texts = legacyFiles.map(function (file) { return [file, read(item.upstream, file)]; });
  const state = {
    schemaVersion: 1,
    package: { version: '0.2.0', fingerprint: hash(JSON.stringify([...texts].sort())) },
    files: texts.map(function ([sourcePath, text]) {
      write(item.project, sourcePath, text);
      return { sourcePath: sourcePath, destinationPath: sourcePath, upstreamText: text, upstreamIdentity: { version: '0.2.0', fingerprint: hash(text) }, pending: null };
    }),
  };
  const bytes = JSON.stringify(state, null, 2) + '\n';
  write(item.project, statePath, bytes);
  return bytes;
}

function snapshot(directory, prefix = '') {
  const result = {};
  for (const name of fs.readdirSync(directory).sort()) {
    const file = path.join(directory, name);
    const relativePath = path.posix.join(prefix, name);
    const information = fs.lstatSync(file);
    if (information.isSymbolicLink()) result[relativePath] = { link: fs.readlinkSync(file) };
    else if (information.isDirectory()) Object.assign(result, snapshot(file, relativePath));
    else result[relativePath] = fs.readFileSync(file).toString('base64');
  }
  return result;
}

function rejectsWithoutWrites(item, argumentsList = []) {
  const before = snapshot(item.project);
  const result = run(item, argumentsList);
  assert.equal(result.status, 1, result.stderr + result.stdout);
  assert.deepEqual(snapshot(item.project), before);
  return result;
}

function junction(target, destination) {
  let type = 'dir';
  if (process.platform === 'win32') type = 'junction';
  fs.symlinkSync(target, destination, type);
}

test('TC-C01 / AC-01: source roles use Codex fields, requested efforts and no model override', function () {
  for (const role of roles) {
    const file = path.join(sourceRoot, '.codex/agents/' + role + '.toml');
    assert.ok(fs.existsSync(file), 'The requested Codex role file is missing: ' + role);
    const text = fs.readFileSync(file, 'utf8');
    assert.match(text, new RegExp('^name = "' + role + '"$', 'm'));
    assert.match(text, /^description = ".+"$/m);
    let effort = 'medium';
    if (role === 'reviewer') effort = 'high';
    assert.match(text, new RegExp('^model_reasoning_effort = "' + effort + '"$', 'm'));
    assert.match(text, /^developer_instructions = ("""|''')/m);
    assert.doesNotMatch(text, /^(model|model_provider|sandbox_mode|approval_policy)\s*=/m);
    assert.match(text, /\.\.\/\.\.\/AGENTS\.md/);
  }
});

test('TC-C02 / AC-02: fresh init copies only current roles and leaves other Codex settings intact', function (testContext) {
  const item = fixture(testContext);
  const settings = '# User-owned model/session settings\n[agents]\nenabled = true\n';
  write(item.project, '.codex/config.toml', settings);
  const result = run(item);
  assert.equal(result.status, 0, result.stderr);
  for (const file of currentFiles) assert.equal(read(item.project, file), read(item.upstream, file));
  for (const role of roles) assert.equal(fs.existsSync(path.join(item.project, 'agents/' + role + '.md')), false);
  assert.equal(read(item.project, '.codex/config.toml'), settings);
});

test('TC-C03 / AC-03: legacy migration backs up exact state and stages TOML while preserving old and new custom roles', function (testContext) {
  const item = fixture(testContext);
  const originalState = seedLegacy(item);
  write(item.project, 'agents/backend.md', 'Custom legacy backend rules\n');
  write(item.project, '.codex/agents/frontend.toml', 'Custom pre-existing Codex frontend draft\n');
  const result = run(item, ['update']);
  assert.equal(result.status, 2, result.stderr + result.stdout);
  assert.equal(read(item.project, backupPath), originalState);
  assert.equal(read(item.project, 'agents/backend.md'), 'Custom legacy backend rules\n');
  assert.equal(read(item.project, '.codex/agents/frontend.toml'), 'Custom pre-existing Codex frontend draft\n');
  assert.equal(fs.existsSync(path.join(item.project, '.codex/agents/backend.toml')), false);
  const state = JSON.parse(read(item.project, statePath));
  assert.deepEqual(state.files.map(function (entry) { return entry.sourcePath; }).sort(), [...currentFiles].sort());
  for (const role of roles) {
    const sourcePath = '.codex/agents/' + role + '.toml';
    assert.equal(read(item.project, '.ai-workflow-scaffold/incoming/' + sourcePath), read(item.upstream, sourcePath));
    const entry = state.files.find(function (entry) { return entry.sourcePath === sourcePath; });
    assert.equal(entry.upstreamText, null);
    assert.equal(entry.pending.text, read(item.upstream, sourcePath));
    assert.ok((result.stdout + result.stderr).includes('resolve ' + sourcePath));
    assert.ok((result.stdout + result.stderr).includes('agents/' + role + '.md'));
  }
});

test('TC-C04 / AC-03: staged migration repeats safely, resolves manual role integration, then supports future updates', function (testContext) {
  const item = fixture(testContext);
  seedLegacy(item);
  assert.equal(run(item, ['update']).status, 2);
  const before = snapshot(item.project);
  assert.equal(run(item, ['update']).status, 2);
  assert.deepEqual(snapshot(item.project), before);
  for (const role of roles) {
    const sourcePath = '.codex/agents/' + role + '.toml';
    const merged = read(item.project, '.ai-workflow-scaffold/incoming/' + sourcePath).replace('developer_instructions = """\n', 'developer_instructions = """\nCustom receiving role rule.\n');
    write(item.project, sourcePath, merged);
    const resolved = run(item, ['resolve', sourcePath]);
    assert.equal(resolved.status, 0, resolved.stderr);
    assert.equal(read(item.project, sourcePath), merged);
  }
  const frontend = '.codex/agents/frontend.toml';
  write(item.upstream, frontend, read(item.upstream, frontend) + '\n# New upstream frontend comment\n');
  const updated = run(item, ['update']);
  assert.equal(updated.status, 0, updated.stderr + updated.stdout);
  assert.match(read(item.project, frontend), /Custom receiving role rule/);
  assert.match(read(item.project, frontend), /New upstream frontend comment/);
  assert.ok(fs.existsSync(path.join(item.project, backupPath)));
});

test('TC-C05 / AC-04: an unrecognized legacy backup blocks migration before any writes', function (testContext) {
  const item = fixture(testContext);
  seedLegacy(item);
  write(item.project, backupPath, 'Preserve this existing backup\n');
  const result = rejectsWithoutWrites(item, ['update']);
  assert.match(result.stderr, /backup|pre-codex/i);
});

test('TC-C06 / AC-04: a linked backup cannot redirect migration outside the receiving project', function (testContext) {
  const item = fixture(testContext);
  seedLegacy(item);
  const outside = path.join(item.temporaryRoot, 'outside');
  fs.mkdirSync(outside);
  junction(outside, path.join(item.project, backupPath));
  rejectsWithoutWrites(item, ['update']);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('TC-C07 / AC-04: a linked .codex parent is rejected before initialization writes', function (testContext) {
  const item = fixture(testContext);
  const outside = path.join(item.temporaryRoot, 'outside');
  fs.mkdirSync(outside);
  junction(outside, path.join(item.project, '.codex'));
  rejectsWithoutWrites(item);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('TC-C08 / AC-04: a linked .codex/agents directory is rejected without changing other Codex files', function (testContext) {
  const item = fixture(testContext);
  write(item.project, '.codex/config.toml', '# Existing settings\n');
  const outside = path.join(item.temporaryRoot, 'outside');
  fs.mkdirSync(outside);
  junction(outside, path.join(item.project, '.codex/agents'));
  rejectsWithoutWrites(item);
  assert.deepEqual(fs.readdirSync(outside), []);
});

test('TC-C09 / AC-04: a mixed legacy/current state layout is rejected without guessing a migration', function (testContext) {
  const item = fixture(testContext);
  const state = JSON.parse(seedLegacy(item));
  const entry = state.files.find(function (entry) { return entry.sourcePath === 'agents/backend.md'; });
  entry.sourcePath = '.codex/agents/backend.toml';
  entry.destinationPath = entry.sourcePath;
  write(item.project, statePath, JSON.stringify(state));
  rejectsWithoutWrites(item, ['update']);
});

test('TC-C10 / AC-03,AC-04: an identical saved legacy snapshot can be reused on a migration retry', function (testContext) {
  const item = fixture(testContext);
  const originalState = seedLegacy(item);
  write(item.project, backupPath, originalState);
  const result = run(item, ['update']);
  assert.equal(result.status, 2, result.stderr + result.stdout);
  assert.equal(read(item.project, backupPath), originalState);
  assert.ok(JSON.parse(read(item.project, statePath)).files.some(function (entry) { return entry.sourcePath === '.codex/agents/backend.toml'; }));
});

test('TC-C11 / AC-03: pending legacy role history and its review artifact survive the layout migration', function (testContext) {
  const item = fixture(testContext);
  const state = JSON.parse(seedLegacy(item));
  const entry = state.files.find(function (entry) { return entry.sourcePath === 'agents/backend.md'; });
  entry.pending = { text: 'Pending old backend rule\n', identity: { version: '0.2.1', fingerprint: hash('Pending old backend rule\n') } };
  const bytes = JSON.stringify(state, null, 2) + '\n';
  write(item.project, statePath, bytes);
  write(item.project, '.ai-workflow-scaffold/incoming/agents/backend.md', entry.pending.text);
  const result = run(item, ['update']);
  assert.equal(result.status, 2, result.stderr + result.stdout);
  assert.equal(read(item.project, backupPath), bytes);
  assert.equal(read(item.project, '.ai-workflow-scaffold/incoming/agents/backend.md'), entry.pending.text);
});

test('TC-C12 / AC-04: a file obstructing .codex is rejected before initialization writes', function (testContext) {
  const item = fixture(testContext);
  write(item.project, '.codex', 'Do not replace this file\n');
  rejectsWithoutWrites(item);
});
