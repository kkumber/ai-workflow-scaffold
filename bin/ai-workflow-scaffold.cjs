#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

const scaffoldRoot = path.resolve(__dirname, '..');
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
const managedDirectories = ['agents', 'tasks', 'tasks/_template'];

function inspectPath(filePath) {
  try {
    // lstat detects links themselves, including Windows junctions, instead of following them.
    return fs.lstatSync(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function checkDirectory(projectRoot, relativePath) {
  const information = inspectPath(path.join(projectRoot, relativePath));
  if (information === null) {
    return;
  }
  if (information.isSymbolicLink() || !information.isDirectory()) {
    throw new Error('Conflicting directory: ' + relativePath + '. Expected an ordinary directory, not a file or link.');
  }
}

function checkDocument(projectRoot, relativePath) {
  const information = inspectPath(path.join(projectRoot, relativePath));
  if (information === null) {
    return false;
  }
  if (information.isSymbolicLink() || !information.isFile()) {
    throw new Error('Conflicting document: ' + relativePath + '. Expected an ordinary file, not a directory or link.');
  }
  return true;
}

function prepareCopies(projectRoot) {
  // Validate all known conflicts before making directories or copying any documents.
  for (const relativePath of managedDirectories) {
    checkDirectory(projectRoot, relativePath);
  }

  const readmeNames = fs.readdirSync(projectRoot).filter(function isRootReadme(name) {
    return name.toLowerCase() === 'readme.md';
  });
  for (const readmeName of readmeNames) {
    checkDocument(projectRoot, readmeName);
  }

  const copies = [];
  for (const relativePath of reusableFiles) {
    const sourcePath = path.join(scaffoldRoot, relativePath);
    const sourceInformation = inspectPath(sourcePath);
    if (sourceInformation === null || sourceInformation.isSymbolicLink() || !sourceInformation.isFile()) {
      throw new Error('Missing or invalid packaged document: ' + relativePath);
    }

    let preservedPaths = [];
    if (relativePath === 'README.md' && readmeNames.length > 0) {
      // Avoid duplicate root READMEs on case-sensitive filesystems as well as Windows.
      preservedPaths = readmeNames;
    } else if (checkDocument(projectRoot, relativePath)) {
      preservedPaths = [relativePath];
    }
    copies.push({ relativePath: relativePath, sourcePath: sourcePath, preservedPaths: preservedPaths });
  }
  return copies;
}

function copyScaffold(projectRoot) {
  const copies = prepareCopies(projectRoot);
  for (const copy of copies) {
    if (copy.preservedPaths.length > 0) {
      for (const preservedPath of copy.preservedPaths) {
        console.log('Preserved: ' + preservedPath + ' (review and merge scaffold guidance as needed)');
      }
      continue;
    }

    const destinationPath = path.join(projectRoot, copy.relativePath);
    fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
    try {
      // Exclusive copying also prevents overwrites if a destination appears after preflight.
      fs.copyFileSync(copy.sourcePath, destinationPath, fs.constants.COPYFILE_EXCL);
      console.log('Created: ' + copy.relativePath);
    } catch (error) {
      if (error.code === 'EEXIST' && checkDocument(projectRoot, copy.relativePath)) {
        console.log('Preserved: ' + copy.relativePath + ' (appeared during setup; review and merge as needed)');
      } else {
        throw error;
      }
    }
  }
  console.log('\nNext: merge preserved guidance, then follow AGENTS.md first-use setup to adapt the README and workflow to this project.');
}

function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.length === 1 && argumentsList[0] === '--help') {
    console.log('Usage: ai-workflow-scaffold [--help]\n\nCopy reusable Markdown guidance into the current directory.\nPreserve existing files and report guidance that needs merging. No files are overwritten.\nAfter copying, follow AGENTS.md to adapt the README and workflow to the project.');
    return;
  }
  if (argumentsList.length > 0) {
    throw new Error('Unsupported arguments: ' + argumentsList.join(' ') + '. Usage: ai-workflow-scaffold [--help]');
  }
  copyScaffold(process.cwd());
}

try {
  main();
} catch (error) {
  console.error('Setup failed: ' + error.message);
  process.exitCode = 1;
}
