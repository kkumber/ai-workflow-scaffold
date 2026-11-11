const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { reusableFiles, legacyRoleMappings, legacyReusableFiles, checkPath, readDocument, inspectProject, assertUnchanged } = require('./scaffold-files.cjs');

const metadataDirectory = '.ai-workflow-scaffold';
const statePath = metadataDirectory + '/state.json';
const lockPath = metadataDirectory + '/update.lock';
const incomingDirectory = metadataDirectory + '/incoming';
const legacyBackupPath = metadataDirectory + '/pre-codex-agents-state.json';

function normalized(text) {
  return text.replace(/\r\n/g, '\n');
}

function hash(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

function identityFor(version, text) {
  return { version: version, fingerprint: hash(normalized(text)) };
}

function sameText(first, second) {
  if (first === null || second === null) {
    return first === second;
  }
  return normalized(first) === normalized(second);
}

function recordWithKeys(value, keys) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  return JSON.stringify(Object.keys(value).sort()) === JSON.stringify([...keys].sort());
}

function validIdentity(identity) {
  return recordWithKeys(identity, ['version', 'fingerprint']) &&
    typeof identity.version === 'string' && /^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(identity.version) &&
    typeof identity.fingerprint === 'string' && /^[a-f0-9]{64}$/.test(identity.fingerprint);
}

function validateTextIdentity(text, identity, description) {
  if (typeof text !== 'string' || !validIdentity(identity) || identity.fingerprint !== hash(normalized(text))) {
    throw new Error('Invalid tracking state ' + description + ' content or fingerprint.');
  }
}

function validateState(state) {
  if (!recordWithKeys(state, ['schemaVersion', 'package', 'files']) || state.schemaVersion !== 1) {
    throw new Error('Invalid or unsupported tracking state schema.');
  }
  if (!validIdentity(state.package) || !Array.isArray(state.files) || state.files.length !== reusableFiles.length) {
    throw new Error('Invalid tracking state package identity or file entries.');
  }
  const legacyLayout = state.files.some(function usesLegacyRole(entry) {
    return entry !== null && typeof entry === 'object' && legacyRoleMappings.some(function matches(mapping) { return mapping.oldPath === entry.sourcePath; });
  });
  let allowedFiles = reusableFiles;
  if (legacyLayout) {
    allowedFiles = legacyReusableFiles;
  }
  const seenSources = new Set();
  for (const entry of state.files) {
    if (!recordWithKeys(entry, ['sourcePath', 'destinationPath', 'upstreamText', 'upstreamIdentity', 'pending']) ||
        !allowedFiles.includes(entry.sourcePath) || seenSources.has(entry.sourcePath)) {
      throw new Error('Invalid tracking state source entry or duplicate path.');
    }
    seenSources.add(entry.sourcePath);
    let destinationValid = entry.destinationPath === entry.sourcePath;
    if (entry.sourcePath === 'README.md') {
      destinationValid = typeof entry.destinationPath === 'string' && entry.destinationPath.toLowerCase() === 'readme.md';
    }
    if (!destinationValid) {
      throw new Error('Invalid tracking state destination path: ' + entry.sourcePath);
    }
    if (entry.upstreamText === null) {
      if (entry.upstreamIdentity !== null) {
        throw new Error('Invalid tracking state unknown baseline identity: ' + entry.sourcePath);
      }
    } else {
      validateTextIdentity(entry.upstreamText, entry.upstreamIdentity, 'baseline for ' + entry.sourcePath);
    }
    if (entry.pending !== null) {
      if (!recordWithKeys(entry.pending, ['text', 'identity'])) {
        throw new Error('Invalid tracking state pending record: ' + entry.sourcePath);
      }
      validateTextIdentity(entry.pending.text, entry.pending.identity, 'pending record for ' + entry.sourcePath);
    }
  }
  return legacyLayout;
}

function loadState(projectRoot) {
  const text = readDocument(projectRoot, statePath);
  if (text === null) {
    return { state: null, text: null, legacyLayout: false };
  }
  let state;
  try {
    state = JSON.parse(text);
  } catch (error) {
    throw new Error('Invalid tracking state JSON. Preserve the file and recover it from a trusted project revision.');
  }
  const legacyLayout = validateState(state);
  return { state: state, text: text, legacyLayout: legacyLayout };
}

function readPackage(scaffoldRoot) {
  const manifestText = readDocument(scaffoldRoot, 'package.json');
  if (manifestText === null) {
    throw new Error('Missing packaged manifest.');
  }
  const manifest = JSON.parse(manifestText);
  const documents = new Map();
  for (const sourcePath of reusableFiles) {
    const text = readDocument(scaffoldRoot, sourcePath);
    if (text === null) {
      throw new Error('Missing packaged document: ' + sourcePath);
    }
    documents.set(sourcePath, text);
  }
  const tuples = [...documents.entries()].sort(function byPath(first, second) {
    if (first[0] < second[0]) {
      return -1;
    }
    if (first[0] > second[0]) {
      return 1;
    }
    return 0;
  }).map(function normalizeTuple(entry) { return [entry[0], normalized(entry[1])]; });
  const identity = { version: manifest.version, fingerprint: hash(JSON.stringify(tuples)) };
  if (!validIdentity(identity)) {
    throw new Error('Invalid packaged version or content fingerprint.');
  }
  return { identity: identity, documents: documents };
}

function inspectMetadata(projectRoot) {
  checkPath(projectRoot, metadataDirectory, 'directory');
  checkPath(projectRoot, statePath, 'file');
  checkPath(projectRoot, lockPath, 'file');
  checkPath(projectRoot, legacyBackupPath, 'file');
  checkPath(projectRoot, incomingDirectory, 'directory');
  for (const sourcePath of reusableFiles) {
    checkPath(projectRoot, incomingDirectory + '/' + sourcePath, 'file');
  }
}

function withLock(projectRoot, action) {
  checkPath(projectRoot, metadataDirectory, 'directory');
  fs.mkdirSync(path.join(projectRoot, metadataDirectory), { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(path.join(projectRoot, lockPath), 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error('Update lock already exists: ' + lockPath + '. Confirm no setup/update is running, then manually remove the lock to recover.');
    }
    throw error;
  }
  try {
    fs.writeFileSync(descriptor, String(process.pid) + '\n');
    return action();
  } finally {
    fs.closeSync(descriptor);
    fs.unlinkSync(path.join(projectRoot, lockPath));
  }
}

function withLocalNewlines(text, localText) {
  if (localText === null) {
    return text;
  }
  const newline = localText.match(/\r?\n/);
  const result = normalized(text);
  if (newline !== null && newline[0] === '\r\n') {
    return result.replace(/\n/g, '\r\n');
  }
  return result;
}

function mergeText(localText, baselineText, incomingText) {
  const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffold-merge-'));
  try {
    const localPath = path.join(temporaryRoot, 'local.md');
    const baselinePath = path.join(temporaryRoot, 'baseline.md');
    const incomingPath = path.join(temporaryRoot, 'incoming.md');
    fs.writeFileSync(localPath, normalized(localText));
    fs.writeFileSync(baselinePath, normalized(baselineText));
    fs.writeFileSync(incomingPath, normalized(incomingText));
    // Git computes the merge in temporary files; conflicts never reach project documents.
    const result = spawnSync('git', ['merge-file', '--stdout', '--', localPath, baselinePath, incomingPath], {
      cwd: temporaryRoot,
      encoding: 'utf8',
      timeout: 15000,
      maxBuffer: 8 * 1024 * 1024,
      windowsHide: true,
    });
    if (result.error || result.status === null || result.status > 127 || result.status < 0) {
      let detail = result.stderr;
      if (result.error) {
        detail = result.error.message;
      }
      throw new Error('Git merge-file could not run safely. Install or repair Git before updating. ' + (detail || 'Unexpected merge tool failure.'));
    }
    if (result.status !== 0) {
      return null;
    }
    return withLocalNewlines(result.stdout, localText);
  } finally {
    // Only this freshly created temporary merge directory is removed.
    if (path.dirname(temporaryRoot) !== path.resolve(os.tmpdir()) || !path.basename(temporaryRoot).startsWith('scaffold-merge-')) {
      throw new Error('Unexpected merge temporary directory; cleanup refused.');
    }
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function acceptedEntry(entry, text, packageIdentity) {
  return {
    sourcePath: entry.sourcePath,
    destinationPath: entry.destinationPath,
    upstreamText: text,
    upstreamIdentity: identityFor(packageIdentity.version, text),
    pending: null,
  };
}

function planInitialization(projectRoot, readmeName, upstream) {
  const operations = [];
  const entries = [];
  for (const sourcePath of reusableFiles) {
    let destinationPath = sourcePath;
    if (sourcePath === 'README.md' && readmeName !== null) {
      destinationPath = readmeName;
    }
    const localText = readDocument(projectRoot, destinationPath);
    const incomingText = upstream.documents.get(sourcePath);
    let upstreamText = null;
    let upstreamIdentity = null;
    let status = 'Preserved';
    if (localText === null || sameText(localText, incomingText)) {
      upstreamText = incomingText;
      upstreamIdentity = identityFor(upstream.identity.version, incomingText);
    }
    let replacement = null;
    if (localText === null) {
      replacement = incomingText;
      status = 'Created';
    }
    entries.push({ sourcePath: sourcePath, destinationPath: destinationPath, upstreamText: upstreamText, upstreamIdentity: upstreamIdentity, pending: null });
    operations.push({ path: destinationPath, before: localText, after: replacement, status: status });
  }
  return { state: { schemaVersion: 1, package: upstream.identity, files: entries }, operations: operations, conflicts: 0 };
}

function stageConflict(projectRoot, entry, incomingText, packageIdentity, operations) {
  const artifactPath = incomingDirectory + '/' + entry.sourcePath;
  const existingArtifact = readDocument(projectRoot, artifactPath);
  if (existingArtifact !== null) {
    let recognizedText = entry.upstreamText;
    if (entry.pending !== null) {
      recognizedText = entry.pending.text;
    }
    if (existingArtifact !== recognizedText) {
      throw new Error('Incoming artifact was edited or is unrecognized: ' + artifactPath + '. Preserve it elsewhere and restore the recorded upstream artifact before retrying.');
    }
  }
  let replacement = null;
  if (existingArtifact !== incomingText) {
    replacement = incomingText;
  }
  operations.push({ path: artifactPath, before: existingArtifact, after: replacement, status: 'Incoming' });
  return {
    sourcePath: entry.sourcePath,
    destinationPath: entry.destinationPath,
    upstreamText: entry.upstreamText,
    upstreamIdentity: entry.upstreamIdentity,
    pending: { text: incomingText, identity: identityFor(packageIdentity.version, incomingText) },
  };
}

function planUpdates(projectRoot, readmeName, state, upstream) {
  const operations = [];
  const entries = [];
  let conflictCount = 0;
  for (const savedEntry of state.files) {
    const entry = { ...savedEntry };
    if (entry.sourcePath === 'README.md' && readmeName !== null) {
      entry.destinationPath = readmeName;
    }
    const localText = readDocument(projectRoot, entry.destinationPath);
    const incomingText = upstream.documents.get(entry.sourcePath);
    let replacement = null;
    let status = 'Preserved';
    let updatedEntry = entry;
    let needsReview = false;
    if (entry.upstreamText === null) {
      needsReview = true;
    } else if (sameText(incomingText, entry.upstreamText)) {
      // Keep local customizations and intentional deletions when upstream has not changed.
      if (entry.pending !== null) {
        // Selecting an older revision does not acknowledge a newer staged conflict.
        status = 'Conflict';
        conflictCount += 1;
      }
    } else if (sameText(localText, incomingText)) {
      updatedEntry = acceptedEntry(entry, incomingText, upstream.identity);
    } else if (sameText(localText, entry.upstreamText)) {
      replacement = withLocalNewlines(incomingText, localText);
      status = 'Updated';
      updatedEntry = acceptedEntry(entry, incomingText, upstream.identity);
    } else if (localText === null) {
      needsReview = true;
    } else {
      replacement = mergeText(localText, entry.upstreamText, incomingText);
      if (replacement === null) {
        needsReview = true;
      } else {
        status = 'Merged';
        updatedEntry = acceptedEntry(entry, incomingText, upstream.identity);
      }
    }
    if (needsReview) {
      updatedEntry = stageConflict(projectRoot, entry, incomingText, upstream.identity, operations);
      status = 'Conflict';
      conflictCount += 1;
    }
    entries.push(updatedEntry);
    operations.push({ path: entry.destinationPath, before: localText, after: replacement, status: status, sourcePath: entry.sourcePath });
  }
  return { state: { schemaVersion: 1, package: upstream.identity, files: entries }, operations: operations, conflicts: conflictCount };
}

function planLegacyMigration(projectRoot, readmeName, previous, upstream) {
  const backupText = readDocument(projectRoot, legacyBackupPath);
  if (backupText !== null && backupText !== previous.text) {
    throw new Error('Legacy migration backup differs: ' + legacyBackupPath + '. Preserve and review the existing backup before retrying; no files were replaced.');
  }
  const entries = previous.state.files.map(function migrateEntry(entry) {
    const mapping = legacyRoleMappings.find(function matches(candidate) { return candidate.oldPath === entry.sourcePath; });
    if (!mapping) {
      return entry;
    }
    // Customized Markdown is not safely convertible by a text merge into a new TOML wrapper.
    // Keep legacy files untouched and retain their exact accepted/pending state in the backup.
    return { sourcePath: mapping.newPath, destinationPath: mapping.newPath, upstreamText: null, upstreamIdentity: null, pending: null };
  });
  const migratedState = { schemaVersion: 1, package: previous.state.package, files: entries };
  const plan = planUpdates(projectRoot, readmeName, migratedState, upstream);
  let backupReplacement = null;
  if (backupText === null) {
    backupReplacement = previous.text;
  }
  plan.operations.unshift({ path: legacyBackupPath, before: backupText, after: backupReplacement, status: 'Legacy state backup' });
  for (const operation of plan.operations) {
    const mapping = legacyRoleMappings.find(function matches(candidate) { return candidate.newPath === operation.sourcePath; });
    if (mapping) {
      operation.legacySourcePath = mapping.oldPath;
    }
  }
  return plan;
}

function planResolution(projectRoot, readmeName, state, sourcePath) {
  const entries = [];
  const operations = [];
  const selected = state.files.find(function matches(entry) { return entry.sourcePath === sourcePath; });
  if (selected.pending === null) {
    throw new Error('No pending conflict to resolve for ' + sourcePath + '.');
  }
  const artifactPath = incomingDirectory + '/' + sourcePath;
  const artifactText = readDocument(projectRoot, artifactPath);
  if (artifactText !== selected.pending.text) {
    throw new Error('Pending incoming artifact is missing or edited: ' + artifactPath + '. Restore the recorded upstream text before resolving.');
  }
  operations.push({ path: artifactPath, before: artifactText, after: null, status: 'Reviewed' });
  for (const savedEntry of state.files) {
    const entry = { ...savedEntry };
    if (entry.sourcePath === 'README.md' && readmeName !== null) {
      entry.destinationPath = readmeName;
    }
    if (entry.sourcePath === sourcePath) {
      entries.push({
        sourcePath: entry.sourcePath,
        destinationPath: entry.destinationPath,
        upstreamText: entry.pending.text,
        upstreamIdentity: entry.pending.identity,
        pending: null,
      });
      operations.push({ path: entry.destinationPath, before: readDocument(projectRoot, entry.destinationPath), after: null, status: 'Resolved' });
    } else {
      entries.push(entry);
    }
  }
  return { state: { schemaVersion: 1, package: state.package, files: entries }, operations: operations, conflicts: 0 };
}

function replaceFileAtomically(projectRoot, relativePath, expectedText, replacement, mode) {
  assertUnchanged(projectRoot, relativePath, expectedText);
  const targetPath = path.join(projectRoot, relativePath);
  const temporaryPath = path.join(path.dirname(targetPath), '.scaffold-' + crypto.randomUUID() + '.tmp');
  let descriptor = null;
  let ownsTemporaryFile = false;
  try {
    // Finish writing beside the destination before replacing it. A failed write leaves the original intact.
    descriptor = fs.openSync(temporaryPath, 'wx', mode);
    ownsTemporaryFile = true;
    fs.writeFileSync(descriptor, replacement);
    fs.closeSync(descriptor);
    descriptor = null;
    assertUnchanged(projectRoot, relativePath, expectedText);
    fs.renameSync(temporaryPath, targetPath);
  } finally {
    if (descriptor !== null) {
      fs.closeSync(descriptor);
    }
    if (ownsTemporaryFile && fs.existsSync(temporaryPath)) {
      fs.unlinkSync(temporaryPath);
    }
  }
}

function writeOperation(projectRoot, operation) {
  assertUnchanged(projectRoot, operation.path, operation.before);
  if (operation.after === null) {
    return;
  }
  const targetPath = path.join(projectRoot, operation.path);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  if (operation.before === null) {
    // Exclusive creation preserves any file that appeared after planning instead of overwriting it.
    fs.writeFileSync(targetPath, operation.after, { flag: 'wx' });
  } else {
    const information = checkPath(projectRoot, operation.path, 'file');
    replaceFileAtomically(projectRoot, operation.path, operation.before, operation.after, information.mode & 0o777);
  }
}

function saveState(projectRoot, previous, state) {
  if (previous.state !== null && JSON.stringify(previous.state) === JSON.stringify(state)) {
    return;
  }
  replaceFileAtomically(projectRoot, statePath, previous.text, JSON.stringify(state, null, 2) + '\n', 0o600);
}

function applyPlan(projectRoot, previous, plan) {
  // Catch changes to any planned document/artifact before beginning a run's writes.
  assertUnchanged(projectRoot, statePath, previous.text);
  for (const operation of plan.operations) {
    assertUnchanged(projectRoot, operation.path, operation.before);
  }
  for (const operation of plan.operations) {
    writeOperation(projectRoot, operation);
  }
  saveState(projectRoot, previous, plan.state);
  for (const operation of plan.operations) {
    if (operation.status === 'Conflict') {
      let legacyHint = '';
      if (operation.legacySourcePath) {
        legacyHint = ' Preserve and merge relevant instructions from ' + operation.legacySourcePath + ' into the new Codex TOML file.';
      }
      console.log('Conflict: ' + operation.path + '.' + legacyHint + ' Review ' + incomingDirectory + '/' + operation.sourcePath + ', merge manually, then run ai-workflow-scaffold resolve ' + operation.sourcePath);
    } else if (operation.status === 'Preserved') {
      console.log('Preserved: ' + operation.path + ' (existing project guidance; merge manually when needed)');
    } else {
      console.log(operation.status + ': ' + operation.path);
    }
  }
  if (plan.conflicts > 0) {
    return 2;
  }
  return 0;
}

function runScaffold(scaffoldRoot, projectRoot, command, sourcePath) {
  inspectProject(projectRoot);
  inspectMetadata(projectRoot);
  const initial = loadState(projectRoot);
  if (command !== 'default' && initial.state === null) {
    throw new Error('No managed-update tracking state found. Run ai-workflow-scaffold once without arguments to initialize tracking while preserving existing files.');
  }
  if (command === 'resolve' && initial.legacyLayout) {
    throw new Error('Legacy Markdown role layout needs migration first. Run ai-workflow-scaffold update, review the staged Codex TOML roles, then resolve their new canonical paths.');
  }
  const upstream = readPackage(scaffoldRoot);
  return withLock(projectRoot, function performManagedOperation() {
    const readmeName = inspectProject(projectRoot);
    inspectMetadata(projectRoot);
    const previous = loadState(projectRoot);
    if (previous.text !== initial.text) {
      throw new Error('Tracking state changed before the update lock was acquired. Review and rerun.');
    }
    let plan;
    if (command === 'resolve') {
      plan = planResolution(projectRoot, readmeName, previous.state, sourcePath);
    } else if (previous.state === null) {
      plan = planInitialization(projectRoot, readmeName, upstream);
    } else if (previous.legacyLayout) {
      plan = planLegacyMigration(projectRoot, readmeName, previous, upstream);
    } else {
      plan = planUpdates(projectRoot, readmeName, previous.state, upstream);
    }
    const status = applyPlan(projectRoot, previous, plan);
    console.log('\nKeep .ai-workflow-scaffold/state.json with the project guidance. Follow AGENTS.md first-use setup to adapt the README and workflow to this project.');
    return status;
  });
}

module.exports = { runScaffold: runScaffold };
