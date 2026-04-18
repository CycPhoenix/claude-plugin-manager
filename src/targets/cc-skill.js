'use strict';

const fs = require('fs');
const path = require('path');
const { getCoworkPluginsDir, getAgentsDir } = require('../utils/paths');
const { ensureDir } = require('../utils/fs');

function getInstallPath(author, name, version) {
  return path.join(getCoworkPluginsDir(), author || 'community', name, version);
}

function getAgentPath(name) {
  return path.join(getAgentsDir(), `${name}.md`);
}

async function install(manifest, files) {
  const skillFile = manifest.targets['cc-skill'].file;
  if (!files[skillFile]) throw new Error(`${skillFile} not found in plugin files`);

  const author = manifest.author || 'community';
  const installPath = getInstallPath(author, manifest.name, manifest.version);
  await ensureDir(installPath);

  // Write to cache (for tracking + uninstall)
  await fs.promises.writeFile(path.join(installPath, skillFile), files[skillFile]);
  if (files['manifest.json']) {
    await fs.promises.writeFile(path.join(installPath, 'manifest.json'), files['manifest.json']);
  }

  // Copy to ~/.claude/agents/<name>.md so /name works in Claude Code CLI
  await ensureDir(getAgentsDir());
  await fs.promises.writeFile(getAgentPath(manifest.name), files[skillFile]);

  return { success: true, installedPath: installPath };
}

async function uninstall(manifest) {
  const author = manifest.author || 'community';
  const installPath = getInstallPath(author, manifest.name, manifest.version);
  await fs.promises.rm(installPath, { recursive: true, force: true });

  // Remove from agents dir
  try {
    await fs.promises.unlink(getAgentPath(manifest.name));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

module.exports = { install, uninstall, getInstallPath, getAgentPath };
