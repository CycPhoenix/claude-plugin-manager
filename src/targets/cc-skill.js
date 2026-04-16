'use strict';

const fs = require('fs');
const path = require('path');
const { getCoworkPluginsDir } = require('../utils/paths');
const { ensureDir } = require('../utils/fs');

function getInstallPath(author, name, version) {
  return path.join(getCoworkPluginsDir(), author || 'community', name, version);
}

async function install(manifest, files) {
  const skillFile = manifest.targets['cc-skill'].file;
  if (!files[skillFile]) throw new Error(`${skillFile} not found in plugin files`);

  const author = manifest.author || 'community';
  const installPath = getInstallPath(author, manifest.name, manifest.version);
  await ensureDir(installPath);

  await fs.promises.writeFile(path.join(installPath, skillFile), files[skillFile]);
  if (files['manifest.json']) {
    await fs.promises.writeFile(path.join(installPath, 'manifest.json'), files['manifest.json']);
  }

  return { success: true, installedPath: installPath };
}

async function uninstall(manifest) {
  const author = manifest.author || 'community';
  const installPath = getInstallPath(author, manifest.name, manifest.version);
  await fs.promises.rm(installPath, { recursive: true, force: true });
}

module.exports = { install, uninstall, getInstallPath };
