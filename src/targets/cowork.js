'use strict';

const fs = require('fs');
const path = require('path');
const { getCoworkPluginsDir } = require('../utils/paths');
const { ensureDir } = require('../utils/fs');

function getInstallPath(author, name, version) {
  return path.join(getCoworkPluginsDir(), author || 'community', name, version);
}

async function install(manifest, files) {
  const declaredFiles = manifest.targets.cowork.files;
  for (const filename of declaredFiles) {
    if (!files[filename]) throw new Error(`${filename} not found`);
  }

  const author = manifest.author || 'community';
  const installPath = getInstallPath(author, manifest.name, manifest.version);
  await ensureDir(installPath);

  for (const filename of declaredFiles) {
    await fs.promises.writeFile(path.join(installPath, filename), files[filename]);
  }

  return { success: true, installedPath: installPath };
}

async function uninstall(manifest) {
  const author = manifest.author || 'community';
  const installPath = getInstallPath(author, manifest.name, manifest.version);
  await fs.promises.rm(installPath, { recursive: true, force: true });
}

module.exports = { install, uninstall, getInstallPath };
