'use strict';

const VALID_TARGETS = ['cc-skill', 'cc-mcp', 'cc-hook', 'cowork'];

function validateManifest(manifest) {
  for (const field of ['name', 'version', 'targets']) {
    if (!manifest[field]) throw new Error(`manifest missing required field: ${field}`);
  }
  const found = Object.keys(manifest.targets).filter(k => VALID_TARGETS.includes(k));
  if (found.length === 0) throw new Error('manifest has no valid targets');
}

function detectTargets(manifest) {
  return Object.keys(manifest.targets).filter(k => VALID_TARGETS.includes(k));
}

module.exports = { validateManifest, detectTargets };
