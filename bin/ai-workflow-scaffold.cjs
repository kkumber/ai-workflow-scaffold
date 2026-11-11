#!/usr/bin/env node

const path = require('node:path');
const { reusableFiles } = require('../lib/scaffold-files.cjs');
const { runScaffold } = require('../lib/scaffold-updates.cjs');

function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.length === 1 && argumentsList[0] === '--help') {
    console.log('Usage: ai-workflow-scaffold [update | resolve <source-path> | --help]\n\nWithout arguments: initialize tracking or update existing managed guidance.\nupdate: update tracked documents, preserving local customizations through clean merges.\nresolve <source-path>: acknowledge a manually reviewed pending upstream document without replacing local content.\nExisting customized files are preserved at initialization. Conflicts are staged for manual review, never overwritten.');
    return;
  }
  let command = 'default';
  let sourcePath = null;
  if (argumentsList.length === 1 && argumentsList[0] === 'update') {
    command = 'update';
  } else if (argumentsList.length === 2 && argumentsList[0] === 'resolve' && reusableFiles.includes(argumentsList[1])) {
    command = 'resolve';
    sourcePath = argumentsList[1];
  } else if (argumentsList.length > 0) {
    throw new Error('Unsupported arguments: ' + argumentsList.join(' ') + '. Usage: ai-workflow-scaffold [update | resolve <source-path> | --help]');
  }
  process.exitCode = runScaffold(path.resolve(__dirname, '..'), process.cwd(), command, sourcePath);
}

try {
  main();
} catch (error) {
  console.error('Setup failed: ' + error.message);
  process.exitCode = 1;
}
