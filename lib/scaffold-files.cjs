const fs = require('node:fs');
const path = require('node:path');

const reusableFiles = [
  'README.md',
  'AGENTS.md',
  'PROJECT.md',
  'ARCHITECTURE.md',
  '.codex/agents/backend.toml',
  '.codex/agents/frontend.toml',
  '.codex/agents/reviewer.toml',
  'tasks/README.md',
  'tasks/_template/plans.md',
  'tasks/_template/todo.md',
  'tasks/_template/done.md',
];
const managedDirectories = ['.codex', '.codex/agents', 'tasks', 'tasks/_template'];
const legacyRoleMappings = [
  { oldPath: 'agents/backend.md', newPath: '.codex/agents/backend.toml' },
  { oldPath: 'agents/frontend.md', newPath: '.codex/agents/frontend.toml' },
  { oldPath: 'agents/reviewer.md', newPath: '.codex/agents/reviewer.toml' },
];
// Compatibility input only: new writes always use the current Codex allowlist.
const legacyReusableFiles = reusableFiles.map(function legacyPath(sourcePath) {
  const mapping = legacyRoleMappings.find(function matches(candidate) { return candidate.newPath === sourcePath; });
  if (mapping) {
    return mapping.oldPath;
  }
  return sourcePath;
});

function inspectPath(filePath) {
  try {
    // Inspect links themselves, including Windows junctions, rather than following them.
    return fs.lstatSync(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function validateRelativePath(relativePath) {
  if (typeof relativePath !== 'string' || relativePath.length === 0) {
    throw new Error('Invalid relative path.');
  }
  const parts = relativePath.split('/');
  if (parts.some(function invalidPart(part) { return part === '' || part === '.' || part === '..'; }) || /[\\:\0]/.test(relativePath)) {
    throw new Error('Invalid relative path: ' + relativePath);
  }
}

function checkPath(projectRoot, relativePath, expectedType) {
  validateRelativePath(relativePath);
  const parts = relativePath.split('/');
  for (let index = 0; index < parts.length; index += 1) {
    const partialPath = parts.slice(0, index + 1).join('/');
    const information = inspectPath(path.join(projectRoot, partialPath));
    if (information === null) {
      return null;
    }
    if (information.isSymbolicLink()) {
      throw new Error('Conflicting path: ' + partialPath + '. Filesystem links are not supported at managed paths.');
    }
    let type = 'directory';
    if (index === parts.length - 1) {
      type = expectedType;
    }
    if ((type === 'directory' && !information.isDirectory()) || (type === 'file' && !information.isFile())) {
      throw new Error('Conflicting path: ' + partialPath + '. Expected an ordinary ' + type + '.');
    }
    if (index === parts.length - 1) {
      return information;
    }
  }
  return null;
}

function readDocument(projectRoot, relativePath) {
  if (checkPath(projectRoot, relativePath, 'file') === null) {
    return null;
  }
  const bytes = fs.readFileSync(path.join(projectRoot, relativePath));
  const text = bytes.toString('utf8');
  if (!Buffer.from(text, 'utf8').equals(bytes)) {
    throw new Error('Managed document is not valid UTF-8: ' + relativePath);
  }
  return text;
}

function discoverReadme(projectRoot) {
  const names = fs.readdirSync(projectRoot).filter(function isReadme(name) {
    return name.toLowerCase() === 'readme.md';
  });
  if (names.length > 1) {
    throw new Error('Multiple root README variants are ambiguous. Keep one README before running setup or update.');
  }
  if (names.length === 1) {
    checkPath(projectRoot, names[0], 'file');
    return names[0];
  }
  return null;
}

function inspectProject(projectRoot) {
  for (const relativePath of managedDirectories) {
    checkPath(projectRoot, relativePath, 'directory');
  }
  const readmeName = discoverReadme(projectRoot);
  for (const sourcePath of reusableFiles) {
    let destinationPath = sourcePath;
    if (sourcePath === 'README.md' && readmeName !== null) {
      destinationPath = readmeName;
    }
    checkPath(projectRoot, destinationPath, 'file');
  }
  return readmeName;
}

function assertUnchanged(projectRoot, relativePath, expectedText) {
  const currentText = readDocument(projectRoot, relativePath);
  if (currentText !== expectedText) {
    throw new Error('File changed during update planning: ' + relativePath + '. No replacement was made; review and rerun.');
  }
}

module.exports = {
  reusableFiles: reusableFiles,
  legacyRoleMappings: legacyRoleMappings,
  legacyReusableFiles: legacyReusableFiles,
  checkPath: checkPath,
  readDocument: readDocument,
  inspectProject: inspectProject,
  assertUnchanged: assertUnchanged,
};
